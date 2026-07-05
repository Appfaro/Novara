'use client';

import AdminGuard from '@/components/admin/AdminGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import ProductForm from '@/components/admin/ProductForm';

export default function NewProductPage() {
  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <h1 className="mb-6 font-display text-2xl uppercase">Nuevo producto</h1>
          <ProductForm />
        </main>
      </div>
    </AdminGuard>
  );
}
