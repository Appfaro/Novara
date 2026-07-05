'use client';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import { CartItem, Coupon } from '@/types';

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (coupon: Coupon | null) => void;
  coupon: Coupon | null;
  subtotal: number;
  discount: number;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);
const STORAGE_KEY = 'mundial-shirts-cart';
const COUPON_KEY = 'mundial-shirts-coupon';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Carga el carrito guardado al iniciar (persistencia en el navegador)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
      const rawCoupon = localStorage.getItem(COUPON_KEY);
      if (rawCoupon) setCoupon(JSON.parse(rawCoupon));
    } catch {
      // localStorage no disponible o datos corruptos: se ignora
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  useEffect(() => {
    if (hydrated) {
      if (coupon) localStorage.setItem(COUPON_KEY, JSON.stringify(coupon));
      else localStorage.removeItem(COUPON_KEY);
    }
  }, [coupon, hydrated]);

  function addItem(newItem: CartItem) {
    setItems((prev) => {
      const existing = prev.find(
        (i) => i.productId === newItem.productId && i.size === newItem.size
      );
      if (existing) {
        return prev.map((i) =>
          i === existing ? { ...i, quantity: i.quantity + newItem.quantity } : i
        );
      }
      return [...prev, newItem];
    });
  }

  function removeItem(productId: string, size: string) {
    setItems((prev) =>
      prev.filter((i) => !(i.productId === productId && i.size === size))
    );
  }

  function updateQuantity(productId: string, size: string, quantity: number) {
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId && i.size === size
          ? { ...i, quantity: Math.max(1, quantity) }
          : i
      )
    );
  }

  function clearCart() {
    setItems([]);
    setCoupon(null);
  }

  function applyCoupon(c: Coupon | null) {
    setCoupon(c);
  }

  const subtotal = useMemo(
    () => items.reduce((acc, i) => acc + i.price * i.quantity, 0),
    [items]
  );

  const discount = useMemo(() => {
    if (!coupon || !coupon.active) return 0;
    return (subtotal * coupon.percentage) / 100;
  }, [coupon, subtotal]);

  const total = Math.max(0, subtotal - discount);
  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        applyCoupon,
        coupon,
        subtotal,
        discount,
        total,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
}
