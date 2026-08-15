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
    <section class="panel gallery-panel">
        <div class="gallery-title">
            <h2>GALERÍA</h2>
            <span class="section-label">Imágenes destacadas del rol</span>
        </div>

        <Swiper
            :modules="[Navigation, Pagination]"
            :slides-per-view="1"
            :space-between="0"
            :loop="true"
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
.gallery-panel {
    display: grid;
    grid-template-columns: 320px 1fr;
    gap: 60px;
    align-items: center;
}
.gallery-title {
    width: 100%;
    margin-bottom: 50px;
}
.gallery-title h2 {
    font-size: 3rem;
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
    .gallery-panel {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .gallery-title {
        width: 100%;
        text-align: center;
        margin-bottom: 30px;
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