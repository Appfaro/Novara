'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ProductImage } from '@/types';

export default function ProductGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const sorted = [...images].sort((a, b) => a.order - b.order);
  const [active, setActive] = useState(0);

  if (sorted.length === 0) {
    return <div className="aspect-square w-full bg-brand-gray-100 dark:bg-brand-gray-700" />;
  }

  return (
    <div>
      <div className="relative aspect-square w-full overflow-hidden bg-brand-gray-100 dark:bg-brand-gray-700">
        <Image
          src={sorted[active].url}
          alt={name}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      {sorted.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {sorted.map((img, i) => (
            <button
              key={img.path}
              onClick={() => setActive(i)}
              className={`relative h-16 w-16 flex-shrink-0 overflow-hidden border-2 ${
                active === i ? 'border-brand-red' : 'border-transparent'
              }`}
            >
              <Image src={img.url} alt={`${name} ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
