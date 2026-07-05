import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = { title: 'Política de cookies' };

export default function CookiesPage() {
  return (
    <main>
      <Navbar />
      <article className="mx-auto max-w-2xl px-4 py-12 text-sm leading-relaxed text-brand-gray-700 dark:text-brand-gray-300 sm:px-6">
        <h1 className="mb-6 font-display text-3xl uppercase text-brand-black dark:text-white">
          Política de cookies
        </h1>
        <p className="mb-4">
          Usamos almacenamiento local del navegador para recordar tu carrito,
          tus favoritos y tu preferencia de modo oscuro/claro. No usamos
          cookies de publicidad ni de rastreo de terceros.
        </p>
        <h2 className="mb-2 mt-6 font-bold uppercase">Cómo desactivarlas</h2>
        <p>
          Puedes borrar estos datos en cualquier momento desde los ajustes de
          tu navegador, en la sección de datos de sitios web.
        </p>
      </article>
      <Footer />
    </main>
  );
}
