import { FULL_MEDIA_ITEMS } from "@/lib/generated/fullMediaManifest";

export type CuratedMediaType = "image" | "video";

export type CuratedMediaItem = {
  id: string;
  type: CuratedMediaType;
  src: string;
  poster?: string;
  brand: string;
  brandLabel: string;
  project: string;
  projectLabel: string;
  title: string;
  relatedSlugs: string[];
  featuredArea: string[];
  sourceFolder?: string;
};

export type HomeHeroSlide = {
  src: string;
  alt: string;
  href: string;
  label: string;
  slug: string;
};

const MEDIA_ITEMS = FULL_MEDIA_ITEMS as CuratedMediaItem[];

export const CURATED_MEDIA = MEDIA_ITEMS;

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

export const GALLERY_FILTER_LABELS: Record<string, string> = {
  all: "All",
  defender: "Defender",
  bmw: "BMW",
  audi: "Audi",
  "range-rover": "Range Rover",
  mercedes: "Mercedes",
  porsche: "Porsche",
  lamborghini: "Lamborghini",
  branding: "Branding",
  videos: "Videos",
  ford: "Ford",
  tesla: "Tesla",
  vw: "VW",
  misc: "Misc",
};

type MediaSelector = {
  project?: string;
  brand?: string;
  type?: CuratedMediaType;
  titleIncludes?: string;
  slug?: string;
};

function matchesSelector(item: CuratedMediaItem, selector: MediaSelector) {
  if (selector.project && item.project !== selector.project) return false;
  if (selector.brand && item.brand !== selector.brand) return false;
  if (selector.type && item.type !== selector.type) return false;
  if (selector.slug && !item.relatedSlugs.includes(selector.slug)) return false;
  if (
    selector.titleIncludes &&
    !item.title.toLowerCase().includes(selector.titleIncludes.toLowerCase())
  ) {
    return false;
  }

  return true;
}

function findMedia(selectors: MediaSelector[]): CuratedMediaItem {
  for (const selector of selectors) {
    const item = MEDIA_ITEMS.find((entry) => matchesSelector(entry, selector));
    if (item) return item;
  }

  const fallback =
    MEDIA_ITEMS.find((item) => item.type === "image") || MEDIA_ITEMS[0];

  if (!fallback) {
    throw new Error("Full media manifest is empty. Run npm run media:full.");
  }

  return fallback;
}

function findMediaItems(selectors: MediaSelector[], limit = 3): CuratedMediaItem[] {
  const picked = new Map<string, CuratedMediaItem>();

  for (const selector of selectors) {
    for (const item of MEDIA_ITEMS.filter((entry) => matchesSelector(entry, selector))) {
      picked.set(item.id, item);
      if (picked.size >= limit) return Array.from(picked.values());
    }
  }

  return Array.from(picked.values());
}

function itemsForBrand(brand: string, type?: CuratedMediaType) {
  return MEDIA_ITEMS.filter(
    (item) => item.brand === brand && (!type || item.type === type),
  );
}

export function getMediaVisualSrc(item: CuratedMediaItem) {
  return item.type === "video" ? item.poster || item.src : item.src;
}

function slideFromMedia({
  item,
  label,
  slug,
  alt,
}: {
  item: CuratedMediaItem;
  label: string;
  slug: string;
  alt?: string;
}): HomeHeroSlide {
  return {
    src: getMediaVisualSrc(item),
    alt: alt || `${label} by FDL Bespoke`,
    href: `/shop/${slug}`,
    label,
    slug,
  };
}

export const HOME_HERO_SLIDES: HomeHeroSlide[] = [
  {
    src: "/home-slider/defender1.jpg",
    alt: "Land Rover Defender by FDL Bespoke",
    label: "Defender",
    href: "/shop/land-rover-defender",
    slug: "land-rover-defender",
  },
  {
    src: "/home-slider/bmw2.jpg",
    alt: "BMW X5 by FDL Bespoke",
    label: "BMW X5 LCI",
    href: "/shop/x5-g05-lci",
    slug: "x5-g05-lci",
  },
  {
    src: "/home-slider/audi3.jpg",
    alt: "Audi R8 by FDL Bespoke",
    label: "Audi R8",
    href: "/shop/audi-r8",
    slug: "audi-r8",
  },
  {
    src: "/home-slider/lambo4.jpg",
    alt: "Lamborghini Huracan by FDL Bespoke",
    label: "Lamborghini Huracan",
    href: "/shop/huracan",
    slug: "huracan",
  },
  slideFromMedia({
    item: findMedia([{ project: "bmw-x5-g05-facelift-blue", type: "image" }]),
    label: "BMW X5 G05 Facelift",
    slug: "x5-g05",
  }),
  slideFromMedia({
    item: findMedia([{ project: "bmw-x5m-carbon-edition", type: "image" }]),
    label: "BMW X5M",
    slug: "x5m",
  }),
  slideFromMedia({
    item: findMedia([{ project: "range-rover-sport-lm-bodykit", type: "image" }]),
    label: "Range Rover Sport",
    slug: "range-rover-sport",
  }),
  slideFromMedia({
    item: findMedia([{ project: "mercedes-gle", type: "image" }]),
    label: "Mercedes GLE",
    slug: "gle",
  }),
  {
    src: "/media/fdl/full/range-rover/range-rover-sport-lm-bodykit/5b1a4867.jpg",
    alt: "Range Rover L494 Sport by FDL Bespoke",
    label: "Range Rover L494 Sport",
    href: "/shop/l494-sport",
    slug: "l494-sport",
  },
  {
    src: "/home-slider/porsche2.jpg",
    alt: "Porsche Taycan by FDL Bespoke",
    label: "Porsche Taycan",
    href: "/shop/taycan",
    slug: "taycan",
  },
];

export const HOME_HERO_MEDIA = HOME_HERO_SLIDES.map((slide) => ({
  src: slide.src,
  alt: slide.alt,
}));

export const HOME_EXPERTISE_MEDIA = findMedia([
  { project: "defender-black-110-bodykit", type: "image" },
  { brand: "defender", type: "image" },
]);

export const DEFENDER_HERO_IMAGE = HOME_EXPERTISE_MEDIA;
export const DEFENDER_GALLERY_MEDIA = itemsForBrand("defender", "image");
export const DEFENDER_VIDEO_MEDIA = itemsForBrand("defender", "video");
export const DEFENDER_ALL_MEDIA = itemsForBrand("defender");

export const SERVICE_MEDIA_GROUPS: Record<string, CuratedMediaItem[]> = {
  bodykits: findMediaItems(
    [
      { project: "bmw-x5m-carbon-edition", type: "video" },
      { project: "bmw-x5m-carbon-edition", type: "image" },
      { project: "defender-black-110-bodykit", type: "image" },
    ],
    3,
  ),
  "alloy-refurb": findMediaItems(
    [
      { project: "porsche-taycan-wrap-wheels", type: "image" },
      { project: "bmw-x5-lci", type: "image" },
    ],
    2,
  ),
  "privacy-glass": findMediaItems(
    [
      { project: "mercedes-gle", type: "image" },
      { brand: "mercedes", type: "video" },
    ],
    1,
  ),
  "light-tinting": findMediaItems(
    [
      { project: "defender-v8-black", type: "image" },
      { project: "defender-product-videos", type: "video", titleIncludes: "LED" },
      { project: "defender-black-110-bodykit", type: "image" },
    ],
    1,
  ),
  wrapping: findMediaItems(
    [
      { project: "porsche-taycan-wrap-wheels", type: "video" },
      { project: "porsche-911-rear-diffuser", type: "video" },
      { project: "tesla-model-s", type: "video" },
    ],
    3,
  ),
  "detailing-ppf": findMediaItems(
    [
      { project: "lamborghini-huracan", type: "video", titleIncludes: "Detail" },
      { project: "audi-r8", type: "video" },
      { project: "audi-r8", type: "image" },
    ],
    3,
  ),
  security: findMediaItems(
    [
      { project: "range-rover-sport-lm-bodykit", type: "video" },
      { brand: "range-rover", type: "image" },
    ],
    2,
  ),
  "accident-repair": [],
  "alloy-packages": findMediaItems(
    [
      { project: "porsche-taycan-wrap-wheels", type: "image" },
      { project: "range-rover-sport-lm-satin-black", type: "image" },
    ],
    2,
  ),
  branding: findMediaItems(
    [
      { project: "branding-amarok-europa", type: "video" },
      { project: "branding-amarok-europa", type: "image" },
      { project: "vw-amarok", type: "image" },
    ],
    3,
  ),
};

export const SERVICE_MEDIA: Record<string, CuratedMediaItem> = {
  bodykits: SERVICE_MEDIA_GROUPS.bodykits[0],
  "alloy-refurb": SERVICE_MEDIA_GROUPS["alloy-refurb"][0],
  "privacy-glass": SERVICE_MEDIA_GROUPS["privacy-glass"][0],
  "light-tinting": SERVICE_MEDIA_GROUPS["light-tinting"][0],
  wrapping: SERVICE_MEDIA_GROUPS.wrapping[0],
  "detailing-ppf": SERVICE_MEDIA_GROUPS["detailing-ppf"][0],
  security: SERVICE_MEDIA_GROUPS.security[0],
  "accident-repair": findMedia([{ brand: "range-rover", type: "image" }]),
  "alloy-packages": SERVICE_MEDIA_GROUPS["alloy-packages"][0],
  branding: SERVICE_MEDIA_GROUPS.branding[0],
};

export const SERVICE_ENTRY_MEDIA = {
  bespokeConversions: findMedia([
    { project: "bmw-x5m-carbon-edition", type: "image" },
    { project: "defender-black-110-bodykit", type: "image" },
  ]),
  vehicleSecurity: findMedia([
    { project: "range-rover-sport-lm-bodykit", type: "video" },
    { brand: "range-rover", type: "image" },
  ]),
  faceliftConversions: findMedia([
    { project: "bmw-x5-g05-facelift-blue", type: "image" },
    { project: "bmw-x5-g05-facelift-white", type: "image" },
  ]),
};

export const COLLECTION_DELIVERY_MEDIA = findMedia([
  { project: "misc-fdl-collection-recovery", type: "video" },
  { brand: "misc", type: "video", titleIncludes: "Collection" },
]);

export const GALLERY_FILTERS = FILTER_ORDER.filter((key) => {
  if (key === "all" || key === "videos") return true;
  return MEDIA_ITEMS.some((item) => item.brand === key);
}).map((key) => ({ key, label: GALLERY_FILTER_LABELS[key] || key }));

export function getGalleryItemsForFilter(filter: string): CuratedMediaItem[] {
  if (filter === "all") return MEDIA_ITEMS;
  if (filter === "videos") return MEDIA_ITEMS.filter((item) => item.type === "video");
  return MEDIA_ITEMS.filter((item) => item.brand === filter);
}

export function getGalleryBrands(): string[] {
  return FILTER_ORDER.filter(
    (key) =>
      key !== "all" &&
      key !== "videos" &&
      MEDIA_ITEMS.some((item) => item.brand === key),
  );
}

export function getShopCategoryMedia(slug: string): CuratedMediaItem[] {
  return MEDIA_ITEMS.filter((item) => item.relatedSlugs.includes(slug));
}
