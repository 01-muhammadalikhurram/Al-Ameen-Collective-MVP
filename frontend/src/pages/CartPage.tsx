import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

export function CartPage() {
  const { items, removeItem, updateQuantity } = useCartStore();

  const subtotal = items.reduce((sum, item) => {
    return sum + (Number(item.selling_price) * item.quantity);
  }, 0);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-heading font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          Looks like you haven't added any premium fabrics to your collection yet.
        </p>
        <Link 
          to="/products" 
          className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-heading font-bold mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items List */}
        <div className="flex-1">
          <div className="border border-border rounded-xl overflow-hidden bg-card">
            {/* Desktop Header */}
            <div className="hidden sm:grid grid-cols-12 gap-4 p-4 border-b border-border bg-muted/50 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              <div className="col-span-6">Product</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
              <div className="col-span-1"></div>
            </div>

            {/* Items */}
            <ul className="divide-y divide-border">
              {items.map((item) => (
                <li key={item.id} className="p-4 sm:p-6 flex flex-col sm:grid sm:grid-cols-12 gap-4 sm:items-center">
                  
                  {/* Product Details */}
                  <div className="col-span-6 flex gap-4">
                    <Link to={`/products/${item.slug}`} className="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-md overflow-hidden bg-muted border border-border block">
                      <img 
                        src={item.image_url} 
                        alt={item.name} 
                        className="w-full h-full object-cover transition-transform hover:scale-110"
                      />
                    </Link>
                    <div className="flex flex-col justify-center">
                      <Link to={`/products/${item.slug}`} className="font-heading font-semibold text-lg hover:text-primary transition-colors">
                        {item.name}
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1 mb-2">Color: {item.color}</p>
                      <p className="text-sm font-medium">Rs {item.selling_price}</p>
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="col-span-3 flex sm:justify-center items-center mt-2 sm:mt-0">
                    <div className="flex items-center border border-border rounded-md overflow-hidden bg-background">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-2 hover:bg-muted disabled:opacity-50 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-10 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-muted transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Item Total (Desktop) */}
                  <div className="col-span-2 text-right hidden sm:block font-medium">
                    Rs {(Number(item.selling_price) * item.quantity).toFixed(2)}
                  </div>

                  {/* Item Total & Remove (Mobile layout wrapper) */}
                  <div className="flex items-center justify-between sm:hidden w-full mt-4 pt-4 border-t border-border">
                    <div className="font-medium">
                      Rs {(Number(item.selling_price) * item.quantity).toFixed(2)}
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-destructive p-2 hover:bg-destructive/10 rounded-md transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Remove Button (Desktop) */}
                  <div className="col-span-1 justify-end hidden sm:flex">
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-destructive p-2 rounded-md transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:w-96 flex-shrink-0">
          <div className="glass-card p-6 rounded-xl border border-border sticky top-24">
            <h2 className="text-xl font-heading font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({items.reduce((a, b) => a + b.quantity, 0)} items)</span>
                <span className="font-medium">Rs {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping Estimate</span>
                <span className="font-medium">Calculated at checkout</span>
              </div>
            </div>

            <div className="border-t border-border pt-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-xl">Rs {subtotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Taxes and shipping calculated at checkout.</p>
            </div>

            <Link 
              to="/checkout" 
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 rounded-md font-semibold hover:bg-primary/90 transition-colors shadow-lg"
            >
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </Link>
            
            <div className="mt-4 text-center">
              <Link to="/products" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
