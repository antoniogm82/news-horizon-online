import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Loader2, Save, Eye, X, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const categories = [
  { value: 'tecnologia', label: 'Tecnología' },
  { value: 'educacion', label: 'Educación' },
  { value: 'innovacion', label: 'Innovación' },
  { value: 'tendencias', label: 'Tendencias' },
  { value: 'reviews', label: 'Reviews' },
  { value: 'general', label: 'General' }
];

const CreateArticle = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [publishDate, setPublishDate] = useState<Date>();
  const [publishTime, setPublishTime] = useState('');
  const [isHeroPinned, setIsHeroPinned] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, isDraft = false) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const excerpt = formData.get('excerpt') as string;
    const category = formData.get('category') as string;
    const image_url = formData.get('image_url') as string;
    const meta_title = formData.get('meta_title') as string;
    const meta_description = formData.get('meta_description') as string;
    const og_title = formData.get('og_title') as string;
    const og_description = formData.get('og_description') as string;
    const focus_keyword = formData.get('focus_keyword') as string;

    const slug = generateSlug(title);
    const reading_time = calculateReadingTime(content);

    // Determinar fecha de publicación
    let publishDateTime = null;
    let shouldPublish = !isDraft;
    
    if (isScheduled && publishDate && publishTime && !isDraft) {
      const [hours, minutes] = publishTime.split(':').map(Number);
      publishDateTime = new Date(publishDate);
      publishDateTime.setHours(hours, minutes, 0, 0);
      shouldPublish = publishDateTime <= new Date();
    } else if (!isDraft) {
      publishDateTime = new Date();
    }

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert({
          author_id: user?.id,
          title,
          slug,
          excerpt,
          content,
          image_url,
          category,
          keywords,
          reading_time,
          meta_title: meta_title || title,
          meta_description: meta_description || excerpt,
          og_title: og_title || title,
          og_description: og_description || excerpt,
          og_image: image_url,
          twitter_title: og_title || title,
          twitter_description: og_description || excerpt,
          twitter_image: image_url,
          focus_keyword,
          published: shouldPublish,
          published_at: publishDateTime?.toISOString() || null,
          is_hero_pinned: isHeroPinned
        })
        .select()
        .single();

      if (error) throw error;

      let successMessage = "";
      if (isDraft) {
        successMessage = "Tu artículo se ha guardado como borrador";
      } else if (isScheduled && !shouldPublish) {
        successMessage = `Artículo programado para el ${format(publishDateTime!, 'PPP', { locale: es })} a las ${format(publishDateTime!, 'HH:mm')}`;
      } else {
        successMessage = "Tu artículo ha sido publicado exitosamente";
      }

      toast({
        title: isDraft ? "Borrador guardado" : (shouldPublish ? "Artículo publicado" : "Artículo programado"),
        description: successMessage
      });

      navigate('/dashboard/articulos');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Hubo un error al guardar el artículo",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Crear Nuevo Artículo</h1>
        <p className="text-muted-foreground">
          Crea un artículo optimizado para SEO con todos los metadatos necesarios
        </p>
      </div>

      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
        <Tabs defaultValue="content" className="space-y-6">
          <TabsList>
            <TabsTrigger value="content">Contenido</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="social">Redes Sociales</TabsTrigger>
            <TabsTrigger value="publish">Publicación</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información Básica</CardTitle>
                <CardDescription>
                  Los datos principales de tu artículo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="El título de tu artículo"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoría *</Label>
                    <Select name="category" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image_url">URL de la imagen</Label>
                    <Input
                      id="image_url"
                      name="image_url"
                      type="url"
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Resumen *</Label>
                  <Textarea
                    id="excerpt"
                    name="excerpt"
                    placeholder="Una breve descripción del artículo"
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Contenido *</Label>
                  <Textarea
                    id="content"
                    name="content"
                    placeholder="Escribe el contenido completo de tu artículo..."
                    rows={15}
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seo" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Optimización SEO</CardTitle>
                <CardDescription>
                  Mejora la visibilidad de tu artículo en buscadores
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="meta_title">Meta título</Label>
                  <Input
                    id="meta_title"
                    name="meta_title"
                    placeholder="Si está vacío, se usará el título principal"
                  />
                  <p className="text-xs text-muted-foreground">Máximo 60 caracteres recomendado</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="meta_description">Meta descripción *</Label>
                  <Textarea
                    id="meta_description"
                    name="meta_description"
                    placeholder="Descripción que aparecerá en los resultados de búsqueda"
                    rows={3}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Entre 150-160 caracteres recomendado</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="focus_keyword">Palabra clave principal</Label>
                  <Input
                    id="focus_keyword"
                    name="focus_keyword"
                    placeholder="ej: inteligencia artificial"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Palabras clave adicionales</Label>
                  <div className="flex space-x-2">
                    <Input
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      placeholder="Agregar palabra clave"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                    />
                    <Button type="button" onClick={addKeyword} variant="outline">
                      Agregar
                    </Button>
                  </div>
                  {keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {keywords.map((keyword) => (
                        <Badge key={keyword} variant="secondary" className="flex items-center space-x-1">
                          <span>{keyword}</span>
                          <button
                            type="button"
                            onClick={() => removeKeyword(keyword)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Redes Sociales</CardTitle>
                <CardDescription>
                  Optimiza como se ve tu artículo cuando se comparte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="og_title">Título para redes sociales</Label>
                  <Input
                    id="og_title"
                    name="og_title"
                    placeholder="Si está vacío, se usará el título principal"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="og_description">Descripción para redes sociales</Label>
                  <Textarea
                    id="og_description"
                    name="og_description"
                    placeholder="Si está vacío, se usará el resumen"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="publish" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Publicación</CardTitle>
                <CardDescription>
                  Configura cuándo y cómo se publicará tu artículo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium">Fijar al Hero</Label>
                    <p className="text-xs text-muted-foreground">
                      El artículo aparecerá en el carrusel principal de la página de inicio
                    </p>
                  </div>
                  <Switch
                    checked={isHeroPinned}
                    onCheckedChange={setIsHeroPinned}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label className="text-sm font-medium">Programar publicación</Label>
                      <p className="text-xs text-muted-foreground">
                        Publica el artículo en una fecha y hora específica
                      </p>
                    </div>
                    <Switch
                      checked={isScheduled}
                      onCheckedChange={setIsScheduled}
                    />
                  </div>

                  {isScheduled && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/20">
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
                          placeholder="12:00"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1 sm:flex-none"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Eye className="mr-2 h-4 w-4" />
            Publicar Artículo
          </Button>
          
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={(e) => {
              const form = e.currentTarget.closest('form');
              if (form) {
                handleSubmit({ 
                  preventDefault: () => {}, 
                  currentTarget: form 
                } as any, true);
              }
            }}
            className="flex-1 sm:flex-none"
          >
            <Save className="mr-2 h-4 w-4" />
            Guardar Borrador
          </Button>

          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="flex-1 sm:flex-none"
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateArticle;