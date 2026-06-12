<script setup>
// Importamos el nuevo componente modular del carrusel
import WelcomeCarousel from './Carrousel.vue'

</script>

<template>
  <header class="hero-container">
    
    <div class="welcome-section">
      <div class="logo-wrapper">
        
        <svg 
          id="Capa_2" 
          data-name="Capa 2" 
          xmlns="http://www.w3.org/2000/svg" 
          xmlns:xlink="http://www.w3.org/1999/xlink" 
          viewBox="0 0 1102.64 387.67"
          class="main-logo"
        >
          <defs>
            <linearGradient id="Degradado_sin_nombre_67" data-name="Degradado sin nombre 67" x1="0" y1="248.17" x2="160.44" y2="248.17" gradientUnits="userSpaceOnUse">
              <stop offset="0" stop-color="#edaf44" stop-opacity="0"/>
              <stop offset=".15" stop-color="#edaf44"/>
              <stop offset=".5" stop-color="#edaf44"/>
              <stop offset=".85" stop-color="#edaf44"/>
              <stop offset="1" stop-color="#edaf44" stop-opacity="0"/>
            </linearGradient>
          </defs>
          <g id="Capa_7" data-name="Capa 7">
            <g>
              <g>
                <path class="cls-1" d="M331.64,351.38c5.4-1.53,8.78-6.13,10.13-11.38l19.35-75.31c1.35-5.25.22-9.63-4.28-11.38,20.25,0,41.18-2.19,52.21-7l-24.08,93.7c-1.58,5.69-.45,9.85,4.28,11.38h-57.61ZM403.21,183.25c15.98,0,24.31,9.41,20.71,23.64-3.83,14.45-16.88,23.86-32.86,23.86s-23.86-9.41-20.03-23.86c3.6-14.23,16.43-23.64,32.18-23.64Z"/>
                <path class="cls-1" d="M475.67,351.38c3.83-1.31,6.75-8.1,7.65-11.38l13.95-54.29c3.15-12.04,4.95-24.08-5.18-24.08-12.38,0-26.11,17.51-32.86,44l-8.78,34.37c-1.58,5.69-.45,9.85,4.28,11.38h-57.61c5.4-1.53,8.78-6.13,10.13-11.38l19.35-75.31c1.35-5.25.22-9.63-4.28-11.38,20.25,0,41.18-2.19,52.21-7l-7.65,29.99c12.38-19.92,30.83-32.18,50.86-32.18,21.38,0,29.71,14.23,23.41,39.19l-14.63,56.7c-.9,3.28-1.58,10.07,1.8,11.38h-52.66Z"/>
                <path class="cls-1" d="M549.93,306.94c.9,21.67,13.73,41.81,37.81,41.81,12.83,0,26.78-5.47,29.26-14.89,5.63-22.33-66.39-20.14-56.71-57.79,6.98-27.58,45.69-31.96,70.67-31.96,11.25,0,25.66.88,36.91,4.6l-5.63,42.03c-.9-20.14-9.68-41.81-33.08-41.81-8.33,0-20.7,2.63-23.63,13.35-6.53,26.27,65.49,21.24,56.49,56.92-7.65,29.12-56.49,34.59-79.22,34.59-9.23,0-27.46-1.09-38.71-4.82l5.85-42.03Z"/>
                <path class="cls-1" d="M680.9,246.3h17.1l3.83-15.11c8.55-33.71,30.83-50.13,60.54-50.13,7.88,0,19.8,1.09,30.16,4.6l-5.63,42.03c-9.45-27.37-13.73-41.81-22.06-41.81-9.23,0-12.6,16.86-18,38.09l-5.63,22.33h30.83l-1.35,4.82h-30.83l-22.73,88.88c-1.12,4.38-.9,10.51,1.8,11.38h-52.89c3.15-.88,6.75-7.01,7.88-11.38l22.73-88.88h-17.1l1.35-4.82Z"/>
                <path class="cls-1" d="M836.41,244.11c46.81,0,65.27,20.58,56.49,54.29-8.55,33.71-37.81,55.39-84.62,55.39s-64.59-21.67-56.04-55.39c8.78-33.71,37.13-54.29,84.17-54.29ZM809.86,348.97c13.73,0,29.03-18.17,37.36-50.57,8.33-32.4,2.03-49.69-11.7-49.69s-29.26,17.29-37.58,49.69c-8.33,32.4-1.8,50.57,11.93,50.57Z"/>
                <path class="cls-1" d="M887.49,351.38c5.4-1.53,8.78-6.13,10.13-11.38l36.01-140.54c1.35-5.47.22-9.85-4.28-11.38,20.25,0,41.41-2.41,52.21-7.01l-40.73,158.93c-1.58,5.69-.45,9.85,4.28,11.38h-57.61Z"/>
                <path class="cls-1" d="M952.75,351.38c5.4-1.53,8.78-6.13,10.13-11.38l36.01-140.54c1.35-5.47.22-9.85-4.28-11.38,20.25,0,41.41-2.41,52.21-7.01l-28.13,109.46,18.91-13.57c22.96-16.86,27.91-27.15,4.05-30.65h60.99c-17.78,3.94-31.06,11.6-48.16,23.86l21.6,64.58c2.25,7,8.55,14.23,16.65,16.64h-37.13c-12.15,0-22.51-5.04-25.66-15.54l-11.7-39.62-1.13.88-11.03,42.91c-1.58,5.69-.45,9.85,4.28,11.38h-57.61Z"/>
              </g>
              <path class="cls-2" d="M390.51,370.54l692.63,1c-.75-1.84-696.1,4.61-692.63-1h0Z"/>
              <g>
                <path class="cls-2" d="M307.39,62.34c-45.25,3.83-47.78,6.93-50.91,62.34-3.12-55.42-5.66-58.52-50.91-62.34,45.25-3.83,47.78-6.93,50.91-62.34,3.12,55.42,5.66,58.52,50.91,62.34Z"/>
                <path class="cls-2" d="M206.74,68.37l-6.51-2.04c-61.21,22.37-104.92,80.23-104.92,147.9,0,5.42.25,10.8.8,16.04h4.11c-.55-5.24-.84-10.62-.84-16.04,0-67.79,45.06-125.43,107.36-145.87ZM313.26,66.55l-6.47,2.04c43.02,14.29,77.75,46.37,94.95,87.28l3.93-1.24c-16.91-40.48-50.51-72.59-92.41-88.08Z"/>
                <path class="cls-6" d="M228.2,78.81c-1.53-1.13-3.16-2.18-4.8-3.16-64.22,14.69-112.23,71.28-112.23,138.59,0,5.42.33,10.8.91,16.04h4.15c-.62-5.24-.95-10.62-.95-16.04,0-66.73,48.55-122.59,112.92-135.43ZM290.42,75.86c-1.64.98-3.24,2.04-4.73,3.13,45.6,9.46,83.13,40.48,100.88,81.64l3.93-1.24c-17.67-41.39-54.77-72.88-100.08-83.53Z"/>
                <polygon class="cls-3" points="160.44 246.16 159.17 250.18 0 250.18 0 246.16 160.44 246.16"/>
                <polygon class="cls-5" points="153.6 275.24 152.65 279.33 68.16 279.33 68.16 275.24 153.6 275.24"/>
                <polygon class="cls-5" points="153.6 275.24 152.65 279.33 68.16 279.33 68.16 275.24 153.6 275.24"/>
                <path class="cls-4" d="M123.23,295.56h-4.81c4.52,7.38,9.67,14.37,15.35,20.91,1.2-.73,2.5-1.32,3.9-1.75-5.31-5.99-10.15-12.4-14.44-19.16Z"/>
              </g>
              <path class="cls-1" d="M143.62,350.57c6.05-1.76,16.76-4.63,18.27-10.68l40.9-173.81c1.51-6.3-9.27-11.35-14.31-13.11h74.06c-6.3,1.76-9.58,6.3-11.35,13.11l-17.14,68.58,40.34-36.56c29.24-26.72,39.29-37.51,14.14-45.13h65.03c-27.99,8.32-51.94,27.73-63.28,37.56l-9.83,8.82,26.72,124.34c2.2,9.49,14.25,39.31,23.04,44.49,4.37,2.57,27.45,6.63,29.28-1.61-1.89,8.56-10.59,13.74-18.88,16.58-14.05,4.8-29.37,5.81-43.92,2.87-8.35-1.68-16.65-4.77-22.92-10.53-9.4-8.64-18.41-42.54-20.91-54.62-2.27-10.95-4.54-21.9-6.81-32.84-3.41-16.45-6.82-32.89-10.23-49.34l-3.53,3.28-21.43,95.49c-1.76,6.55-.5,11.35,4.79,13.11h-72.03Z"/>
            </g>
          </g>
        </svg>

      </div>
      <h1 class="welcome-title">Bienvenido a <span class="highlight-text">Kinsfolk</span></h1>
      <p class="welcome-subtitle">
        Explora nuestros proyectos y soluciones de diseño exclusivos integrados en nuestro
        ecosistema.
      </p>
    </div>

    <WelcomeCarousel />

    <div class="discord-section">
      <a
        href="https://discord.gg/a6TSrUpwr"
        target="_blank"
        rel="noopener noreferrer"
        class="discord-button"
      >
        <svg class="discord-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.14 96.36">
          <path
            fill="currentColor"
            d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a74.37,74.37,0,0,0,6.71-11A68.52,68.52,0,0,1,28,80.48c1-.76,2-1.56,3-2.37a75,75,0,0,0,65.2,0c1,.81,2,1.61,3,2.37a68.52,68.52,0,0,1-10.74,4.85,74.37,74.37,0,0,0,6.71,11,105.73,105.73,0,0,0,31-18.83C129.87,49.85,123.65,27,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z"
          />
        </svg>
        <span>Únete</span>
      </a>
    </div>
  </header>
</template>

<style scoped>
/* Contenedor estructural global */
.hero-container {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 40px 20px;
  box-sizing: border-box;
}

/* Estilos de la Bienvenida */
.welcome-section {
  text-align: center;
  max-width: 800px;
  margin-bottom: 20px;
}

.logo-wrapper {
  width: 100%;
  max-width: 450px; /* Mantiene el tamaño horizontal ideal en desktop */
  margin: 0 auto 24px auto;
}

/* El CSS se aplica de forma fluida a la etiqueta <svg> gracias a la clase */
.main-logo {
  width: 100%;
  height: auto;
}

:deep(.cls-1) { fill: #f1e7db; }
:deep(.cls-2) { fill: #edaf44; }
:deep(.cls-3) { fill: url(#Degradado_sin_nombre_67); }
:deep(.cls-4) { fill: #64a6dd; }
:deep(.cls-5) { fill: #93b7ce; }
:deep(.cls-6) { fill: #63a5d9; }

.welcome-title {
  color: var(--color-light);
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 12px 0;
  letter-spacing: -0.5px;
}

.highlight-text {
  color: var(--color-accent);
}

.welcome-subtitle {
  color: var(--color-secondary);
  font-size: 1.9rem;
  font-weight: 500;
  line-height: 1.6;
  max-width: 600px;
  margin: 16px auto 0 auto;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

/* Estilos de la sección Discord */
.discord-section {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  width: 100%;
}

.discord-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background-color: transparent;
  color: var(--color-accent);
  border: 2px solid var(--color-accent);
  padding: 12px 36px;
  font-size: 1.2rem;
  font-weight: 600;
  text-decoration: none;
  border-radius: 30px;
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(236, 175, 68, 0.1);
}

.discord-button:hover {
  background-color: var(--color-accent);
  color: var(--color-primary);
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(236, 175, 68, 0.3);
}

.discord-button:active {
  transform: translateY(-1px);
}

.discord-icon {
  width: 24px;
  height: auto;
  display: block;
}
</style>