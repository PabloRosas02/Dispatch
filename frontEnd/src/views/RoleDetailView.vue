<script setup lang='ts'>
import { ref, onMounted, computed, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import NotFound from '@/components/miscellaneous/NotFound.vue'; 
import BuilderToolbar from '@/components/editor/BuilderToolbar.vue';
import ImageGalleryManager from '@/components/editor/ImageGalleryManager.vue';

// Composables
import { useDesigner } from '@/composables/useDesigner';
import { useRoleDetail } from '@/composables/useRoleDetail';

const route = useRoute();
const containerRef = ref<HTMLElement | null>(null);

const routeServerId = Array.isArray(route.params.serverId) 
  ? route.params.serverId[0] 
  : route.params.serverId;
const currentServerId = routeServerId || 'leo';

// Extraemos la lógica del composable
const {
  role,
  bLoading,
  activeLightboxImage,
  fetchRoleData,
  handleAddImage,
  removeImageAtIndex
} = useRoleDetail(currentServerId);

// Lógica del Diseñador
const cacheKeyStr = `server_page_config_${currentServerId}`;
const designer = useDesigner({ cacheKey: cacheKeyStr });
const isAuthorizedDesigner = computed(() => route.query.mode === 'admin-designer');

// Carga Inicial Controlada
onMounted(() => {
  fetchRoleData();
});

const handleWheelScroll = (event: WheelEvent) => {
  if (!containerRef.value) return;
  if (event.deltaY !== 0) {
    event.preventDefault(); 
    containerRef.value.scrollBy({ left: event.deltaY * 2.8, behavior: 'auto' });
  }
};

const handleSaveOrEdit = async () => {
  if (!role.value) return;
  
  designer.toggleEdit(role, {
    title: ref(document.querySelector('.role-title')),
    subtitle: ref(document.querySelector('.role-subtitle')),
    description: ref(document.querySelector('.role-description'))
  });

  if (!designer.isEditing.value) {
    try {
      await nextTick();
      bLoading.value = true;
      
      const payload = { key: cacheKeyStr, value: role.value };
      const response = await fetch(`/api/cache/${cacheKeyStr}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        await fetch(`/api/cache/${cacheKeyStr}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: cacheKeyStr, data: role.value })
        });
      }
    } catch (error) {
      console.error('[RoleDetailView] Error al guardar:', error);
    } finally {
      bLoading.value = false;
    }
  }
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
            <div lod="true" v-else contenteditable="true" class="role-title editable-container" v-html="role.title"></div>

            <h2 v-if="!designer.isEditing.value" class="role-subtitle" v-html="role.subtitle"></h2>
            <div v-else contenteditable="true" class="role-subtitle editable-container" v-html="role.subtitle"></div>

            <p v-if="!designer.isEditing.value" class="role-description" v-html="role.description"></p>
            <div v-else contenteditable="true" class="role-description editable-container" v-html="role.description"></div>

            <div class="action-buttons-group">
              <button class="explore-button">
                Explora {{ role.title.replace(/<[^>]*>/g, '') }}
              </button>

              <!-- CONFIGURADOR DINÁMICO DE DISCORD EN MODO DISEÑO -->
              <div v-if="designer.isEditing.value" class="role-discord-editor-container">
                <div class="discord-button mock-disabled">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.14 96.36" fill="currentColor" style="width: 18px; height: 18px; display: inline-block; vertical-align: middle;">
                    <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.47,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a74.37,74.37,0,0,0,6.72-10.93,68.6,68.6,0,0,1-10.64-5.12c.91-.67,1.81-1.37,2.65-2.1a75.22,75.22,0,0,0,72.94,0c.84.73,1.74,1.43,2.65,2.1a68.6,68.6,0,0,1-10.64,5.12,74.37,74.37,0,0,0,6.72,10.93,105.73,105.73,0,0,0,31.05-18.83C129.24,50.7,123.4,27.87,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.87,46,53.87,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.11,46,96.11,53,91,65.69,84.69,65.69Z"/>
                  </svg>
                  <span>Unete al Discord</span>
                </div>
                
                <input 
                  type="text" 
                  v-model="role.discordLink" 
                  class="role-link-field-input" 
                  placeholder="Enlace Discord (https://discord.gg/...)"
                />
              </div>

              <!-- BOTÓN PÚBLICO NORMAL -->
              <a v-else-if="role.discordLink" :href="role.discordLink" target="_blank" rel="noopener noreferrer" class="discord-button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.14 96.36" fill="currentColor" style="width: 18px; height: 18px; display: inline-block; vertical-align: middle;">
                  <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.47,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a74.37,74.37,0,0,0,6.72-10.93,68.6,68.6,0,0,1-10.64-5.12c.91-.67,1.81-1.37,2.65-2.1a75.22,75.22,0,0,0,72.94,0c.84.73,1.74,1.43,2.65,2.1a68.6,68.6,0,0,1-10.64,5.12,74.37,74.37,0,0,0,6.72,10.93,105.73,105.73,0,0,0,31.05-18.83C129.24,50.7,123.4,27.87,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.87,46,53.87,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.11,46,96.11,53,91,65.69,84.69,65.69Z"/>
                </svg>
                <span>Unete al Discord</span>
              </a>
            </div>
          </div>
        </div>

        <div class="gallery-safe-zone">
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

      </div>
    </main>
  </div>

  <div v-else-if="!bLoading">
    <NotFound />
  </div>
  
  <div v-else class="loader-placeholder-fullscreen">
    Cargando Datos de Servidor...
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
   INTERFAZ LIGHTBOX Y GENERALES
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
.lightbox-content { max-width: 90%; max-height: 85%; display: flex; align-items: center; justify-content: center; }
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
  color: #fff; 
  font-size: 2.5rem; 
  cursor: pointer; 
  transition: color 0.2s;
}
.lightbox-close-btn:hover { color: var(--color-accent); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.designer-trigger {
  position: fixed; 
  top: 24px; 
  right: 24px; 
  z-index: 10000;
  background: rgba(236, 175, 68, 0.12); 
  color: var(--color-accent);
  border: 1px solid var(--color-accent); 
  padding: 10px 20px;
  border-radius: 8px; 
  cursor: pointer; 
  font-weight: 600;
  backdrop-filter: blur(8px); 
  transition: all 0.2s;
}
.designer-trigger:hover { background: var(--color-accent); color: #111; }

.editable-container {
  border: 1px dashed var(--color-accent); 
  outline: none; 
  padding: 6px 12px;
  border-radius: 8px; 
  background: rgba(255, 255, 255, 0.02); 
  text-align: left;
}

.detail-page-panoramic {
  width: 100vw; 
  height: 100vh;
  background: linear-gradient(135deg, var(--bg-gradient) 0%, var(--color-primary) 100%), var(--color-primary);
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

/* POLAROID CARD */
.postal-wrapper { 
  flex-shrink: 0; 
  display: flex; 
  justify-content: center; 
  align-items: center; 
}
.postal-card {
  background-color: #fff; 
  padding: 16px 16px 45px 16px; 
  box-shadow: 0 30px 60px rgba(0,0,0,0.6);
  border-radius: 4px; 
  width: 450px; 
  box-sizing: border-box; 
  transform: rotate(-3.5deg);
}
.image-viewport { 
  position: relative; 
  width: 100%; 
  aspect-ratio: 1/1; 
  background-color: var(--color-primary); 
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
  justify-content: center; 
  align-items: center; 
}
.postal-brand { 
  font-family: 'Impact', 'Arial Black', sans-serif; 
  font-size: 1.3rem; 
  color: #c4c4c4; 
  letter-spacing: 1.5px; 
}

/* INFO WRAPPER */
.info-wrapper { 
  flex-shrink: 0; 
  width: 540px; 
  color: var(--color-light); 
}
.role-title { 
  font-size: 4.2rem; 
  font-weight: 900; 
  line-height: 1; 
  color: var(--color-accent); 
  text-transform: uppercase; 
  margin-bottom: 0;
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

/* BOTONES */
.action-buttons-group { 
  display: flex; 
  gap: 16px; 
  align-items: flex-start;
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
  color: var(--color-primary); 
  border: none; 
  cursor: pointer;
  flex-shrink: 0;
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
  color: #fff; 
  border: none;
}

/* ESTILOS DE EDICIÓN DEL ENLACE DE DISCORD PARA ROLES */
.role-discord-editor-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}
.discord-button.mock-disabled {
  cursor: default;
  opacity: 0.9;
}
.discord-button.mock-disabled:hover {
  background-color: #5865F2;
  color: #fff;
}
.role-link-field-input {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 0.85rem;
  width: 100%;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.2s;
}
.role-link-field-input:focus {
  border-color: var(--color-accent);
}

.back-button {
  position: absolute; 
  top: 40px; 
  left: 40px; 
  display: inline-flex; 
  align-items: center; 
  gap: 10px;
  background-color: var(--color-light); 
  color: var(--color-primary); 
  padding: 12px 24px; 
  border-radius: 30px; 
  font-weight: 700; 
  text-decoration: none; 
  z-index: 100;
}

.loader-placeholder-fullscreen {
  height: 100vh; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  color: var(--color-accent); 
  font-weight: bold; 
  background-color: var(--color-primary);
}


/* ==========================================================================
   DISEÑO "BENTO BOX" (ESCRITORIO)
   ========================================================================== */
.gallery-safe-zone {
  width: 100%;
  margin-top: 20px;
  box-sizing: border-box;
}

.gallery-safe-zone :deep(ul) {
  display: grid !important;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)) !important;
  grid-auto-rows: 240px !important; 
  grid-auto-flow: dense !important; 
  gap: 16px !important;
  padding: 0 !important;
  margin: 0 !important;
  width: 100% !important;
  height: auto !important;
  min-width: 600px; 
}

.gallery-safe-zone :deep(li),
.gallery-safe-zone :deep(.gallery-item) {
  position: relative !important;
  top: auto !important; left: auto !important;
  transform: none !important;
  margin: 0 !important;
  padding: 0 !important;
  width: 100% !important;
  height: 100% !important;
  display: block !important;
  background: transparent !important;
  border: none !important;
  overflow: hidden !important;
  box-shadow: 0 10px 25px rgba(0,0,0,0.5) !important;
  border-radius: 12px !important;
}

.gallery-safe-zone :deep(li *),
.gallery-safe-zone :deep(.gallery-item *) {
  overflow: visible !important;
}

.gallery-safe-zone :deep(li:nth-child(3n+1)),
.gallery-safe-zone :deep(.gallery-item:nth-child(3n+1)) { grid-row: span 2 !important; }
.gallery-safe-zone :deep(li:nth-child(5n)),
.gallery-safe-zone :deep(.gallery-item:nth-child(5n)) { grid-column: span 2 !important; }

.gallery-safe-zone :deep(img) {
  display: block !important;
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important; 
  object-position: center !important;
  transform: none !important;
  transition: transform 0.3s ease, filter 0.3s ease !important;
  cursor: pointer;
}

.gallery-safe-zone :deep(img:hover) {
  transform: scale(1.05) !important;
  filter: brightness(1.1) !important;
}


@media (max-width: 1024px) {
  .detail-page-panoramic {
    overflow-y: auto; 
    overflow-x: hidden; 
    height: auto; 
    min-height: 100vh;
    display: block; 
    padding-bottom: 60px;
  }
  .panoramic-track {
    flex-direction: column; 
    height: auto; 
    padding: 100px 20px 40px 20px !important; 
    gap: 40px; 
  }
  .content-container-original {
    flex-direction: column; 
    width: 100%; 
    text-align: center; 
    margin-left: 0 !important; 
    gap: 30px;
  }
  .postal-card { 
    width: 100%; 
    max-width: 300px; 
    padding: 12px 12px 30px 12px; 
    margin: 0 auto; 
  }
  .info-wrapper { 
    width: 100%; 
    margin-bottom: 20px; 
  }
  
  .role-title { 
    font-size: 2.8rem; 
  }
  .role-subtitle { 
    font-size: 1.15rem; 
    margin-bottom: 20px; 
  }
  .role-description { 
    font-size: 1rem; 
    margin-bottom: 25px; 
  }
  
  .action-buttons-group { 
    flex-direction: column; 
    gap: 12px; 
    align-items: center;
  }
  .explore-button, .discord-button { 
    width: 100%; 
    height: 55px; 
  }
  .back-button { 
    position: absolute; 
    top: 20px; 
    left: 20px; 
  }

  .gallery-safe-zone {
    margin-top: 40px;
    padding-bottom: 60px;
    width: 100%;
    display: block;
  }

  .gallery-safe-zone :deep(*) {
    position: relative !important;
    top: auto !important;
    left: auto !important;
    right: auto !important;
    bottom: auto !important;
    transform: none !important;
    transition: none !important;
  }

  .gallery-safe-zone :deep(ul) {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr) !important;
    grid-auto-rows: auto !important;
    gap: 12px !important;
    width: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
    min-width: unset !important;
  }

  .gallery-safe-zone :deep(li),
  .gallery-safe-zone :deep(.gallery-item) {
    display: block !important;
    grid-row: span 1 !important; 
    grid-column: span 1 !important; 
    width: 100% !important;
    height: auto !important;
    aspect-ratio: 1 / 1 !important; 
    margin: 0 !important;
    padding: 0 !important;
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
    overflow: hidden !important; 
    border-radius: 12px !important;
  }

  .gallery-safe-zone :deep(li:nth-child(3n)),
  .gallery-safe-zone :deep(.gallery-item:nth-child(3n)) {
    grid-column: span 2 !important;
    aspect-ratio: 2 / 1 !important; 
  }
  .gallery-safe-zone :deep(li div),
  .gallery-safe-zone :deep(.gallery-item div),
  .gallery-safe-zone :deep(li a) {
    display: contents !important;
  }

  .gallery-safe-zone :deep(img) {
    display: block !important;
    width: 100% !important;
    height: 100% !important;
    max-width: none !important;
    margin: 0 !important;
    object-fit: cover !important; 
    border-radius: 0 !important; 
  }
}
</style>