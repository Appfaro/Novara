'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import ProductGallery from '@/components/ProductGallery';
import ShareButtons from '@/components/ShareButtons';
import RelatedProducts from '@/components/RelatedProducts';
import RatingForm, { StarsDisplay } from '@/components/RatingStars';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useCart } from '@/context/CartContext';
import { finalPrice, formatPrice, totalStock } from '@/lib/utils';
import { SizeStock } from '@/types';
import toast from 'react-hot-toast';

export default function ProductPageClient({ params }: { params: { id: string } }) {
  const { products, loading } = useProducts();
  const { categories } = useCategories();
  const { addItem } = useCart();
  const router = useRouter();
  const [size, setSize] = useState<SizeStock['size'] | null>(null);
  const [quantity, setQuantity] = useState(1);

  const product = products.find((p) => p.id === params.id);

  if (loading) return null;

  if (!product) {
    return (
      <main>
        <Navbar />
        <p className="p-10 text-center">Producto no encontrado.</p>
        <Footer />
      </main>
    );
  }

  const price = finalPrice(product);
  const stockLeft = size ? product.sizes.find((s) => s.size === size)?.stock ?? 0 : 0;
  const categoryName = categories.find((c) => c.id === product.categoryId)?.name;
  const attributeEntries = Object.entries(product.attributes || {}).filter(([, v]) => v);

  function handleAdd(buyNow: boolean) {
    if (!size) {
      toast.error('Selecciona una talla');
      return;
    }
    addItem({
      productId: product!.id,
      name: product!.name,
      image: product!.images[0]?.url || '',
      price,
      size,
      quantity,
    });
    if (buyNow) {
      router.push('/carrito');
    } else {
      toast.success('Añadido al carrito');
    }
  }

  return (
    <main>
      <Navbar />

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          {categoryName && (
            <p className="text-sm uppercase tracking-wide text-brand-gray-500">{categoryName}</p>
          )}
          <h1 className="mt-1 font-display text-3xl uppercase">{product.name}</h1>

          <div className="mt-2">
            <StarsDisplay rating={product.rating} count={product.ratingCount} />
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-bold">{formatPrice(price)}</span>
            {price < product.price && (
              <span className="text-lg text-brand-gray-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <p className="mt-4 text-brand-gray-600 dark:text-brand-gray-300">{product.description}</p>

          {attributeEntries.length > 0 && (
            <dl className="mt-4 grid grid-cols-2 gap-2 border-t border-brand-gray-200 pt-4 text-sm dark:border-brand-gray-700">
              {attributeEntries.map(([key, value]) => (
                <div key={key}>
                  <dt className="text-xs uppercase text-brand-gray-400">{key}</dt>
                  <dd className="font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-6">
            <p className="mb-2 text-sm font-bold uppercase">Talla</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s.size}
                  disabled={s.stock === 0}
                  onClick={() => setSize(s.size)}
                  className={`border px-4 py-2 text-sm font-bold ${
                    size === s.size
                      ? 'bg-brand-black text-white dark:bg-white dark:text-brand-black'
                      : 'border-brand-gray-300 dark:border-brand-gray-600'
                  } ${s.stock === 0 ? 'cursor-not-allowed opacity-30' : ''}`}
                >
                  {s.size}
                </button>
              ))}
            </div>
            {size && (
              <p className="mt-2 text-xs text-brand-gray-500">
                {stockLeft > 0 ? `${stockLeft} unidades disponibles` : 'Sin stock en esta talla'}
              </p>
            )}
          </div>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center border border-brand-gray-300 dark:border-brand-gray-600">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="px-3 py-2">-</button>
              <span className="w-10 text-center">{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)} className="px-3 py-2">+</button>
            </div>

            <button
              onClick={() => handleAdd(false)}
              disabled={totalStock(product) === 0}
              className="flex-1 bg-brand-black py-3 text-sm font-bold uppercase tracking-widest2 text-white transition-transform hover:scale-[1.02] disabled:opacity-40 dark:bg-white dark:text-brand-black"
            >
              Añadir al carrito
            </button>
          </div>

          <button
            onClick={() => handleAdd(true)}
            disabled={totalStock(product) === 0}
            className="mt-3 w-full bg-brand-gold py-3 text-sm font-bold uppercase tracking-widest2 text-brand-black transition-transform hover:scale-[1.02] hover:bg-brand-goldDark disabled:opacity-40"
          >
            Comprar ahora
          </button>

          <div className="mt-6 flex items-center justify-between border-t border-brand-gray-200 pt-6 dark:border-brand-gray-700">
            <ShareButtons title={product.name} url={typeof window !== 'undefined' ? window.location.href : ''} />
          </div>

          <div className="mt-6 border-t border-brand-gray-200 pt-6 dark:border-brand-gray-700">
            <RatingForm
              productId={product.id}
              currentRating={product.rating}
              currentCount={product.ratingCount}
            />
          </div>
        </div>
      </div>

      <RelatedProducts current={product} all={products} />

      <Footer />
      <WhatsAppButton />
    </main>
  );
}
