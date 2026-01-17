import { NextResponse } from "next/server";
import { getAllCategories, getAllProducts } from "@/lib/woo";

/**
 * DEBUG ENDPOINT: /api/debug-woo
 *
 * This will show us:
 * 1. All WooCommerce categories and their hierarchy
 * 2. All products and which categories they're assigned to
 * 3. Why filters might be missing products
 *
 * DELETE THIS FILE after debugging.
 */
export async function GET() {
  try {
    const [categories, products] = await Promise.all([
      getAllCategories(),
      getAllProducts(),
    ]);

    // Build category tree
    const categoryMap = new Map(categories.map(c => [c.id, c]));
    const rootCategories = categories.filter(c => c.parent === 0);

    function buildTree(parentId: number, depth = 0): any[] {
      const children = categories.filter(c => c.parent === parentId);
      return children.map(child => ({
        id: child.id,
        name: child.name,
        slug: child.slug,
        count: child.count,
        depth,
        children: buildTree(child.id, depth + 1)
      }));
    }

    const categoryTree = rootCategories.map(root => ({
      id: root.id,
      name: root.name,
      slug: root.slug,
      count: root.count,
      depth: 0,
      children: buildTree(root.id, 1)
    }));

    // Analyze products by make
    const makeAnalysis: Record<string, any> = {};
    const targetMakes = ['audi', 'bmw', 'land-rover', 'range-rover-sport', 'mercedes', 'porsche', 'rolls-royce', 'lamborghini'];

    for (const makeSlug of targetMakes) {
      const normalizedMake = makeSlug.toLowerCase().replace(/[\s_-]+/g, '');

      // Find matching category
      const matchingCat = categories.find(c =>
        c.slug.toLowerCase().replace(/[\s_-]+/g, '') === normalizedMake ||
        c.name.toLowerCase().replace(/[\s_-]+/g, '') === normalizedMake
      );

      if (!matchingCat) {
        makeAnalysis[makeSlug] = {
          status: 'NO_CATEGORY_FOUND',
          searchedFor: normalizedMake,
          availableSlugs: categories
            .filter(c => c.parent === 0)
            .map(c => ({ slug: c.slug, name: c.name }))
        };
        continue;
      }

      // Get all descendant IDs
      function getDescendants(parentId: number): number[] {
        const children = categories.filter(c => c.parent === parentId);
        return [
          parentId,
          ...children.flatMap(child => getDescendants(child.id))
        ];
      }

      const allCategoryIds = getDescendants(matchingCat.id);

      // Find products in these categories
      const matchingProducts = products.filter(p =>
        (p.categories || []).some(cat => allCategoryIds.includes(cat.id))
      );

      // Find products that SHOULD match but don't
      const potentialMisses = products.filter(p =>
        (p.categories || []).some(cat =>
          cat.slug.toLowerCase().includes(normalizedMake) ||
          cat.name.toLowerCase().includes(normalizedMake)
        ) && !matchingProducts.includes(p)
      );

      makeAnalysis[makeSlug] = {
        status: 'FOUND',
        category: {
          id: matchingCat.id,
          name: matchingCat.name,
          slug: matchingCat.slug,
        },
        totalCategories: allCategoryIds.length,
        categoryIds: allCategoryIds,
        productCount: matchingProducts.length,
        potentialMissedProducts: potentialMisses.length,
        sampleProducts: matchingProducts.slice(0, 5).map(p => ({
          id: p.id,
          name: p.name,
          categories: p.categories?.map(c => ({ id: c.id, slug: c.slug, name: c.name }))
        })),
        missedProducts: potentialMisses.slice(0, 5).map(p => ({
          id: p.id,
          name: p.name,
          categories: p.categories?.map(c => ({ id: c.id, slug: c.slug, name: c.name })),
          reason: 'Product has make-related category but category is not a descendant'
        }))
      };
    }

    // Products with NO categories
    const uncategorized = products.filter(p => !p.categories || p.categories.length === 0);

    // Products in categories that don't match any make
    const orphaned = products.filter(p => {
      if (!p.categories || p.categories.length === 0) return false;

      return !targetMakes.some(makeSlug => {
        const normalizedMake = makeSlug.toLowerCase().replace(/[\s_-]+/g, '');
        return p.categories!.some(cat =>
          cat.slug.toLowerCase().replace(/[\s_-]+/g, '').includes(normalizedMake) ||
          cat.name.toLowerCase().replace(/[\s_-]+/g, '').includes(normalizedMake)
        );
      });
    });

    return NextResponse.json({
      summary: {
        totalCategories: categories.length,
        totalProducts: products.length,
        rootCategories: rootCategories.length,
        uncategorizedProducts: uncategorized.length,
        orphanedProducts: orphaned.length
      },
      categoryTree,
      makeAnalysis,
      uncategorizedProducts: uncategorized.map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug
      })),
      orphanedProducts: orphaned.map(p => ({
        id: p.id,
        name: p.name,
        categories: p.categories?.map(c => ({ slug: c.slug, name: c.name }))
      })),
      allCategorySlugs: categories.map(c => ({
        id: c.id,
        slug: c.slug,
        name: c.name,
        parent: c.parent,
        count: c.count
      }))
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error("[DEBUG] Error:", error);
    return NextResponse.json({
      error: String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
