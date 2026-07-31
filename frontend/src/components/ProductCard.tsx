import { Link } from 'react-router-dom';
import type { Product } from '../api/products';
import { ShoppingCart } from 'lucide-react';
import { cn } from '../lib/utils';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  // Try to find the first active item with media, otherwise just take the first item
  const displayItem = product.items.find((item) => item.media) || product.items[0];
  const price = displayItem ? displayItem.selling_price : '0.00';
  const imageUrl = displayItem?.media?.url || 'https://via.placeholder.com/400x600?text=No+Image';

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!displayItem) return;
    
    addItem({
      id: displayItem.id,
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      color: displayItem.color,
      product_code: displayItem.product_code,
      selling_price: displayItem.selling_price,
      image_url: imageUrl,
      quantity: 1
    });
    
    toast.success('Added to cart!');
  };

  return (
    <div className={cn("group bg-card overflow-hidden flex flex-col h-full rounded-[16px] shadow-sm hover:shadow-md transition-shadow hover:-translate-y-1 duration-300 border border-border", className)}>
      <Link to={`/products/${product.slug}`} className="relative aspect-[4/5] overflow-hidden block">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </Link>
      
      <div className="p-5 flex flex-col flex-1">
        <div className="text-xs font-medium text-muted-foreground mb-2 tracking-wider uppercase">
          {product.category}
        </div>
        <Link to={`/products/${product.slug}`} className="block group-hover:text-primary transition-colors">
          <h3 className="text-lg font-heading font-semibold leading-tight mb-2">
            {product.name}
          </h3>
        </Link>
        <div className="text-sm text-muted-foreground mb-4">
          {product.fabric || 'Premium Fabric'}
        </div>
        <div className="mt-auto pt-2 flex items-center justify-between">
          <p className="font-medium text-lg">
            Rs {price}
          </p>
          <div className="flex gap-1 items-center">
            {product.items.map((item) => (
              <span 
                key={item.id} 
                className="w-4 h-4 rounded-full border border-border shadow-sm"
                style={{ backgroundColor: item.color.toLowerCase() }}
                title={item.color}
              />
            ))}
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <button 
            onClick={handleQuickAdd}
            className="w-full bg-secondary text-secondary-foreground py-2.5 rounded-[12px] font-semibold hover:bg-secondary/90 transition-all cursor-pointer flex items-center justify-center gap-2 text-sm hover:scale-[1.02]"
          >
            <ShoppingCart className="h-4 w-4" /> Add to Cart
          </button>
          <Link 
            to={`/products/${product.slug}`}
            className="w-full text-center bg-primary text-primary-foreground py-2.5 rounded-[12px] font-semibold hover:bg-primary/90 transition-all cursor-pointer text-sm hover:scale-[1.02]"
          >
            Order Now
          </Link>
        </div>
      </div>
    </div>
  );
}
