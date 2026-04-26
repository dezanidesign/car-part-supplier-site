"use client";

import { useCartStore } from "@/lib/store";
import type { WooProduct } from "@/lib/woo";
import { useState } from "react";

type FittingOption = {
  productId: number;
  sku: string;
  name: string;
  price: number;
  regularPrice: number;
};

const formatPrice = (price: number) =>
  price.toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
  });

export default function AddToCartBtn({
  product,
  fittingOption,
}: {
  product: WooProduct;
  fittingOption?: FittingOption | null;
}) {
  const addItem = useCartStore((state) => state.addItem);
  const [withFitting, setWithFitting] = useState(false);

  const handleAddToCart = () => {
    const selectedFitting = withFitting && fittingOption ? fittingOption : undefined;

    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: parseFloat(product.sale_price || product.price || "0"),
      regularPrice: parseFloat(product.regular_price || product.price || "0"),
      quantity: 1,
      image: product.images?.[0]?.src || "",
      sku: product.sku,
      attributes: selectedFitting ? { fitting: selectedFitting.sku } : undefined,
      fitting: selectedFitting,
    });
  };

  return (
    <div className="flex-1 space-y-3">
      {fittingOption ? (
        <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left cursor-pointer transition hover:border-white/20">
          <input
            type="checkbox"
            checked={withFitting}
            onChange={(event) => setWithFitting(event.target.checked)}
            className="mt-1 h-4 w-4 rounded border-white/20 bg-black text-[#D3BF89] focus:ring-[#D3BF89] focus:ring-offset-0"
          />
          <span className="block">
            <span className="block text-sm font-bold uppercase tracking-[0.18em] text-white">
              With fitting (+{formatPrice(fittingOption.price)})
            </span>
            <span className="mt-1 block text-xs text-gray-400">
              Add professional fitting to this order and keep it bundled with the product in your cart.
            </span>
          </span>
        </label>
      ) : null}

      <button
        onClick={handleAddToCart}
        className="w-full bg-[#D3BF89] text-black font-bold uppercase tracking-[0.2em] py-4 px-8 rounded-full hover:brightness-115 transition active:scale-95"
      >
        Add to Cart
      </button>
    </div>
  );
}
