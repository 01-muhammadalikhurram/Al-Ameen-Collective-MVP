import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/api';

export function AdminProductCreatePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Main product details
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [summaryDesc, setSummaryDesc] = useState('');
  const [fabric, setFabric] = useState('');
  const [category, setCategory] = useState('');
  const [season, setSeason] = useState('');

  // Dynamic variants
  const [items, setItems] = useState<any[]>([
    { color: '', product_code: '', wholesale_price: 0, additional_profit: 0, file: null }
  ]);

  const addItem = () => {
    setItems([...items, { color: '', product_code: '', wholesale_price: 0, additional_profit: 0, file: null }]);
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      
      // We will map files to an array and reference their index
      const productPayload = {
        name,
        description,
        summary_desc: summaryDesc,
        fabric,
        category,
        season,
        items: items.map((item, index) => {
          if (item.file) {
            formData.append('images', item.file);
            return {
              product_code: item.product_code,
              color: item.color,
              wholesale_price: Number(item.wholesale_price),
              additional_profit: Number(item.additional_profit),
              fileIndex: index, // Since we append sequentially, the index matches
            };
          }
          return {
            product_code: item.product_code,
            color: item.color,
            wholesale_price: Number(item.wholesale_price),
            additional_profit: Number(item.additional_profit),
          };
        })
      };

      formData.append('data', JSON.stringify(productPayload));

      await apiClient.post('/admin/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate('/admin/products');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create product. Check console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-accent mb-2">Add New Product</h1>
        <p className="text-text-secondary">Fill in the details below to add a product to your catalog.</p>
      </div>

      {error && (
        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Core Details Section */}
        <div className="bg-surface p-8 rounded-2xl border border-white/5 shadow-xl space-y-6">
          <h2 className="text-xl font-bold text-white border-b border-white/5 pb-4">Core Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Product Name</label>
              <input required value={name} onChange={e => setName(e.target.value)} type="text" className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent" placeholder="e.g. Classic Cotton Kameez" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Summary Description (For Cards)</label>
              <input value={summaryDesc} onChange={e => setSummaryDesc(e.target.value)} type="text" className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent" placeholder="Short and catchy..." />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Full Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent" placeholder="Detailed product description..."></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Fabric</label>
              <input required value={fabric} onChange={e => setFabric(e.target.value)} type="text" className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent" placeholder="e.g. 100% Egyptian Cotton" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Category</label>
              <input required value={category} onChange={e => setCategory(e.target.value)} type="text" className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent" placeholder="e.g. Unstitched" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-2">Season</label>
              <input required value={season} onChange={e => setSeason(e.target.value)} type="text" className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-accent" placeholder="e.g. Summer 2026" />
            </div>
          </div>
        </div>

        {/* Variants Section */}
        <div className="bg-surface p-8 rounded-2xl border border-white/5 shadow-xl space-y-6">
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <h2 className="text-xl font-bold text-white">Product Variants (Colors/Codes)</h2>
            <button type="button" onClick={addItem} className="text-accent hover:text-white font-medium text-sm transition-colors">
              + Add Another Variant
            </button>
          </div>
          
          <div className="space-y-8">
            {items.map((item, index) => (
              <div key={index} className="p-6 bg-background rounded-xl border border-white/5 relative">
                {items.length > 1 && (
                  <button type="button" onClick={() => removeItem(index)} className="absolute top-4 right-4 text-red-500 hover:text-red-400">
                    ✕
                  </button>
                )}
                
                <h3 className="text-sm font-bold text-text-secondary mb-4 uppercase tracking-wider">Variant {index + 1}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-2">Color</label>
                    <input required value={item.color} onChange={e => updateItem(index, 'color', e.target.value)} type="text" className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent" placeholder="e.g. Midnight Blue" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-2">Product Code (SKU)</label>
                    <input required value={item.product_code} onChange={e => updateItem(index, 'product_code', e.target.value)} type="text" className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent" placeholder="e.g. AAC-MB-001" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-2">Wholesale Price (PKR)</label>
                    <input required min="0" value={item.wholesale_price} onChange={e => updateItem(index, 'wholesale_price', e.target.value)} type="number" className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-secondary mb-2">Special Profit (0 = use Global)</label>
                    <input min="0" value={item.additional_profit} onChange={e => updateItem(index, 'additional_profit', e.target.value)} type="number" className="w-full bg-surface border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-accent" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-secondary mb-2">Product Image</label>
                  <input type="file" accept="image/*" onChange={e => updateItem(index, 'file', e.target.files?.[0] || null)} className="w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-white/5 file:text-white hover:file:bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" disabled={loading} className="bg-accent text-white px-8 py-4 rounded-xl font-medium hover:bg-accent/90 transition-colors shadow-lg shadow-accent/20 disabled:opacity-50 flex items-center gap-2">
            {loading ? 'Saving Product...' : 'Save Product & Publish'}
          </button>
        </div>
      </form>
    </div>
  );
}
