'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useProducts } from '@/hooks/useProducts';

export default function SearchBar({ onSelect }: { onSelect?: () => void }) {
  const { products } = useProducts();
  const [term, setTerm] = useState('');

  const results = useMemo(() => {
    if (!term.trim()) return [];
    const t = term.toLowerCase();
    return products
      .filter((p) => {
        if (p.name.toLowerCase().includes(t)) return true;
        return Object.values(p.attributes || {}).some((v) => v.toLowerCase().includes(t));
      })
      .slice(0, 6);
  }, [term, products]);

  return (
    <div className="relative mx-auto max-w-2xl">
      <input
        autoFocus
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Busca por nombre o características (ej. Brasil, algodón...)"
        className="w-full border border-brand-gray-300 bg-white px-4 py-3 text-sm outline-none dark:bg-brand-black dark:border-brand-gray-600"
      />
      {results.length > 0 && (
        <div className="absolute z-10 mt-1 w-full border border-brand-gray-200 bg-white shadow-lg dark:border-brand-gray-700 dark:bg-brand-dark">
          {results.map((p) => (
            <Link
              key={p.id}
              href={`/producto/${p.id}`}
              onClick={onSelect}
              className="flex items-center gap-3 border-b border-brand-gray-100 p-3 last:border-none hover:bg-brand-gray-50 dark:border-brand-gray-700 dark:hover:bg-brand-gray-700"
            >
              {p.images[0] && (
                <Image src={p.images[0].url} alt={p.name} width={40} height={40} className="h-10 w-10 object-cover" />
              )}
              <div>
                <p className="text-sm font-semibold">{p.name}</p>
                {Object.values(p.attributes || {}).length > 0 && (
                  <p className="text-xs text-brand-gray-500">
                    {Object.values(p.attributes || {}).slice(0, 2).join(' · ')}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
