import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, PenTool, Eye, Users, TrendingUp, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardStats {
  totalPosts: number;
  publishedPosts: number;
  draftPosts: number;
  totalViews: number;
}

interface RecentPost {
  id: string;
  title: string;
  published: boolean;
  created_at: string;
  views: number;
}

const Dashboard = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalViews: 0
  });
  const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch user's posts stats
        const { data: posts, error } = await supabase
          .from('posts')
          .select('id, title, published, created_at, views')
          .eq('author_id', profile?.user_id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (posts) {
          const publishedCount = posts.filter(p => p.published).length;
          const draftCount = posts.filter(p => !p.published).length;
          const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);

          setStats({
            totalPosts: posts.length,
            publishedPosts: publishedCount,
            draftPosts: draftCount,
            totalViews
          });

          setRecentPosts(posts.slice(0, 5));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (profile?.user_id) {
      fetchDashboardData();
    }
  }, [profile?.user_id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-muted rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {getGreeting()}, {profile?.display_name || 'Usuario'}
        </h1>
        <p className="text-muted-foreground mt-1">
          Aquí tienes un resumen de tu actividad en TechNews
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Artículos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
            <p className="text-xs text-muted-foreground">
              {stats.publishedPosts} publicados, {stats.draftPosts} borradores
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publicados</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.publishedPosts}</div>
            <p className="text-xs text-muted-foreground">
              Artículos visibles al público
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visualizaciones</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalViews}</div>
            <p className="text-xs text-muted-foreground">
              En todos tus artículos
            </p>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rol</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{profile?.role || 'Editor'}</div>
            <p className="text-xs text-muted-foreground">
              Nivel de acceso
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>
            Gestiona tu contenido fácilmente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link to="/dashboard/crear">
                <PenTool className="mr-2 h-4 w-4" />
                Crear Artículo
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/dashboard/articulos">
                <FileText className="mr-2 h-4 w-4" />
                Ver Mis Artículos
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/dashboard/perfil">
                <Users className="mr-2 h-4 w-4" />
                Editar Perfil
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Posts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Artículos Recientes</span>
          </CardTitle>
          <CardDescription>
            Tus últimos 5 artículos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentPosts.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                Aún no tienes artículos
              </p>
              <Button asChild>
                <Link to="/dashboard/crear">
                  <PenTool className="mr-2 h-4 w-4" />
                  Crear tu primer artículo
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-medium line-clamp-1">{post.title}</h3>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
                      <span>{formatDate(post.created_at)}</span>
                      <span className="flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>{post.views || 0}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={post.published ? "default" : "secondary"}>
                      {post.published ? 'Publicado' : 'Borrador'}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                    >
                      <Link to={`/dashboard/articulos/${post.id}`}>
                        Ver
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;