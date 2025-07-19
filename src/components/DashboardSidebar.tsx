import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  PenTool, 
  FileText, 
  BarChart3, 
  Settings, 
  User, 
  Home,
  ChevronLeft,
  ChevronRight,
  Pin,
  Clock
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';

const menuItems = [
  { title: 'Dashboard', url: '/dashboard', icon: BarChart3 },
  { title: 'Crear Artículo', url: '/dashboard/crear', icon: PenTool },
  { title: 'Mis Artículos', url: '/dashboard/articulos', icon: FileText },
  { title: 'Gestionar Hero', url: '/dashboard/hero', icon: Pin },
  { title: 'Programados', url: '/dashboard/programados', icon: Clock },
  { title: 'Perfil', url: '/dashboard/perfil', icon: User },
  { title: 'Configuración', url: '/dashboard/configuracion', icon: Settings },
];

export function DashboardSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const { profile } = useAuth();
  const currentPath = location.pathname;
  const collapsed = state === 'collapsed';

  const isActive = (path: string) => currentPath === path;

  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"}>
      <SidebarContent className="bg-card border-r border-border">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-primary-foreground font-bold text-sm">TN</span>
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <h2 className="font-semibold text-sm truncate">TechNews</h2>
                <p className="text-xs text-muted-foreground truncate">
                  {profile?.role === 'admin' && 'Administrador'}
                  {profile?.role === 'editor' && 'Editor'}
                  {profile?.role === 'author' && 'Autor'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Menú Principal
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Back to site */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/" 
                    className="flex items-center space-x-3 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  >
                    <Home className="h-4 w-4 flex-shrink-0" />
                    {!collapsed && <span>Volver al sitio</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Menu items */}
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end
                      className={({ isActive }) => `flex items-center space-x-3 transition-all duration-200 ${getNavClass({ isActive })}`}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User info at bottom */}
        {!collapsed && (
          <div className="mt-auto p-4 border-t border-border">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">
                  {profile?.display_name || 'Usuario'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {profile?.role || 'editor'}
                </p>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}