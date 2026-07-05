import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import imageCompression from 'browser-image-compression';
import { storage } from '@/lib/firebase';
import { ProductImage } from '@/types';

/**
 * Comprime una imagen en el navegador antes de subirla, para que la tienda
 * cargue rápido en móviles (parte del requisito de rendimiento).
 */
async function compress(file: File): Promise<File> {
  try {
    return await imageCompression(file, {
      maxSizeMB: 0.8,
      maxWidthOrHeight: 1600,
      useWebWorker: true,
      fileType: 'image/webp',
    });
  } catch {
    return file; // si falla la compresión, se sube el original
  }
}

/** Sube una o varias imágenes de un producto y devuelve sus datos. */
export async function uploadProductImages(
  productSku: string,
  files: File[],
  startOrder = 0
): Promise<ProductImage[]> {
  const results: ProductImage[] = [];
  for (let i = 0; i < files.length; i++) {
    const compressed = await compress(files[i]);
    const path = `products/${productSku}/${Date.now()}-${i}.webp`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, compressed);
    const url = await getDownloadURL(storageRef);
    results.push({ url, path, order: startOrder + i });
  }
  return results;
}

/** Elimina una imagen tanto del array del producto como de Storage. */
export async function deleteProductImage(path: string): Promise<void> {
  try {
    await deleteObject(ref(storage, path));
  } catch {
    // Si ya no existe en Storage, continuamos igualmente
  }
}

/** Reordena el array de imágenes según el nuevo orden de índices (drag & drop). */
export function reorderImages(
  images: ProductImage[],
  fromIndex: number,
  toIndex: number
): ProductImage[] {
  const updated = [...images];
  const [moved] = updated.splice(fromIndex, 1);
  updated.splice(toIndex, 0, moved);
  return updated.map((img, idx) => ({ ...img, order: idx }));
}
