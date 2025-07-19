import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { supabase } from '@/integrations/supabase/client';
import { NewsItem } from '@/types/news';
import { useToast } from '@/hooks/use-toast';
import { Calendar as CalendarIcon, Clock, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const ScheduledPosts = () => {
  const [posts, setPosts] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<NewsItem | null>(null);
  const [publishDate, setPublishDate] = useState<Date>();
  const [publishTime, setPublishTime] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchScheduledPosts();
  }, []);

  const fetchScheduledPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('published', false)
        .not('published_at', 'is', null)
        .order('published_at', { ascending: true });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching scheduled posts:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los artículos programados",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const schedulePost = async (postId: string, publishDateTime: Date) => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ 
          published_at: publishDateTime.toISOString(),
          published: publishDateTime <= new Date()
        })
        .eq('id', postId);

      if (error) throw error;

      await fetchScheduledPosts();
      setSelectedPost(null);
      setPublishDate(undefined);
      setPublishTime('');

      toast({
        title: "Artículo programado",
        description: `Se publicará el ${format(publishDateTime, 'PPP', { locale: es })} a las ${format(publishDateTime, 'HH:mm')}`
      });
    } catch (error) {
      console.error('Error scheduling post:', error);
      toast({
        title: "Error",
        description: "No se pudo programar el artículo",
        variant: "destructive"
      });
    }
  };

  const unschedulePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ 
          published_at: null,
          published: false
        })
        .eq('id', postId);

      if (error) throw error;

      await fetchScheduledPosts();

      toast({
        title: "Programación cancelada",
        description: "El artículo ya no está programado para publicarse"
      });
    } catch (error) {
      console.error('Error unscheduling post:', error);
      toast({
        title: "Error",
        description: "No se pudo cancelar la programación",
        variant: "destructive"
      });
    }
  };

  const publishNow = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ 
          published: true,
          published_at: new Date().toISOString()
        })
        .eq('id', postId);

      if (error) throw error;

      await fetchScheduledPosts();

      toast({
        title: "Artículo publicado",
        description: "El artículo se ha publicado inmediatamente"
      });
    } catch (error) {
      console.error('Error publishing post:', error);
      toast({
        title: "Error",
        description: "No se pudo publicar el artículo",
        variant: "destructive"
      });
    }
  };

  const handleSchedule = () => {
    if (!selectedPost || !publishDate || !publishTime) return;

    const [hours, minutes] = publishTime.split(':').map(Number);
    const publishDateTime = new Date(publishDate);
    publishDateTime.setHours(hours, minutes, 0, 0);

    schedulePost(selectedPost.id, publishDateTime);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-muted rounded-lg h-32"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Artículos Programados</h1>
        <p className="text-muted-foreground">
          Gestiona la programación de publicación de tus artículos
        </p>
      </div>

      {posts.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No hay artículos programados</h3>
            <p className="text-muted-foreground">
              Los artículos con fecha de publicación programada aparecerán aquí
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {posts.map(post => {
            const publishDate = post.published_at ? new Date(post.published_at) : null;
            const isOverdue = publishDate && publishDate <= new Date();

            return (
              <Card key={post.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <img 
                        src={post.image_url || '/placeholder.svg'} 
                        alt={post.title}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline">{post.category}</Badge>
                          {publishDate && (
                            <div className="flex items-center space-x-1 text-sm">
                              <CalendarIcon className="h-4 w-4" />
                              <span>
                                {format(publishDate, 'PPP', { locale: es })} a las {format(publishDate, 'HH:mm')}
                              </span>
                            </div>
                          )}
                          {isOverdue && (
                            <Badge variant="destructive">Retrasado</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isOverdue && (
                        <Button
                          onClick={() => publishNow(post.id)}
                          size="sm"
                        >
                          Publicar ahora
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPost(post)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => unschedulePost(post.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal para editar programación */}
      {selectedPost && (
        <Card className="fixed inset-4 z-50 max-w-md mx-auto mt-20 bg-background border shadow-lg">
          <CardHeader>
            <CardTitle>Programar Publicación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">{selectedPost.title}</h4>
              <Badge variant="outline">{selectedPost.category}</Badge>
            </div>
            
            <div className="space-y-2">
              <Label>Fecha de publicación</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {publishDate ? format(publishDate, 'PPP', { locale: es }) : 'Seleccionar fecha'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={publishDate}
                    onSelect={setPublishDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Hora de publicación</Label>
              <Input
                type="time"
                value={publishTime}
                onChange={(e) => setPublishTime(e.target.value)}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedPost(null);
                  setPublishDate(undefined);
                  setPublishTime('');
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSchedule}
                disabled={!publishDate || !publishTime}
              >
                Programar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {selectedPost && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSelectedPost(null)}
        />
      )}
    </div>
  );
};

export default ScheduledPosts;