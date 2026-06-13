<script setup>
import { ref, onMounted } from 'vue';

// Nota: Si este archivo LoadingScreen está dentro de 'src/components/', la ruta './icons/logo.svg' es la correcta.
import logoUrl from './icons/Logo.svg';

const isVisible = ref(true);

onMounted(() => {
  document.body.style.overflow = 'hidden';

  setTimeout(() => {
    isVisible.value = false;
  }, 1800);
});

const onAfterLeave = () => {
  document.body.style.overflow = '';
};
</script>

<template>
  <Transition name="fade" @after-leave="onAfterLeave">
    <div v-if="isVisible" class="loader-overlay">
      <div class="loader-content">

        <div class="loader-logo-container animate-pulse-slow">
          <img
            :src="logoUrl"
            alt="Logo"
            class="loader-logo"
            style="filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.1));"
          />
        </div>

        <div class="loader-bar animate-fade-in-delayed">
          <div class="loader-bar-progress"></div>
        </div>

      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Contenedor principal de la pantalla de carga */
.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #060f16;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loader-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loader-logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

/* Línea de progreso */
.loader-bar {
  width: 48px;
  height: 2px;
  background-color: rgba(243, 233, 220, 0.1);
  border-radius: 9999px;
  overflow: hidden;
}

.loader-bar-progress {
  height: 100%;
  width: 50%;
  background-color: #ecaf44;
  border-radius: 9999px;
  animation: infinite-loading 1.2s ease-in-out infinite;
}

/* Animaciones de la Transición */
.fade-leave-active {
  transition: opacity 0.5s cubic-bezier(0.25, 1, 0.5, 1);
}
.fade-leave-to {
  opacity: 0;
}

/* Estilos de escalado adaptativo para el nuevo logo */
.loader-logo {
  width: 65%;
  height: auto;
  max-width: 450px;
  transition: max-width 0.3s ease;
  display: block;
}

@media (max-width: 480px) {
  .loader-logo {
    width: 80%;
    max-width: 260px;
  }
}

@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}

@keyframes infinite-loading {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(200%); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.animate-fade-in-delayed {
  opacity: 0;
  animation: fadeIn 0.6s ease-out 0.5s forwards;
}

.animate-pulse-slow {
  animation: pulse 2s ease-in-out infinite;
}
</style>
