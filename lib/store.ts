import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// ============================================================================
// TYPES
// ============================================================================

export interface CartItem {
  id: string; // Unique cart item ID (generated)
  productId: number;
  variationId?: number;
  name: string;
  slug: string;
  price: number;
  regularPrice: number;
  quantity: number;
  image: string;
  sku?: string;
  attributes?: Record<string, string>; // For variations: { Color: "Black", Size: "Large" }
  maxQuantity?: number; // Stock limit
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
  isLoading: boolean;
}

export interface CartActions {
  // Item management
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  
  // UI
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  setLoading: (loading: boolean) => void;
  
  // Computed values (as functions for reactivity)
  getItemCount: () => number;
  getSubtotal: () => number;
  getItemById: (id: string) => CartItem | undefined;
  getItemByProduct: (productId: number, variationId?: number) => CartItem | undefined;
}

export type CartStore = CartState & CartActions;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function generateCartItemId(productId: number, variationId?: number, attributes?: Record<string, string>): string {
  const base = `${productId}`;
  if (variationId) return `${base}-${variationId}`;
  if (attributes) return `${base}-${JSON.stringify(attributes)}`;
  return base;
}

// ============================================================================
// STORE
// ============================================================================

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      isOpen: false,
      isLoading: false,

      // Add item to cart
      addItem: (item) => {
        const items = get().items;
        const id = generateCartItemId(item.productId, item.variationId, item.attributes);
        
        const existingIndex = items.findIndex((i) => i.id === id);

        if (existingIndex > -1) {
          // Update quantity if item exists
          const newItems = [...items];
          const existingItem = newItems[existingIndex];
          const newQuantity = existingItem.quantity + item.quantity;
          
          // Respect max quantity if set
          newItems[existingIndex] = {
            ...existingItem,
            quantity: existingItem.maxQuantity 
              ? Math.min(newQuantity, existingItem.maxQuantity)
              : newQuantity,
          };
          
          set({ items: newItems, isOpen: true });
        } else {
          // Add new item
          set({
            items: [...items, { ...item, id }],
            isOpen: true,
          });
        }
      },

      // Remove item from cart
      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      // Update item quantity
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }

        set({
          items: get().items.map((item) => {
            if (item.id !== id) return item;
            
            // Respect max quantity if set
            const newQuantity = item.maxQuantity 
              ? Math.min(quantity, item.maxQuantity)
              : quantity;
            
            return { ...item, quantity: newQuantity };
          }),
        });
      },

      // Clear all items
      clearCart: () => set({ items: [] }),

      // UI actions
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
      setLoading: (loading) => set({ isLoading: loading }),

      // Computed values
      getItemCount: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
      
      getSubtotal: () => 
        get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),
      
      getItemById: (id) => get().items.find((item) => item.id === id),
      
      getItemByProduct: (productId, variationId) => {
        const id = generateCartItemId(productId, variationId);
        return get().items.find((item) => item.id === id);
      },
    }),
    {
      name: "fdl-cart-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }), // Only persist items
    }
  )
);

// ============================================================================
// SELECTOR HOOKS (for optimized re-renders)
// ============================================================================

export const useCartItems = () => useCartStore((state) => state.items);
export const useCartIsOpen = () => useCartStore((state) => state.isOpen);
export const useCartIsLoading = () => useCartStore((state) => state.isLoading);
export const useCartItemCount = () => useCartStore((state) => state.getItemCount());
export const useCartSubtotal = () => useCartStore((state) => state.getSubtotal());

// ============================================================================
// UI STORE (for global UI state)
// ============================================================================

interface UIState {
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  activeModal: string | null;
}

interface UIActions {
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleSearch: () => void;
  closeSearch: () => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState & UIActions>()((set, get) => ({
  isMobileMenuOpen: false,
  isSearchOpen: false,
  activeModal: null,

  toggleMobileMenu: () => set({ isMobileMenuOpen: !get().isMobileMenuOpen }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  toggleSearch: () => set({ isSearchOpen: !get().isSearchOpen }),
  closeSearch: () => set({ isSearchOpen: false }),
  openModal: (modalId) => set({ activeModal: modalId }),
  closeModal: () => set({ activeModal: null }),
}));
