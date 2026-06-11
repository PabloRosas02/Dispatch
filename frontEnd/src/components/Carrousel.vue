<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { EffectCoverflow } from 'swiper/modules'
import { useRouter } from 'vue-router'

// Estilos obligatorios de Swiper
import 'swiper/css'
import 'swiper/css/effect-coverflow'

const modules = [EffectCoverflow]
const router = useRouter()
const swiperInstance = ref(null)

// Importación de las imágenes para las tarjetas
import imgLEO from '@/assets/cards/K_LEO.png'
import imgSAMS from '@/assets/cards/K_SAMS.png'
import imgSAFD from '@/assets/cards/K_SAFD.png'
import imgCiviles from '@/assets/cards/K_CIVILES.png'
import imgIlegales from '@/assets/cards/K_ILEGALES.png'
import imgCreator from '@/assets/cards/K_CREATOR.png'

const imageCards = ref([
  { id: 'leo', url: imgLEO, alt: 'L.E.O' },
  { id: 'sams', url: imgSAMS, alt: 'SAMS' },
  { id: 'safd', url: imgSAFD, alt: 'SAFD' },
  { id: 'civiles', url: imgCiviles, alt: 'Proyectos Civiles' },
  { id: 'ilegales', url: imgIlegales, alt: 'Ilegales' },
  { id: 'creator', url: imgCreator, alt: 'Content Creator' },
])

const onSwiper = (swiper) => {
  swiperInstance.value = swiper
}

const onSlideChange = (swiper) => {
  localStorage.setItem('kinsfolk_last_slide', swiper.activeIndex)
}

onMounted(async () => {
  const savedIndex = localStorage.getItem('kinsfolk_last_slide')
  if (savedIndex != null) {
    await nextTick()
    setTimeout(() => {
      if (swiperInstance.value) {
        swiperInstance.value.slideTo(parseInt(savedIndex, 10), 0)
      }
    }, 100)
  }
})

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
      :effect="'coverflow'"
      :grabCursor="true"
      :centeredSlides="true"
      :slidesPerView="'auto'"
      :loop="true"
      :watchSlidesProgress="true"
      :coverflowEffect="{
        rotate: 25,
        stretch: -30,
        depth: 120,
        modifier: 1.2,
        slideShadows: true,
      }"
      :slideToClickedSlide="false"  
      :preventClicks="false"        
      :preventClicksPropagation="false" 
      @swiper="onSwiper"
      @slideChange="onSlideChange"
      :modules="modules"
      class="cards-swiper"
    >
      <swiper-slide
        v-for="(card, index) in imageCards"
        :key="index"
        class="card-slide"
        @click="openRoleDetail(card.id)"
        style="cursor: pointer;"
      >
        <img 
          :src="card.url"
          :alt="card.alt"
          class="card-image"
        />
      </swiper-slide>
    </swiper>
  </div>
</template>

<style scoped>
/* Estilos específicos del área del Carrusel */
.carousel-section {
  width: 100%;
  max-width: 1100px;
  margin-top: 20px;
}

.cards-swiper {
  width: 100%;
  padding-top: 30px;
  padding-bottom: 60px;
}

.card-slide {
  width: 300px;
  height: 300px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(243, 233, 220, 0.1);
  transition: border-color 0.3s ease;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  will-change: transform;
}

.card-slide.swiper-slide-active {
  border-color: var(--color-accent);
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  pointer-events: none; /* El clic pasa al contenedor */
  user-select: none;
}
</style>