import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ArrowLeft } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useConfig } from '../api/config';
import { useCreateOrder } from '../api/orders';

// Pakistani phone regex handling multiple formats: 0310..., 92310..., +92310...
const phoneRegex = /^(\+92|92|0)?3\d{9}$/;

const checkoutSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().regex(phoneRegex, 'Invalid Pakistani phone number format'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  province: z.string().min(2, 'Province/State is required'),
  postalCode: z.string().min(4, 'Postal code is required'),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();
  const { data: config } = useConfig();
  const createOrderMutation = useCreateOrder();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: '',
    }
  });

  // Calculate Subtotal
  const subtotal = items.reduce((sum, item) => sum + (Number(item.selling_price) * item.quantity), 0);

  // Calculate Shipping Cost
  const defaultDeliveryCharge = Number(config?.settings?.default_delivery_charge || 0);
  let shippingCost = defaultDeliveryCharge;
  
  if (config?.deliveryRules && config.deliveryRules.length > 0) {
    // Sort rules descending by minimum_order to find the highest threshold we meet
    const sortedRules = [...config.deliveryRules].sort((a, b) => Number(b.minimum_order) - Number(a.minimum_order));
    const applicableRule = sortedRules.find((rule) => subtotal >= Number(rule.minimum_order));
    
    if (applicableRule) {
      const discountPercentage = Number(applicableRule.discount_percentage);
      const discountMultiplier = Math.max(0, 1 - (discountPercentage / 100));
      shippingCost = defaultDeliveryCharge * discountMultiplier;
    }
  }

  const total = subtotal + shippingCost;

  const onSubmit = async (data: CheckoutFormValues) => {
    try {
      const orderPayload = {
        customer_name: `${data.firstName} ${data.lastName}`,
        customer_phone: data.phone,
        customer_address: `${data.address}, ${data.city}, ${data.province}, ${data.postalCode}`,
        notes: data.email ? `Email: ${data.email}` : undefined,
        items: items.map(item => ({
          item_id: item.id,
          quantity: item.quantity,
        })),
      };

      const result = await createOrderMutation.mutateAsync(orderPayload);
      clearCart();
      navigate(`/order-success/${result.public_order_id}`);
    } catch (error: any) {
      console.error('Failed to create order', error);
      const errorMsg = error?.message || 'Failed to place order. Please try again.';
      alert(errorMsg);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <Link to="/products" className="text-primary hover:underline">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <Link to="/cart" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Return to Cart
      </Link>
      
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Form Column */}
        <div className="flex-1">
          <h1 className="text-3xl font-heading font-bold mb-8">Checkout</h1>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Contact Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b border-border pb-2">Contact Information</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium">First Name <span className="text-destructive">*</span></label>
                  <input 
                    {...register('firstName')} 
                    id="firstName" 
                    className="w-full px-4 py-2 rounded-[12px] border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="Muhammad"
                  />
                  {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium">Last Name <span className="text-destructive">*</span></label>
                  <input 
                    {...register('lastName')} 
                    id="lastName" 
                    className="w-full px-4 py-2 rounded-[12px] border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="Ali"
                  />
                  {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">Phone Number <span className="text-destructive">*</span></label>
                  <input 
                    {...register('phone')} 
                    id="phone" 
                    type="tel"
                    className="w-full px-4 py-2 rounded-[12px] border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="03001234567"
                  />
                  {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email <span className="text-muted-foreground font-normal">(Optional)</span></label>
                  <input 
                    {...register('email')} 
                    id="email" 
                    type="email"
                    className="w-full px-4 py-2 rounded-[12px] border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="ali@example.com"
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold border-b border-border pb-2">Shipping Address</h2>
              
              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-medium">Street Address <span className="text-destructive">*</span></label>
                <input 
                  {...register('address')} 
                  id="address" 
                  className="w-full px-4 py-2 rounded-[12px] border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="House No, Street Name, Area"
                />
                {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2 sm:col-span-1">
                  <label htmlFor="city" className="text-sm font-medium">City <span className="text-destructive">*</span></label>
                  <input 
                    {...register('city')} 
                    id="city" 
                    className="w-full px-4 py-2 rounded-[12px] border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="Lahore"
                  />
                  {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
                </div>

                <div className="space-y-2 sm:col-span-1">
                  <label htmlFor="province" className="text-sm font-medium">Province/State <span className="text-destructive">*</span></label>
                  <input 
                    {...register('province')} 
                    id="province" 
                    className="w-full px-4 py-2 rounded-[12px] border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="Punjab"
                  />
                  {errors.province && <p className="text-sm text-destructive">{errors.province.message}</p>}
                </div>

                <div className="space-y-2 sm:col-span-1">
                  <label htmlFor="postalCode" className="text-sm font-medium">Postal Code <span className="text-destructive">*</span></label>
                  <input 
                    {...register('postalCode')} 
                    id="postalCode" 
                    className="w-full px-4 py-2 rounded-[12px] border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                    placeholder="54000"
                  />
                  {errors.postalCode && <p className="text-sm text-destructive">{errors.postalCode.message}</p>}
                </div>
              </div>
            </div>

            {/* Mobile Submit Button (Shows below form on mobile) */}
            <div className="lg:hidden">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-primary text-primary-foreground font-semibold rounded-[12px] hover:bg-primary/90 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
              >
                {isSubmitting ? 'Processing...' : 'Place Order Now'}
              </button>
            </div>
          </form>
        </div>

        {/* Order Summary Column */}
        <div className="lg:w-96 flex-shrink-0">
          <div className="glass-card p-6 rounded-xl border border-border sticky top-24 bg-card/50 backdrop-blur-xl">
            <h2 className="text-xl font-heading font-bold mb-6">Order Summary</h2>
            
            {/* Items List */}
            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-16 h-16 rounded-[12px] overflow-hidden bg-muted border border-border flex-shrink-0">
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-foreground text-background text-xs font-bold rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <span className="font-medium text-sm line-clamp-1">{item.name}</span>
                    <span className="text-xs text-muted-foreground">{item.color}</span>
                  </div>
                  <div className="flex items-center text-sm font-medium">
                    Rs {(Number(item.selling_price) * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 space-y-3 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">Rs {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">
                  {shippingCost === 0 ? <span className="text-green-500 font-semibold uppercase">Free</span> : `Rs ${shippingCost.toFixed(2)}`}
                </span>
              </div>
            </div>

            <div className="border-t border-border pt-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-2xl">Rs {total.toFixed(2)}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Including all taxes and duties.</p>
            </div>

            {/* Desktop Submit Button */}
            <button 
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className="hidden lg:flex w-full py-4 items-center justify-center bg-primary text-primary-foreground font-semibold rounded-[12px] hover:bg-primary/90 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : (
                'Place Order Now'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
