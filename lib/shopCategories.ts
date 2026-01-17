// /lib/shopCategories.ts

export type ShopModel = {
    label: string;
    slug: string; // this is the URL slug you’ll use in /shop/[slug]
  };
  
  export type ShopMake = {
    label: string;
    slug: string; // optional if you ever want /shop/make/audi etc
    models: ShopModel[];
  };
  
  export const SHOP_CATEGORIES: ShopMake[] = [
    {
      label: "Audi",
      slug: "audi",
      models: [
        { label: "Audi R8", slug: "audi-r8" },
        { label: "Audi RSQ8", slug: "audi-rsq8" },
        { label: "Audi Q7", slug: "audi-q7" },
        { label: "Audi Q8", slug: "audi-q8" },
        { label: "Audi RS6", slug: "audi-rs6" },
      ],
    },
    {
      label: "BMW",
      slug: "bmw",
      models: [
        { label: "BMW X5", slug: "bmw-x5" },
        { label: "X5M", slug: "x5m" },
        { label: "X5 G05 LCI", slug: "x5-g05-lci" },
        { label: "X5 G05", slug: "x5-g05" },
        { label: "X5 F15", slug: "x5-f15" },
        { label: "X3M", slug: "x3m" },
        { label: "X3 G01", slug: "x3-g01" },
        { label: "X5M LCI", slug: "x5m-lci" },
        { label: "X6 G06", slug: "x6-g06" },
        { label: "X7 G07", slug: "x7-g07" },
        { label: "X7 G07 LCI", slug: "x7-g07-lci" },
        { label: "XM", slug: "xm" },
      ],
    },
    {
      label: "Range Rover Sport",
      slug: "range-rover-sport",
      models: [
        { label: "Range Rover Sport", slug: "range-rover-sport" },
      ],
    },
    {
      label: "Land Rover",
      slug: "land-rover",
      models: [
        { label: "Velar", slug: "velar" },
        { label: "Land Rover Defender", slug: "land-rover-defender" },
        { label: "L460 Vogue", slug: "l460-vogue" },
        { label: "L405 Vogue", slug: "l405-vogue" },
        { label: "L494 Sport", slug: "l494-sport" },
        { label: "L461 Sport", slug: "l461-sport" },
        { label: "Defender L663", slug: "defender-l663" },
      ],
    },
    {
      label: "Mercedes",
      slug: "mercedes",
      models: [
        { label: "E63", slug: "e63" },
        { label: "G Wagon - G63", slug: "g-wagon-g63" },
        { label: "GLS", slug: "gls" },
        { label: "GLE", slug: "gle" },
      ],
    },
    {
      label: "Porsche",
      slug: "porsche",
      models: [
        { label: "Cayenne", slug: "cayenne" },
        { label: "Macan", slug: "macan" },
        { label: "Taycan", slug: "taycan" },
        { label: "911", slug: "911" },
      ],
    },
    {
      label: "Rolls Royce",
      slug: "rolls-royce",
      models: [
        { label: "Ghost", slug: "ghost" },
        { label: "Cullinan", slug: "cullinan" },
      ],
    },
    {
      label: "Lamborghini",
      slug: "lamborghini",
      models: [
        { label: "Urus", slug: "urus" },
        { label: "Huracan", slug: "huracan" },
      ],
    },
  ];
  
  // Flatten for quick lookup by slug
  const FLAT = SHOP_CATEGORIES.flatMap((make) =>
    make.models.map((model) => ({
      makeLabel: make.label,
      makeSlug: make.slug,
      modelLabel: model.label,
      modelSlug: model.slug,
    }))
  );
  
  export function getCategoryMeta(slug: string) {
    const found = FLAT.find((x) => x.modelSlug === slug);
  
    if (!found) return null;
  
    return {
      // what your page.tsx is currently expecting
      label: found.modelLabel,
      brandLabel: found.makeLabel,
      slug: found.modelSlug,
  
      // optional helpers (safe to have)
      make: found.makeLabel,
      makeSlug: found.makeSlug,
      title: found.modelLabel,
  
      // if you don’t have real before/after images yet, keep this empty for now
      // your UI can show a placeholder state when gallery.length === 0
      gallery: [] as string[],
    };
  }
  
  