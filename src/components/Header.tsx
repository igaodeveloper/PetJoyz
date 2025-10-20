import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, ShoppingCart, User, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Brinquedos', href: '/categoria/brinquedos' },
    { label: 'Acessórios', href: '/categoria/acessorios' },
    { label: 'Petiscos', href: '/categoria/petiscos' },
    { label: 'Coleções', href: '/categoria/colecoes' },
    { label: 'Quem Somos', href: '/sobre' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-soft-cream/95 backdrop-blur-sm border-b border-deep-navy/5 shadow-petjoy-soft'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-joy-orange rounded-full flex items-center justify-center">
              <span className="text-2xl">🐾</span>
            </div>
            <span className="font-primary font-bold text-xl text-deep-navy hidden sm:block">
              PetJoy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-deep-navy hover:text-joy-orange transition-colors font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-deep-navy hover:text-joy-orange"
              aria-label="Buscar"
            >
              <Search className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-deep-navy hover:text-joy-orange hidden md:flex"
              aria-label="Favoritos"
            >
              <Heart className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-deep-navy hover:text-joy-orange relative"
              aria-label="Carrinho"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-coral-red text-white text-xs">
                  {cartCount}
                </Badge>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-deep-navy hover:text-joy-orange hidden md:flex"
              aria-label="Conta"
            >
              <User className="h-5 w-5" />
            </Button>

            <Button
              className="hidden lg:flex bg-joy-orange hover:bg-aqua-mint text-white transition-all duration-300 hover:-translate-y-0.5 shadow-petjoy-soft hover:shadow-petjoy-crisp rounded-petjoy"
            >
              Adote a Alegria
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="icon" aria-label="Menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-80 bg-soft-cream">
                <nav className="flex flex-col gap-6 mt-8">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="text-lg font-medium text-deep-navy hover:text-joy-orange transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Button className="bg-joy-orange hover:bg-aqua-mint text-white mt-4 rounded-petjoy">
                    Adote a Alegria
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
