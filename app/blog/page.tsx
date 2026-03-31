import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedPosts, getCategories } from "@/lib/blog";
import BlogCard from "@/components/blog/BlogCard";

export const metadata: Metadata = {
  title: "The Journal | FDL Bespoke",
  description:
    "News, builds, and insights from the FDL Bespoke workshop. Automotive styling tips, featured projects, and more.",
};

export const dynamic = "force-dynamic";

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { page?: string; category?: string };
}) {
  const page = parseInt(searchParams.page || "1");
  const category = searchParams.category || undefined;

  let posts: Awaited<ReturnType<typeof getPublishedPosts>>["posts"] = [];
  let pages = 0;
  let categories: string[] = [];

  try {
    const [result, cats] = await Promise.all([
      getPublishedPosts(page, 9, category),
      getCategories(),
    ]);
    posts = result.posts;
    pages = result.pages;
    categories = cats;
  } catch {
    // Database not configured yet — show empty state
  }

  return (
    <div className="pb-24 animate-in fade-in duration-700">
      {/* Header */}
      <div className="px-6 md:px-16 max-w-[1920px] mx-auto mb-12 md:mb-16">
        <h1 className="font-display text-5xl md:text-8xl font-bold uppercase tracking-tight leading-none mb-6">
          The Journal<span className="text-[var(--accent)]">.</span>
        </h1>
        <p className="text-gray-400 max-w-xl text-sm md:text-base leading-relaxed border-l-2 border-[var(--accent)] pl-6">
          Builds, news, and insights from our workshop.
        </p>
      </div>

      {/* Category filters */}
      {categories.length > 0 && (
        <div className="px-6 md:px-16 max-w-[1920px] mx-auto mb-10">
          <div className="flex flex-wrap gap-2">
            <Link
              href="/blog"
              className={`text-[10px] font-bold uppercase tracking-widest px-4 py-2 border transition-colors ${
                !category
                  ? "border-[var(--accent)] text-[var(--accent)]"
                  : "border-white/10 text-gray-500 hover:text-white"
              }`}
            >
              All
            </Link>
            {categories.map((c) => (
              <Link
                key={c}
                href={`/blog?category=${encodeURIComponent(c)}`}
                className={`text-[10px] font-bold uppercase tracking-widest px-4 py-2 border transition-colors ${
                  category === c
                    ? "border-[var(--accent)] text-[var(--accent)]"
                    : "border-white/10 text-gray-500 hover:text-white"
                }`}
              >
                {c}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Post grid */}
      <div className="px-6 md:px-16 max-w-[1920px] mx-auto">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-sm">
              {category
                ? `No posts in "${category}" yet.`
                : "No posts published yet. Check back soon."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {posts.map((post) => (
              <BlogCard
                key={post.id}
                title={post.title}
                slug={post.slug}
                excerpt={post.excerpt}
                coverImage={post.coverImage}
                category={post.category}
                publishedAt={post.publishedAt?.toString() ?? null}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => {
              const params = new URLSearchParams();
              if (p > 1) params.set("page", String(p));
              if (category) params.set("category", category);
              const href = `/blog${params.toString() ? `?${params}` : ""}`;

              return (
                <Link
                  key={p}
                  href={href}
                  className={`w-9 h-9 flex items-center justify-center text-xs font-bold transition-colors ${
                    p === page
                      ? "bg-[var(--accent)] text-black"
                      : "text-gray-500 hover:text-white border border-white/10 hover:border-white/20"
                  }`}
                >
                  {p}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
