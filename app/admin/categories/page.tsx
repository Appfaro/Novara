'use client';

import { useRef, useState } from 'react';
import { Plus, Trash2, Eye, EyeOff, GripVertical, X } from 'lucide-react';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import {
  useCategories,
  createCategory,
  renameCategory,
  reorderCategory,
  toggleCategoryVisibility,
  setCategoryAttributes,
  deleteCategory,
} from '@/hooks/useCategories';
import toast from 'react-hot-toast';

export default function AdminCategoriesPage() {
  const { categories } = useCategories();
  const [newName, setNewName] = useState('');
  const dragIndex = useRef<number | null>(null);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      await createCategory(newName.trim(), categories.length);
      setNewName('');
      toast.success('Categoría creada. Ya aparece como pestaña nueva en la tienda.');
    } catch {
      toast.error('No se pudo crear la categoría');
    }
  }

  async function handleRename(id: string, current: string) {
    const name = prompt('Nuevo nombre de la categoría:', current);
    if (!name || name === current) return;
    try {
      await renameCategory(id, name);
      toast.success('Categoría renombrada');
    } catch {
      toast.error('No se pudo renombrar');
    }
  }

  async function handleAddAttribute(id: string, current: string[]) {
    const name = prompt(
      'Nombre del nuevo campo para los productos de esta categoría (ej. "País", "Material", "Talla de calcetín"):'
    );
    if (!name || !name.trim()) return;
    if (current.includes(name.trim())) {
      toast.error('Ese campo ya existe en esta categoría');
      return;
    }
    try {
      await setCategoryAttributes(id, [...current, name.trim()]);
      toast.success('Campo añadido');
    } catch {
      toast.error('No se pudo añadir el campo');
    }
  }

  async function handleRemoveAttribute(id: string, current: string[], attr: string) {
    if (!confirm(`¿Quitar el campo "${attr}" de esta categoría?`)) return;
    try {
      await setCategoryAttributes(id, current.filter((a) => a !== attr));
      toast.success('Campo eliminado');
    } catch {
      toast.error('No se pudo eliminar el campo');
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`¿Eliminar la categoría "${name}"? Los productos no se eliminarán, pero quedarán sin categoría.`)) return;
    try {
      await deleteCategory(id);
      toast.success('Categoría eliminada');
    } catch {
      toast.error('No se pudo eliminar');
    }
  }

  async function handleDrop(index: number) {
    if (dragIndex.current === null || dragIndex.current === index) return;
    const reordered = [...categories];
    const [moved] = reordered.splice(dragIndex.current, 1);
    reordered.splice(index, 0, moved);
    await Promise.all(reordered.map((c, i) => reorderCategory(c.id, i)));
    dragIndex.current = null;
  }

  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <h1 className="mb-2 font-display text-2xl uppercase">Categorías</h1>
          <p className="mb-6 text-sm text-brand-gray-500">
            Cada categoría se muestra automáticamente como una pestaña nueva en la
            página principal. Arrastra las filas para cambiar el orden. Los
            &quot;campos&quot; de cada categoría son los datos extra que pedirá el
            formulario al crear un producto de ese tipo (por ejemplo, una
            categoría de camisetas puede tener los campos &quot;País&quot; y
            &quot;Año del Mundial&quot;, mientras que una de calcetines puede
            tener &quot;Material&quot; y &quot;Talla&quot;).
          </p>

          <form onSubmit={handleCreate} className="mb-6 flex gap-2">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nombre de la nueva categoría (ej. Calcetines)"
              className="flex-1 max-w-sm border border-brand-gray-300 px-3 py-2 text-sm dark:bg-brand-black dark:border-brand-gray-600"
            />
            <button
              type="submit"
              className="flex items-center gap-2 bg-brand-gold px-4 py-2 text-sm font-bold uppercase text-brand-black hover:bg-brand-goldDark"
            >
              <Plus size={16} /> Crear
            </button>
          </form>

          <div className="max-w-2xl space-y-2">
            {categories.map((cat, index) => (
              <div
                key={cat.id}
                draggable
                onDragStart={() => (dragIndex.current = index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(index)}
                className="border border-brand-gray-200 bg-white p-3 dark:border-brand-gray-700 dark:bg-brand-dark"
              >
                <div className="flex items-center gap-3">
                  <GripVertical size={16} className="cursor-move text-brand-gray-400" />
                  <button onClick={() => handleRename(cat.id, cat.name)} className="flex-1 text-left font-semibold hover:text-brand-gold">
                    {cat.name}
                  </button>
                  <button
                    onClick={() => toggleCategoryVisibility(cat.id, !cat.visible)}
                    title={cat.visible ? 'Ocultar categoría' : 'Mostrar categoría'}
                    className="text-brand-gray-500 hover:text-brand-black dark:hover:text-white"
                  >
                    {cat.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="text-brand-gray-500 hover:text-brand-red"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2 pl-7">
                  <span className="text-xs font-bold uppercase text-brand-gray-400">Campos:</span>
                  {(cat.attributes || []).map((attr) => (
                    <span
                      key={attr}
                      className="flex items-center gap-1 border border-brand-gray-300 px-2 py-0.5 text-xs dark:border-brand-gray-600"
                    >
                      {attr}
                      <button
                        onClick={() => handleRemoveAttribute(cat.id, cat.attributes || [], attr)}
                        aria-label={`Quitar campo ${attr}`}
                        className="text-brand-gray-400 hover:text-brand-red"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                  {(cat.attributes || []).length === 0 && (
                    <span className="text-xs text-brand-gray-400">Ninguno todavía</span>
                  )}
                  <button
                    onClick={() => handleAddAttribute(cat.id, cat.attributes || [])}
                    className="flex items-center gap-1 text-xs font-bold text-brand-gold hover:underline"
                  >
                    <Plus size={12} /> Añadir campo
                  </button>
                </div>
              </div>
            ))}
            {categories.length === 0 && (
              <p className="text-sm text-brand-gray-500">Todavía no hay categorías. Crea la primera arriba.</p>
            )}
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
