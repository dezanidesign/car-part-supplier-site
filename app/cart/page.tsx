"use client";

import { useCart } from "@/lib/cart";

export default function CartPage() {
  const { items, subtotal, setQty, remove, clear } = useCart();

  async function goCheckout() {
    const res = await fetch("/api/checkout/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error(data);
      alert("Checkout failed. Check console.");
      return;
    }

    // Optional: clear cart only after payment success (later). For now, do NOT clear automatically.
    window.location.href = data.paymentUrl;
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-xl font-bold uppercase tracking-widest">Cart</h1>

        {items.length === 0 ? (
          <p className="text-gray-400 mt-6">Your cart is empty.</p>
        ) : (
          <div className="mt-8 grid gap-4">
            {items.map((i) => (
              <div key={i.productId} className="border border-white/10 bg-[#111] p-4 flex gap-4">
                <div className="w-20 h-24 bg-[#0a0a0a] overflow-hidden flex-shrink-0">
                  {i.image ? <img src={i.image} alt={i.name} className="w-full h-full object-cover opacity-90" /> : null}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest">{i.name}</div>
                      <div className="text-gray-400 text-xs mt-1">£{i.price.toFixed(2)} each</div>
                    </div>
                    <button className="text-xs text-gray-400 hover:text-white" onClick={() => remove(i.productId)}>
                      Remove
                    </button>
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    <input
                      type="number"
                      min={1}
                      value={i.quantity}
                      onChange={(e) => setQty(i.productId, Number(e.target.value))}
                      className="w-20 bg-black border border-white/10 px-2 py-1 text-sm"
                    />
                    <div className="text-sm font-bold ml-auto">
                      £{(i.price * i.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="border border-white/10 bg-[#111] p-4 flex items-center justify-between">
              <div className="text-sm text-gray-400">Subtotal</div>
              <div className="text-lg font-bold">£{subtotal.toFixed(2)}</div>
            </div>

            <div className="flex gap-3 justify-end">
              <button className="border border-white/10 px-4 py-2 text-xs uppercase tracking-widest" onClick={clear}>
                Clear cart
              </button>
              <button
                className="bg-[var(--accent-orange)] text-white px-5 py-2 text-xs font-bold uppercase tracking-widest"
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
