import { createBrowserRouter, Navigate } from 'react-router-dom';
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
import { AdminOrdersPage } from '../pages/admin/AdminOrdersPage';
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage';
import { VendorOrderPage } from '../pages/vendor/VendorOrderPage';
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
      },
      {
        path: 'vendor/:token',
        element: <VendorOrderPage />,
      },
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
            index: true,
            element: <Navigate to="dashboard" replace />
          },
          {
            path: 'dashboard',
            element: <AdminDashboardPage />,
          },
          {
            path: 'orders',
            element: <AdminOrdersPage />,
          },
          {
            path: 'products',
            element: <div className="p-8">Products Placeholder</div>,
          },
          {
            path: 'settings',
            element: <AdminSettingsPage />,
          }
        ]
      }
    ]
  }
]);
