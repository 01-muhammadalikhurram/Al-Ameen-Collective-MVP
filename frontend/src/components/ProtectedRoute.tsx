import { Outlet } from 'react-router-dom';

export function ProtectedRoute() {
  // Bypass login for now

  // Bypass login for now
  // if (!isAuthenticated) {
  //   return <Navigate to="/admin/login" state={{ from: location }} replace />;
  // }

  return <Outlet />;
}
