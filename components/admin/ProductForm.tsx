"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import TiptapEditor from "./TiptapEditor";
import ProductImageManager from "./ProductImageManager";
import { SHOP_CATEGORIES } from "@/lib/shopCategories";

type ProductFormData = {
  id?: number;
  name: string;
  regularPrice: string;
  salePrice: string;
  fittingPrice: string;
  shortDescription: string;
  description: string;
  modelSlug: string;
  images: string[];
  status: "publish" | "draft";
  slug?: string;
};

const EMPTY: ProductFormData = {
  name: "",
  regularPrice: "",
  salePrice: "",
  fittingPrice: "",
  shortDescription: "",
  description: "",
  modelSlug: "",
  images: [],
  status: "draft",
};

const MODEL_OPTIONS = SHOP_CATEGORIES.flatMap((make) =>
  make.models.map((model) => ({
    value: model.slug,
    label: `${make.label} / ${model.label}`,
  })),
);

export default function ProductForm({
  initialData,
}: {
  initialData?: ProductFormData;
}) {
  const router = useRouter();
  const [data, setData] = useState<ProductFormData>({ ...EMPTY, ...initialData });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [detailsOpen, setDetailsOpen] = useState(true);

  const isEdit = Boolean(initialData?.id);

  const slugPreview = data.name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

  const updateField = (field: keyof ProductFormData, value: string | string[]) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (status?: "publish" | "draft") => {
    const nextStatus = status || data.status;

    if (!data.name.trim()) {
      setError("Product name is required");
      return;
    }

    if (!data.regularPrice.trim()) {
      setError("Regular price is required");
      return;
    }

    if (!data.modelSlug) {
      setError("Please select a supported category/model");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const payload = {
        ...data,
        status: nextStatus,
      };

      const url = isEdit ? `/api/admin/products/${initialData!.id}` : "/api/admin/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Failed to save product");
        setSaving(false);
        return;
      }

      router.push(`/admin/products?success=${isEdit ? "updated" : "created"}`);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div>
            <input
              type="text"
              value={data.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="Product name"
              className="w-full bg-transparent text-2xl md:text-3xl font-display font-bold uppercase tracking-tight text-white placeholder-gray-600 focus:outline-none border-b border-white/10 pb-3"
            />
            {(data.slug || slugPreview) && (
              <p className="text-[10px] text-gray-600 mt-2 font-mono">
                /product/{data.slug || slugPreview}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
              Full Description
            </label>
            <TiptapEditor
              content={data.description}
              onChange={(html) => updateField("description", html)}
            />
          </div>

          <div className="border border-white/10 bg-[#0F0F0F]">
            <button
              type="button"
              onClick={() => setDetailsOpen((prev) => !prev)}
              className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
            >
              Product Details
              {detailsOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {detailsOpen && (
              <div className="px-4 pb-4 space-y-4 border-t border-white/5">
                <div className="pt-3">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                    Short Description
                  </label>
                  <textarea
                    value={data.shortDescription}
                    onChange={(event) => updateField("shortDescription", event.target.value)}
                    rows={4}
                    placeholder="Short summary shown on the product page and listing..."
                    className="w-full bg-[#111] border border-white/10 text-white text-sm px-4 py-3 focus:border-[var(--accent)] focus:outline-none transition-colors resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                      Regular Price
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={data.regularPrice}
                      onChange={(event) => updateField("regularPrice", event.target.value)}
                      placeholder="e.g. 495.00"
                      className="w-full bg-[#111] border border-white/10 text-white text-sm px-4 py-3 focus:border-[var(--accent)] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                      Sale Price
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={data.salePrice}
                      onChange={(event) => updateField("salePrice", event.target.value)}
                      placeholder="Optional"
                      className="w-full bg-[#111] border border-white/10 text-white text-sm px-4 py-3 focus:border-[var(--accent)] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
                      Fitting Price
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={data.fittingPrice}
                      onChange={(event) => updateField("fittingPrice", event.target.value)}
                      placeholder="Optional"
                      className="w-full bg-[#111] border border-white/10 text-white text-sm px-4 py-3 focus:border-[var(--accent)] focus:outline-none transition-colors"
                    />
                    <p className="text-[10px] text-gray-600 mt-2">
                      Leave blank or 0 to hide the fitting option on this product page.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-[#0F0F0F] border border-white/10 p-4 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                Status
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-widest ${
                  data.status === "publish" ? "text-emerald-400" : "text-amber-400"
                }`}
              >
                {data.status === "publish" ? "Published" : "Draft"}
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleSave("draft")}
              disabled={saving}
              className="w-full border border-white/10 text-white font-bold uppercase tracking-widest text-xs py-2.5 hover:bg-white/5 transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 size={14} className="animate-spin mx-auto" /> : "Save Draft"}
            </button>

            <button
              type="button"
              onClick={() => handleSave("publish")}
              disabled={saving}
              className="w-full bg-[var(--accent)] text-black font-bold uppercase tracking-widest text-xs py-2.5 hover:brightness-110 transition-all disabled:opacity-50"
            >
              {saving ? (
                <Loader2 size={14} className="animate-spin mx-auto" />
              ) : isEdit && data.status === "publish" ? (
                "Update"
              ) : (
                "Publish"
              )}
            </button>

            <p className="text-[10px] text-gray-600 leading-relaxed">
              Storefront changes usually appear on the next request, but some pages may take a few minutes to refresh while cached Woo data revalidates.
            </p>
          </div>

          <div className="bg-[#0F0F0F] border border-white/10 p-4">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">
              Product Images
            </label>
            <ProductImageManager
              images={data.images}
              onChange={(images) => updateField("images", images)}
            />
          </div>

          <div className="bg-[#0F0F0F] border border-white/10 p-4">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
              Category / Model
            </label>
            <select
              value={data.modelSlug}
              onChange={(event) => updateField("modelSlug", event.target.value)}
              className="w-full bg-[#111] border border-white/10 text-white text-sm px-3 py-2 focus:border-[var(--accent)] focus:outline-none transition-colors"
            >
              <option value="">Select a supported model</option>
              {MODEL_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
