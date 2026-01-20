"use client";

import { useCartStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import Image from "next/image";

const formatPrice = (price: number) =>
  price.toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
  });

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.getSubtotal());
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    if (items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Checkout failed");
      }

      // Redirect to WooCommerce checkout page
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        throw new Error("No payment URL received");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <button
            onClick={() => router.push("/shop")}
            className="bg-[var(--accent-orange)] text-black font-bold uppercase tracking-widest px-6 py-3 hover:brightness-110 transition text-sm"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-display text-5xl md:text-7xl font-bold uppercase tracking-tight mb-12">
          Checkout<span className="text-[var(--accent-orange)]">.</span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-[#111] border border-white/10 p-8">
              <h2 className="text-xl font-bold uppercase tracking-widest mb-6 border-b border-white/10 pb-4">
                Order Summary
              </h2>

              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-white/10 last:border-0">
                    <div className="w-20 h-20 relative flex-shrink-0 bg-white/5 overflow-hidden">
                      <Image
                        src={item.image || "/placeholder-product.jpg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-bold text-sm uppercase tracking-wider">{item.name}</h3>
                      <p className="text-gray-400 text-xs mt-1">
                        {formatPrice(item.price)} × {item.quantity}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-sm">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#111] border border-white/10 p-8 sticky top-32">
              <h2 className="text-xl font-bold uppercase tracking-widest mb-6 border-b border-white/10 pb-4">
                Order Total
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 uppercase tracking-wider">Subtotal</span>
                  <span className="font-bold">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 uppercase tracking-wider">Shipping</span>
                  <span className="text-gray-400 text-xs">Calculated at checkout</span>
                </div>

                <div className="border-t border-white/10 pt-4 flex justify-between">
                  <span className="font-bold uppercase tracking-widest">Total</span>
                  <span className="font-display text-2xl font-bold text-[var(--accent-orange)]">
                    {formatPrice(subtotal)}
                  </span>
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs uppercase tracking-wider">
                  {error}
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full bg-[var(--accent-orange)] text-black font-bold uppercase tracking-[0.2em] py-4 hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Proceed to Checkout"
                )}
              </button>

              <p className="text-xs text-gray-500 mt-6 text-center leading-relaxed">
                You'll be redirected to complete your payment securely
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
