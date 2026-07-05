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
  price: number;
  offerPrice?: number | null; // si existe, es el precio en oferta
  description: string;
  images: ProductImage[];
  sizes: SizeStock[];
  sku: string;
  categoryId: string;
  // Pares clave-valor con los atributos definidos por la categoría del producto
  // (ej. { "País": "Brasil", "Año del Mundial": "2002" } o { "Material": "Algodón" }).
  attributes: Record<string, string>;
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
  // Nombres de los campos personalizados que tendrán los productos de esta
  // categoría (ej. ["País", "Año del Mundial"] o ["Material", "Talla"]).
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
  percentage: number; // 0-100
  active: boolean;
}
