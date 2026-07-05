'use client';

import { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/types';

const COLLECTION = 'products';

/** Escucha en tiempo real la colección de productos de Firestore. */
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Product);
        setProducts(data);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, []);

  return { products, loading };
}

export async function createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
  const now = Date.now();
  return addDoc(collection(db, COLLECTION), {
    ...data,
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
