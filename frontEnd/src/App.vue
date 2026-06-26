<script setup lang="ts">
// Importamos el componente nativo de Vue Router
import { RouterView } from 'vue-router'
// Importamos tu pantalla de carga basada en el logo
import LoadingScreen from './components/LoadingScreen.vue'
// Importamos la barra de navegación
import Navbar from './components/AppNavbar.vue'
//Importar el footer
import Footer from './components/AppFooter.vue'
</script>

<template>
  <LoadingScreen />
  <Navbar />
  <main class="page-content">
    <RouterView v-slot="{ Component }">
      <KeepAlive include="HomeView">
        <component :is="Component" />
      </KeepAlive>
    </RouterView>
  </main>
  <Footer />
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
