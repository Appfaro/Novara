'use client';

import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast from 'react-hot-toast';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes('@')) {
      toast.error('Introduce un email válido');
      return;
    }
    setSending(true);
    try {
      await addDoc(collection(db, 'newsletter'), {
        email,
        createdAt: Date.now(),
      });
      toast.success('¡Gracias por suscribirte!');
      setEmail('');
    } catch {
      toast.error('No se pudo guardar tu email, inténtalo de nuevo');
    } finally {
      setSending(false);
    }
  }

  return (
    <div>
      <h3 className="mb-3 text-sm font-bold uppercase tracking-wide">Newsletter</h3>
      <p className="mb-3 text-sm text-brand-gray-500">
        Ofertas y lanzamientos antes que nadie.
      </p>
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          className="w-full border border-brand-gray-300 bg-white px-3 py-2 text-sm outline-none dark:bg-brand-black dark:border-brand-gray-600"
        />
        <button
          type="submit"
          disabled={sending}
          className="bg-brand-red px-4 text-sm font-bold uppercase text-white hover:bg-brand-redDark disabled:opacity-60"
        >
          OK
        </button>
      </form>
    </div>
  );
}
