<script setup lang="ts">
import ImageGalleryManager from '@/components/editor/ImageGalleryManager.vue';
import type { NewsArticle } from '@/types/serverTypes';

defineProps<{
  article: NewsArticle;
  isEditing: boolean;
  embedVideoUrl: string;
}>();

defineEmits(['add-image', 'remove-image', 'open-lightbox']);
</script>

<template>
  <main class="news-content-area">
    <article class="newsletter-sheet">
      <!-- Metadatos -->
      <div class="newsletter-meta">
        <input 
          v-if="isEditing" 
          type="text" 
          v-model="article.category" 
          class="inline-input-meta tag"
        />
        <span v-else class="meta-tag">{{ article.category }}</span>

        <span class="meta-details">
          {{ article.date }} • Por 
          <input 
            v-if="isEditing" 
            type="text" 
            v-model="article.author" 
            class="inline-input-meta author"
          />
          <strong v-else>{{ article.author }}</strong>
        </span>
      </div>

      <!-- Título Editable -->
      <h1 v-if="!isEditing" class="news-title" v-html="article.title"></h1>
      <div 
        v-else 
        contenteditable="true" 
        class="news-title editable-container" 
        @blur="article.title = ($event.target as HTMLElement).innerHTML"
        v-html="article.title"
      ></div>

      <!-- Subtítulo Editable -->
      <h2 v-if="!isEditing" class="news-subtitle" v-html="article.subtitle"></h2>
      <div 
        v-else 
        contenteditable="true" 
        class="news-subtitle editable-container" 
        @blur="article.subtitle = ($event.target as HTMLElement).innerHTML"
        v-html="article.subtitle"
      ></div>

      <hr class="newsletter-separator" />

      <!-- Galería -->
      <div class="newsletter-gallery-section">
        <ImageGalleryManager 
          v-if="article.images" 
          v-model:images="article.images" 
          :isEditing="isEditing" 
          variant="normal"
          @add-image="$emit('add-image', $event)"
          @remove-image="$emit('remove-image', $event)"
          @open-lightbox="$emit('open-lightbox', $event)"
        />
      </div>

      <!-- Editor de Video -->
      <div v-if="isEditing" class="newsletter-editor-extensions">
        <div class="extension-input-group">
          <label>Enlace o ID de Video (YouTube):</label>
          <input 
            type="text" 
            v-model="article.videoUrl" 
            placeholder="Ej. https://www.youtube.com/watch?v=..." 
            class="extension-field"
          />
        </div>
      </div>

      <!-- Video Embed -->
      <div v-if="embedVideoUrl" class="newsletter-video-wrapper">
        <iframe 
          :src="embedVideoUrl" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen
          class="video-frame"
        ></iframe>
      </div>

      <!-- Cuerpo del Contenido -->
      <p 
        v-if="!isEditing" 
        class="news-content-body" 
        v-html="article.content"
      ></p>
      <div 
        v-else 
        contenteditable="true" 
        class="news-content-body editable-container" 
        @blur="article.content = ($event.target as HTMLElement).innerHTML"
        v-html="article.content"
      ></div>
    </article>
  </main>
</template>

<style scoped>
/* Contenedor principal */
.news-content-area { min-width: 0; }
.newsletter-sheet { background: #0d1721; border: 1px solid rgba(255, 255, 255, 0.08); padding: 50px; border-radius: 4px; box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4); }
.newsletter-meta { display: flex; align-items: center; gap: 15px; margin-bottom: 25px; }
.meta-tag { background: var(--color-accent, #ecaf44); color: #060f16; font-size: 0.75rem; font-weight: 900; padding: 3px 10px; text-transform: uppercase; }
.meta-details { font-size: 0.85rem; color: #798c9c; }

.inline-input-meta { background: rgba(255,255,255,0.05); border: 1px dashed rgba(236, 175, 68, 0.4); color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.85rem; }
.inline-input-meta.tag { color: var(--color-accent, #ecaf44); font-weight: bold; text-transform: uppercase; width: 120px; }
.inline-input-meta.author { width: 100px; }

.news-title { font-size: 3rem; font-weight: 900; color: #ffffff; line-height: 1.1; text-transform: uppercase; margin-bottom: 12px; }
.news-subtitle { font-size: 1.3rem; font-weight: 600; color: #a0b0bd; margin-bottom: 30px; }
.newsletter-separator { border: none; border-top: 1px solid rgba(255, 255, 255, 0.1); margin: 30px 0; }
.news-content-body { font-size: 1.15rem; line-height: 1.8; color: #d1dce5; }
.editable-container { border: 1px dashed var(--color-accent, #ecaf44); outline: none; padding: 8px 12px; border-radius: 6px; background: rgba(255, 255, 255, 0.01); text-align: left; }

.newsletter-editor-extensions { background: rgba(236, 175, 68, 0.03); border: 1px dashed rgba(236, 175, 68, 0.2); padding: 20px; border-radius: 6px; margin-bottom: 30px; }
.extension-input-group label { font-size: 0.8rem; font-weight: 700; color: var(--color-accent, #ecaf44); display: block; margin-bottom: 6px; }
.extension-field { width: 100%; background: #060f16; border: 1px solid rgba(255, 255, 255, 0.1); padding: 10px; color: white; border-radius: 4px; }

.newsletter-video-wrapper { position: relative; width: 100%; aspect-ratio: 16 / 9; margin-bottom: 35px; border-radius: 4px; overflow: hidden; }
.video-frame { width: 100%; height: 100%; }


/* ==========================================================================
   GALERÍA: IMAGEN TIPO BANNER CENTRADA Y REDUCIDA (RESTUARADA COMPLETA)
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

/* AQUÍ ESTÁ LA CLAVE: Fuerza que se apilen hacia abajo y no hacia la derecha */
.newsletter-gallery-section :deep(.extended-gallery-flow) {
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  gap: 25px !important;
  padding: 0 !important;
  margin: 0 !important;
  width: 100% !important;
}

/* Modifica el recuadro "Añadir imagen" y las imágenes para que tengan el mismo tamaño */
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

/* El botón de agregar imagen */
.newsletter-gallery-section :deep(.add-image-btn-zone) {
  border: 1px dashed rgba(102, 192, 244, 0.5) !important;
  background: rgba(102, 192, 244, 0.05) !important;
  color: #66c0f4 !important;
  min-height: 120px !important;
  border-radius: 6px !important;
}

/* ========================================================================== */

@media (max-width: 1024px) {
  .newsletter-sheet { padding: 30px 20px; }
  .news-title { font-size: 2.2rem; }
  
  .newsletter-gallery-section :deep(.postal-wrapper),
  .newsletter-gallery-section :deep(.gallery-clean-image),
  .newsletter-gallery-section :deep(.add-postal-placeholder) {
    max-width: 100% !important; 
  }
}
</style>