import { Link } from 'react-router-dom';
import type { Product } from '../api/products';
import { ShoppingCart } from 'lucide-react';
import { cn } from '../lib/utils';

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  // Try to find the first active item with media, otherwise just take the first item
  const displayItem = product.items.find((item) => item.media) || product.items[0];
  const price = displayItem ? displayItem.selling_price : '0.00';
  const imageUrl = displayItem?.media?.url || 'https://via.placeholder.com/400x600?text=No+Image';

  return (
    <div className={cn("group glass-card overflow-hidden flex flex-col h-full", className)}>
      <Link to={`/products/${product.slug}`} className="relative aspect-[3/4] overflow-hidden block">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Hover overlay with Add to Cart button */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
          <button 
            className="flex items-center gap-2 bg-background/90 text-foreground px-6 py-2.5 rounded-full font-medium shadow-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"
            onClick={(e) => {
              e.preventDefault();
              // Add to cart logic will go here in Phase 6
            }}
          >
            <ShoppingCart className="h-4 w-4" />
            Quick Add
          </button>
        </div>
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
        <div className="mt-auto pt-2 flex items-center justify-between">
          <p className="font-medium text-lg">
            Rs {price}
          </p>
          <div className="flex gap-1">
            {product.items.map((item) => (
              <span 
                key={item.id} 
                className="w-3 h-3 rounded-full border border-border"
                style={{ backgroundColor: item.color.toLowerCase() }}
                title={item.color}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
