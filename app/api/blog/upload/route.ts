import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-dynamic";

const MAX_IMAGE_FILE_SIZE = 10 * 1024 * 1024;
const MAX_VIDEO_FILE_SIZE = 25 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/x-m4v"];
const MAX_WIDTH_INLINE = 1600;
const MAX_WIDTH_COVER = 1920;
const WEBP_QUALITY = 82;
const LOCAL_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const BLOB_CACHE_MAX_AGE = 60 * 60 * 24 * 365;

type UploadType = "cover" | "inline";
type UploadScope = "blog" | "products";
type UploadMediaType = "image" | "video";

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

function getUploadMediaType(
  value: FormDataEntryValue | null,
  file: File,
): UploadMediaType {
  if (value === "video" || ALLOWED_VIDEO_TYPES.includes(file.type)) {
    return "video";
  }

  return "image";
}

function getBlobPath(
  scope: UploadScope,
  type: UploadType,
  mediaType: UploadMediaType,
  timestamp: number,
  slug: string,
  extension: string,
): string {
  const now = new Date(timestamp);
  const year = String(now.getUTCFullYear());
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");

  if (scope === "products") {
    return `products/${year}/${month}/${timestamp}-${slug}.webp`;
  }

  if (mediaType === "video") {
    return `blog/videos/${year}/${month}/${timestamp}-${slug}.${extension}`;
  }

  const section = type === "cover" ? "covers" : "inline";
  return `blog/${section}/${year}/${month}/${timestamp}-${slug}.${extension}`;
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
      return NextResponse.json({ error: "No media file was provided." }, { status: 400 });
    }

    const mediaType = getUploadMediaType(formData.get("mediaType"), file);
    const allowedTypes =
      mediaType === "video" ? ALLOWED_VIDEO_TYPES : ALLOWED_IMAGE_TYPES;
    const maxFileSize =
      mediaType === "video" ? MAX_VIDEO_FILE_SIZE : MAX_IMAGE_FILE_SIZE;

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            mediaType === "video"
              ? "Unsupported format. Use MP4 or M4V."
              : "Unsupported format. Use JPG, PNG, or WebP.",
        },
        { status: 400 },
      );
    }

    if (file.size > maxFileSize) {
      return NextResponse.json(
        {
          error: `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum is ${(
            maxFileSize /
            1024 /
            1024
          ).toFixed(0)}MB.`,
        },
        { status: 400 },
      );
    }

    const inputBuffer = Buffer.from(await file.arrayBuffer());
    const timestamp = Date.now();
    const slug = sanitizeSlug(file.name);
    let outputBuffer: Uint8Array = inputBuffer;
    let outputContentType = file.type;
    let width: number | null = null;
    let height: number | null = null;

    if (mediaType === "image") {
      const maxWidth = type === "cover" ? MAX_WIDTH_COVER : MAX_WIDTH_INLINE;

      const transformer = sharp(inputBuffer).rotate().resize({
        width: maxWidth,
        withoutEnlargement: true,
        fit: "inside",
      });

      const { data: processedBuffer, info } = await transformer
        .webp({ quality: WEBP_QUALITY })
        .toBuffer({ resolveWithObject: true });

      outputBuffer = processedBuffer;
      outputContentType = "image/webp";
      width = info.width ?? null;
      height = info.height ?? null;
    }

    const extension =
      mediaType === "video"
        ? file.type === "video/x-m4v"
          ? "m4v"
          : "mp4"
        : "webp";
    const blobPath = getBlobPath(scope, type, mediaType, timestamp, slug, extension);

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
      await writeFile(localPath, outputBuffer);

      return NextResponse.json({
        url: getLocalUrl(blobPath),
        pathname: blobPath,
        size: outputBuffer.length,
        originalSize: file.size,
        width,
        height,
        contentType: outputContentType,
        storage: "local",
      });
    }

    const blob = await put(blobPath, Buffer.from(outputBuffer), {
      access: "public",
      contentType: outputContentType,
      cacheControlMaxAge: BLOB_CACHE_MAX_AGE,
      addRandomSuffix: false,
    });

    return NextResponse.json({
      url: blob.url,
      downloadUrl: blob.downloadUrl,
      pathname: blob.pathname,
      size: outputBuffer.length,
      originalSize: file.size,
      width,
      height,
      contentType: outputContentType,
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
