'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('cookie-consent')) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem('cookie-consent', 'accepted');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center justify-between gap-3 border-t border-brand-gray-700 bg-brand-black px-6 py-4 text-sm text-white sm:flex-row">
      <p>
        Usamos cookies para mejorar tu experiencia. Consulta nuestra{' '}
        <Link href="/cookies" className="underline hover:text-brand-gold">
          política de cookies
        </Link>
        .
      </p>
      <button
        onClick={accept}
        className="whitespace-nowrap bg-brand-gold px-5 py-2 text-xs font-bold uppercase tracking-widest2 text-brand-black hover:bg-brand-goldDark"
      >
        Aceptar
      </button>
    </div>
  );
}
