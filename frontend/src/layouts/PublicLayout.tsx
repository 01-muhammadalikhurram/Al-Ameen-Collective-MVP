import { Outlet } from 'react-router-dom';
import { Announcement } from '../components/Announcement';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useEffect } from 'react';
import { useCartStore } from '../store/cartStore';
import { useSetting } from '../api/config';
import { Toaster } from 'react-hot-toast';

export function PublicLayout() {
  const { value: expiryDays } = useSetting('cart_expiry_days');
  const checkExpiry = useCartStore((state) => state.checkExpiry);

  useEffect(() => {
    // Only check expiry once the setting is loaded from backend
    if (typeof expiryDays === 'number') {
      checkExpiry(expiryDays);
    }
  }, [expiryDays, checkExpiry]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-accent/30 selection:text-accent-foreground">
      <Toaster position="bottom-right" />
      <Announcement />
      <Header />
      
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
