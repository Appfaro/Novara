// Tipos compartidos por toda la aplicación.

export interface ProductImage {
  url: string;
  path: string; // ruta en Firebase Storage (para poder borrarla)
  order: number;
}

export interface SizeStock {
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  country: string;
  worldCupYear: number;
  price: number;
  offerPrice?: number | null; // si existe, es el precio en oferta
  description: string;
  images: ProductImage[];
  sizes: SizeStock[];
  sku: string;
  categoryId: string;
  visible: boolean;
  rating?: number;
  ratingCount?: number;
  createdAt: number; // timestamp epoch ms
  updatedAt: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  order: number;
  visible: boolean;
}

export interface CartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  size: SizeStock['size'];
  quantity: number;
}

export interface Coupon {
  code: string;
  percentage: number; // 0-100
  active: boolean;
}
