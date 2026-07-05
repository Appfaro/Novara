import Link from 'next/link';

export default function Banner() {
  return (
    <section className="relative overflow-hidden bg-brand-black text-white">
      {/* Textura sutil de fondo para dar profundidad sin recargar */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(229,18,26,0.25),transparent_45%)]" />
      <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-6 px-6 py-24 sm:py-32">
        <span className="rounded-full border border-brand-red px-4 py-1 text-xs font-bold uppercase tracking-widest2 text-brand-red">
          Edición Mundiales
        </span>
        <h1 className="font-display text-5xl uppercase leading-[0.95] sm:text-7xl md:text-8xl animate-fadeUp">
          Viste la<br />
          <span className="text-brand-red">Historia</span> del<br />
          Fútbol
        </h1>
        <p className="max-w-md text-brand-gray-300">
          Camisetas oficiales y retro de todas las selecciones y Mundiales.
          Calidad de estadio, entrega rápida.
        </p>
        <Link
          href="/categoria/todas"
          className="mt-2 inline-block rounded-none bg-brand-red px-8 py-4 text-sm font-bold uppercase tracking-widest2 text-white transition-transform hover:scale-105 hover:bg-brand-redDark"
        >
          Comprar ahora
        </Link>
      </div>
    </section>
  );
}
