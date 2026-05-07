import { prisma } from "./prisma";

type PostStatus = "DRAFT" | "PUBLISHED";
type PostMediaType = "IMAGE" | "VIDEO";

export type BlogMediaItem = {
  id?: string;
  type: "image" | "video";
  url: string;
  posterImage?: string;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function sanitizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function isValidPublicMediaUrl(value: string): boolean {
  if (value.startsWith("/uploads/")) return true;

  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function sanitizeMediaItems(value: unknown): BlogMediaItem[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((entry) => {
      if (!entry || typeof entry !== "object") return null;

      const candidate = entry as Record<string, unknown>;
      const type = candidate.type === "video" ? "video" : candidate.type === "image" ? "image" : null;
      const url = sanitizeText(candidate.url);
      const posterImage = sanitizeText(candidate.posterImage);

      if (!type || !url || !isValidPublicMediaUrl(url)) {
        return null;
      }

      return {
        type,
        url,
        posterImage:
          type === "video" && posterImage && isValidPublicMediaUrl(posterImage)
            ? posterImage
            : "",
      } satisfies BlogMediaItem;
    })
    .filter(Boolean) as BlogMediaItem[];
}

function toPrismaMediaType(type: BlogMediaItem["type"]): PostMediaType {
  return type === "video" ? "VIDEO" : "IMAGE";
}

function mapPostMediaItem(item: {
  id: string;
  type: PostMediaType;
  url: string;
  posterImage: string | null;
}): BlogMediaItem {
  return {
    id: item.id,
    type: item.type === "VIDEO" ? "video" : "image",
    url: item.url,
    posterImage: item.posterImage || "",
  };
}

function mapPostRecord<
  T extends {
    mediaItems?: Array<{
      id: string;
      type: PostMediaType;
      url: string;
      posterImage: string | null;
    }>;
  },
>(post: T): Omit<T, "mediaItems"> & { mediaItems: BlogMediaItem[] } {
  const { mediaItems, ...rest } = post;

  return {
    ...rest,
    mediaItems: (mediaItems || []).map(mapPostMediaItem),
  };
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
  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      mediaItems: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  return post ? mapPostRecord(post) : null;
}

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
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      mediaItems: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  return post ? mapPostRecord(post) : null;
}

export async function createPost(data: {
  title: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  mediaItems?: BlogMediaItem[];
  status?: PostStatus;
  category?: string;
  metaTitle?: string;
  metaDescription?: string;
}) {
  const slug = await uniqueSlug(data.title);
  const mediaItems = sanitizeMediaItems(data.mediaItems);

  const post = await prisma.post.create({
    data: {
      title: sanitizeText(data.title),
      content: sanitizeText(data.content),
      excerpt: sanitizeText(data.excerpt),
      coverImage: sanitizeText(data.coverImage),
      category: sanitizeText(data.category),
      metaTitle: sanitizeText(data.metaTitle),
      metaDescription: sanitizeText(data.metaDescription),
      slug,
      status: data.status ?? "DRAFT",
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      mediaItems: mediaItems.length
        ? {
            create: mediaItems.map((item, index) => ({
              type: toPrismaMediaType(item.type),
              url: item.url,
              posterImage: item.posterImage || null,
              sortOrder: index,
            })),
          }
        : undefined,
    },
    include: {
      mediaItems: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  return mapPostRecord(post);
}

export async function updatePost(
  id: string,
  data: {
    title?: string;
    content?: string;
    excerpt?: string;
    coverImage?: string;
    mediaItems?: BlogMediaItem[];
    status?: PostStatus;
    category?: string;
    metaTitle?: string;
    metaDescription?: string;
  }
) {
  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) return null;

  const slug = data.title ? await uniqueSlug(data.title, id) : undefined;
  const mediaItems = sanitizeMediaItems(data.mediaItems);

  let publishedAt = existing.publishedAt;
  if (data.status === "PUBLISHED" && !existing.publishedAt) {
    publishedAt = new Date();
  }

  const post = await prisma.post.update({
    where: { id },
    data: {
      ...(typeof data.title === "string" ? { title: sanitizeText(data.title) } : {}),
      ...(typeof data.content === "string" ? { content: sanitizeText(data.content) } : {}),
      ...(typeof data.excerpt === "string" ? { excerpt: sanitizeText(data.excerpt) } : {}),
      ...(typeof data.coverImage === "string"
        ? { coverImage: sanitizeText(data.coverImage) }
        : {}),
      ...(typeof data.category === "string" ? { category: sanitizeText(data.category) } : {}),
      ...(typeof data.metaTitle === "string"
        ? { metaTitle: sanitizeText(data.metaTitle) }
        : {}),
      ...(typeof data.metaDescription === "string"
        ? { metaDescription: sanitizeText(data.metaDescription) }
        : {}),
      ...(typeof data.status === "string" ? { status: data.status } : {}),
      ...(slug ? { slug } : {}),
      publishedAt,
      ...(Array.isArray(data.mediaItems)
        ? {
            mediaItems: {
              deleteMany: {},
              create: mediaItems.map((item, index) => ({
                type: toPrismaMediaType(item.type),
                url: item.url,
                posterImage: item.posterImage || null,
                sortOrder: index,
              })),
            },
          }
        : {}),
    },
    include: {
      mediaItems: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  return mapPostRecord(post);
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
