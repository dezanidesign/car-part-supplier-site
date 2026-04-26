"use client";

import {
  getCartItemLineTotal,
  getCartItemUnitTotal,
  useCartStore,
} from "@/lib/store";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const formatPrice = (price: number) =>
  price.toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
  });

export default function CartPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.getSubtotal());
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black text-white px-6 pb-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-xl font-bold uppercase tracking-widest">Cart</h1>
          <p className="text-gray-400 mt-6">Loading...</p>
        </div>
      </div>
    );
  }

  function goCheckout() {
    router.push("/checkout");
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 pb-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-xl font-bold uppercase tracking-widest">Cart</h1>

        <button
          onClick={() => {
            localStorage.removeItem("fdl-cart-storage");
            window.location.reload();
          }}
          className="mb-4 text-xs text-gray-500 hover:text-white"
        >
          Debug: Clear Cart Storage
        </button>

        {items.length === 0 ? (
          <p className="text-gray-400 mt-6">Your cart is empty.</p>
        ) : (
          <div className="mt-8 grid gap-4">
            {items.map((item) => (
              <div key={item.id} className="border border-white/10 bg-[#111] p-4 flex gap-4">
                <div className="w-20 h-24 bg-[#0a0a0a] overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover opacity-90"
                    />
                  ) : null}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest">
                        {item.name}
                      </div>
                      <div className="text-gray-400 text-xs mt-1">
                        {formatPrice(getCartItemUnitTotal(item))} each
                      </div>
                      {item.fitting ? (
                        <div className="text-[11px] uppercase tracking-[0.16em] text-[#D3BF89] mt-1">
                          Includes fitting +{formatPrice(item.fitting.price)}
                        </div>
                      ) : null}
                    </div>
                    <button
                      className="text-xs text-gray-400 hover:text-white"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(event) =>
                        updateQuantity(item.id, Number(event.target.value))
                      }
                      className="w-20 bg-black border border-white/10 px-2 py-1 text-sm"
                    />
                    <div className="text-sm font-bold ml-auto">
                      {formatPrice(getCartItemLineTotal(item))}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="border border-white/10 bg-[#111] p-4 flex items-center justify-between">
              <div className="text-sm text-gray-400">Subtotal</div>
              <div className="text-lg font-bold">{formatPrice(subtotal)}</div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                className="border border-white/10 px-4 py-2 text-xs uppercase tracking-widest"
                onClick={clearCart}
              >
                Clear cart
              </button>
              <button
                className="bg-[var(--accent)] text-black px-5 py-2 text-xs font-bold uppercase tracking-widest"
                onClick={goCheckout}
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
