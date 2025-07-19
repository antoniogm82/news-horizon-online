import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Database, Shield, Bell, Mail, Palette, HelpCircle } from 'lucide-react';

const Settings = () => {
  const { profile } = useAuth();

  const settingSections = [
    {
      icon: Database,
      title: 'Base de Datos',
      description: 'Configuración de la conexión a Supabase',
      items: [
        { label: 'Estado de conexión', value: 'Conectado', status: 'success' },
        { label: 'Proyecto ID', value: 'wiylggtouvdspdrymzlr', status: 'info' },
        { label: 'RLS Habilitado', value: 'Sí', status: 'success' }
      ]
    },
    {
      icon: Shield,
      title: 'Seguridad',
      description: 'Configuración de autenticación y permisos',
      items: [
        { label: 'Autenticación', value: 'Email/Password', status: 'info' },
        { label: 'Rol actual', value: profile?.role || 'N/A', status: 'info' },
        { label: '2FA', value: 'No configurado', status: 'warning' }
      ]
    },
    {
      icon: Bell,
      title: 'Notificaciones',
      description: 'Gestiona cómo recibes las notificaciones',
      items: [
        { label: 'Email', value: 'Habilitado', status: 'success' },
        { label: 'Push', value: 'Deshabilitado', status: 'warning' },
        { label: 'Comentarios', value: 'Habilitado', status: 'success' }
      ]
    },
    {
      icon: Palette,
      title: 'Apariencia',
      description: 'Personaliza la interfaz del dashboard',
      items: [
        { label: 'Tema', value: 'Sistema', status: 'info' },
        { label: 'Idioma', value: 'Español', status: 'info' },
        { label: 'Densidad', value: 'Cómoda', status: 'info' }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configuración</h1>
        <p className="text-muted-foreground">
          Gestiona la configuración del sistema y tus preferencias
        </p>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-green-600" />
            <span>Estado del Sistema</span>
          </CardTitle>
          <CardDescription>
            Información general sobre el estado de TechNews
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium">Base de Datos</p>
                <p className="text-sm text-muted-foreground">Operacional</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium">Autenticación</p>
                <p className="text-sm text-muted-foreground">Funcionando</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium">API</p>
                <p className="text-sm text-muted-foreground">Disponible</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {settingSections.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <section.icon className="h-5 w-5" />
                <span>{section.title}</span>
              </CardTitle>
              <CardDescription>
                {section.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {section.items.map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.label}</span>
                    <Badge 
                      variant="outline" 
                      className={getStatusColor(item.status)}
                    >
                      {item.value}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HelpCircle className="h-5 w-5" />
            <span>Ayuda y Soporte</span>
          </CardTitle>
          <CardDescription>
            Recursos y documentación para usar TechNews
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-border rounded-lg">
              <h4 className="font-medium mb-2">Documentación</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Aprende cómo usar todas las funcionalidades
              </p>
              <Button variant="outline" size="sm">
                Ver Docs
              </Button>
            </div>
            <div className="p-4 border border-border rounded-lg">
              <h4 className="font-medium mb-2">Soporte Técnico</h4>
              <p className="text-sm text-muted-foreground mb-3">
                ¿Necesitas ayuda? Contacta con el equipo
              </p>
              <Button variant="outline" size="sm">
                <Mail className="mr-2 h-4 w-4" />
                Contactar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Version Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>TechNews Dashboard v1.0.0</p>
            <p>Desarrollado con React, TypeScript y Supabase</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;