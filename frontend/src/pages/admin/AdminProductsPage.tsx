import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../lib/api';

export function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response: any = await apiClient.get('/products');
        setProducts(response.data.products);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-text-secondary">Loading products...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-accent mb-2">Products</h1>
          <p className="text-text-secondary">Manage your catalog, variants, and inventory.</p>
        </div>
        <Link 
          to="/admin/products/new" 
          className="bg-accent text-white px-6 py-3 rounded-xl font-medium hover:bg-accent/90 transition-colors shadow-lg hover:shadow-accent/20"
        >
          Add New Product
        </Link>
      </div>

      <div className="bg-surface rounded-2xl border border-white/5 overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              <th className="p-4 font-medium text-text-secondary">Product Name</th>
              <th className="p-4 font-medium text-text-secondary">Category</th>
              <th className="p-4 font-medium text-text-secondary">Variants</th>
              <th className="p-4 font-medium text-text-secondary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-text-secondary">
                  No products found. Start by adding one!
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-white">{product.name}</div>
                    <div className="text-sm text-text-secondary truncate max-w-xs">{product.slug}</div>
                  </td>
                  <td className="p-4 text-text-secondary">{product.category}</td>
                  <td className="p-4 text-text-secondary">{product.items?.length || 0}</td>
                  <td className="p-4">
                    <button className="text-accent hover:text-white transition-colors">Edit</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
