import { useParams } from 'react-router-dom';
import { useVendorOrder } from '../../api/vendor';
import { Package, User, Truck, Receipt } from 'lucide-react';

export function VendorOrderPage() {
  const { token } = useParams<{ token: string }>();
  const { data: order, isLoading, error } = useVendorOrder(token || '');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground font-medium">Loading Order Details...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="bg-card max-w-md w-full p-8 rounded-3xl border border-red-500/20 text-center shadow-xl">
          <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package size={32} />
          </div>
          <h1 className="text-xl font-bold text-foreground mb-4">Order Not Available</h1>
          <p className="text-muted-foreground text-sm">
            {(error as any)?.response?.data?.message || 'This vendor link is invalid or the order has been cancelled.'}
          </p>
          <p className="text-muted-foreground text-sm mt-4">
            Please contact Al Ameen Collective for assistance.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Minimal Header */}
      <header className="bg-card border-b border-border py-4 px-6 shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold font-serif">
            A
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Al Ameen Collective</h1>
            <p className="text-xs text-muted-foreground">Vendor Dispatch Portal</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6 pb-20 animate-in fade-in duration-500">
        
        {/* Order Summary Header */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-md">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Order ID</p>
              <h2 className="text-2xl font-bold text-accent">{order.public_order_id}</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-muted-foreground mb-1">Status</p>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500">
                  {order.status}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border/50 text-sm text-muted-foreground flex items-center gap-2">
            <span className="font-medium">Placed:</span>
            {new Date(order.created_at).toLocaleDateString('en-PK', {
              day: '2-digit', month: 'short', year: 'numeric',
              hour: '2-digit', minute: '2-digit'
            })}
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-md space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2 border-b border-border/50 pb-3">
            <User className="text-primary" size={20} />
            Customer Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Name</p>
              <p className="font-medium">{order.customer_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Phone</p>
              <p className="font-medium">{order.customer_phone}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-sm text-muted-foreground mb-1">Delivery Address</p>
              <p className="font-medium whitespace-pre-line">{order.customer_address}</p>
            </div>
            {order.notes && (
              <div className="sm:col-span-2 bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl">
                <p className="text-sm font-bold text-yellow-600 mb-1">Delivery Notes</p>
                <p className="text-sm text-yellow-700">{order.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Ordered Products */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-md">
          <div className="p-6 border-b border-border/50">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Package className="text-primary" size={20} />
              Products to Dispatch
            </h3>
          </div>
          <div className="divide-y divide-border/50">
            {order.items.map((item) => (
              <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-6">
                <div className="w-24 h-32 flex-shrink-0 bg-muted/30 rounded-xl overflow-hidden border border-border">
                  {item.productItem.media ? (
                    <img src={item.productItem.media.url} alt={item.productItem.product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <h4 className="font-bold text-lg text-foreground">{item.productItem.product.name}</h4>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">SKU:</span>
                      <span className="ml-2 font-mono">{item.productItem.product_code}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Color:</span>
                      <span className="ml-2 font-medium">{item.productItem.color}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Wholesale:</span>
                      <span className="ml-2 font-medium">Rs. {item.wholesale_price}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Quantity:</span>
                      <span className="ml-2 font-bold text-primary">{item.quantity}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="bg-card rounded-2xl border border-border p-6 shadow-md space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2 border-b border-border/50 pb-3">
            <Receipt className="text-primary" size={20} />
            Pricing Summary
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center text-muted-foreground">
              <span>Wholesale Items Total</span>
              <span>Rs. {order.wholesale_subtotal}</span>
            </div>
            <div className="flex justify-between items-center text-muted-foreground">
              <span className="flex items-center gap-2"><Truck size={14} /> Delivery Charges</span>
              <span>Rs. {order.delivery_charge}</span>
            </div>
            
            <div className="pt-3 border-t border-border/50">
              <h4 className="text-sm font-semibold mb-2">Profit Breakdown</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-muted-foreground">
                  <span>Total Commission (Profit)</span>
                  <span className="text-green-600">Rs. {order.total_commission}</span>
                </div>
                {order.delivery_discount > 0 && (
                  <div className="flex justify-between items-center text-muted-foreground">
                    <span>Discount on Delivery</span>
                    <span className="text-red-500">- Rs. {order.delivery_discount}</span>
                  </div>
                )}
                <div className="flex justify-between items-center font-medium">
                  <span>Muhammad Ali's Net Profit</span>
                  <span className={order.net_profit >= 0 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                    Rs. {order.net_profit}
                  </span>
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-border/50 flex justify-between items-center font-bold text-lg text-accent">
              <span>Customer Must Pay (COD)</span>
              <span>Rs. {order.retail_total}</span>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-4">
              * The Customer Grand Total is what the courier needs to collect on delivery.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}
