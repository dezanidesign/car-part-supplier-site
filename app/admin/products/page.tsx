import { Suspense } from "react";
import ProductTable from "@/components/admin/ProductTable";

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-500">Loading products...</div>}>
      <ProductTable />
    </Suspense>
  );
}
