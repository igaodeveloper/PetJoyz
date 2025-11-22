import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Search as SearchIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { buttonElevate, headerUnderline } from '@/lib/animations'
import { useCart } from '@/hooks/useCart';

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
  hidden: { y: -12, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 180,
      damping: 22,
    }
  },
  hover: { y: -3, transition: { duration: 0.12 } },
  tap: { y: 0, transition: { duration: 0.06 } }
}

const buttonHover = {
  scale: 1.05,
  transition: { type: 'spring', stiffness: 400, damping: 10 }
};

const buttonTap = {
  scale: 0.95
};

const searchBarVariants = {
  hidden: { 
    width: 40, 
    opacity: 0.8,
    x: 10
  },
  visible: {
    width: 300,
    opacity: 1,
    x: 0,
    transition: { 
      type: 'spring', 
      stiffness: 300, 
      damping: 25,
      mass: 0.5
    }
  },
  exit: {
    width: 40,
    opacity: 0,
    x: 10,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30
    }
  }
};

const searchButtonVariants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.1,
    rotate: 10,
    transition: { type: 'spring', stiffness: 500, damping: 10 }
  },
  tap: { 
    scale: 0.9,
    transition: { type: 'spring', stiffness: 500, damping: 10 }
  }
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const { cart, getCartCount } = useCart();
  const cartCount = getCartCount();
  const navigate = useNavigate();


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
    { label: 'Quem Somos', href: '/sobre' },
  ];

  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/produtos?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const handleSearchClick = () => {
    setIsSearchOpen(true);
    // Focus the input after a small delay to ensure it's visible
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
                Focinhus
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
                initial="hidden"
                animate="visible"
              >
                <Link
                  to={item.href}
                  className={`relative text-deep-navy hover:text-joy-orange transition-colors font-medium group px-1 py-1`}
                >
                  {item.label}
                  <motion.span
                    className="absolute left-0 -bottom-1 h-0.5 bg-joy-orange rounded-full"
                    initial="hidden"
                    animate={location.pathname === item.href ? 'visible' : 'hidden'}
                    variants={headerUnderline}
                    custom={'100%'}
                    style={{ display: 'block' }}
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
            <motion.div 
              className="relative"
              ref={searchContainerRef}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <AnimatePresence mode="wait">
                {isSearchOpen ? (
                  <motion.form
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full pl-4 pr-2 py-1 flex items-center z-50 overflow-hidden border border-joy-orange/20"
                    variants={searchBarVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onSubmit={handleSearch}
                    key="search-form"
                  >
                    <motion.div 
                      className="w-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.15 }}
                    >
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar produtos..."
                        className="w-full bg-transparent border-none outline-none text-deep-navy placeholder-deep-navy/60 focus:placeholder-transparent transition-all duration-200"
                      />
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="ml-1"
                    >
                        <Button
                          type="submit"
                          variant="ghost"
                          size="icon"
                          className="text-joy-orange hover:bg-joy-orange/10 h-8 w-8 rounded-full"
                          aria-label="Buscar"
                          motionProps={{
                            variants: buttonElevate,
                            initial: "rest",
                            whileHover: "hover",
                            whileTap: "tap"
                          }}
                        >
                          <SearchIcon className="h-4 w-4" />
                        </Button>
                    </motion.div>
                  </motion.form>
                ) : (
                  <motion.div 
                    key="search-button"
                    variants={searchButtonVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-deep-navy hover:text-joy-orange hover:bg-joy-orange/10"
                      aria-label="Abrir busca"
                      motionProps={{
                        variants: buttonElevate,
                        initial: "rest",
                        whileHover: "hover",
                        whileTap: "tap"
                      }}
                      onClick={handleSearchClick}
                    >
                      <Search className="h-5 w-5" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
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
                motionProps={{
                  variants: buttonElevate,
                  initial: "rest",
                  whileHover: "hover",
                  whileTap: "tap"
                }}
                onClick={() => navigate('/carrinho')}
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
                motionProps={{
                  variants: buttonElevate,
                  initial: "rest",
                  whileHover: "hover",
                  whileTap: "tap"
                }}
                onClick={() => navigate('/perfil')}
              >
                <User className="h-5 w-5" />
              </Button>
            </motion.div>


            {/* Mobile Menu */}
            <motion.div className="lg:hidden" whileHover={buttonHover} whileTap={buttonTap}>
              <Sheet>
                <SheetTrigger asChild>
                  <Button 
                variant="ghost" 
                size="icon" 
                aria-label="Menu"
                motionProps={{
                  variants: buttonElevate,
                  initial: "rest",
                  whileHover: "hover",
                  whileTap: "tap"
                }}
              >
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
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 * (menuItems.length + 1) }}
                        whileHover={{ x: 5 }}
                      >
                        <Link
                          to="/carrinho"
                          className="text-lg font-medium text-deep-navy hover:text-joy-orange transition-colors py-2 inline-flex items-center gap-2"
                        >
                          <ShoppingCart className="h-5 w-5" />
                          Carrinho {cartCount > 0 && `(${cartCount})`}
                        </Link>
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
