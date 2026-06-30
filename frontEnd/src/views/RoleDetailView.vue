<script setup lang='ts'>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import type * as ServerType from '../types/serverTypes.ts';
import { useServerService } from '@/services/serverService.ts';

import NotFound from '@/components/NotFound.vue';

// Reutilizamos el motor del diseñador y la barra común
import { useDesigner } from '@/composables/useDesigner';
import BuilderToolbar from '@/components/BuilderToolbar.vue';

// Extendemos la interfaz localmente para soportar el array de imágenes adicionales
interface ExtendedRPServer extends Omit<ServerType.RPServer, 'filename'> {
  filename?: string;
  images?: string[];
}

const route = useRoute();
const { getServerFromRouteParam, getSvgUrl } = useServerService();

const role = ref<ExtendedRPServer | undefined>(undefined);
const bLoading = ref<boolean>(true);

// REFERENCIA: Para el contenedor panorámico principal
const containerRef = ref<HTMLElement | null>(null);

// ESTADO: Controla qué imagen se está viendo en pantalla completa
const activeLightboxImage = ref<string | null>(null);

// Referencias del DOM para los contenedores editables inline (Textos)
const titleRef = ref<HTMLDivElement | null>(null);
const subtitleRef = ref<HTMLDivElement | null>(null);
const descriptionRef = ref<HTMLDivElement | null>(null);

const routeServerId = Array.isArray(route.params.serverId)
  ? route.params.serverId[0]
  : route.params.serverId;
const currentServerId = routeServerId || 'leo';

// Inicializamos el Designer pasándole la cacheKey correcta desde el inicio
const designer = useDesigner({
  cacheKey: `server_page_config_${currentServerId}`
});

const isAuthorizedDesigner = computed(() => {
  return route.query.mode === 'admin-designer';
});

// PROPIEDAD COMPUTADA: Detecta si debe centrarse (solo 1 imagen y no está editando)
const isCenteredLayout = computed(() => {
  if (!role.value || !role.value.images) return true;
  if (designer.isEditing.value) return false;
  return role.value.images.length <= 1;
});

onMounted(async () => {
  const defaultRole = getServerFromRouteParam(currentServerId) as ExtendedRPServer;

  if (defaultRole) {
    const targetCacheKey = `server_page_config_${defaultRole.id}`;

    try {
      const response = await fetch(`/api/cache/${targetCacheKey}`);
      const result = await response.json();
      const data = result.data ? result.data : result;

      if (data && Object.keys(data).length > 0) {
        const savedImages = data.images || (data.filename ? [data.filename] : [getSvgUrl(defaultRole.id)]);

        role.value = {
          ...defaultRole,
          title: data.title || defaultRole.title,
          subtitle: data.subtitle || defaultRole.subtitle,
          description: data.description || defaultRole.description,
          images: savedImages
        };
      } else {
        role.value = {
          ...defaultRole,
          images: [getSvgUrl(defaultRole.id) || '']
        };
      }
    } catch (error) {
      console.error('[RoleDetailView.vue] Error cargando configuración guardada:', error);
      role.value = {
        ...defaultRole,
        images: [getSvgUrl(defaultRole.id) || '']
      };
    }
  }
  bLoading.value = false;
});

/**
 * Manejador para la tecla ESC
 */
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeLightbox();
  }
};

/**
 * Escucha reactivamente los cambios en el estado del lightbox
 */
watch(activeLightboxImage, (newValue) => {
  if (newValue) {
    window.addEventListener('keydown', handleKeyDown);
  } else {
    window.removeEventListener('keydown', handleKeyDown);
  }
});

/**
 * Limpieza al destruir el componente
 */
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

/**
 * Convierte la rueda vertical en desplazamiento horizontal dinámico
 */
const handleWheelScroll = (event: WheelEvent) => {
  if (!containerRef.value) return;

  if (event.deltaY !== 0) {
    event.preventDefault();

    containerRef.value.scrollBy({
      left: event.deltaY * 2.8,
      behavior: 'auto'
    });
  }
};

/**
 * CORRECCIÓN: Tipado estricto y validación asíncrona para blindar TypeScript
 */
const handleAddImage = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input || !input.files || input.files.length === 0 || !role.value) return;

  const file: File | undefined = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const base64Result = e.target?.result as string;
    if (base64Result && role.value) {
      if (!role.value.images) {
        role.value.images = [];
      }
      role.value.images.push(base64Result);
    }
  };
  reader.readAsDataURL(file);
};

/**
 * Remueve una tarjeta del flujo horizontal mediante su índice
 */
const removeImageAtIndex = (index: number) => {
  if (!role.value || !role.value.images) return;
  role.value.images.splice(index, 1);

  if (role.value.images.length === 0) {
    role.value.images.push(getSvgUrl(role.value.id) || '');
  }
};

const handleSaveOrEdit = () => {
  if (!role.value) return;
  designer.toggleEdit(role, {
    title: titleRef,
    subtitle: subtitleRef,
    description: descriptionRef
  });
};

/**
 * Abre el Lightbox para ver la imagen completa (solo si no se está editando)
 */
const openImageLightbox = (imgSrc: string) => {
  if (designer.isEditing.value) return;
  activeLightboxImage.value = imgSrc;
};

/**
 * Cierra el Lightbox
 */
const closeLightbox = () => {
  activeLightboxImage.value = null;
};
</script>

<template>
  <BuilderToolbar
    v-if="isAuthorizedDesigner && designer.isEditing.value"
    :designer="designer"
    :onSave="handleSaveOrEdit"
  />

  <button
    v-if="isAuthorizedDesigner && role && !designer.isEditing.value"
    class="designer-trigger"
    @click="handleSaveOrEdit"
  >
    📝 Modo Diseñador ({{ role.id.toUpperCase() }})
  </button>

  <div v-if="role">
    <main
      ref="containerRef"
      class="detail-page-panoramic"
      :class="{ 'is-centered': isCenteredLayout }"
      :style="{ '--bg-gradient': role.color }"
      @wheel="handleWheelScroll"
    >

      <RouterLink to="/" class="back-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
        </svg>
        <span>Back</span>
      </RouterLink>

      <div class="panoramic-track">

        <div class="content-container-original">
          <div class="postal-wrapper">
            <div class="postal-card main-polaroid">
              <div class="image-viewport">
                <img :src="role.images && role.images[0]" :alt="role.title" class="postal-image" />

                <div v-if="designer.isEditing.value && role.images && role.images.length > 1" class="image-actions-overlay">
                  <button class="img-action-btn delete-btn" @click.stop="removeImageAtIndex(0)">
                    Eliminar
                  </button>
                </div>
              </div>

              <div class="postal-footer">
                <span class="postal-brand">VISIT KINSFOLK</span>
              </div>
            </div>
          </div>

          <div class="info-wrapper">
            <h1 v-if="!designer.isEditing.value" class="role-title" v-html="role.title"></h1>
            <div v-else ref="titleRef" contenteditable="true" class="role-title editable-container" v-html="role.title"></div>

            <h2 v-if="!designer.isEditing.value" class="role-subtitle" v-html="role.subtitle"></h2>
            <div v-else ref="subtitleRef" contenteditable="true" class="role-subtitle editable-container" v-html="role.subtitle"></div>

            <p v-if="!designer.isEditing.value" class="role-description" v-html="role.description"></p>
            <div v-else ref="descriptionRef" contenteditable="true" class="role-description editable-container" v-html="role.description"></div>

            <div class="action-buttons-group">
              <button class="explore-button">
                Explora {{ role.title.replace(/<[^>]*>/g, '') }}
              </button>

              <a v-if="role.discordLink" :href="role.discordLink" target="_blank" rel="noopener noreferrer" class="discord-button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 127.14 96.36"
                  style="width: 18px !important; height: 18px !important; min-width: 18px !important; min-height: 18px !important; flex-shrink: 0 !important; display: inline-block; vertical-align: middle; overflow: visible !important;"
                  fill="currentColor"
                >
                  <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.47,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a74.37,74.37,0,0,0,6.72-10.93,68.6,68.6,0,0,1-10.64-5.12c.91-.67,1.81-1.37,2.65-2.1a75.22,75.22,0,0,0,72.94,0c.84.73,1.74,1.43,2.65,2.1a68.6,68.6,0,0,1-10.64,5.12,74.37,74.37,0,0,0,6.72,10.93,105.73,105.73,0,0,0,31.05-18.83C129.24,50.7,123.4,27.87,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.87,46,53.87,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.11,46,96.11,53,91,65.69,84.69,65.69Z"/>
                </svg>
                <span>Unete al Discord</span>
              </a>
            </div>
          </div>
        </div>

        <div v-if="(role.images && role.images.length > 1) || designer.isEditing.value" class="extended-gallery-flow">
          <template v-for="(imgSrc, idx) in role.images" :key="idx">
            <div v-if="idx > 0" class="postal-wrapper">
              <div
                class="gallery-clean-image"
                :style="`transform: rotate(${idx % 2 === 0 ? -1.5 : 2}deg);`"
                @click="openImageLightbox(imgSrc)"
                :class="{ 'clickable-view': !designer.isEditing.value }"
              >
                <div class="image-viewport">
                  <img :src="imgSrc" :alt="role.title" class="postal-image" />

                  <div v-if="designer.isEditing.value" class="image-actions-overlay">
                    <button class="img-action-btn delete-btn" @click.stop="removeImageAtIndex(idx)">
                      Eliminar Imagen
                    </button>
                  </div>

                  <div v-if="!designer.isEditing.value" class="expand-indicator-overlay">
                    <button class="expand-trigger-btn">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 0-1H1.707l4.12-4.12a.5.5 0 0 0 0-.708zm4.344-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0v-4a.5.5 0 0 0-.5-.5h4a.5.5 0 1 0 0 1h2.793l-4.12 4.12a.5.5 0 0 0 0-.708z"/>
                      </svg>
                      Expandir Imagen
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <div v-if="designer.isEditing.value" class="add-postal-placeholder">
            <label class="add-image-btn-zone">
              <div class="plus-icon">➕</div>
              <span>Añadir foto a la derecha</span>
              <input type="file" accept="image/*" class="hidden-file-input" @change="handleAddImage" />
            </label>
          </div>
        </div>

      </div>
    </main>
  </div>

  <div v-else>
    <NotFound
      title="Role not found"
      description="El rol que buscas no se encuentra registrado en nuestro ecosistema."
    />
  </div>

  <Transition name="fade">
    <div v-if="activeLightboxImage" class="image-lightbox-modal" @click="closeLightbox">
      <button class="lightbox-close-btn" @click="closeLightbox">✕</button>
      <div class="lightbox-content" @click.stop>
        <img :src="activeLightboxImage" class="lightbox-full-image" alt="Visualización completa" />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* --- CONFIGURACIONES DEL MODO DISEÑADOR --- */
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
  text-align: left;
}

/* --- MAQUETACIÓN HORIZONTAL GENERAL (PANORÁMICA) --- */
.detail-page-panoramic {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, var(--bg-gradient) 0%, var(--color-background) 100%), var(--color-background);
  overflow-y: hidden;
  overflow-x: auto;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  scroll-behavior: smooth;
  overscroll-behavior-x: contain;
}

.detail-page-panoramic::-webkit-scrollbar {
  height: 8px;
}
.detail-page-panoramic::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
}
.detail-page-panoramic::-webkit-scrollbar-thumb {
  background: var(--color-accent, #ecaf44);
  border-radius: 4px;
}

.panoramic-track {
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
  width: 100%;
  padding-right: 80px;
}

.content-container-original {
  display: flex;
  flex-direction: row;
  width: 1200px;
  align-items: center;
  justify-content: space-between;
  gap: 80px;
  flex-shrink: 0;
  margin-left: calc(50vw - 600px);
}

.detail-page-panoramic.is-centered .content-container-original {
  margin-left: auto;
  margin-right: auto;
}

.extended-gallery-flow {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 60px;
  flex-shrink: 0;
  padding-left: 60px;
}

/* --- TARJETA POLAROID --- */
.postal-wrapper {
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.postal-card {
  background-color: #ffffff;
  padding: 16px 16px 45px 16px;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6);
  border-radius: 4px;
  width: 450px;
  box-sizing: border-box;
  transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}
.main-polaroid {
  transform: rotate(-3.5deg);
}
.postal-card:hover {
  transform: rotate(-0.5deg) scale(1.03) !important;
  z-index: 5;
}

.gallery-clean-image {
  position: relative;
  width: 450px;
  box-sizing: border-box;
  transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.5));
}
.gallery-clean-image:hover {
  transform: rotate(-0.5deg) scale(1.03) !important;
  z-index: 5;
}
.gallery-clean-image .image-viewport {
  border-radius: 4px;
}

.clickable-view {
  cursor: pointer;
}

.expand-indicator-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(6, 15, 22, 0);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.25s ease;
  opacity: 0;
}
.gallery-clean-image .image-viewport:hover .expand-indicator-overlay {
  background: rgba(6, 15, 22, 0.35);
  opacity: 1;
}

.expand-trigger-btn {
  background: rgba(255, 255, 255, 0.92);
  color: #060f16;
  border: none;
  padding: 10px 18px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  transform: translateY(10px);
  transition: all 0.25s ease;
  cursor: pointer;
}
.gallery-clean-image .image-viewport:hover .expand-trigger-btn {
  transform: translateY(0);
}
.expand-trigger-btn:hover {
  background: #ffffff;
  color: var(--color-accent, #ecaf44);
  transform: scale(1.05);
}

.image-viewport {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  background-color: #060F16;
  overflow: hidden;
}
.postal-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
  border: 1px solid #ededed;
  background-color: var(--color-primary);
}
.postal-footer {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.postal-brand {
  font-family: 'Impact', 'Arial Black', sans-serif;
  font-size: 1.3rem;
  color: #c4c4c4;
  letter-spacing: 1.5px;
}

/* --- PLACEHOLDER IMÁGENES --- */
.add-postal-placeholder {
  width: 450px;
  aspect-ratio: 1 / 1;
  margin-bottom: 25px;
  flex-shrink: 0;
}
.add-image-btn-zone {
  width: 100%;
  height: 100%;
  border: 2px dashed var(--color-accent, #ecaf44);
  background: rgba(236, 175, 68, 0.02);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: var(--color-accent, #ecaf44);
  cursor: pointer;
  font-weight: 700;
  transition: background 0.2s;
}
.add-image-btn-zone:hover {
  background: rgba(236, 175, 68, 0.08);
}
.plus-icon { font-size: 2rem; }
.hidden-file-input { display: none; }

.image-actions-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}
.img-action-btn.delete-btn {
  background: #7a1313;
  border: 1px solid #931c1c;
  color: #fff;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 700;
  cursor: pointer;
}
.img-action-btn.delete-btn:hover {
  background: #ff2a2a;
}

/* --- MODAL PANTALLA COMPLETA --- */
.image-lightbox-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(4, 10, 15, 0.95);
  backdrop-filter: blur(10px);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.lightbox-content {
  max-width: 90%;
  max-height: 85%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.lightbox-full-image {
  max-width: 100%;
  max-height: 100vh;
  object-fit: contain;
  border-radius: 4px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.8);
}
.lightbox-close-btn {
  position: absolute;
  top: 30px;
  right: 40px;
  background: none;
  border: none;
  color: #ffffff;
  font-size: 2.5rem;
  cursor: pointer;
  transition: color 0.2s;
}
.lightbox-close-btn:hover {
  color: var(--color-accent, #ecaf44);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* --- TEXTOS E INFO --- */
.info-wrapper {
  flex-shrink: 0;
  width: 540px;
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

.action-buttons-group {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
}
.explore-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 50px;
  padding: 0 32px;
  font-size: 0.95rem;
  font-weight: 800;
  text-transform: uppercase;
  border-radius: 4px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  box-sizing: border-box;
  background-color: var(--color-accent);
  color: #060f16;
  border: none;
}
.explore-button:hover {
  background-color: #f3e9dc;
  transform: translateY(-2px);
}

/* --- BOTÓN DE DISCORD BLINDADO --- */
.discord-button {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 10px !important;
  height: 50px !important;
  padding: 0 32px !important;
  font-size: 0.95rem !important;
  font-weight: 800 !important;
  text-transform: uppercase !important;
  border-radius: 4px !important;
  text-decoration: none !important;
  cursor: pointer !important;
  transition: all 0.2s ease !important;
  box-sizing: border-box !important;
  background-color: #5865F2 !important;
  color: #ffffff !important;
  border: none !important;
}
.discord-button:hover {
  background-color: #4752C4 !important;
  transform: translateY(-2px) !important;
}

.discord-button svg {
  width: 18px !important;
  height: 18px !important;
  min-width: 18px !important;
  min-height: 18px !important;
  max-width: 18px !important;
  max-height: 18px !important;
  flex-shrink: 0 !important;
  overflow: visible !important;
  display: inline-block !important;
  vertical-align: middle !important;
}

.back-button {
  position: absolute;
  top: 40px;
  left: 40px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background-color: #f3e9dc;
  color: #060f16;
  padding: 12px 24px;
  border-radius: 30px;
  font-weight: 700;
  text-decoration: none;
  z-index: 100;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

:deep(b), :deep(strong) { font-weight: bold !important; }
:deep(i), :deep(em) { font-style: italic !important; }
:deep(u) { text-decoration: underline !important; }

@media (max-width: 1024px) {
  .detail-page-panoramic, .detail-page-panoramic.is-centered {
    overflow-y: auto;
    overflow-x: hidden;
    height: auto;
    min-height: 100vh;
  }
  .panoramic-track {
    flex-direction: column;
    padding: 120px 20px 40px 20px !important;
    gap: 40px;
  }
  .content-container-original {
    flex-direction: column;
    width: 100%;
    text-align: center;
    gap: 40px;
    margin-left: 0 !important;
  }
  .info-wrapper { width: 100%; }
  .role-description { margin: 0 auto 30px auto; }
  .extended-gallery-flow {
    flex-direction: column;
    width: 100%;
    gap: 40px;
    padding-left: 0;
  }
  .postal-card, .gallery-clean-image, .add-postal-placeholder {
    width: 100%;
    max-width: 420px;
  }
  .action-buttons-group { flex-direction: column; }
  .explore-button, .discord-button { width: 100%; }
}
</style>
