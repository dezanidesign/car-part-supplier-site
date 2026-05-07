"use client";

import Image from "next/image";
import ExpandableVideo from "@/components/shared/ExpandableVideo";
import type { BlogMediaItem } from "@/lib/blog";

export default function BlogMediaGallery({
  items,
}: {
  items: BlogMediaItem[];
}) {
  if (!items.length) {
    return null;
  }

  return (
    <section className="mb-10 md:mb-12">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-[var(--accent)] text-[10px] font-bold uppercase tracking-widest">
          Project Media
        </span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, index) => (
          <div
            key={item.id || `${item.type}-${index}`}
            className={`relative overflow-hidden border border-white/10 bg-white/5 ${
              index === 0 && items.length > 2 ? "md:col-span-2" : ""
            }`}
          >
            {item.type === "video" ? (
              <ExpandableVideo
                src={item.url}
                poster={item.posterImage || undefined}
                title={`Post video ${index + 1}`}
                autoPlay={false}
                className="h-full w-full"
                videoClassName="h-full w-full aspect-[16/10] object-cover"
                modalVideoClassName="max-w-5xl"
              />
            ) : (
              <div className="relative aspect-[16/10]">
                <Image
                  src={item.url}
                  alt={`Post media ${index + 1}`}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
