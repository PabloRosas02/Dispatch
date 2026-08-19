<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

defineProps<{
    role: any;
}>();

// Emitimos un evento al componente padre para abrir el Lightbox
defineEmits(['open-lightbox']);
</script>

<template>
    <!-- Se agregó la clase gallery-panel-container para aplicar el layout lado a lado -->
    <section class="panel gallery-panel gallery-panel-container">
        <div class="gallery-title">
            <h2>GALERÍA</h2>
            <span class="section-label">Imágenes destacadas del rol</span>
        </div>

        <Swiper
            :modules="[Navigation, Pagination]"
            :slides-per-view="1"
            :space-between="0"
            :loop="role?.images?.length > 1"
            :navigation="true"
            :pagination="{ clickable: true }"
            :speed="700"
            class="showcase-gallery"
        >
            <SwiperSlide
                v-for="(image, index) in role.images"
                :key="index"
            >
                <img
                    :src="image"
                    :alt="`${role.basic.title} ${index + 1}`"
                    class="showcase-image"
                    @click="$emit('open-lightbox', image)"
                >
            </SwiperSlide>
        </Swiper>
    </section>
</template>

<style scoped>
/* Contenedor del panel para alinear el texto y la imagen */
.gallery-panel-container {
    display: flex;
    align-items: center;
    gap: 60px; 
}

/* Contenedor específico de los textos */
.gallery-title {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

/* Estilo exacto para el H2 ("GALERÍA") */
.gallery-title h2 {
    font-size: 4rem;
    font-weight: 800;
    font-style: italic;
    text-transform: uppercase;
    margin: 0 0 4px 0;
    line-height: 1;
    
    /* El degradado de amarillo brillante a naranja oscuro */
    background: linear-gradient(180deg, #ffce54 0%, #dd6a1f 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    color: transparent;
}

/* Estilo para el subtítulo ("Imágenes destacadas del rol") */
.gallery-title .section-label {
    font-size: 1.1rem;
    font-weight: 500;
    margin: 0;
    color: #c97f34; 
    letter-spacing: 0.5px;
}

.showcase-gallery {
    max-width: 760px;
    margin: 0 auto;
}

.showcase-image {
    width: 100%;
    height: auto;
    display: block;
    border-radius: 22px;
    object-fit: cover;
    cursor: pointer;
    transition: 0.35s;
    box-shadow: 0 25px 70px rgba(0,0,0,0.45);
}

.showcase-image:hover {
    transform: scale(1.02);
}

/* Sobrescribiendo Swiper de forma segura (deep) */
.showcase-gallery :deep(.swiper-button-prev),
.showcase-gallery :deep(.swiper-button-next) {
    background: none;
    width: 70px;
    height: 70px;
    color: white;
    opacity: 0.55;
}

.showcase-gallery :deep(.swiper-button-prev:hover),
.showcase-gallery :deep(.swiper-button-next:hover) {
    opacity: 1;
    color: var(--color-accent);
    transform: scale(1.15);
}

.showcase-gallery :deep(.swiper-pagination) {
    bottom: -40px;
}

.showcase-gallery :deep(.swiper-pagination-bullet) {
    width: 10px;
    height: 10px;
    opacity: 0.3;
}

.showcase-gallery :deep(.swiper-pagination-bullet-active) {
    width: 34px;
    border-radius: 20px;
    background: var(--color-accent);
    opacity: 1;
}

@media (max-width: 1024px) {
    .gallery-panel-container {
        flex-direction: column;
        gap: 30px;
    }
    .gallery-panel {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .gallery-title {
        width: 100%;
        text-align: center;
        margin-bottom: 0px;
    }
    .gallery-title h2 {
        font-size: 2.4rem;
    }
    .showcase-gallery {
        width: 100%;
    }
    .showcase-image {
        width: 100%;
        height: 260px;
        border-radius: 14px;
    }
    .showcase-gallery :deep(.swiper-button-prev),
    .showcase-gallery :deep(.swiper-button-next) {
        width: 42px;
        height: 42px;
    }
    .showcase-gallery :deep(.swiper-button-prev::after),
    .showcase-gallery :deep(.swiper-button-next::after) {
        font-size: 18px;
    }
    .showcase-gallery :deep(.swiper-pagination) {
        bottom: -28px;
    }
    .showcase-gallery :deep(.swiper-pagination-bullet) {
        width: 8px;
        height: 8px;
    }
    .showcase-gallery :deep(.swiper-pagination-bullet-active) {
        width: 22px;
    }
}
</style>