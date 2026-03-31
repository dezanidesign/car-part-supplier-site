import { prisma } from "./prisma";

type PostStatus = "DRAFT" | "PUBLISHED";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  let slug = slugify(base);
  let suffix = 0;
  while (true) {
    const candidate = suffix === 0 ? slug : `${slug}-${suffix}`;
    const existing = await prisma.post.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === excludeId) return candidate;
    suffix++;
  }
}

// ── Public queries ──────────────────────────────────────────────────────

export async function getPublishedPosts(page = 1, limit = 9, category?: string) {
  const where = {
    status: "PUBLISHED" as PostStatus,
    ...(category ? { category } : {}),
  };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      take: limit,
      skip: (page - 1) * limit,
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        category: true,
        publishedAt: true,
      },
    }),
    prisma.post.count({ where }),
  ]);

  return { posts, total, pages: Math.ceil(total / limit) };
}

export async function getPostBySlug(slug: string) {
  return prisma.post.findUnique({ where: { slug } });
}

// ── Admin queries ───────────────────────────────────────────────────────

export async function getAllPosts(page = 1, limit = 20, search?: string) {
  const where = search
    ? { title: { contains: search, mode: "insensitive" as const } }
    : {};

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      take: limit,
      skip: (page - 1) * limit,
    }),
    prisma.post.count({ where }),
  ]);

  return { posts, total, pages: Math.ceil(total / limit) };
}

export async function getPostById(id: string) {
  return prisma.post.findUnique({ where: { id } });
}

export async function createPost(data: {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  status?: PostStatus;
  category?: string;
  metaTitle?: string;
  metaDescription?: string;
}) {
  const slug = await uniqueSlug(data.title);
  return prisma.post.create({
    data: {
      ...data,
      slug,
      status: data.status ?? "DRAFT",
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
    },
  });
}

export async function updatePost(
  id: string,
  data: {
    title?: string;
    content?: string;
    excerpt?: string;
    coverImage?: string;
    status?: PostStatus;
    category?: string;
    metaTitle?: string;
    metaDescription?: string;
  }
) {
  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) return null;

  const slug = data.title ? await uniqueSlug(data.title, id) : undefined;

  // Set publishedAt when first published
  let publishedAt = existing.publishedAt;
  if (data.status === "PUBLISHED" && !existing.publishedAt) {
    publishedAt = new Date();
  }

  return prisma.post.update({
    where: { id },
    data: { ...data, ...(slug ? { slug } : {}), publishedAt },
  });
}

export async function deletePost(id: string) {
  return prisma.post.delete({ where: { id } });
}

export async function getPostStats() {
  const [total, published, drafts] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { status: "PUBLISHED" } }),
    prisma.post.count({ where: { status: "DRAFT" } }),
  ]);
  return { total, published, drafts };
}

export async function getCategories() {
  const posts = await prisma.post.findMany({
    where: { category: { not: null } },
    select: { category: true },
    distinct: ["category"],
  });
  return posts.map((p) => p.category).filter(Boolean) as string[];
}
