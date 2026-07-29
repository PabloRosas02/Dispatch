<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import NotFound from '@/components/miscellaneous/NotFound.vue';
import BuilderToolbar from '@/components/editor/BuilderToolbar.vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';



import { useDesigner } from '@/composables/useDesigner';
import { useRoleDetail } from '@/composables/useRoleDetail';
import { useServerService } from '@/services/serverService';

const route = useRoute();

const containerRef = ref<HTMLElement | null>(null);

const currentServerId: string = Array.isArray(route.params.serverId)
    ? route.params.serverId[0] ?? 'leo'
    : route.params.serverId ?? 'leo';
const {
    role,
    bLoading,
    activeLightboxImage,
    fetchRoleData,
    handleAddImage,
    removeImageAtIndex
} = useRoleDetail(currentServerId);

const { initBasic, initRules } = useServerService();

const cacheKey = `server_page_config_${currentServerId}`;

const designer = useDesigner({
    cacheKey
});

const isAuthorizedDesigner = computed(
    () => route.query.mode === 'admin-designer'
);

onMounted(async () => {
    await initBasic();
    await initRules();
    await fetchRoleData();
});

const handleWheelScroll = (event: WheelEvent) => {
    if (!containerRef.value || event.deltaY === 0) return;

    event.preventDefault();

    containerRef.value.scrollBy({
        left: event.deltaY * 2.8,
        behavior: 'auto'
    });
};

const handleSaveOrEdit = async () => {

    if (!role.value) return;

    designer.toggleEdit(role, {
        title: ref(document.querySelector('.role-title')),
        subtitle: ref(document.querySelector('.role-subtitle')),
        description: ref(document.querySelector('.role-description'))
    });

    if (designer.isEditing.value) return;

    try {

        await nextTick();

        bLoading.value = true;

        const payload = {
            key: cacheKey,
            value: role.value
        };

        let response = await fetch(`/api/cache/${cacheKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {

            response = await fetch(`/api/cache/${cacheKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: cacheKey,
                    data: role.value
                })
            });

        }

    } catch (error) {

        console.error('[RoleDetailView]', error);

    } finally {

        bLoading.value = false;

    }
};

const postalImage = computed(() => {
    if (!role.value?.basic.filename) return '';

    return `/icons/${role.value.basic.filename}`;
});
</script>

<template>

    <BuilderToolbar
        v-if="isAuthorizedDesigner && designer.isEditing.value"
        :designer="designer"
        :onSave="handleSaveOrEdit"
    />

    <button
        v-if="isAuthorizedDesigner && role && !designer.isEditing.value"
        class="designer-trigger"
        @click="handleSaveOrEdit"
    >
        📝 {{ role.basic.id.toUpperCase() }}
    </button>

    <template v-if="role">

        <main
            ref="containerRef"
            class="detail-page-panoramic"
            :style="{ '--bg-gradient': role.addit.color }"
            @wheel="handleWheelScroll"
        >

            <RouterLink
                to="/roles"
                class="back-button"
            >
                ← Back
            </RouterLink>

            <div class="panoramic-track">

                <!-- =========================
                     HERO
                ========================== -->

                <section class="panel hero-panel">

                    <div class="postal-card">

                        <div class="image-viewport">

                           <img
                            class="postal-image"
                            :src="postalImage"
                            :alt="role.basic.title"
                          />

                        </div>

                        <div class="postal-footer">

                            {{ role.basic.title.toUpperCase() }}

                        </div>

                    </div>

                    <div class="hero-info">

                        <component
                            :is="designer.isEditing.value ? 'div' : 'h1'"
                            class="role-title"
                            :contenteditable="designer.isEditing.value"
                            v-html="role.basic.title"
                        />

                        <component
                            :is="designer.isEditing.value ? 'div' : 'h2'"
                            class="role-subtitle"
                            :contenteditable="designer.isEditing.value"
                            v-html="role.basic.subtitle"
                        />

                        <component
                            :is="designer.isEditing.value ? 'div' : 'p'"
                            class="role-description"
                            :contenteditable="designer.isEditing.value"
                            v-html="role.addit.description"
                        />

                        <div class="buttons">

                            <RouterLink
                                class="explore-button"
                                :to="{
                                    name: 'rules-detail',
                                    params: {
                                        serverId: role.basic.id
                                    }
                                }"
                            >
                                Consulta las normativas
                            </RouterLink>

                            <a
                                v-if="role.addit.discordLink"
                                :href="role.addit.discordLink"
                                target="_blank"
                                class="discord-button"
                            >
                                Únete al Discord
                            </a>

                        </div>

                    </div>

                </section>

                <!-- =========================
                     OVERVIEW
                ========================== -->

                <section class="panel overview-panel">

                    <div class="overview-left">

                        <span class="section-label">

                            DEPARTMENT OVERVIEW

                        </span>

                        <h2>

                            Todo comienza aquí.

                        </h2>

                        <p>

                            Descubre cómo funciona este departamento,
                            cuáles son sus responsabilidades,
                            y qué lo hace único dentro de Kinsfolk.
                        </p>

                    </div>

                    <div class="overview-grid">

                        <div class="overview-card">

                            <span>Status</span>

                            <strong>Active</strong>

                        </div>

                        <div class="overview-card">

                            <span>Type</span>

                            <strong>Government</strong>

                        </div>

                        <div class="overview-card">

                            <span>Recruitment</span>

                            <strong>Open</strong>

                        </div>

                        <div class="overview-card">

                            <span>Experience</span>

                            <strong>Medium</strong>

                        </div>

                    </div>

                </section>

                <!-- =========================
                     GALLERY
                ========================== -->

                <section class="panel gallery-panel">

                    <div class="gallery-title">

                        <h2>
                            GALERÍA
                        </h2>
                        <span class="section-label">

                            Imágenes destacadas del rol
                        </span>

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
                              @click="activeLightboxImage = image"
                          >
                      </SwiperSlide>

                  </Swiper>

                </section>

            </div>

        </main>

    </template>

    <NotFound
        v-else-if="!bLoading"
    />

    <div
        v-else
        class="loading-state"
    >

        <div class="loading-spinner"/>

    </div>

    <Transition name="fade">

        <div
            v-if="activeLightboxImage"
            class="image-lightbox-modal"
            @click="activeLightboxImage = null"
        >

            <button
                class="lightbox-close-btn"
                @click="activeLightboxImage = null"
            >

                ✕

            </button>

            <div
                class="lightbox-content"
                @click.stop
            >

                <img
                    :src="activeLightboxImage"
                    class="lightbox-full-image"
                >

            </div>

        </div>

    </Transition>

</template>

<style scoped>
/* ==========================================================
   LAYOUT
========================================================== */

.detail-page-panoramic{
    width:100%;
    height:100vh;
    overflow-x:auto;
    overflow-y:hidden;
    display:flex;
    align-items:center;
    background:
        linear-gradient(135deg,var(--bg-gradient) 0%,var(--color-primary) 100%),
        var(--color-primary);
    font-family: "Exo 2", sans-serif;
}

.detail-page-panoramic::-webkit-scrollbar{
    display:none;
}

.panoramic-track{
    display:flex;
    align-items:center;
    gap:180px;
    padding:0 120px;
    min-width:max-content;
    font-family: "Exo 2", sans-serif;
}

.panel{
    width:1100px;
    min-height:100vh;
    display:flex;
    align-items:center;
    justify-content:center;
    gap:80px;
    flex-shrink:0;
}

/* ==========================================================
   HERO
========================================================== */

.hero-panel{
    justify-content:space-between;
}

.hero-info{
    width:520px;
    color:var(--color-light);
}

.role-title,
.role-subtitle,
.role-description{
    margin:0;
}

.role-title{
    font-size:4rem;
    font-weight:900;
    line-height:1;
    color:var(--color-accent);
    text-transform:uppercase;
}

.role-subtitle{
    margin-top:16px;
    font-size:1.3rem;
    font-weight:700;
    color:var(--color-secondary);
    text-transform:uppercase;
}

.role-description{
    margin:32px 0;
    font-size:1.05rem;
    line-height:1.8;
    opacity:.9;
}

.buttons{
    display:flex;
    gap:16px;
    flex-wrap:wrap;
}

/* ==========================================================
   POLAROID
========================================================== */

.postal-card{
    width:440px;
    background:#fff;
    border-radius:6px;
    padding:18px 18px 48px;
    transform:rotate(-3deg);
    box-shadow:0 30px 60px rgba(0,0,0,.45);
}

.image-viewport{
    aspect-ratio:1;
    overflow:hidden;
    background:var(--color-primary);
}

.postal-image{
    width:100%;
    height:100%;
    object-fit:contain;
    display:block;
}

.postal-footer{
    margin-top:20px;
    text-align:center;
    color:#bdbdbd;
    font-family:Impact,sans-serif;
    letter-spacing:2px;
    font-size:1.2rem;
}

/* ==========================================================
   BUTTONS
========================================================== */

.explore-button,
.discord-button{
    height:52px;
    padding:0 30px;
    border:none;
    border-radius:6px;
    display:flex;
    align-items:center;
    justify-content:center;
    font-weight:700;
    text-transform:uppercase;
    cursor:pointer;
    transition:.25s;
    text-decoration:none;
}

.explore-button{
    background:var(--color-accent);
    color:var(--color-primary);
}

.discord-button{
    background:#5865F2;
    color:white;
}

.explore-button:hover,
.discord-button:hover{
    transform:translateY(-3px);
}

/* ==========================================================
   OVERVIEW
========================================================== */

.overview-panel{
    justify-content:space-between;
}

.overview-left{
    width:420px;
}

.section-label{
    display:inline-block;
    margin-bottom:20px;
    color:var(--color-accent);
    letter-spacing:.25rem;

}

.overview-left h2{
    font-size:3rem;
    margin-bottom:24px;
}

.overview-left p{
    line-height:1.9;
    opacity:.8;
    color: #fff;
}

.overview-grid{
    width:500px;
    display:grid;
    grid-template-columns:repeat(2,1fr);
    gap:20px;
}

.overview-card{
    padding:28px;
    border-radius:18px;
    background:rgba(255,255,255,.05);
    border:1px solid rgba(255,255,255,.08);
    backdrop-filter:blur(10px);
    transition:.25s;
}

.overview-card:hover{
    transform:translateY(-6px);
    border-color:var(--color-accent);
}

.overview-card span{
    display:block;
    opacity:.6;
    text-transform:uppercase;
    font-size:.8rem;
    margin-bottom:12px;
    color:#fff;
    font-weight:600;
}

.overview-card strong{
    font-size:1.5rem;
    color:var(--color-accent);
}

/* ==========================================================
   GALLERY HEADER
========================================================== */

.gallery-panel{
    display:grid;
    grid-template-columns:320px 1fr;
    gap:60px;
    align-items:center;
}

.gallery-title{
    width:100%;
    margin-bottom:50px;
}

.gallery-title h2{
    font-size:3rem;
}

/* ==========================================================
   BACK
========================================================== */

.back-button{
    position:fixed;
    top:90px;
    left:30px;
    z-index:100;
    padding:12px 24px;
    border-radius:30px;
    text-decoration:none;
    background:white;
    color:var(--color-primary);
    font-weight:700;
}
/* ==========================================================
   GALLERY
========================================================== */

.gallery-panel :deep(li:nth-child(3n)),
.gallery-panel :deep(.gallery-item:nth-child(3n)){
    grid-column:span 2;
}

.gallery-panel :deep(li:nth-child(5n)),
.gallery-panel :deep(.gallery-item:nth-child(5n)){
    grid-row:span 2;
}

.gallery-panel :deep(img:hover){
    transform:scale(1.06);
}

/* ==========================================================
   LIGHTBOX
========================================================== */

.image-lightbox-modal{
    position:fixed;
    inset:0;
    display:flex;
    align-items:center;
    justify-content:center;
    background:rgba(8,12,18,.94);
    backdrop-filter:blur(10px);
    z-index:99999;
}

.lightbox-content{
    max-width:90%;
    max-height:90%;
}

.lightbox-full-image{
    display:block;
    max-width:100%;
    max-height:90vh;
    object-fit:contain;
    border-radius:8px;
    box-shadow:0 30px 70px rgba(0,0,0,.65);
}

.lightbox-close-btn{
    position:absolute;
    top:30px;
    right:40px;
    width:48px;
    height:48px;
    border:none;
    border-radius:50%;
    background:rgba(255,255,255,.08);
    color:white;
    cursor:pointer;
    font-size:1.3rem;
    transition:.25s;
}

.lightbox-close-btn:hover{
    background:var(--color-accent);
    color:#111;
}

.fade-enter-active,
.fade-leave-active{
    transition:.25s;
}

.fade-enter-from,
.fade-leave-to{
    opacity:0;
}

/* ==========================================================
   DESIGNER
========================================================== */

.designer-trigger{
    position:fixed;
    top:24px;
    right:24px;
    z-index:9999;
    padding:12px 18px;
    border-radius:8px;
    border:1px solid var(--color-accent);
    background:rgba(0,0,0,.4);
    color:var(--color-accent);
    cursor:pointer;
    backdrop-filter:blur(8px);
}

.editable-container{
    outline:none;
    border:1px dashed var(--color-accent);
    padding:8px 12px;
    border-radius:8px;
    background:rgba(255,255,255,.03);
}

/* ==========================================================
   LOADING
========================================================== */

.loading-state{
    height:100vh;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    gap:20px;
}

.loading-spinner{
    width:42px;
    height:42px;
    border:4px solid rgba(255,255,255,.15);
    border-top-color:var(--color-accent);
    border-radius:50%;
    animation:spin .8s linear infinite;
}
.showcase-gallery{

    max-width:760px;

    margin:0 auto;

}

.showcase-image{

    width:100%;
    height:auto;
    display:block;
    border-radius:22px;

    object-fit:cover;

    cursor:pointer;

    transition:.35s;

    box-shadow:
        0 25px 70px rgba(0,0,0,.45);

}

.showcase-image:hover{

    transform:scale(1.02);

}
.showcase-gallery :deep(.swiper-button-prev),
.showcase-gallery :deep(.swiper-button-next){

    background:none;

    width:70px;
    height:70px;

    color:white;

    opacity:.55;

}

.showcase-gallery :deep(.swiper-button-prev:hover),
.showcase-gallery :deep(.swiper-button-next:hover){

    opacity:1;

    color:var(--color-accent);

    transform:scale(1.15);

}

.showcase-gallery :deep(.swiper-pagination){

    bottom:-40px;

}

.showcase-gallery :deep(.swiper-pagination-bullet){

    width:10px;
    height:10px;

    opacity:.3;

}

.showcase-gallery :deep(.swiper-pagination-bullet-active){

    width:34px;

    border-radius:20px;

    background:var(--color-accent);

    opacity:1;

}

@keyframes spin{

    to{
        transform:rotate(360deg);
    }

}
/* ==========================================================
   MOBILE
========================================================== */

@media (max-width:1024px){

    .detail-page-panoramic{

        width:100%;
        height:100dvh;

        overflow-y:auto;
        overflow-x:hidden;

        display:block;

        scroll-behavior:smooth;

    }

    .panoramic-track{

        display:flex;
        flex-direction:column;

        min-width:100%;
        width:100%;

        gap:100px;

        padding:100px 20px 60px;

        box-sizing:border-box;

    }

    .panel{

        width:100%;
        min-height:auto;

        display:flex;
        flex-direction:column;

        align-items:center;
        justify-content:center;

        gap:40px;

    }

    /* HERO */

    .hero-panel{

        text-align:center;

    }

    .postal-card{

        width:min(340px,100%);
        transform:none;

    }

    .hero-info{

        width:100%;
        max-width:600px;

    }

    .role-title{

        font-size:2.6rem;
        text-align:center;

    }

    .role-subtitle{

        font-size:1.15rem;
        text-align:center;

    }

    .role-description{

        text-align:center;
        margin:24px 0;

    }

    .buttons{

        width:100%;

        display:flex;
        flex-direction:column;

        align-items:center;

    }

    .explore-button,
    .discord-button{

        width:100%;
        max-width:360px;

    }

    /* OVERVIEW */

    .overview-panel{

        display:flex;
        flex-direction:column;

        align-items:center;

        gap:50px;

    }

    .overview-left{

        width:100%;
        max-width:600px;

        text-align:center;

    }

    .overview-left h2{

        font-size:2.4rem;

    }

    .overview-grid{

        width:100%;

        display:grid;
        grid-template-columns:1fr;
        gap:18px;

    }

    .overview-card{

        padding:22px;

    }
/* GALLERY */

.gallery-panel{

    width:100%;
    align-items:center;

}

.gallery-title{

    width:100%;
    text-align:center;

    margin-bottom:30px;

}

.gallery-title h2{

    font-size:2.4rem;

}

.showcase-gallery{

    width:100%;

}

.showcase-image{

    width:100%;
    height:260px;

    border-radius:14px;

}

.showcase-gallery :deep(.swiper-button-prev),
.showcase-gallery :deep(.swiper-button-next){

    width:42px;
    height:42px;

}

.showcase-gallery :deep(.swiper-button-prev::after),
.showcase-gallery :deep(.swiper-button-next::after){

    font-size:18px;

}

.showcase-gallery :deep(.swiper-pagination){

    bottom:-28px;

}

.showcase-gallery :deep(.swiper-pagination-bullet){

    width:8px;
    height:8px;

}

.showcase-gallery :deep(.swiper-pagination-bullet-active){

    width:22px;

}

    /* BACK */

    .back-button{

        top:85px;
        left:20px;

        padding:10px 18px;

    }

}
</style>
