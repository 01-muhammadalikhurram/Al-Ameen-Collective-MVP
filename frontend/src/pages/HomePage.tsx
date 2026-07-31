import { Link } from 'react-router-dom';
import { useProducts } from '../api/products';
import { ProductCard } from '../components/ProductCard';

export function HomePage() {
  const { data, isLoading } = useProducts({ limit: 4 });

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] w-full flex items-center overflow-hidden">
        {/* Placeholder Hero Background */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-white/70" /> {/* Light overlay */}
        
        <div className="relative z-10 text-left px-4 sm:px-6 lg:px-16 max-w-5xl space-y-6">
          <div className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold tracking-wide border border-primary/20">
            ✨ Premium Collection
          </div>
          <h1 className="text-5xl md:text-[60px] leading-tight font-heading font-bold tracking-tight text-primary">
            Elegance Woven<br/>Into Every Thread.
          </h1>
          <p className="text-lg md:text-xl text-primary/80 max-w-2xl font-sans">
            Discover our curated collection of high-end fabrics, stunning designs, and timeless elegance for the modern individual.
          </p>
          <div className="pt-4">
            <Link 
              to="/products" 
              className="inline-block px-10 py-4 bg-primary text-primary-foreground font-semibold rounded-[12px] hover:bg-primary/90 transition-all hover:scale-[1.02] cursor-pointer shadow-lg shadow-primary/20"
            >
              Shop Catalog
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="aspect-[4/5] rounded-[16px] bg-muted animate-pulse" />
            ))}
          </div>
        ) : data?.products && data.products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.products.slice(0, 3).map((product) => (
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
    </div>
  );
}
