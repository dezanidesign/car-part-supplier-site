import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface BlogCardProps {
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  category: string | null;
  publishedAt: string | null;
}

export default function BlogCard({
  title,
  slug,
  excerpt,
  coverImage,
  category,
  publishedAt,
}: BlogCardProps) {
  const date = publishedAt
    ? new Date(publishedAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <Link
      href={`/blog/${slug}`}
      className="group block bg-[var(--bg-card)] border border-white/5 hover:border-white/15 transition-all duration-500"
    >
      {/* Cover image */}
      {coverImage && (
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={coverImage}
            alt={title}
            fill
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-[1.03]"
            unoptimized
          />
          {category && (
            <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-[var(--accent)] text-[9px] font-bold uppercase tracking-widest px-2.5 py-1">
              {category}
            </span>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-5 md:p-6">
        {!coverImage && category && (
          <span className="text-[var(--accent)] text-[9px] font-bold uppercase tracking-widest mb-3 block">
            {category}
          </span>
        )}
        <h3 className="font-display text-lg md:text-xl font-bold uppercase tracking-tight text-white group-hover:text-[var(--accent)] transition-colors mb-2 line-clamp-2">
          {title}
        </h3>
        {excerpt && (
          <p className="text-gray-500 text-xs md:text-sm leading-relaxed line-clamp-2 mb-4">
            {excerpt}
          </p>
        )}
        <div className="flex items-center justify-between">
          {date && (
            <span className="text-[10px] text-gray-600 uppercase tracking-widest">
              {date}
            </span>
          )}
          <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-[var(--accent)] transition-colors ml-auto">
            Read <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}
