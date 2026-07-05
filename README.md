# Novara 🏔️

Tienda online multi-producto (ropa, calzado y accesorios deportivos).
Construida con **Next.js 14 (App Router) + Tailwind CSS + Firebase (Auth,
Firestore, Storage)**. Marca: negro / blanco / dorado, con un pequeño acento
en rojo — "Diseño. Rendimiento. Estilo de vida."

---

## 1. Estructura del proyecto

```
novara/
├── app/                     # Rutas (App Router de Next.js)
│   ├── page.tsx             # Página principal
│   ├── categoria/[slug]/    # Listado por categoría + filtros
│   ├── producto/[id]/       # Ficha de producto (con SEO dinámico)
│   ├── carrito/             # Carrito de compra
│   ├── favoritos/           # Lista de favoritos
│   ├── privacidad/, cookies/# Páginas legales
│   ├── admin/                # Panel de administración (protegido)
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── products/         # CRUD de productos
│   │   └── categories/       # CRUD de categorías
│   ├── sitemap.ts, robots.ts # SEO
│   └── globals.css
├── components/               # Componentes de la tienda (Navbar, ProductCard...)
│   └── admin/                 # Componentes exclusivos del panel de administración
├── context/                  # CartContext (carrito) y AuthContext (sesión admin)
├── hooks/                     # useProducts, useCategories, useFavorites
├── lib/                        # firebase.ts, storageHelpers.ts, utils.ts
├── types/                       # Tipos TypeScript compartidos
├── firestore.rules, storage.rules, firebase.json  # Seguridad Firebase
└── .env.local.example
```

El código está comentado en español en los puntos clave para que cualquier
desarrollador pueda continuar el proyecto fácilmente.

---

## 2. Configurar Firebase (una sola vez)

1. Ve a [console.firebase.google.com](https://console.firebase.google.com) y
   crea un proyecto nuevo.
2. **Authentication** → Sign-in method → activa **Email/contraseña**.
   Luego, en la pestaña "Users", crea manualmente el usuario administrador
   (tu email + contraseña). Ese es el único usuario que podrá entrar en `/admin`.
3. **Firestore Database** → Crear base de datos → modo producción.
4. **Storage** → Comenzar (bucket por defecto).
5. En "Configuración del proyecto" → "Tus apps" → añade una app **Web** y
   copia las credenciales.
6. Copia `.env.local.example` como `.env.local` y pega ahí las credenciales:

   ```bash
   cp .env.local.example .env.local
   ```

7. Despliega las reglas de seguridad (necesitas el [Firebase CLI](https://firebase.google.com/docs/cli)):

   ```bash
   npm install -g firebase-tools
   firebase login
   firebase use --add          # selecciona tu proyecto
   firebase deploy --only firestore:rules,storage
   ```

   Estas reglas garantizan que **solo el administrador autenticado puede
   crear, editar o borrar productos, categorías e imágenes**; cualquier
   visitante solo puede leer.

8. Crea las primeras categorías directamente desde el panel de admin (paso 4
   más abajo) — no hace falta tocar Firestore a mano.

---

## 3. Instalación y arranque en local

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

---

## 4. Usar el panel de administración (sin tocar código)

1. Ve a `/admin/login` (también hay un enlace discreto en el footer).
2. Entra con el email/contraseña que creaste en Firebase Authentication.
3. Desde el menú lateral:
   - **Categorías** → crea, renombra, oculta/muestra, reordena arrastrando
     y elimina categorías. Cada categoría nueva aparece automáticamente como
     una pestaña nueva en la página principal.
     Además, en cada categoría puedes **añadir "campos" personalizados**
     (ej. la categoría "Camisetas" puede tener los campos "País" y "Año del
     Mundial"; una categoría "Calcetines" puede tener "Material" y "Talla").
     El formulario de crear producto mostrará automáticamente esos campos
     según la categoría que elijas — así la tienda no está limitada a
     camisetas de Mundiales, puedes vender cualquier tipo de producto.
   - **Productos** → "Nuevo producto" para crear un artículo: nombre, precio,
     precio de oferta, descripción, tallas y stock por talla, categoría (que
     determina qué campos personalizados rellenar) e imágenes (arrastra y
     suelta, se comprimen solas, puedes marcar la imagen principal o
     borrarlas). El SKU se genera solo.
   - Edita o borra cualquier producto con los iconos de la tabla.

Todo se guarda en tiempo real en Firestore/Storage: los cambios se reflejan
al instante en la tienda pública, sin desplegar nada de nuevo.

---

## 5. Cupones de descuento

Los cupones se gestionan directamente en Firestore, colección `coupons`,
con documentos del tipo:

```json
{ "code": "MUNDIAL10", "percentage": 10, "active": true }
```

(Se puede añadir una pantalla de administración de cupones como siguiente
paso; de momento se crean desde la consola de Firebase.)

---

## 6. Despliegue en Vercel

1. Sube el proyecto a un repositorio de GitHub/GitLab.
2. Entra en [vercel.com](https://vercel.com) → "Add New Project" → importa
   el repositorio.
3. En "Environment Variables", añade **las mismas variables** de tu
   `.env.local` (todas las que empiezan por `NEXT_PUBLIC_`).
4. Deploy. Vercel detecta Next.js automáticamente.
5. Actualiza `NEXT_PUBLIC_SITE_URL` con la URL final para que el SEO
   (sitemap, Open Graph) sea correcto, y vuelve a desplegar.

---

## 7. Notas importantes / próximos pasos sugeridos

- **Pagos**: el botón "Finalizar compra" del carrito abre WhatsApp con el
  resumen del pedido (checkout simple, sin pasarela de pago). Si quieres
  cobrar con tarjeta online, el siguiente paso natural es integrar
  **Stripe Checkout** o **PayPal** — puedo añadirlo cuando lo necesites.
- **Rendimiento**: las imágenes se comprimen a WebP al subirlas y Next.js
  las optimiza automáticamente (`next/image`) con carga diferida (lazy
  loading) en toda la tienda.
- **SEO**: cada producto genera su propio `<title>`, meta descripción y
  Open Graph automáticamente; `sitemap.xml` y `robots.txt` se generan solos
  a partir de los productos reales en Firestore.
- **Modo oscuro**: se activa con el icono de sol/luna del menú superior y se
  recuerda entre visitas.
- Antes de publicar de verdad, sustituye los textos de `/privacidad` y
  `/cookies` por los redactados por un asesor legal.
