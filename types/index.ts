// Tipos compartidos por toda la aplicación.

export interface ProductImage {
  url: string;
  path: string;
  order: number;
}

export interface SizeStock {
  size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  offerPrice?: number | null;
  description: string;
  images: ProductImage[];
  sizes: SizeStock[];
  sku: string;
  categoryId: string;
  attributes: Record<string, string>;
  visible: boolean;
  order: number;
  rating?: number;
  ratingCount?: number;
  createdAt: number;
  updatedAt: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  order: number;
  visible: boolean;
  attributes: string[];
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
  percentage: number;
  active: boolean;
}