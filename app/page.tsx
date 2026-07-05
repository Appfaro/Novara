'use client';

import Navbar from '@/components/Navbar';
import Banner from '@/components/Banner';
import Footer from '@/components/Footer';
import CategoryTabs from '@/components/CategoryTabs';
import ProductGrid from '@/components/ProductGrid';
import WhatsAppButton from '@/components/WhatsAppButton';
import { useProducts } from '@/hooks/useProducts';

export default function HomePage() {
  const { products, loading } = useProducts();
  const featured = products.filter((p) => p.visible !== false).slice(0, 8);

  return (
    <main>
      <Navbar />
      <Banner />
      <CategoryTabs />

      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
        <h2 className="font-display text-2xl uppercase sm:text-3xl">Destacadas</h2>
        <p className="mt-1 text-brand-gray-500">
          Las camisetas más buscadas de la temporada.
        </p>
      </section>

      <ProductGrid products={featured} loading={loading} />

      <Footer />
      <WhatsAppButton />
    </main>
  );
}
