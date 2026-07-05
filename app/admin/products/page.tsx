'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useProducts, deleteProduct } from '@/hooks/useProducts';
import { formatPrice, totalStock } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const { products, loading } = useProducts();

  async function handleDelete(id: string, name: string) {
    if (!confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return;
    try {
      await deleteProduct(id);
      toast.success('Producto eliminado');
    } catch {
      toast.error('No se pudo eliminar el producto');
    }
  }

  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="font-display text-2xl uppercase">Productos</h1>
            <Link
              href="/admin/products/new"
              className="flex items-center gap-2 bg-brand-red px-4 py-2 text-sm font-bold uppercase text-white hover:bg-brand-redDark"
            >
              <Plus size={16} /> Nuevo producto
            </Link>
          </div>

          {loading ? (
            <p className="text-brand-gray-500">Cargando…</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-brand-gray-200 dark:border-brand-gray-700">
                  <th className="py-2">Imagen</th>
                  <th>Nombre</th>
                  <th>País / Año</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Visible</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b border-brand-gray-100 dark:border-brand-gray-800">
                    <td className="py-2">
                      {p.images[0] && (
                        <Image src={p.images[0].url} alt={p.name} width={40} height={40} className="h-10 w-10 object-cover" />
                      )}
                    </td>
                    <td>{p.name}</td>
                    <td>{p.country} · {p.worldCupYear}</td>
                    <td>{formatPrice(p.offerPrice || p.price)}</td>
                    <td>{totalStock(p)}</td>
                    <td>{p.visible ? 'Sí' : 'No'}</td>
                    <td>
                      <div className="flex gap-2">
                        <Link href={`/admin/products/${p.id}`} className="text-brand-gray-500 hover:text-brand-black dark:hover:text-white">
                          <Pencil size={16} />
                        </Link>
                        <button onClick={() => handleDelete(p.id, p.name)} className="text-brand-gray-500 hover:text-brand-red">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </main>
      </div>
    </AdminGuard>
  );
}
