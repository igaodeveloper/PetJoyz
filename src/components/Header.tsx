import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingCart, User, Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { motion, AnimatePresence } from 'framer-motion';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15
    }
  },
  hover: {
    scale: 1.05,
    transition: { duration: 0.2 }
  },
  tap: {
    scale: 0.95
  }
};

const buttonHover = {
  scale: 1.05,
  transition: { type: 'spring', stiffness: 400, damping: 10 }
};

const buttonTap = {
  scale: 0.95
};

const menuVariants = {
  open: { 
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  },
  closed: { 
    opacity: 0,
    x: '100%',
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  }
};

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
    { label: 'Início', href: '/' },
    { label: 'Brinquedos', href: '/categoria/brinquedos' },
    { label: 'Acessórios', href: '/categoria/acessorios' },
    { label: 'Petiscos', href: '/categoria/petiscos' },
    { label: 'Coleções', href: '/categoria/colecoes' },
    { label: 'Quem Somos', href: '/sobre' },
  ];

  const location = useLocation();

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-soft-cream/95 backdrop-blur-sm border-b border-deep-navy/5 shadow-petjoy-soft'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <motion.div 
          className="flex items-center justify-between h-16 md:h-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Logo */}
          <motion.div variants={itemVariants} whileHover="hover" whileTap="tap">
            <Link to="/" className="flex items-center gap-2">
              <motion.div 
                className="w-10 h-10 bg-joy-orange rounded-full flex items-center justify-center"
                whileHover={{ rotate: 360, transition: { duration: 0.5 } }}
              >
                <span className="text-2xl">🐾</span>
              </motion.div>
              <motion.span 
                className="font-primary font-bold text-xl text-deep-navy hidden sm:block"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                PetJoy
              </motion.span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.nav 
            className="hidden lg:flex items-center gap-8"
            variants={containerVariants}
          >
            {menuItems.map((item, index) => (
              <motion.div 
                key={item.href}
                variants={itemVariants}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                <Link
                  to={item.href}
                  className={`relative text-deep-navy hover:text-joy-orange transition-colors font-medium group`}
                >
                  {item.label}
                  <motion.span 
                    className="absolute left-0 -bottom-1 w-0 h-0.5 bg-joy-orange rounded-full transition-all duration-300 group-hover:w-full"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: location.pathname === item.href ? '100%' : 0,
                      backgroundColor: location.pathname === item.href ? '#FF7E5D' : '#FF7E5D'
                    }}
                  />
                </Link>
              </motion.div>
            ))}
          </motion.nav>

          {/* Right Actions */}
          <motion.div 
            className="flex items-center gap-2 md:gap-4"
            variants={containerVariants}
          >
            <motion.div whileHover={buttonHover} whileTap={buttonTap}>
              <Button
                variant="ghost"
                size="icon"
                className="text-deep-navy hover:text-joy-orange"
                aria-label="Buscar"
              >
                <Search className="h-5 w-5" />
              </Button>
            </motion.div>

            <motion.div whileHover={buttonHover} whileTap={buttonTap} className="hidden md:flex">
              <Button
                variant="ghost"
                size="icon"
                className="text-deep-navy hover:text-joy-orange"
                aria-label="Favoritos"
              >
                <Heart className="h-5 w-5" />
              </Button>
            </motion.div>

            <motion.div 
              whileHover={buttonHover} 
              whileTap={buttonTap}
              className="relative"
            >
              <Button
                variant="ghost"
                size="icon"
                className="text-deep-navy hover:text-joy-orange relative"
                aria-label="Carrinho"
              >
                <ShoppingCart className="h-5 w-5" />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key="cart-badge"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1"
                    >
                      <Badge className="h-5 w-5 flex items-center justify-center p-0 bg-coral-red text-white text-xs">
                        {cartCount}
                      </Badge>
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>

            <motion.div whileHover={buttonHover} whileTap={buttonTap} className="hidden md:flex">
              <Button
                variant="ghost"
                size="icon"
                className="text-deep-navy hover:text-joy-orange"
                aria-label="Conta"
              >
                <User className="h-5 w-5" />
              </Button>
            </motion.div>

            <motion.div 
              whileHover={{ 
                y: -2,
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
              }}
              whileTap={{ 
                scale: 0.98,
                boxShadow: '0 2px 5px -1px rgba(0, 0, 0, 0.1), 0 1px 3px -1px rgba(0, 0, 0, 0.1)'
              }}
              className="hidden lg:block"
            >
              <Button
                className="bg-joy-orange hover:bg-aqua-mint text-white transition-all duration-300 rounded-petjoy w-full h-full"
              >
                Adote a Alegria
              </Button>
            </motion.div>

            {/* Mobile Menu */}
            <motion.div className="lg:hidden" whileHover={buttonHover} whileTap={buttonTap}>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Menu">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key="menu-icon"
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 0 }}
                        exit={{ rotate: 90 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Menu className="h-6 w-6" />
                      </motion.div>
                    </AnimatePresence>
                  </Button>
                </SheetTrigger>
                <SheetContent 
                  side="right" 
                  className="w-full sm:w-80 bg-soft-cream p-0 overflow-hidden"
                >
                  <motion.div 
                    className="h-full w-full bg-white p-6"
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={menuVariants}
                  >
                    <nav className="flex flex-col gap-6 mt-8">
                      {menuItems.map((item, index) => (
                        <motion.div
                          key={item.href}
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.1 * index }}
                          whileHover={{ x: 5 }}
                        >
                          <Link
                            to={item.href}
                            className="text-lg font-medium text-deep-navy hover:text-joy-orange transition-colors block py-2"
                          >
                            {item.label}
                          </Link>
                        </motion.div>
                      ))}
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 * menuItems.length + 0.1 }}
                        whileHover={{ y: -2 }}
                        className="mt-6"
                      >
                        <Button 
                          className="w-full bg-joy-orange hover:bg-aqua-mint text-white rounded-petjoy py-6 text-lg"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Adote a Alegria
                        </Button>
                      </motion.div>
                    </nav>
                  </motion.div>
                </SheetContent>
              </Sheet>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.header>
  );
}
