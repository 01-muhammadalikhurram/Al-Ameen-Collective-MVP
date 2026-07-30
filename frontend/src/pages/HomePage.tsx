import { Link } from 'react-router-dom';
import { useProducts } from '../api/products';
import { ProductCard } from '../components/ProductCard';

export function HomePage() {
  const { data, isLoading } = useProducts({ limit: 4 });

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
        {/* Placeholder Hero Background */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-black/40" /> {/* Dark overlay for text readability */}
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight">
            Premium Luxury, <br/> Delivered to You.
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
            Discover our curated collection of high-end fabrics, stunning designs, and timeless elegance.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/products" 
              className="px-8 py-4 bg-white text-black font-semibold rounded-md hover:bg-white/90 transition-colors"
            >
              Shop New Arrivals
            </Link>
            <Link 
              to="/products?category=unstitched" 
              className="px-8 py-4 bg-black/30 backdrop-blur-md border border-white/30 text-white font-semibold rounded-md hover:bg-black/50 transition-colors"
            >
              View Unstitched
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-heading font-bold gradient-text">New Arrivals</h2>
            <p className="text-muted-foreground mt-2">The latest additions to our collective.</p>
          </div>
          <Link to="/products" className="hidden sm:block text-sm font-medium hover:text-primary transition-colors">
            View All Products &rarr;
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : data?.products && data.products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {data.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-xl">
            No products available yet.
          </div>
        )}
        
        <div className="mt-8 text-center sm:hidden">
          <Link to="/products" className="text-sm font-medium hover:text-primary transition-colors">
            View All Products &rarr;
          </Link>
        </div>
      </section>

      {/* Categories Banners */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link to="/products?category=stitched" className="group relative aspect-[16/9] overflow-hidden rounded-2xl">
              <img 
                src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=2070&auto=format&fit=crop" 
                alt="Stitched" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 transition-opacity group-hover:bg-black/40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-3xl font-heading font-bold text-white tracking-widest uppercase">Stitched</h3>
              </div>
            </Link>
            <Link to="/products?category=unstitched" className="group relative aspect-[16/9] overflow-hidden rounded-2xl">
              <img 
                src="https://images.unsplash.com/photo-1593030103066-0093718efeb9?q=80&w=2080&auto=format&fit=crop" 
                alt="Unstitched" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 transition-opacity group-hover:bg-black/40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-3xl font-heading font-bold text-white tracking-widest uppercase">Unstitched</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
