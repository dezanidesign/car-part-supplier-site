"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  Eye,
  EyeOff,
  FilePlus,
  Loader2,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
import StatusBadge from "./StatusBadge";

type ProductStatus = "publish" | "draft";

type ProductRow = {
  id: number;
  name: string;
  slug: string;
  regularPrice: string;
  salePrice: string;
  imageUrl: string;
  status: ProductStatus;
  modelSlug: string | null;
  modelLabel: string;
};

function formatPrice(price: string): string {
  const numeric = Number(price);
  if (!Number.isFinite(numeric)) return "—";

  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(numeric);
}

export default function ProductTable() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ProductStatus>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [actionId, setActionId] = useState<number | null>(null);

  const success = searchParams.get("success");
  const successMessage =
    success === "created"
      ? "Product created successfully."
      : success === "updated"
        ? "Product updated successfully."
        : "";

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
      });

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (statusFilter !== "all") {
        params.set("status", statusFilter);
      }

      const res = await fetch(`/api/admin/products?${params}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to load products");
        setProducts([]);
        return;
      }

      setProducts(data.products || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch {
      setError("Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const runAction = async (
    product: ProductRow,
    action: "trash" | "publish" | "draft",
  ) => {
    if (
      action === "trash" &&
      !window.confirm(`Move "${product.name}" to trash? This is safer than a hard delete.`)
    ) {
      return;
    }

    setActionId(product.id);
    setError("");
    setMessage("");

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: action === "trash" ? "DELETE" : "PATCH",
        headers: action === "trash" ? undefined : { "Content-Type": "application/json" },
        body: action === "trash" ? undefined : JSON.stringify({ status: action }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to update product");
        return;
      }

      setMessage(
        action === "trash"
          ? "Product moved to trash."
          : action === "publish"
            ? "Product published."
            : "Product moved to draft.",
      );

      await fetchProducts();
    } catch {
      setError("Failed to update product");
    } finally {
      setActionId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight">
            Products
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {total} product{total !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-[var(--accent)] text-black font-bold uppercase tracking-widest text-xs px-5 py-2.5 hover:brightness-110 transition-all shrink-0"
        >
          <FilePlus size={14} />
          New Product
        </Link>
      </div>

      {successMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm px-4 py-3 mb-5">
          {successMessage}
        </div>
      )}

      {message && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm px-4 py-3 mb-5">
          {message}
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 mb-5">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_220px] gap-3 mb-5">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search products..."
            className="w-full bg-[#0F0F0F] border border-white/10 text-white text-sm pl-9 pr-4 py-2.5 focus:border-[var(--accent)] focus:outline-none transition-colors"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) => {
            const nextValue = event.target.value as "all" | ProductStatus;
            setStatusFilter(nextValue);
            setPage(1);
          }}
          className="bg-[#0F0F0F] border border-white/10 text-white text-sm px-4 py-2.5 focus:border-[var(--accent)] focus:outline-none transition-colors"
        >
          <option value="all">All statuses</option>
          <option value="publish">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-500">
          <Loader2 size={20} className="animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-sm mb-4">
            {search || statusFilter !== "all"
              ? "No products match your current filters"
              : "No products found"}
          </p>
          {!search && statusFilter === "all" && (
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 text-[var(--accent)] text-xs font-bold uppercase tracking-widest hover:brightness-110"
            >
              <FilePlus size={14} />
              Add your first product
            </Link>
          )}
        </div>
      ) : (
        <div className="border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 bg-[#0A0A0A]">
                  <th className="text-left text-[10px] font-bold uppercase tracking-widest text-gray-500 px-4 py-3">
                    Product
                  </th>
                  <th className="text-left text-[10px] font-bold uppercase tracking-widest text-gray-500 px-4 py-3 hidden md:table-cell">
                    Price
                  </th>
                  <th className="text-left text-[10px] font-bold uppercase tracking-widest text-gray-500 px-4 py-3 hidden lg:table-cell">
                    Category / Model
                  </th>
                  <th className="text-left text-[10px] font-bold uppercase tracking-widest text-gray-500 px-4 py-3 hidden md:table-cell">
                    Status
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const isActing = actionId === product.id;

                  return (
                    <tr
                      key={product.id}
                      className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {product.imageUrl ? (
                            <div className="relative w-12 h-12 bg-[#111] shrink-0 overflow-hidden hidden sm:block">
                              <Image
                                src={product.imageUrl}
                                alt=""
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-[#111] shrink-0 hidden sm:block border border-white/5" />
                          )}
                          <div>
                            <Link
                              href={`/admin/products/${product.id}/edit`}
                              className="font-medium text-white hover:text-[var(--accent)] transition-colors line-clamp-1"
                            >
                              {product.name}
                            </Link>
                            <p className="text-[10px] text-gray-600 font-mono mt-0.5">
                              /product/{product.slug}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-xs">
                        {product.salePrice ? (
                          <div className="flex flex-col">
                            <span className="text-gray-500 line-through">
                              {formatPrice(product.regularPrice)}
                            </span>
                            <span className="text-[var(--accent)] font-semibold">
                              {formatPrice(product.salePrice)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-300">
                            {formatPrice(product.regularPrice)}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-gray-500 text-xs">
                        {product.modelLabel || "—"}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <StatusBadge
                          status={product.status === "publish" ? "PUBLISHED" : "DRAFT"}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              runAction(
                                product,
                                product.status === "publish" ? "draft" : "publish",
                              )
                            }
                            disabled={isActing}
                            className="p-2 text-gray-500 hover:text-white transition-colors disabled:opacity-40"
                            title={
                              product.status === "publish"
                                ? "Move to draft"
                                : "Publish"
                            }
                          >
                            {isActing ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : product.status === "publish" ? (
                              <EyeOff size={14} />
                            ) : (
                              <Eye size={14} />
                            )}
                          </button>
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="p-2 text-gray-500 hover:text-white transition-colors"
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => runAction(product, "trash")}
                            disabled={isActing}
                            className="p-2 text-gray-500 hover:text-red-400 transition-colors disabled:opacity-40"
                            title="Move to trash"
                          >
                            {isActing ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Trash2 size={14} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: pages }, (_, index) => index + 1).map((entry) => (
            <button
              key={entry}
              onClick={() => setPage(entry)}
              className={`w-8 h-8 text-xs font-bold ${
                entry === page
                  ? "bg-[var(--accent)] text-black"
                  : "text-gray-500 hover:text-white hover:bg-white/5"
              } transition-colors`}
            >
              {entry}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
