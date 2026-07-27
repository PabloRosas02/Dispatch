<script setup lang="ts">
import { computed } from "vue";
import type { RPServer } from "@/types/serverTypes";

const props = defineProps<{
    server: Readonly<RPServer>;
}>();

const banner = computed(() => `/images/${props.server.banner.bannerImage}`);
</script>

<template>
    <RouterLink
        class="card"
        :to="{
            name: 'role-detail',
            params: {
                serverId: server.basic.id
            }
        }"
    >
        <div
            class="image"
            :style="{
                backgroundImage: `linear-gradient(rgba(0,0,0,.15), rgba(6,12,20,.9)), url(${banner})`
            }"
        />

        <div
            class="accent"
            :style="{
                background: server.addit.color
            }"
        />

        <div class="content">
            <div class="title">
                <h3>
                    {{ server.basic.title }}
                </h3>

                <span>
                    {{ server.basic.subtitle }}
                </span>
            </div>

            <p>
                {{ server.addit.description }}
            </p>

            <div class="bottom">
                <span class="status">
                    {{ server.ver.status }}
                </span>

                <span class="arrow">
                    Explorar →
                </span>
            </div>
        </div>
    </RouterLink>
</template>

<style scoped>
.card {
    display: flex;
    flex-direction: column;

    height: 100%;

    overflow: hidden;

    background: #08131d;

    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 22px;

    text-decoration: none;

    transition:
        transform .35s ease,
        border-color .35s ease,
        box-shadow .35s ease;
}

.card:hover {
    transform: translateY(-8px);

    border-color: rgba(236, 175, 68, 0.3);

    box-shadow: 0 20px 45px rgba(0, 0, 0, 0.45);
}

.image {
    aspect-ratio: 16 / 9;

    background-size: cover;
    background-position: center;
}

.accent {
    height: 4px;

    flex-shrink: 0;
}

.content {
    display: flex;
    flex-direction: column;

    flex: 1;

    gap: 18px;

    padding: 28px;
}

.title {
    display: flex;
    flex-direction: column;

    gap: 6px;
}

.title h3 {
    margin: 0;

    color: var(--color-accent);

    font-size: 2rem;
}

.title span {
    color: var(--color-secondary);

    font-weight: 600;
}

.content p {
    flex: 1;

    margin: 0;

    color: #fff;

    line-height: 1.8;
}

.bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;

    margin-top: auto;
    padding-top: 18px;

    border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.status {
    padding: 6px 14px;

    border-radius: 999px;

    background: rgba(255, 255, 255, 0.06);

    color: #fff;

    font-size: .8rem;

    text-transform: uppercase;
}

.arrow {
    color: var(--color-accent);

    font-weight: 700;

    transition: transform .25s ease;
}

.card:hover .arrow {
    transform: translateX(8px);
}

@media (max-width: 768px) {
    .title h3 {
        font-size: 1.6rem;
    }
}
</style>