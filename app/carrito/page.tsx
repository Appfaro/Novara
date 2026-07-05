'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/utils';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, discount, total, applyCoupon, coupon } = useCart();
  const [code, setCode] = useState('');
  const [checking, setChecking] = useState(false);

  async function handleApplyCoupon() {
    if (!code.trim()) return;
    setChecking(true);
    try {
      const q = query(collection(db, 'coupons'), where('code', '==', code.trim().toUpperCase()));
      const snap = await getDocs(q);
      if (snap.empty) {
        toast.error('Cupón no válido');
        applyCoupon(null);
      } else {
        const data = snap.docs[0].data();
        if (!data.active) {
          toast.error('Este cupón ya no está activo');
          applyCoupon(null);
        } else {
          applyCoupon({ code: data.code, percentage: data.percentage, active: true });
          toast.success(`Cupón aplicado: -${data.percentage}%`);
        }
      }
    } catch {
      toast.error('No se pudo comprobar el cupón');
    } finally {
      setChecking(false);
    }
  }

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '34600000000';
  const orderSummary = items
    .map((i) => `${i.quantity}x ${i.name} (${i.size}) - ${formatPrice(i.price * i.quantity)}`)
    .join('\n');
  const checkoutMessage = encodeURIComponent(
    `Hola, quiero completar este pedido:\n${orderSummary}\n\nTotal: ${formatPrice(total)}`
  );

  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <h1 className="mb-6 font-display text-3xl uppercase">Tu carrito</h1>

        {items.length === 0 ? (
          <div className="text-center text-brand-gray-500">
            <p>Tu carrito está vacío.</p>
            <Link href="/categoria/todas" className="mt-4 inline-block text-brand-red underline">
              Ver camisetas
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.size}`}
                  className="flex items-center gap-4 border-b border-brand-gray-200 pb-4 dark:border-brand-gray-700"
                >
                  {item.image && (
                    <Image src={item.image} alt={item.name} width={80} height={80} className="h-20 w-20 object-cover" />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-brand-gray-500">Talla: {item.size}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex items-center border border-brand-gray-300 dark:border-brand-gray-600">
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                          className="px-2 py-1"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                          className="px-2 py-1"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId, item.size)}
                        aria-label="Eliminar producto"
                        className="text-brand-gray-400 hover:text-brand-red"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <p className="font-bold">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 flex gap-2">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Código de descuento"
                className="flex-1 border border-brand-gray-300 px-3 py-2 text-sm dark:bg-brand-black dark:border-brand-gray-600"
              />
              <button
                onClick={handleApplyCoupon}
                disabled={checking}
                className="bg-brand-black px-4 text-sm font-bold uppercase text-white dark:bg-white dark:text-brand-black"
              >
                Aplicar
              </button>
            </div>

            <div className="mt-6 space-y-2 border-t border-brand-gray-200 pt-4 text-sm dark:border-brand-gray-700">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-brand-red">
                  <span>Descuento {coupon?.code}</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <a
              href={`https://wa.me/${whatsappNumber}?text=${checkoutMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 block w-full bg-brand-red py-4 text-center text-sm font-bold uppercase tracking-widest2 text-white hover:bg-brand-redDark"
            >
              Finalizar compra
            </a>
          </>
        )}
      </div>
      <Footer />
    </main>
  );
}
