import { NextResponse } from "next/server";
import { getAllCategories, getAllProducts } from "@/lib/woo";

/**
 * DEBUG ENDPOINT: /api/debug-categories
 *
 * Shows all WooCommerce categories and helps identify slug mismatches.
 * DELETE THIS FILE after debugging.
 */
export async function GET() {
  try {
    const [categories, products] = await Promise.all([
      getAllCategories(),
      getAllProducts(),
    ]);

    // Group categories by parent
    const parentCategories = categories.filter((c) => c.parent === 0);
    const hierarchy: Record<string, { parent: typeof categories[0]; children: typeof categories }> = {};

    for (const parent of parentCategories) {
      const children = categories.filter((c) => c.parent === parent.id);
      hierarchy[parent.slug] = { parent, children };
    }

    // Check which slugs from frontend map to WooCommerce
    const frontendMakes = ["audi", "bmw", "land-rover", "range-rover-sport", "mercedes", "porsche", "rolls-royce", "lamborghini"];
    const slugMatches = frontendMakes.map((slug) => {
      const found = categories.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
      return {
        frontendSlug: slug,
        wooSlug: found?.slug || null,
        wooId: found?.id || null,
        productCount: found?.count || 0,
        match: !!found,
      };
    });

    // Show products per category for debugging
    const productsPerCategory: Record<string, number> = {};
    for (const product of products) {
      for (const cat of product.categories || []) {
        productsPerCategory[cat.slug] = (productsPerCategory[cat.slug] || 0) + 1;
      }
    }

    // Find Land Rover specifically
    const landRoverParent = categories.find((c) => c.slug.toLowerCase().includes("land") || c.name.toLowerCase().includes("land rover"));
    const landRoverChildren = landRoverParent
      ? categories.filter((c) => c.parent === landRoverParent.id)
      : [];

    // Find products that have "land rover" or "defender" in their categories
    const landRoverProducts = products.filter((p) =>
      (p.categories || []).some((c) =>
        c.name.toLowerCase().includes("land") ||
        c.name.toLowerCase().includes("defender") ||
        c.name.toLowerCase().includes("l460") ||
        c.name.toLowerCase().includes("l405") ||
        c.name.toLowerCase().includes("velar") ||
        c.name.toLowerCase().includes("l494") ||
        c.name.toLowerCase().includes("l461")
      )
    );

    return NextResponse.json({
      totalCategories: categories.length,
      totalProducts: products.length,
      slugMatches,
      parentCategories: parentCategories.map((c) => ({
        id: c.id,
        slug: c.slug,
        name: c.name,
        productCount: c.count,
      })),
      hierarchy: Object.entries(hierarchy).map(([slug, data]) => ({
        parentSlug: slug,
        parentName: data.parent.name,
        parentId: data.parent.id,
        childCount: data.children.length,
        children: data.children.map((c) => ({
          id: c.id,
          slug: c.slug,
          name: c.name,
          productCount: c.count,
        })),
      })),
      landRoverDebug: {
        foundParent: landRoverParent ? {
          id: landRoverParent.id,
          slug: landRoverParent.slug,
          name: landRoverParent.name,
        } : null,
        children: landRoverChildren.map((c) => ({
          id: c.id,
          slug: c.slug,
          name: c.name,
          productCount: c.count,
        })),
        productsWithLandRoverCategories: landRoverProducts.map((p) => ({
          id: p.id,
          name: p.name,
          categories: p.categories?.map((c) => ({ id: c.id, slug: c.slug, name: c.name })),
        })),
      },
      productsPerCategory: Object.entries(productsPerCategory)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 50),
    });
  } catch (error) {
    console.error("[DEBUG] Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
