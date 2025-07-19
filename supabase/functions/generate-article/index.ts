import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
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
    const { topic, prompt_template, category, user_id, setting_id } = await req.json();
    
    console.log('Generating article for topic:', topic);

    // Create Supabase client with service role for admin access
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Log the generation attempt
    const { data: logEntry } = await supabase
      .from('auto_articles_log')
      .insert({
        setting_id,
        topic,
        status: 'generating'
      })
      .select()
      .single();

    // Generate article content with OpenAI
    const prompt = `${prompt_template}

Tema: ${topic}

Instrucciones:
- Escribe un artículo completo y detallado sobre tecnología
- Incluye una introducción atractiva
- Desarrolla el contenido en varios párrafos con encabezados H2 y H3
- Añade ejemplos prácticos y datos relevantes
- Concluye con un resumen y perspectivas futuras
- Usa un tono profesional pero accesible
- Longitud aproximada: 800-1200 palabras
- Incluye palabras clave relacionadas con el tema

Formato de respuesta (JSON):
{
  "title": "Título del artículo",
  "excerpt": "Resumen del artículo en 1-2 líneas",
  "content": "Contenido completo del artículo en HTML",
  "keywords": ["palabra1", "palabra2", "palabra3"],
  "meta_description": "Meta descripción SEO del artículo"
}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'Eres un experto redactor de contenido tecnológico. Generas artículos de alta calidad sobre tecnología, siempre en español. Responde únicamente con JSON válido.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;
    
    console.log('Generated content:', generatedContent);

    // Parse the JSON response
    let articleData;
    try {
      articleData = JSON.parse(generatedContent);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', parseError);
      throw new Error('Invalid JSON response from OpenAI');
    }

    // Generate slug from title
    const slug = articleData.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    // Calculate reading time (approximately 200 words per minute)
    const wordCount = articleData.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);

    // Create the article
    const { data: article, error: articleError } = await supabase
      .from('posts')
      .insert({
        title: articleData.title,
        slug: `${slug}-${Date.now()}`, // Add timestamp to ensure uniqueness
        excerpt: articleData.excerpt,
        content: articleData.content,
        category,
        author_id: user_id,
        published: true,
        published_at: new Date().toISOString(),
        reading_time: readingTime,
        keywords: articleData.keywords || [],
        meta_description: articleData.meta_description,
        meta_title: articleData.title,
        focus_keyword: articleData.keywords?.[0] || topic,
        tags: articleData.keywords || [],
        robots_meta: 'index,follow',
        canonical_url: `https://technews.lovable.app/${category}/${slug}`,
        og_title: articleData.title,
        og_description: articleData.excerpt,
        twitter_title: articleData.title,
        twitter_description: articleData.excerpt,
        twitter_card_type: 'summary_large_image'
      })
      .select()
      .single();

    if (articleError) {
      console.error('Error creating article:', articleError);
      throw new Error(`Failed to create article: ${articleError.message}`);
    }

    // Update log with success
    await supabase
      .from('auto_articles_log')
      .update({
        status: 'completed',
        post_id: article.id
      })
      .eq('id', logEntry.id);

    console.log('Article created successfully:', article.id);

    return new Response(JSON.stringify({ 
      success: true, 
      article,
      message: 'Article generated and published successfully'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-article function:', error);
    
    // Update log with error if we have setting_id
    try {
      const { setting_id } = await req.json();
      if (setting_id) {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        await supabase
          .from('auto_articles_log')
          .update({
            status: 'error',
            error_message: error.message
          })
          .eq('setting_id', setting_id)
          .eq('status', 'generating');
      }
    } catch (logError) {
      console.error('Error updating log:', logError);
    }

    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});