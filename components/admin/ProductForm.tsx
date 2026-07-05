'use client';

import { useState } from 'react';
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
  const [country, setCountry] = useState(existing?.country || '');
  const [year, setYear] = useState(existing?.worldCupYear || 2026);
  const [price, setPrice] = useState(existing?.price || 0);
  const [offerPrice, setOfferPrice] = useState(existing?.offerPrice || 0);
  const [description, setDescription] = useState(existing?.description || '');
  const [categoryId, setCategoryId] = useState(existing?.categoryId || categories[0]?.id || '');
  const [visible, setVisible] = useState(existing?.visible ?? true);
  const [images, setImages] = useState<ProductImage[]>(existing?.images || []);
  const [sizes, setSizes] = useState<SizeStock[]>(
    existing?.sizes || ALL_SIZES.map((size) => ({ size, stock: 0 }))
  );
  const [sku] = useState(existing?.sku || generateSku(country || 'GEN', year));
  const [saving, setSaving] = useState(false);

  function updateStock(size: SizeStock['size'], stock: number) {
    setSizes((prev) => prev.map((s) => (s.size === size ? { ...s, stock: Math.max(0, stock) } : s)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !country || !categoryId) {
      toast.error('Completa nombre, país y categoría');
      return;
    }
    setSaving(true);
    const data = {
      name,
      country,
      worldCupYear: Number(year),
      price: Number(price),
      offerPrice: offerPrice ? Number(offerPrice) : null,
      description,
      images,
      sizes,
      sku,
      categoryId,
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
          <label className="mb-1 block text-sm font-semibold">País</label>
          <input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full border border-brand-gray-300 px-3 py-2 dark:bg-brand-black dark:border-brand-gray-600"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-semibold">Año del Mundial</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
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
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold">Imágenes</label>
        <ImageUploader sku={sku} images={images} onChange={setImages} />
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
        className="bg-brand-red px-6 py-3 text-sm font-bold uppercase tracking-widest2 text-white hover:bg-brand-redDark disabled:opacity-60"
      >
        {saving ? 'Guardando…' : existing ? 'Guardar cambios' : 'Crear producto'}
      </button>
    </form>
  );
}
