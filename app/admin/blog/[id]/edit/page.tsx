"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PostForm from "@/components/admin/PostForm";
import { Loader2 } from "lucide-react";

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/blog/${params.id}`);
        if (!res.ok) {
          setError("Post not found");
          return;
        }
        const data = await res.json();
        setPost(data.post);
      } catch {
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={() => router.push("/admin/blog")}
          className="text-xs text-[var(--accent)] font-bold uppercase tracking-widest"
        >
          Back to posts
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight mb-6">
        Edit Post
      </h1>
      <PostForm
        initialData={{
          id: post.id,
          title: post.title,
          content: post.content,
          excerpt: post.excerpt || "",
          coverImage: post.coverImage || "",
          mediaItems: post.mediaItems || [],
          status: post.status,
          category: post.category || "",
          metaTitle: post.metaTitle || "",
          metaDescription: post.metaDescription || "",
        }}
      />
    </div>
  );
}
