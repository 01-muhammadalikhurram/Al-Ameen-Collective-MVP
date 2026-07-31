import { X, Clock, CheckCircle2, Truck, XCircle, MapPin, Phone, User, FileText, Copy } from 'lucide-react';
import type { AdminOrder, OrderStatus } from '../../api/admin';

const STATUS_CONFIG: Record<OrderStatus, { label: string; bg: string; text: string; icon: React.ElementType }> = {
  PENDING: { label: 'Pending', bg: 'bg-yellow-500/10', text: 'text-yellow-600', icon: Clock },
  CONFIRMED: { label: 'Confirmed', bg: 'bg-blue-500/10', text: 'text-blue-600', icon: CheckCircle2 },
  DELIVERED: { label: 'Delivered', bg: 'bg-green-500/10', text: 'text-green-600', icon: Truck },
  CANCELLED: { label: 'Cancelled', bg: 'bg-red-500/10', text: 'text-red-600', icon: XCircle },
};

interface AdminOrderDetailModalProps {
  order: AdminOrder;
  onClose: () => void;
  onStatusUpdate: (orderId: string, status: OrderStatus) => void;
}

export function AdminOrderDetailModal({ order, onClose, onStatusUpdate }: AdminOrderDetailModalProps) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-PK', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const copyVendorLink = () => {
    const vendorUrl = `${window.location.origin}/vendor/${order.vendor_token}`;
    navigator.clipboard.writeText(vendorUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm overflow-y-auto py-8">
      <div className="bg-card rounded-xl border border-border shadow-xl max-w-2xl mx-4 w-full my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-lg font-heading font-bold">
              Order <span className="text-primary font-mono">{order.public_order_id}</span>
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">{formatDate(order.created_at)}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Status + Quick Actions */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Status:</span>
              {(() => {
                const config = STATUS_CONFIG[order.status];
                const Icon = config.icon;
                return (
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
                    <Icon className="h-4 w-4" />
                    {config.label}
                  </span>
                );
              })()}
            </div>
            <div className="flex items-center gap-2">
              {order.status !== 'CONFIRMED' && (
                <button
                  onClick={() => onStatusUpdate(order.id, 'CONFIRMED')}
                  className="px-3 py-1.5 rounded-md text-xs font-medium bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 transition-colors"
                >
                  Confirm
                </button>
              )}
              {order.status !== 'DELIVERED' && (
                <button
                  onClick={() => onStatusUpdate(order.id, 'DELIVERED')}
                  className="px-3 py-1.5 rounded-md text-xs font-medium bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors"
                >
                  Deliver
                </button>
              )}
              {order.status !== 'CANCELLED' && (
                <button
                  onClick={() => onStatusUpdate(order.id, 'CANCELLED')}
                  className="px-3 py-1.5 rounded-md text-xs font-medium bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-2.5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Customer Information</h3>
            <div className="flex items-start gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <span>{order.customer_name}</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <span>{order.customer_phone}</span>
            </div>
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <span>{order.customer_address}</span>
            </div>
            {order.notes && (
              <div className="flex items-start gap-2 text-sm">
                <FileText className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <span className="text-muted-foreground italic">{order.notes}</span>
              </div>
            )}
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/10">
                  {item.productItem?.media?.url ? (
                    <img
                      src={item.productItem.media.url}
                      alt={item.productItem.product?.name || 'Product'}
                      className="w-12 h-12 rounded-md object-cover border border-border"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-md bg-muted flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">N/A</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {item.productItem?.product?.name || 'Unknown Product'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.productItem?.product_code} · {item.productItem?.color} · Qty: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-medium">Rs {Number(item.selling_price).toLocaleString()}</p>
                    <p className="text-xs text-green-600">+Rs {Number(item.profit).toLocaleString()} profit</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Summary */}
          <div className="bg-muted/30 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">Rs {Number(order.subtotal).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Delivery Charge</span>
              <span className="font-medium">Rs {Number(order.delivery_charge).toLocaleString()}</span>
            </div>
            <div className="border-t border-border pt-2 mt-2 flex items-center justify-between">
              <span className="font-semibold">Grand Total</span>
              <span className="font-bold text-lg text-primary">Rs {Number(order.total).toLocaleString()}</span>
            </div>
          </div>

          {/* Vendor Link */}
          {order.vendor_token && (
            <div className="bg-muted/30 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-foreground mb-2">Vendor Link</h3>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-background px-3 py-2 rounded-md border border-border overflow-hidden text-ellipsis whitespace-nowrap">
                  {window.location.origin}/vendor/{order.vendor_token}
                </code>
                <button
                  onClick={copyVendorLink}
                  className="p-2 rounded-md border border-border hover:bg-muted transition-colors shrink-0"
                  title="Copy vendor link"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Order History Timeline */}
          {order.history && order.history.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Order History</h3>
              <div className="relative pl-6 space-y-4">
                {/* Timeline line */}
                <div className="absolute left-[9px] top-2 bottom-2 w-px bg-border" />
                {order.history.map((entry, index) => {
                  const config = STATUS_CONFIG[entry.status];
                  const Icon = config.icon;
                  return (
                    <div key={entry.id} className="relative flex items-start gap-3">
                      {/* Timeline dot */}
                      <div className={`absolute -left-6 w-[18px] h-[18px] rounded-full flex items-center justify-center ${
                        index === 0 ? config.bg : 'bg-muted'
                      }`}>
                        <Icon className={`h-3 w-3 ${index === 0 ? config.text : 'text-muted-foreground'}`} />
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${index === 0 ? config.text : 'text-muted-foreground'}`}>
                          {config.label}
                        </p>
                        {entry.notes && (
                          <p className="text-xs text-muted-foreground mt-0.5">{entry.notes}</p>
                        )}
                        <p className="text-xs text-muted-foreground/70 mt-0.5">{formatDate(entry.created_at)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
