<script setup lang='ts'>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import NotFound from '@/components/NotFound.vue';
import type * as ServerType from '../types/serverTypes.ts';
import { useServerService } from '@/services/serverService.ts';

const route = useRoute();
const role = ref<ServerType.RPServer | undefined>(undefined);
const { getServerFromRouteParam, getSvgUrl } = useServerService();

const bLoading = ref<boolean>(true);

/*FUNCIÓN DINÁMICA DE VITE
   Asumiendo que este archivo de vista está en 'src/views/', usamos '../components/icons/'
   para llegar a tus SVGs. Si está en 'src/components/', cámbialo a './icons/' */

// Propiedad computada que extrae el rol correspondiente o devuelve null si no existe
onMounted(() => {
  role.value = getServerFromRouteParam(route.params.serverId as string);
  bLoading.value =false;
});
</script>

<template>
  <main v-if="role" class="detail-page" :style="{ '--bg-gradient': role.color }">

    <RouterLink to="/" class="back-button">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
      </svg>
      <span>Back</span>
    </RouterLink>

    <div class="content-container">
      <div class="postal-wrapper">
        <div class="postal-card">
          <img :src="getSvgUrl(role.id)" :alt="role.title" class="postal-image" />
          <div class="postal-footer">
            <span class="postal-brand">VISIT KINSFOLK</span>
          </div>
        </div>
      </div>

      <div class="info-wrapper">
        <h1 class="role-title">{{ role.title }}</h1>
        <h2 class="role-subtitle">{{ role.subtitle }}</h2>
        <p class="role-description">{{ role.description }}</p>

        <div class="action-buttons-group">
          <button class="explore-button">
            Explora {{ role.title }}
          </button>

          <a
            v-if="role.discordLink"
            :href="role.discordLink"
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

  <NotFound v-else
    title="Role not found"
    description="El rol que buscas no se encuentra registrado en nuestro ecosistema."
  >
  </NotFound>
</template>

<style scoped>
.detail-page {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--bg-gradient) 0%, var(--color-background) 100%), var(--color-background);
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
  background-color: var(--color-light);
  color: var(--color-primary);
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
  background-color: var(--color-complementary);
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
  transform: rotate(-3.5deg);
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
  object-fit: contain; /* 🌟 Cambiado a contain para que los SVGs vectoriales no se corten */
  display: block;
  border: 1px solid #ededed;
  background-color: var(--color-primary);
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
  color: var(--color-accent);
  text-transform: uppercase;
  letter-spacing: -1px;
}

.role-subtitle {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 12px 0 28px 0;
  color: var(--color-secondary);
  text-transform: uppercase;
  letter-spacing: 2px;
}

.role-description {
  font-size: 1.1rem;
  line-height: 1.75;
  color: var(--color-light);
  margin-bottom: 35px;
  max-width: 540px;
}

/* --- CONTENEDOR DE BOTONES --- */
.action-buttons-group {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
}

.explore-button,
.discord-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  gap: 10px;
  height: 50px;
  padding: 0 32px;
  font-size: 0.95rem;
  font-weight: 800;
  font-family: inherit;
  line-height: 1;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 4px;
  text-decoration: none;
  box-sizing: border-box;
  cursor: pointer;
  transition: all 0.2s ease;
}

.explore-button svg,
.discord-button svg {
  display: block;
  flex-shrink: 0;
}

.explore-button {
  background-color: var(--color-accent);
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

</style>
