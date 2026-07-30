import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export function OrderSuccessPage() {
  const { publicId } = useParams();

  return (
    <div className="container mx-auto px-4 py-24 min-h-[70vh] flex flex-col items-center justify-center text-center">
      <div className="w-24 h-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-8 shadow-sm">
        <CheckCircle2 className="h-12 w-12" />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4 tracking-tight">Order Confirmed!</h1>
      
      <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
        Thank you for your purchase. We've received your order and our team is preparing it for shipment.
      </p>

      <div className="bg-card/50 backdrop-blur-md border border-border rounded-xl p-6 mb-10 min-w-[300px] shadow-sm">
        <p className="text-sm text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Order Number</p>
        <p className="text-2xl font-mono font-bold text-primary">{publicId}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          to="/products" 
          className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-md hover:bg-primary/90 transition-colors shadow-lg"
        >
          Continue Shopping
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
