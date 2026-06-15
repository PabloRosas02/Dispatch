<script setup lang="ts">
import { ref, computed } from 'vue'
import type { CSSProperties } from 'vue'

// Importación de tu mapa PNG o JPG
import mapImageUrl from '../assets/images/mapa.png'

// --- REFS PARA CONTROL DE DIMENSIONES ---
const viewportRef = ref<HTMLDivElement | null>(null)
const imgRatio = ref<number>(1) // Relación aspecto real (alto / ancho) del mapa

// --- ESTADOS DE TRANSFORMACIÓN (ZOOM Y PAN) ---
const scale = ref<number>(1)
const panX = ref<number>(0)
const panY = ref<number>(0)
const isDragging = ref<boolean>(false)
const startX = ref<number>(0)
const startY = ref<number>(0)

// --- ESTADOS EXCLUSIVOS PARA MÓVILES (TOUCH GESTURES) ---
const startTouchDist = ref<number>(0)
const startTouchScale = ref<number>(1)

// --- DETECTOR DE PROPORCIÓN DE LA IMAGEN ---
const onImageLoad = (e: Event): void => {
  const target = e.target as HTMLImageElement
  imgRatio.value = target.naturalHeight / target.naturalWidth
}

// --- DELIMITADOR MAGNÉTICO (CLAMPING) ---
const clampOffsets = (x: number, y: number, currentScale: number): { x: number; y: number } => {
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

// --- FUNCIÓN CENTRAL: ZOOM RELATIVO A UN PUNTO FOCAL ---
const applyZoomRelative = (newScale: number, focalX: number, focalY: number): void => {
  if (!viewportRef.value) return

  const oldScale = scale.value
  if (oldScale === newScale) return

  const vW = viewportRef.value.clientWidth
  // Origen de la transformación (centro de la capa del mapa sin escalar)
  const Ox = vW / 2
  const Oy = (vW * imgRatio.value) / 2

  // Distancia desde el origen hasta el punto donde queremos hacer zoom
  const Dx = focalX - Ox
  const Dy = focalY - Oy

  // Ajustar el desplazamiento (Pan) para mantener el punto focal fijo en pantalla
  const targetPanX = Dx - (Dx - panX.value) * (newScale / oldScale)
  const targetPanY = Dy - (Dy - panY.value) * (newScale / oldScale)

  scale.value = newScale

  // Aplicar límites magnéticos al nuevo desplazamiento calculado
  const clamped = clampOffsets(targetPanX, targetPanY, newScale)
  panX.value = clamped.x
  panY.value = clamped.y
}

// --- INTERACCIÓN CON MOUSE (ESCRITORIO) ---
const startPanMouse = (e: MouseEvent): void => {
  e.preventDefault()
  isDragging.value = true
  startX.value = e.clientX - panX.value
  startY.value = e.clientY - panY.value
}

const onPanMouse = (e: MouseEvent): void => {
  if (!isDragging.value) return
  const rawX = e.clientX - startX.value
  const rawY = e.clientY - startY.value
  const clamped = clampOffsets(rawX, rawY, scale.value)
  panX.value = clamped.x
  panY.value = clamped.y
}

// --- INTERACCIÓN TÁCTIL (MÓVILES Y TABLETAS) ---
const handleTouchStart = (e: TouchEvent): void => {
  if (e.touches.length === 1) {
    const touch = e.touches[0]
    if (!touch) return

    isDragging.value = true
    startX.value = touch.clientX - panX.value
    startY.value = touch.clientY - panY.value
  } else if (e.touches.length === 2) {
    const touch1 = e.touches[0]
    const touch2 = e.touches[1]
    if (!touch1 || !touch2) return

    isDragging.value = false
    startTouchDist.value = Math.hypot(
      touch1.clientX - touch2.clientX,
      touch1.clientY - touch2.clientY
    )
    startTouchScale.value = scale.value
  }
}

const handleTouchMove = (e: TouchEvent): void => {
  if (e.touches.length === 1 && isDragging.value) {
    const touch = e.touches[0]
    if (!touch) return

    const rawX = touch.clientX - startX.value
    const rawY = touch.clientY - startY.value
    const clamped = clampOffsets(rawX, rawY, scale.value)
    panX.value = clamped.x
    panY.value = clamped.y
  } else if (e.touches.length === 2) {
    const touch1 = e.touches[0]
    const touch2 = e.touches[1]
    if (!touch1 || !touch2 || !viewportRef.value) return

    // Procesar pellizco dinámico
    const currentDist = Math.hypot(
      touch1.clientX - touch2.clientX,
      touch1.clientY - touch2.clientY
    )
    const factor = currentDist / startTouchDist.value
    let newScale = startTouchScale.value * factor
    newScale = Math.max(1, Math.min(4, newScale))

    // MEJORA: Zoom móvil en el punto medio exacto de ambos dedos
    const rect = viewportRef.value.getBoundingClientRect()
    const midX = (touch1.clientX + touch2.clientX) / 2 - rect.left
    const midY = (touch1.clientY + touch2.clientY) / 2 - rect.top

    applyZoomRelative(newScale, midX, midY)
  }
}

const stopDragging = (): void => {
  isDragging.value = false
}

// --- CONTROLES DE INTERFAZ (BOTONES + Y -) ---
// Hacen zoom justo en el centro del Viewport actual ("Última Posición")
const zoomIn = (): void => {
  if (!viewportRef.value) return
  const vW = viewportRef.value.clientWidth
  const vH = viewportRef.value.clientHeight
  if (scale.value < 4) {
    applyZoomRelative(Math.min(scale.value + 0.4, 4), vW / 2, vH / 2)
  }
}

const zoomOut = (): void => {
  if (!viewportRef.value) return
  const vW = viewportRef.value.clientWidth
  const vH = viewportRef.value.clientHeight
  if (scale.value > 1) {
    applyZoomRelative(Math.max(scale.value - 0.4, 1), vW / 2, vH / 2)
  }
}

const resetMap = (): void => {
  scale.value = 1
  const clamped = clampOffsets(0, 0, 1)
  panX.value = clamped.x
  panY.value = clamped.y
}

// --- CONTROLES DE MOUSE WHEEL (RUEDA DEL MOUSE) ---
// Hace zoom exactamente en las coordenadas de tu cursor
const handleWheel = (e: WheelEvent): void => {
  e.preventDefault()
  if (!viewportRef.value) return

  // Obtener posición del cursor relativa al contenedor del mapa
  const rect = viewportRef.value.getBoundingClientRect()
  const mouseX = e.clientX - rect.left
  const mouseY = e.clientY - rect.top

  const zoomStep = 0.15
  let newScale = scale.value

  if (e.deltaY < 0) {
    newScale = Math.min(scale.value + zoomStep, 4)
  } else {
    newScale = Math.max(scale.value - zoomStep, 1)
  }

  applyZoomRelative(newScale, mouseX, mouseY)
}

const mapTransformStyle = computed<CSSProperties>(() => {
  return {
    transform: `translate(${panX.value}px, ${panY.value}px) scale(${scale.value})`,
    transformOrigin: 'center center'
  }
})
</script>

<template>
  <div class="page-container">
    <div class="map-card">
      
      <h2 class="map-title">MAPA INTERACTIVO DE ZONAS</h2>

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
  aspect-ratio: 16 / 9;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(99, 166, 218, 0.3);
  background-color: #060F16;
  cursor: grab;
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

@media (max-width: 768px) {
  .page-container {
    padding: 12px;
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
    aspect-ratio: 1 / 1; 
  }

  .map-controls {
    top: 12px;
    right: 12px;
    gap: 10px;
  }

  .control-btn {
    width: 44px;
    height: 44px;
    font-size: 1.4rem;
    background: rgba(6, 15, 22, 0.9);
  }
}
</style>