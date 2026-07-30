import { createBrowserRouter } from 'react-router-dom';

/**
 * Global route definitions.
 * Following Doc 06, we separate layouts (Public, Admin, Vendor).
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-heading text-primary mb-4">
            Al Ameen Collective
          </h1>
          <p className="text-foreground">Frontend application is running.</p>
        </div>
      </div>
    ),
    // We'll add children routes in Phase 5
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
