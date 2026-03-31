"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Upload, X, Loader2, AlertCircle } from "lucide-react";

const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

export default function ImageUpload({
  value,
  onChange,
  type = "inline",
  requirePublicUrl = false,
  scope = "blog",
}: {
  value?: string;
  onChange: (url: string) => void;
  type?: "cover" | "inline";
  requirePublicUrl?: boolean;
  scope?: "blog" | "products";
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(
    async (file: File) => {
      setError("");

      if (!ALLOWED.includes(file.type)) {
        setError("Unsupported format. Use JPG, PNG, or WebP.");
        return;
      }
      if (file.size > MAX_SIZE) {
        setError(
          `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum is 10MB.`,
        );
        return;
      }

      setUploading(true);
      try {
        const form = new FormData();
        form.append("file", file);
        form.append("type", type);
        form.append("scope", scope);
        form.append("requirePublicUrl", requirePublicUrl ? "1" : "0");

        const res = await fetch("/api/blog/upload", { method: "POST", body: form });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Upload failed");
          return;
        }

        onChange(data.url);
      } catch {
        setError("Upload failed. Please try again.");
      } finally {
        setUploading(false);
      }
    },
    [onChange, requirePublicUrl, scope, type],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files[0];
      if (file) upload(file);
    },
    [upload],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
  };

  if (value) {
    return (
      <div className="relative group">
        <div className="relative aspect-video bg-[#111] border border-white/10 overflow-hidden">
          <Image
            src={value}
            alt="Uploaded"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute top-2 right-2 bg-black/70 text-white p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80"
        >
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`
          border-2 border-dashed rounded p-8 text-center cursor-pointer transition-colors
          ${
            dragActive
              ? "border-[var(--accent)] bg-[var(--accent)]/5"
              : "border-white/10 hover:border-white/20 bg-[#111]"
          }
          ${uploading ? "pointer-events-none opacity-60" : ""}
        `}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 size={24} className="animate-spin text-[var(--accent)]" />
            <p className="text-xs text-gray-400">Compressing and uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload size={24} className="text-gray-500" />
            <p className="text-xs text-gray-400">Drop an image here or click to browse</p>
            <p className="text-[10px] text-gray-600">
              JPG, PNG, WebP - Max 10MB - Auto-converted to WebP
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="flex items-center gap-1.5 text-red-400 text-xs mt-2">
          <AlertCircle size={12} />
          {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
