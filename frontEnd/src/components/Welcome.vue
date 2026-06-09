<script setup>
import { ref, onMounted} from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { EffectCoverflow } from 'swiper/modules'
import { useRouter } from 'vue-router'


// Estilos obligatorios de Swiper
import 'swiper/css'
import 'swiper/css/effect-coverflow'

const modules = [EffectCoverflow]

import logoKinsfolk from '@/assets/cards/KINSFOLK_LOGO.png'

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

const router = useRouter();
const swiperInstance = ref(null);

const onSwiper = (swiper) => {
  swiperInstance.value = swiper;
}

const onSlideChange = (swiper) => {
  localStorage.setItem('kinsfolk_last_slide', swiper.activeIndex);
}

onMounted (() => {
  const savedIndex = localStorage.getItem('kinsfolk_last_slide');
  if(savedIndex != null && swiperInstance.value){
    swiperInstance.value.slideTo(parseInt(savedIndex,10),0);
  }
});

const openRoleDetail = (roleId) => {
  router.push({
    name: 'role-detail',
    params: {id: roleId}
  });
};

</script>

<style scoped>
/* Aplicamos tu paleta usando variables locales */
.hero-container {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 40px 20px;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Estilos de la Bienvenida */
.welcome-section {
  text-align: center;
  max-width: 800px;
  margin-bottom: 20px;
}

.logo-wrapper {
  width: 100%;
  max-width: 450px; /* Tamaño ideal para resaltar el logo horizontal de Kinsfolk */
  margin: 0 auto 24px auto;
}

.main-logo {
  width: 100%;
  height: auto;
  object-fit: contain;
}

.welcome-title {
  color: var(--color-light);
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 12px 0;
  letter-spacing: -0.5px;
}

.highlight-text {
  color: var(--color-accent); /* Color Oro de realce */
}

.welcome-subtitle {
  color: var(--color-secondary); /* Azul suave para subtítulos legibles */
  font-size: 1.9rem;
  font-weight: 500;
  line-height: 1.6;
  max-width: 600px;
  margin: 16px auto 0 auto;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

/* Estilos del área del Carrusel */
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
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6); /* Sombra marcada para contrastar con el fondo oscuro */
  border: 1px solid rgba(243, 233, 220, 0.1); /* Borde sutil usando el tono claro */
  transition: border-color 0.3s ease;

  backface-visibility: hidden;
  transform-style: preserve-3d;
  will-change: transform;
}

/* Al posicionarse sobre la tarjeta activa del centro */
.card-slide.swiper-slide-active {
  border-color: var(--color-accent); /* Resalta la tarjeta activa con el color oro */
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.slide-link {
  display: block;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.discord-section {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  width: 100%;
}

.discord-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background-color: transparent;
  color: var(--color-accent);
  border: 2px solid var(--color-accent);
  padding: 12px 36px;
  font-size: 1.2rem;
  font-weight: 600;
  text-decoration: none;
  border-radius: 30px;
  transition: all 0.3s ease-in-out;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(236, 175, 68, 0.1);
}

.discord-button:hover {
  background-color: var(--color-accent);
  color: var(--color-primary);
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(236, 175, 68, 0.3);
}

.discord-button:active {
  transform: translateY(-1px);
}

.discord-icon {
  width: 24px;
  height: auto;
  display: block;
}
</style>

<template>
  <header class="hero-container">
    <div class="welcome-section">
      <div class="logo-wrapper">
        <img :src="logoKinsfolk" alt="Kinsfolk Logo" class="main-logo" />
      </div>
      <h1 class="welcome-title">Bienvenido a <span class="highlight-text">Kinsfolk</span></h1>
      <p class="welcome-subtitle">
        Explora nuestros proyectos y soluciones de diseño exclusivos integrados en nuestro
        ecosistema.
      </p>
    </div>

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
        @swiper="onSwiper"
        @slideChange="onSlideChange"
        :modules="modules"
        class="cards-swiper"
      >
        <swiper-slide
          v-for="(card, index) in imageCards"
          :key="index"
          class = "card-slide">
          <img :src = "card.url"
               :alt = "card.alt"
               class="card-image"
               @click="openRoleDetail(card.id)"
               style="cursor: pointer;"
          />
        </swiper-slide>
      </swiper>
    </div>
    <div class="discord-section">
      <a
        href="https://discord.gg/a6TSrUpwr"
        target="_blank"
        rel="noopener noreferrer"
        class="discord-button"
      >
        <svg class="discord-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.14 96.36">
          <path
            fill="currentColor"
            d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a74.37,74.37,0,0,0,6.71-11A68.52,68.52,0,0,1,28,80.48c1-.76,2-1.56,3-2.37a75,75,0,0,0,65.2,0c1,.81,2,1.61,3,2.37a68.52,68.52,0,0,1-10.74,4.85,74.37,74.37,0,0,0,6.71,11,105.73,105.73,0,0,0,31-18.83C129.87,49.85,123.65,27,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z"
          />
        </svg>
        <span>Únete</span>
      </a>
    </div>
  </header>
</template>
