import { useParams, Link } from 'react-router-dom';
import { useProduct } from '../api/products';
import { useState, useEffect } from 'react';
import { ShoppingCart, Check, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';

export function ProductDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, error } = useProduct(slug || '');
  
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const addItem = useCartStore((state) => state.addItem);

  // Set default item when product loads
  useEffect(() => {
    if (product && product.items.length > 0 && !selectedItemId) {
      setSelectedItemId(product.items[0].id);
    }
  }, [product, selectedItemId]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-muted-foreground">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="text-muted-foreground mb-8">The product you are looking for does not exist or has been removed.</p>
        <Link to="/products" className="px-6 py-2 bg-primary text-primary-foreground rounded-md">
          Return to Shop
        </Link>
      </div>
    );
  }

  const selectedItem = product.items.find(i => i.id === selectedItemId) || product.items[0];
  const imageUrl = selectedItem?.media?.url || 'https://via.placeholder.com/800x1000?text=No+Image';

  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!selectedItem) return;
    
    addItem({
      id: selectedItem.id,
      product_id: product.id,
      name: product.name,
      slug: product.slug,
      color: selectedItem.color,
      product_code: selectedItem.product_code,
      selling_price: selectedItem.selling_price,
      image_url: imageUrl,
      quantity: quantity
    });
    
    toast.success(`${quantity} ${quantity > 1 ? 'items' : 'item'} added to cart!`);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumbs */}
      <nav className="flex text-sm text-muted-foreground mb-8">
        <ol className="flex items-center space-x-2">
          <li><Link to="/" className="hover:text-foreground transition-colors">Home</Link></li>
          <li><ChevronRight className="h-4 w-4" /></li>
          <li><Link to="/products" className="hover:text-foreground transition-colors">Products</Link></li>
          <li><ChevronRight className="h-4 w-4" /></li>
          <li className="text-foreground font-medium truncate">{product.name}</li>
        </ol>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        
        {/* Image Gallery */}
        <div className="lg:w-1/2 flex-shrink-0">
          <div className="aspect-[4/5] bg-muted rounded-[16px] overflow-hidden border border-border group cursor-zoom-in shadow-md">
            <img 
              src={imageUrl} 
              alt={product.name} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.15]"
              key={imageUrl}
            />
          </div>
          {/* Thumbnails could go here in a future iteration */}
        </div>

        {/* Product Info */}
        <div className="lg:w-1/2 flex flex-col pt-4">
          <div className="mb-2 text-sm font-semibold tracking-widest text-primary uppercase">
            {product.category}
          </div>
          <h1 className="text-4xl sm:text-5xl font-heading font-bold mb-4 leading-tight">
            {product.name}
          </h1>
          
          <div className="text-2xl font-medium mb-8 flex items-baseline gap-2">
            Rs {selectedItem?.selling_price || '0.00'}
            <span className="text-sm text-muted-foreground font-normal">tax included</span>
          </div>

          {/* Color Selection */}
          {product.items.length > 1 && (
            <div className="mb-8">
              <h3 className="text-sm font-medium mb-3">Color: <span className="text-muted-foreground">{selectedItem?.color}</span></h3>
              <div className="flex flex-wrap gap-3">
                {product.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItemId(item.id)}
                    className={cn(
                      "w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all",
                      selectedItemId === item.id ? "border-primary scale-110" : "border-border hover:border-muted-foreground"
                    )}
                    style={{ backgroundColor: item.color.toLowerCase() }}
                    title={item.color}
                  >
                    {selectedItemId === item.id && (
                      <Check className={cn("h-4 w-4", item.color.toLowerCase() === 'white' ? 'text-black' : 'text-white')} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="mb-8">
            <h3 className="text-sm font-medium mb-3">Quantity</h3>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
              >-</button>
              <span className="font-semibold w-4 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
              >+</button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button 
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-8 py-4 rounded-[12px] font-semibold hover:bg-secondary/90 transition-all hover:scale-[1.02] shadow-sm cursor-pointer"
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-[12px] font-semibold hover:bg-primary/90 transition-all hover:scale-[1.02] shadow-sm cursor-pointer">
              Order Now
            </button>
          </div>

          {/* Description & Details */}
          <div className="space-y-6 border-t border-border pt-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description || 'No description available for this premium piece.'}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="glass p-4 rounded-lg border border-border">
                <span className="text-sm text-muted-foreground block mb-1">Fabric</span>
                <span className="font-medium">{product.fabric}</span>
              </div>
              <div className="glass p-4 rounded-lg border border-border">
                <span className="text-sm text-muted-foreground block mb-1">Season</span>
                <span className="font-medium">{product.season}</span>
              </div>
              <div className="glass p-4 rounded-lg border border-border col-span-2">
                <span className="text-sm text-muted-foreground block mb-1">Product Code</span>
                <span className="font-medium font-mono">{selectedItem?.product_code}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Similar Products Section Placeholder */}
      <div className="mt-24 mb-12 border-t border-border pt-16">
        <h2 className="text-3xl font-heading font-bold mb-8">Similar Products</h2>
        <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed border-border text-muted-foreground">
          Similar products will be loaded here dynamically.
        </div>
      </div>
    </div>
  );
}
