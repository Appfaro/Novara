'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '@/types';
import { finalPrice, formatPrice, totalStock } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useFavorites } from '@/hooks/useFavorites';
import { useCategories } from '@/hooks/useCategories';
import toast from 'react-hot-toast';

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { categories } = useCategories();
  const image = product.images.sort((a, b) => a.order - b.order)[0];
  const outOfStock = totalStock(product) === 0;
  const price = finalPrice(product);
  const hasOffer = price < product.price;
  const categoryName = categories.find((c) => c.id === product.categoryId)?.name;
  const attributeValues = Object.values(product.attributes || {}).filter(Boolean);
  const subtitle = attributeValues.length > 0 ? attributeValues.slice(0, 2).join(' · ') : categoryName;

  function quickAdd(e: React.MouseEvent) {
    e.preventDefault();
    const firstSize = product.sizes.find((s) => s.stock > 0);
    if (!firstSize) {
      toast.error('Sin stock disponible');
      return;
    }
    addItem({
      productId: product.id,
      name: product.name,
      image: image?.url || '',
      price,
      size: firstSize.size,
      quantity: 1,
    });
    toast.success('Añadido al carrito');
  }

  return (
    <Link
      href={`/producto/${product.id}`}
      className="group relative block animate-fadeUp overflow-hidden bg-white transition-shadow hover:shadow-xl dark:bg-brand-dark"
    >
      <button
        onClick={(e) => {
          e.preventDefault();
          toggleFavorite(product.id);
        }}
        aria-label="Añadir a favoritos"
        className="absolute right-3 top-3 z-10 rounded-full bg-white/90 p-2 dark:bg-brand-black/80"
      >
        <Heart
          size={18}
          className={isFavorite(product.id) ? 'fill-brand-red text-brand-red' : 'text-brand-black dark:text-white'}
        />
      </button>

      <div className="relative aspect-square overflow-hidden bg-brand-gray-100 dark:bg-brand-gray-700">
        {image && (
          <Image
            src={image.url}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        {hasOffer && (
          <span className="absolute left-3 top-3 bg-brand-gold px-2 py-1 text-xs font-bold uppercase text-brand-black">
            Oferta
          </span>
        )}
        {outOfStock && (
          <span className="absolute inset-x-0 bottom-0 bg-brand-black/80 py-1 text-center text-xs font-bold uppercase text-white">
            Agotado
          </span>
        )}
      </div>

      <div className="p-4">
        {subtitle && (
          <p className="text-xs uppercase tracking-wide text-brand-gray-500">{subtitle}</p>
        )}
        <h3 className="mt-1 line-clamp-2 font-semibold">{product.name}</h3>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-bold">{formatPrice(price)}</span>
            {hasOffer && (
              <span className="text-sm text-brand-gray-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          <button
            onClick={quickAdd}
            disabled={outOfStock}
            aria-label="Añadir al carrito"
            className="rounded-full bg-brand-black p-2 text-white transition-transform hover:scale-110 disabled:opacity-40 dark:bg-white dark:text-brand-black"
          >
            <ShoppingBag size={16} />
          </button>
        </div>
      </div>
    </Link>
  );
}
