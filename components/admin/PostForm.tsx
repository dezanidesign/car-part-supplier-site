"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TiptapEditor from "./TiptapEditor";
import ImageUpload from "./ImageUpload";
import { Loader2, ChevronDown, ChevronUp } from "lucide-react";

interface PostData {
  id?: string;
  title: string;
  content: string;
  excerpt: string;
  coverImage: string;
  status: "DRAFT" | "PUBLISHED";
  category: string;
  metaTitle: string;
  metaDescription: string;
}

const CATEGORIES = ["Builds", "News", "Tips & Guides", "Events"];

const EMPTY: PostData = {
  title: "",
  content: "",
  excerpt: "",
  coverImage: "",
  status: "DRAFT",
  category: "",
  metaTitle: "",
  metaDescription: "",
};

export default function PostForm({
  initialData,
}: {
  initialData?: PostData & { id: string };
}) {
  const router = useRouter();
  const [data, setData] = useState<PostData>(initialData || EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [seoOpen, setSeoOpen] = useState(false);

  const isEdit = !!initialData?.id;

  // Generate slug preview from title
  const slugPreview = data.title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();

  const handleSave = async (status?: "DRAFT" | "PUBLISHED") => {
    const saveStatus = status || data.status;

    if (!data.title.trim()) {
      setError("Title is required");
      return;
    }
    if (!data.content.trim() || data.content === "<p></p>") {
      setError("Content is required");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const payload = { ...data, status: saveStatus };
      const url = isEdit ? `/api/blog/${initialData!.id}` : "/api/blog";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Failed to save");
        setSaving(false);
        return;
      }

      router.push("/admin/blog");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setSaving(false);
    }
  };

  const set = (field: keyof PostData, value: string) =>
    setData((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="max-w-5xl">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content — left 2/3 */}
        <div className="lg:col-span-2 space-y-5">
          {/* Title */}
          <div>
            <input
              type="text"
              value={data.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Post title"
              className="w-full bg-transparent text-2xl md:text-3xl font-display font-bold uppercase tracking-tight text-white placeholder-gray-600 focus:outline-none border-b border-white/10 pb-3"
            />
            {slugPreview && (
              <p className="text-[10px] text-gray-600 mt-2 font-mono">
                /blog/{slugPreview}
              </p>
            )}
          </div>

          {/* Editor */}
          <TiptapEditor
            content={data.content}
            onChange={(html) => set("content", html)}
          />

          {/* Excerpt */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
              Excerpt
            </label>
            <textarea
              value={data.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              rows={3}
              placeholder="Brief summary shown on the blog listing..."
              className="w-full bg-[#0F0F0F] border border-white/10 text-white text-sm px-4 py-3 focus:border-[var(--accent)] focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* SEO — collapsible */}
          <div className="border border-white/10 bg-[#0F0F0F]">
            <button
              type="button"
              onClick={() => setSeoOpen(!seoOpen)}
              className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
            >
              SEO Settings
              {seoOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {seoOpen && (
              <div className="px-4 pb-4 space-y-3 border-t border-white/5">
                <div className="pt-3">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={data.metaTitle}
                    onChange={(e) => set("metaTitle", e.target.value)}
                    placeholder={data.title || "Custom title for search engines"}
                    className="w-full bg-[#111] border border-white/10 text-white text-sm px-3 py-2 focus:border-[var(--accent)] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
                    Meta Description
                  </label>
                  <textarea
                    value={data.metaDescription}
                    onChange={(e) => set("metaDescription", e.target.value)}
                    rows={2}
                    placeholder="Description shown in search results..."
                    className="w-full bg-[#111] border border-white/10 text-white text-sm px-3 py-2 focus:border-[var(--accent)] focus:outline-none transition-colors resize-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar — right 1/3 */}
        <div className="space-y-5">
          {/* Actions */}
          <div className="bg-[#0F0F0F] border border-white/10 p-4 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                Status
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-widest ${
                  data.status === "PUBLISHED"
                    ? "text-emerald-400"
                    : "text-amber-400"
                }`}
              >
                {data.status === "PUBLISHED" ? "Published" : "Draft"}
              </span>
            </div>

            <button
              type="button"
              onClick={() => handleSave("DRAFT")}
              disabled={saving}
              className="w-full border border-white/10 text-white font-bold uppercase tracking-widest text-xs py-2.5 hover:bg-white/5 transition-all disabled:opacity-50"
            >
              {saving ? (
                <Loader2 size={14} className="animate-spin mx-auto" />
              ) : (
                "Save Draft"
              )}
            </button>

            <button
              type="button"
              onClick={() => handleSave("PUBLISHED")}
              disabled={saving}
              className="w-full bg-[var(--accent)] text-black font-bold uppercase tracking-widest text-xs py-2.5 hover:brightness-110 transition-all disabled:opacity-50"
            >
              {saving ? (
                <Loader2 size={14} className="animate-spin mx-auto" />
              ) : isEdit && data.status === "PUBLISHED" ? (
                "Update"
              ) : (
                "Publish"
              )}
            </button>
          </div>

          {/* Cover Image */}
          <div className="bg-[#0F0F0F] border border-white/10 p-4">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">
              Cover Image
            </label>
            <ImageUpload
              value={data.coverImage}
              onChange={(url) => set("coverImage", url)}
              type="cover"
            />
          </div>

          {/* Category */}
          <div className="bg-[#0F0F0F] border border-white/10 p-4">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-2">
              Category
            </label>
            <select
              value={data.category}
              onChange={(e) => set("category", e.target.value)}
              className="w-full bg-[#111] border border-white/10 text-white text-sm px-3 py-2 focus:border-[var(--accent)] focus:outline-none transition-colors"
            >
              <option value="">No category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
