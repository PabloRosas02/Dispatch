<script setup lang='ts'>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import type * as ServerType from '../types/serverTypes.ts';
import { useServerService } from '@/services/serverService.ts';

import NotFound from '@/components/miscellaneous/NotFound.vue'; 
import BuilderToolbar from '@/components/editor/BuilderToolbar.vue';
// IMPORTACIÓN: Traemos el nuevo gestor de imágenes dinámicas
import ImageGalleryManager from '@/components/editor/ImageGalleryManager.vue';

import { useDesigner } from '@/composables/useDesigner';

interface ExtendedRPServer extends Omit<ServerType.RPServer, 'filename'> {
  filename?: string;
  images?: string[]; 
}

const route = useRoute();
const { getServerFromRouteParam, getSvgUrl } = useServerService();

const role = ref<ExtendedRPServer | undefined>(undefined);
const bLoading = ref<boolean>(true);
const containerRef = ref<HTMLElement | null>(null);

// Control de imagen activa para el Lightbox modal de pantalla completa
const activeLightboxImage = ref<string | null>(null);

const routeServerId = Array.isArray(route.params.serverId) 
  ? route.params.serverId[0] 
  : route.params.serverId;
const currentServerId = routeServerId || 'leo';

const designer = useDesigner({
  cacheKey: `server_page_config_${currentServerId}`
});

const isAuthorizedDesigner = computed(() => route.query.mode === 'admin-designer');

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
      const response = await fetch(`http://localhost:3000/api/cache/${targetCacheKey}`);
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
        role.value = { ...defaultRole, images: [getSvgUrl(defaultRole.id) || ''] };
      }
    } catch (error) {
      console.error('[RoleDetailView.vue] Error:', error);
      role.value = { ...defaultRole, images: [getSvgUrl(defaultRole.id) || ''] };
    }
  }
  bLoading.value = false;
});

// Manejadores globales para cerrar el Lightbox presionando la tecla Escape (ESC)
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') activeLightboxImage.value = null;
};

watch(activeLightboxImage, (newValue) => {
  if (newValue) window.addEventListener('keydown', handleKeyDown);
  else window.removeEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

const handleWheelScroll = (event: WheelEvent) => {
  if (!containerRef.value) return;
  if (event.deltaY !== 0) {
    event.preventDefault(); 
    containerRef.value.scrollBy({ left: event.deltaY * 2.8, behavior: 'auto' });
  }
};

const handleSaveOrEdit = () => {
  if (!role.value) return;
  designer.toggleEdit(role, {
    title: ref(document.querySelector('.role-title')),
    subtitle: ref(document.querySelector('.role-subtitle')),
    description: ref(document.querySelector('.role-description'))
  });
};

// CORRECCIÓN TYPESCRIPT: Control e inserción segura de imágenes secundarias
const handleAddImage = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0 || !role.value) return;
  
  const file = input.files[0];
  
  if (!file) return;
  
  const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // Límite de 10 MB
  
  if (file.size > MAX_FILE_SIZE_BYTES) {
    alert(`El archivo excede el límite máximo permitido de 10 MB.`);
    return;
  }
  
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

const removeImageAtIndex = (index: number) => {
  if (!role.value || !role.value.images) return;
  role.value.images.splice(index, 1);
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
              </div>
              <div class="postal-footer">
                <span class="postal-brand">VISIT KINSFOLK</span>
              </div>
            </div>
          </div>

          <div class="info-wrapper">
            <h1 v-if="!designer.isEditing.value" class="role-title" v-html="role.title"></h1>
            <div v-else contenteditable="true" class="role-title editable-container" v-html="role.title"></div>

            <h2 v-if="!designer.isEditing.value" class="role-subtitle" v-html="role.subtitle"></h2>
            <div v-else contenteditable="true" class="role-subtitle editable-container" v-html="role.subtitle"></div>

            <p v-if="!designer.isEditing.value" class="role-description" v-html="role.description"></p>
            <div v-else contenteditable="true" class="role-description editable-container" v-html="role.description"></div>

            <div class="action-buttons-group">
              <button class="explore-button">
                Explora {{ role.title.replace(/<[^>]*>/g, '') }}
              </button>

              <a v-if="role.discordLink" :href="role.discordLink" target="_blank" rel="noopener noreferrer" class="discord-button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.14 96.36" fill="currentColor" style="width: 18px; height: 18px; display: inline-block; vertical-align: middle;">
                  <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.47,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a74.37,74.37,0,0,0,6.72-10.93,68.6,68.6,0,0,1-10.64-5.12c.91-.67,1.81-1.37,2.65-2.1a75.22,75.22,0,0,0,72.94,0c.84.73,1.74,1.43,2.65,2.1a68.6,68.6,0,0,1-10.64,5.12,74.37,74.37,0,0,0,6.72,10.93,105.73,105.73,0,0,0,31.05-18.83C129.24,50.7,123.4,27.87,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.87,46,53.87,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.11,46,96.11,53,91,65.69,84.69,65.69Z"/>
                </svg>
                <span>Unete al Discord</span>
              </a>
            </div>
          </div>
        </div>

        <ImageGalleryManager 
          v-if="role.images" 
          v-model:images="role.images" 
          :isEditing="designer.isEditing.value" 
          variant="collage"
          @open-lightbox="activeLightboxImage = $event"
          @add-image="handleAddImage"
          @remove-image="removeImageAtIndex"
        />

      </div>
    </main>
  </div>

  <div v-else>
    <NotFound />
  </div>

  <Transition name="fade">
    <div v-if="activeLightboxImage" class="image-lightbox-modal" @click="activeLightboxImage = null">
      <button class="lightbox-close-btn" @click="activeLightboxImage = null">✕</button>
      <div class="lightbox-content" @click.stop>
        <img :src="activeLightboxImage" class="lightbox-full-image" alt="Visualización ampliada" />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* ==========================================================================
   ESTILOS BASE E INTERFAZ PANORÁMICA
   ========================================================================== */
.image-lightbox-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(4, 10, 15, 0.96);
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
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
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
.detail-page-panoramic {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, var(--bg-gradient) 0%, var(--color-background) 100%), var(--color-background);
  overflow-y: hidden;
  overflow-x: auto; 
  display: flex;
  align-items: center;
  box-sizing: border-box;
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
  transform: rotate(-3.5deg);
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
.info-wrapper {
  flex-shrink: 0;
  width: 540px;
  color: #ffffff;
}
.role-title {
  font-size: 4.2rem;
  font-weight: 900;
  line-height: 1;
  color: var(--color-accent);
  text-transform: uppercase;
}
.role-subtitle {
  font-size: 1.4rem;
  font-weight: 700;
  margin: 12px 0 28px 0;
  color: var(--color-secondary);
  text-transform: uppercase;
}
.role-description {
  font-size: 1.1rem;
  line-height: 1.75;
  color: var(--color-light);
  margin-bottom: 35px;
}
.action-buttons-group {
  display: flex;
  gap: 16px;
}
.explore-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  padding: 0 32px;
  font-size: 0.95rem;
  font-weight: 800;
  text-transform: uppercase;
  border-radius: 4px;
  background-color: var(--color-accent);
  color: #060f16;
  border: none;
  cursor: pointer;
}
.discord-button {
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
  background-color: #5865F2;
  color: #ffffff;
  border: none;
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
}

@media (max-width: 1024px) {
  .detail-page-panoramic {
    overflow-y: auto; overflow-x: hidden; height: auto; min-height: 100vh;
  }
  .panoramic-track {
    flex-direction: column; padding: 120px 20px 40px 20px !important; gap: 40px;
  }
  .content-container-original {
    flex-direction: column; width: 100%; text-align: center; margin-left: 0 !important;
  }
  .info-wrapper { width: 100%; }
  .action-buttons-group { flex-direction: column; }
  .explore-button, .discord-button { width: 100%; }
}
</style>