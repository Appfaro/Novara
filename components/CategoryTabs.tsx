'use client';

import Link from 'next/link';
import { useCategories } from '@/hooks/useCategories';

export default function CategoryTabs({ activeSlug }: { activeSlug?: string }) {
  const { categories, loading } = useCategories();
  const visible = categories.filter((c) => c.visible);

  if (loading) {
    return <div className="h-10 w-full animate-pulse bg-brand-gray-100 dark:bg-brand-gray-700" />;
  }

  return (
    <div className="flex gap-2 overflow-x-auto border-b border-brand-gray-200 px-4 py-3 dark:border-brand-gray-700 sm:px-6">
      <Link
        href="/categoria/todas"
        className={`whitespace-nowrap px-4 py-2 text-sm font-bold uppercase tracking-wide transition-colors ${
          !activeSlug || activeSlug === 'todas'
            ? 'bg-brand-black text-white dark:bg-white dark:text-brand-black'
            : 'text-brand-gray-500 hover:text-brand-gold'
        }`}
      >
        Todas
      </Link>
      {visible.map((cat) => (
        <Link
          key={cat.id}
          href={`/categoria/${cat.slug}`}
          className={`whitespace-nowrap px-4 py-2 text-sm font-bold uppercase tracking-wide transition-colors ${
            activeSlug === cat.slug
              ? 'bg-brand-black text-white dark:bg-white dark:text-brand-black'
              : 'text-brand-gray-500 hover:text-brand-gold'
          }`}
        >
          {cat.name}
        </Link>
      ))}
    </div>
  );
}
