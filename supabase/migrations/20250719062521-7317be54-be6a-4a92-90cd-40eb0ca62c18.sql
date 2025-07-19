-- Add SEO optimization fields to posts table
ALTER TABLE public.posts 
ADD COLUMN meta_title TEXT,
ADD COLUMN meta_description TEXT,
ADD COLUMN canonical_url TEXT,
ADD COLUMN keywords TEXT[],
ADD COLUMN reading_time INTEGER,
ADD COLUMN structured_data JSONB,
ADD COLUMN og_title TEXT,
ADD COLUMN og_description TEXT,
ADD COLUMN og_image TEXT,
ADD COLUMN twitter_title TEXT,
ADD COLUMN twitter_description TEXT,
ADD COLUMN twitter_image TEXT,
ADD COLUMN twitter_card_type TEXT DEFAULT 'summary_large_image',
ADD COLUMN robots_meta TEXT DEFAULT 'index,follow',
ADD COLUMN focus_keyword TEXT,
ADD COLUMN alt_text TEXT;

-- Add indexes for better SEO performance
CREATE INDEX idx_posts_slug ON public.posts(slug);
CREATE INDEX idx_posts_category ON public.posts(category);
CREATE INDEX idx_posts_published_date ON public.posts(published_at DESC) WHERE published = true;
CREATE INDEX idx_posts_keywords ON public.posts USING GIN(keywords);
CREATE INDEX idx_posts_canonical ON public.posts(canonical_url);

-- Update the updated_at trigger to work with new fields
CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON public.posts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Add constraint to ensure slug is unique
ALTER TABLE public.posts ADD CONSTRAINT unique_slug UNIQUE (slug);

-- Add constraint to ensure published posts have required SEO fields
ALTER TABLE public.posts ADD CONSTRAINT check_published_seo 
    CHECK (
        NOT published OR (
            published AND 
            title IS NOT NULL AND 
            meta_description IS NOT NULL AND 
            slug IS NOT NULL AND 
            og_title IS NOT NULL AND 
            og_description IS NOT NULL
        )
    );