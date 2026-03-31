import PostForm from "@/components/admin/PostForm";

export default function NewPostPage() {
  return (
    <div>
      <h1 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight mb-6">
        New Post
      </h1>
      <PostForm />
    </div>
  );
}
