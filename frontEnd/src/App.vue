<template>
  <LoadingScreen />
  <RouterView v-slot="{ Component }">
    <KeepAlive include="HomeView">
      <component :is="Component" />
    </KeepAlive>
  </RouterView>
</template>

<script setup>
// Importamos el componente nativo de Vue Router
import { RouterView } from 'vue-router'
// Importamos tu pantalla de carga basada en el logo
import LoadingScreen from './components/LoadingScreen.vue'
</script>

<style>
html,
body,
#app {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100vh;
  background-color: #060f16;
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