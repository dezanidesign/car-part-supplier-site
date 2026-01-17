import { NextResponse } from "next/server";
import { getAllCategories, getAllProducts } from "@/lib/woo";

/**
 * Quick verification: Are products correctly showing under makes?
 */
export async function GET() {
  const [categories, products] = await Promise.all([
    getAllCategories(),
    getAllProducts(),
  ]);

  // Get BMW category and all its descendants
  const bmw = categories.find(c => c.slug === 'bmw');
  if (!bmw) {
    return NextResponse.json({ error: 'BMW category not found' });
  }

  // Get all BMW descendant IDs
  function getDescendants(parentId: number): number[] {
    const children = categories.filter(c => c.parent === parentId);
    return [
      parentId,
      ...children.flatMap(child => getDescendants(child.id))
    ];
  }

  const bmwCategoryIds = getDescendants(bmw.id);

  // Find all products that belong to ANY BMW category
  const bmwProducts = products.filter(p =>
    (p.categories || []).some(cat => bmwCategoryIds.includes(cat.id))
  );

  // Same for Land Rover
  const landRover = categories.find(c => c.slug === 'land-rover');
  const lrCategoryIds = landRover ? getDescendants(landRover.id) : [];
  const lrProducts = products.filter(p =>
    (p.categories || []).some(cat => lrCategoryIds.includes(cat.id))
  );

  return NextResponse.json({
    totalProducts: products.length,
    bmw: {
      categoryId: bmw.id,
      descendantCategoryIds: bmwCategoryIds,
      descendantCount: bmwCategoryIds.length,
      productCount: bmwProducts.length,
      sampleProducts: bmwProducts.slice(0, 3).map(p => ({
        id: p.id,
        name: p.name,
        categories: p.categories
      }))
    },
    landRover: landRover ? {
      categoryId: landRover.id,
      descendantCategoryIds: lrCategoryIds,
      descendantCount: lrCategoryIds.length,
      productCount: lrProducts.length,
      sampleProducts: lrProducts.slice(0, 3).map(p => ({
        id: p.id,
        name: p.name,
        categories: p.categories
      }))
    } : null,
    allMakes: categories
      .filter(c => c.parent === 0 && c.slug !== 'uncategorized')
      .map(make => {
        const descendantIds = getDescendants(make.id);
        const makeProducts = products.filter(p =>
          (p.categories || []).some(cat => descendantIds.includes(cat.id))
        );
        return {
          slug: make.slug,
          name: make.name,
          categoryCount: descendantIds.length,
          productCount: makeProducts.length
        };
      })
  });
}
