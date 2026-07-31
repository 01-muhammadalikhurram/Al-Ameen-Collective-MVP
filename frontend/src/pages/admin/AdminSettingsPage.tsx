import { useState } from 'react';
import { Globe, DollarSign, Truck, Megaphone, Plus, Trash2, Save, Shield } from 'lucide-react';
import { 
  useAdminSettings, 
  useUpdateWebsiteSettings, 
  useUpdatePricingRule, 
  useCreateDeliveryRule, 
  useDeleteDeliveryRule,
  useCreateAnnouncement,
  useUpdateAnnouncement,
  useDeleteAnnouncement
} from '../../api/settings';
import { useUpdateProfile } from '../../api/auth';
import { toast } from 'react-hot-toast';

export function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'website' | 'pricing' | 'delivery' | 'announcements' | 'security'>('website');
  
  const { data, isLoading } = useAdminSettings();

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!data) return <div className="text-center py-8">Failed to load settings</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-3xl font-heading font-bold text-foreground">Settings Module</h1>
          <p className="text-muted-foreground mt-1">Configure business rules, website appearance, and pricing globally.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-border overflow-x-auto pb-px scrollbar-hide">
        <TabButton 
          active={activeTab === 'website'} 
          onClick={() => setActiveTab('website')} 
          icon={<Globe className="h-4 w-4 mr-2" />} 
          label="Website Info" 
        />
        <TabButton 
          active={activeTab === 'pricing'} 
          onClick={() => setActiveTab('pricing')} 
          icon={<DollarSign className="h-4 w-4 mr-2" />} 
          label="Global Pricing" 
        />
        <TabButton 
          active={activeTab === 'delivery'} 
          onClick={() => setActiveTab('delivery')} 
          icon={<Truck className="h-4 w-4 mr-2" />} 
          label="Delivery Rules" 
        />
        <TabButton 
          active={activeTab === 'announcements'} 
          onClick={() => setActiveTab('announcements')} 
          icon={<Megaphone className="h-4 w-4 mr-2" />} 
          label="Announcements" 
        />
        <TabButton 
          active={activeTab === 'security'} 
          onClick={() => setActiveTab('security')} 
          icon={<Shield className="h-4 w-4 mr-2" />} 
          label="Security" 
        />
      </div>

      {/* Content Area */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        {activeTab === 'website' && <WebsiteSettingsTab settings={data.settings} />}
        {activeTab === 'pricing' && <PricingSettingsTab rule={data.pricingRule} />}
        {activeTab === 'delivery' && <DeliveryRulesTab rules={data.deliveryRules} />}
        {activeTab === 'announcements' && <AnnouncementsTab announcements={data.announcements} />}
        {activeTab === 'security' && <SecurityTab />}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// UI Components
// ----------------------------------------------------------------------

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors
        ${active 
          ? 'border-primary text-primary bg-primary/5' 
          : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}

// ----------------------------------------------------------------------
// Tabs
// ----------------------------------------------------------------------

function WebsiteSettingsTab({ settings }: { settings: any }) {
  const updateMutation = useUpdateWebsiteSettings();
  const [formData, setFormData] = useState({
    business_name: settings.business_name,
    whatsapp_number: settings.whatsapp_number,
    default_delivery_charge: Number(settings.default_delivery_charge),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData, {
      onSuccess: () => toast.success('Website settings updated'),
      onError: () => toast.error('Failed to update settings')
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Business Name</label>
          <input
            type="text"
            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={formData.business_name}
            onChange={(e) => setFormData({...formData, business_name: e.target.value})}
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">WhatsApp Number (e.g. +923001234567)</label>
          <input
            type="text"
            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={formData.whatsapp_number}
            onChange={(e) => setFormData({...formData, whatsapp_number: e.target.value})}
            required
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Default Delivery Charge (Rs)</label>
          <input
            type="number"
            className="flex h-10 w-full md:w-1/2 rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={formData.default_delivery_charge}
            onChange={(e) => setFormData({...formData, default_delivery_charge: Number(e.target.value)})}
            min="0"
            required
          />
          <p className="text-xs text-muted-foreground mt-1">This applies to all orders unless modified by a Delivery Rule.</p>
        </div>
      </div>
      <div className="pt-4 border-t border-border flex justify-end">
        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {updateMutation.isPending ? 'Saving...' : <><Save className="mr-2 h-4 w-4" /> Save Settings</>}
        </button>
      </div>
    </form>
  );
}

function PricingSettingsTab({ rule }: { rule: any }) {
  const updateMutation = useUpdatePricingRule();
  const [globalProfit, setGlobalProfit] = useState(Number(rule?.global_profit || 0));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({ global_profit: globalProfit }, {
      onSuccess: () => toast.success('Global pricing rule updated'),
      onError: () => toast.error('Failed to update pricing')
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium">Global Profit Margin</h3>
          <p className="text-sm text-muted-foreground">
            This amount is automatically added to the wholesale price of all products. Specific product overrides (if implemented) will take precedence.
          </p>
        </div>
        
        <div className="bg-muted p-6 rounded-lg border border-border inline-block min-w-[300px]">
          <label className="text-sm font-medium block mb-2 text-foreground">Global Profit Amount (Rs)</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">Rs</span>
            <input
              type="number"
              className="flex h-12 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={globalProfit}
              onChange={(e) => setGlobalProfit(Number(e.target.value))}
              min="0"
              required
            />
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-border flex justify-start">
        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {updateMutation.isPending ? 'Saving...' : <><Save className="mr-2 h-4 w-4" /> Update Pricing</>}
        </button>
      </div>
    </form>
  );
}

function DeliveryRulesTab({ rules }: { rules: any[] }) {
  const createMutation = useCreateDeliveryRule();
  const deleteMutation = useDeleteDeliveryRule();
  const [minOrder, setMinOrder] = useState('');
  const [discount, setDiscount] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      minimum_order: Number(minOrder),
      discount_percentage: Number(discount)
    }, {
      onSuccess: () => {
        toast.success('Rule added');
        setMinOrder('');
        setDiscount('');
      },
      onError: () => toast.error('Failed to add rule')
    });
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this rule?')) {
      deleteMutation.mutate(id, {
        onSuccess: () => toast.success('Rule deleted'),
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      
      {/* Existing Rules */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Active Discount Rules</h3>
        {rules.length === 0 ? (
          <p className="text-sm text-muted-foreground p-4 bg-muted rounded border border-border">No rules defined. Standard delivery charge will apply to all orders.</p>
        ) : (
          <div className="border border-border rounded-lg divide-y divide-border overflow-hidden">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Condition</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Discount</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {rules.map((rule) => (
                  <tr key={rule.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      Order total &ge; Rs {Number(rule.minimum_order).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-primary font-semibold">
                      {Number(rule.discount_percentage)}% OFF
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button 
                        onClick={() => handleDelete(rule.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add New Rule */}
      <div className="bg-muted/50 p-6 rounded-lg border border-border">
        <h4 className="text-md font-medium mb-4">Add New Rule</h4>
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="w-full sm:w-1/3">
            <label className="text-xs font-medium mb-1 block">Minimum Order (Rs)</label>
            <input
              type="number"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={minOrder}
              onChange={(e) => setMinOrder(e.target.value)}
              placeholder="e.g. 5000"
              required
            />
          </div>
          <div className="w-full sm:w-1/3">
            <label className="text-xs font-medium mb-1 block">Discount Percentage (%)</label>
            <input
              type="number"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              placeholder="e.g. 100 for Free Delivery"
              min="1"
              max="100"
              required
            />
          </div>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="w-full sm:w-auto h-10 inline-flex items-center justify-center rounded-md bg-secondary text-secondary-foreground px-4 py-2 text-sm font-medium hover:bg-secondary/80 transition-colors"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Rule
          </button>
        </form>
      </div>
    </div>
  );
}

function AnnouncementsTab({ announcements }: { announcements: any[] }) {
  const createMutation = useCreateAnnouncement();
  const updateMutation = useUpdateAnnouncement();
  const deleteMutation = useDeleteAnnouncement();
  
  const [message, setMessage] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ message, active: true, display_order: announcements.length }, {
      onSuccess: () => {
        toast.success('Announcement added');
        setMessage('');
      },
      onError: () => toast.error('Failed to add announcement')
    });
  };

  const handleToggle = (id: string, active: boolean) => {
    updateMutation.mutate({ id, active: !active });
  };

  const handleDelete = (id: string) => {
    if (confirm('Delete this announcement?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Website Announcements</h3>
        <p className="text-sm text-muted-foreground">These messages will scroll or appear in the ribbon at the top of the public website.</p>
        
        {/* Add New */}
        <form onSubmit={handleAdd} className="flex gap-4">
          <input
            type="text"
            className="flex h-10 flex-1 rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type new announcement..."
            required
          />
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="h-10 inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors shrink-0"
          >
            <Plus className="mr-2 h-4 w-4" /> Add
          </button>
        </form>
      </div>

      {/* List */}
      <div className="border border-border rounded-lg divide-y divide-border">
        {announcements.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground text-sm">No announcements found.</div>
        ) : (
          announcements.map((ann) => (
            <div key={ann.id} className="p-4 flex items-center justify-between gap-4 bg-card hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <button
                  onClick={() => handleToggle(ann.id, ann.active)}
                  className={`shrink-0 rounded-full w-10 h-6 transition-colors relative ${ann.active ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                >
                  <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${ann.active ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
                <p className={`text-sm font-medium truncate ${ann.active ? 'text-foreground' : 'text-muted-foreground line-through'}`}>
                  {ann.message}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button 
                  onClick={() => handleDelete(ann.id)}
                  className="text-red-500 hover:text-red-700 p-2 rounded transition-colors hover:bg-red-50"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function SecurityTab() {
  const updateMutation = useUpdateProfile();
  const [formData, setFormData] = useState({
    username: '',
    currentPassword: '',
    newPassword: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username && !formData.newPassword) {
      toast.error('Please enter a new username or new password');
      return;
    }
    
    updateMutation.mutate(formData, {
      onSuccess: () => {
        toast.success('Admin credentials updated successfully');
        setFormData({ username: '', currentPassword: '', newPassword: '' });
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || 'Failed to update credentials');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6 max-w-xl">
      <div>
        <h3 className="text-lg font-medium text-foreground mb-1">Admin Credentials</h3>
        <p className="text-sm text-muted-foreground">
          Update your login username and password. You must provide your current password to change your password.
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">New Username (Optional)</label>
          <input
            type="text"
            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            placeholder="Leave blank to keep current"
          />
        </div>

        <div className="space-y-2 pt-4 border-t border-border">
          <label className="text-sm font-medium text-destructive">Current Password (Required if changing password)</label>
          <input
            type="password"
            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={formData.currentPassword}
            onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
            placeholder="••••••••"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">New Password (Optional)</label>
          <input
            type="password"
            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={formData.newPassword}
            onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
            placeholder="Leave blank to keep current"
          />
        </div>
      </div>
      
      <div className="pt-4 border-t border-border flex justify-end">
        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {updateMutation.isPending ? 'Updating...' : <><Shield className="mr-2 h-4 w-4" /> Update Credentials</>}
        </button>
      </div>
    </form>
  );
}
