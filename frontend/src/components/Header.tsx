import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, Search, User, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useCartStore } from '../store/cartStore';

export function Header() {
  const { theme, setTheme } = useTheme();
  
  // Calculate total items in cart
  const cartItems = useCartStore((state) => state.items);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 w-full glass border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button className="p-2 text-foreground hover:text-accent transition-colors">
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Logo */}
          <div className="flex items-center justify-center lg:justify-start">
            <Link to="/" className="flex items-center gap-2">
              <span className="font-heading text-2xl font-bold tracking-tighter gradient-text">
                Al Ameen Collective
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 font-medium text-sm text-muted-foreground">
            <Link to="/products" className="hover:text-foreground transition-colors">Shop</Link>
            <Link to="/products?category=stitched" className="hover:text-foreground transition-colors">Stitched</Link>
            <Link to="/products?category=unstitched" className="hover:text-foreground transition-colors">Unstitched</Link>
            <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="p-2 text-foreground hover:text-accent transition-colors hidden sm:block">
              <Search className="h-5 w-5" />
            </button>
            
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 text-foreground hover:text-accent transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <Link to="/account" className="p-2 text-foreground hover:text-accent transition-colors hidden sm:block">
              <User className="h-5 w-5" />
            </Link>

            <Link to="/cart" className="p-2 text-foreground hover:text-accent transition-colors relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-accent text-[10px] font-bold text-accent-foreground flex items-center justify-center transform translate-x-1 -translate-y-1">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
