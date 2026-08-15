<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import NotFound from '@/components/miscellaneous/NotFound.vue';
import BuilderToolbar from '@/components/editor/BuilderToolbar.vue';

import RoleHeroPanel from '@/components/roles/RoleHeroPanel.vue';
import RoleOverviewPanel from '@/components/roles/RoleOverviewPanel.vue';
import RoleGalleryPanel from '@/components/roles/RoleGalleryPanel.vue';

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
    fetchRoleData
} = useRoleDetail(currentServerId);

const { initBasic } = useServerService(); // Quitamos initRules si ya no existe
const cacheKey = `server_page_config_${currentServerId}`;

const designer = useDesigner({ cacheKey });
const isAuthorizedDesigner = computed(() => route.query.mode === 'admin-designer');

onMounted(async () => {
    await initBasic();
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

        const payload = { key: cacheKey, value: role.value };
        let response = await fetch(`/api/cache/${cacheKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            await fetch(`/api/cache/${cacheKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: cacheKey, data: role.value })
            });
        }
    } catch (error) {
        console.error('[RoleDetailView]', error);
    } finally {
        bLoading.value = false;
    }
};
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
            <RouterLink to="/roles" class="back-button">
                ← Back
            </RouterLink>

            <div class="panoramic-track">
                <!-- PANEL 1: HERO -->
                <RoleHeroPanel 
                    :role="role" 
                    :designer="designer" 
                />

                <!-- PANEL 2: OVERVIEW -->
                <RoleOverviewPanel 
                    :role="role" 
                />

                <!-- PANEL 3: GALLERY -->
                <RoleGalleryPanel 
                    :role="role" 
                    @open-lightbox="activeLightboxImage = $event" 
                />
            </div>
        </main>
    </template>

    <NotFound v-else-if="!bLoading" />

    <div v-else class="loading-state">
        <div class="loading-spinner"/>
    </div>

    <!-- MODAL LIGHTBOX -->
    <Transition name="fade">
        <div
            v-if="activeLightboxImage"
            class="image-lightbox-modal"
            @click="activeLightboxImage = null"
        >
            <button class="lightbox-close-btn" @click="activeLightboxImage = null">
                ✕
            </button>
            <div class="lightbox-content" @click.stop>
                <img :src="activeLightboxImage" class="lightbox-full-image">
            </div>
        </div>
    </Transition>
</template>

<style>
/* 
 * AVISO: Nota que este style ya NO tiene el atributo "scoped". 
 * Esto permite que las clases `.panel` sean compartidas globalmente por los hijos. 
 */
.detail-page-panoramic {
    width: 100%;
    height: 100vh;
    overflow-x: auto;
    overflow-y: hidden;
    display: flex;
    align-items: center;
    background: linear-gradient(135deg, var(--bg-gradient) 0%, var(--color-primary) 100%), var(--color-primary);
    font-family: "Exo 2", sans-serif;
}
.detail-page-panoramic::-webkit-scrollbar {
    display: none;
}
.panoramic-track {
    display: flex;
    align-items: center;
    gap: 180px;
    padding: 0 120px;
    min-width: max-content;
    font-family: "Exo 2", sans-serif;
}
.panel {
    width: 1100px;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 80px;
    flex-shrink: 0;
}
.back-button {
    position: fixed;
    top: 90px;
    left: 30px;
    z-index: 100;
    padding: 12px 24px;
    border-radius: 30px;
    text-decoration: none;
    background: white;
    color: var(--color-primary);
    font-weight: 700;
}

/* LIGHTBOX */
.image-lightbox-modal {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(8,12,18,0.94);
    backdrop-filter: blur(10px);
    z-index: 99999;
}
.lightbox-content {
    max-width: 90%;
    max-height: 90%;
}
.lightbox-full-image {
    display: block;
    max-width: 100%;
    max-height: 90vh;
    object-fit: contain;
    border-radius: 8px;
    box-shadow: 0 30px 70px rgba(0,0,0,0.65);
}
.lightbox-close-btn {
    position: absolute;
    top: 30px;
    right: 40px;
    width: 48px;
    height: 48px;
    border: none;
    border-radius: 50%;
    background: rgba(255,255,255,0.08);
    color: white;
    cursor: pointer;
    font-size: 1.3rem;
    transition: 0.25s;
}
.lightbox-close-btn:hover {
    background: var(--color-accent);
    color: #111;
}
.fade-enter-active, .fade-leave-active {
    transition: 0.25s;
}
.fade-enter-from, .fade-leave-to {
    opacity: 0;
}

/* DESIGNER / LOADING */
.designer-trigger {
    position: fixed;
    top: 24px;
    right: 24px;
    z-index: 9999;
    padding: 12px 18px;
    border-radius: 8px;
    border: 1px solid var(--color-accent);
    background: rgba(0,0,0,0.4);
    color: var(--color-accent);
    cursor: pointer;
    backdrop-filter: blur(8px);
}
.editable-container {
    outline: none;
    border: 1px dashed var(--color-accent);
    padding: 8px 12px;
    border-radius: 8px;
    background: rgba(255,255,255,0.03);
}
.loading-state {
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
}
.loading-spinner {
    width: 42px;
    height: 42px;
    border: 4px solid rgba(255,255,255,0.15);
    border-top-color: var(--color-accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}
@keyframes spin {
    to { transform: rotate(360deg); }
}

@media (max-width: 1024px) {
    .detail-page-panoramic {
        width: 100%;
        height: 100dvh;
        overflow-y: auto;
        overflow-x: hidden;
        display: block;
        scroll-behavior: smooth;
    }
    .panoramic-track {
        display: flex;
        flex-direction: column;
        min-width: 100%;
        width: 100%;
        gap: 100px;
        padding: 100px 20px 60px;
        box-sizing: border-box;
    }
    .panel {
        width: 100%;
        min-height: auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 40px;
    }
    .back-button {
        top: 85px;
        left: 20px;
        padding: 10px 18px;
    }
}
</style>