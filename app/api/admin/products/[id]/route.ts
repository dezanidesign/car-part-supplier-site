import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { requireAdminSession } from "@/lib/adminSession";
import {
  mapWooProductToAdminRecord,
  resolveWooCategoryIdForModelSlug,
  validateAdminProductPayload,
} from "@/lib/adminProducts";
import { clearWooCache, getWooRevalidationTags } from "@/lib/woo";
import {
  getAdminProductById,
  getAdminProductCategories,
  getWooErrorMessage,
  getWooErrorStatus,
  trashAdminProduct,
  updateAdminProduct,
  updateAdminProductStatus,
} from "@/lib/woocommerce";

export const dynamic = "force-dynamic";

function parseProductId(id: string): number | null {
  const numericId = Number(id);
  return Number.isInteger(numericId) && numericId > 0 ? numericId : null;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { response } = await requireAdminSession();
  if (response) return response;

  const productId = parseProductId(params.id);
  if (!productId) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  try {
    const product = await getAdminProductById(productId);
    if (product.type !== "simple") {
      return NextResponse.json(
        { error: "Only simple products are supported in this admin v1" },
        { status: 422 },
      );
    }
    return NextResponse.json({ product: mapWooProductToAdminRecord(product) });
  } catch (error) {
    console.error("[API /api/admin/products/[id] GET]", error);
    return NextResponse.json(
      { error: getWooErrorMessage(error) },
      { status: getWooErrorStatus(error) },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { response } = await requireAdminSession();
  if (response) return response;

  const productId = parseProductId(params.id);
  if (!productId) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  try {
    const existing = await getAdminProductById(productId);
    if (existing.type !== "simple") {
      return NextResponse.json(
        { error: "Only simple products are supported in this admin v1" },
        { status: 422 },
      );
    }

    const body = await request.json();
    const validation = validateAdminProductPayload(body);

    if (!validation.data) {
      return NextResponse.json(
        { error: validation.error || "Invalid product payload" },
        { status: validation.status || 400 },
      );
    }

    const categories = await getAdminProductCategories();
    const categoryId = resolveWooCategoryIdForModelSlug(validation.data.modelSlug, categories);

    if (!categoryId) {
      return NextResponse.json(
        { error: "The selected model slug does not map to a WooCommerce category" },
        { status: 422 },
      );
    }

    const product = await updateAdminProduct(productId, {
      name: validation.data.name,
      type: "simple",
      regular_price: validation.data.regularPrice,
      sale_price: validation.data.salePrice || undefined,
      description: validation.data.description,
      short_description: validation.data.shortDescription,
      status: validation.data.status,
      categories: [{ id: categoryId }],
      images: validation.data.images.map((imageUrl) => ({ src: imageUrl })),
    });

    clearWooCache();
    const tags = new Set<string>([
      ...getWooRevalidationTags({
        productSlug: product.slug || existing.slug,
        categorySlug: existing.categories?.[0]?.slug || null,
      }),
      ...getWooRevalidationTags({
      productSlug: product.slug || existing.slug,
        categorySlug: validation.data.modelSlug,
      }),
    ]);
    tags.forEach((tag) => revalidateTag(tag));

    return NextResponse.json({ product });
  } catch (error) {
    console.error("[API /api/admin/products/[id] PUT]", error);
    return NextResponse.json(
      { error: getWooErrorMessage(error) },
      { status: getWooErrorStatus(error) },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { response } = await requireAdminSession();
  if (response) return response;

  const productId = parseProductId(params.id);
  if (!productId) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  try {
    const existing = await getAdminProductById(productId);
    if (existing.type !== "simple") {
      return NextResponse.json(
        { error: "Only simple products are supported in this admin v1" },
        { status: 422 },
      );
    }
    const body = (await request.json()) as { status?: string };
    const nextStatus = body.status === "publish" ? "publish" : body.status === "draft" ? "draft" : null;

    if (!nextStatus) {
      return NextResponse.json({ error: "Status must be publish or draft" }, { status: 400 });
    }

    const product = await updateAdminProductStatus(productId, nextStatus);

    clearWooCache();
    getWooRevalidationTags({
      productSlug: existing.slug,
      categorySlug: existing.categories?.[0]?.slug || null,
    }).forEach((tag) => revalidateTag(tag));

    return NextResponse.json({ product });
  } catch (error) {
    console.error("[API /api/admin/products/[id] PATCH]", error);
    return NextResponse.json(
      { error: getWooErrorMessage(error) },
      { status: getWooErrorStatus(error) },
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  const { response } = await requireAdminSession();
  if (response) return response;

  const productId = parseProductId(params.id);
  if (!productId) {
    return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
  }

  try {
    const existing = await getAdminProductById(productId);
    if (existing.type !== "simple") {
      return NextResponse.json(
        { error: "Only simple products are supported in this admin v1" },
        { status: 422 },
      );
    }
    const product = await trashAdminProduct(productId);

    clearWooCache();
    getWooRevalidationTags({
      productSlug: existing.slug,
      categorySlug: existing.categories?.[0]?.slug || null,
    }).forEach((tag) => revalidateTag(tag));

    return NextResponse.json({ product });
  } catch (error) {
    console.error("[API /api/admin/products/[id] DELETE]", error);
    return NextResponse.json(
      { error: getWooErrorMessage(error) },
      { status: getWooErrorStatus(error) },
    );
  }
}
