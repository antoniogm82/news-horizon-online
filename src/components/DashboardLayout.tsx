import { Routes, Route, Navigate } from 'react-router-dom';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { Button } from '@/components/ui/button';
import { LogOut, Bell } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import Dashboard from '@/pages/Dashboard';
import CreateArticle from '@/pages/CreateArticle';
import MyArticles from '@/pages/MyArticles';
import HeroManager from '@/pages/HeroManager';
import ScheduledPosts from '@/pages/ScheduledPosts';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';

const DashboardLayout = () => {
  const { signOut, profile } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente"
    });
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
          <div className="flex items-center justify-between h-full px-4">
            <div className="flex items-center space-x-4">
              <SidebarTrigger className="lg:hidden" />
              <h1 className="font-semibold text-foreground">
                Panel de Control
              </h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                className="relative"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </Button>
              
              <div className="hidden sm:flex items-center space-x-2 text-sm">
                <span className="text-muted-foreground">¡Hola,</span>
                <span className="font-medium">{profile?.display_name}!</span>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline ml-2">Salir</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="crear" element={<CreateArticle />} />
              <Route path="articulos" element={<MyArticles />} />
              <Route path="hero" element={<HeroManager />} />
              <Route path="programados" element={<ScheduledPosts />} />
              <Route path="articulos/:id" element={<div>Article Editor (TODO)</div>} />
              <Route path="perfil" element={<Profile />} />
              <Route path="configuracion" element={<Settings />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;