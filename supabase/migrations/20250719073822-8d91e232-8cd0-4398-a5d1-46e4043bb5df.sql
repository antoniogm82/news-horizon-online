-- Create table for automated content settings
CREATE TABLE public.auto_content_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  topic TEXT NOT NULL,
  prompt_template TEXT NOT NULL,
  category TEXT NOT NULL,
  frequency_hours INTEGER NOT NULL DEFAULT 24,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.auto_content_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own auto content settings" 
ON public.auto_content_settings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own auto content settings" 
ON public.auto_content_settings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own auto content settings" 
ON public.auto_content_settings 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own auto content settings" 
ON public.auto_content_settings 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_auto_content_settings_updated_at
BEFORE UPDATE ON public.auto_content_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create table for auto-generated articles log
CREATE TABLE public.auto_articles_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_id UUID NOT NULL REFERENCES public.auto_content_settings(id) ON DELETE CASCADE,
  post_id UUID REFERENCES public.posts(id) ON DELETE SET NULL,
  topic TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.auto_articles_log ENABLE ROW LEVEL SECURITY;

-- Create policies for logs (read-only for users)
CREATE POLICY "Users can view logs for their settings" 
ON public.auto_articles_log 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.auto_content_settings 
  WHERE id = auto_articles_log.setting_id 
  AND user_id = auth.uid()
));