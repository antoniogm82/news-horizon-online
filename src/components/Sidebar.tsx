import { useState } from 'react';
import { Mail, TrendingUp, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTrendingNews, categories } from '@/data/news';
import NewsCard from './NewsCard';

interface SidebarProps {
  onCategoryFilter: (category: string) => void;
  activeCategory: string;
}

const Sidebar = ({ onCategoryFilter, activeCategory }: SidebarProps) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const trendingNews = getTrendingNews();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <aside className="space-y-6">
      {/* Newsletter Subscription */}
      <Card className="gradient-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5 text-primary" />
            <span>Newsletter</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Recibe las últimas noticias tecnológicas directamente en tu email.
          </p>
          {isSubscribed ? (
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-green-700 dark:text-green-300">
                ¡Gracias por suscribirte! 🎉
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-3">
              <Input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" className="w-full">
                Suscribirse
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Tag className="h-5 w-5 text-primary" />
            <span>Categorías</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "ghost"}
                size="sm"
                onClick={() => onCategoryFilter(category.id)}
                className="w-full justify-start"
              >
                <div className={`w-3 h-3 rounded-full mr-2 ${category.color}`} />
                {category.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trending News */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>Más Populares</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trendingNews.map((news, index) => (
              <div key={news.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <NewsCard news={news} variant="compact" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ad Space */}
      <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg mx-auto flex items-center justify-center">
              <span className="text-2xl">📱</span>
            </div>
            <h3 className="font-semibold text-sm">Espacio Publicitario</h3>
            <p className="text-xs text-muted-foreground">
              Tu anuncio aquí
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Widget */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span>Eventos Tech</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-2 rounded-lg bg-muted/50">
              <div className="text-center">
                <div className="text-sm font-bold text-primary">24</div>
                <div className="text-xs text-muted-foreground">ENE</div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">CES 2024</p>
                <p className="text-xs text-muted-foreground">Las Vegas</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-2 rounded-lg bg-muted/50">
              <div className="text-center">
                <div className="text-sm font-bold text-primary">15</div>
                <div className="text-xs text-muted-foreground">FEB</div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">MWC 2024</p>
                <p className="text-xs text-muted-foreground">Barcelona</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-2 rounded-lg bg-muted/50">
              <div className="text-center">
                <div className="text-sm font-bold text-primary">10</div>
                <div className="text-xs text-muted-foreground">MAR</div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">SXSW 2024</p>
                <p className="text-xs text-muted-foreground">Austin</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
};

export default Sidebar;