'use client';

import { useEffect } from 'react';

export function useForceLightMode() {
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);
}