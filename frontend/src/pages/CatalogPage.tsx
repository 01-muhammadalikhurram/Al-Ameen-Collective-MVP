import { useSearchParams } from 'react-router-dom';
import { useProducts } from '../api/products';
import { ProductCard } from '../components/ProductCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const category = searchParams.get('category') || undefined;
  const season = searchParams.get('season') || undefined;
  const search = searchParams.get('search') || undefined;
  const page = Number(searchParams.get('page')) || 1;

  const [searchInput, setSearchInput] = useState(search || '');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data, isLoading } = useProducts({ category, season, search, page });

  const updateFilters = (key: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.delete('page'); // Reset page on filter change
    setSearchParams(newParams);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters('search', searchInput || null);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
    setSearchInput('');
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-heading font-bold mb-4">Our Collection</h1>
        <p className="text-muted-foreground text-lg">
          Explore our premium range of meticulously crafted fabrics.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex items-center gap-2">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-md font-medium"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
        </div>

        {/* Sidebar */}
        <aside className={`lg:w-64 flex-shrink-0 ${isFilterOpen ? 'block' : 'hidden'} lg:block`}>
          <div className="sticky top-24 space-y-8 p-6 bg-card border border-border rounded-xl">
            
            <div className="flex items-center justify-between lg:hidden mb-4">
              <h2 className="font-semibold text-lg">Filters</h2>
              <button onClick={() => setIsFilterOpen(false)}><X className="h-5 w-5"/></button>
            </div>

            {/* Search */}
            <div>
              <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider text-muted-foreground">Search</h3>
              <form onSubmit={handleSearch} className="relative">
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              </form>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider text-muted-foreground">Category</h3>
              <div className="space-y-2">
                {['Stitched', 'Unstitched', 'Accessories'].map((cat) => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="category"
                      checked={category === cat.toLowerCase()}
                      onChange={() => updateFilters('category', cat.toLowerCase())}
                      className="text-primary focus:ring-primary h-4 w-4"
                    />
                    <span className="text-sm group-hover:text-primary transition-colors">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Season */}
            <div>
              <h3 className="text-sm font-semibold mb-3 uppercase tracking-wider text-muted-foreground">Season</h3>
              <div className="space-y-2">
                {['Summer', 'Winter', 'Festive', 'All Season'].map((s) => (
                  <label key={s} className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="season"
                      checked={season === s.toLowerCase().replace(' ', '-')}
                      onChange={() => updateFilters('season', s.toLowerCase().replace(' ', '-'))}
                      className="text-primary focus:ring-primary h-4 w-4"
                    />
                    <span className="text-sm group-hover:text-primary transition-colors">{s}</span>
                  </label>
                ))}
              </div>
            </div>

            {(category || season || search) && (
              <button 
                onClick={clearFilters}
                className="w-full py-2 text-sm text-destructive font-medium hover:bg-destructive/10 rounded-md transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : data?.products && data.products.length > 0 ? (
            <>
              <div className="mb-4 text-sm text-muted-foreground">
                Showing <span className="font-medium text-foreground">{data.products.length}</span> results
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {data.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {/* Pagination Controls */}
              {data.pagination.totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <button 
                    disabled={data.pagination.page === 1}
                    onClick={() => updateFilters('page', String(data.pagination.page - 1))}
                    className="px-4 py-2 border border-border rounded-md hover:bg-accent disabled:opacity-50 transition-colors"
                  >
                    Previous
                  </button>
                  <span className="text-sm px-4">
                    Page {data.pagination.page} of {data.pagination.totalPages}
                  </span>
                  <button 
                    disabled={data.pagination.page === data.pagination.totalPages}
                    onClick={() => updateFilters('page', String(data.pagination.page + 1))}
                    className="px-4 py-2 border border-border rounded-md hover:bg-accent disabled:opacity-50 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-border rounded-xl bg-card">
              <Search className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-xl font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground max-w-md">
                We couldn't find any products matching your current filters. Try broadening your search or clearing the filters.
              </p>
              <button 
                onClick={clearFilters}
                className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
