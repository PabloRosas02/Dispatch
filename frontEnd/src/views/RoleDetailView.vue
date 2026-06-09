<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import imgLEO from '@/assets/cards/K_LEO.png';
import imgSAMS from '@/assets/cards/K_SAMS.png';
import imgSAFD from '@/assets/cards/K_SAFD.png';
import imgCiviles from '@/assets/cards/K_CIVILES.png';
import imgIlegales from '@/assets/cards/K_ILEGALES.png';
import imgCreator from '@/assets/cards/K_CREATOR.png';

const route = useRoute();
// Captura el :id de la URL de forma reactiva (ejemplo: 'leo', 'sams', etc.)
const id = computed(() => route.params.id);

// Base de datos local indexada por el ID del rol
const rolesData = {
  leo: {
    titulo: 'L.E.O ROL',
    subtitulo: 'LAW ENFORCEMENT & ORDER',
    descripcion: 'Infraestructura avanzada para la gestión, control y automatización de los departamentos de seguridad. Diseñado con paneles tácticos intuitivos que garantizan una respuesta inmediata y optimización del flujo operativo de Kinsfolk.',
    postalImg: imgLEO,
    bgColor: 'linear-gradient(135deg, #1b2d4a 0%, #060F16 100%)', // Azul LEO combinado con tu fondo oscuro
    discordUrl: 'https://discord.gg/YpvBDNRn'
  },
  sams: {
    titulo: 'S.A.M.S ROL',
    subtitulo: 'MEDICAL ASSISTANCE & SERVICES',
    descripcion: 'Ecosistema robusto enfocado en servicios médicos y de asistencia rápida. Permite la clasificación inteligente de registros médicos, control de pacientes en tiempo real y una distribución visual ágil de recursos.',
    postalImg: imgSAMS,
    bgColor: 'linear-gradient(135deg, #591919 0%, #060F16 100%)', // Guinda SAMS combinado con tu fondo oscuro
    discordUrl: 'https://discord.gg/YpvBDNRn'
  },
  safd: {
    titulo: 'S.A.F.D ROL',
    subtitulo: 'FIRE & RESCUE SOLUTIONS',
    descripcion: 'Solución táctica dedicada al cuerpo de bomberos y mitigación de riesgos. Proporciona interfaces adaptativas de mapeo interactivo y flujos de alertas críticas optimizados para situaciones de alta prioridad.',
    postalImg: imgSAFD,
    bgColor: 'linear-gradient(135deg, #824316 0%, #060F16 100%)', // Naranja SAFD combinado con tu fondo oscuro
    discordUrl: 'https://discord.gg/3KQ3JwSw'
  },
  civiles: {
    titulo: 'CIVILES',
    subtitulo: 'CITIZEN ECOSYSTEM & JOBS',
    descripcion: 'El núcleo de la interacción social y económica. Un entorno dinámico donde los usuarios gestionan identidades, empleos civiles, licencias y propiedades bajo una interfaz estilizada y fluida.',
    postalImg: imgCiviles,
    bgColor: 'linear-gradient(135deg, #133a2d 0%, #060F16 100%)', // Verde Civil combinado con tu fondo oscuro
    discordUrl: 'https://discord.gg/KfN8vKhZ7'
  },
  ilegales: {
    titulo: 'ILEGALES',
    subtitulo: 'CRIMINAL ENTERPRISE NETWORKS',
    descripcion: 'Sistemas diseñados con interfaces oscuras y minimalistas para la gestión de redes clandestinas, mercados negros y economías alternativas controladas desde las sombras de la ciudad.',
    postalImg: imgIlegales,
    bgColor: 'linear-gradient(135deg, #2c2d30 0%, #060F16 100%)', // Gris oscuro combinado con tu fondo oscuro
    discordUrl: 'https://discord.gg/BECZxnSWS'
  },
  creator: {
    titulo: 'CREADORES DE CONTENIDO',
    subtitulo: 'MEDIA & STREAMING TOOLS',
    descripcion: 'Espacio dedicado a creadores de contenido y distribución multimedia. Ofrece integración directa de transmisiones, galerías dinámicas y herramientas exclusivas para potenciar la marca Kinsfolk.',
    postalImg: imgCreator,
    bgColor: 'linear-gradient(135deg, #571c75 0%, #060F16 100%)', // Morado Creator combinado con tu fondo oscuro
    discordUrl: 'https://discord.gg/e4GhgKx5s'
  }
};

//Propiedad computada que extrae el rol correspondiente o devuelve null si no existe
const role = computed(() => {
  if (!id.value) return null;
  return rolesData[id.value.toLowerCase()] || null;
});
</script>

<style scoped>
.detail-page {
  width: 100%;
  min-height: 100vh;
  background: var(--bg-gradient, #060F16);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
}

/* Estilo del Botón "Back" */
.back-button {
  position: absolute;
  top: 40px;
  left: 40px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background-color: #f3e9dc; /* --color-light */
  color: #060f16; /* --color-primary */
  border: none;
  padding: 12px 24px;
  border-radius: 30px;
  font-weight: 700;
  text-decoration: none;
  font-size: 0.95rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  transition: all 0.25s ease;
  z-index: 10;
}

.back-button:hover {
  transform: translateX(-4px);
  background-color: #efbc95; /* --color-complementary */
}

/* Contenedor Principal Split */
.content-container {
  display: flex;
  width: 100%;
  max-width: 1200px;
  align-items: center;
  justify-content: space-between;
  gap: 80px;
  z-index: 2;
}

/* --- ESTILOS DE LA POSTAL (IZQUIERDA) --- */
.postal-wrapper {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.postal-card {
  background-color: #ffffff;
  padding: 16px 16px 45px 16px;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6);
  border-radius: 4px;
  transform: rotate(-3.5deg); /* Efecto inclinado Polaroid/Postal */
  transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  max-width: 480px;
  width: 100%;
}

.postal-card:hover {
  transform: rotate(-1deg) scale(1.03);
}

.postal-image {
  width: 100%;
  height: auto;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  display: block;
  border: 1px solid #ededed;
  background-color: #060F16;
}

.postal-footer {
  margin-top: 20px;
  display: flex;
  align-items: center;
}

.postal-brand {
  font-family: 'Impact', 'Arial Black', sans-serif;
  font-size: 1.3rem;
  color: #c4c4c4;
  letter-spacing: 1.5px;
}

/* --- ESTILOS DEL TEXTO (DERECHA) --- */
.info-wrapper {
  flex: 1;
  color: #ffffff;
}

.role-title {
  font-size: 4.2rem;
  font-weight: 900;
  margin: 0;
  line-height: 1;
  color: #ecaf44; /* --color-accent (Oro) */
  text-transform: uppercase;
  letter-spacing: -1px;
}

.role-subtitle {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 12px 0 28px 0;
  color: #63a6da; /* --color-secondary (Azul suave) */
  text-transform: uppercase;
  letter-spacing: 2px;
}

.role-description {
  font-size: 1.1rem;
  line-height: 1.75;
  color: #f3e9dc; /* --color-light */
  margin-bottom: 35px;
  max-width: 540px;
}

/* --- CONTENEDOR DE BOTONES --- */
.action-buttons-group {
  display: flex;
  flex-direction: row;
  align-items: center; /* Alinea los botones de forma idéntica en su eje central */
  gap: 16px;
}

/* --- ESTILO BASE COMPARTIDO PARA BOTONES HOMOLOGADOS --- */
.explore-button,
.discord-button {
  display: inline-flex;
  align-items: center;
  justify-content: center; /* Centra el contenido horizontalmente */
  vertical-align: middle;  /* Resuelve desajustes de línea base */
  gap: 10px;
  
  /* Forzamos dimensiones idénticas */
  height: 50px;
  padding: 0 32px;
  font-size: 0.95rem;
  font-weight: 800;
  font-family: inherit;
  line-height: 1;          /* Forzamos que el texto no empuje el botón hacia abajo */
  
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 4px;
  text-decoration: none;
  box-sizing: border-box;  /* Evita que paddings alteren la altura final */
  cursor: pointer;
  transition: all 0.2s ease;
}

/* Asegurar que los SVGs internos no alteren el flujo */
.explore-button svg,
.discord-button svg {
  display: block;
  flex-shrink: 0;
}

/* Botón Explore */
.explore-button {
  background-color: #ecaf44;
  color: #060f16;
  border: none;
  box-shadow: 0 4px 15px rgba(236, 175, 68, 0.25);
}

.explore-button:hover {
  background-color: #f3e9dc;
  color: #060f16;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(243, 233, 220, 0.35);
}

/* Botón Discord (Blurple adaptado) */
.discord-button {
  background-color: #5865F2;
  color: #ffffff;
  border: none;
  box-shadow: 0 4px 15px rgba(88, 101, 242, 0.25);
}

.discord-button:hover {
  background-color: #4752C4;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(88, 101, 242, 0.45);
}

/* Responsivo para Tablets y Teléfonos */
@media (max-width: 968px) {
  .content-container {
    flex-direction: column;
    text-align: center;
    gap: 40px;
  }
  .role-description {
    margin: 0 auto 30px auto;
  }
  .postal-card {
    transform: rotate(0deg);
    max-width: 380px;
  }
  .back-button {
    position: relative;
    top: 0;
    left: 0;
    margin-bottom: 30px;
  }
  .detail-page {
    flex-direction: column;
    justify-content: flex-start;
    padding: 40px 20px;
  }
  .role-title {
    font-size: 3rem;
  }
  
  /* Ajustes en móvil para que los botones abarquen el ancho completo */
  .action-buttons-group {
    flex-direction: column;
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
  }
  .explore-button,
  .discord-button {
    width: 100%;
  }
}

/* Estilos de la Pantalla de Error (Rol no encontrado) */
.not-found {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #060F16;
  color: #f3e9dc;
  gap: 15px;
}
.error-link {
  color: #63a6da;
  text-decoration: none;
  font-weight: 700;
}
.error-link:hover {
  text-decoration: underline;
}
</style>

<template>
  <main v-if="role" class="detail-page" :style="{ '--bg-gradient': role.bgColor }">
    
    <RouterLink to="/" class="back-button">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
      </svg>
      <span>Back</span>
    </RouterLink>

    <div class="content-container">
      <div class="postal-wrapper">
        <div class="postal-card">
          <img :src="role.postalImg" :alt="role.titulo" class="postal-image" />
          <div class="postal-footer">
            <span class="postal-brand">VISIT KINSFOLK</span>
          </div>
        </div>
      </div>

      <div class="info-wrapper">
        <h1 class="role-title">{{ role.titulo }}</h1>
        <h2 class="role-subtitle">{{ role.subtitulo }}</h2>
        <p class="role-description">{{ role.descripcion }}</p>
        
        <div class="action-buttons-group">
          <button class="explore-button">
            Explora {{ role.titulo }}
          </button>

          <a 
            v-if="role.discordUrl" 
            :href="role.discordUrl" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="discord-button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
              <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.214 12.214 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.12.194-2.194.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.005-.083 6.07 6.07 0 0 0 .248-.195.051.051 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.09.066.174.132.248.195a.051.051 0 0 1-.004.083 9.11 9.11 0 0 1-1.248.595.052.052 0 0 0-.018.011.05.05 0 0 0-.01.059c.237.466.51.908.819 1.329a.05.05 0 0 0 .056.019 13.23 13.23 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-7.726 7.394c-.797 0-1.453-.732-1.453-1.636s.642-1.636 1.453-1.636c.804 0 1.46.738 1.453 1.636 0 .904-.649 1.636-1.453 1.636Zm4.373 0c-.797 0-1.453-.732-1.453-1.636s.642-1.636 1.453-1.636c.804 0 1.46.738 1.453 1.636 0 .904-.649 1.636-1.453 1.636Z"/>
            </svg>
            <span>Unete al Discord</span>
          </a>
        </div>
      </div>
    </div>
  </main>
  
  <main v-else class="not-found">
    <h2>Role not found</h2>
    <p>El rol que buscas no se encuentra registrado en nuestro ecosistema.</p>
    <RouterLink to="/" class="error-link">Return to Home</RouterLink>
  </main>
</template>