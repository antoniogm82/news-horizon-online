import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, Clock, User, Share2, Bookmark, Twitter, Facebook, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import NewsCard from '@/components/NewsCard';
import { newsData, NewsItem, getTrendingNews } from '@/data/news';
import { useToast } from '@/hooks/use-toast';

const Article = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [article, setArticle] = useState<NewsItem | null>(null);
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    if (id) {
      const foundArticle = newsData.find(item => item.id === parseInt(id));
      if (foundArticle) {
        setArticle(foundArticle);
        // Get related news from the same category
        const related = newsData
          .filter(item => item.category === foundArticle.category && item.id !== foundArticle.id)
          .slice(0, 3);
        setRelatedNews(related);
      } else {
        navigate('/404');
      }
    }
  }, [id, navigate]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryClass = (category: string) => {
    const categoryClasses = {
      smartphones: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      ai: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      gadgets: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      software: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      videojuegos: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      reviews: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    };
    return categoryClasses[category as keyof typeof categoryClasses] || 'bg-gray-100 text-gray-800';
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = article?.title || '';
    
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      default:
        navigator.clipboard.writeText(url);
        toast({
          title: "Enlace copiado",
          description: "El enlace del artículo ha sido copiado al portapapeles.",
        });
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          onSearch={() => {}} 
          onCategoryFilter={() => {}} 
          searchQuery="" 
          activeCategory="" 
        />
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="text-6xl mb-4">📰</div>
          <h1 className="text-2xl font-bold mb-4">Artículo no encontrado</h1>
          <p className="text-muted-foreground mb-6">El artículo que buscas no existe o ha sido movido.</p>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onSearch={() => {}} 
        onCategoryFilter={() => {}} 
        searchQuery="" 
        activeCategory="" 
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a noticias
          </Button>

          {/* Article header */}
          <article className="space-y-6">
            <div className="space-y-4">
              <Badge className={getCategoryClass(article.category)}>
                {article.category.charAt(0).toUpperCase() + article.category.slice(1)}
              </Badge>
              
              <h1 className="text-4xl md:text-5xl font-bold text-balance leading-tight">
                {article.title}
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                {article.excerpt}
              </p>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{article.author}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{article.readTime}</span>
                </div>
                <span>{formatDate(article.date)}</span>
              </div>
            </div>

            {/* Featured image */}
            <div className="relative">
              <img 
                src={article.image} 
                alt={article.title}
                className="w-full h-64 md:h-96 object-cover rounded-xl"
              />
            </div>

            {/* Social sharing */}
            <div className="flex items-center justify-between border-y border-border py-4">
              <div className="flex items-center space-x-2">
                <Share2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Compartir:</span>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={() => handleShare('twitter')}>
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleShare('facebook')}>
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleShare('linkedin')}>
                  <Linkedin className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleShare('copy')}>
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => toast({ title: "Guardado", description: "Artículo guardado en favoritos" })}>
                  <Bookmark className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Article content */}
            <div className="prose prose-lg max-w-none dark:prose-invert">
              <div 
                dangerouslySetInnerHTML={{ __html: article.content }} 
                className="leading-relaxed space-y-4"
              />
            </div>
          </article>

          {/* Related articles */}
          {relatedNews.length > 0 && (
            <section className="mt-16">
              <h2 className="text-2xl font-bold mb-6">Artículos relacionados</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedNews.map((news) => (
                  <NewsCard key={news.id} news={news} variant="compact" />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Article;