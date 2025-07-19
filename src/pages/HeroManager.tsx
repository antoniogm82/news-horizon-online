import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { NewsItem } from '@/types/news';
import { useToast } from '@/hooks/use-toast';
import { Pin, PinOff } from 'lucide-react';

const HeroManager = () => {
  const [posts, setPosts] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los artículos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleHeroPin = async (postId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ is_hero_pinned: !currentStatus })
        .eq('id', postId);

      if (error) throw error;

      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, is_hero_pinned: !currentStatus }
          : post
      ));

      toast({
        title: currentStatus ? "Artículo removido del hero" : "Artículo fijado al hero",
        description: currentStatus 
          ? "El artículo ya no aparecerá en el hero" 
          : "El artículo ahora aparecerá en el hero"
      });
    } catch (error) {
      console.error('Error updating hero pin:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del artículo",
        variant: "destructive"
      });
    }
  };

  const heroPinnedPosts = posts.filter(post => post.is_hero_pinned);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-muted rounded-lg h-24"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestionar Hero</h1>
        <p className="text-muted-foreground">
          Selecciona qué artículos aparecerán fijos en el hero de la página principal
        </p>
      </div>

      {heroPinnedPosts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pin className="h-5 w-5" />
              Artículos Fijados al Hero ({heroPinnedPosts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {heroPinnedPosts.map(post => (
              <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg bg-primary/5">
                <div className="flex items-center space-x-4">
                  <img 
                    src={post.image_url || '/placeholder.svg'} 
                    alt={post.title}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">{post.title}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline">{post.category}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleHeroPin(post.id, post.is_hero_pinned || false)}
                >
                  <PinOff className="h-4 w-4 mr-2" />
                  Quitar
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Todos los Artículos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {posts.map(post => (
            <div key={post.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <img 
                  src={post.image_url || '/placeholder.svg'} 
                  alt={post.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-semibold">{post.title}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline">{post.category}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>
                    {post.is_hero_pinned && (
                      <Badge className="bg-primary">
                        <Pin className="h-3 w-3 mr-1" />
                        Hero
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">
                    Fijar al Hero
                  </span>
                  <Switch
                    checked={post.is_hero_pinned || false}
                    onCheckedChange={() => toggleHeroPin(post.id, post.is_hero_pinned || false)}
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default HeroManager;