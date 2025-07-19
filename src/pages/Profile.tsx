import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Save, User, Mail, Calendar, Shield } from 'lucide-react';

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user, profile, updateProfile } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const display_name = formData.get('display_name') as string;
    const bio = formData.get('bio') as string;
    const avatar_url = formData.get('avatar_url') as string;

    const { error } = await updateProfile({
      display_name,
      bio,
      avatar_url
    });

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el perfil",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Perfil actualizado",
        description: "Los cambios se han guardado correctamente"
      });
    }

    setIsLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'editor': return 'default';
      case 'author': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mi Perfil</h1>
        <p className="text-muted-foreground">
          Gestiona tu información personal y configuración de cuenta
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Información de Cuenta</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                {profile?.avatar_url ? (
                  <img 
                    src={profile.avatar_url} 
                    alt="Avatar" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="h-8 w-8 text-primary-foreground" />
                )}
              </div>
              <h3 className="font-semibold text-lg">
                {profile?.display_name || 'Usuario'}
              </h3>
              <Badge variant={getRoleBadgeVariant(profile?.role || 'author')} className="mt-2">
                {profile?.role === 'admin' && 'Administrador'}
                {profile?.role === 'editor' && 'Editor'}
                {profile?.role === 'author' && 'Autor'}
              </Badge>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user?.email}</span>
              </div>
              
              <div className="flex items-center space-x-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  Miembro desde {profile?.created_at ? formatDate(profile.created_at) : 'N/A'}
                </span>
              </div>

              <div className="flex items-center space-x-3 text-sm">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span>Rol: {profile?.role || 'N/A'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Profile Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Editar Perfil</CardTitle>
              <CardDescription>
                Actualiza tu información personal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="display_name">Nombre completo</Label>
                  <Input
                    id="display_name"
                    name="display_name"
                    defaultValue={profile?.display_name || ''}
                    placeholder="Tu nombre completo"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Biografía</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    defaultValue={profile?.bio || ''}
                    placeholder="Cuéntanos sobre ti..."
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    Una breve descripción sobre ti que aparecerá en tus artículos
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatar_url">URL del avatar</Label>
                  <Input
                    id="avatar_url"
                    name="avatar_url"
                    type="url"
                    defaultValue={profile?.avatar_url || ''}
                    placeholder="https://ejemplo.com/tu-avatar.jpg"
                  />
                  <p className="text-xs text-muted-foreground">
                    URL de tu imagen de perfil
                  </p>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t">
                  <Button
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Cambios
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;