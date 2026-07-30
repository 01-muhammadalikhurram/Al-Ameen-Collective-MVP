import { useAdminMetrics } from '../../api/admin';
import { TrendingUp, Clock, XCircle, CheckCircle2 } from 'lucide-react';
import { useAdminUser } from '../../api/auth';

export function AdminDashboardPage() {
  const { data: metrics, isLoading } = useAdminMetrics();
  // Call useAdminUser to ensure token is valid and user is fetched
  useAdminUser();

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-heading font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-1">Here's what's happening with your store today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Sales (Delivered) */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Total Sales (Delivered)</h3>
            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-heading">
              Rs {metrics?.delivered.total.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {metrics?.delivered.count} orders delivered
            </p>
          </div>
        </div>

        {/* Confirmed Orders (Potential) */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Confirmed (Potential)</h3>
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-blue-500" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-heading">
              Rs {metrics?.confirmed.total.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {metrics?.confirmed.count} orders to ship
            </p>
          </div>
        </div>

        {/* Pending Orders (Potential) */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Pending (Action Required)</h3>
            <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-yellow-500" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-heading">
              Rs {metrics?.pending.total.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {metrics?.pending.count} orders waiting
            </p>
          </div>
        </div>

        {/* Cancelled Orders */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Cancelled Orders</h3>
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <XCircle className="h-5 w-5 text-destructive" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold font-heading">
              Rs {metrics?.cancelled.total.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {metrics?.cancelled.count} orders cancelled
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
