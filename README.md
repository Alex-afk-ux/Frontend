# Xubasquers · Frontend (Sesión 9)

Frontend de la tienda online **Xubasquers** (chubasqueros y accesorios para peces), desarrollado con **React + Vite** como parte de la práctica *E-commerce* del curso de **Desarrollo Web Full Stack (React, Node, Mongo) 2025-2026**.

En esta sesión se construye la base visual de la aplicación: el proyecto React, la navegación entre páginas y la pantalla de **login** (y registro), conectadas con el backend.

---

## Índice

1. [Objetivos de la sesión](#1-objetivos-de-la-sesión)
2. [Tecnologías](#2-tecnologías)
3. [Estructura del proyecto](#3-estructura-del-proyecto)
4. [Instalación y ejecución](#4-instalación-y-ejecución)
5. [Desarrollo paso a paso](#5-desarrollo-paso-a-paso)
6. [Conexión con el backend](#6-conexión-con-el-backend)
7. [Diseño y estilos](#7-diseño-y-estilos)
8. [Errores encontrados y cómo se resolvieron](#8-errores-encontrados-y-cómo-se-resolvieron)
9. [Capturas](#9-capturas)
10. [Control de versiones](#10-control-de-versiones)

---

## 1. Objetivos de la sesión

| Objetivo | Estado |
|---|---|
| Instalar React con Vite | ✅ |
| Routing (React Router) | ✅ |
| UI básica (navegación + login) | ✅ |

Trabajo previo: tutorial oficial de React [Tic-Tac-Toe](https://es.react.dev/learn/tutorial-tic-tac-toe), validado con el profesor.

---

## 2. Tecnologías

- **React**: librería para construir la interfaz con componentes.
- **Vite**: herramienta de desarrollo moderna y rápida para crear y servir proyectos React.
- **React Router (`react-router-dom`)**: gestión de rutas y navegación sin recargar la página.
- **Bootstrap**: framework CSS para maquetar (navbar, formularios, grid, botones).
- **CSS propio** (`index.css`): personalización visual por encima de Bootstrap.

---

## 3. Estructura del proyecto

El frontend está separado del backend, en una carpeta distinta:

```
/proyecto
├── /backend            # API Node.js + Express + MongoDB
└── /frontend           # Este proyecto (React)
    ├── /public
    ├── /src
    │   ├── /pages
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   └── Register.jsx
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
```

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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
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

---

## 6. Conexión con el backend

El frontend (puerto `5173`) y la API (puerto `3000`) están en orígenes distintos, y el navegador bloquea por defecto esas peticiones (**CORS**). Para evitarlo sin modificar el backend se configura un **proxy en Vite** (`vite.config.js`):

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: { '/api': 'http://localhost:3000' }
  }
})
```

Así, cualquier petición a `/api/...` hecha desde el frontend se redirige a `http://localhost:3000/api/...`.

> Tras modificar `vite.config.js` hay que **reiniciar** `npm run dev`.

Endpoints utilizados:

| Método | Endpoint | Uso |
|---|---|---|
| `POST` | `/api/auth/login` | Iniciar sesión (`email`, `password`) |
| `POST` | `/api/auth/register` | Crear cuenta (`name`, `email`, `password`) |

---

## 7. Diseño y estilos

Se eligió **Bootstrap** (no Tailwind) por su rapidez de uso. Sobre él, `src/index.css` aplica un diseño propio:

- Tema oscuro con fondo en degradado y resplandores animados (temática acuática).
- Barra de navegación translúcida (efecto cristal) con el enlace activo resaltado.
- Tarjeta de login/registro con borde degradado.
- Inputs con efecto de foco y botón con degradado animado.
- Diseño **responsive** (adaptado a móvil).

Se eliminaron los estilos por defecto de la plantilla de Vite (`App.css` y el contenido original de `index.css`), porque centraban todo el contenido y entraban en conflicto con Bootstrap.

---

## 8. Errores encontrados y cómo se resolvieron

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

---

## 9. Capturas

> Sustituye estas rutas por tus capturas (carpeta `docs/` o `screenshots/`).

| Pantalla | Captura |
|---|---|
| Tutorial Tic-Tac-Toe terminado | `![Tic-Tac-Toe](screenshots/tictactoe.png)` |
| Proyecto Vite funcionando | `![Vite](screenshots/vite.png)` |
| Inicio (`/`) | `![Inicio](screenshots/home.png)` |
| Login (`/login`) | `![Login](screenshots/login.png)` |
| Registro (`/register`) | `![Registro](screenshots/register.png)` |
| Error de login (aviso rojo) | `![Error](screenshots/login-error.png)` |

---

## 10. Control de versiones

```bash
git add .
git commit -m "Sesión 9: React + Vite + Router + Login"
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
- Home con los productos principales, conectada a `/api/products`.
- Gestión de la sesión (logout, renovación del token).