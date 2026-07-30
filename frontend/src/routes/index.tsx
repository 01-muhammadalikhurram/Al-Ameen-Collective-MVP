import { createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';

/**
 * Global route definitions.
 * Following Doc 06, we separate layouts (Public, Admin, Vendor).
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: (
          <div className="flex min-h-[60vh] flex-col items-center justify-center p-8">
            <div className="text-center space-y-6 max-w-2xl mx-auto">
              <h1 className="text-5xl font-heading font-bold text-foreground">
                Discover the Premium Collective
              </h1>
              <p className="text-lg text-muted-foreground">
                Your new frontend foundation is successfully installed. 
                Enjoy the glassmorphism, native dark mode, and ultra-smooth animations.
              </p>
              <div className="pt-4 flex gap-4 justify-center">
                <button className="px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                  Shop Now
                </button>
                <button className="px-6 py-3 rounded-md bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-colors">
                  View Collections
                </button>
              </div>
            </div>
          </div>
        ),
      },
    ],
  },
  {
    path: '/admin',
    element: (
      <div className="flex min-h-screen items-center justify-center bg-sidebar">
        <h1 className="text-2xl font-bold">Admin Portal Placeholder</h1>
      </div>
    ),
  },
  {
    path: '/vendor',
    element: (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <h1 className="text-2xl font-bold text-accent">Vendor Portal Placeholder</h1>
      </div>
    ),
  },
]);
