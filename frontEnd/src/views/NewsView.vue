<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from 'vue';
import { useRoute } from 'vue-router';

// Componentes
import BuilderToolbar from '@/components/editor/BuilderToolbar.vue';
import NewsSidebar from '@/components/news/NewsSidebar.vue';
import NewsContent from '@/components/news/NewsContent.vue';

// Composables
import { useDesigner } from '@/composables/useDesigner';
import { useNews } from '@/composables/useNews';
import type { NewsArticle } from '@/types/serverTypes';

const route = useRoute();
const CACHE_KEY = 'news_page_general_config';
const LOCAL_STORAGE_KEY = `backup_cache_${CACHE_KEY}`;

// 1. Instanciamos la lógica desde el composable useNews
const {
  newsList, bLoading, searchQuery, currentPage, currentArticle,
  totalPages, paginatedNewsList, embedVideoUrl, fetchNews,
  createNewArticleTemplate, deleteCurrentArticle, handleAddImage,
  removeImageAtIndex, selectArticleFromPage, changePage
} = useNews(CACHE_KEY);

// Lógica del Diseñador
const designer = useDesigner({ cacheKey: CACHE_KEY });
const isAuthorizedDesigner = computed(() => route.query.mode === 'admin-designer');

// Lógica UI
const isSidebarOpen = ref<boolean>(true);
const activeLightboxImage = ref<string | null>(null);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

// --- LÓGICA: Tecla ESC para cerrar Lightbox ---
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') activeLightboxImage.value = null;
};

const handleArticleSelection = (item: NewsArticle) => {
  selectArticleFromPage(item);
  if (typeof window !== 'undefined' && window.innerWidth <= 1024) {
    isSidebarOpen.value = false;
  }
};

// 2. Carga inicial y Event Listeners
onMounted(async () => {
  window.addEventListener('keydown', handleKeydown);

  const localBackup = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (localBackup) {
    try {
      const parsed = JSON.parse(localBackup);
      if (parsed && parsed.news && parsed.news.length > 0) {
        newsList.value = parsed.news;
        bLoading.value = false;
        return;
      }
    } catch (e) {
      console.error("Error al leer backup local", e);
    }
  }
  await fetchNews();
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});

// RESPALDO: Sincronizar localStorage cada vez que newsList cambie
watch(
  () => newsList.value,
  (newVal) => {
    if (newVal && newVal.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ news: newVal }));

      if (!currentArticle.value) {
        selectArticleFromPage(newVal[0]!);
      }
    }
  },
  { deep: true }
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
      const response = await fetch(`/api/cache/${CACHE_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.error('Error al guardar en el servidor');
      }
      
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ news: newsList.value }));
    } catch (error) {
      console.error('[NewsView.vue] Error crítico al guardar:', error);
    } finally {
      bLoading.value = false;
    }
  }
};

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
        <h1 class="section-tag">Zona de Comunicados</h1>
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

        <NewsSidebar 
          :paginatedList="paginatedNewsList"
          :searchQuery="searchQuery"
          :currentPage="currentPage"
          :totalPages="totalPages"
          :currentArticle="currentArticle"
          :isAuthorizedDesigner="isAuthorizedDesigner"
          :isEditing="designer.isEditing.value"
          @update:searchQuery="searchQuery = $event"
          @select="handleArticleSelection"
          @change-page="changePage"
          @add="createNewArticleTemplate"
          @delete="deleteCurrentArticle"
        />

        <NewsContent 
          v-if="currentArticle"
          :article="currentArticle"
          :isEditing="designer.isEditing.value"
          :embedVideoUrl="embedVideoUrl"
          @add-image="handleAddImage"
          @remove-image="removeImageAtIndex"
          @open-lightbox="activeLightboxImage = $event"
        />

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

/* DISEÑO NEWS - LAYOUT PRINCIPAL (FONDO AZUL ACTUALIZADO) */
.news-panoramic-layout {
  min-height: 100vh;
  background-color: #0b1421; /* Azul pizarra oscuro sólido como respaldo */
  background: radial-gradient(circle at 50% 0%, #111d30 0%, #060a11 100%); /* Efecto azul de la imagen */
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
.header-titles { width: 100%; margin-bottom: 8px; }
.section-tag {
  font-size: 2.6rem;
  font-weight: 700;
  font-style: italic;
  color: var(--color-accent, #ecaf44);
  margin: 0; padding: 0;
  letter-spacing: 0.5px;
}
.header-actions { display: flex; justify-content: center; align-items: center; gap: 20px; }

.edit-mode-link {
  color: #798c9c;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  transition: color 0.2s;
}
.edit-mode-link:hover { color: var(--color-accent, #ecaf44); }

/* GRID CONTAINER ORIGINAL */
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

/* Ocultar el componente hijo */
.news-grid-container.sidebar-collapsed :deep(.news-sidebar) {
  padding: 0;
  border: none;
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
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
.sidebar-toggle-arrow:hover { background: #142330; border-color: var(--color-accent, #ecaf44); }
.arrow-svg { width: 22px; height: 22px; transition: transform 0.3s ease; }

.sidebar-toggle-arrow.collapsed { left: -18px; }
.sidebar-toggle-arrow.collapsed .arrow-svg { transform: rotate(180deg); }

.sidebar-overlay { display: none; }

.empty-news-state { display: flex; justify-content: center; align-items: center; padding: 60px 20px; }
.empty-card { background: #0d1721; border: 1px solid rgba(255,255,255,0.05); padding: 40px; text-align: center; border-radius: 6px; max-width: 500px; }
.empty-msg { font-size: 1.2rem; font-weight: 700; color: #ffffff; margin-bottom: 8px; }
.empty-sub { font-size: 0.9rem; color: #6c7a86; }

/* RESPONSIVE DESIGN (MÓVIL) ORIGINAL */
@media (max-width: 1024px) {
  .news-panoramic-layout { padding: 20px 15px; }
  
  .news-grid-container { grid-template-columns: 1fr; gap: 0px; }
  
  .news-grid-container.sidebar-collapsed { grid-template-columns: 1fr; }

  .news-grid-container.sidebar-collapsed :deep(.news-sidebar) {
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
}

@media (max-width: 400px) {
  .sidebar-toggle-arrow { left: 80vw; }
}
</style>