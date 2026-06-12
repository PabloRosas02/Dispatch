<script setup>
import { ref, onMounted, computed } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { useRouter } from 'vue-router'

import 'swiper/css'

const router = useRouter()
const swiperInstance = ref(null)
const activeEffectId = ref(null)

const baseCards = ref([
  { id: 'leo', filename: 'L.e.o.svg', character: 'example.png', alt: 'L.E.O' },
  { id: 'sams', filename: 'SAMS.svg', character: 'example2.png', alt: 'SAMS' },
  { id: 'safd', filename: 'SAFD.svg', character: 'example.png', alt: 'SAFD' },
  { id: 'civiles', filename: 'Proyectos civiles.svg', character: 'example.png', alt: 'Proyectos Civiles' },
  { id: 'ilegales', filename: 'Ilegales.svg', character: 'example.png', alt: 'Ilegales' },
  { id: 'creator', filename: 'Content Creator.svg', character: 'example.png', alt: 'Content Creator' },
])

const duplicatedCards = computed(() => [...baseCards.value, ...baseCards.value])

const getSvgUrl = (filename) => {
  return new URL(`./icons/${filename}`, import.meta.url).href
}

const getPngUrl = (characterFilename) => {
  return new URL(`../assets/images/${characterFilename}`, import.meta.url).href
}

const onSwiper = (swiper) => {
  swiperInstance.value = swiper
}

const onSlideChange = (swiper) => {
  localStorage.setItem('kinsfolk_last_slide', swiper.activeIndex)
  activeEffectId.value = null
}

onMounted(() => {
  const savedIndex = localStorage.getItem('kinsfolk_last_slide')
  if (savedIndex != null && swiperInstance.value) {
    swiperInstance.value.slideTo(parseInt(savedIndex, 10), 0)
  }
})

const handleCardClick = (card, index) => {
  const uniqueId = `${card.id}-${index}`
  
  // Detectamos si el usuario está usando una pantalla táctil (celular/tablet)
  const isTouchDevice = window.matchMedia('(pointer: coarse)').matches

  if (isTouchDevice) {
    if (activeEffectId.value === uniqueId) {
      // Si ya tiene el efecto activo y vuelve a presionar, navega
      openRoleDetail(card.id)
    } 
    else {
      // Si es el primer toque, activa el efecto visual del personaje
      activeEffectId.value = uniqueId
    }
  } 
  else {
    // En PC/Desktop navega directamente al hacer click
    openRoleDetail(card.id)
  }
}

const openRoleDetail = (roleId) => {
  router.push({
    name: 'role-detail',
    params: { id: roleId }
  })
}
</script>

<template>
  <div class="carousel-section">
    <swiper
      :centeredSlides="true"
      :slidesPerView="5"
      :loop="true"
      :spaceBetween="-45"
      :watchSlidesProgress="true"
      @swiper="onSwiper"
      @slideChange="onSlideChange"
      class="cards-swiper"
    >
      <swiper-slide
        v-for="(card, index) in duplicatedCards"
        :key="card.id + '-' + index"
        class="card-slide"
        :class="{ 'has-touch-effect': activeEffectId === `${card.id}-${index}` }"
        @click="handleCardClick(card, index)"
      >
        <div class="card-transform-wrapper">
          
          <img 
            :src="getSvgUrl(card.filename)"
            :alt="card.alt"
            class="card-image"
          />

          <img 
            :src="getPngUrl(card.character)"
            alt="Character Overlay"
            class="card-character"
          />

        </div>
      </swiper-slide>
    </swiper>
  </div>
</template>

<style scoped>
.carousel-section {
  width: 100%;
  max-width: 1100px;
  margin: 20px auto 0 auto;
  overflow: hidden;
}

.cards-swiper {
  width: 100%;
  padding-top: 40px;
  padding-bottom: 60px;
}

.card-slide {
  width: 100%;
  aspect-ratio: 1 / 1;
  cursor: pointer;
  perspective: 1000px;
  transition: transform 0.45s ease, opacity 0.45s ease, z-index 0.45s ease;
  
  opacity: 0.45;
  transform: scale(0.74) rotate(-4.5deg);
  z-index: 2;
}

.card-slide:hover,
.card-slide.has-touch-effect {
  z-index: 99 !important;
}

.card-slide.swiper-slide-prev {
  opacity: 0.8;
  transform: scale(0.88) rotate(-2deg);
  z-index: 5;
}

.card-slide.swiper-slide-active {
  opacity: 1;
  transform: scale(1.05) rotate(0deg);
  z-index: 10;
}

.card-slide.swiper-slide-next {
  opacity: 0.8;
  transform: scale(0.88) rotate(2deg);
  z-index: 5;
}

.card-slide.swiper-slide-next + .card-slide {
  opacity: 0.45;
  transform: scale(0.74) rotate(4.5deg);
  z-index: 2;
}

.card-transform-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(243, 233, 220, 0.1);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
  transform-style: preserve-3d;
  transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), border-color 0.4s ease, box-shadow 0.4s ease;
}

.swiper-slide-active .card-transform-wrapper {
  border-color: var(--color-accent);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.75);
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease, filter 0.4s ease;
}

.card-character {
  position: absolute;
  bottom: -15px;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: 0;
  pointer-events: none;
  transform: translate3d(0, 30px, -20px) scale(0.9);
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  z-index: 2;
}

/* ================= HOVER EFECTOS ================= */

/* Inclinación de la tarjeta */
.card-slide:hover .card-transform-wrapper,
.card-slide.has-touch-effect .card-transform-wrapper {
  transform: rotateX(12deg) rotateY(-2deg) scale(1.02);
  border-color: var(--color-accent);
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.85);
}

/*Oscurecimiento del fondo */
.card-slide:hover .card-image,
.card-slide.has-touch-effect .card-image {
  transform: scale(1.04);
  filter: brightness(0.75);
}

/* Activación del personaje flotante PNG */
.card-slide:hover .card-character,
.card-slide.has-touch-effect .card-character {
  opacity: 1;
  transform: translate3d(0, 0, 40px) scale(1.03);
}
</style>