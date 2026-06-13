<script setup>
// Importamos el nuevo componente modular del carrusel
import WelcomeCarousel from './Carrousel.vue'

// Nota: Ajusta la ruta si tu carpeta de iconos está en otro nivel (ej. '../assets/icons/Logoletras.svg')
import logoLetrasUrl from '@/assets/icons/Logoletras.svg'
</script>

<template>
  <header class="hero-container">

    <div class="welcome-section">
      <div class="logo-wrapper">

        <img
          :src="logoLetrasUrl"
          alt="Kinsfolk Logo"
          class="main-logo"
        />

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

/* Estilos fluidos aplicados ahora a la etiqueta <img> */
.main-logo {
  width: 100%;
  height: auto;
  display: block; /* Elimina espaciados fantasmas inferiores de las imágenes */
}

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
