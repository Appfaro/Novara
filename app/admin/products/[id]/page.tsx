'use client';

import AdminGuard from '@/components/admin/AdminGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import ProductForm from '@/components/admin/ProductForm';
import { useProducts } from '@/hooks/useProducts';

export default function EditProductPage({ params }: { params: { id: string } }) {
  const { products, loading } = useProducts();
  const product = products.find((p) => p.id === params.id);

  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <h1 className="mb-6 font-display text-2xl uppercase">Editar producto</h1>
          {loading ? (
            <p className="text-brand-gray-500">Cargando…</p>
          ) : !product ? (
            <p className="text-brand-gray-500">Producto no encontrado.</p>
          ) : (
            <ProductForm existing={product} />
          )}
        </main>
      </div>
    </AdminGuard>
  );
}
