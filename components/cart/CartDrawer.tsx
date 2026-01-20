"use client";

import { useCartStore } from "@/lib/store";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const formatPrice = (price: number) =>
  price.toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
  });

export default function CartDrawer() {
  const isOpen = useCartStore((state) => state.isOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getSubtotal = useCartStore((state) => state.getSubtotal);

  // Hydration fix
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/80 z-[999] transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#111] border-l border-white/10 z-[1000] transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          
          {/* HEADER */}
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h2 className="text-xl font-display font-bold uppercase tracking-widest text-white flex items-center gap-3">
              <ShoppingBag size={20} className="text-[#FF4D00]" />
              Your Cart
            </h2>
            <button 
              onClick={closeCart}
              className="text-gray-400 hover:text-white transition"
            >
              <X size={24} />
            </button>
          </div>

          {/* ITEMS */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <ShoppingBag size={48} className="text-white/10" />
                <p className="text-gray-500">Your cart is empty.</p>
                <button 
                  onClick={closeCart}
                  className="text-[#FF4D00] text-sm font-bold uppercase tracking-widest hover:text-white transition"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  {/* Image */}
                  <div className="w-20 h-24 relative flex-shrink-0 bg-white/5 rounded-lg overflow-hidden border border-white/10">
                    <Image
                      src={item.image || "/placeholder-product.jpg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white line-clamp-2 mb-1">
                        {item.name}
                      </h3>
                      <p className="text-[#FF4D00] text-sm font-bold">
                        {formatPrice(item.price)}
                      </p>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-3 bg-white/5 rounded-full px-3 py-1 border border-white/10">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-gray-400 hover:text-white"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="text-xs font-bold text-white w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-gray-400 hover:text-white"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-500 hover:text-red-500 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* FOOTER */}
          {items.length > 0 && (
            <div className="p-6 border-t border-white/10 bg-[#0a0a0a]">
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-400 uppercase text-sm tracking-wider">Total</span>
                <span className="text-2xl font-bold text-white">
                  {formatPrice(getSubtotal())}
                </span>
              </div>
              <div className="space-y-3">
                <Link
                  href="/cart"
                  onClick={closeCart}
                  className="block w-full bg-white/10 text-white font-bold text-center uppercase tracking-widest py-3 rounded-full hover:bg-white/20 transition border border-white/10"
                >
                  View Cart
                </Link>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className="block w-full bg-[#FF4D00] text-black font-bold text-center uppercase tracking-widest py-4 rounded-full hover:brightness-110 transition"
                >
                  Checkout
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}