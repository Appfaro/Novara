import Link from 'next/link';
import Logo from '@/components/Logo';

export default function Banner() {
  return (
    <section className="relative overflow-hidden bg-brand-black text-white">
      {/* Textura sutil de fondo para dar profundidad sin recargar */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(201,162,74,0.25),transparent_45%)]" />
      <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-6 px-6 py-24 sm:py-32">
        <Logo size={48} light />
        <h1 className="font-display text-5xl uppercase leading-[0.95] sm:text-7xl md:text-8xl animate-fadeUp">
          Novara
        </h1>
        <p className="text-sm font-bold uppercase tracking-widest2 text-brand-gold">
          Diseño · Rendimiento · Estilo de vida
        </p>
        <span className="h-[3px] w-14 bg-brand-red" />
        <p className="max-w-md text-brand-gray-300">
          Ropa, calzado y accesorios para todos los deportes. Calidad pensada
          para el rendimiento, diseñada para el día a día.
        </p>
        <Link
          href="/categoria/todas"
          className="mt-2 inline-block rounded-none bg-brand-gold px-8 py-4 text-sm font-bold uppercase tracking-widest2 text-brand-black transition-transform hover:scale-105 hover:bg-brand-goldDark"
        >
          Comprar ahora
        </Link>
      </div>
    </section>
  );
}
