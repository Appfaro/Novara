'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product, ProductImage, SizeStock } from '@/types';
import { createProduct, updateProduct } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { generateSku } from '@/lib/utils';
import ImageUploader from '@/components/admin/ImageUploader';
import toast from 'react-hot-toast';

const ALL_SIZES: SizeStock['size'][] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function ProductForm({ existing }: { existing?: Product }) {
  const router = useRouter();
  const { categories } = useCategories();

  const [name, setName] = useState(existing?.name || '');
  const [price, setPrice] = useState(existing?.price || 0);
  const [offerPrice, setOfferPrice] = useState(existing?.offerPrice || 0);
  const [description, setDescription] = useState(existing?.description || '');
  const [categoryId, setCategoryId] = useState(existing?.categoryId || '');
  const [visible, setVisible] = useState(existing?.visible ?? true);
  const [images, setImages] = useState<ProductImage[]>(existing?.images || []);
  const [sizes, setSizes] = useState<SizeStock[]>(
    existing?.sizes || ALL_SIZES.map((size) => ({ size, stock: 0 }))
  );
  const [attributes, setAttributes] = useState<Record<string, string>>(existing?.attributes || {});
  const [sku, setSku] = useState(existing?.sku || '');
  const [saving, setSaving] = useState(false);

  const selectedCategory = categories.find((c) => c.id === categoryId);

  // Selecciona la primera categoría disponible por defecto al crear un producto nuevo
  useEffect(() => {
    if (!existing && !categoryId && categories.length > 0) {
      setCategoryId(categories[0].id);
    }
  }, [categories, existing, categoryId]);

  // Genera el SKU automáticamente en cuanto se conoce la categoría (solo al crear)
  useEffect(() => {
    if (!existing && !sku && selectedCategory) {
      setSku(generateSku(selectedCategory.name));
    }
  }, [existing, sku, selectedCategory]);

  function updateStock(size: SizeStock['size'], stock: number) {
    setSizes((prev) => prev.map((s) => (s.size === size ? { ...s, stock: Math.max(0, stock) } : s)));
  }

  function updateAttribute(key: string, value: string) {
    setAttributes((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !categoryId) {
      toast.error('Completa al menos el nombre y la categoría');
      return;
    }
    setSaving(true);
    // Solo se guardan los atributos que pertenecen a la categoría actual
    const cleanAttributes: Record<string, string> = {};
    (selectedCategory?.attributes || []).forEach((attr) => {
      if (attributes[attr]) cleanAttributes[attr] = attributes[attr];
    });
    const data = {
      name,
      price: Number(price),
      offerPrice: offerPrice ? Number(offerPrice) : null,
      description,
      images,
      sizes,
      sku,
      categoryId,
      attributes: cleanAttributes,
      visible,
    };
    try {
      if (existing) {
        await updateProduct(existing.id, data);
        toast.success('Producto actualizado');
      } else {
        await createProduct(data);
        toast.success('Producto creado');
      }
      router.push('/admin/products');
    } catch {
      toast.error('No se pudo guardar el producto');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-semibold">Nombre</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-brand-gray-300 px-3 py-2 dark:bg-brand-black dark:border-brand-gray-600"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">Categoría</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full border border-brand-gray-300 px-3 py-2 dark:bg-brand-black dark:border-brand-gray-600"
            required
          >
            <option value="">Selecciona…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {categories.length === 0 && (
            <p className="mt-1 text-xs text-brand-gray-500">
              Primero crea una categoría en la sección &quot;Categorías&quot;.
            </p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">Precio (€)</label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            className="w-full border border-brand-gray-300 px-3 py-2 dark:bg-brand-black dark:border-brand-gray-600"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">Precio de oferta (opcional)</label>
          <input
            type="number"
            step="0.01"
            value={offerPrice}
            onChange={(e) => setOfferPrice(Number(e.target.value))}
            className="w-full border border-brand-gray-300 px-3 py-2 dark:bg-brand-black dark:border-brand-gray-600"
          />
        </div>
      </div>

      {/* Campos personalizados según la categoría elegida (definidos en "Categorías") */}
      {selectedCategory && selectedCategory.attributes.length > 0 && (
        <div>
          <label className="mb-2 block text-sm font-semibold">
            Datos de &quot;{selectedCategory.name}&quot;
          </label>
          <div className="grid grid-cols-2 gap-4">
            {selectedCategory.attributes.map((attr) => (
              <div key={attr}>
                <label className="mb-1 block text-xs font-semibold text-brand-gray-500">{attr}</label>
                <input
                  value={attributes[attr] || ''}
                  onChange={(e) => updateAttribute(attr, e.target.value)}
                  className="w-full border border-brand-gray-300 px-3 py-2 dark:bg-brand-black dark:border-brand-gray-600"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-semibold">Descripción</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full border border-brand-gray-300 px-3 py-2 dark:bg-brand-black dark:border-brand-gray-600"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold">Tallas y stock</label>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {sizes.map((s) => (
            <div key={s.size}>
              <p className="mb-1 text-center text-xs font-bold">{s.size}</p>
              <input
                type="number"
                min={0}
                value={s.stock}
                onChange={(e) => updateStock(s.size, Number(e.target.value))}
                className="w-full border border-brand-gray-300 px-2 py-1 text-center dark:bg-brand-black dark:border-brand-gray-600"
              />
            </div>
          ))}
        </div>
        <p className="mt-1 text-xs text-brand-gray-500">
          Si tu producto no usa tallas de ropa, deja todas a 0 salvo una (ej. &quot;M&quot;) y
          pon ahí el stock total disponible.
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold">Imágenes</label>
        <ImageUploader sku={sku || 'nuevo'} images={images} onChange={setImages} />
      </div>

      <div className="flex items-center justify-between border-t border-brand-gray-200 pt-4 dark:border-brand-gray-700">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} />
          Producto visible en la tienda
        </label>
        <p className="text-xs text-brand-gray-400">SKU: {sku}</p>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="bg-brand-gold px-6 py-3 text-sm font-bold uppercase tracking-widest2 text-brand-black hover:bg-brand-goldDark disabled:opacity-60"
      >
        {saving ? 'Guardando…' : existing ? 'Guardar cambios' : 'Crear producto'}
      </button>
    </form>
  );
}
