import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, Search } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useConfig } from '../api/config';

export function Header() {
  // Calculate total items in cart
  const cartItems = useCartStore((state) => state.items);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const { data: config } = useConfig();
  const whatsappUrl = config?.settings?.whatsapp_number 
    ? `https://wa.me/${config.settings.whatsapp_number.replace(/\D/g, '')}`
    : '#';

  return (
    <header className="sticky top-0 z-50 w-full bg-secondary border-b border-border shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button className="p-2 text-foreground hover:text-accent transition-colors">
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Logo */}
          <div className="flex items-center justify-center lg:justify-start">
            <Link to="/" className="flex items-center gap-2">
              <span className="font-heading text-2xl font-bold tracking-tighter text-secondary-foreground">
                Al Ameen Collective
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8 font-medium text-sm text-secondary-foreground/80">
            <Link to="/products" className="hover:text-secondary-foreground transition-colors cursor-pointer">Catalog</Link>
            <Link to="/about" className="hover:text-secondary-foreground transition-colors cursor-pointer">About</Link>
            <Link to="/faqs" className="hover:text-secondary-foreground transition-colors cursor-pointer">FAQs</Link>
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="hover:text-secondary-foreground transition-colors cursor-pointer">Contact</a>
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-2 sm:gap-4 text-secondary-foreground">
            <button className="p-2 hover:text-primary transition-colors hidden sm:block cursor-pointer">
              <Search className="h-5 w-5" />
            </button>

            <Link to="/cart" className="p-2 hover:text-primary transition-colors relative cursor-pointer">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center transform translate-x-1 -translate-y-1">
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
