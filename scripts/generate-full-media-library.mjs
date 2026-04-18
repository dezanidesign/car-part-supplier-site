import fs from "node:fs/promises";
import path from "node:path";
import { spawn } from "node:child_process";
import sharp from "sharp";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";

const ffmpegPath = ffmpegInstaller.path;

const SOURCE_ROOT = path.join("app", "gallery", "carImages", "FDL WEBSITE CONTENT");
const PUBLIC_ROOT = path.join("public", "media", "fdl", "full");
const MANIFEST_PATH = path.join("lib", "generated", "fullMediaManifest.ts");

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const VIDEO_EXTENSIONS = new Set([".mp4", ".m4v", ".mov"]);
const MAX_IMAGE_DIMENSION = 2200;
const MAX_VIDEO_DIMENSION = 1280;

const FILTER_ORDER = [
  "all",
  "defender",
  "bmw",
  "audi",
  "range-rover",
  "mercedes",
  "porsche",
  "lamborghini",
  "branding",
  "videos",
  "ford",
  "tesla",
  "vw",
  "misc",
];

const BRAND_LABELS = {
  audi: "Audi",
  bmw: "BMW",
  branding: "Branding",
  defender: "Defender",
  ford: "Ford",
  lamborghini: "Lamborghini",
  mercedes: "Mercedes",
  misc: "Misc Videos",
  porsche: "Porsche",
  "range-rover": "Range Rover",
  tesla: "Tesla",
  vw: "VW",
};

function cleanSegment(value) {
  return value
    .replace(/[\uF000-\uF8FF]/g, " ")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(value) {
  return cleanSegment(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\+/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function titleCase(value) {
  const acronyms = new Set(["bmw", "vw", "r8", "rsq8", "rs3", "x5", "x5m", "x7", "xm", "g63", "gle", "svr", "lm", "jcb", "ppf", "led", "f95", "g05", "lci", "l460", "f32", "f80"]);

  return cleanSegment(value)
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => (acronyms.has(word) ? word.toUpperCase() : word[0].toUpperCase() + word.slice(1)))
    .join(" ");
}

function getBrand(rawTopSegment) {
  const top = cleanSegment(rawTopSegment).toLowerCase();

  if (top.includes("audi")) return "audi";
  if (top.includes("bmw")) return "bmw";
  if (top.includes("branding")) return "branding";
  if (top.includes("defender")) return "defender";
  if (top.includes("ford")) return "ford";
  if (top.includes("lamborghini")) return "lamborghini";
  if (top.includes("mercedes")) return "mercedes";
  if (top.includes("misc")) return "misc";
  if (top.includes("porsche")) return "porsche";
  if (top.includes("range rover")) return "range-rover";
  if (top.includes("tesla")) return "tesla";
  if (top.includes("vw")) return "vw";

  return slugify(top) || "misc";
}

function projectMetadata(relativeParts, fileName) {
  const brand = getBrand(relativeParts[0] || "misc");
  const cleanParts = relativeParts.map(cleanSegment);
  const rest = cleanParts.slice(1).filter(Boolean);
  const base = cleanSegment(path.parse(fileName).name);
  const haystack = [...cleanParts, base].join(" ").toLowerCase();
  const brandLabel = BRAND_LABELS[brand] || titleCase(brand);

  const make = (project, projectLabel, relatedSlugs = []) => ({
    brand,
    brandLabel,
    project,
    projectLabel,
    relatedSlugs,
  });

  if (brand === "audi") {
    if (haystack.includes("rsq8")) return make("audi-rsq8-bodykit", "Audi RSQ8 Bodykit", ["audi-rsq8"]);
    if (haystack.includes("r8")) return make("audi-r8", "Audi R8", ["audi-r8"]);
    if (haystack.includes("rs3")) return make("audi-rs3-8v-saloon", "Audi RS3 8V Saloon");
  }

  if (brand === "bmw") {
    if (haystack.includes("x5 lci") && haystack.includes("x5m")) {
      return make(
        "bmw-x5-lci-x5m",
        "BMW X5 LCI + X5M",
        ["bmw-x5", "x5-g05-lci", "x5m", "x5m-lci"]
      );
    }
    if (haystack.includes("x5m")) {
      const isCarbon = haystack.includes("carbon edition");
      return make(
        isCarbon ? "bmw-x5m-carbon-edition" : "bmw-x5m-f95",
        isCarbon ? "BMW X5M Carbon Edition" : "BMW X5M F95",
        ["x5m", "x5m-lci"]
      );
    }
    if (haystack.includes("x7")) return make("bmw-x7-lci", "BMW X7 LCI", ["x7-g07", "x7-g07-lci"]);
    if (haystack.includes("xm")) return make("bmw-xm", "BMW XM", ["xm"]);
    if (haystack.includes("x5 g05 facelift")) {
      if (haystack.includes("blue")) return make("bmw-x5-g05-facelift-blue", "BMW X5 G05 Facelift Blue", ["bmw-x5", "x5-g05"]);
      if (haystack.includes("grey")) return make("bmw-x5-g05-facelift-grey", "BMW X5 G05 Facelift Grey", ["bmw-x5", "x5-g05"]);
      if (haystack.includes("white")) return make("bmw-x5-g05-facelift-white", "BMW X5 G05 Facelift White", ["bmw-x5", "x5-g05"]);
      return make("bmw-x5-g05-facelift", "BMW X5 G05 Facelift", ["bmw-x5", "x5-g05"]);
    }
    if (haystack.includes("x5 lci")) {
      if (haystack.includes("frozen black")) return make("bmw-x5-lci-frozen-black", "BMW X5 LCI Frozen Black", ["bmw-x5", "x5-g05-lci"]);
      return make("bmw-x5-lci", "BMW X5 LCI", ["bmw-x5", "x5-g05-lci"]);
    }
    if (haystack.includes("420d")) return make("bmw-420d-f32-zayn", "BMW 420D F32 Zayn");
    if (haystack.includes("g20") || haystack.includes("3 series")) return make("bmw-g20-3-series", "BMW G20 3 Series");
    if (haystack.includes("m3")) return make("bmw-m3-f80", "BMW M3 F80");
    if (haystack.includes("m5")) return make("bmw-m5", "BMW M5");
  }

  if (brand === "defender") {
    if (haystack.includes("product videos")) return make("defender-product-videos", "Defender Product Videos", ["land-rover-defender", "defender-l663"]);
    if (haystack.includes("black 110")) return make("defender-black-110-bodykit", "Defender Black 110 Bodykit", ["land-rover-defender", "defender-l663"]);
    if (haystack.includes("borasco")) return make("defender-borasco-grey", "Defender Borasco Grey", ["land-rover-defender", "defender-l663"]);
    if (haystack.includes("v8 black")) return make("defender-v8-black", "Defender V8 Black", ["land-rover-defender", "defender-l663"]);
    if (haystack.includes("lm bodykit")) return make("defender-lm-bodykit-satin-black", "Defender LM Bodykit Satin Black", ["land-rover-defender", "defender-l663"]);
    if (haystack.includes("silver") || haystack.includes("grey jcb")) return make("defender-silver-grey-jcb", "Defender Silver Grey JCB", ["land-rover-defender", "defender-l663"]);
    return make("defender-clips", "Defender Clips", ["land-rover-defender", "defender-l663"]);
  }

  if (brand === "range-rover") {
    if (haystack.includes("l460")) return make("range-rover-l460-vogue", "Range Rover L460 Vogue", ["l460-vogue"]);
    if (haystack.includes("svr")) return make("range-rover-svr", "Range Rover SVR", ["range-rover-sport", "l494-sport", "l461-sport"]);
    if (haystack.includes("satin black")) return make("range-rover-sport-lm-satin-black", "Range Rover Sport LM Satin Black", ["range-rover-sport", "l494-sport", "l461-sport"]);
    if (haystack.includes("sport")) return make("range-rover-sport-lm-bodykit", "Range Rover Sport LM Bodykit", ["range-rover-sport", "l494-sport", "l461-sport"]);
    return make("range-rover-archive", "Range Rover Archive");
  }

  if (brand === "mercedes") {
    if (haystack.includes("gle")) return make("mercedes-gle", "Mercedes GLE", ["gle"]);
    if (haystack.includes("g wagon") || haystack.includes("g63") || haystack.includes("brabus")) return make("mercedes-g-wagon-g63", "Mercedes G Wagon G63", ["g-wagon-g63"]);
  }

  if (brand === "porsche") {
    if (haystack.includes("taycan")) return make("porsche-taycan-wrap-wheels", "Porsche Taycan Wrap + Wheels", ["taycan"]);
    if (haystack.includes("911")) return make("porsche-911-rear-diffuser", "Porsche 911 Rear Diffuser", ["911"]);
    if (haystack.includes("cayenne")) return make("porsche-cayenne-gts-kit", "Porsche Cayenne GTS Kit", ["cayenne"]);
  }

  if (brand === "lamborghini") {
    if (haystack.includes("huracan")) return make("lamborghini-huracan", "Lamborghini Huracan", ["huracan"]);
  }

  if (brand === "branding") return make("branding-amarok-europa", "Amarok Europa Branding");
  if (brand === "ford") return make("ford-ranger-t7-bodykit", "Ford Ranger T7 Bodykit");
  if (brand === "tesla") return make("tesla-model-s", "Tesla Model S");
  if (brand === "vw") return make("vw-amarok", "VW Amarok");
  if (brand === "misc") return make(`misc-${slugify(base) || "video"}`, titleCase(base || "Misc Video"));

  const fallbackProject = slugify(rest[0] || base || brand);
  return make(fallbackProject, titleCase(rest[0] || base || brandLabel));
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
      continue;
    }
    files.push(fullPath);
  }

  return files;
}

async function ensureDir(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

function toPublicPath(filePath) {
  return `/${filePath.split(path.sep).join("/")}`.replace(/^\/public\//, "/");
}

function safeBaseName(fileName) {
  return slugify(path.parse(fileName).name) || "media";
}

function uniquePath(basePath, usedPaths) {
  if (!usedPaths.has(basePath)) {
    usedPaths.add(basePath);
    return basePath;
  }

  const ext = path.extname(basePath);
  const stem = basePath.slice(0, -ext.length);
  let index = 2;

  while (usedPaths.has(`${stem}-${index}${ext}`)) {
    index += 1;
  }

  const nextPath = `${stem}-${index}${ext}`;
  usedPaths.add(nextPath);
  return nextPath;
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";

    child.stderr?.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${path.basename(command)} exited with ${code}\n${stderr.trim()}`));
    });
  });
}

function ffmpegScaleFilter(maxDimension) {
  return `scale=w='if(gte(iw,ih),min(${maxDimension},iw),-2)':h='if(gte(iw,ih),-2,min(${maxDimension},ih))'`;
}

async function processImage(sourcePath, outputPath) {
  await ensureDir(outputPath);

  const image = sharp(sourcePath, { failOn: "none" }).rotate();
  const metadata = await image.metadata();
  const longestEdge = Math.max(metadata.width ?? 0, metadata.height ?? 0);

  let pipeline = image;
  if (longestEdge > MAX_IMAGE_DIMENSION) {
    pipeline = pipeline.resize({
      width: metadata.width && metadata.width >= metadata.height ? MAX_IMAGE_DIMENSION : undefined,
      height: metadata.height && metadata.height > metadata.width ? MAX_IMAGE_DIMENSION : undefined,
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  await pipeline.jpeg({
    quality: 78,
    mozjpeg: true,
    progressive: true,
    chromaSubsampling: "4:2:0",
  }).toFile(outputPath);
}

async function processVideo(sourcePath, outputPath, posterPath) {
  await ensureDir(outputPath);

  await run(ffmpegPath, [
    "-y",
    "-i",
    sourcePath,
    "-vf",
    ffmpegScaleFilter(MAX_VIDEO_DIMENSION),
    "-an",
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-crf",
    "30",
    "-movflags",
    "+faststart",
    "-pix_fmt",
    "yuv420p",
    outputPath,
  ]);

  await ensureDir(posterPath);

  try {
    await run(ffmpegPath, [
      "-y",
      "-ss",
      "00:00:01",
      "-i",
      sourcePath,
      "-frames:v",
      "1",
      "-vf",
      ffmpegScaleFilter(1400),
      "-q:v",
      "5",
      posterPath,
    ]);
  } catch {
    // Poster fallback is assigned later from project/brand stills.
  }
}

function sortItems(items) {
  return items.sort((a, b) => {
    const brand = FILTER_ORDER.indexOf(a.brand) - FILTER_ORDER.indexOf(b.brand);
    if (brand !== 0) return brand;
    if (a.project !== b.project) return a.project.localeCompare(b.project);
    if (a.type !== b.type) return a.type === "image" ? -1 : 1;
    return a.id.localeCompare(b.id);
  });
}

function itemTitle(item, fileName) {
  const base = titleCase(path.parse(fileName).name);
  if (/^5B1A/i.test(base) || /^\d+$/.test(base.replace(/\s/g, ""))) {
    return `${item.projectLabel} ${item.type === "image" ? "still" : "video"}`;
  }
  return base;
}

function manifestSource(items, stats) {
  return `// This file is generated by scripts/generate-full-media-library.mjs.
// Do not edit by hand.

export const FULL_MEDIA_STATS = ${JSON.stringify(stats, null, 2)} as const;

export const FULL_MEDIA_ITEMS = ${JSON.stringify(items, null, 2)};
`;
}

async function main() {
  if (!ffmpegPath) {
    throw new Error("@ffmpeg-installer/ffmpeg did not provide an ffmpeg binary path.");
  }

  await fs.rm(PUBLIC_ROOT, { recursive: true, force: true });
  await fs.mkdir(PUBLIC_ROOT, { recursive: true });
  await fs.mkdir(path.dirname(MANIFEST_PATH), { recursive: true });

  const allFiles = await walk(SOURCE_ROOT);
  const mediaFiles = allFiles.filter((file) => {
    if (path.basename(file).startsWith(".")) return false;
    const ext = path.extname(file).toLowerCase();
    return IMAGE_EXTENSIONS.has(ext) || VIDEO_EXTENSIONS.has(ext);
  });

  const usedPaths = new Set();
  const rawItems = [];
  let imageCount = 0;
  let videoCount = 0;

  for (const sourcePath of mediaFiles) {
    const ext = path.extname(sourcePath).toLowerCase();
    const relativePath = path.relative(SOURCE_ROOT, sourcePath);
    const relativeParts = relativePath.split(path.sep);
    const fileName = relativeParts.at(-1) || "media";
    const meta = projectMetadata(relativeParts.slice(0, -1), fileName);
    const baseName = safeBaseName(fileName);
    const outputDir = path.join(PUBLIC_ROOT, meta.brand, meta.project);
    const type = IMAGE_EXTENSIONS.has(ext) ? "image" : "video";

    const outputPath = uniquePath(
      path.join(outputDir, `${baseName}${type === "image" ? ".jpg" : ".mp4"}`),
      usedPaths
    );

    const item = {
      id: slugify(`${meta.brand}-${meta.project}-${baseName}`),
      type,
      src: toPublicPath(outputPath),
      brand: meta.brand,
      brandLabel: meta.brandLabel,
      project: meta.project,
      projectLabel: meta.projectLabel,
      title: "",
      relatedSlugs: meta.relatedSlugs,
      featuredArea: ["gallery", ...(meta.relatedSlugs.length > 0 ? ["shop-category"] : [])],
      sourceFolder: relativeParts.slice(0, -1).map(cleanSegment).join("/"),
    };

    item.title = itemTitle(item, fileName);

    if (type === "image") {
      await processImage(sourcePath, outputPath);
      imageCount += 1;
    } else {
      const posterPath = outputPath.replace(/\.mp4$/, "-poster.jpg");
      await processVideo(sourcePath, outputPath, posterPath);
      try {
        await fs.access(posterPath);
        item.poster = toPublicPath(posterPath);
      } catch {
        // Assigned after all images have been processed.
      }
      videoCount += 1;
    }

    rawItems.push(item);
  }

  const projectPosters = new Map();
  const brandPosters = new Map();

  for (const item of rawItems) {
    if (item.type !== "image") continue;
    if (!projectPosters.has(item.project)) projectPosters.set(item.project, item.src);
    if (!brandPosters.has(item.brand)) brandPosters.set(item.brand, item.src);
  }

  for (const item of rawItems) {
    if (item.type !== "video" || item.poster) continue;
    item.poster = projectPosters.get(item.project) || brandPosters.get(item.brand);
  }

  const items = sortItems(rawItems).map((item, index) => ({
    ...item,
    id: `${item.id}-${String(index + 1).padStart(3, "0")}`,
  }));

  const stats = {
    generatedAt: new Date().toISOString(),
    sourceRoot: SOURCE_ROOT.replaceAll(path.sep, "/"),
    publicRoot: PUBLIC_ROOT.replaceAll(path.sep, "/"),
    totalItems: items.length,
    imageCount,
    videoCount,
  };

  await fs.writeFile(MANIFEST_PATH, manifestSource(items, stats));

  console.log(`Generated ${items.length} media items.`);
  console.log(`Images: ${imageCount}`);
  console.log(`Videos: ${videoCount}`);
  console.log(`Manifest: ${MANIFEST_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
