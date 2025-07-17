import { Heart, Mail, Youtube, Instagram, Facebook } from 'lucide-react';
import xLogo from '../assets/x-logo.png';

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="text-2xl font-bold text-foreground">
              TechNews
            </div>
            <p className="text-sm text-muted-foreground">
              Tu fuente confiable para las últimas noticias de tecnología, análisis y reviews.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <img src={xLogo} alt="X" className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold text-card-foreground">Categorías</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Smartphones</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Inteligencia Artificial</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Gadgets</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Software</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Videojuegos</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Reviews</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-semibold text-card-foreground">Empresa</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Acerca de</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Equipo</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Carreras</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Contacto</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Prensa</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold text-card-foreground">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Política de Privacidad</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Términos de Uso</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Cookies</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Aviso Legal</a></li>
              <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">RSS</a></li>
            </ul>
          </div>
        </div>

        <hr className="my-8 border-border" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © 2025 TechNews. Todos los derechos reservados.
          </div>
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <span>Hecho con</span>
            <Heart className="h-4 w-4 text-red-500" />
            <span>por el equipo de TechNews</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;