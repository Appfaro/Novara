'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Shirt, Tags, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

import Logo from '@/components/Logo';

const links = [
  { href: '/admin/dashboard', label: 'Resumen', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Productos', icon: Shirt },
  { href: '/admin/categories', label: 'Categorías', icon: Tags },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();

  return (
    <aside className="flex h-full w-56 flex-col border-r border-brand-gray-200 bg-white p-4 dark:border-brand-gray-700 dark:bg-brand-dark">
      <p className="mb-6 flex items-center gap-2 font-display text-lg uppercase">
        <Logo size={20} />
        Novara
      </p>
      <nav className="flex-1 space-y-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 rounded px-3 py-2 text-sm font-semibold ${
              pathname === href
                ? 'bg-brand-black text-white dark:bg-white dark:text-brand-black'
                : 'text-brand-gray-600 hover:bg-brand-gray-100 dark:text-brand-gray-300 dark:hover:bg-brand-gray-700'
            }`}
          >
            <Icon size={16} /> {label}
          </Link>
        ))}
      </nav>
      <button
        onClick={async () => {
          await logout();
          router.push('/admin/login');
        }}
        className="flex items-center gap-2 rounded px-3 py-2 text-sm font-semibold text-brand-red hover:bg-brand-gray-100 dark:hover:bg-brand-gray-700"
      >
        <LogOut size={16} /> Cerrar sesión
      </button>
    </aside>
  );
}
