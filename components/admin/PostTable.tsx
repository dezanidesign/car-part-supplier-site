"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import StatusBadge from "./StatusBadge";
import { Search, Trash2, Pencil, FilePlus, Loader2 } from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  status: string;
  category: string | null;
  coverImage: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function PostTable() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        admin: "true",
        page: String(page),
        limit: "20",
      });
      if (search) params.set("search", search);

      const res = await fetch(`/api/blog?${params}`);
      const data = await res.json();
      setPosts(data.posts || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await fetch(`/api/blog/${id}`, { method: "DELETE" });
      fetchPosts();
    } catch {
      alert("Failed to delete post");
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (d: string | null) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight">
            Blog Posts
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {total} post{total !== 1 ? "s" : ""} total
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 bg-[var(--accent)] text-black font-bold uppercase tracking-widest text-xs px-5 py-2.5 hover:brightness-110 transition-all shrink-0"
        >
          <FilePlus size={14} />
          New Post
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search posts..."
          className="w-full bg-[#0F0F0F] border border-white/10 text-white text-sm pl-9 pr-4 py-2.5 focus:border-[var(--accent)] focus:outline-none transition-colors"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-500">
          <Loader2 size={20} className="animate-spin" />
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-sm mb-4">
            {search ? "No posts match your search" : "No blog posts yet"}
          </p>
          {!search && (
            <Link
              href="/admin/blog/new"
              className="inline-flex items-center gap-2 text-[var(--accent)] text-xs font-bold uppercase tracking-widest hover:brightness-110"
            >
              <FilePlus size={14} />
              Write your first post
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
                    Post
                  </th>
                  <th className="text-left text-[10px] font-bold uppercase tracking-widest text-gray-500 px-4 py-3 hidden md:table-cell">
                    Status
                  </th>
                  <th className="text-left text-[10px] font-bold uppercase tracking-widest text-gray-500 px-4 py-3 hidden lg:table-cell">
                    Category
                  </th>
                  <th className="text-left text-[10px] font-bold uppercase tracking-widest text-gray-500 px-4 py-3 hidden md:table-cell">
                    Date
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr
                    key={post.id}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {post.coverImage && (
                          <div className="relative w-12 h-8 bg-[#111] shrink-0 overflow-hidden hidden sm:block">
                            <Image
                              src={post.coverImage}
                              alt=""
                              fill
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        )}
                        <div>
                          <Link
                            href={`/admin/blog/${post.id}/edit`}
                            className="font-medium text-white hover:text-[var(--accent)] transition-colors line-clamp-1"
                          >
                            {post.title}
                          </Link>
                          <p className="text-[10px] text-gray-600 font-mono mt-0.5">
                            /blog/{post.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <StatusBadge status={post.status} />
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-gray-500 text-xs">
                      {post.category || "—"}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-500 text-xs">
                      {formatDate(post.publishedAt || post.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <Link
                          href={`/admin/blog/${post.id}/edit`}
                          className="p-2 text-gray-500 hover:text-white transition-colors"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id, post.title)}
                          disabled={deleting === post.id}
                          className="p-2 text-gray-500 hover:text-red-400 transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          {deleting === post.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-8 h-8 text-xs font-bold ${
                p === page
                  ? "bg-[var(--accent)] text-black"
                  : "text-gray-500 hover:text-white hover:bg-white/5"
              } transition-colors`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
