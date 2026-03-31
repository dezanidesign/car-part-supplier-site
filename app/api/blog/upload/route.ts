import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_WIDTH_INLINE = 1600;
const MAX_WIDTH_COVER = 1920;
const WEBP_QUALITY = 82;
const LOCAL_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const BLOB_CACHE_MAX_AGE = 60 * 60 * 24 * 365;

type UploadType = "cover" | "inline";
type UploadScope = "blog" | "products";

function sanitizeSlug(filename: string): string {
  const base = filename.replace(/\.[^.]+$/, "").trim().toLowerCase();
  const slug = base
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return slug || "image";
}

function getUploadScope(value: FormDataEntryValue | null): UploadScope {
  return value === "products" ? "products" : "blog";
}

function getUploadType(value: FormDataEntryValue | null): UploadType {
  return value === "cover" ? "cover" : "inline";
}

function getBlobPath(scope: UploadScope, type: UploadType, timestamp: number, slug: string): string {
  const now = new Date(timestamp);
  const year = String(now.getUTCFullYear());
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");

  if (scope === "products") {
    return `products/${year}/${month}/${timestamp}-${slug}.webp`;
  }

  const section = type === "cover" ? "covers" : "inline";
  return `blog/${section}/${year}/${month}/${timestamp}-${slug}.webp`;
}

function getLocalPath(blobPath: string) {
  return path.join(LOCAL_UPLOAD_DIR, ...blobPath.split("/"));
}

function getLocalUrl(blobPath: string) {
  return `/uploads/${blobPath}`;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const type = getUploadType(formData.get("type"));
    const scope = getUploadScope(formData.get("scope"));
    const requirePublicUrl = formData.get("requirePublicUrl") === "1";

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No image file was provided." }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported format. Use JPG, PNG, or WebP." },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum is 10MB.`,
        },
        { status: 400 },
      );
    }

    const inputBuffer = Buffer.from(await file.arrayBuffer());
    const maxWidth = type === "cover" ? MAX_WIDTH_COVER : MAX_WIDTH_INLINE;

    const transformer = sharp(inputBuffer).rotate().resize({
      width: maxWidth,
      withoutEnlargement: true,
      fit: "inside",
    });

    const { data: processedBuffer, info } = await transformer
      .webp({ quality: WEBP_QUALITY })
      .toBuffer({ resolveWithObject: true });

    const timestamp = Date.now();
    const slug = sanitizeSlug(file.name);
    const blobPath = getBlobPath(scope, type, timestamp, slug);

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      if (requirePublicUrl) {
        return NextResponse.json(
          {
            error:
              "A public Blob token is required for this upload. Add BLOB_READ_WRITE_TOKEN to the server environment.",
          },
          { status: 500 },
        );
      }

      const localPath = getLocalPath(blobPath);
      await mkdir(path.dirname(localPath), { recursive: true });
      await writeFile(localPath, processedBuffer);

      return NextResponse.json({
        url: getLocalUrl(blobPath),
        pathname: blobPath,
        size: processedBuffer.length,
        originalSize: file.size,
        width: info.width,
        height: info.height,
        contentType: "image/webp",
        storage: "local",
      });
    }

    const blob = await put(blobPath, processedBuffer, {
      access: "public",
      contentType: "image/webp",
      cacheControlMaxAge: BLOB_CACHE_MAX_AGE,
      addRandomSuffix: false,
    });

    return NextResponse.json({
      url: blob.url,
      downloadUrl: blob.downloadUrl,
      pathname: blob.pathname,
      size: processedBuffer.length,
      originalSize: file.size,
      width: info.width,
      height: info.height,
      contentType: "image/webp",
      storage: "blob",
    });
  } catch (error) {
    console.error("[API /api/blog/upload]", error);

    const message =
      error instanceof Error ? error.message : "Unexpected upload failure.";

    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}
