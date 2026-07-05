'use client';

import AdminGuard from '@/components/admin/AdminGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { totalStock } from '@/lib/utils';

export default function AdminDashboardPage() {
  const { products } = useProducts();
  const { categories } = useCategories();

  const outOfStock = products.filter((p) => totalStock(p) === 0).length;

  const stats = [
    { label: 'Productos', value: products.length },
    { label: 'Categorías', value: categories.length },
    { label: 'Sin stock', value: outOfStock },
  ];

  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <h1 className="mb-6 font-display text-2xl uppercase">Resumen</h1>
          <div className="grid grid-cols-3 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="border border-brand-gray-200 p-6 dark:border-brand-gray-700">
                <p className="text-3xl font-bold">{s.value}</p>
                <p className="text-sm text-brand-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-brand-gray-500">
            Usa el menú de la izquierda para crear productos, subir imágenes o
            gestionar las categorías de la tienda. No necesitas tocar código.
          </p>
        </main>
      </div>
    </AdminGuard>
  );
}
