import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // The product item ID (variant ID)
  product_id: string;
  name: string;
  slug: string;
  color: string;
  product_code: string;
  selling_price: string;
  quantity: number;
  image_url: string;
}

interface CartState {
  items: CartItem[];
  updatedAt: number;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  checkExpiry: (expiryDays: number) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      updatedAt: Date.now(),
      
      addItem: (item) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((i) => i.id === item.id);
        
        if (existingItem) {
          set({
            items: currentItems.map((i) => 
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
            updatedAt: Date.now(),
          });
        } else {
          set({
            items: [...currentItems, { ...item, quantity: 1 }],
            updatedAt: Date.now(),
          });
        }
      },
      
      removeItem: (id) => {
        set({
          items: get().items.filter((i) => i.id !== id),
          updatedAt: Date.now(),
        });
      },
      
      updateQuantity: (id, quantity) => {
        if (quantity < 1) return;
        set({
          items: get().items.map((i) => 
            i.id === id ? { ...i, quantity } : i
          ),
          updatedAt: Date.now(),
        });
      },
      
      clearCart: () => {
        set({ items: [], updatedAt: Date.now() });
      },
      
      checkExpiry: (expiryDays: number) => {
        const { updatedAt, items } = get();
        if (items.length === 0) return;
        
        const now = Date.now();
        const maxAge = expiryDays * 24 * 60 * 60 * 1000;
        
        if (now - updatedAt > maxAge) {
          console.log(`Cart expired after ${expiryDays} days. Clearing cart.`);
          get().clearCart();
        }
      },
    }),
    {
      name: 'al-ameen-cart',
    }
  )
);
