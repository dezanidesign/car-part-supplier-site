"use client";

import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import type { WooProduct } from "@/lib/woo";

type CartItem = {
  productId: number;
  slug: string;
  name: string;
  price: number; // numeric
  image?: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
};

type CartAction =
  | { type: "ADD"; payload: { product: WooProduct; quantity?: number } }
  | { type: "REMOVE"; payload: { productId: number } }
  | { type: "SET_QTY"; payload: { productId: number; quantity: number } }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; payload: CartState };

const CART_STORAGE_KEY = "fdl_cart_v1";

function toNumberPrice(p: WooProduct) {
  const raw = p.sale_price || p.price || "0";
  const n = Number.parseFloat(String(raw));
  return Number.isFinite(n) ? n : 0;
}

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return action.payload;

    case "ADD": {
      const qty = action.payload.quantity ?? 1;
      const p = action.payload.product;

      const item: CartItem = {
        productId: p.id,
        slug: p.slug,
        name: p.name,
        price: toNumberPrice(p),
        image: p.images?.[0]?.src,
        quantity: qty,
      };

      const existing = state.items.find((x) => x.productId === item.productId);
      if (!existing) return { ...state, items: [...state.items, item] };

      return {
        ...state,
        items: state.items.map((x) =>
          x.productId === item.productId ? { ...x, quantity: x.quantity + qty } : x
        ),
      };
    }

    case "REMOVE":
      return { ...state, items: state.items.filter((x) => x.productId !== action.payload.productId) };

    case "SET_QTY": {
      const q = Math.max(1, Math.floor(action.payload.quantity || 1));
      return {
        ...state,
        items: state.items.map((x) =>
          x.productId === action.payload.productId ? { ...x, quantity: q } : x
        ),
      };
    }

    case "CLEAR":
      return { items: [] };

    default:
      return state;
  }
}

const CartContext = createContext<{
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  add: (product: WooProduct, quantity?: number) => void;
  remove: (productId: number) => void;
  setQty: (productId: number, quantity: number) => void;
  clear: () => void;
} | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });

  // hydrate
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as CartState;
      if (parsed?.items?.length) dispatch({ type: "HYDRATE", payload: parsed });
    } catch {}
  }, []);

  // persist
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  const value = useMemo(() => {
    const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);

    return {
      items: state.items,
      subtotal,
      itemCount,
      add: (product: WooProduct, quantity?: number) => dispatch({ type: "ADD", payload: { product, quantity } }),
      remove: (productId: number) => dispatch({ type: "REMOVE", payload: { productId } }),
      setQty: (productId: number, quantity: number) => dispatch({ type: "SET_QTY", payload: { productId, quantity } }),
      clear: () => dispatch({ type: "CLEAR" }),
    };
  }, [state.items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider />");
  return ctx;
}
