import type { Metadata } from 'next';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/types';
import ProductPageClient from '@/components/ProductPageClient';

// Genera metadatos (título, descripción, Open Graph) dinámicos por producto,
// leyendo el documento directamente de Firestore en el servidor.
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    const snap = await getDoc(doc(db, 'products', params.id));
    if (!snap.exists()) return { title: 'Producto no encontrado' };
    const product = snap.data() as Product;
    const image = product.images?.[0]?.url;
    return {
      title: `${product.name} | ${product.country} ${product.worldCupYear}`,
      description: product.description?.slice(0, 160),
      openGraph: {
        title: product.name,
        description: product.description?.slice(0, 160),
        images: image ? [{ url: image }] : undefined,
      },
    };
  } catch {
    return { title: 'MundialShirts' };
  }
}

export default function ProductPage({ params }: { params: { id: string } }) {
  return <ProductPageClient params={params} />;
}
