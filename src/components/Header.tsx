import { useState, useEffect } from 'react';
import { Search, Moon, Sun, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  onSearch: (query: string) => void;
  onCategoryFilter: (category: string) => void;
  searchQuery: string;
  activeCategory: string;
}

const Header = ({ onSearch, onCategoryFilter, searchQuery, activeCategory }: HeaderProps) => {
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDarkMode = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setDarkMode(shouldUseDarkMode);
    document.documentElement.classList.toggle('dark', shouldUseDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
  };

  const navItems = [
    { name: 'Inicio', href: '/', category: 'all' },
    { name: 'Smartphones', href: '/smartphones', category: 'smartphones' },
    { name: 'IA', href: '/ia', category: 'ai' },
    { name: 'Gadgets', href: '/gadgets', category: 'gadgets' },
    { name: 'Software', href: '/software', category: 'software' },
    { name: 'Videojuegos', href: '/videojuegos', category: 'videojuegos' },
    { name: 'Reviews', href: '/reviews', category: 'reviews' },
    { name: 'Contacto', href: '/contacto', category: 'contacto' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const query = formData.get('search') as string;
    onSearch(query);
    setIsSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/4abda72d-233e-4839-935c-a7da735b92a5.png" 
              alt="TechNews Logo" 
              className="h-8 w-8 mr-2"
            />
            <div className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
              TechNews
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => onCategoryFilter(item.category)}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  activeCategory === item.category
                    ? 'text-primary'
                    : 'text-muted-foreground'
                }`}
              >
                {item.name}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Desktop Search */}
            <div className="hidden md:flex items-center">
              {isSearchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
                  <Input
                    name="search"
                    placeholder="Buscar noticias..."
                    className="w-48"
                    defaultValue={searchQuery}
                    autoFocus
                  />
                  <Button type="submit" size="sm" variant="ghost">
                    <Search className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsSearchOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </form>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Mobile Search */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="relative"
            >
              {darkMode ? (
                <Sun className="h-4 w-4 transition-all" />
              ) : (
                <Moon className="h-4 w-4 transition-all" />
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <form onSubmit={handleSearchSubmit}>
              <Input
                name="search"
                placeholder="Buscar noticias..."
                defaultValue={searchQuery}
                autoFocus
              />
            </form>
          </div>
        )}

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    onCategoryFilter(item.category);
                    setIsMenuOpen(false);
                  }}
                  className={`text-left px-2 py-2 text-sm font-medium transition-colors hover:text-primary ${
                    activeCategory === item.category
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  }`}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;