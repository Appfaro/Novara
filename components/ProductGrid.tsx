import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';

export default function ProductGrid({
  products,
  loading,
}: {
  products: Product[];
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4 sm:p-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] animate-pulse bg-brand-gray-100 dark:bg-brand-gray-700" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <p className="p-10 text-center text-brand-gray-500">
        No se han encontrado productos con esos filtros.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-3 md:grid-cols-4 sm:p-6">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
