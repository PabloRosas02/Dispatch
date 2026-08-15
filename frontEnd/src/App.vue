<script setup lang="ts">
import { useRoute } from 'vue-router'
// Importamos el componente nativo de Vue Router
import { RouterView } from 'vue-router'
// Importamos tu pantalla de carga basada en el logo
import LoadingScreen from './components/miscellaneous/LoadingScreen.vue'
// Importamos la barra de navegación
import Navbar from './components/navegation/AppNavbar.vue'
// Importar el footer
import Footer from './components/navegation/AppFooter.vue'
// Importar el componente ScrollToTop
import ScrollToTop from "./components/navegation/ScrollToTop.vue";

// Inicializamos la ruta activa para verificar sus meta-datos
const route = useRoute()
</script>

<template>
  <LoadingScreen />
  
  <!-- Oculta el Navbar si la ruta activa tiene meta.hideLayout -->
  <Navbar v-if="!route.meta.hideLayout" />
  
  <main class="page-content">
    <RouterView v-slot="{ Component }">
      <KeepAlive include="HomeView">
        <component :is="Component" />
      </KeepAlive>
    </RouterView>
  </main>
  
  <!-- Oculta el Footer si la ruta activa tiene meta.hideLayout -->
  <Footer v-if="!route.meta.hideLayout" />
  <ScrollToTop />
</template>

<style>
html,
body,
#app {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
}

#app {
  display: flex;
  flex-direction: column;
}

.page-content {
  flex: 1;
}

/* Aplicamos box-sizing de forma heredada a todos los elementos del sitio */
*,
*::before,
*::after {
  box-sizing: inherit;
}

/* Estilo para personalizar la barra de desplazamiento (Scrollbar) con tus colores */
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  background: var(--color-primary);
}
::-webkit-scrollbar-thumb {
  background: var(--color-secondary);
  border-radius: 5px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--color-complementary);
}
</style>