"use client";

import { ChevronLeft, ChevronRight, Film, ImagePlus, Trash2 } from "lucide-react";
import ImageUpload from "./ImageUpload";
import type { BlogMediaItem } from "@/lib/blog";

export default function PostMediaManager({
  items,
  onChange,
}: {
  items: BlogMediaItem[];
  onChange: (items: BlogMediaItem[]) => void;
}) {
  const updateItem = (
    index: number,
    patch: Partial<Pick<BlogMediaItem, "url" | "posterImage">>,
  ) => {
    const nextItems = [...items];
    nextItems[index] = {
      ...nextItems[index],
      ...patch,
    };
    onChange(nextItems);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, itemIndex) => itemIndex !== index));
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= items.length) return;

    const nextItems = [...items];
    const [item] = nextItems.splice(index, 1);
    nextItems.splice(nextIndex, 0, item);
    onChange(nextItems);
  };

  const addItem = (type: BlogMediaItem["type"]) => {
    onChange([
      ...items,
      {
        type,
        url: "",
        posterImage: "",
      },
    ]);
  };

  return (
    <div className="space-y-4">
      {items.length === 0 ? (
        <div className="border border-dashed border-white/10 bg-[#111] px-4 py-6 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
            No gallery media yet
          </p>
          <p className="text-[11px] text-gray-600 mt-2">
            Add extra images or videos that should appear above the article body.
          </p>
        </div>
      ) : null}

      {items.map((item, index) => (
        <div
          key={`${item.type}-${item.url || "new"}-${index}`}
          className="border border-white/10 bg-[#111] p-3 space-y-3"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                {item.type === "video" ? `Video ${index + 1}` : `Image ${index + 1}`}
              </p>
              <p className="text-[10px] text-gray-600 mt-1">
                {item.type === "video"
                  ? "Videos stay muted inline and unmute when opened fullscreen."
                  : "Images appear in the structured post gallery above the article."}
              </p>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => moveItem(index, -1)}
                disabled={index === 0}
                className="p-2 text-gray-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Move earlier"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                type="button"
                onClick={() => moveItem(index, 1)}
                disabled={index === items.length - 1}
                className="p-2 text-gray-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Move later"
              >
                <ChevronRight size={14} />
              </button>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                title="Remove media"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">
              {item.type === "video" ? "Video File" : "Image File"}
            </label>
            <ImageUpload
              value={item.url}
              onChange={(url) => updateItem(index, { url })}
              type="inline"
              scope="blog"
              mediaType={item.type}
            />
          </div>

          {item.type === "video" ? (
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">
                Poster Image
              </label>
              <ImageUpload
                value={item.posterImage}
                onChange={(posterImage) => updateItem(index, { posterImage })}
                type="inline"
                scope="blog"
              />
            </div>
          ) : null}
        </div>
      ))}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => addItem("image")}
          className="border border-dashed border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-colors px-4 py-3 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
        >
          <ImagePlus size={14} />
          Add Gallery Image
        </button>
        <button
          type="button"
          onClick={() => addItem("video")}
          className="border border-dashed border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-colors px-4 py-3 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
        >
          <Film size={14} />
          Add Gallery Video
        </button>
      </div>
    </div>
  );
}
