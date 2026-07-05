'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductGrid from '@/components/ProductGrid';
import { useProducts } from '@/hooks/useProducts';
import { useFavorites } from '@/hooks/useFavorites';

export default function FavoritesPage() {
  const { products, loading } = useProducts();
  const { favorites } = useFavorites();
  const favProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <h1 className="font-display text-3xl uppercase">Tus favoritos</h1>
      </div>
      <ProductGrid products={favProducts} loading={loading} />
      <Footer />
    </main>
  );
}
