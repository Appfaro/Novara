'use client';

import { useMemo, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CategoryTabs from '@/components/CategoryTabs';
import ProductGrid from '@/components/ProductGrid';
import Filters, { defaultFilters, FilterState } from '@/components/Filters';
import WhatsAppButton from '@/components/WhatsAppButton';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { finalPrice, totalStock } from '@/lib/utils';

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { products, loading } = useProducts();
  const { categories } = useCategories();
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const category = categories.find((c) => c.slug === params.slug);

  const scoped = useMemo(() => {
    if (params.slug === 'todas') return products;
    return products.filter((p) => p.categoryId === category?.id);
  }, [products, params.slug, category]);

  const countries = useMemo(
    () => Array.from(new Set(scoped.map((p) => p.country))).sort(),
    [scoped]
  );
  const years = useMemo(
    () => Array.from(new Set(scoped.map((p) => p.worldCupYear))).sort((a, b) => b - a),
    [scoped]
  );

  const filtered = scoped.filter((p) => {
    const price = finalPrice(p);
    if (price < filters.minPrice || price > filters.maxPrice) return false;
    if (filters.country && p.country !== filters.country) return false;
    if (filters.year && String(p.worldCupYear) !== filters.year) return false;
    if (filters.size && !p.sizes.some((s) => s.size === filters.size && s.stock > 0)) return false;
    if (filters.onlyAvailable && totalStock(p) === 0) return false;
    return true;
  });

  return (
    <main>
      <Navbar />
      <CategoryTabs activeSlug={params.slug} />
      <div className="mx-auto flex max-w-7xl flex-col sm:flex-row">
        <Filters filters={filters} onChange={setFilters} countries={countries} years={years} />
        <div className="flex-1">
          <ProductGrid products={filtered} loading={loading} />
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
