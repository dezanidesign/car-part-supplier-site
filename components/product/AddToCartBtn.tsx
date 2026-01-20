"use client";

import { useCartStore } from "@/lib/store";
import type { WooProduct } from "@/lib/woo";

export default function AddToCartBtn({ product }: { product: WooProduct }) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: parseFloat(product.sale_price || product.price || "0"),
      regularPrice: parseFloat(product.regular_price || product.price || "0"),
      quantity: 1,
      image: product.images?.[0]?.src || "",
      sku: product.sku,
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      className="flex-1 bg-[#FF4D00] text-black font-bold uppercase tracking-[0.2em] py-4 px-8 rounded-full hover:brightness-110 transition active:scale-95"
    >
      Add to Cart
    </button>
  );
}