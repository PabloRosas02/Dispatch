<script setup lang="ts">
import { ref, onMounted, computed, nextTick, watch } from 'vue';
import { useRoute } from 'vue-router';

// Componentes
import BuilderToolbar from '@/components/editor/BuilderToolbar.vue';
import ImageGalleryManager from '@/components/editor/ImageGalleryManager.vue';

// Composables
import { useDesigner } from '@/composables/useDesigner';
import { useNews } from '@/composables/useNews';
import type { NewsArticle } from '@/types/serverTypes';

const route = useRoute();
const CACHE_KEY = 'news_page_general_config';
const LOCAL_STORAGE_KEY = `backup_cache_${CACHE_KEY}`;

// Instanciamos la lógica aislada
const {
  newsList, bLoading, searchQuery, currentPage, currentArticle,
  totalPages, paginatedNewsList, embedVideoUrl, fetchNews,
  createNewArticleTemplate, deleteCurrentArticle, handleAddImage,
  removeImageAtIndex, selectArticleFromPage, changePage
} = useNews(CACHE_KEY);

// Lógica del Diseñador
const designer = useDesigner({ cacheKey: CACHE_KEY });
const isAuthorizedDesigner = computed(() => route.query.mode === 'admin-designer');

// Lógica UI específica de la vista
const isSidebarOpen = ref<boolean>(true);

// Variable para el Lightbox (Expandir Imagen)
const activeLightboxImage = ref<string | null>(null);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const handleArticleSelection = (item: NewsArticle) => {
  selectArticleFromPage(item);
  if (typeof window !== 'undefined' && window.innerWidth <= 1024) {
    isSidebarOpen.value = false;
  }
};

// CARGA INICIAL: ¡Solo hace fetch a la API una sola vez al inicio!
onMounted(() => {
  if (!newsList.value || newsList.value.length === 0) {
    const localBackup = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (localBackup) {
      const parsed = JSON.parse(localBackup);
      if (parsed && parsed.news) {
        newsList.value = parsed.news;
        bLoading.value = false;
        return; // Evita el fetch si ya tenemos datos locales guardados
      }
    }
    // Si no hay RAM ni LocalStorage, hace la petición única al servidor
    fetchNews();
  }
});

// RESPALDO Y AUTO-SELECCIÓN SEGURA PARA TYPESCRIPT
watch(
  () => newsList.value,
  (newVal) => {
    if (newVal && newVal.length > 0) {
      // Guardamos en el disco local para evitar futuras peticiones de red
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ news: newVal }));

      // Extraemos el primer artículo de forma segura para complacer a TypeScript
      const firstArticle = newVal[0];
      if (firstArticle && !currentArticle.value) {
        selectArticleFromPage(firstArticle);
      }
    }
  },
  { immediate: true }
);

const handleSaveOrEdit = async () => {
  if (!currentArticle.value) return;
  
  designer.toggleEdit(currentArticle, {
    title: ref(document.querySelector('.news-title')),
    subtitle: ref(document.querySelector('.news-subtitle')),
    content: ref(document.querySelector('.news-content-body'))
  });

  if (!designer.isEditing.value) {
    try {
      await nextTick();
      bLoading.value = true;
      
      const payload = { key: CACHE_KEY, value: { news: newsList.value } };
      const response = await fetch(`http://localhost:3000/api/cache/${CACHE_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        await fetch(`http://localhost:3000/api/cache/${CACHE_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: CACHE_KEY, data: { news: newsList.value } })
        });
      }
      
      // Actualizar el respaldo local tras un guardado exitoso
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ news: newsList.value }));
    } catch (error) {
      console.error('[NewsView.vue] Error crítico al guardar:', error);
    } finally {
      bLoading.value = false;
    }
  }
};

// Inicialización segura garantizando el ciclo de renderizado del contenedor
const handleInitializeFirstArticle = async () => {
  createNewArticleTemplate();
  await nextTick();
  handleSaveOrEdit();
};
</script>

<template>
  <BuilderToolbar 
    v-if="isAuthorizedDesigner && designer.isEditing.value" 
    :designer="designer" 
    :onSave="handleSaveOrEdit" 
  />

  <div class="news-panoramic-layout">
    
    <header class="news-view-header">
      <div class="header-titles">
        <h1 class="section-tag">Zona Comunicados</h1>
      </div>
      
      <div class="header-actions">
        <a 
          v-if="isAuthorizedDesigner && newsList.length > 0" 
          href="#" 
          class="edit-mode-link" 
          @click.prevent="handleSaveOrEdit"
        >
          {{ designer.isEditing.value ? '👁️ Ver Vista Pública' : '⚙️ Entrar a Modo Diseñador' }}
        </a>
        
        <a
          v-if="isAuthorizedDesigner && newsList.length === 0"
          href="#"
          class="edit-mode-link"
          @click.prevent="handleInitializeFirstArticle"
        >
          ➕ Inicializar Primer Boletín
        </a>
      </div>
    </header>

    <div class="loader-placeholder-inline" v-if="bLoading && newsList.length === 0">
      <span>Sincronizando Boletines...</span>
    </div>

    <template v-else>
      <div v-if="newsList.length === 0" class="empty-news-state">
        <div class="empty-card">
          <p class="empty-msg">No hay comunicados o boletines publicados en este momento.</p>
          <span class="empty-sub">Vuelve más tarde para leer las últimas novedades.</span>
        </div>
      </div>

      <div 
        v-else 
        class="news-grid-container"
        :class="{ 'sidebar-collapsed': !isSidebarOpen }"
      >
        <div class="sidebar-overlay" @click="toggleSidebar"></div>

        <button 
          v-if="newsList.length > 0" 
          class="sidebar-toggle-arrow" 
          :class="{ 'collapsed': !isSidebarOpen }"
          @click="toggleSidebar"
          title="Historial de boletines"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="arrow-svg">
            <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
          </svg>
        </button>

        <aside class="news-sidebar">
          <h3 class="sidebar-heading">Historial de Boletines</h3>
          
          <div class="sidebar-search-container">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Buscar por nombre, fecha o autor..." 
              class="sidebar-search-input"
            />
            <span v-if="searchQuery" class="clear-search-icon" @click="searchQuery = ''">✕</span>
          </div>

          <div v-if="isAuthorizedDesigner && designer.isEditing.value" class="sidebar-crud-zone">
            <button class="btn-crud add" @click="createNewArticleTemplate">➕ Nueva</button>
            <button class="btn-crud delete" @click="deleteCurrentArticle">🗑️ Eliminar</button>
          </div>

          <div class="sidebar-track">
            <div 
              v-for="item in paginatedNewsList" 
              :key="item.id"
              class="sidebar-card"
              :class="{ 'active': currentArticle && item.id === currentArticle.id }"
              @click="handleArticleSelection(item)"
            >
              <span class="card-tag">{{ item.category }}</span>
              <h4 class="card-title" v-html="item.title"></h4>
              <div class="card-footer-info">
                <span class="card-date">{{ item.date }}</span>
                <span class="card-author">✍️ {{ item.author }}</span>
              </div>
            </div>

            <div v-if="paginatedNewsList.length === 0" class="no-search-results">
              No se encontraron boletines que coincidan.
            </div>
          </div>

          <div v-if="totalPages > 1" class="sidebar-pagination">
            <button 
              class="pag-btn" 
              :disabled="currentPage === 1" 
              @click="changePage(currentPage - 1)"
              title="Anterior"
            >◀</button>
            
            <div class="pag-numeric-indicator">
              <span class="current-indicator">{{ currentPage }}</span> 
              <span class="divider">/</span> 
              <span class="total-indicator">{{ totalPages }}</span>
            </div>

            <button 
              class="pag-btn" 
              :disabled="currentPage === totalPages" 
              @click="changePage(currentPage + 1)"
              title="Siguiente"
            >▶</button>
          </div>
        </aside>

        <main class="news-content-area" v-if="currentArticle">
          <article class="newsletter-sheet">
            
            <div class="newsletter-meta">
              <input 
                v-if="isAuthorizedDesigner && designer.isEditing.value" 
                type="text" 
                v-model="currentArticle.category" 
                class="inline-input-meta tag"
              />
              <span v-else class="meta-tag">{{ currentArticle.category }}</span>

              <span class="meta-details">
                {{ currentArticle.date }} • Por 
                <input 
                  v-if="isAuthorizedDesigner && designer.isEditing.value" 
                  type="text" 
                  v-model="currentArticle.author" 
                  class="inline-input-meta author"
                />
                <strong v-else>{{ currentArticle.author }}</strong>
              </span>
            </div>

            <h1 
              v-if="!(isAuthorizedDesigner && designer.isEditing.value)" 
              class="news-title" 
              v-html="currentArticle.title"
            ></h1>
            <div 
              v-else 
              contenteditable="true" 
              class="news-title editable-container" 
              @input="currentArticle.title = ($event.target as HTMLElement).innerText"
            >
              {{ currentArticle.title }}
            </div>

            <h2 
              v-if="!(isAuthorizedDesigner && designer.isEditing.value)" 
              class="news-subtitle" 
              v-html="currentArticle.subtitle"
            ></h2>
            <div 
              v-else 
              contenteditable="true" 
              class="news-subtitle editable-container" 
              @input="currentArticle.subtitle = ($event.target as HTMLElement).innerText"
            >
              {{ currentArticle.subtitle }}
            </div>

            <hr class="newsletter-separator" />

            <div class="newsletter-gallery-section">
              <ImageGalleryManager 
                v-if="currentArticle.images" 
                v-model:images="currentArticle.images" 
                :isEditing="isAuthorizedDesigner && designer.isEditing.value" 
                variant="normal"
                @add-image="handleAddImage"
                @remove-image="removeImageAtIndex"
                @open-lightbox="activeLightboxImage = $event"
              />
            </div>

            <div v-if="isAuthorizedDesigner && designer.isEditing.value" class="newsletter-editor-extensions">
              <div class="extension-input-group">
                <label>Enlace o ID de Video (YouTube):</label>
                <input 
                  type="text" 
                  v-model="currentArticle.videoUrl" 
                  placeholder="Ej. https://www.youtube.com/watch?v=..." 
                  class="extension-field"
                />
              </div>
            </div>

            <div v-if="embedVideoUrl" class="newsletter-video-wrapper">
              <iframe 
                :src="embedVideoUrl" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen
                class="video-frame"
              ></iframe>
            </div>

            <p 
              v-if="!(isAuthorizedDesigner && designer.isEditing.value)" 
              class="news-content-body" 
              v-html="currentArticle.content"
            ></p>
            <div 
              v-else 
              contenteditable="true" 
              class="news-content-body editable-container" 
              @input="currentArticle.content = ($event.target as HTMLElement).innerHTML"
            >
              {{ currentArticle.content }}
            </div>

          </article>
        </main>
      </div>
    </template>

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
/* LIGHTBOX Y GENERAL */
.image-lightbox-modal {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(4, 10, 15, 0.96); backdrop-filter: blur(10px);
  z-index: 99999; display: flex; align-items: center; justify-content: center;
}
.lightbox-content { max-width: 90%; max-height: 85%; display: flex; align-items: center; justify-content: center; }
.lightbox-full-image { max-width: 100%; max-height: 100vh; object-fit: contain; border-radius: 4px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8); }
.lightbox-close-btn {
  position: absolute; top: 30px; right: 40px; background: none; border: none;
  color: #fff; font-size: 2.5rem; cursor: pointer; transition: color 0.2s;
}
.lightbox-close-btn:hover { color: var(--color-accent, #ecaf44); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* DISEÑO NEWS */
.news-panoramic-layout {
  min-height: 100vh;
  background-color: #060f16;
  color: #ffffff;
  padding: 40px;
  box-sizing: border-box;
}

.loader-placeholder-inline {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 120px 20px;
  color: var(--color-accent, #ecaf44);
  font-weight: 600;
  font-size: 1.2rem;
  letter-spacing: 0.5px;
}

.news-view-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 1400px;
  margin: 0 auto 10px auto;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 25px;
}
.header-titles {
  width: 100%;
  margin-bottom: 8px;
}
.section-tag {
  font-size: 2.6rem;
  font-weight: 700;
  font-style: italic;
  color: var(--color-accent, #ecaf44);
  margin: 0;
  padding: 0;
  letter-spacing: 0.5px;
}
.header-actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.edit-mode-link {
  color: #798c9c;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  transition: color 0.2s;
}
.edit-mode-link:hover {
  color: var(--color-accent, #ecaf44);
}

.news-grid-container {
  position: relative;
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 40px;
  max-width: 1400px;
  margin: 30px auto 0 auto;
  transition: grid-template-columns 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.news-grid-container.sidebar-collapsed {
  grid-template-columns: 0px 1fr;
  gap: 0px;
}

.sidebar-toggle-arrow {
  position: absolute;
  top: 30px;
  left: 300px;
  z-index: 10;
  width: 36px;
  height: 36px;
  background: #0d1721;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: var(--color-accent, #ecaf44);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), left 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s;
}
.sidebar-toggle-arrow:hover {
  background: #142330;
  border-color: var(--color-accent, #ecaf44);
}
.arrow-svg {
  width: 22px;
  height: 22px;
  transition: transform 0.3s ease;
}

.sidebar-toggle-arrow.collapsed {
  left: -18px;
}
.sidebar-toggle-arrow.collapsed .arrow-svg {
  transform: rotate(180deg);
}

.news-sidebar {
  background: rgba(255, 255, 255, 0.01);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 20px;
  height: fit-content;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.news-grid-container.sidebar-collapsed .news-sidebar {
  padding: 0;
  border: none;
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
}

.sidebar-overlay {
  display: none;
}

.sidebar-search-container {
  position: relative;
  width: 100%;
  margin-bottom: 15px;
}
.sidebar-search-input {
  width: 100%;
  background: #060f16;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;
  padding: 10px 32px 10px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  box-sizing: border-box;
  transition: border-color 0.2s;
}
.sidebar-search-input:focus {
  border-color: var(--color-accent, #ecaf44);
  outline: none;
}
.clear-search-icon {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c7a86;
  cursor: pointer;
  font-size: 0.8rem;
  transition: color 0.2s;
}
.clear-search-icon:hover {
  color: var(--color-accent, #ecaf44);
}
.no-search-results {
  font-size: 0.85rem;
  color: #6c7a86;
  text-align: center;
  padding: 20px 0;
  font-style: italic;
}

.sidebar-pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}
.pag-btn {
  background: #142330;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--color-accent, #ecaf44);
  padding: 6px 12px;
  font-size: 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s, opacity 0.2s;
}
.pag-btn:hover:not(:disabled) {
  background: #1e3245;
  border-color: var(--color-accent, #ecaf44);
}
.pag-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.pag-numeric-indicator {
  font-size: 0.85rem;
  font-weight: 600;
  color: #798c9c;
  display: flex;
  gap: 4px;
}
.current-indicator {
  color: var(--color-accent, #ecaf44);
}
.divider {
  color: rgba(255, 255, 255, 0.2);
}

.empty-news-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 20px;
}
.empty-card {
  background: #0d1721;
  border: 1px solid rgba(255,255,255,0.05);
  padding: 40px;
  text-align: center;
  border-radius: 6px;
  max-width: 500px;
}
.empty-msg {
  font-size: 1.2rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
}
.empty-sub {
  font-size: 0.9rem;
  color: #6c7a86;
}

.sidebar-crud-zone {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.btn-crud {
  flex: 1;
  padding: 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid transparent;
  text-transform: uppercase;
}
.btn-crud.add {
  background: rgba(46, 204, 113, 0.1);
  color: #2ecc71;
  border-color: rgba(46, 204, 113, 0.2);
}
.btn-crud.delete {
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
  border-color: rgba(231, 76, 60, 0.2);
}

.editable-container {
  border: 1px dashed var(--color-accent, #ecaf44);
  outline: none;
  padding: 8px 12px;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.01);
  text-align: left;
}

.sidebar-heading {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #6c7a86;
  margin-bottom: 15px;
  white-space: nowrap;
}
.sidebar-track {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.sidebar-card {
  padding: 16px;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 6px;
  cursor: pointer;
  border-left: 3px solid transparent;
  transition: all 0.2s;
}
.sidebar-card:hover, .sidebar-card.active {
  background: rgba(255, 255, 255, 0.04);
  border-left-color: var(--color-accent, #ecaf44);
}
.card-tag {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--color-accent, #ecaf44);
  text-transform: uppercase;
}
.card-title {
  margin: 6px 0;
  font-size: 0.95rem;
  line-height: 1.3;
}
.card-footer-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 4px;
}
.card-date, .card-author {
  font-size: 0.72rem;
  color: #526270;
}
.card-author {
  max-width: 110px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.newsletter-sheet {
  background: #0d1721;
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 50px;
  border-radius: 4px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4);
}
.newsletter-meta {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
}
.meta-tag {
  background: var(--color-accent, #ecaf44);
  color: #060f16;
  font-size: 0.75rem;
  font-weight: 900;
  padding: 3px 10px;
  text-transform: uppercase;
}
.meta-details {
  font-size: 0.85rem;
  color: #798c9c;
}

.inline-input-meta {
  background: rgba(255,255,255,0.05);
  border: 1px dashed rgba(236, 175, 68, 0.4);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.85rem;
}
.inline-input-meta.tag {
  color: var(--color-accent, #ecaf44);
  font-weight: bold;
  text-transform: uppercase;
  width: 120px;
}
.inline-input-meta.author {
  width: 100px;
}

.news-title {
  font-size: 3rem;
  font-weight: 900;
  color: #ffffff;
  line-height: 1.1;
  text-transform: uppercase;
  margin-bottom: 12px;
}
.news-subtitle {
  font-size: 1.3rem;
  font-weight: 600;
  color: #a0b0bd;
  margin-bottom: 30px;
}
.newsletter-separator {
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin: 30px 0;
}
.news-content-body {
  font-size: 1.15rem;
  line-height: 1.8;
  color: #d1dce5;
}

.newsletter-editor-extensions {
  background: rgba(236, 175, 68, 0.03);
  border: 1px dashed rgba(236, 175, 68, 0.2);
  padding: 20px;
  border-radius: 6px;
  margin-bottom: 30px;
}
.extension-input-group label {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--color-accent, #ecaf44);
  display: block;
  margin-bottom: 6px;
}
.extension-field {
  width: 100%;
  background: #060f16;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 10px;
  color: white;
  border-radius: 4px;
}

.newsletter-video-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  margin-bottom: 35px;
  border-radius: 4px;
  overflow: hidden;
}
.video-frame {
  width: 100%;
  height: 100%;
}


/* ==========================================================================
   GALERÍA: IMAGEN TIPO BANNER CENTRADA Y REDUCIDA (SIN POLAROID)
   ========================================================================== */
.newsletter-gallery-section {
  width: 100%;
  margin: 30px 0;
  display: flex;
  justify-content: center;
}

.newsletter-gallery-section :deep(.gallery-clean-image) {
  transform: none !important;
  filter: none !important;
}

.newsletter-gallery-section :deep(.extended-gallery-flow) {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  gap: 25px !important;
  padding: 0 !important;
  margin: 0 !important;
  width: 100% !important;
}

.newsletter-gallery-section :deep(.postal-wrapper),
.newsletter-gallery-section :deep(.gallery-clean-image),
.newsletter-gallery-section :deep(.add-postal-placeholder) {
  width: 100% !important;
  max-width: 85% !important;
  display: block !important;
  margin: 0 auto !important;
  padding: 0 !important;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

.newsletter-gallery-section :deep(.image-viewport) {
  width: 100% !important;
  height: auto !important;
  aspect-ratio: auto !important; 
  background: transparent !important;
  border-radius: 6px !important;
  overflow: hidden !important;
  position: relative !important;
}

.newsletter-gallery-section :deep(.postal-image) {
  width: 100% !important;
  height: auto !important;
  max-height: 500px !important;
  object-fit: cover !important;
  display: block !important;
  border: none !important;
  border-radius: 6px !important;
  margin: 0 !important;
  padding: 0 !important;
}

.newsletter-gallery-section :deep(.add-image-btn-zone) {
  border: 1px dashed rgba(102, 192, 244, 0.5) !important;
  background: rgba(102, 192, 244, 0.05) !important;
  color: #66c0f4 !important;
  min-height: 120px !important;
  border-radius: 6px !important;
}


/* RESPONSIVE DESIGN (MÓVIL) 
========================================================= */
@media (max-width: 1024px) {
  .news-panoramic-layout {
    padding: 20px 15px;
  }
  
  .news-grid-container {
    grid-template-columns: 1fr;
    gap: 0px;
  }
  
  .news-grid-container.sidebar-collapsed {
    grid-template-columns: 1fr;
  }

  .news-sidebar {
    position: fixed;
    top: 72px; 
    left: 0; 
    width: 320px; 
    max-width: 85vw;
    height: calc(100vh - 72px); 
    z-index: 99;
    background: #0d1721;
    box-shadow: 5px 0 30px rgba(0, 0, 0, 0.8);
    border-radius: 0;
    border: none;
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    transform: translateX(0);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow-y: auto; 
    padding: 20px 15px 90px 15px; 
    box-sizing: border-box;
  }

  .news-grid-container.sidebar-collapsed .news-sidebar {
    transform: translateX(-100%);
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }

  .sidebar-overlay {
    display: block;
    position: fixed;
    top: 72px; 
    left: 0;
    width: 100vw;
    height: calc(100vh - 72px);
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
    z-index: 90;
    opacity: 1;
    pointer-events: auto;
    transition: opacity 0.3s ease;
  }
  
  .news-grid-container.sidebar-collapsed .sidebar-overlay {
    opacity: 0;
    pointer-events: none;
  }

  .sidebar-toggle-arrow {
    position: fixed;
    top: 95px; 
    left: 310px;
  }
  
  .sidebar-toggle-arrow.collapsed {
    left: 15px;
  }

  .newsletter-sheet {
    padding: 30px 20px;
  }

  .news-title {
    font-size: 2.2rem;
  }

  .newsletter-gallery-section :deep(.postal-wrapper),
  .newsletter-gallery-section :deep(.gallery-clean-image),
  .newsletter-gallery-section :deep(.add-postal-placeholder) {
    max-width: 100% !important; 
  }
}

@media (max-width: 400px) {
  .sidebar-toggle-arrow {
    left: 80vw;
  }
}
</style>