import { Clock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { NewsItem } from '@/types/news';

interface NewsCardProps {
  news: NewsItem;
  featured?: boolean;
  variant?: 'default' | 'compact' | 'hero';
}

const NewsCard = ({ news, featured = false, variant = 'default' }: NewsCardProps) => {
  const navigate = useNavigate();
  const [authorName, setAuthorName] = useState<string>('Autor');

  useEffect(() => {
    const fetchAuthor = async () => {
      if (news.author_id) {
        const { data } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('user_id', news.author_id)
          .single();
        
        if (data?.display_name) {
          setAuthorName(data.display_name);
        }
      }
    };
    
    fetchAuthor();
  }, [news.author_id]);
  const getCategoryClass = (category: string) => {
    const categoryClasses = {
      smartphones: 'category-smartphones',
      ai: 'category-ai',
      gadgets: 'category-gadgets',
      software: 'category-software',
      videojuegos: 'category-videojuegos',
      reviews: 'category-smartphones',
    };
    return categoryClasses[category as keyof typeof categoryClasses] || 'category-smartphones';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (variant === 'hero') {
    return (
      <div 
        className="relative h-96 md:h-[500px] overflow-hidden rounded-xl group cursor-pointer"
        onClick={() => navigate(`/${news.category}/${news.slug}`)}
      >
        <img 
          src={news.image_url || '/placeholder.svg'} 
          alt={news.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
          width="800"
          height="500"
        />
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end text-white">
          <div className="space-y-3">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getCategoryClass(news.category)}`}>
              {news.category.charAt(0).toUpperCase() + news.category.slice(1)}
            </span>
            <h2 className="text-2xl md:text-4xl font-bold text-balance leading-tight">
              {news.title}
            </h2>
            <p className="text-lg text-gray-200 line-clamp-2">
              {news.excerpt}
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-300">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{authorName}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{news.reading_time || 5} min</span>
              </div>
              <span>{formatDate(news.created_at)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <article 
        className="flex space-x-3 hover-lift cursor-pointer"
        onClick={() => navigate(`/${news.category}/${news.slug}`)}
      >
        <img 
          src={news.image_url || '/placeholder.svg'} 
          alt={news.title}
          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
          loading="lazy"
          decoding="async"
          width="80"
          height="80"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm line-clamp-2 text-card-foreground hover:text-primary transition-colors">
            {news.title}
          </h3>
          <div className="flex items-center space-x-2 mt-2 text-xs text-muted-foreground">
            <span>{formatDate(news.created_at)}</span>
            <span>•</span>
            <span>{news.reading_time || 5} min</span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article 
      className="bg-card border border-border rounded-xl overflow-hidden hover-lift transition-all duration-300 group cursor-pointer"
      onClick={() => navigate(`/${news.category}/${news.slug}`)}
    >
      <div className="relative overflow-hidden">
        <img 
          src={news.image_url || '/placeholder.svg'} 
          alt={news.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          decoding="async"
          width="400"
          height="192"
        />
        <div className="absolute top-3 left-3">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getCategoryClass(news.category)}`}>
            {news.category.charAt(0).toUpperCase() + news.category.slice(1)}
          </span>
        </div>
        {news.featured && (
          <div className="absolute top-3 right-3">
            <span className="inline-block px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
              Destacado
            </span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="font-bold text-xl mb-2 text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
          {news.title}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
          {news.excerpt}
        </p>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1">
              <User className="h-4 w-4" />
              <span>{authorName}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{news.reading_time || 5} min</span>
            </div>
          </div>
          <span>{formatDate(news.created_at)}</span>
        </div>
      </div>
    </article>
  );
};

export default NewsCard;