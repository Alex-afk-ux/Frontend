import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Las peticiones a /api/... se reenvían al backend (evita problemas de CORS)
    proxy: { '/api': 'http://localhost:3000' },
  },
});
