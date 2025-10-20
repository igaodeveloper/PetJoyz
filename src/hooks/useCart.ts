import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
}

interface CartStore {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (id: string | number) => number;
  getCartTotal: () => number;
  getCartCount: () => number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      
      addToCart: (item) => {
        const { cart } = get();
        const existingItemIndex = cart.findIndex((cartItem) => cartItem.id === item.id);
        
        if (existingItemIndex >= 0) {
          // Item already in cart, update quantity
          const updatedCart = [...cart];
          updatedCart[existingItemIndex].quantity += 1;
          set({ cart: updatedCart });
        } else {
          // Add new item to cart
          set({ cart: [...cart, { ...item, quantity: 1 }] });
        }
      },
      
      removeFromCart: (id) => {
        const { cart } = get();
        set({ cart: cart.filter((item) => item.id !== id) });
      },
      
      updateQuantity: (id, quantity) => {
        if (quantity < 1) return;
        
        const { cart } = get();
        const updatedCart = cart.map((item) =>
          item.id === id ? { ...item, quantity } : item
        );
        
        set({ cart: updatedCart });
      },
      
      clearCart: () => {
        set({ cart: [] });
      },
      
      getItemQuantity: (id) => {
        const { cart } = get();
        return cart.find((item) => item.id === id)?.quantity || 0;
      },
      
      getCartTotal: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      
      getCartCount: () => {
        const { cart } = get();
        return cart.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'petjoyz-cart', // name of the item in the storage (must be unique)
    }
  )
);
