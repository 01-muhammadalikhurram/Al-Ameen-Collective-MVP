import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminProducts, useUpdateProductStatus, useDeleteProduct } from '../../api/admin';
import type { ProductStatus } from '../../api/admin';
import { toast } from 'react-hot-toast';
import { Trash2 } from 'lucide-react';

export function AdminProductsPage() {
  const [page] = useState(1);
  const { data, isLoading } = useAdminProducts({ page, limit: 12 });
  const updateStatusMutation = useUpdateProductStatus();
  const deleteMutation = useDeleteProduct();

  const handleToggleStatus = (id: string, currentStatus: ProductStatus) => {
    const newStatus: ProductStatus = currentStatus === 'ACTIVE' ? 'ARCHIVED' : 'ACTIVE';
    updateStatusMutation.mutate({ id, status: newStatus }, {
      onSuccess: () => toast.success(`Product marked as ${newStatus === 'ACTIVE' ? 'Available' : 'Unavailable'}`),
      onError: () => toast.error('Failed to update product status')
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product? This will mark it as archived.')) {
      deleteMutation.mutate(id, {
        onSuccess: () => toast.success('Product deleted (archived) successfully'),
        onError: () => toast.error('Failed to delete product')
      });
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading products...</div>;
  }

  const products = data?.products || [];

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Products</h1>
          <p className="text-muted-foreground">Manage your catalog, variants, and inventory.</p>
        </div>
        <Link 
          to="/admin/products/new" 
          className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-lg hover:shadow-primary/20 flex-shrink-0"
        >
          Add New Product
        </Link>
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-border bg-white/5">
                <th className="p-4 font-medium text-muted-foreground">Product Details</th>
                <th className="p-4 font-medium text-muted-foreground">Category</th>
                <th className="p-4 font-medium text-muted-foreground">Variants</th>
                <th className="p-4 font-medium text-muted-foreground">Status</th>
                <th className="p-4 font-medium text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    No products found. Start by adding one!
                  </td>
                </tr>
              ) : (
                products.map((product: any) => (
                  <tr key={product.id} className={`border-b border-border transition-colors ${product.status !== 'ACTIVE' ? 'bg-muted/20 opacity-80' : 'hover:bg-white/5'}`}>
                    <td className="p-4">
                      <div className="font-medium text-foreground">{product.name}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-[200px]" title={product.slug}>{product.slug}</div>
                    </td>
                    <td className="p-4 text-muted-foreground">{product.category}</td>
                    <td className="p-4">
                      <div className="text-sm">
                        {product.items?.length || 0} variant(s)
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {product.items?.map((i: any) => i.color).join(', ')}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${product.status === 'ACTIVE' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                        {product.status === 'ACTIVE' ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-3">
                      <Link 
                        to={`/admin/products/${product.id}/edit`}
                        className="text-accent hover:text-white transition-colors"
                      >
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleToggleStatus(product.id, product.status)}
                        className={`text-sm font-medium transition-colors ${product.status === 'ACTIVE' ? 'text-orange-400 hover:text-orange-300' : 'text-green-400 hover:text-green-300'}`}
                        disabled={updateStatusMutation.isPending}
                      >
                        {product.status === 'ACTIVE' ? 'Make Unavailable' : 'Make Available'}
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="text-red-500 hover:text-red-400 p-2 rounded transition-colors hover:bg-red-500/10"
                        title="Delete (Archive)"
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
