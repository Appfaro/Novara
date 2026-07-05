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
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Category } from '@/types';
import { slugify } from '@/lib/utils';

const COLLECTION = 'categories';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, COLLECTION), orderBy('order', 'asc'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Category);
        setCategories(data);
        setLoading(false);
      },
      () => setLoading(false)
    );
    return unsub;
  }, []);

  return { categories, loading };
}

export async function createCategory(name: string, order: number) {
  return addDoc(collection(db, COLLECTION), {
    name,
    slug: slugify(name),
    order,
    visible: true,
  });
}

export async function renameCategory(id: string, name: string) {
  return updateDoc(doc(db, COLLECTION, id), { name, slug: slugify(name) });
}

export async function reorderCategory(id: string, order: number) {
  return updateDoc(doc(db, COLLECTION, id), { order });
}

export async function toggleCategoryVisibility(id: string, visible: boolean) {
  return updateDoc(doc(db, COLLECTION, id), { visible });
}

export async function deleteCategory(id: string) {
  return deleteDoc(doc(db, COLLECTION, id));
}
