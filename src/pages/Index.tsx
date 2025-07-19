import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import NewsCard from '@/components/NewsCard';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import CategoryFilter from '@/components/CategoryFilter';
import Pagination from '@/components/Pagination';
import { supabase } from '@/integrations/supabase/client';
import { NewsItem } from '@/types/news';

const Index = () => {
  const [filteredNews, setFilteredNews] = useState<NewsItem[]>([]);
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const newsPerPage = 9;
  const totalPages = Math.ceil(filteredNews.length / newsPerPage);
  const startIndex = (currentPage - 1) * newsPerPage;
  const currentNews = filteredNews.slice(startIndex, startIndex + newsPerPage);

  // Fetch posts from Supabase
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        setAllNews(data || []);
        setFilteredNews(data || []);
      } catch (error) {
        console.error('Error fetching posts:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los artículos",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filter posts based on category and search, excluding hero pinned posts
  useEffect(() => {
    let filtered = allNews.filter(item => !item.is_hero_pinned); // Excluir artículos fijos del hero
    
    if (searchQuery) {
      filtered = allNews.filter(item => 
        (item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.excerpt && item.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())) &&
        !item.is_hero_pinned // También excluir del search
      );
    } else if (activeCategory !== 'all') {
      filtered = allNews.filter(item => 
        item.category === activeCategory && !item.is_hero_pinned
      );
    }
    
    setFilteredNews(filtered);
    setCurrentPage(1);
  }, [activeCategory, searchQuery, allNews]);

  const handleCategoryFilter = (category: string) => {
    setActiveCategory(category);
    setSearchQuery('');
    
    if (category !== 'all') {
      toast({
        title: "Filtro aplicado",
        description: `Mostrando noticias de ${category}`,
      });
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setActiveCategory('all');
    
    if (query) {
      toast({
        title: "Búsqueda realizada",
        description: `Buscando "${query}"`,
      });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        onSearch={handleSearch}
        onCategoryFilter={handleCategoryFilter}
        searchQuery={searchQuery}
        activeCategory={activeCategory}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Hero Section */}
            <Hero />
            
            {/* Category Filter */}
            <CategoryFilter
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryFilter}
            />
            
            {/* Search Results Info */}
            {searchQuery && (
              <div className="bg-muted/50 rounded-lg p-4 border border-border">
                <p className="text-sm text-muted-foreground">
                  Mostrando {filteredNews.length} resultado(s) para "{searchQuery}"
                </p>
              </div>
            )}
            
            {/* News Grid */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {activeCategory === 'all' 
                    ? 'Últimas Noticias' 
                    : `Noticias de ${activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}`
                  }
                </h2>
                <div className="text-sm text-muted-foreground">
                  {filteredNews.length} noticias
                </div>
              </div>
              
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="bg-muted rounded-xl h-48 mb-4"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-muted rounded"></div>
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredNews.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📰</div>
                  <h3 className="text-xl font-semibold mb-2">No se encontraron noticias</h3>
                  <p className="text-muted-foreground">
                    {searchQuery 
                      ? `No hay resultados para "${searchQuery}". Prueba con otros términos.`
                      : 'No hay noticias disponibles en esta categoría.'
                    }
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentNews.map((news, index) => (
                      <div key={news.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                        <NewsCard news={news} />
                      </div>
                    ))}
                  </div>
                  
                  {/* Pagination */}
                  {totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  )}
                </>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="w-full lg:w-80">
            <Sidebar
              onCategoryFilter={handleCategoryFilter}
              activeCategory={activeCategory}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
