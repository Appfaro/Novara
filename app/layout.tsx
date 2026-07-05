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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://novara.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Novara | Diseño, rendimiento y estilo de vida',
    template: '%s | Novara',
  },
  description:
    'Novara — ropa, calzado y accesorios para todos los deportes. Diseño, rendimiento y estilo de vida.',
  keywords: ['novara', 'ropa deportiva', 'calzado deportivo', 'accesorios deportivos', 'estilo de vida'],
  openGraph: {
    title: 'Novara | Diseño, rendimiento y estilo de vida',
    description: 'Ropa, calzado y accesorios para todos los deportes.',
    url: siteUrl,
    siteName: 'Novara',
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Novara',
    description: 'Diseño, rendimiento y estilo de vida.',
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
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try {
              if (!window.location.pathname.startsWith('/admin')) {
                var t = localStorage.getItem('theme');
                if (t ? t === 'dark' : true) {
                  document.documentElement.classList.add('dark');
                }
              }
            } catch (e) {}`,
          }}
        />
      </head>
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
