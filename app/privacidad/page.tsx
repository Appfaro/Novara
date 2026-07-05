import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = { title: 'Política de privacidad' };

export default function PrivacyPage() {
  return (
    <main>
      <Navbar />
      <article className="mx-auto max-w-2xl px-4 py-12 text-sm leading-relaxed text-brand-gray-700 dark:text-brand-gray-300 sm:px-6">
        <h1 className="mb-6 font-display text-3xl uppercase text-brand-black dark:text-white">
          Política de privacidad
        </h1>
        <p className="mb-4">
          En Novara respetamos tu privacidad. Esta página resume qué
          datos recogemos y para qué los usamos. Sustituye este texto por el
          redactado por tu asesor legal antes de publicar la tienda.
        </p>
        <h2 className="mb-2 mt-6 font-bold uppercase">Datos que recogemos</h2>
        <p className="mb-4">
          Email de la newsletter, valoraciones de productos y, si compras,
          los datos necesarios para gestionar el pedido a través de WhatsApp.
        </p>
        <h2 className="mb-2 mt-6 font-bold uppercase">Uso de los datos</h2>
        <p className="mb-4">
          Solo se usan para gestionar pedidos, responder consultas y enviar
          comunicaciones comerciales si te has suscrito voluntariamente.
        </p>
        <h2 className="mb-2 mt-6 font-bold uppercase">Tus derechos</h2>
        <p>
          Puedes solicitar el acceso, rectificación o eliminación de tus datos
          escribiéndonos a través del botón de WhatsApp de la tienda.
        </p>
      </article>
      <Footer />
    </main>
  );
}
