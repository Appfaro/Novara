import type { Metadata } from 'next';
import { Anton, Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';
import CookieBanner from '@/components/CookieBanner';

const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mundial-shirts.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Mundial Shirts | Camisetas oficiales de Mundiales de Fútbol',
    template: '%s | Mundial Shirts',
  },
  description:
    'Camisetas retro y actuales de todos los Mundiales de Fútbol. Envíos rápidos, tallas de la S a la XXL y ediciones limitadas de selecciones históricas.',
  keywords: [
    'camisetas mundial',
    'camisetas retro fútbol',
    'camisetas selecciones',
    'camisetas fútbol vintage',
  ],
  openGraph: {
    title: 'Mundial Shirts | Camisetas oficiales de Mundiales de Fútbol',
    description:
      'Camisetas retro y actuales de todos los Mundiales de Fútbol.',
    url: siteUrl,
    siteName: 'Mundial Shirts',
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mundial Shirts',
    description: 'Camisetas oficiales de todos los Mundiales de Fútbol.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${anton.variable} ${inter.variable}`}>
      <body className="font-body antialiased">
        <AuthProvider>
          <CartProvider>
            {children}
            <CookieBanner />
            <Toaster position="bottom-center" />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
