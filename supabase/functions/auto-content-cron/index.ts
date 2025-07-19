import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Auto-content cron job started');

    // Create Supabase client with service role
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get all active auto content settings that should generate content
    const { data: settings, error: settingsError } = await supabase
      .from('auto_content_settings')
      .select('*')
      .eq('is_active', true);

    if (settingsError) {
      throw new Error(`Failed to fetch settings: ${settingsError.message}`);
    }

    if (!settings || settings.length === 0) {
      console.log('No active auto content settings found');
      return new Response(JSON.stringify({ 
        message: 'No active settings found',
        processed: 0 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Found ${settings.length} active settings`);

    let processed = 0;
    const results = [];

    for (const setting of settings) {
      try {
        // Check if we should generate content based on frequency
        const { data: lastLog } = await supabase
          .from('auto_articles_log')
          .select('created_at')
          .eq('setting_id', setting.id)
          .eq('status', 'completed')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        const shouldGenerate = !lastLog || 
          (new Date().getTime() - new Date(lastLog.created_at).getTime()) >= (setting.frequency_hours * 60 * 60 * 1000);

        if (!shouldGenerate) {
          console.log(`Skipping setting ${setting.id}, not time yet`);
          continue;
        }

        console.log(`Generating content for setting ${setting.id}`);

        // Call the generate-article function
        const generateResponse = await fetch(`${supabaseUrl}/functions/v1/generate-article`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            topic: setting.topic,
            prompt_template: setting.prompt_template,
            category: setting.category,
            user_id: setting.user_id,
            setting_id: setting.id
          }),
        });

        const generateResult = await generateResponse.json();
        
        if (generateResult.success) {
          processed++;
          results.push({
            setting_id: setting.id,
            topic: setting.topic,
            status: 'success',
            article_id: generateResult.article?.id
          });
          console.log(`Successfully generated article for setting ${setting.id}`);
        } else {
          results.push({
            setting_id: setting.id,
            topic: setting.topic,
            status: 'error',
            error: generateResult.error
          });
          console.error(`Failed to generate article for setting ${setting.id}:`, generateResult.error);
        }

      } catch (error) {
        console.error(`Error processing setting ${setting.id}:`, error);
        results.push({
          setting_id: setting.id,
          topic: setting.topic,
          status: 'error',
          error: error.message
        });
      }
    }

    console.log(`Cron job completed. Processed: ${processed} articles`);

    return new Response(JSON.stringify({ 
      message: `Auto-content cron job completed`,
      processed,
      total_settings: settings.length,
      results
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in auto-content-cron function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      processed: 0 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});