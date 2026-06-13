<script setup lang='ts'>
import { ref, onMounted, computed } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { useRouter } from 'vue-router';
import type { RPServer } from '../types/serverTypes.ts';
import type { Swiper as SwiperClass } from 'swiper';
import { useServerService } from '../services/serverService.ts';

// Estilos base de Swiper
import 'swiper/css'

const router = useRouter()
const swiperInstance = ref<SwiperClass>()
const { getAllServers, getSvgUrl } = useServerService();

const baseCards = getAllServers();

const duplicatedCards = computed(() => [...baseCards, ...baseCards])

const onSwiper = (swiper: SwiperClass) => {
  swiperInstance.value = swiper;
}

const onSlideChange = (swiper: SwiperClass) => {
  localStorage.setItem('kinsfolk_last_slide', `${swiper.activeIndex}`);
}

onMounted(() => {
  let savedIndex  = localStorage.getItem('kinsfolk_last_slide')
  if (savedIndex != null && swiperInstance.value) {
    swiperInstance.value.slideTo(parseInt(savedIndex, 10), 0)
  }
})

const handleSwiperClick = (swiper: SwiperClass) => {
  const clickedSlide = swiper.clickedSlide;
  if (!clickedSlide) return; // Si hacen clic en un espacio vacío, no hace nada

  // Extraemos el ID del atributo "data-id" que pusimos en el HTML
  const cardId:string | null = clickedSlide.getAttribute('data-id');

  // Verificamos si la tarjeta clickeada ya se encuentra en la posición central
  const isCentered = clickedSlide.classList.contains('swiper-slide-active')

  if (!isCentered) {
    // Está a la izquierda o derecha. Swiper la moverá al centro automáticamente,
    // y esperamos 350ms a que termine la animación para abrir la página.
    setTimeout(() => {
      openRoleDetail(cardId)
    }, 350)
  } else{
    //Ya está en el centro, abre la página de inmediato.
    openRoleDetail(cardId)
  }
}

const openRoleDetail = (roleId: string | null ) => {
  if(roleId == null){
    return;
  }
  router.push({
    name: 'role-detail',
    params: { serverId: roleId }
  })
}
</script>

<template>
  <div class="carousel-section">
    <swiper
      v-if='baseCards.length > 0'
      :centeredSlides="true"
      :slidesPerView="5"
      :loop="true"
      :spaceBetween="-45"
      :watchSlidesProgress="true"
      :slideToClickedSlide="true"
      @swiper="onSwiper"
      @slideChange="onSlideChange"
      @click="handleSwiperClick"
      class="cards-swiper"
    >
      <swiper-slide
        v-for="(card, index) in duplicatedCards"
        :key="card.id + '-' + index"
        :data-id="card.id"
        class="card-slide"
      >
        <img
          :src="getSvgUrl(card.id)"
          :alt="card.title"
          class="card-image"
        />
      </swiper-slide>
    </swiper>
  </div>
</template>

<style scoped>
.carousel-section {
  width: 100%;
  max-width: 1100px;
  margin: 20px auto 0 auto;
  overflow: hidden; /* Muestra estrictamente 5 imágenes a la vez */
}

.cards-swiper {
  width: 100%;
  padding-top: 40px;
  padding-bottom: 60px;
}

.card-slide {
  width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(243, 233, 220, 0.1);
  cursor: pointer;
  transition: transform 0.45s ease, opacity 0.45s ease, border-color 0.45s ease, box-shadow 0.45s ease;
  opacity: 0.45;
  transform: scale(0.74) rotate(-4.5deg);
  z-index: 2;
}

.card-slide.swiper-slide-prev {
  opacity: 0.8;
  transform: scale(0.88) rotate(-2deg);
  z-index: 5;
}

.card-slide.swiper-slide-active {
  opacity: 1;
  transform: scale(1.05) rotate(0deg);
  border-color: var(--color-accent);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.75);
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

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
</style>
