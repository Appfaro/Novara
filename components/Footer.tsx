import Link from 'next/link';
import Newsletter from '@/components/Newsletter';
import Logo from '@/components/Logo';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-brand-gray-200 bg-brand-gray-50 dark:border-brand-gray-700 dark:bg-brand-dark">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <p className="flex items-center gap-2 font-display text-xl uppercase tracking-widest2">
            <Logo size={22} />
            Novara
          </p>
          <p className="mt-3 text-sm text-brand-gray-500">
            Diseño, rendimiento y estilo de vida para todos los deportes.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide">Tienda</h3>
          <ul className="space-y-2 text-sm text-brand-gray-500">
            <li><Link href="/categoria/todas" className="hover:text-brand-gold">Ver todo</Link></li>
            <li><Link href="/favoritos" className="hover:text-brand-gold">Favoritos</Link></li>
            <li><Link href="/carrito" className="hover:text-brand-gold">Carrito</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide">Legal</h3>
          <ul className="space-y-2 text-sm text-brand-gray-500">
            <li><Link href="/privacidad" className="hover:text-brand-gold">Política de privacidad</Link></li>
            <li><Link href="/cookies" className="hover:text-brand-gold">Política de cookies</Link></li>
            <li><Link href="/admin/login" className="hover:text-brand-gold">Acceso administrador</Link></li>
          </ul>
        </div>

        <Newsletter />
      </div>

      <div className="border-t border-brand-gray-200 py-4 text-center text-xs text-brand-gray-400 dark:border-brand-gray-700">
        © {new Date().getFullYear()} Novara. Todos los derechos reservados.
      </div>
    </footer>
  );
}
