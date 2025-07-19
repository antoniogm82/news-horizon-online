import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Bot, Clock, FileText, Settings, Trash2, Play, Pause } from 'lucide-react';

interface AutoContentSetting {
  id: string;
  topic: string;
  prompt_template: string;
  category: string;
  frequency_hours: number;
  is_active: boolean;
  created_at: string;
}

interface LogEntry {
  id: string;
  topic: string;
  status: string;
  error_message?: string;
  created_at: string;
  post_id?: string;
}

const AutoContent = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<AutoContentSetting[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  
  // Form state
  const [topic, setTopic] = useState('');
  const [promptTemplate, setPromptTemplate] = useState('Escribe un artículo detallado y profesional sobre tecnología que sea informativo y engaging para lectores interesados en innovación tecnológica.');
  const [category, setCategory] = useState('');
  const [frequencyHours, setFrequencyHours] = useState(24);

  const categories = ['smartphones', 'ai', 'gadgets', 'software', 'videojuegos', 'reviews'];

  useEffect(() => {
    if (user) {
      fetchSettings();
      fetchLogs();
    }
  }, [user]);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('auto_content_settings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSettings(data || []);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las configuraciones',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('auto_articles_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  const handleCreateSetting = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!topic || !category || !promptTemplate) {
      toast({
        title: 'Error',
        description: 'Por favor completa todos los campos requeridos',
        variant: 'destructive',
      });
      return;
    }

    setIsCreating(true);

    try {
      const { error } = await supabase
        .from('auto_content_settings')
        .insert({
          topic,
          prompt_template: promptTemplate,
          category,
          frequency_hours: frequencyHours,
          user_id: user?.id,
          is_active: true,
        });

      if (error) throw error;

      toast({
        title: 'Éxito',
        description: 'Automatización creada correctamente',
      });

      // Reset form
      setTopic('');
      setCategory('');
      setFrequencyHours(24);
      
      fetchSettings();
    } catch (error) {
      console.error('Error creating setting:', error);
      toast({
        title: 'Error',
        description: 'No se pudo crear la automatización',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('auto_content_settings')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Éxito',
        description: `Automatización ${!currentStatus ? 'activada' : 'desactivada'}`,
      });

      fetchSettings();
    } catch (error) {
      console.error('Error toggling setting:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la configuración',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteSetting = async (id: string) => {
    try {
      const { error } = await supabase
        .from('auto_content_settings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Éxito',
        description: 'Automatización eliminada',
      });

      fetchSettings();
    } catch (error) {
      console.error('Error deleting setting:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la automatización',
        variant: 'destructive',
      });
    }
  };

  const handleTestGeneration = async (setting: AutoContentSetting) => {
    setIsTesting(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-article', {
        body: {
          topic: setting.topic,
          prompt_template: setting.prompt_template,
          category: setting.category,
          user_id: user?.id,
          setting_id: setting.id,
        },
      });

      if (error) throw error;

      toast({
        title: 'Éxito',
        description: 'Artículo generado y publicado correctamente',
      });

      fetchLogs();
    } catch (error) {
      console.error('Error testing generation:', error);
      toast({
        title: 'Error',
        description: 'No se pudo generar el artículo de prueba',
        variant: 'destructive',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Completado</Badge>;
      case 'generating':
        return <Badge variant="secondary">Generando...</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center space-x-3">
        <Bot className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Automatización de Contenido</h1>
          <p className="text-muted-foreground">
            Genera artículos automáticamente usando inteligencia artificial
          </p>
        </div>
      </div>

      {/* Create New Automation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Nueva Automatización</span>
          </CardTitle>
          <CardDescription>
            Configura una nueva automatización para generar artículos sobre un tema específico
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateSetting} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Tema</Label>
                <Input
                  id="topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="ej: Inteligencia Artificial en 2024"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="frequency">Frecuencia (horas)</Label>
                <Input
                  id="frequency"
                  type="number"
                  min={1}
                  max={168}
                  value={frequencyHours}
                  onChange={(e) => setFrequencyHours(parseInt(e.target.value)) }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prompt">Plantilla de Prompt</Label>
              <Textarea
                id="prompt"
                value={promptTemplate}
                onChange={(e) => setPromptTemplate(e.target.value)}
                rows={4}
                placeholder="Describe cómo quieres que sea el artículo..."
                required
              />
            </div>

            <Button type="submit" disabled={isCreating}>
              {isCreating ? 'Creando...' : 'Crear Automatización'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Existing Automations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Automatizaciones Activas</span>
          </CardTitle>
          <CardDescription>
            Gestiona tus automatizaciones de contenido existentes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {settings.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No hay automatizaciones configuradas. Crea una nueva arriba.
            </p>
          ) : (
            <div className="space-y-4">
              {settings.map((setting) => (
                <div
                  key={setting.id}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="font-semibold">{setting.topic}</h3>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center space-x-1">
                          <Badge variant="outline">{setting.category}</Badge>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>Cada {setting.frequency_hours}h</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={setting.is_active}
                        onCheckedChange={() => handleToggleActive(setting.id, setting.is_active)}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTestGeneration(setting)}
                        disabled={isTesting}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteSetting(setting.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {setting.prompt_template}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generation Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Generaciones</CardTitle>
          <CardDescription>
            Últimas 20 generaciones de artículos automáticas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No hay generaciones registradas aún.
            </p>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{log.topic}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(log.created_at).toLocaleString('es-ES')}
                    </p>
                    {log.error_message && (
                      <p className="text-sm text-red-600">{log.error_message}</p>
                    )}
                  </div>
                  {getStatusBadge(log.status)}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AutoContent;
