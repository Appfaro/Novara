'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useProducts, deleteProduct, reorderProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { formatPrice, totalStock } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const { products, loading } = useProducts();
  const { categories } = useCategories();
  const dragIndex = useRef<number | null>(null);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return;
    try {
      await deleteProduct(id);
      toast.success('Producto eliminado');
    } catch {
      toast.error('No se pudo eliminar el producto');
    }
  }

  async function handleDrop(index: number) {
    if (dragIndex.current === null || dragIndex.current === index) return;
    const reordered = [...products];
    const [moved] = reordered.splice(dragIndex.current, 1);
    reordered.splice(index, 0, moved);
    dragIndex.current = null;
    try {
      await reorderProducts(reordered.map((p, i) => ({ id: p.id, order: i })));
      toast.success('Orden actualizado');
    } catch {
      toast.error('No se pudo guardar el nuevo orden');
    }
  }

  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="mb-2 flex items-center justify-between">
            <h1 className="font-display text-2xl uppercase">Productos</h1>
            <Link
              href="/admin/products/new"
              className="flex items-center gap-2 bg-brand-gold px-4 py-2 text-sm font-bold uppercase text-brand-black hover:bg-brand-goldDark"
            >
              <Plus size={16} /> Nuevo producto
            </Link>
          </div>
          <p className="mb-6 text-sm text-brand-gray-500">
            Arrastra las filas (icono ⋮⋮) para cambiar el orden en que aparecen en la tienda.
          </p>

          {loading ? (
            <p className="text-brand-gray-500">Cargando…</p>
          ) : products.length === 0 ? (
            <p className="text-brand-gray-500">Todavía no hay productos.</p>
          ) : (
            <div className="max-w-4xl space-y-1">
              <div className="hidden items-center gap-3 px-3 py-2 text-xs font-bold uppercase text-brand-gray-400 sm:flex">
                <span className="w-4" />
                <span className="w-10" />
                <span className="flex-1">Nombre</span>
                <span className="w-32">Categoría</span>
                <span className="w-20">Precio</span>
                <span className="w-16">Stock</span>
                <span className="w-14">Visible</span>
                <span className="w-14" />
              </div>

              {products.map((p, index) => (
                <div
                  key={p.id}
                  draggable
                  onDragStart={(e) => {
                    dragIndex.current = index;
                    e.dataTransfer.setData('text/plain', String(index));
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(index)}
                  className="flex cursor-move flex-wrap items-center gap-3 border border-brand-gray-200 bg-white p-3 text-sm dark:border-brand-gray-700 dark:bg-brand-dark sm:flex-nowrap"
                >
                  <GripVertical size={16} className="w-4 flex-shrink-0 text-brand-gray-400" />

                  <div className="w-10 flex-shrink-0">
                    {p.images[0] && (
                      <Image src={p.images[0].url} alt={p.name} width={40} height={40} className="h-10 w-10 object-cover" />
                    )}
                  </div>

                  <span className="min-w-[10rem] flex-1 font-semibold">{p.name}</span>
                  <span className="w-32 flex-shrink-0 text-brand-gray-500">
                    {categories.find((c) => c.id === p.categoryId)?.name || '—'}
                  </span>
                  <span className="w-20 flex-shrink-0">{formatPrice(p.offerPrice || p.price)}</span>
                  <span className="w-16 flex-shrink-0">{totalStock(p)}</span>
                  <span className="w-14 flex-shrink-0">{p.visible ? 'Sí' : 'No'}</span>

                  <div className="flex w-14 flex-shrink-0 gap-2">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="text-brand-gray-500 hover:text-brand-black dark:hover:text-white"
                    >
                      <Pencil size={16} />
                    </Link>
                    <button onClick={() => handleDelete(p.id, p.name)} className="text-brand-gray-500 hover:text-brand-red">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </AdminGuard>
  );
}