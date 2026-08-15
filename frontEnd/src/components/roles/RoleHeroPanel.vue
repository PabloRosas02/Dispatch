<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    role: any;
    designer: any;
}>();

const postalImage = computed(() => {
    if (!props.role?.basic.filename) return '';
    return `/icons/${props.role.basic.filename}`;
});
</script>

<template>
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
                        params: { serverId: role.basic.id }
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
</template>

<style scoped>
.hero-panel {
    justify-content: space-between;
}
.hero-info {
    width: 520px;
    color: var(--color-light);
}
.role-title, .role-subtitle, .role-description {
    margin: 0;
}
.role-title {
    font-size: 4rem;
    font-weight: 900;
    line-height: 1;
    color: var(--color-accent);
    text-transform: uppercase;
}
.role-subtitle {
    margin-top: 16px;
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--color-secondary);
    text-transform: uppercase;
}
.role-description {
    margin: 32px 0;
    font-size: 1.05rem;
    line-height: 1.8;
    opacity: 0.9;
}
.buttons {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
}
.postal-card {
    width: 440px;
    background: #fff;
    border-radius: 6px;
    padding: 18px 18px 48px;
    transform: rotate(-3deg);
    box-shadow: 0 30px 60px rgba(0,0,0,0.45);
}
.image-viewport {
    aspect-ratio: 1;
    overflow: hidden;
    background: var(--color-primary);
}
.postal-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
}
.postal-footer {
    margin-top: 20px;
    text-align: center;
    color: #bdbdbd;
    font-family: Impact, sans-serif;
    letter-spacing: 2px;
    font-size: 1.2rem;
}
.explore-button, .discord-button {
    height: 52px;
    padding: 0 30px;
    border: none;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    text-transform: uppercase;
    cursor: pointer;
    transition: 0.25s;
    text-decoration: none;
}
.explore-button {
    background: var(--color-accent);
    color: var(--color-primary);
}
.discord-button {
    background: #5865F2;
    color: white;
}
.explore-button:hover, .discord-button:hover {
    transform: translateY(-3px);
}

@media (max-width: 1024px) {
    .hero-panel {
        text-align: center;
    }
    .postal-card {
        width: min(340px, 100%);
        transform: none;
    }
    .hero-info {
        width: 100%;
        max-width: 600px;
    }
    .role-title {
        font-size: 2.6rem;
        text-align: center;
    }
    .role-subtitle {
        font-size: 1.15rem;
        text-align: center;
    }
    .role-description {
        text-align: center;
        margin: 24px 0;
    }
    .buttons {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .explore-button, .discord-button {
        width: 100%;
        max-width: 360px;
    }
}
</style>