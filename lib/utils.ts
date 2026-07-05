import { Product } from '@/types';

/** Genera un slug amigable para URLs (SEO). */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

/** Formatea un número como precio en euros. */
export function formatPrice(value: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);
}

/** Devuelve el precio final aplicando la oferta si existe. */
export function finalPrice(product: Product): number {
  return product.offerPrice && product.offerPrice > 0
    ? product.offerPrice
    : product.price;
}

/** Genera un SKU legible automáticamente: PAIS-AÑO-XXXX */
export function generateSku(country: string, year: number): string {
  const prefix = country.slice(0, 3).toUpperCase();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${year}-${random}`;
}

export function totalStock(product: Product): number {
  return product.sizes.reduce((acc, s) => acc + s.stock, 0);
}
