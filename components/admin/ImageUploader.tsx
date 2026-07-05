'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Star, Trash2, Upload } from 'lucide-react';
import { ProductImage } from '@/types';
import { uploadProductImages, deleteProductImage } from '@/lib/storageHelpers';
import toast from 'react-hot-toast';

interface Props {
  sku: string;
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
}

export default function ImageUploader({ sku, images, onChange }: Props) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const dragPath = useRef<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sorted = [...images].sort((a, b) => a.order - b.order);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const uploaded = await uploadProductImages(sku, Array.from(files), images.length);
      onChange([...images, ...uploaded]);
      toast.success(`${uploaded.length} imagen(es) subida(s)`);
    } catch {
      toast.error('Error al subir las imágenes');
    } finally {
      setUploading(false);
    }
  }

  function handleDelete(path: string) {
    const remaining = images
      .filter((img) => img.path !== path)
      .map((img, i) => ({ ...img, order: i }));
    onChange(remaining);
    toast.success('Imagen eliminada');

    deleteProductImage(path).catch(() => {
      /* el archivo ya se quitó de la lista igualmente */
    });
  }

  function handleSetMain(path: string) {
    const fromIndex = images.findIndex((img) => img.path === path);
    if (fromIndex === -1) return;
    const reordered = [...images];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.unshift(moved);
    onChange(reordered.map((img, i) => ({ ...img, order: i })));
  }

  function handleDragStart(path: string) {
    dragPath.current = path;
  }

  function handleDropReorder(targetPath: string) {
    if (!dragPath.current || dragPath.current === targetPath) return;
    const fromIndex = images.findIndex((img) => img.path === dragPath.current);
    const toIndex = images.findIndex((img) => img.path === targetPath);
    if (fromIndex === -1 || toIndex === -1) return;
    const reordered = [...images];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    onChange(reordered.map((img, i) => ({ ...img, order: i })));
    dragPath.current = null;
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed p-8 text-center text-sm ${
          dragOver ? 'border-brand-gold bg-brand-gold/5' : 'border-brand-gray-300 dark:border-brand-gray-600'
        }`}
      >
        <Upload size={24} />
        <p>Arrastra imágenes aquí o haz clic para seleccionarlas</p>
        <p className="text-xs text-brand-gray-500">Se comprimen automáticamente al subirlas</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {uploading && <p className="mt-2 text-sm text-brand-gray-500">Subiendo imágenes…</p>}

      {sorted.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {sorted.map((img, index) => (
            <div
              key={img.path}
              draggable
              onDragStart={() => handleDragStart(img.path)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDropReorder(img.path)}
              className="group relative aspect-square cursor-move overflow-hidden border border-brand-gray-200 dark:border-brand-gray-700"
            >
              <Image src={img.url} alt="" fill className="object-cover" />
              {index === 0 && (
                <span className="absolute left-1 top-1 bg-brand-gold px-1.5 py-0.5 text-[10px] font-bold uppercase text-brand-black">
                  Principal
                </span>
              )}
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                {index !== 0 && (
                  <button
                    type="button"
                    onClick={() => handleSetMain(img.path)}
                    title="Marcar como principal"
                    className="rounded-full bg-white p-1.5"
                  >
                    <Star size={14} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(img.path)}
                  title="Eliminar imagen"
                  className="rounded-full bg-white p-1.5 text-brand-red"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}