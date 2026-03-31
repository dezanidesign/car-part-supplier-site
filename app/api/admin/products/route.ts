import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { requireAdminSession } from "@/lib/adminSession";
import {
  mapWooProductToAdminListItem,
  resolveWooCategoryIdForModelSlug,
  validateAdminProductPayload,
} from "@/lib/adminProducts";
import { clearWooCache, getWooRevalidationTags } from "@/lib/woo";
import {
  createAdminProduct,
  getAdminProductCategories,
  getAdminProducts,
  getWooErrorMessage,
  getWooErrorStatus,
} from "@/lib/woocommerce";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { response } = await requireAdminSession();
  if (response) return response;

  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const search = searchParams.get("search")?.trim() || undefined;
    const statusParam = searchParams.get("status")?.trim();
    const status =
      statusParam === "publish" || statusParam === "draft" ? statusParam : "any";

    const result = await getAdminProducts({
      page,
      per_page: limit,
      search,
      status,
    });

    return NextResponse.json({
      products: result.products.map(mapWooProductToAdminListItem),
      total: result.totalProducts,
      pages: result.totalPages,
      page,
    });
  } catch (error) {
    console.error("[API /api/admin/products GET]", error);
    return NextResponse.json(
      { error: getWooErrorMessage(error) },
      { status: getWooErrorStatus(error) },
    );
  }
}

export async function POST(request: NextRequest) {
  const { response } = await requireAdminSession();
  if (response) return response;

  try {
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

    const product = await createAdminProduct({
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
    getWooRevalidationTags({
      productSlug: product.slug,
      categorySlug: validation.data.modelSlug,
    }).forEach((tag) => revalidateTag(tag));

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("[API /api/admin/products POST]", error);
    return NextResponse.json(
      { error: getWooErrorMessage(error) },
      { status: getWooErrorStatus(error) },
    );
  }
}
