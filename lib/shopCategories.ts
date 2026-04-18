export type ShopModel = {
  label: string;
  slug: string;
  description?: string;
};

export type ShopMake = {
  label: string;
  slug: string;
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
      {
        label: "x5 g05 / LCI Facelift conversion",
        slug: "x5-g05",
        description: "If you'd like, facelift your car to the latest 2025 spec",
      },
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
    models: [{ label: "Range Rover Sport", slug: "range-rover-sport" }],
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
    slug: "mercedes-benz",
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

const rangeRoverNavModels =
  SHOP_CATEGORIES.find((make) => make.slug === "land-rover")?.models.filter((model) =>
    ["velar", "l460-vogue", "l405-vogue", "l494-sport", "l461-sport"].includes(model.slug),
  ) || [];

export const SHOP_NAV_CATEGORIES: ShopMake[] = SHOP_CATEGORIES.map((make) => {
  if (make.slug === "land-rover") {
    return {
      ...make,
      models: make.models.filter((model) => model.slug === "land-rover-defender"),
    };
  }

  if (make.slug === "range-rover-sport") {
    return {
      label: "Range Rover",
      slug: "range-rover",
      models: [...make.models, ...rangeRoverNavModels],
    };
  }

  return make;
});

const FLAT = SHOP_CATEGORIES.flatMap((make) =>
  make.models.map((model) => ({
    makeLabel: make.label,
    makeSlug: make.slug,
    modelLabel: model.label,
    modelSlug: model.slug,
    description: model.description,
  })),
);

export function getCategoryMeta(slug: string) {
  const found = FLAT.find((item) => item.modelSlug === slug);

  if (!found) return null;

  return {
    label: found.modelLabel,
    brandLabel: found.makeLabel,
    slug: found.modelSlug,
    make: found.makeLabel,
    makeSlug: found.makeSlug,
    title: found.modelLabel,
    description:
      found.description ||
      "Browse our curated selection of premium parts for this vehicle model.",
    gallery: [] as string[],
  };
}
