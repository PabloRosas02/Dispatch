<script setup lang="ts">
import { ref, computed } from 'vue'
import type { CSSProperties } from 'vue'

// Importación de tu mapa PNG o JPG
import mapImageUrl from '/images/mapa.png'
import {
  Plus,
  Minus,
  RotateCcw
} from "lucide-vue-next";


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
  <section class="housing-map">

    <div class="map-header">

      <div class="map-header-content">
        <h2>Mapa Interactivo</h2>
        <p>
          Explora todas las zonas residenciales disponibles dentro de Kinsfolk Roleplay.
        </p>
      </div>

      <div class="map-controls">

        <button class="control-btn" @click.stop="zoomIn">
            <Plus :size="18" />
        </button>

        <button class="control-btn" @click.stop="zoomOut">
            <Minus :size="18" />
        </button>

        <button class="control-btn" @click.stop="resetMap">
            <RotateCcw :size="18" />
            </button>

      </div>

    </div>

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

      <div
        class="map-transform-layer"
        :style="mapTransformStyle"
      >

        <img
          :src="mapImageUrl"
          alt="Mapa de Los Santos"
          class="map-image"
          draggable="false"
          @load="onImageLoad"
        />

        <!--
          AQUÍ IRÁN MÁS ADELANTE LOS SVG DE LAS ZONAS

          <svg class="zone-overlay">
              <polygon ... />
          </svg>

        -->

      </div>

    </div>

  </section>
</template>
<style scoped>

.housing-map {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;

  background: linear-gradient(
    180deg,
    rgba(26, 34, 48, 0.96),
    rgba(17, 23, 34, 0.98)
  );

  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 22px;
  overflow: hidden;

  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.03),
    0 20px 40px rgba(0,0,0,.35);
}

/* ===========================
   Header
=========================== */

.map-header{
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:2rem;

  padding:1.75rem 2rem;
}

.map-header-content h2{
  color:var(--color-light);
  font-size:1.6rem;
  font-weight:700;
  margin:0;
}

.map-header-content p{
  margin-top:.45rem;
  color:rgba(255,255,255,.65);
  line-height:1.6;
  max-width:520px;
}

/* ===========================
   Controls
=========================== */

.map-controls{
  display:flex;
  gap:.75rem;
}

.control-btn{
  width:44px;
  height:44px;

  display:flex;
  align-items:center;
  justify-content:center;

  border-radius:12px;

  border:1px solid rgba(255,255,255,.08);

  background:linear-gradient(
    180deg,
    rgba(35,43,57,.96),
    rgba(20,27,38,.98)
  );

  color:var(--color-secondary);

  font-size:1.2rem;
  font-weight:700;

  cursor:pointer;

  transition:
    transform .25s ease,
    border-color .25s ease,
    box-shadow .25s ease,
    background .25s ease;
}

.control-btn:hover{

  transform:translateY(-2px);

  border-color:var(--color-secondary);

  box-shadow:
      0 8px 18px rgba(0,0,0,.35),
      0 0 16px rgba(236,175,68,.25);

}

.control-btn:active{
  transform:scale(.96);
}

/* ===========================
   Viewport
=========================== */

.map-viewport{

  position:relative;

  width:100%;

  aspect-ratio:16/9;

  overflow:hidden;

  background:#111822;

  cursor:grab;

  touch-action:none;

}

.map-viewport.is-grabbing{
  cursor:grabbing;
}

.map-transform-layer{

  position:absolute;

  inset:0;

  will-change:transform;

}

.map-image{

  width:100%;

  height:auto;

  display:block;

  user-select:none;

  pointer-events:none;

}

/* ===========================
   Responsive
=========================== */

@media (max-width:768px){

  .housing-map{
    border-radius:16px;
  }

  .map-header{

    flex-direction:column;

    align-items:flex-start;

    gap:1.25rem;

    padding:1.25rem;

  }

  .map-controls{

    width:100%;

    justify-content:flex-end;

  }

  .map-viewport{

    aspect-ratio:1/1;

  }

  .control-btn{

    width:48px;

    height:48px;

    font-size:1.3rem;

  }

}

</style>