'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Search, ShoppingBag, Heart, Menu, X, Moon, Sun } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import SearchBar from '@/components/SearchBar';

export default function Navbar() {
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const isDark = stored === 'dark';
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  function toggleDark() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }

  return (
    <header className="sticky top-0 z-50 border-b border-brand-gray-200 dark:border-brand-gray-700 bg-white/95 dark:bg-brand-black/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <button
          className="md:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Abrir menú"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <Link href="/" className="font-display text-2xl tracking-widest2 uppercase">
          Mundial<span className="text-brand-red">Shirts</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold uppercase tracking-wide">
          <Link href="/" className="hover:text-brand-red transition-colors">Inicio</Link>
          <Link href="/categoria/todas" className="hover:text-brand-red transition-colors">Camisetas</Link>
          <Link href="/favoritos" className="hover:text-brand-red transition-colors">Favoritos</Link>
        </nav>

        <div className="flex items-center gap-4">
          <button aria-label="Buscar" onClick={() => setSearchOpen((o) => !o)}>
            <Search size={22} />
          </button>
          <button aria-label="Cambiar tema" onClick={toggleDark}>
            {dark ? <Sun size={22} /> : <Moon size={22} />}
          </button>
          <Link href="/favoritos" aria-label="Favoritos" className="hidden sm:block">
            <Heart size={22} />
          </Link>
          <Link href="/carrito" aria-label="Carrito" className="relative">
            <ShoppingBag size={22} />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-red text-[11px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-brand-gray-200 dark:border-brand-gray-700 px-4 py-3 sm:px-6">
          <SearchBar onSelect={() => setSearchOpen(false)} />
        </div>
      )}

      {menuOpen && (
        <nav className="flex flex-col gap-1 border-t border-brand-gray-200 dark:border-brand-gray-700 px-4 py-3 text-sm font-semibold uppercase md:hidden">
          <Link href="/" onClick={() => setMenuOpen(false)} className="py-2">Inicio</Link>
          <Link href="/categoria/todas" onClick={() => setMenuOpen(false)} className="py-2">Camisetas</Link>
          <Link href="/favoritos" onClick={() => setMenuOpen(false)} className="py-2">Favoritos</Link>
        </nav>
      )}
    </header>
  );
}
