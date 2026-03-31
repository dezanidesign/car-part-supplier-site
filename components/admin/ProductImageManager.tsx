"use client";

import { ChevronLeft, ChevronRight, ImagePlus, Trash2 } from "lucide-react";
import ImageUpload from "./ImageUpload";

export default function ProductImageManager({
  images,
  onChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const safeImages = images.length > 0 ? images : [""];

  const updateImage = (index: number, nextUrl: string) => {
    const nextImages = [...safeImages];
    nextImages[index] = nextUrl;
    onChange(nextImages.filter(Boolean));
  };

  const removeImage = (index: number) => {
    onChange(safeImages.filter((_, imageIndex) => imageIndex !== index));
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= safeImages.length) return;

    const nextImages = [...safeImages];
    const [item] = nextImages.splice(index, 1);
    nextImages.splice(nextIndex, 0, item);
    onChange(nextImages.filter(Boolean));
  };

  return (
    <div className="space-y-4">
      {safeImages.map((image, index) => (
        <div key={`${image || "new"}-${index}`} className="border border-white/10 bg-[#111] p-3 space-y-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                {index === 0 ? "Primary Image" : `Gallery Image ${index}`}
              </p>
              {index === 0 && (
                <p className="text-[10px] text-gray-600 mt-1">
                  The first image is used as the main storefront image.
                </p>
              )}
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => moveImage(index, -1)}
                disabled={index === 0}
                className="p-2 text-gray-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Move left"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                type="button"
                onClick={() => moveImage(index, 1)}
                disabled={index === safeImages.length - 1}
                className="p-2 text-gray-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Move right"
              >
                <ChevronRight size={14} />
              </button>
              {safeImages.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                  title="Remove image"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>

          <ImageUpload
            value={image}
            onChange={(nextUrl) => updateImage(index, nextUrl)}
            type="cover"
            requirePublicUrl
            scope="products"
          />
        </div>
      ))}

      <button
        type="button"
        onClick={() => onChange([...safeImages.filter(Boolean), ""])}
        className="w-full border border-dashed border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-colors px-4 py-3 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2"
      >
        <ImagePlus size={14} />
        Add Gallery Image
      </button>
    </div>
  );
}
