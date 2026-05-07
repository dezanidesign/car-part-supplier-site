import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/blog";
import BlogContent from "@/components/blog/BlogContent";
import BlogMediaGallery from "@/components/blog/BlogMediaGallery";
import { ArrowLeft, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || undefined,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || undefined,
      images: post.coverImage ? [post.coverImage] : [],
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
    },
  };
}

function estimateReadingTime(html: string) {
  const text = html.replace(/<[^>]*>/g, "");
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);

  if (!post || post.status !== "PUBLISHED") {
    notFound();
  }

  const readTime = estimateReadingTime(post.content);
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <article className="pb-24 animate-in fade-in duration-700">
      {/* Cover image */}
      {post.coverImage && (
        <div className="relative -mt-48 md:-mt-52 w-full h-[50vh] md:h-[65vh] overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 md:px-8">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors mb-8 md:mb-10"
        >
          <ArrowLeft size={12} />
          Back to Journal
        </Link>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {post.category && (
            <span className="text-[var(--accent)] text-[10px] font-bold uppercase tracking-widest">
              {post.category}
            </span>
          )}
          {date && (
            <span className="text-gray-500 text-[10px] uppercase tracking-widest">
              {date}
            </span>
          )}
          <span className="flex items-center gap-1 text-gray-500 text-[10px] uppercase tracking-widest">
            <Clock size={10} />
            {readTime} min read
          </span>
        </div>

        {/* Title */}
        <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight leading-[0.95] mb-8 md:mb-10">
          {post.title}
          <span className="text-[var(--accent)]">.</span>
        </h1>

        {/* Divider */}
        <div className="w-16 h-px bg-[var(--accent)] mb-10 md:mb-12" />

        <BlogMediaGallery items={post.mediaItems || []} />

        {/* Body */}
        <BlogContent html={post.content} />

        {/* Footer */}
        <div className="border-t border-white/10 mt-14 pt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[var(--accent)] transition-colors"
          >
            <ArrowLeft size={12} />
            More from the Journal
          </Link>
        </div>
      </div>
    </article>
  );
}
