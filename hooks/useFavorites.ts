'use client';

import { useEffect, useState, useCallback } from 'react';

const KEY = 'mundial-shirts-favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setFavorites(JSON.parse(raw));
    } catch {
      // ignorar datos corruptos
    }
  }, []);

  const persist = useCallback((list: string[]) => {
    setFavorites(list);
    localStorage.setItem(KEY, JSON.stringify(list));
  }, []);

  const toggleFavorite = useCallback(
    (id: string) => {
      persist(
        favorites.includes(id)
          ? favorites.filter((f) => f !== id)
          : [...favorites, id]
      );
    },
    [favorites, persist]
  );

  const isFavorite = useCallback((id: string) => favorites.includes(id), [favorites]);

  return { favorites, toggleFavorite, isFavorite };
}
