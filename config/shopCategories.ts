export type ShopCategoryLink = {
    slug: string;        // used for /shop/[slug]
    label: string;       // displayed text
    gallery?: boolean;   // whether to show "View builds" link on the category page
  };
  
  export type ShopCategoryGroup = {
    brandSlug: string;   // grouping column key
    brandLabel: string;  // column title
    models: ShopCategoryLink[];
  };
  
  export const SHOP_CATEGORIES: ShopCategoryGroup[] = [
    {
      brandSlug: "audi",
      brandLabel: "Audi",
      models: [
        { slug: "audi-r8", label: "Audi R8", gallery: true },
        { slug: "audi-rsq8", label: "Audi RSQ8", gallery: true },
        { slug: "audi-q7", label: "Audi Q7", gallery: true },
        { slug: "audi-q8", label: "Audi Q8", gallery: true },
        { slug: "audi-rs6", label: "Audi RS6", gallery: true },
      ],
    },
    {
      brandSlug: "bmw",
      brandLabel: "BMW",
      models: [
        { slug: "bmw-x5", label: "BMW X5", gallery: true },
        { slug: "bmw-x5m", label: "X5M", gallery: true },
        { slug: "bmw-x5-g05-lci", label: "X5 G05 LCI", gallery: true },
        { slug: "bmw-x5-g05", label: "X5 G05", gallery: true },
        { slug: "bmw-x5-f15", label: "X5 F15", gallery: true },
        { slug: "bmw-x3m", label: "X3M", gallery: true },
        { slug: "bmw-x3-g01", label: "X3 G01", gallery: true },
        { slug: "bmw-x5m-lci", label: "X5M LCI", gallery: true },
        { slug: "bmw-x6-g06", label: "X6 G06", gallery: true },
        { slug: "bmw-x7-g07", label: "X7 G07", gallery: true },
        { slug: "bmw-x7-g07-lci", label: "X7 G07 LCI", gallery: true },
        { slug: "bmw-xm", label: "XM", gallery: true },
      ],
    },
    {
      brandSlug: "range-rover-sport",
      brandLabel: "Range Rover Sport",
      models: [
        // screenshot column shows header but no visible model list
        // add models here later if needed
      ],
    },
    {
      brandSlug: "land-rover",
      brandLabel: "Land Rover",
      models: [
        { slug: "land-rover-velar", label: "Velar", gallery: true },
        { slug: "land-rover-defender", label: "Land Rover Defender", gallery: true },
        { slug: "l460-vogue", label: "L460 Vogue", gallery: true },
        { slug: "l405-vogue", label: "L405 Vogue", gallery: true },
        { slug: "l494-sport", label: "L494 Sport", gallery: true },
        { slug: "l461-sport", label: "L461 Sport", gallery: true },
        { slug: "defender-l663", label: "Defender L663", gallery: true },
      ],
    },
    {
      brandSlug: "mercedes",
      brandLabel: "Mercedes",
      models: [
        { slug: "mercedes-e63", label: "E63", gallery: true },
        { slug: "g-wagon-g63", label: "G Wagon – G63", gallery: true },
        { slug: "mercedes-gls", label: "GLS", gallery: true },
        { slug: "mercedes-gle", label: "GLE", gallery: true },
      ],
    },
    {
      brandSlug: "porsche",
      brandLabel: "Porsche",
      models: [
        { slug: "porsche-cayenne", label: "Cayenne", gallery: true },
        { slug: "porsche-macan", label: "Macan", gallery: true },
        { slug: "porsche-taycan", label: "Taycan", gallery: true },
        { slug: "porsche-911", label: "911", gallery: true },
      ],
    },
    {
      brandSlug: "rolls-royce",
      brandLabel: "Rolls Royce",
      models: [
        { slug: "rolls-royce-ghost", label: "Ghost", gallery: true },
        { slug: "rolls-royce-cullinan", label: "Cullinan", gallery: true },
      ],
    },
    {
      brandSlug: "lamborghini",
      brandLabel: "Lamborghini",
      models: [
        { slug: "lamborghini-urus", label: "Urus", gallery: true },
        { slug: "lamborghini-huracan", label: "Huracan", gallery: true },
      ],
    },
  ];
  