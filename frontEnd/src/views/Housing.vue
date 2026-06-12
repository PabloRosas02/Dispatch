<script setup>
import { ref, computed } from 'vue'

// Importación de tu mapa PNG o JPG
import mapImageUrl from '../assets/images/mapa.png'

// --- REFS PARA CONTROL DE DIMENSIONES ---
const viewportRef = ref(null)
const imgRatio = ref(1) // Relación aspecto real (alto / ancho) del mapa

// --- ESTADOS DE TRANSFORMACIÓN (ZOOM Y PAN) ---
const scale = ref(1)
const panX = ref(0)
const panY = ref(0)
const isDragging = ref(false)
const startX = ref(0)
const startY = ref(0)

// --- ESTADOS EXCLUSIVOS PARA MÓVILES (TOUCH GESTURES) ---
const startTouchDist = ref(0)
const startTouchScale = ref(1)

// --- DETECTOR DE PROPORCIÓN DE LA IMAGEN ---
const onImageLoad = (e) => {
  imgRatio.value = e.target.naturalHeight / e.target.naturalWidth
}

// --- DELIMITADOR MAGNÉTICO (CLAMPING) ---
const clampOffsets = (x, y, currentScale) => {
  if (!viewportRef.value) return { x, y }

  const vW = viewportRef.value.clientWidth
  const vH = viewportRef.value.clientHeight
  const baseHeight = vW * imgRatio.value

  const scaledWidth = vW * currentScale
  const scaledHeight = baseHeight * currentScale

  // Límites Horizontales (Eje X)
  let clampedX = x
  if (scaledWidth > vW) {
    const maxX = (vW * (currentScale - 1)) / 2
    clampedX = Math.max(-maxX, Math.min(maxX, x))
  } else {
    clampedX = 0
  }

  // Límites Verticales (Eje Y)
  let clampedY = y
  if (scaledHeight > vH) {
    const maxY = (baseHeight * (currentScale - 1)) / 2
    const minY = vH - (baseHeight * (currentScale + 1)) / 2
    clampedY = Math.max(minY, Math.min(maxY, y))
  } else {
    clampedY = (vH - baseHeight) / 2
  }

  return { x: clampedX, y: clampedY }
}

// --- INTERACCIÓN CON MOUSE (ESCRITORIO) ---
const startPanMouse = (e) => {
  e.preventDefault()
  isDragging.value = true
  startX.value = e.clientX - panX.value
  startY.value = e.clientY - panY.value
}

const onPanMouse = (e) => {
  if (!isDragging.value) return
  const rawX = e.clientX - startX.value
  const rawY = e.clientY - startY.value
  const clamped = clampOffsets(rawX, rawY, scale.value)
  panX.value = clamped.x
  panY.value = clamped.y
}

// --- INTERACCIÓN TÁCTIL (MÓVILES Y TABLETAS) ---
const handleTouchStart = (e) => {
  if (e.touches.length === 1) {
    // Un solo dedo: Iniciar arrastre (Pan)
    isDragging.value = true
    startX.value = e.touches[0].clientX - panX.value
    startY.value = e.touches[0].clientY - panY.value
  } else if (e.touches.length === 2) {
    // Dos dedos: Iniciar Zoom de pellizco (Pinch)
    isDragging.value = false // Desactivamos el arrastre para evitar saltos locos
    startTouchDist.value = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    )
    startTouchScale.value = scale.value
  }
}

const handleTouchMove = (e) => {
  if (e.touches.length === 1 && isDragging.value) {
    // Procesar arrastre
    const rawX = e.touches[0].clientX - startX.value
    const rawY = e.touches[0].clientY - startY.value
    const clamped = clampOffsets(rawX, rawY, scale.value)
    panX.value = clamped.x
    panY.value = clamped.y
  } else if (e.touches.length === 2) {
    // Procesar pellizco dinámico
    const currentDist = Math.hypot(
      e.touches[0].clientX - e.touches[1].clientX,
      e.touches[0].clientY - e.touches[1].clientY
    )
    const factor = currentDist / startTouchDist.value
    let newScale = startTouchScale.value * factor
    
    // Forzar límites de zoom entre 1x y 4x
    newScale = Math.max(1, Math.min(4, newScale))
    applyZoom(newScale)
  }
}

const stopDragging = () => {
  isDragging.value = false
}

// --- CONTROLES GENERALES DE ZOOM ---
const applyZoom = (newScale) => {
  scale.value = newScale
  const clamped = clampOffsets(panX.value, panY.value, newScale)
  panX.value = clamped.x
  panY.value = clamped.y
}

const zoomIn = () => {
  if (scale.value < 4) applyZoom(Math.min(scale.value + 0.3, 4))
}

const zoomOut = () => {
  if (scale.value > 1) applyZoom(Math.max(scale.value - 0.3, 1))
}

const resetMap = () => {
  scale.value = 1
  const clamped = clampOffsets(0, 0, 1)
  panX.value = clamped.x
  panY.value = clamped.y
}

const handleWheel = (e) => {
  e.preventDefault()
  if (e.deltaY < 0) zoomIn() 
  else zoomOut()
}

const mapTransformStyle = computed(() => {
  return {
    transform: `translate(${panX.value}px, ${panY.value}px) scale(${scale.value})`,
    transformOrigin: 'center center'
  }
})
</script>

<template>
  <div class="page-container">
    <div class="map-card">
      
      <h2 class="map-title">MAPA INTERACTIVO</h2>

      <div 
        ref="viewportRef"
        class="map-viewport"
        :class="{ 'is-grabbing': isDragging }"
        @wheel="handleWheel"
        @mousedown="startPanMouse"
        @mousemove="onPanMouse"
        @mouseup="stopDragging"
        @mouseleave="stopDragging"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="stopDragging"
      >
        
        <div class="map-controls">
          <button @click.stop="zoomIn" class="control-btn" title="Acercar">+</button>
          <button @click.stop="zoomOut" class="control-btn" title="Alejar">-</button>
          <button @click.stop="resetMap" class="control-btn" title="Reiniciar">↻</button>
        </div>

        <div class="map-transform-layer" :style="mapTransformStyle">
          <img 
            :src="mapImageUrl" 
            alt="SAGA Map" 
            class="map-image" 
            draggable="false" 
            @load="onImageLoad"
          />
        </div>

      </div>

    </div>
  </div>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #060F16;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px;
  user-select: none;
}

.map-card {
  width: 100%;
  max-width: 1200px;
  background: rgba(6, 15, 22, 0.4);
  border: 1px solid rgba(99, 166, 218, 0.1);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
}

.map-title {
  text-align: center;
  color: #ECAF44;
  font-size: 1.4rem;
  font-weight: 800;
  letter-spacing: 2px;
  margin-bottom: 20px;
  text-shadow: 0 0 15px rgba(236, 175, 68, 0.2);
}

.map-viewport {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9; /* Formato panorámico para monitores */
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(99, 166, 218, 0.3);
  background-color: #060F16;
  cursor: grab;
  /* CRÍTICO: Previene que el navegador arrastre la ventana completa al mover el mapa */
  touch-action: none; 
}

.map-viewport.is-grabbing {
  cursor: grabbing;
}

.map-transform-layer {
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  will-change: transform;
}

.map-image {
  width: 100%;
  height: auto;
  display: block;
}

.map-controls {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  gap: 8px;
  z-index: 10;
}

.control-btn {
  background: #060F16;
  border: 1px solid #63A6DA;
  color: #F3E9DC;
  width: 36px;
  height: 36px;
  border-radius: 6px;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.control-btn:hover {
  background: #63A6DA;
  color: #060F16;
  box-shadow: 0 0 12px rgba(99, 166, 218, 0.4);
}

/* ==========================================================================
   MEDIA QUERIES: OPTIMIZACIÓN PARA MÓVILES Y TABLETAS
   ========================================================================== */
@media (max-width: 768px) {
  .page-container {
    padding: 12px; /* Menos espacio muerto en las orillas de la pantalla */
  }

  .map-card {
    padding: 16px;
    border-radius: 12px;
  }

  .map-title {
    font-size: 1.1rem;
    margin-bottom: 14px;
  }

  .map-viewport {
    /* Cambiamos a formato cuadrado (1/1) en móviles para dar más altura 
       y que el mapa vertical de GTA no quede aplastado */
    aspect-ratio: 1 / 1; 
  }

  /* Botones más grandes para que sean fáciles de presionar con los dedos */
  .map-controls {
    top: 12px;
    right: 12px;
    gap: 10px;
  }

  .control-btn {
    width: 44px;
    height: 44px;
    font-size: 1.4rem;
    background: rgba(6, 15, 22, 0.9); /* Ligeramente más opaco en móviles */
  }
}

</style>