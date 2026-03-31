import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight mb-6">
        New Product
      </h1>
      <ProductForm />
    </div>
  );
}
