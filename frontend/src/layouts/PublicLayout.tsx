import { Outlet } from 'react-router-dom';
import { Announcement } from '../components/Announcement';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground selection:bg-accent/30 selection:text-accent-foreground">
      <Announcement />
      <Header />
      
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
