<template>
  <HomeView />
</template>

<script setup>
import HomeView from './views/HomeView.vue'
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

/* Estilo opcional para personalizar la barra de desplazamiento (Scrollbar) con tus colores */
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
