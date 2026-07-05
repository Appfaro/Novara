'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast from 'react-hot-toast';

export function StarsDisplay({ rating = 0, count = 0 }: { rating?: number; count?: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className={i < Math.round(rating) ? 'fill-brand-red text-brand-red' : 'text-brand-gray-300'}
        />
      ))}
      <span className="ml-1 text-xs text-brand-gray-500">({count})</span>
    </div>
  );
}

export default function RatingForm({
  productId,
  currentRating = 0,
  currentCount = 0,
}: {
  productId: string;
  currentRating?: number;
  currentCount?: number;
}) {
  const [hover, setHover] = useState(0);
  const [sent, setSent] = useState(false);

  async function submit(value: number) {
    if (sent) return;
    const newCount = currentCount + 1;
    const newRating = (currentRating * currentCount + value) / newCount;
    try {
      await updateDoc(doc(db, 'products', productId), {
        rating: newRating,
        ratingCount: newCount,
      });
      setSent(true);
      toast.success('¡Gracias por tu valoración!');
    } catch {
      toast.error('No se pudo enviar la valoración');
    }
  }

  return (
    <div>
      <p className="mb-1 text-sm font-semibold">Valora esta camiseta</p>
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <button
            key={i}
            disabled={sent}
            onMouseEnter={() => setHover(i + 1)}
            onMouseLeave={() => setHover(0)}
            onClick={() => submit(i + 1)}
            aria-label={`Valorar con ${i + 1} estrellas`}
          >
            <Star
              size={22}
              className={(hover || 0) > i ? 'fill-brand-red text-brand-red' : 'text-brand-gray-300'}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
