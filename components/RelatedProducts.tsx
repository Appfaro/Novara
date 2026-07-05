import { Product } from '@/types';
import ProductCard from '@/components/ProductCard';

export default function RelatedProducts({
  current,
  all,
}: {
  current: Product;
  all: Product[];
}) {
  const related = all
    .filter(
      (p) =>
        p.id !== current.id &&
        (p.categoryId === current.categoryId || p.country === current.country)
    )
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h2 className="mb-6 font-display text-2xl uppercase">También te puede interesar</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {related.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
