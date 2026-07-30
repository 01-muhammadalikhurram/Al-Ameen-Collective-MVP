import { createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { HomePage } from '../pages/HomePage';
import { CatalogPage } from '../pages/CatalogPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { CartPage } from '../pages/CartPage';

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
        element: <HomePage />,
      },
      {
        path: 'products',
        element: <CatalogPage />,
      },
      {
        path: 'products/:slug',
        element: <ProductDetailsPage />,
      },
      {
        path: 'cart',
        element: <CartPage />,
      }
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
