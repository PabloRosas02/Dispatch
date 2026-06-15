<script setup>
// Importamos el componente usando el alias @ que apunta directamente a src/
import Welcome from '@/components/Welcome.vue'
</script>

<template>
  <main class="home-view">
    <Welcome />
  </main>
</template>

<style scoped>
.home-view {
  width: 100%;
  min-height: 100vh;
  background-color: #060f16; /* Mantiene la consistencia del color de fondo */
}
</style>
