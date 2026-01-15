import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

// Server-side only client (uses secrets - never expose to client)
export const wooApi = new WooCommerceRestApi({
  url: process.env.WOOCOMMERCE_URL!,
  consumerKey: process.env.WOOCOMMERCE_CONSUMER_KEY!,
  consumerSecret: process.env.WOOCOMMERCE_CONSUMER_SECRET!,
  version: "wc/v3",
});

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface WooProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  type: "simple" | "variable" | "grouped" | "external";
  status: "publish" | "draft" | "pending" | "private";
  featured: boolean;
  catalog_visibility: "visible" | "catalog" | "search" | "hidden";
  description: string;
  short_description: string;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  purchasable: boolean;
  total_sales: number;
  virtual: boolean;
  downloadable: boolean;
  tax_status: "taxable" | "shipping" | "none";
  tax_class: string;
  manage_stock: boolean;
  stock_quantity: number | null;
  stock_status: "instock" | "outofstock" | "onbackorder";
  backorders: "no" | "notify" | "yes";
  backorders_allowed: boolean;
  backordered: boolean;
  sold_individually: boolean;
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  shipping_required: boolean;
  shipping_taxable: boolean;
  shipping_class: string;
  shipping_class_id: number;
  reviews_allowed: boolean;
  average_rating: string;
  rating_count: number;
  images: WooImage[];
  categories: WooCategory[];
  tags: WooTag[];
  attributes: WooAttribute[];
  variations: number[];
  grouped_products: number[];
  menu_order: number;
  meta_data: WooMetaData[];
  // Custom extension fields
  custom_fields?: {
    fitment_notes?: string;
    compatible_vehicles?: string;
    material?: string;
    installation_time?: string;
  };
}

export interface WooImage {
  id: number;
  date_created: string;
  date_modified: string;
  src: string;
  name: string;
  alt: string;
}

export interface WooCategory {
  id: number;
  name: string;
  slug: string;
  parent: number;
  description: string;
  display: string;
  image: WooImage | null;
  menu_order: number;
  count: number;
}

export interface WooTag {
  id: number;
  name: string;
  slug: string;
}

export interface WooAttribute {
  id: number;
  name: string;
  position: number;
  visible: boolean;
  variation: boolean;
  options: string[];
}

export interface WooMetaData {
  id: number;
  key: string;
  value: string;
}

export interface WooVariation {
  id: number;
  sku: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  purchasable: boolean;
  stock_status: string;
  stock_quantity: number | null;
  image: WooImage;
  attributes: Array<{
    id: number;
    name: string;
    option: string;
  }>;
}

export interface WooOrder {
  id: number;
  status: string;
  total: string;
  billing: WooAddress;
  shipping: WooAddress;
  line_items: WooLineItem[];
  payment_method: string;
  payment_method_title: string;
  transaction_id: string;
}

export interface WooAddress {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email?: string;
  phone?: string;
}

export interface WooLineItem {
  id: number;
  name: string;
  product_id: number;
  variation_id: number;
  quantity: number;
  tax_class: string;
  subtotal: string;
  total: string;
  sku: string;
  price: number;
}

// ============================================================================
// API FUNCTIONS - PRODUCTS
// ============================================================================

export interface GetProductsParams {
  page?: number;
  per_page?: number;
  search?: string;
  category?: number | string;
  tag?: number | string;
  status?: "publish" | "draft" | "pending" | "private";
  featured?: boolean;
  on_sale?: boolean;
  min_price?: string;
  max_price?: string;
  stock_status?: "instock" | "outofstock" | "onbackorder";
  orderby?: "date" | "id" | "title" | "slug" | "price" | "popularity" | "rating";
  order?: "asc" | "desc";
  include?: number[];
  exclude?: number[];
}

export async function getProducts(params: GetProductsParams = {}): Promise<{
  products: WooProduct[];
  totalPages: number;
  totalProducts: number;
}> {
  const response = await wooApi.get("products", {
    per_page: 12,
    status: "publish",
    ...params,
  });

  return {
    products: response.data,
    totalPages: parseInt(response.headers["x-wp-totalpages"] || "1"),
    totalProducts: parseInt(response.headers["x-wp-total"] || "0"),
  };
}

export async function getProduct(slug: string): Promise<WooProduct | null> {
  const { data } = await wooApi.get("products", { slug });
  return data[0] || null;
}

export async function getProductById(id: number): Promise<WooProduct> {
  const { data } = await wooApi.get(`products/${id}`);
  return data;
}

export async function getProductVariations(productId: number): Promise<WooVariation[]> {
  const { data } = await wooApi.get(`products/${productId}/variations`, {
    per_page: 100,
  });
  return data;
}

// ============================================================================
// API FUNCTIONS - CATEGORIES
// ============================================================================

export async function getCategories(): Promise<WooCategory[]> {
  const { data } = await wooApi.get("products/categories", {
    per_page: 100,
    hide_empty: true,
    orderby: "menu_order",
    order: "asc",
  });
  return data;
}

export async function getCategoryBySlug(slug: string): Promise<WooCategory | null> {
  const { data } = await wooApi.get("products/categories", { slug });
  return data[0] || null;
}

// ============================================================================
// API FUNCTIONS - ORDERS
// ============================================================================

export interface CreateOrderData {
  payment_method: string;
  payment_method_title: string;
  set_paid?: boolean;
  status?: string;
  billing: WooAddress;
  shipping: WooAddress;
  line_items: Array<{
    product_id: number;
    quantity: number;
    variation_id?: number;
  }>;
  shipping_lines?: Array<{
    method_id: string;
    method_title: string;
    total: string;
  }>;
  meta_data?: Array<{
    key: string;
    value: string;
  }>;
}

export async function createOrder(orderData: CreateOrderData): Promise<WooOrder> {
  const { data } = await wooApi.post("orders", orderData);
  return data;
}

export async function getOrder(orderId: number): Promise<WooOrder> {
  const { data } = await wooApi.get(`orders/${orderId}`);
  return data;
}

export async function updateOrder(
  orderId: number,
  updateData: Partial<WooOrder>
): Promise<WooOrder> {
  const { data } = await wooApi.put(`orders/${orderId}`, updateData);
  return data;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

export function formatPrice(price: string | number): string {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(numPrice);
}

export function getProductMainImage(product: WooProduct): string {
  return product.images[0]?.src || "/placeholder-product.jpg";
}

export function isProductInStock(product: WooProduct): boolean {
  return product.stock_status === "instock";
}

export function getProductPriceRange(product: WooProduct): {
  min: string;
  max: string;
} | null {
  if (product.type !== "variable") return null;
  // For variable products, the price field contains the range "X.XX-Y.YY"
  const [min, max] = product.price.split("-");
  return max ? { min, max } : null;
}
