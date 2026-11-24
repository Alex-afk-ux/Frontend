# Xubasquers · Frontend (Sesiones 9 y 10)

Frontend de la tienda online **Xubasquers** (chubasqueros y accesorios para peces), desarrollado con **React + Vite** como parte de la práctica *E-commerce* del curso de **Desarrollo Web Full Stack (React, Node, Mongo) 2025-2026**.

En la **sesión 9** se construye la base visual de la aplicación: el proyecto React, la navegación entre páginas y la pantalla de **login** (y registro), conectadas con el backend.

En la **sesión 10** se trabaja el diseño gráfico: una **página principal** con catálogo de productos cargado desde la API, una **animación de salpicadura de agua** al pasar el ratón por un producto, **ilustraciones propias** para cada artículo y una **página de detalle** de cada producto.

---

## Índice

1. [Objetivos de la sesión](#1-objetivos-de-la-sesión)
2. [Tecnologías](#2-tecnologías)
3. [Estructura del proyecto](#3-estructura-del-proyecto)
4. [Instalación y ejecución](#4-instalación-y-ejecución)
5. [Desarrollo paso a paso](#5-desarrollo-paso-a-paso)
6. [Conexión con el backend](#6-conexión-con-el-backend)
7. [Diseño y estilos](#7-diseño-y-estilos)
8. [Página principal y catálogo de productos](#8-página-principal-y-catálogo-de-productos)
9. [Animación de salpicadura (splash)](#9-animación-de-salpicadura-splash)
10. [Página de detalle del producto](#10-página-de-detalle-del-producto)
11. [Errores encontrados y cómo se resolvieron](#11-errores-encontrados-y-cómo-se-resolvieron)
12. [Capturas](#12-capturas)
13. [Control de versiones](#13-control-de-versiones)

---

## 1. Objetivos de la sesión

| Objetivo | Sesión | Estado |
|---|---|---|
| Instalar React con Vite | 9 | ✅ |
| Routing (React Router) | 9 | ✅ |
| UI básica (navegación + login) | 9 | ✅ |
| Login y registro funcionando contra el backend | 10 | ✅ |
| UI de Login, Register y **página principal** con diseño trabajado | 10 | ✅ |
| Catálogo de productos cargado desde `/api/products` | 10 | ✅ |
| Animación de salpicadura de agua al pasar el ratón | 10 | ✅ |
| Página específica de cada producto (`/producto/:id`) | 10 | ✅ |

Trabajo previo: tutorial oficial de React [Tic-Tac-Toe](https://es.react.dev/learn/tutorial-tic-tac-toe), validado con el profesor.

---

## 2. Tecnologías

- **React**: librería para construir la interfaz con componentes.
- **Vite**: herramienta de desarrollo moderna y rápida para crear y servir proyectos React.
- **React Router (`react-router-dom`)**: gestión de rutas y navegación sin recargar la página.
- **Bootstrap**: framework CSS para maquetar (navbar, formularios, grid, botones).
- **CSS propio** (`index.css`): personalización visual por encima de Bootstrap, incluidas las tarjetas de producto y la animación de salpicadura (solo CSS, sin librerías de animación).
- **Ilustraciones SVG propias**: una por producto, guardadas en `public/products/`.

---

## 3. Estructura del proyecto

El frontend está separado del backend, en una carpeta distinta:

```
/proyecto
├── /backend            # API Node.js + Express + MongoDB
└── /frontend           # Este proyecto (React)
    ├── /public
    │   └── /products           # 10 ilustraciones SVG (una por producto)
    ├── /src
    │   ├── /components
    │   │   ├── ProductList.jsx # Catálogo: carga la API, filtros y rejilla
    │   │   ├── ProductCard.jsx # Tarjeta de producto (enlace + splash)
    │   │   └── Splash.jsx      # Gotas y ondas de la animación
    │   ├── /lib
    │   │   └── products.js     # Utilidades: precio, stock, colores, imagen
    │   ├── /pages
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   └── ProductDetail.jsx   # Página de un producto
    │   ├── App.jsx         # Layout: navbar + <Outlet />
    │   ├── main.jsx        # Punto de entrada + configuración del router
    │   └── index.css       # Estilos globales
    ├── index.html
    ├── vite.config.js      # Incluye el proxy hacia el backend
    └── package.json
```

---

## 4. Instalación y ejecución

Requisitos: **Node.js** (versión LTS) y el **backend** arrancado en `http://localhost:3000`.

```bash
# 1. Entrar en la carpeta del frontend
cd frontend

# 2. Instalar dependencias
npm install

# 3. Arrancar en modo desarrollo
npm run dev
```

La aplicación queda disponible en **http://localhost:5173/**.

Para parar el servidor: `Ctrl + C`.

### Arrancar el backend (necesario para el login)

```bash
cd backend/Docker && docker compose up -d   # MongoDB
cd ../api && npm install && npm run dev     # API en el puerto 3000
npm run seed                                # carga los productos de la tienda (ver abajo)
```

> Sin ejecutar `npm run seed` la base de datos está vacía y el catálogo mostrará «Todavía no hay productos». Con `npm run setup` (en `backend/api`) se levanta MongoDB y se cargan los datos en un solo paso.

---

## 5. Desarrollo paso a paso

### 5.1 Crear el proyecto con Vite

```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install
npm run dev
```

Se comprobó en el navegador que `http://localhost:5173/` muestra la pantalla base de Vite + React.

### 5.2 Instalar las dependencias

```bash
npm install react-router-dom bootstrap
```

- `react-router-dom` permite crear varias páginas y navegar entre ellas.
- `bootstrap` aporta los estilos base de la interfaz.

### 5.3 Crear las páginas

En `src/pages/` se crean tres páginas:

| Archivo | Ruta | Contenido |
|---|---|---|
| `Home.jsx` | `/` | Página de inicio |
| `Login.jsx` | `/login` | Formulario de inicio de sesión |
| `Register.jsx` | `/register` | Formulario de registro |

### 5.4 Layout con navegación (`App.jsx`)

`App.jsx` actúa como **layout común**: contiene la barra de navegación (`NavLink`, que marca como activo el enlace de la página actual) y un `<Outlet />`, el hueco donde React Router pinta la página hija según la ruta.

```jsx
import { NavLink, Outlet } from 'react-router-dom'

export default function App() {
  return (
    <>
      <nav className="navbar navbar-expand navbar-dark bg-dark px-3">
        <NavLink className="navbar-brand" to="/">Xubasquers</NavLink>
        <div className="navbar-nav ms-auto">
          <NavLink className="nav-link" to="/">Inicio</NavLink>
          <NavLink className="nav-link" to="/login">Login</NavLink>
          <NavLink className="nav-link" to="/register">Registro</NavLink>
        </div>
      </nav>
      <main className="container py-5">
        <Outlet />
      </main>
    </>
  )
}
```

### 5.5 Configurar React Router (`main.jsx`)

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import ProductDetail from './pages/ProductDetail.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="producto/:id" element={<ProductDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
```

Notas:
- La ruta padre `/` carga `App` (layout) y las rutas hijas se muestran dentro de su `<Outlet />`.
- `index` indica la página por defecto de `/`.
- El CSS de Bootstrap se importa **antes** que `index.css`, para que los estilos propios puedan sobrescribirlo.

### 5.6 Formulario de login

`Login.jsx` usa **estado de React** (`useState`) para controlar los campos de email y contraseña, y al enviar el formulario hace una petición `POST` a la API:

1. Se evita el envío por defecto del formulario (`e.preventDefault()`).
2. Se envía `{ email, password }` a `/api/auth/login`.
3. Si la respuesta es correcta, se guardan los tokens (`accessToken` y `refreshToken`) en `localStorage` y se redirige a `/` con `useNavigate`.
4. Si falla, se muestra un aviso rojo con el mensaje de error.

`Register.jsx` funciona igual, con un campo extra de **nombre**, contra `/api/auth/register`.

Gestión de errores (sesión 10):
- La API devuelve los errores como `{ success: false, error: { code, message, details } }`, así que el frontend lee `json.error?.message` (y no `json.message`).
- En el registro se muestran también los campos que fallan (`error.details`), por ejemplo «Contraseña: …».
- El backend exige una contraseña de **mínimo 12 caracteres**; el campo del formulario lo indica y el navegador valida `minLength={12}` antes de enviar.

---

## 6. Conexión con el backend

El frontend (puerto `5173`) y la API (puerto `3000`) están en orígenes distintos, y el navegador bloquea por defecto esas peticiones (**CORS**). Para evitarlo sin modificar el backend se configura un **proxy en Vite** (`vite.config.js`):

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: { '/api': 'http://localhost:3000' }
  }
})
```

Así, cualquier petición a `/api/...` hecha desde el frontend se redirige a `http://localhost:3000/api/...`.

> Tras modificar `vite.config.js` hay que **reiniciar** `npm run dev`.
>
> El plugin `tailwindcss` está instalado pero **no se usa** (el diseño es Bootstrap + CSS propio). Al sustituir este archivo hay que conservar siempre el bloque `server.proxy`: sin él, ni el login ni el catálogo llegan al backend. El backend también tiene `cors` activado para `http://localhost:5173` como respaldo.

Endpoints utilizados:

| Método | Endpoint | Uso |
|---|---|---|
| `POST` | `/api/auth/login` | Iniciar sesión (`email`, `password`) |
| `POST` | `/api/auth/register` | Crear cuenta (`name`, `email`, `password`) |
| `GET` | `/api/products` | Listar los productos (con la categoría incluida) para el catálogo |
| `GET` | `/api/products/:id` | Obtener un producto para su página de detalle |

---

## 7. Diseño y estilos

Se eligió **Bootstrap** (no Tailwind) por su rapidez de uso. Sobre él, `src/index.css` aplica un diseño propio:

- Tema oscuro con fondo en degradado y resplandores animados (temática acuática).
- Barra de navegación translúcida (efecto cristal) con el enlace activo resaltado.
- Tarjeta de login/registro con borde degradado.
- Inputs con efecto de foco y botón con degradado animado.
- Tarjetas de producto con efecto cristal, un **color propio por categoría** (variable CSS `--hue`), etiquetas y estados de stock.
- Botones de filtro («chips»), pantallas de carga con efecto *shimmer* y estados de error y vacío.
- Diseño **responsive** (adaptado a móvil): la rejilla de productos usa `grid-template-columns: repeat(auto-fill, minmax(260px, 1fr))`.
- Respeta `prefers-reduced-motion`: si el usuario ha reducido el movimiento en su sistema, se desactivan las animaciones y el splash.

Se eliminaron los estilos por defecto de la plantilla de Vite (`App.css` y el contenido original de `index.css`), porque centraban todo el contenido y entraban en conflicto con Bootstrap.

---

## 8. Página principal y catálogo de productos

La página principal (`Home.jsx`) tiene un *hero* con título, un botón **Ver catálogo** (ancla `#catalogo`) y un acceso al login, seguido del catálogo (`ProductList`).

| Archivo | Qué hace |
|---|---|
| `components/ProductList.jsx` | Pide `GET /api/products`, muestra los estados *cargando / error / vacío*, genera los **filtros por categoría** a partir de los productos recibidos y pinta la rejilla |
| `components/ProductCard.jsx` | Una tarjeta: imagen, categoría, nombre, descripción, etiquetas (especie, talla, color con muestra), precio y stock. Toda la tarjeta es un enlace a `/producto/:id` |
| `lib/products.js` | Funciones compartidas: formato de precio en euros, texto del stock, color de cada categoría, tabla de colores y búsqueda de la imagen |

Carga de datos (resumen de `ProductList.jsx`):

```jsx
useEffect(() => {
  const controller = new AbortController()
  fetch('/api/products', { signal: controller.signal })
    .then((res) => { if (!res.ok) throw new Error('bad response'); return res.json() })
    .then((json) => { setProducts(json.data); setStatus('ok') })
    .catch((err) => { if (err.name !== 'AbortError') setStatus('error') })
  return () => controller.abort()   // cancela la petición si el componente se desmonta
}, [])
```

Datos que se muestran:

| Dato | Origen |
|---|---|
| Nombre, descripción, precio | `name`, `description`, `price` |
| Especie, talla, color | `targetSpecies`, `size`, `color` (el color pinta además una muestra circular) |
| Categoría | `category.name` (la API la devuelve poblada) |
| Stock | `stock`: *En stock* (más de 10), *Últimas N unidades* (1 a 10) y *Agotado* (0, con el precio tachado) |

### Imágenes de producto

Cada producto tiene una **ilustración SVG propia** (un pez que lleva el artículo), guardada en `public/products/`. Vite sirve esa carpeta en la raíz, así que `public/products/sombrero-paja.svg` se ve en `http://localhost:5173/products/sombrero-paja.svg`.

- El backend guarda solo la **ruta** en el campo `image` (por ejemplo `/products/sombrero-paja.svg`).
- Si el producto no trae `image`, `lib/products.js` la deduce por el nombre del producto.
- Si la imagen no carga (`onError`), la tarjeta muestra un emoji según la categoría (🧥 🥾 ☂️ 👒 🤿). Así nunca queda un hueco vacío.
- Los SVG llevan `width`/`height` y la zona de imagen mide 220 px con `object-fit: contain`, de modo que se ven completos sin deformarse.

| Producto | Archivo |
|---|---|
| Chubasquero clásico amarillo | `chubasquero-clasico-amarillo.svg` |
| Chubasquero transparente plegable | `chubasquero-transparente.svg` |
| Botas de agua para peces | `botas-de-agua-para-peces.svg` |
| Botas con suela antideslizante | `botas-suela-antideslizante.svg` |
| Paraguas automático | `paraguas-automatico.svg` |
| Mini paraguas de colores | `mini-paraguas-colores.svg` |
| Sombrero de pescador impermeable | `sombrero-pescador.svg` |
| Sombrero de paja de verano | `sombrero-paja.svg` |
| Gafas de buceo clásicas | `gafas-buceo-clasicas.svg` |
| Gafas de buceo panorámicas | `gafas-buceo-panoramicas.svg` |

---

## 9. Animación de salpicadura (splash)

Al pasar el ratón por un producto salta una **salpicadura de agua**: 14 gotas con forma de lágrima que suben y caen, y dos ondas que se expanden por el agua. Está hecha solo con **CSS** (sin librerías de animación).

- `Splash.jsx` dibuja los elementos (`<span className="drop">` y `<span className="ripple">`) dentro de la zona de imagen. Cada gota recibe sus valores por variables CSS: `--x` (desplazamiento horizontal), `--up` (altura del salto) y `--fall` (dónde acaba).
- La animación se dispara con `:hover` y empieza de nuevo cada vez que el ratón vuelve a entrar:

```css
.product-card:hover .splash .drop { animation: drop 0.9s cubic-bezier(0.2, 0.7, 0.3, 1) both; }
.product-card:hover .splash .ripple { animation: ripple 1s ease-out both; }

@keyframes drop {
  0%   { transform: translate(-50%, 0) scale(0.2); opacity: 0; }
  52%  { transform: translate(calc(-50% + var(--x) * 0.65), var(--up)) scale(1); opacity: 1; }
  100% { transform: translate(calc(-50% + var(--x)), var(--fall)) scale(0.7); opacity: 0; }
}
```

- Los valores de cada gota se calculan con una fórmula fija (no con `Math.random()`), para que el resultado sea siempre el mismo y React no tenga que repintar nada.
- El contenedor tiene `pointer-events: none` y `aria-hidden`, de modo que no estorba al clic ni a los lectores de pantalla.
- Con `prefers-reduced-motion: reduce` el splash se oculta.
- También funciona en la imagen grande de la página de detalle.

---

## 10. Página de detalle del producto

Al hacer clic en una tarjeta se abre **`/producto/:id`** (`pages/ProductDetail.jsx`), que pide `GET /api/products/:id`.

Contenido: enlace «← Volver al catálogo», ilustración grande (con splash), categoría, nombre, descripción, ficha (especie, talla, color, disponibilidad), precio, botón **Añadir al carrito** (desactivado: el carrito aún no existe) y un bloque **«Más de [categoría]»** con otros productos de la misma categoría.

| Situación | Qué se muestra |
|---|---|
| Cargando | «Cargando producto…» |
| Respuesta 404 o 400 (id inexistente o con formato inválido) | «Producto no encontrado 🐟» y botón para volver |
| Otro error (por ejemplo, backend apagado) | «No se ha podido cargar el producto» |
| Correcto | La ficha completa y los productos relacionados |

Detalles de implementación:
- `useParams()` lee el `id` de la URL.
- El componente exportado envuelve a `ProductDetailView` con `key={id}`: así, al pulsar un producto relacionado, el estado se reinicia sin tener que hacer `setState` dentro de un `useEffect`.
- Al entrar se hace `window.scrollTo(0, 0)`, y las peticiones se cancelan con `AbortController` si el usuario se va antes de que terminen.
- Recargar la página (`F5`) en una URL de producto funciona, porque Vite redirige cualquier ruta al `index.html` y React Router resuelve la ruta.

---

## 11. Errores encontrados y cómo se resolvieron

| Problema | Causa | Solución |
|---|---|---|
| `Missing script: "dev"` | Se ejecutó `npm run dev` fuera de la carpeta del proyecto | Entrar con `cd frontend` y ejecutarlo ahí |
| Paquetes instalados en la carpeta equivocada | `npm install` lanzado en la carpeta superior | Borrar `node_modules`, `package.json` y `package-lock.json` sobrantes e instalar dentro de `frontend` |
| El ejemplo del enunciado no compilaba | `react-dom/cliente` (debe ser `react-dom/client`) y faltaba `/>` en la ruta `register` | Corregidos en `main.jsx` |
| `main.jsx` "se crea" según el enunciado | Vite ya lo genera | Se edita el existente |
| No se veía nada tras configurar rutas | Faltaba `<Outlet />` en `App.jsx` | Añadido el `<Outlet />` |
| Estilos propios no se aplicaban | Faltaba `import './index.css'` en `main.jsx` | Añadido tras el import de Bootstrap |
| Peticiones bloqueadas al backend | CORS (distintos puertos) | Proxy de Vite hacia `localhost:3000` |
| `npx tailwindcss init` no funciona | Cambios de Tailwind v4 | Se usa Bootstrap |
| `git push` rechazado | El remoto tenía commits que no estaban en local | `git pull --rebase origin main` y después `git push` |
| Backend: `Cannot access 'app' before initialization` | `app.use(cors(...))` estaba escrito antes de `const app = express()` | Mover la línea de `cors` después de crear `app` y antes de las rutas |
| Login y catálogo dejaron de llegar al backend | Al sustituir `vite.config.js` se perdió el bloque `server.proxy` | Restaurar el proxy y reiniciar `npm run dev` |
| Registro: «Les dades no són vàlides» | La contraseña tenía 8 caracteres y el backend exige mínimo 12 | `minLength={12}`, pista visible bajo el campo y mostrar `error.details` |
| Mensajes de error genéricos en login y registro | El frontend leía `json.message`, pero la API responde `json.error.message` | Leer `json.error?.message` |
| Los productos salen con emoji en vez de imagen | `seed.js` o `Product.js` antiguos (sin `image`), o la carpeta `public/products` mal colocada | Actualizar modelo y seed, ejecutar `npm run seed` y comprobar `http://localhost:5173/products/sombrero-paja.svg` |
| Las imágenes se salían de la tarjeta | `height: 100%` dentro de un `grid` sin altura definida | Zona de imagen de altura fija, con `flex`, `max-width/max-height: 100%` y `width/height` en los SVG |
| Aviso de lint `set-state-in-effect` en la página de producto | `setState` síncrono dentro de `useEffect` al cambiar de producto | Componente interno con `key={id}` para reiniciar el estado |

---

## 12. Capturas

> Sustituye estas rutas por tus capturas (carpeta `docs/` o `screenshots/`).

| Pantalla | Captura |
|---|---|
| Tutorial Tic-Tac-Toe terminado | `![Tic-Tac-Toe](screenshots/tictactoe.png)` |
| Proyecto Vite funcionando | `![Vite](screenshots/vite.png)` |
| Inicio (`/`) | `![Inicio](screenshots/home.png)` |
| Login (`/login`) | `![Login](screenshots/login.png)` |
| Registro (`/register`) | `![Registro](screenshots/register.png)` |
| Error de login (aviso rojo) | `![Error](screenshots/login-error.png)` |
| Error de registro (contraseña corta) | `![Error registro](screenshots/register-error.png)` |
| Página principal con el catálogo | `![Catálogo](screenshots/catalogo.png)` |
| Filtro por categoría | `![Filtros](screenshots/filtros.png)` |
| Splash al pasar el ratón | `![Splash](screenshots/splash.png)` |
| Página de un producto | `![Detalle](screenshots/detalle.png)` |
| Producto no encontrado | `![No encontrado](screenshots/no-encontrado.png)` |
| Productos en MongoDB Compass | `![Mongo](screenshots/mongo-productos.png)` |

---

## 13. Control de versiones

```bash
git add .
git commit -m "Sesión 10: catálogo de productos, splash de agua y página de producto"
git pull --rebase origin main
git push
```

`.gitignore` recomendado (Vite ya lo incluye):

```
node_modules/
dist/
.env
```

Repositorio: https://github.com/Alex-afk-ux/Frontend

---

## Próximos pasos

- Rutas protegidas (acceso solo con sesión iniciada).
- Gestión de la sesión: que la barra de navegación muestre el usuario, **logout** y renovación automática del token (`/api/auth/refresh`).
- Carrito de la compra (el botón «Añadir al carrito» ya está en la página de producto, pero desactivado).
- Búsqueda y ordenación del catálogo.