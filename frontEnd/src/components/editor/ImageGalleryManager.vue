<script setup lang="ts">
interface Props {
  images: string[];
  isEditing: boolean;
  // NUEVA PROP: Controla si se aplica el efecto disperso/collage o se queda normal
  variant?: 'normal' | 'collage';
}

// Definimos las props con valores por defecto utilizando withDefaults
const props = withDefaults(defineProps<Props>(), {
  variant: 'normal'
});

const emit = defineEmits(['update:images', 'open-lightbox']);

// Límite máximo: 50 MB en bytes (50 * 1024 * 1024) para evitar errores 413 Payload Too Large
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; 

/**
 * Procesa la carga de una nueva imagen con validación de tamaño
 */
const handleAddImage = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input || !input.files || input.files.length === 0) return;

  const file: File | undefined = input.files[0];
  if (!file) return;

  // VALIDACIÓN: Control de peso del payload antes de procesar la conversión
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
    alert(`La imagen es demasiado pesada (${sizeInMB} MB). El límite máximo permitido es de 2 MB para evitar errores en el servidor.`);
    input.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const base64Result = e.target?.result as string;
    if (base64Result) {
      const updatedImages = [...props.images, base64Result];
      emit('update:images', updatedImages);
    }
  };
  reader.readAsDataURL(file);
  
  input.value = '';
};

/**
 * Elimina una imagen del flujo por su índice
 */
const removeImageAtIndex = (index: number) => {
  const updatedImages = [...props.images];
  updatedImages.splice(index, 1);
  emit('update:images', updatedImages);
};
</script>

<template>
  <div 
    v-if="(images && images.length > 1) || isEditing" 
    class="extended-gallery-flow"
    :class="{ 'is-collage': props.variant === 'collage' }"
  >
    <template v-for="(imgSrc, idx) in images" :key="idx">
      <div v-if="idx > 0" class="postal-wrapper">
        <div 
          class="gallery-clean-image" 
          :class="{ 'clickable-view': !isEditing }"
          @click="!isEditing && emit('open-lightbox', imgSrc)"
        >
          <div class="image-viewport">
            <img :src="imgSrc" alt="Gallery Image" class="postal-image" />
            
            <div v-if="isEditing" class="image-actions-overlay">
              <button class="img-action-btn delete-btn" @click.stop="removeImageAtIndex(idx)">
                Eliminar Imagen
              </button>
            </div>

            <div v-if="!isEditing" class="expand-indicator-overlay">
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

    <div v-if="isEditing" class="add-postal-placeholder">
      <label class="add-image-btn-zone">
        <div class="plus-icon">➕</div>
        <span>Añadir foto a la derecha</span>
        <input type="file" accept="image/*" class="hidden-file-input" @change="handleAddImage" />
      </label>
    </div>
  </div>
</template>

<style scoped>
/* ==========================================================================
   ESTILOS BASE (Flujo normal por defecto)
   ========================================================================== */
.extended-gallery-flow {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 60px;
  flex-shrink: 0;
  padding-left: 60px; 
}
.postal-wrapper {
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.gallery-clean-image {
  position: relative;
  width: 450px;
  box-sizing: border-box;
  transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  filter: drop-shadow(0 20px 40px rgba(0, 0, 0, 0.5));
}

/* Comportamiento por defecto cuando NO está en modo collage */
.extended-gallery-flow:not(.is-collage) .postal-wrapper:nth-child(odd) .gallery-clean-image {
  transform: rotate(-1.5deg);
}
.extended-gallery-flow:not(.is-collage) .postal-wrapper:nth-child(even) .gallery-clean-image {
  transform: rotate(2deg);
}

.gallery-clean-image:hover {
  transform: rotate(-0.5deg) scale(1.03) !important;
  z-index: 5;
}

/* ==========================================================================
   NUEVOS ESTILOS: MODO COLLAGE ASIMÉTRICO DISPERSO (.is-collage)
   ========================================================================== */
.extended-gallery-flow.is-collage {
  gap: 120px; /* Separación horizontal para evitar colisiones */
  padding-left: 50px;
}

/* Forzar transiciones fluidas de rotación y escalado */
.extended-gallery-flow.is-collage .gallery-clean-image {
  transition: transform 0.35s cubic-bezier(0.25, 1, 0.5, 1), z-index 0.2s;
}

/* Al hacer hover en modo collage se endereza y sube al frente */
.extended-gallery-flow.is-collage .gallery-clean-image:hover {
  transform: scale(1.08) rotate(0deg) !important;
  z-index: 999 !important;
}

/* Patrón de dispersión vertical alternada e inclinaciones */
.extended-gallery-flow.is-collage .postal-wrapper:nth-child(odd) .gallery-clean-image {
  transform: translateY(-60px) rotate(-4.5deg);
}

.extended-gallery-flow.is-collage .postal-wrapper:nth-child(even) .gallery-clean-image {
  transform: translateY(65px) rotate(4deg);
}

.extended-gallery-flow.is-collage .postal-wrapper:nth-child(3n) .gallery-clean-image {
  transform: translateY(-20px) rotate(6deg);
}

.extended-gallery-flow.is-collage .postal-wrapper:nth-child(4n) .gallery-clean-image {
  transform: translateY(85px) rotate(-5.5deg);
}

/* ==========================================================================
   INTERFAZ COMPLEMENTARIA Y REPOSITORIOS DE IMAGEN
   ========================================================================== */
.image-viewport {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  background-color: #060F16;
  overflow: hidden;
  border-radius: 4px;
}
.postal-image {
  width: 100%;
  height: 100%;
  object-fit: contain; 
  display: block;
  border: 1px solid #ededed;
}
.clickable-view {
  cursor: pointer;
}

/* Efecto Hover para Expandir */
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
.image-viewport:hover .expand-indicator-overlay {
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
.image-viewport:hover .expand-trigger-btn {
  transform: translateY(0);
}
.expand-trigger-btn:hover {
  background: #ffffff;
  color: var(--color-accent, #ecaf44);
  transform: scale(1.05);
}

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

@media (max-width: 1024px) {
  .extended-gallery-flow {
    flex-direction: column;
    width: 100%;
    gap: 40px;
    padding-left: 0;
  }
  .gallery-clean-image, .add-postal-placeholder {
    width: 100%;
    max-width: 420px;
  }
}
</style>