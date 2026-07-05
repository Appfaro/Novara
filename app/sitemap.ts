import { MetadataRoute } from 'next';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Genera el sitemap en el momento en que alguien lo visita (no durante el
// "build" de Vercel), porque conectar con Firestore en tiempo de compilación
// no es fiable y puede hacer fallar el despliegue.
export const dynamic = 'force-dynamic';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://novara.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), priority: 1 },
    { url: `${siteUrl}/categoria/todas`, lastModified: new Date(), priority: 0.8 },
    { url: `${siteUrl}/privacidad`, lastModified: new Date(), priority: 0.2 },
    { url: `${siteUrl}/cookies`, lastModified: new Date(), priority: 0.2 },
  ];

  try {
    const snap = await getDocs(collection(db, 'products'));
    const productRoutes: MetadataRoute.Sitemap = snap.docs.map((doc) => ({
      url: `${siteUrl}/producto/${doc.id}`,
      lastModified: new Date(doc.data().updatedAt || Date.now()),
      priority: 0.6,
    }));
    return [...staticRoutes, ...productRoutes];
  } catch {
    // Si Firestore no está disponible en build time, se devuelve solo lo estático
    return staticRoutes;
  }
}
