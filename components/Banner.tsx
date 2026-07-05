import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/components/Logo';

export default function Banner() {
  return (
    <section className="relative overflow-hidden bg-brand-black text-white">
      <div className="absolute inset-y-0 right-0 hidden w-[60%] md:block">
        <Image
          src="/images/hero-runner.png"
          alt=""
          fill
          priority
          className="object-contain object-right"
        />
        <div className="absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-brand-black to-transparent" />
      </div>

      <div className="relative mx-auto flex max-w-6xl items-center px-6 py-20 sm:py-28">
        <div className="flex max-w-xl flex-col items-start gap-5">
          <div className="flex items-center gap-1">
            <Logo size={72} light />
            <h1 className="font-display text-5xl uppercase leading-[0.95] sm:text-6xl animate-fadeUp">
              Novara
            </h1>
          </div>
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
      </div>
    </section>
  );
}