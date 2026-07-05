'use client';

import { Facebook, Twitter, Send } from 'lucide-react';

export default function ShareButtons({ title, url }: { title: string; url: string }) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      label: 'Compartir en Facebook',
    },
    {
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      label: 'Compartir en X',
    },
    {
      icon: Send,
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      label: 'Compartir por WhatsApp',
    },
  ];

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-bold uppercase text-brand-gray-500">Compartir:</span>
      {links.map(({ icon: Icon, href, label }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="rounded-full border border-brand-gray-300 p-2 hover:border-brand-gold hover:text-brand-gold dark:border-brand-gray-600"
        >
          <Icon size={16} />
        </a>
      ))}
    </div>
  );
}
