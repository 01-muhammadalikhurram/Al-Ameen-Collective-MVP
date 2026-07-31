import { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Eye, CheckCircle2, Truck, XCircle, Clock, Package } from 'lucide-react';
import { useAdminOrders, useUpdateOrderStatus } from '../../api/admin';
import type { OrderStatus, AdminOrder } from '../../api/admin';
import { AdminOrderDetailModal } from './AdminOrderDetailModal';

const STATUS_TABS: { label: string; value: OrderStatus | undefined }[] = [
  { label: 'All Orders', value: undefined },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Confirmed', value: 'CONFIRMED' },
  { label: 'Delivered', value: 'DELIVERED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

const STATUS_CONFIG: Record<OrderStatus, { label: string; bg: string; text: string; icon: React.ElementType }> = {
  PENDING: { label: 'Pending', bg: 'bg-yellow-500/10', text: 'text-yellow-600', icon: Clock },
  CONFIRMED: { label: 'Confirmed', bg: 'bg-blue-500/10', text: 'text-blue-600', icon: CheckCircle2 },
  DELIVERED: { label: 'Delivered', bg: 'bg-green-500/10', text: 'text-green-600', icon: Truck },
  CANCELLED: { label: 'Cancelled', bg: 'bg-red-500/10', text: 'text-red-600', icon: XCircle },
};

function StatusBadge({ status }: { status: OrderStatus }) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

export function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ orderId: string; status: OrderStatus } | null>(null);

  const { data, isLoading } = useAdminOrders({
    page,
    limit: 10,
    status: statusFilter,
    search: debouncedSearch || undefined,
  });

  const updateStatus = useUpdateOrderStatus();

  // Debounce search input
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    // Simple debounce with setTimeout
    const handler = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  };

  const handleStatusUpdate = (orderId: string, status: OrderStatus) => {
    setConfirmAction({ orderId, status });
  };

  const executeStatusUpdate = () => {
    if (!confirmAction) return;
    updateStatus.mutate(
      { orderId: confirmAction.orderId, status: confirmAction.status },
      { onSettled: () => setConfirmAction(null) }
    );
  };

  const handleTabChange = (status: OrderStatus | undefined) => {
    setStatusFilter(status);
    setPage(1);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-PK', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-heading font-bold">Order Management</h1>
        <p className="text-muted-foreground mt-1">View and manage all customer orders.</p>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.label}
            onClick={() => handleTabChange(tab.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === tab.value
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-card border border-border text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by Order ID, Name, or Phone..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
        />
      </div>

      {/* Orders Table */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Order ID</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Customer</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Phone</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Total</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Date</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                // Skeleton rows
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-4 bg-muted rounded animate-pulse w-20" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : data?.orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <Package className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
                    <p className="text-muted-foreground font-medium">No orders found</p>
                    <p className="text-sm text-muted-foreground/70 mt-1">
                      {searchQuery ? 'Try a different search term' : 'Orders will appear here when customers place them'}
                    </p>
                  </td>
                </tr>
              ) : (
                data?.orders.map((order) => (
                  <tr key={order.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono font-medium text-primary">{order.public_order_id}</span>
                    </td>
                    <td className="px-4 py-3 font-medium">{order.customer_name}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{order.customer_phone}</td>
                    <td className="px-4 py-3 font-medium">Rs {Number(order.total).toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs hidden lg:table-cell">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {order.status !== 'CONFIRMED' && order.status !== 'DELIVERED' && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'CONFIRMED')}
                            disabled={updateStatus.isPending}
                            className="p-1.5 rounded-md hover:bg-blue-500/10 text-muted-foreground hover:text-blue-600 transition-colors"
                            title="Confirm Order"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                        )}
                        {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'DELIVERED')}
                            disabled={updateStatus.isPending}
                            className="p-1.5 rounded-md hover:bg-green-500/10 text-muted-foreground hover:text-green-600 transition-colors"
                            title="Mark Delivered"
                          >
                            <Truck className="h-4 w-4" />
                          </button>
                        )}
                        {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'CANCELLED')}
                            disabled={updateStatus.isPending}
                            className="p-1.5 rounded-md hover:bg-red-500/10 text-muted-foreground hover:text-red-600 transition-colors"
                            title="Cancel Order"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/10">
            <p className="text-sm text-muted-foreground">
              Showing {((data.pagination.page - 1) * data.pagination.limit) + 1} to{' '}
              {Math.min(data.pagination.page * data.pagination.limit, data.pagination.total)} of{' '}
              {data.pagination.total} orders
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-md border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-medium px-2">
                {data.pagination.page} / {data.pagination.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                disabled={page === data.pagination.totalPages}
                className="p-1.5 rounded-md border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card rounded-xl border border-border p-6 shadow-lg max-w-sm mx-4 w-full">
            <h3 className="text-lg font-heading font-bold mb-2">Confirm Status Change</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Are you sure you want to change this order's status to{' '}
              <span className={`font-medium ${STATUS_CONFIG[confirmAction.status].text}`}>
                {STATUS_CONFIG[confirmAction.status].label}
              </span>?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmAction(null)}
                className="px-4 py-2 rounded-md border border-border text-sm font-medium hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeStatusUpdate}
                disabled={updateStatus.isPending}
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {updateStatus.isPending ? 'Updating...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <AdminOrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdate={(orderId, status) => {
            handleStatusUpdate(orderId, status);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
}
