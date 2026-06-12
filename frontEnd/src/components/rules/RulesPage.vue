<!-- src/components/rules/RulesPage.vue -->
<template>
  <main
    class="rules-page"
    :style="{ '--server-color': serverData.color }"
  >
    <!-- Fondo con gradiente y efectos (sin cambios en la parte visual) -->
    <div class="bg-animation">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
      <div class="grid-overlay"></div>
    </div>

    <div class="page-header">
      <h1 class="server-title">Reglamento para el servidor {{ serverData.title }}</h1>
      <p class="server-subtitle">{{ serverData.subtitle }}</p>
      <div class="title-decoration">
        <span class="line"></span>
        <span class="dot"></span>
        <span class="line"></span>
      </div>
    </div>

    <div class="rules-content">
      <section
        v-for="(section, sIndex) in serverData.sections"
        :key="sIndex"
        class="rules-section"
      >
        <h2 class="section-title">{{ section.title }}</h2>
        <div class="rules-list">
          <RuleCard
            v-for="(rule, rIndex) in section.rules"
            :key="rIndex"
            :index="String(rIndex + 1).padStart(2, '0')"
            :title="rule.title"
            :description="rule.description"
            :example="rule.example"
            :serverColor="serverData.color"
          />
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { RPServer } from '@/types/serverTypes.ts';
import RuleCard from './RuleCard.vue';

defineProps<{
  serverData: RPServer;
}>();
</script>

<style scoped>
/* Mantenemos todos los estilos de fondo, gradientes, orbes, grid, etc.
   Tal cual estaban en la versión anterior, sin cambios. */
.rules-page {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--server-color) 0%, var(--color-background) 100%), var(--color-background);
  overflow-x: hidden;
  padding: 4rem 2rem;
}

/* ... (Aquí van todos los estilos de .bg-animation, .gradient-orb,
   .grid-overlay, @keyframes, etc. que ya tenías, sin modificar) ... */

/* Estilos nuevos o actualizados para el encabezado */
.page-header {
  text-align: center;
  margin-bottom: 4rem;
  position: relative;
  z-index: 2;
}

.server-title {
  font-size: 2.5rem;
  color: var(--color-heading);
  margin-bottom: 0.5rem;
  letter-spacing: 1px;
}

.server-subtitle {
  font-size: 1.2rem;
  color: var(--color-text);
  margin-bottom: 1.5rem;
  opacity: 0.9;
}

.title-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.title-decoration .line {
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--server-color), var(--color-accent), transparent);
}

.title-decoration .dot {
  width: 8px;
  height: 8px;
  background: linear-gradient(135deg, var(--server-color), var(--color-accent));
  border-radius: 50%;
  box-shadow: 0 0 10px var(--server-color);
}

/* Estilos para la sección de reglas */
.rules-content {
  max-width: 1000px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.rules-section {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.8rem;
  color: var(--color-heading);
  margin-bottom: 1.5rem;
  padding-left: 1rem;
  border-left: 4px solid var(--server-color);
}

.rules-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .rules-page {
    padding: 2rem 1rem;
  }

  .server-title {
    font-size: 1.8rem;
  }

  .server-subtitle {
    font-size: 1rem;
  }

  .section-title {
    font-size: 1.4rem;
  }
}
</style>
