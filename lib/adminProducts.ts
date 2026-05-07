import "server-only";

import { SHOP_CATEGORIES } from "@/lib/shopCategories";
import { getFittingPriceString, normalizePriceInput } from "@/lib/fitting";
import type { WooCategory, WooProduct } from "@/lib/woocommerce";

export type AdminProductStatus = "publish" | "draft";

export type SupportedProductModel = {
  makeLabel: string;
  makeSlug: string;
  modelLabel: string;
  modelSlug: string;
  optionLabel: string;
};

export type AdminProductListItem = {
  id: number;
  name: string;
  slug: string;
  regularPrice: string;
  salePrice: string;
  imageUrl: string;
  status: AdminProductStatus;
  modelSlug: string | null;
  modelLabel: string;
};

export type AdminProductRecord = {
  id: number;
  name: string;
  regularPrice: string;
  salePrice: string;
  fittingPrice: string;
  shortDescription: string;
  description: string;
  status: AdminProductStatus;
  modelSlug: string;
  images: string[];
  slug: string;
};

export type AdminProductMutationInput = {
  name: string;
  regularPrice: string;
  salePrice: string;
  fittingPrice: string;
  shortDescription: string;
  description: string;
  status: AdminProductStatus;
  modelSlug: string;
  images: string[];
};

const SUPPORTED_PRODUCT_MODELS: SupportedProductModel[] = SHOP_CATEGORIES.flatMap((make) =>
  make.models.map((model) => ({
    makeLabel: make.label,
    makeSlug: make.slug,
    modelLabel: model.label,
    modelSlug: model.slug,
    optionLabel: `${make.label} / ${model.label}`,
  })),
);

export function getSupportedProductModels(): SupportedProductModel[] {
  return SUPPORTED_PRODUCT_MODELS;
}

export function getSupportedProductModelBySlug(
  slug: string | null | undefined,
): SupportedProductModel | null {
  if (!slug) return null;

  return SUPPORTED_PRODUCT_MODELS.find((model) => model.modelSlug === slug) || null;
}

function getMatchedSupportedModel(
  categories: Array<{ slug: string; name: string }> | undefined,
): SupportedProductModel | null {
  if (!categories?.length) return null;

  for (const category of categories) {
    const matched = getSupportedProductModelBySlug(category.slug);
    if (matched) return matched;
  }

  return null;
}

function normalizeAdminStatus(status: string): AdminProductStatus {
  return status === "publish" ? "publish" : "draft";
}

export function mapWooProductToAdminListItem(product: WooProduct): AdminProductListItem {
  const matchedModel = getMatchedSupportedModel(product.categories);

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    regularPrice: product.regular_price || product.price || "",
    salePrice: product.sale_price || "",
    imageUrl: product.images?.[0]?.src || "",
    status: normalizeAdminStatus(product.status),
    modelSlug: matchedModel?.modelSlug || null,
    modelLabel: matchedModel?.optionLabel || product.categories?.[0]?.name || "",
  };
}

export function mapWooProductToAdminRecord(product: WooProduct): AdminProductRecord {
  const matchedModel = getMatchedSupportedModel(product.categories);

  return {
    id: product.id,
    name: product.name,
    regularPrice: product.regular_price || product.price || "",
    salePrice: product.sale_price || "",
    fittingPrice: getFittingPriceString(product.meta_data),
    shortDescription: product.short_description || "",
    description: product.description || "",
    status: normalizeAdminStatus(product.status),
    modelSlug: matchedModel?.modelSlug || "",
    images: (product.images || []).map((image) => image.src).filter(Boolean),
    slug: product.slug,
  };
}

export function resolveWooCategoryIdForModelSlug(
  modelSlug: string,
  categories: WooCategory[],
): number | null {
  const category = categories.find((item) => item.slug === modelSlug);
  return category?.id ?? null;
}

function sanitizeText(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function sanitizeHtml(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function sanitizeImageList(value: unknown, fallbackSingleImage: unknown): string[] {
  const list = Array.isArray(value)
    ? value
    : typeof fallbackSingleImage === "string" && fallbackSingleImage.trim()
      ? [fallbackSingleImage]
      : [];

  const seen = new Set<string>();
  const output: string[] = [];

  for (const entry of list) {
    const next = sanitizeText(entry);
    if (!next || seen.has(next)) continue;
    seen.add(next);
    output.push(next);
  }

  return output;
}

function validateImageUrls(images: string[]): string | null {
  for (const imageUrl of images) {
    if (imageUrl.startsWith("/")) {
      return "Product images must use a public URL. Local /uploads paths cannot be sent to WooCommerce.";
    }

    try {
      const parsed = new URL(imageUrl);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        return "Image URLs must use http or https";
      }
    } catch {
      return "One or more image URLs are invalid";
    }
  }

  return null;
}

export function validateAdminProductPayload(payload: unknown): {
  data?: AdminProductMutationInput;
  error?: string;
  status?: number;
} {
  if (!payload || typeof payload !== "object") {
    return { error: "Invalid request body", status: 400 };
  }

  const body = payload as Record<string, unknown>;
  const name = sanitizeText(body.name);
  const regularPrice = normalizePriceInput(body.regularPrice);
  const salePrice = normalizePriceInput(body.salePrice);
  const fittingPrice = normalizePriceInput(body.fittingPrice);
  const shortDescription = sanitizeHtml(body.shortDescription);
  const description = sanitizeHtml(body.description);
  const status = sanitizeText(body.status) === "publish" ? "publish" : sanitizeText(body.status);
  const modelSlug = sanitizeText(body.modelSlug);
  const images = sanitizeImageList(body.images, body.imageUrl);

  if (!name) {
    return { error: "Product name is required", status: 400 };
  }

  if (!regularPrice) {
    return { error: "Regular price is required", status: 400 };
  }

  if (status !== "publish" && status !== "draft") {
    return { error: "Status must be publish or draft", status: 400 };
  }

  if (salePrice) {
    const sale = parseFloat(salePrice);
    const regular = parseFloat(regularPrice);

    if (sale > regular) {
      return { error: "Sale price cannot be greater than the regular price", status: 400 };
    }
  }

  if (fittingPrice && parseFloat(fittingPrice) < 0) {
    return { error: "Fitting price must be zero or greater", status: 400 };
  }

  const supportedModel = getSupportedProductModelBySlug(modelSlug);
  if (!supportedModel) {
    return { error: "Selected category/model is not supported", status: 400 };
  }

  const imageError = validateImageUrls(images);
  if (imageError) {
    return { error: imageError, status: 400 };
  }

  return {
    data: {
      name,
      regularPrice,
      salePrice,
      fittingPrice,
      shortDescription,
      description,
      status,
      modelSlug: supportedModel.modelSlug,
      images,
    },
  };
}
