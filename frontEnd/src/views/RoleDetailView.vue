<script setup lang='ts'>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import NotFound from '@/components/NotFound.vue';
import type * as ServerType from '../types/serverTypes.ts';
import { useServerService } from '@/services/serverService.ts';

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
 * Recibe la nueva imagen y la empuja como una tarjeta independiente al flujo de la derecha
 */
const handleAddImage = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0 || !role.value) return;

  const file = input.files[0];
  if (!file) return; 

  const reader = new FileReader();
  reader.onload = (e) => {
    const base64Result = e.target?.result as string;
    if (base64Result) {
      if (!role.value!.images) role.value!.images = [];
      role.value!.images.push(base64Result);
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

  <main 
    v-if="role" 
    class="detail-page-panoramic" 
    :class="{ 'is-centered': isCenteredLayout }"
    :style="{ '--bg-gradient': role.color }"
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
                <button class="img-action-btn delete-btn" @click="removeImageAtIndex(0)">
                  Eliminar
                </button>
              </div>
            </div>
            
            <div class="postal-footer">
              <span class="postal-brand">VISIT KINSFOLK</span>
              <span class="postal-index">01</span>
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
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                <path d="M13.545 2.907a13.227 13.227 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.214 12.214 0 0 0-3.658 0 8.258 8.258 0 0 0-.412-.833.051.051 0 0 0-.052-.025c-1.12.194-2.194.534-3.257 1.011a.041.041 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032c.001.014.01.028.021.037a13.276 13.276 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019c.308-.42.582-.863.818-1.329a.05.05 0 0 0-.01-.059.051.051 0 0 0-.018-.011 8.875 8.875 0 0 1-1.248-.595.05.05 0 0 1-.005-.083 6.07 6.07 0 0 0 .248-.195.051.051 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.052.052 0 0 1 .053.007c.09.066.174.132.248.195a.051.051 0 0 1-.004.083 9.11 9.11 0 0 1-1.248.595.052.052 0 0 0-.018.011.05.05 0 0 0-.01.059c.237.466.51.908.819 1.329a.05.05 0 0 0 .056.019 13.23 13.23 0 0 0 4.001-2.02.049.049 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.034.034 0 0 0-.02-.019Zm-7.726 7.394c-.797 0-1.453-.732-1.453-1.636s.642-1.636 1.453-1.636c.804 0 1.46.738 1.453 1.636 0 .904-.649 1.636-1.453 1.636Zm4.373 0c-.797 0-1.453-.732-1.453-1.636s.642-1.636 1.453-1.636c.804 0 1.46.738 1.453 1.636 0 .904-.649 1.636-1.453 1.636Z"/>
              </svg>
              <span>Unete al Discord</span>
            </a>
          </div>
        </div>
      </div>

      <div v-if="(role.images && role.images.length > 1) || designer.isEditing.value" class="extended-gallery-flow">
        <template v-for="(imgSrc, idx) in role.images" :key="idx">
          <div v-if="idx > 0" class="postal-wrapper">
            <div class="postal-card extra-polaroid" :style="`transform: rotate(${idx % 2 === 0 ? -1.5 : 2}deg);`">
              <div class="image-viewport">
                <img :src="imgSrc" :alt="role.title" class="postal-image" />
                
                <div v-if="designer.isEditing.value" class="image-actions-overlay">
                  <button class="img-action-btn delete-btn" @click="removeImageAtIndex(idx)">
                    Eliminar Marco
                  </button>
                </div>
              </div>
              
              <div class="postal-footer">
                <span class="postal-brand">VISIT KINSFOLK</span>
                <span class="postal-index">0{{ idx + 1 }}</span>
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

  <NotFound v-else
    title="Role not found"
    description="El rol que buscas no se encuentra registrado en nuestro ecosistema."
  >
  </NotFound>
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

/* CONTENEDOR ORIGINAL - CENTRADO PERMANENTE EN PANTALLA */
.content-container-original {
  display: flex;
  flex-direction: row;
  width: 1200px;
  align-items: center;
  justify-content: space-between;
  gap: 80px;
  flex-shrink: 0; 
  
  /* El margen izquierdo dinámico mantiene este bloque perfectamente en el medio del viewport */
  margin-left: calc(50vw - 600px); 
}

/* Cuando la vista está forzada a centrarse por completo porque no hay scroll extra */
.detail-page-panoramic.is-centered .content-container-original {
  margin-left: auto;
  margin-right: auto;
}

/* FLUJO DE LAS NUEVAS IMÁGENES ADICIONALES HACIA LA DERECHA */
.extended-gallery-flow {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 60px;
  flex-shrink: 0;
  padding-left: 60px; 
}

/* --- TARJETAS POLAROID --- */
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
  justify-content: space-between;
}
.postal-brand {
  font-family: 'Impact', 'Arial Black', sans-serif;
  font-size: 1.3rem;
  color: #c4c4c4;
  letter-spacing: 1.5px;
}
.postal-index {
  font-family: 'Impact', sans-serif;
  font-size: 1.3rem;
  color: #ecaf44;
}

/* --- PLACEHOLDER DINÁMICO PARA AGREGAR IMÁGENES --- */
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

/* --- CAPA OVERLAY ACCIONES --- */
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

/* --- INFORMACIÓN Y TEXTOS ORIGINALES --- */
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

/* Botones inferiores */
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
}
.explore-button {
  background-color: var(--color-accent);
  color: #060f16;
  border: none;
}
.explore-button:hover {
  background-color: #f3e9dc;
  transform: translateY(-2px);
}
.discord-button {
  background-color: #5865F2;
  color: #ffffff;
  border: none;
}
.discord-button:hover {
  background-color: #4752C4;
  transform: translateY(-2px);
}

.back-button {
  position: fixed;
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

/* --- RESPONSIVE FALLBACK --- */
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
  .info-wrapper {
    width: 100%;
  }
  .role-description { margin: 0 auto 30px auto; }
  .extended-gallery-flow {
    flex-direction: column;
    width: 100%;
    gap: 40px;
    padding-left: 0;
  }
  .postal-card, .add-postal-placeholder {
    width: 100%;
    max-width: 420px;
  }
  .action-buttons-group { flex-direction: column; }
  .explore-button, .discord-button { width: 100%; }
}

</style>