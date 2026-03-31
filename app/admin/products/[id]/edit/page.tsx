"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import ProductForm from "@/components/admin/ProductForm";

type ProductRecord = {
  id: number;
  name: string;
  regularPrice: string;
  salePrice: string;
  shortDescription: string;
  description: string;
  status: "publish" | "draft";
  modelSlug: string;
  images: string[];
  slug: string;
};

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<ProductRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/admin/products/${params.id}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Product not found");
          return;
        }

        setProduct(data.product);
      } catch {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-gray-500" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400 mb-4">{error || "Product not found"}</p>
        <button
          onClick={() => router.push("/admin/products")}
          className="text-xs text-[var(--accent)] font-bold uppercase tracking-widest"
        >
          Back to products
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight mb-6">
        Edit Product
      </h1>
      <ProductForm initialData={product} />
    </div>
  );
}
