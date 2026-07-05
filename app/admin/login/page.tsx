'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/components/Logo';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      router.push('/admin/dashboard');
    } catch {
      toast.error('Email o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-black px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 border border-brand-gray-700 bg-brand-dark p-8 text-white"
      >
        <div className="flex items-center gap-2">
          <Logo size={28} light />
          <h1 className="font-display text-2xl uppercase">Novara</h1>
        </div>
        <p className="text-sm text-brand-gray-400">Acceso solo para administradores</p>

        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full border border-brand-gray-600 bg-brand-black px-3 py-2 text-sm outline-none"
        />
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          className="w-full border border-brand-gray-600 bg-brand-black px-3 py-2 text-sm outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-gold py-3 text-sm font-bold uppercase tracking-widest2 text-brand-black hover:bg-brand-goldDark disabled:opacity-60"
        >
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </main>
  );
}
