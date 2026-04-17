import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const TARGET_DIRS = [
  "public/home-slider",
  "public/media/fdl",
  "public/gallery",
];

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const MAX_DIMENSION = 2400;
const JPEG_QUALITY = 78;
const WEBP_QUALITY = 76;

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
      continue;
    }

    if (IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }

  return files;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function compressImage(filePath) {
  const before = await fs.stat(filePath);
  const image = sharp(filePath, { failOn: "none" }).rotate();
  const metadata = await image.metadata();
  const longestEdge = Math.max(metadata.width ?? 0, metadata.height ?? 0);
  const needsResize = longestEdge > MAX_DIMENSION;
  const ext = path.extname(filePath).toLowerCase();

  let pipeline = image;

  if (needsResize) {
    pipeline = pipeline.resize({
      width: metadata.width && metadata.width >= metadata.height ? MAX_DIMENSION : undefined,
      height: metadata.height && metadata.height > metadata.width ? MAX_DIMENSION : undefined,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  if (ext === ".jpg" || ext === ".jpeg") {
    pipeline = pipeline.jpeg({
      quality: JPEG_QUALITY,
      mozjpeg: true,
      progressive: true,
      chromaSubsampling: "4:2:0",
    });
  } else if (ext === ".png") {
    pipeline = pipeline.png({
      compressionLevel: 9,
      palette: true,
      quality: 80,
      effort: 10,
    });
  } else if (ext === ".webp") {
    pipeline = pipeline.webp({
      quality: WEBP_QUALITY,
      effort: 6,
    });
  }

  const tempPath = `${filePath}.tmp`;
  await pipeline.toFile(tempPath);

  const after = await fs.stat(tempPath);

  if (after.size >= before.size) {
    await fs.unlink(tempPath);
    return {
      filePath,
      before: before.size,
      after: before.size,
      changed: false,
      resized: needsResize,
    };
  }

  await fs.rename(tempPath, filePath);

  return {
    filePath,
    before: before.size,
    after: after.size,
    changed: true,
    resized: needsResize,
  };
}

async function main() {
  const existingDirs = [];

  for (const dir of TARGET_DIRS) {
    try {
      await fs.access(dir);
      existingDirs.push(dir);
    } catch {
      // Ignore missing directories.
    }
  }

  const files = [];
  for (const dir of existingDirs) {
    files.push(...(await walk(dir)));
  }

  let beforeTotal = 0;
  let afterTotal = 0;
  let changedCount = 0;
  const topSavings = [];

  for (const file of files) {
    const result = await compressImage(file);
    beforeTotal += result.before;
    afterTotal += result.after;

    if (result.changed) {
      changedCount += 1;
      topSavings.push({
        filePath: result.filePath,
        saved: result.before - result.after,
        before: result.before,
        after: result.after,
      });
    }
  }

  topSavings.sort((a, b) => b.saved - a.saved);

  console.log(`Processed ${files.length} images.`);
  console.log(`Compressed ${changedCount} images.`);
  console.log(`Before: ${formatBytes(beforeTotal)}`);
  console.log(`After:  ${formatBytes(afterTotal)}`);
  console.log(`Saved:  ${formatBytes(beforeTotal - afterTotal)}`);

  if (topSavings.length > 0) {
    console.log("\nTop savings:");
    for (const item of topSavings.slice(0, 15)) {
      console.log(
        `${item.filePath} | ${formatBytes(item.before)} -> ${formatBytes(item.after)} | saved ${formatBytes(item.saved)}`
      );
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
