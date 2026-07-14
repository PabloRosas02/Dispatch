<script setup lang="ts">
import type { NewsArticle } from '@/types/serverTypes';

defineProps<{
  paginatedList: NewsArticle[];
  searchQuery: string;
  currentPage: number;
  totalPages: number;
  currentArticle: NewsArticle | null;
  isAuthorizedDesigner: boolean;
  isEditing: boolean;
}>();

defineEmits(['update:searchQuery', 'select', 'change-page', 'add', 'delete']);
</script>

<template>
  <aside class="news-sidebar">
    <h3 class="sidebar-heading">Historial de Boletines</h3>
    
    <div class="sidebar-search-container">
      <input 
        type="text" 
        :value="searchQuery" 
        @input="$emit('update:searchQuery', ($event.target as HTMLInputElement).value)" 
        placeholder="Buscar por nombre, fecha o autor..." 
        class="sidebar-search-input"
      />
      <span v-if="searchQuery" class="clear-search-icon" @click="$emit('update:searchQuery', '')">✕</span>
    </div>

    <div v-if="isAuthorizedDesigner && isEditing" class="sidebar-crud-zone">
      <button class="btn-crud add" @click="$emit('add')">➕ Nueva</button>
      <button class="btn-crud delete" @click="$emit('delete')">🗑️ Eliminar</button>
    </div>

    <div class="sidebar-track">
      <div 
        v-for="item in paginatedList" 
        :key="item.id"
        class="sidebar-card"
        :class="{ 'active': currentArticle && item.id === currentArticle.id }"
        @click="$emit('select', item)"
      >
        <span class="card-tag">{{ item.category }}</span>
        <h4 class="card-title" v-html="item.title"></h4>
        <div class="card-footer-info">
          <span class="card-date">{{ item.date }}</span>
          <span class="card-author">✍️ {{ item.author }}</span>
        </div>
      </div>

      <div v-if="paginatedList.length === 0" class="no-search-results">
        No se encontraron boletines que coincidan.
      </div>
    </div>

    <div v-if="totalPages > 1" class="sidebar-pagination">
      <button class="pag-btn" :disabled="currentPage === 1" @click="$emit('change-page', currentPage - 1)">◀</button>
      <div class="pag-numeric-indicator">
        <span class="current-indicator">{{ currentPage }}</span> 
        <span class="divider">/</span> 
        <span class="total-indicator">{{ totalPages }}</span>
      </div>
      <button class="pag-btn" :disabled="currentPage === totalPages" @click="$emit('change-page', currentPage + 1)">▶</button>
    </div>
  </aside>
</template>

<style scoped>
.news-sidebar {
  background: rgba(255, 255, 255, 0.01);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 20px;
  height: fit-content;
  overflow: hidden;
  /* Eliminamos posicionamientos absolutos que rompen el Grid */
  min-width: 320px; 
}

.sidebar-heading { font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1.5px; color: #6c7a86; margin-bottom: 15px; white-space: nowrap; }

.sidebar-search-container { position: relative; width: 100%; margin-bottom: 15px; }
.sidebar-search-input { width: 100%; background: #060f16; border: 1px solid rgba(255, 255, 255, 0.1); color: #ffffff; padding: 10px 32px 10px 12px; border-radius: 6px; font-size: 0.85rem; box-sizing: border-box; }
.sidebar-search-input:focus { border-color: var(--color-accent, #ecaf44); outline: none; }
.clear-search-icon { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: #6c7a86; cursor: pointer; font-size: 0.8rem; }
.clear-search-icon:hover { color: var(--color-accent, #ecaf44); }

.sidebar-crud-zone { display: flex; gap: 10px; margin-bottom: 20px; }
.btn-crud { flex: 1; padding: 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; cursor: pointer; border: 1px solid transparent; text-transform: uppercase; }
.btn-crud.add { background: rgba(46, 204, 113, 0.1); color: #2ecc71; border-color: rgba(46, 204, 113, 0.2); }
.btn-crud.delete { background: rgba(231, 76, 60, 0.1); color: #e74c3c; border-color: rgba(231, 76, 60, 0.2); }

.sidebar-track { display: flex; flex-direction: column; gap: 12px; }
.sidebar-card { padding: 16px; background: rgba(255, 255, 255, 0.02); border-radius: 6px; cursor: pointer; border-left: 3px solid transparent; transition: all 0.2s; }
.sidebar-card:hover, .sidebar-card.active { background: rgba(255, 255, 255, 0.04); border-left-color: var(--color-accent, #ecaf44); }
.card-tag { font-size: 0.7rem; font-weight: 700; color: var(--color-accent, #ecaf44); text-transform: uppercase; }
.card-title { margin: 6px 0; font-size: 0.95rem; line-height: 1.3; }
.card-footer-info { display: flex; justify-content: space-between; align-items: center; margin-top: 4px; }
.card-date, .card-author { font-size: 0.72rem; color: #526270; }
.card-author { max-width: 110px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.no-search-results { font-size: 0.85rem; color: #6c7a86; text-align: center; padding: 20px 0; font-style: italic; }

.sidebar-pagination { display: flex; justify-content: space-between; align-items: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid rgba(255, 255, 255, 0.05); }
.pag-btn { background: #142330; border: 1px solid rgba(255, 255, 255, 0.1); color: var(--color-accent, #ecaf44); padding: 6px 12px; font-size: 0.8rem; border-radius: 4px; cursor: pointer; }
.pag-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.pag-numeric-indicator { font-size: 0.85rem; font-weight: 600; color: #798c9c; display: flex; gap: 4px; }
.current-indicator { color: var(--color-accent, #ecaf44); }

@media (max-width: 1024px) {
  .news-sidebar { position: fixed; top: 72px; left: 0; width: 320px; max-width: 85vw; height: calc(100vh - 72px); z-index: 99; background: #0d1721; box-shadow: 5px 0 30px rgba(0,0,0,0.8); border-radius: 0; border: none; border-right: 1px solid rgba(255,255,255,0.1); overflow-y: auto; padding: 20px 15px 90px 15px; }
}
</style>