import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(async () => {
  // Validamos si el healthcheck de localhost responde correctamente
  const isLocalActive = await fetch('http://localhost:3000/api/')
    .then(res => res.ok)
    .catch(() => false);

  // Definimos el target dinámico según el estado del backend local
  const targetBackend = isLocalActive ? 'http://localhost:3000' : 'http://main-proxy-dev';

  console.log(`API Proxy configurado hacia: ${targetBackend}`);

  return {
    plugins: [
      vue(),
      vueJsx(),
      vueDevTools(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
    server: {
      host: true,
      watch: {
        usePolling: true,
      },
      proxy: {
        '/api': {
          target: targetBackend,
          changeOrigin: true,
          secure: false,
        },
      }
    }
  };
});
