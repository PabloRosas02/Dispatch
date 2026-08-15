<script setup lang="ts">
defineProps<{
    role: any;
}>();
</script>

<template>
    <section class="panel overview-panel">
        <div class="overview-left">
            <span class="section-label">DEPARTMENT OVERVIEW</span>
            <h2>Todo comienza aquí.</h2>
            <p>
                Descubre cómo funciona este departamento,
                cuáles son sus responsabilidades,
                y qué lo hace único dentro de Dispatch.
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
</template>

<style scoped>
.overview-panel {
    justify-content: space-between;
}
.overview-left {
    width: 420px;
}
.section-label {
    display: inline-block;
    margin-bottom: 20px;
    color: var(--color-accent);
    letter-spacing: 0.25rem;
}
.overview-left h2 {
    font-size: 3rem;
    margin-bottom: 24px;
}
.overview-left p {
    line-height: 1.9;
    opacity: 0.8;
    color: #fff;
}
.overview-grid {
    width: 500px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
}
.overview-card {
    padding: 28px;
    border-radius: 18px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    backdrop-filter: blur(10px);
    transition: 0.25s;
}
.overview-card:hover {
    transform: translateY(-6px);
    border-color: var(--color-accent);
}
.overview-card span {
    display: block;
    opacity: 0.6;
    text-transform: uppercase;
    font-size: 0.8rem;
    margin-bottom: 12px;
    color: #fff;
    font-weight: 600;
}
.overview-card strong {
    font-size: 1.5rem;
    color: var(--color-accent);
}

@media (max-width: 1024px) {
    .overview-panel {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 50px;
    }
    .overview-left {
        width: 100%;
        max-width: 600px;
        text-align: center;
    }
    .overview-left h2 {
        font-size: 2.4rem;
    }
    .overview-grid {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr;
        gap: 18px;
    }
    .overview-card {
        padding: 22px;
    }
}
</style>