<script setup>
// Importamos el componente nativo de Vue Router
import { RouterView } from 'vue-router'
// Importamos tu pantalla de carga basada en el logo
import LoadingScreen from './components/LoadingScreen.vue'
// Importamos la barra de navegación
import Navbar from './components/Navbar.vue'
//Importar el footer
import Footer from './components/Footer.vue'
</script>

<template>
  <LoadingScreen />
  <Navbar />
  <RouterView v-slot="{ Component }">
    <KeepAlive include="HomeView">
      <component :is="Component" />
    </KeepAlive>
  </RouterView>
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
  background: #060f16;
}
::-webkit-scrollbar-thumb {
  background: #63a6da;
  border-radius: 5px;
}
::-webkit-scrollbar-thumb:hover {
  background: #ecaf44;
}
</style>