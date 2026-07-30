import { createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { HomePage } from '../pages/HomePage';
import { CatalogPage } from '../pages/CatalogPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { OrderSuccessPage } from '../pages/OrderSuccessPage';
import { AdminLayout } from '../layouts/AdminLayout';
import { AdminLoginPage } from '../pages/admin/AdminLoginPage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { ProtectedRoute } from '../components/ProtectedRoute';

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
      },
      {
        path: 'checkout',
        element: <CheckoutPage />,
      },
      {
        path: 'order-success/:publicId',
        element: <OrderSuccessPage />,
      }
    ],
  },
  {
    path: '/vendor',
    element: (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <h1 className="text-2xl font-bold text-accent">Vendor Portal Placeholder</h1>
      </div>
    ),
  },
  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
  {
    path: '/admin',
    element: <ProtectedRoute />,
    children: [
      {
        path: '',
        element: <AdminLayout />,
        children: [
          {
            path: 'dashboard',
            element: <AdminDashboardPage />,
          },
          // Future Sprint 10 & 11 pages will go here
          {
            path: 'orders',
            element: <div className="p-8">Orders Placeholder</div>,
          },
          {
            path: 'products',
            element: <div className="p-8">Products Placeholder</div>,
          },
          {
            path: 'settings',
            element: <div className="p-8">Settings Placeholder</div>,
          }
        ]
      }
    ]
  }
]);
