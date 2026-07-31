import { useParams } from 'react-router-dom';
import { useVendorOrder } from '../../api/vendor';
import { Package, User, MapPin, Phone, AlertCircle, ShoppingBag, Truck } from 'lucide-react';

export function VendorOrderPage() {
  const { token } = useParams<{ token: string }>();
  const { data: order, isLoading, isError } = useVendorOrder(token || '');

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center max-w-md mx-auto text-center px-4">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold font-heading mb-2">Order Not Found</h2>
        <p className="text-muted-foreground">
          The order link you followed is invalid, expired, or the order has been removed. Please contact the administrator.
        </p>
      </div>
    );
  }

  // Calculate totals
  const totalWholesale = order.items.reduce((sum, item) => sum + (Number(item.wholesale_price) * item.quantity), 0);
  const totalProfit = order.items.reduce((sum, item) => sum + Number(item.profit), 0);
  const deliveryCharge = Number(order.delivery_charge);
  const grandTotal = Number(order.total);

  return (
    <div className="w-full bg-background min-h-screen">
      <div className="container max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-3">
              <Package className="h-4 w-4" />
              Vendor Fulfillment Portal
            </div>
            <h1 className="text-3xl font-heading font-bold">Order <span className="text-primary font-mono">{order.public_order_id}</span></h1>
            <p className="text-muted-foreground mt-1">Placed on {new Date(order.created_at).toLocaleDateString('en-PK', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
          <div className="bg-card border border-border rounded-lg px-4 py-3 text-center md:text-right">
            <p className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-1">Status</p>
            <p className={`font-bold text-lg ${order.status === 'CANCELLED' ? 'text-red-600' : 'text-primary'}`}>
              {order.status}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Content - Left Column (Items) */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-border bg-muted/30">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                  Items to Fulfill
                </h2>
              </div>
              <div className="divide-y divide-border">
                {order.items.map((item) => (
                  <div key={item.id} className="p-6 flex gap-4">
                    {/* Product Image */}
                    <div className="h-20 w-20 shrink-0 bg-muted rounded-lg border border-border overflow-hidden">
                      {item.productItem.media?.url ? (
                        <img 
                          src={item.productItem.media.url} 
                          alt={item.productItem.product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                          <Package className="h-8 w-8 opacity-50" />
                        </div>
                      )}
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-lg text-foreground truncate">{item.productItem.product.name}</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          Code: <span className="font-mono">{item.productItem.product_code}</span> • Color: {item.productItem.color}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-sm font-medium bg-muted px-2 py-1 rounded">Qty: {item.quantity}</p>
                        <p className="font-semibold">Rs {Number(item.wholesale_price).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer Details */}
            <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-border bg-muted/30">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Customer Information
                </h2>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Name</p>
                  <p className="font-medium flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    {order.customer_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Phone</p>
                  <p className="font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {order.customer_phone}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Delivery Address</p>
                  <p className="font-medium flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{order.customer_address}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Right Column (Financials) */}
          <div className="space-y-6">
            <div className="bg-card rounded-xl border border-border shadow-sm sticky top-24">
              <div className="px-6 py-4 border-b border-border bg-primary/5 text-primary">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Financial Summary
                </h2>
              </div>
              <div className="p-6 space-y-4">
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Total Wholesale</span>
                  <span className="font-medium">Rs {totalWholesale.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Delivery Charge</span>
                  <span className="font-medium">Rs {deliveryCharge.toLocaleString()}</span>
                </div>

                <div className="h-px bg-border my-2"></div>

                <div className="flex justify-between items-center text-sm bg-primary/5 p-3 rounded-lg border border-primary/20">
                  <span className="font-semibold text-primary">Muhammad Ali's Profit</span>
                  <span className="font-bold text-primary">Rs {totalProfit.toLocaleString()}</span>
                </div>

                <div className="pt-2">
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">COD Amount (To Collect)</p>
                    <p className="text-2xl font-bold font-heading">Rs {grandTotal.toLocaleString()}</p>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg mt-4">
                  <p className="text-sm text-yellow-700 font-medium">
                    Please remit Rs {totalProfit.toLocaleString()} to Muhammad Ali after the COD is collected.
                  </p>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
