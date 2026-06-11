<script setup>
import { ref, onMounted } from 'vue';

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
          <svg 
            id="Capa_2" 
            data-name="Capa 2" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 462.76 372.35"
            class="loader-logo"
            style="filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.1));"
          >
            <defs>
              <linearGradient id="loader-grad-1" x1="0" y1="265.24" x2="129.41" y2="265.24" gradientUnits="userSpaceOnUse">
                <stop offset="0" stop-color="#edaf44" stop-opacity="0"/>
                <stop offset=".15" stop-color="#edaf44"/>
                <stop offset=".5" stop-color="#edaf44"/>
                <stop offset=".85" stop-color="#edaf44"/>
                <stop offset="1" stop-color="#edaf44" stop-opacity="0"/>
              </linearGradient>
              <linearGradient id="loader-grad-2" x1="281.25" x2="462.76" xlink:href="#loader-grad-1"/>
            </defs>
            <g id="Capa_5" data-name="Capa 5">
              <g>
                <path fill="#edaf44" class="animate-draw-path" d="M286.45,66.62c-48.36,4.09-51.06,7.4-54.4,66.62-3.34-59.22-6.04-62.53-54.4-66.62,48.36-4.09,51.06-7.4,54.4-66.62,3.34,59.22,6.04,62.53,54.4,66.62Z"/>
                <path fill="#edaf44" opacity="0.9" d="M292.72,71.12l-6.91,2.18c66.23,22,114.05,83.45,114.05,155.65,0,5.8-.32,11.52-.9,17.15h4.39c.58-5.63.87-11.35.87-17.15,0-72.07-46.41-133.74-111.5-157.83ZM178.87,73.08l-6.94-2.21c-65.4,23.92-112.13,85.76-112.13,158.08,0,5.8.3,11.52.88,17.15h4.39c-.58-5.63-.9-11.35-.9-17.15,0-72.44,48.13-134.06,114.7-155.87Z"/>
                <path fill="#63a5d9" d="M268.29,81.09c-1.74,1.04-3.42,2.16-5.04,3.35,68.27,14.11,119.62,73.55,119.62,144.51,0,5.8-.34,11.52-1.02,17.15h4.44c.64-5.63.97-11.35.97-17.15,0-71.61-50.8-131.83-118.97-147.86ZM201.82,84.22c-1.65-1.22-3.37-2.33-5.14-3.38-68.63,15.7-119.92,76.16-119.92,148.11,0,5.8.34,11.52.97,17.15h4.44c-.68-5.63-1.02-11.35-1.02-17.15,0-71.32,51.9-131,120.67-144.73Z"/>
                <polygon fill="url(#loader-grad-1)" points="129.41 263.06 128.39 267.43 0 267.43 0 263.06 129.41 263.06"/>
                <polygon fill="url(#loader-grad-2)" points="462.76 263.06 462.76 267.43 282.2 267.43 281.25 263.06 462.76 263.06"/>
                <polygon fill="#93b7ce" points="122.1 294.14 121.09 298.5 30.79 298.5 30.79 294.14 122.1 294.14"/>
                <polygon fill="#93b7ce" points="431.98 294.14 431.98 298.5 288.87 298.5 287.94 294.14 431.98 294.14"/>
                <path fill="#f1e7db" class="animate-fade-in-delayed" d="M296.77,352.49c-8.97-5.28-13.83-17.14-16.08-26.82l-2.11-9.82-14.99-69.75-10.14-47.19,10.02-8.99c11.57-10.03,35.99-29.81,64.52-38.3h-66.3c25.65,7.77,15.41,18.76-14.41,46.01l-41.12,37.27,17.48-69.91c1.8-6.94,5.14-11.57,11.56-13.37h-75.5c5.14,1.8,16.13,6.94,14.59,13.37l-17.42,81.11-14.98,69.75-9.3,43.31c-1.54,6.16-12.46,9.08-18.62,10.88h73.43c-5.4-1.8-6.68-6.68-4.89-13.36l7.8-40.83,13.33-69.75.72-3.75,3.6-3.34c.49,2.36.98,4.72,1.47,7.09,2.98,14.4,5.97,28.8,8.95,43.21,1.84,8.85,3.67,17.69,5.5,26.54.48,2.31.96,4.63,1.44,6.94,2.55,12.31,4.32,28.33,13.91,37.14,6.39,5.88,14.85,9.03,23.36,10.74,14.84,2.99,30.46,1.97,44.78-2.93,8.34-2.85,17.08-8.03,19.15-16.55-2.42,7.94-25.35,3.88-29.75,1.3Z"/>
                <path fill="#63a5d9" d="M105.07,336.33c-1.5.46-2.88,1.09-4.17,1.86-6.06-6.98-11.57-14.46-16.4-22.34h5.14c4.59,7.23,9.76,14.07,15.43,20.48Z"/>
                <path fill="#63a5d9" d="M379.53,315.85c-9.69,16.06-22.36,30.14-37.18,41.53,1.04-2.07,1.76-4.09,2.24-5.94.09-.32.15-.67.23-.99,11.83-9.84,22.04-21.51,30.24-34.6h4.47Z"/>
              </g>
            </g>
          </svg>
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

/* Línea infinity de progreso */
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

/* Animaciones */
.fade-leave-active {
  transition: opacity 0.5s cubic-bezier(0.25, 1, 0.5, 1);
}
.fade-leave-to {
  opacity: 0;
}

.loader-logo {
  /* En móviles, ocupará el 65% del ancho de la pantalla para no verse gigante */
  width: 65%; 
  height: auto; /* Mantiene la proporción perfecta del viewBox */
  max-width: 450px; /* Tamaño máximo para pantallas enormes (Escritorio) */
  transition: max-width 0.3s ease;
}

@media (max-width: 480px) {
  .loader-logo {
    width: 80%;       /* Le damos un poco más de margen en pantallas minúsculas */
    max-width: 260px; /* Evita por completo que desborde el dispositivo */
  }
}

@keyframes drawPath {
  0% { transform: scale(0); opacity: 0; transform-origin: center; }
  100% { transform: scale(1); opacity: 1; transform-origin: center; }
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

.animate-draw-path {
  animation: drawPath 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.animate-fade-in-delayed {
  opacity: 0;
  animation: fadeIn 0.6s ease-out 0.5s forwards;
}

.animate-pulse-slow {
  animation: pulse 2s ease-in-out infinite;
}
</style>