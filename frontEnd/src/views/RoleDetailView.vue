<script setup lang='ts'>
import { ref, onMounted, computed, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import NotFound from '@/components/miscellaneous/NotFound.vue';
import BuilderToolbar from '@/components/editor/BuilderToolbar.vue';
import ImageGalleryManager from '@/components/editor/ImageGalleryManager.vue';

// Importamos nuestros nuevos componentes refactorizados
import RolePolaroid from '@/components/role/RolePolaroid.vue';
import RoleHeaderInfo from '@/components/role/RoleHeaderInfo.vue';
import RoleActionButtons from '@/components/role/RoleActionButtons.vue';

// Composables
import { useDesigner } from '@/composables/useDesigner';
import { useRoleDetail } from '@/composables/useRoleDetail';
import { useServerService } from '@/services/serverService';

// Importamos la autenticación global
import { useAuth } from '@/composables/useAuth';

const route = useRoute();
const containerRef = ref<HTMLElement | null>(null);

const routeServerId = Array.isArray(route.params.serverId)
  ? route.params.serverId[0]
  : route.params.serverId;
const currentServerId = routeServerId || 'leo';

// Lógica de datos
const { initBasic } = useServerService();
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

// Validación de seguridad centralizada (reemplaza la verificación por URL)
const { isAuthenticated } = useAuth();
const isAuthorizedDesigner = computed(() => isAuthenticated.value);

onMounted(async () => {
  await initBasic();
  await fetchRoleData();
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
    📝 Modo Diseñador ({{ role.basic.id.toUpperCase() }})
  </button>

  <div v-if="role">
    <main
      ref="containerRef"
      class="detail-page-panoramic"
      :style="{ '--bg-gradient': role.addit.color }"
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
          
          <!-- COMPONENTE 1: Polaroid -->
          <RolePolaroid 
            :imageSrc="role.images && role.images[0]" 
            :altText="role.basic.title" 
          />

          <!-- COMPONENTE 2: Textos y Editables -->
          <RoleHeaderInfo :role="role" :isEditing="designer.isEditing.value">
            
            <!-- COMPONENTE 3: Botones y Enlace de Discord Inyectados -->
            <RoleActionButtons :role="role" :isEditing="designer.isEditing.value" />
          
          </RoleHeaderInfo>

        </div>

        <!-- ZONA DE GALERÍA -->
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

  <div v-else class="loading-state">
    <p>Decryption of Server Directives in progress...</p>
    <div class="loading-spinner"></div>
  </div>

  <!-- LIGHTBOX MODAL -->
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
   INTERFAZ LIGHTBOX Y LAYOUT PRINCIPAL
   ========================================================================== */
.image-lightbox-modal {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(4, 10, 15, 0.96); backdrop-filter: blur(10px);
  z-index: 99999; display: flex; align-items: center; justify-content: center;
}
.lightbox-content { max-width: 90%; max-height: 85%; display: flex; align-items: center; justify-content: center; }
.lightbox-full-image { max-width: 100%; max-height: 100vh; object-fit: contain; border-radius: 4px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8); }
.lightbox-close-btn { position: absolute; top: 30px; right: 40px; background: none; border: none; color: #fff; font-size: 2.5rem; cursor: pointer; transition: color 0.2s; }
.lightbox-close-btn:hover { color: var(--color-accent); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.designer-trigger {
  position: fixed; top: 24px; right: 24px; z-index: 10000;
  background: rgba(236, 175, 68, 0.12); color: var(--color-accent);
  border: 1px solid var(--color-accent); padding: 10px 20px;
  border-radius: 8px; cursor: pointer; font-weight: 600;
  backdrop-filter: blur(8px); transition: all 0.2s;
}
.designer-trigger:hover { background: var(--color-accent); color: #111; }

.detail-page-panoramic {
  width: 100vw; height: 100vh;
  background: linear-gradient(135deg, var(--bg-gradient) 0%, var(--color-primary) 100%), var(--color-primary);
  overflow-y: hidden; overflow-x: auto; display: flex; align-items: center; box-sizing: border-box;
}
.panoramic-track { display: flex; flex-direction: row; align-items: center; height: 100%; width: 100%; padding-right: 80px; }
.content-container-original {
  display: flex; flex-direction: row; width: 1200px; align-items: center;
  justify-content: space-between; gap: 80px; flex-shrink: 0; margin-left: calc(50vw - 600px);
}
.back-button {
  position: absolute; top: 40px; left: 40px; display: inline-flex; align-items: center; gap: 10px;
  background-color: var(--color-light); color: var(--color-primary); padding: 12px 24px;
  border-radius: 30px; font-weight: 700; text-decoration: none; z-index: 100;
}

/* CARGA */
.loading-state {
  height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;
  color: var(--color-accent); font-weight: bold; background-color: var(--color-primary); gap: 15px;
}
.loading-spinner {
  width: 40px; height: 40px; border: 4px solid rgba(236, 175, 68, 0.2);
  border-top-color: var(--color-accent); border-radius: 50%; animation: spin 1s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ==========================================================================
   DISEÑO "BENTO BOX" (ESCRITORIO)
   ========================================================================== */
.gallery-safe-zone { width: 100%; margin-top: 20px; box-sizing: border-box; }
.gallery-safe-zone :deep(ul) {
  display: grid !important; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)) !important;
  grid-auto-rows: 240px !important; grid-auto-flow: dense !important; gap: 16px !important;
  padding: 0 !important; margin: 0 !important; width: 100% !important; height: auto !important; min-width: 600px;
}
.gallery-safe-zone :deep(li), .gallery-safe-zone :deep(.gallery-item) {
  position: relative !important; top: auto !important; left: auto !important; transform: none !important; margin: 0 !important; padding: 0 !important; width: 100% !important; height: 100% !important; display: block !important; background: transparent !important; border: none !important; overflow: hidden !important; box-shadow: 0 10px 25px rgba(0,0,0,0.5) !important; border-radius: 12px !important;
}
.gallery-safe-zone :deep(li *), .gallery-safe-zone :deep(.gallery-item *) { overflow: visible !important; }
.gallery-safe-zone :deep(li:nth-child(3n+1)), .gallery-safe-zone :deep(.gallery-item:nth-child(3n+1)) { grid-row: span 2 !important; }
.gallery-safe-zone :deep(li:nth-child(5n)), .gallery-safe-zone :deep(.gallery-item:nth-child(5n)) { grid-column: span 2 !important; }
.gallery-safe-zone :deep(img) {
  display: block !important; width: 100% !important; height: 100% !important; object-fit: cover !important; object-position: center !important; transform: none !important; transition: transform 0.3s ease, filter 0.3s ease !important; cursor: pointer;
}
.gallery-safe-zone :deep(img:hover) { transform: scale(1.05) !important; filter: brightness(1.1) !important; }

/* MEDIA QUERIES (MÓVIL) */
@media (max-width: 1024px) {
  .detail-page-panoramic { overflow-y: auto; overflow-x: hidden; height: auto; min-height: 100vh; display: block; padding-bottom: 60px; }
  .panoramic-track { flex-direction: column; height: auto; padding: 100px 20px 40px 20px !important; gap: 40px; }
  .content-container-original { flex-direction: column; width: 100%; text-align: center; margin-left: 0 !important; gap: 30px; }
  .back-button { position: absolute; top: 20px; left: 20px; }

  /* Ajustes Galería Móvil */
  .gallery-safe-zone { margin-top: 40px; padding-bottom: 60px; width: 100%; display: block; }
  .gallery-safe-zone :deep(*) { position: relative !important; top: auto !important; left: auto !important; right: auto !important; bottom: auto !important; transform: none !important; transition: none !important; }
  .gallery-safe-zone :deep(ul) { display: grid !important; grid-template-columns: repeat(2, 1fr) !important; grid-auto-rows: auto !important; gap: 12px !important; width: 100% !important; padding: 0 !important; margin: 0 !important; min-width: unset !important; }
  .gallery-safe-zone :deep(li), .gallery-safe-zone :deep(.gallery-item) { display: block !important; grid-row: span 1 !important; grid-column: span 1 !important; width: 100% !important; height: auto !important; aspect-ratio: 1 / 1 !important; margin: 0 !important; padding: 0 !important; background: transparent !important; border: none !important; box-shadow: none !important; overflow: hidden !important; border-radius: 12px !important; }
  .gallery-safe-zone :deep(li:nth-child(3n)), .gallery-safe-zone :deep(.gallery-item:nth-child(3n)) { grid-column: span 2 !important; aspect-ratio: 2 / 1 !important; }
  .gallery-safe-zone :deep(li div), .gallery-safe-zone :deep(.gallery-item div), .gallery-safe-zone :deep(li a) { display: contents !important; }
  .gallery-safe-zone :deep(img) { display: block !important; width: 100% !important; height: 100% !important; max-width: none !important; margin: 0 !important; object-fit: cover !important; border-radius: 0 !important; }
}
</style>