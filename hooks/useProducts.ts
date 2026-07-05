'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  query,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/types';

const COLLECTION = 'products';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, COLLECTION));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => {
          const raw = d.data() as Omit<Product, 'id'>;
          return { id: d.id, ...raw } as Product;
        });
        data.sort((a, b) => (a.order ?? a.createdAt) - (b.order ?? b.createdAt));
        setProducts(data);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, []);

  return { products, loading };
}

export async function createProduct(
  data: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'order'>,
  order: number
) {
  const now = Date.now();
  return addDoc(collection(db, COLLECTION), {
    ...data,
    order,
    createdAt: now,
    updatedAt: now,
  });
}

export async function updateProduct(id: string, data: Partial<Product>) {
  return updateDoc(doc(db, COLLECTION, id), {
    ...data,
    updatedAt: Date.now(),
  });
}

export async function deleteProduct(id: string) {
  return deleteDoc(doc(db, COLLECTION, id));
}

export async function reorderProducts(ordered: { id: string; order: number }[]) {
  const batch = writeBatch(db);
  ordered.forEach(({ id, order }) => {
    batch.update(doc(db, COLLECTION, id), { order });
  });
  return batch.commit();
}