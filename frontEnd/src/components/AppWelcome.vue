<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import WelcomeCarousel from './ServerCarrousel.vue'
import defaultLogoUrl from '/icons/Logoletras.svg'

// Importamos la lógica generalizada del diseñador y la barra común
import { useDesigner } from '@/composables/useDesigner'
import BuilderToolbar from '@/components/editor/BuilderToolbar.vue'

interface KinsfolkPageConfig {
  welcomeTitle: string
  welcomeDescription: string
  ctaText: string
  logoUrl: string
  discordLink: string
}

// Configuración inicial espejo (fallbacks locales idénticos a la fábrica)
const pageConfig = ref<KinsfolkPageConfig>({
  welcomeTitle: 'Bienvenido a <span class="highlight-text">Dispatch</span>',
  welcomeDescription: 'Explora nuestros proyectos y soluciones de diseño exclusivos integrados en nuestro ecosistema.',
  ctaText: 'Únete',
  logoUrl: defaultLogoUrl,
  discordLink: 'https://discord.gg/' //Enlace por defecto inicializado
})

// Referencias de los nodos editables del DOM
const titleRef = ref<HTMLDivElement | null>(null)
const subtitleRef = ref<HTMLDivElement | null>(null)

// Instanciamos el composable generalizador con la llave de caché de esta vista
const designer = useDesigner({
  cacheKey: 'kinsfolk_page_config'
})

// Instanciamos la ruta activa
const route = useRoute()

// Validación de seguridad: el panel de edición sólo existirá si se incluye la llave secreta en la URL
const isAuthorizedDesigner = computed(() => {
  return route.query.mode === 'admin-designer'
})

onMounted(async () => {
  try {
    const response = await fetch('/api/cache/kinsfolk_page_config')
    const result = await response.json()

    // Tolerancia en el desempaquetado de datos si el backend retorna { success: true, data: ... } o directo
    const data = result.data ? result.data : result

    if (data && Object.keys(data).length > 0) {
      pageConfig.value = {
        welcomeTitle: data.welcomeTitle || 'Bienvenido a <span class="highlight-text">Dispatch</span>',
        welcomeDescription: data.welcomeDescription || 'Explora nuestros proyectos y soluciones de diseño exclusivos integrados en nuestro ecosistema.',
        ctaText: data.ctaText || 'Únete',
        logoUrl: data.logoUrl || defaultLogoUrl,
        discordLink: data.discordLink || 'https://discord.gg/' //Rehidratación desde caché
      }
    }
  } catch (error) {
    console.error('[Welcome.vue] Error al cargar la configuración inicial:', error)
  }
})

// Ejecuta la alternancia del modo diseñador y recolecta los HTML inline
const handleSaveOrEdit = () => {
  designer.toggleEdit(pageConfig, {
    welcomeTitle: titleRef,
    welcomeDescription: subtitleRef
  })
}
</script>

<template>
  <header class="hero-container">

    <BuilderToolbar
      v-if="isAuthorizedDesigner && designer.isEditing.value"
      :designer="designer"
      :onSave="handleSaveOrEdit"
    />

    <button
      v-if="isAuthorizedDesigner && !designer.isEditing.value"
      class="designer-trigger"
      @click="handleSaveOrEdit"
    >
      📝 Modo Diseñador
    </button>

      <h1 v-if="!designer.isEditing.value" class="welcome-title" v-html="pageConfig.welcomeTitle"></h1>
      <div v-else ref="titleRef" contenteditable="true" class="welcome-title editable-container"></div>

      <div class="welcome-section">
      <div class="logo-wrapper">
        <div class="image-editor-wrapper">
          <img
            :src="pageConfig.logoUrl || defaultLogoUrl"
            alt="Kinsfolk Logo"
            class="main-logo"
          />

          <div v-if="isAuthorizedDesigner && designer.isEditing.value" class="image-actions-overlay">
            <label class="img-action-btn">
              Reemplazar
              <input
                type="file"
                accept="image/*"
                class="hidden-file-input"
                @change="e => designer.handleImageUpload(e, pageConfig, 'logoUrl')"
              />
            </label>
            <button
              v-if="pageConfig.logoUrl && pageConfig.logoUrl !== defaultLogoUrl"
              class="img-action-btn delete-btn"
              @click="designer.removeImage(pageConfig, 'logoUrl')"
            >
              Quitar
            </button>
          </div>
        </div>
      </div>


      <p v-if="!designer.isEditing.value" class="welcome-subtitle" v-html="pageConfig.welcomeDescription"></p>
      <div v-else ref="subtitleRef" contenteditable="true" class="welcome-subtitle editable-container"></div>
    </div>

    <WelcomeCarousel />

    <!-- 4. SECCIÓN DISCORD DINÁMICA -->
    <div class="discord-section">

      <!-- Vista en Modo Diseñador Activo -->
      <div v-if="designer.isEditing.value" class="discord-editor-wrapper">
        <div class="discord-button mock-disabled">
          <svg class="discord-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.14 96.36">
            <path fill="currentColor" d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a74.37,74.37,0,0,0,6.71-11A68.52,68.52,0,0,1,28,80.48c1-.76,2-1.56,3-2.37a75,75,0,0,0,65.2,0c1,.81,2,1.61,3,2.37a68.52,68.52,0,0,1-10.74,4.85,74.37,74.37,0,0,0,6.71,11,105.73,105.73,0,0,0,31-18.83C129.87,49.85,123.65,27,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z"/>
          </svg>
          <input v-model="pageConfig.ctaText" class="cta-inline-input" placeholder="Texto" />
        </div>

        <!-- Caja flotante externa para cambiar la URL cómodamente -->
        <div class="link-editor-box">
          <label class="link-editor-label">Enlace Discord:</label>
          <input
            type="text"
            v-model="pageConfig.discordLink"
            class="link-field-input"
            placeholder="https://discord.gg/..."
          />
        </div>
      </div>

      <!-- Vista Pública Normal -->
      <a
        v-else
        :href="pageConfig.discordLink"
        target="_blank"
        rel="noopener noreferrer"
        class="discord-button"
      >
        <svg class="discord-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.14 96.36">
          <path fill="currentColor" d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a74.37,74.37,0,0,0,6.71-11A68.52,68.52,0,0,1,28,80.48c1-.76,2-1.56,3-2.37a75,75,0,0,0,65.2,0c1,.81,2,1.61,3,2.37a68.52,68.52,0,0,1-10.74,4.85,74.37,74.37,0,0,0,6.71,11,105.73,105.73,0,0,0,31-18.83C129.87,49.85,123.65,27,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z"/>
        </svg>
        <span>{{ pageConfig.ctaText }}</span>
      </a>
    </div>
  </header>
</template>

<style scoped>
/* --- CONTROLES INTERACTIVOS FLOTANTES PARA IMÁGENES --- */
.image-editor-wrapper {
  position: relative;
  width: 100%;
  display: inline-block;
}
.image-actions-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border-radius: 8px;
}
.img-action-btn {
  background: #222;
  color: #fff;
  border: 1px solid #444;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
.img-action-btn:hover {
  background: var(--color-accent, #ecaf44);
  color: #000;
  border-color: var(--color-accent, #ecaf44);
}
.image-actions-overlay .delete-btn {
  background: #7a1313;
  border-color: #931c1c;
}
.image-actions-overlay .delete-btn:hover {
  background: #ff2a2a;
  color: #fff;
  border-color: #ff2a2a;
}
.hidden-file-input {
  display: none;
}

/* --- CLASES DE SOPORTE PARA MODO DISEÑADOR --- */
.designer-trigger {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 10000;
  background: rgba(236, 175, 68, 0.12);
  color: var(--color-accent, #ecaf44);
  border: 1px solid var(--color-accent, #ecaf44);
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  backdrop-filter: blur(8px);
  transition: all 0.2s;
}
.designer-trigger:hover {
  background: var(--color-accent, #ecaf44);
  color: #111;
}
.editable-container {
  border: 1px dashed var(--color-accent, #ecaf44);
  outline: none;
  padding: 6px 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.02);
  min-width: 200px;
}
.cta-inline-input {
  background: transparent;
  border: none;
  border-bottom: 1px dashed #fff;
  color: inherit;
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  width: 100px;
  text-align: center;
  outline: none;
}

/* 5. ESTILOS DE LA CAJA CONFIGURADORA DE ENLACES (NUEVOS) */
.discord-editor-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.discord-button.mock-disabled {
  cursor: default;
  box-shadow: none;
}
.discord-button.mock-disabled:hover {
  transform: none;
  background-color: transparent;
  color: var(--color-accent);
  box-shadow: 0 4px 15px rgba(236, 175, 68, 0.1);
}
.link-editor-box {
  background: #0d1721;
  border: 1px dashed rgba(236, 175, 68, 0.3);
  padding: 10px 18px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
}
.link-editor-label {
  font-family: "Exo 2", sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-accent, #ecaf44);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.link-field-input {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  width: 260px;
  outline: none;
  transition: border-color 0.2s;
}
.link-field-input:focus {
  border-color: var(--color-accent, #ecaf44);
}


/* --- TU CSS ORIGINAL PRESERVADO SIN ALTERACIONES --- */
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

.welcome-section {
  text-align: center;
  max-width: 800px;
  margin-bottom: 20px;
}

.logo-wrapper {
  width: 100%;
  max-width: 450px;
  margin: 0 auto -64px auto;
}

.main-logo {
  width: 100%;
  height: auto;
  display: block;
}

.welcome-title {
  color: var(--color-light);
  font-size: 2.5rem;
  font-weight: 400;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 8px rgba(0,0,0,.7), 0 4px 20px rgba(0,0,0,.5);
}

.welcome-title b,
.welcome-title strong {
  font-weight: 800 !important;
}

.highlight-text {
  color: var(--color-accent);
}

.welcome-subtitle {
  color: var(--color-secondary);
  font-family: "Exo 2", sans-serif;
  font-size: 1.3rem;
  font-weight: 600;
  line-height: 1.6;
  max-width: 600px;
  margin: 16px auto 0 auto;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.discord-section {
  display: flex;
  justify-content: center;
  width: 100%;
}

.discord-button {
  font-family: "Exo 2", sans-serif;
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

.discord-button:hover:not(.mock-disabled) {
  background-color: var(--color-accent);
  color: var(--color-primary);
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(236, 175, 68, 0.3);
}

.discord-button:active:not(.mock-disabled) {
  transform: translateY(-1px);
}

.discord-icon {
  width: 24px;
  height: auto;
  display: block;
}

:deep(b), :deep(strong) {
  font-weight: bold !important;
}
</style>
