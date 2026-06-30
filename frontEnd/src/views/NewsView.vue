<script setup lang="ts">
import { ref, onMounted, computed, nextTick, watch } from 'vue';
import { useRoute } from 'vue-router';

// Componentes y lógica de edición
import BuilderToolbar from '@/components/editor/BuilderToolbar.vue';
import ImageGalleryManager from '@/components/editor/ImageGalleryManager.vue';
import { useDesigner } from '@/composables/useDesigner';

// IMPORTACIÓN OFICIAL DESDE TU ARCHIVO DE TIPOS CENTRALIZADO
import type { NewsArticle } from '@/types/serverTypes';

const route = useRoute();
const newsList = ref<NewsArticle[]>([]);
const activeIndex = ref<number>(0);
const bLoading = ref<boolean>(true);

// Controles de UI y Filtros
const isSidebarOpen = ref<boolean>(true);
const searchQuery = ref<string>('');

// Paginación (10 en 10)
const currentPage = ref<number>(1);
const ITEMS_PER_PAGE = 10;

const CACHE_KEY = 'news_page_general_config';
const designer = useDesigner({ cacheKey: CACHE_KEY });

// Computados de Validación y Selección
const isAuthorizedDesigner = computed(() => route.query.mode === 'admin-designer');
const currentArticle = computed(() => newsList.value[activeIndex.value] || null);

// Filtrado de Boletines (Optimizado para evitar búsquedas repetitivas vacías)
const filteredNewsList = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) return newsList.value;
  
  return newsList.value.filter(item => 
    item.title.toLowerCase().includes(query) ||
    item.date.toLowerCase().includes(query) ||
    item.author.toLowerCase().includes(query)
  );
});

// Paginación Computada
const totalPages = computed(() => Math.ceil(filteredNewsList.value.length / ITEMS_PER_PAGE) || 1);

const paginatedNewsList = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE;
  return filteredNewsList.value.slice(start, start + ITEMS_PER_PAGE);
});

// Resetear paginación al buscar
watch(searchQuery, () => {
  currentPage.value = 1;
});

// Formateador robusto de URLs de YouTube mediante Expresión Regular
const embedVideoUrl = computed(() => {
  if (!currentArticle.value?.videoUrl) return '';
  const url = currentArticle.value.videoUrl;

  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);

  return (match && match[2]?.length === 11)
    ? `https://www.youtube.com/embed/${match[2]}`
    : url;
});

// Persistencia: Carga inicial desde la API de caché
onMounted(async () => {
  try {
    const response = await fetch(`http://localhost:3000/api/cache/${CACHE_KEY}`);
    if (response.status === 404) {
      newsList.value = [];
      return;
    }

    const result = await response.json();
    const rawData = result.data ?? result.value ?? result;

    if (rawData && Array.isArray(rawData.news)) {
      newsList.value = rawData.news;
    } else if (Array.isArray(rawData)) {
      newsList.value = rawData;
    } else {
      newsList.value = [];
    }
  } catch (error) {
    console.error('[NewsView.vue] Error al cargar noticias de database.json:', error);
    newsList.value = [];
  } finally {
    bLoading.value = false;
  }
});

// Persistencia: Guardar o Editar (Sincronización Limpia)
const handleSaveOrEdit = async () => {
  if (!currentArticle.value) return;
  
  // Pasamos referencias limpias de los elementos al compositor
  designer.toggleEdit(currentArticle, {
    title: ref(document.querySelector('.news-title')),
    subtitle: ref(document.querySelector('.news-subtitle')),
    content: ref(document.querySelector('.news-content-body'))
  });

  if (!designer.isEditing.value) {
    try {
      await nextTick();
      bLoading.value = true;
      
      const designerRef = designer as any;
      if (typeof designerRef.saveCache === 'function') {
        await designerRef.saveCache();
      } else if (typeof designerRef.updateCache === 'function') {
        await designerRef.updateCache({ news: newsList.value });
      } else {
        const payload = {
          key: CACHE_KEY,
          value: { news: newsList.value }
        };

        const response = await fetch(`http://localhost:3000/api/cache/${CACHE_KEY}`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          console.warn('[NewsView.vue] Estructura "value" rechazada. Intentando alternativa...');
          const alternativePayload = {
            id: CACHE_KEY,
            data: { news: newsList.value }
          };

          await fetch(`http://localhost:3000/api/cache/${CACHE_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(alternativePayload)
          });
        }
      }
      console.log('[NewsView.vue] Historial sincronizado correctamente.');
    } catch (error) {
      console.error('[NewsView.vue] Error crítico al guardar en database.json:', error);
    } finally {
      bLoading.value = false;
    }
  }
};

const createNewArticleTemplate = () => {
  const newArticle: NewsArticle = {
    id: `news_${Date.now()}`,
    title: 'NUEVA NOTICIA DISPONIBLE',
    subtitle: 'SUMARIO O SUBTÍTULO DEL BOLETÍN',
    content: 'Comienza a escribir aquí el cuerpo principal de tu newsletter...',
    date: new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
    author: 'Diseñador',
    category: 'Novedades',
    images: [],
    videoUrl: ''
  };
  
  newsList.value.unshift(newArticle);
  searchQuery.value = ''; 
  currentPage.value = 1;
  activeIndex.value = 0;
};

const deleteCurrentArticle = () => {
  if (newsList.value.length === 0) return;
  
  if (confirm('¿Estás seguro de que deseas eliminar este boletín por completo?')) {
    newsList.value.splice(activeIndex.value, 1);
    
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value;
    }
    
    const startGlobalIdx = (currentPage.value - 1) * ITEMS_PER_PAGE;
    activeIndex.value = Math.max(0, Math.min(startGlobalIdx, newsList.value.length - 1));
  }
};

const handleAddImage = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length || !currentArticle.value) return;
  
  const file = input.files[0];
  if (!file) return;

  const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
  if (file.size > MAX_FILE_SIZE_BYTES) {
    alert(`El archivo excede el límite máximo permitido de 10 MB.`);
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const base64Result = e.target?.result as string;
    if (base64Result && currentArticle.value) {
      if (!currentArticle.value.images) {
        currentArticle.value.images = [];
      }
      currentArticle.value.images.push(base64Result);
    }
  };
  reader.readAsDataURL(file);
};

const removeImageAtIndex = (index: number) => {
  if (!currentArticle.value?.images) return;
  currentArticle.value.images.splice(index, 1);
};

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const selectArticleFromPage = (item: NewsArticle) => {
  const globalIdx = newsList.value.findIndex(article => article.id === item.id);
  if (globalIdx !== -1) {
    activeIndex.value = globalIdx;
  }
  if (typeof window !== 'undefined' && window.innerWidth <= 1024) {
    isSidebarOpen.value = false;
  }
};

const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
};
</script>

<template>
  <BuilderToolbar 
    v-if="isAuthorizedDesigner && designer.isEditing.value" 
    :designer="designer" 
    :onSave="handleSaveOrEdit" 
  />

  <div class="news-panoramic-layout" v-if="!bLoading">
    
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
          @click.prevent="createNewArticleTemplate(); handleSaveOrEdit();"
        >
          ➕ Inicializar Primer Boletín
        </a>
      </div>
    </header>

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
            @click="selectArticleFromPage(item)"
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

          <div class="newsletter-gallery-section">
            <ImageGalleryManager 
              v-if="currentArticle.images" 
              v-model:images="currentArticle.images" 
              :isEditing="isAuthorizedDesigner && designer.isEditing.value" 
              @add-image="handleAddImage"
              @remove-image="removeImageAtIndex"
            />
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
  </div>
  
  <div class="loader-placeholder" v-else>
    <span>Sincronizando Boletines...</span>
  </div>
</template>

<style scoped>
.news-panoramic-layout {
  min-height: 100vh;
  background-color: #060f16;
  color: #ffffff;
  padding: 40px;
  box-sizing: border-box;
}

.loader-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #060f16;
  color: var(--color-accent, #ecaf44);
  font-weight: 600;
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
  padding: 100px 20px;
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
.newsletter-gallery-section {
  margin-bottom: 30px;
}

/* RESPONSIVE DESIGN */
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
    top: 0;
    left: 0;
    width: 280px;
    height: 100vh;
    z-index: 99;
    background: #0d1721;
    box-shadow: 5px 0 30px rgba(0, 0, 0, 0.8);
    border-radius: 0;
    border: none;
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    transform: translateX(0);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .news-grid-container.sidebar-collapsed .news-sidebar {
    transform: translateX(-100%);
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
    padding: 20px;
  }

  .sidebar-overlay {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
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
    top: 25px;
    left: 290px;
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
}
</style>