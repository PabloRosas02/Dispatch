<!-- src/components/RulesPage.vue -->
<template>
  <main class="rules-container">
    <div class="server-showcase">
      <!-- Layout Banner Graphic Background -->
      <div class="banner-wrapper">
        <img 
          :src="serverData.image" 
          :alt="serverData.title" 
          class="server-banner" 
        />
        <div class="banner-overlay">
          <h1 class="main-title">{{ serverData.title }}</h1>
          <h2 ><span class="genre-tag">{{ serverData.subtitle }}</span></h2>
          
          <a 
            :href="serverData.discordLink" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="discord-button"
          >
            Join Official Discord
          </a>
        </div>
      </div>

      <!-- Rules Array Structure Iteration -->
      <div class="rules-layout">
        <section 
          v-for="(section, sIndex) in serverData.sections" 
          :key="sIndex"
          class="rules-section"
        >
          <h2 class="section-title">{{ section.title }}</h2>
          
          <RuleCard 
            v-for="(rule, rIndex) in section.rules" 
            :key="rIndex"
            :index="String(rIndex + 1).padStart(2, '0')"
            :title="rule.title"
            :description="rule.description"
            :example="rule.example"
          />
        </section>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { RPServer } from '@/types/serverTypes.ts';
import RuleCard from './RuleCard.vue';

// DefineProps typed cleanly using the flat global interface
defineProps<{
  serverData: RPServer;
}>();
</script>

<style scoped>
.rules-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
  background-color: var(--color-background);
  min-height: 100vh;
}

.banner-wrapper {
  position: relative;
  height: 300px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 3.5rem;
  border: 1px solid var(--color-border);
}

.server-banner {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.25;
}

.banner-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  text-align: center;
  background: linear-gradient(180deg, transparent 0%, rgba(6, 15, 22, 0.95) 90%);
}

.genre-tag {
  font-size: 0.8rem;
  color: var(--color-text);
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 0.5rem;
}

.main-title {
  color: var(--color-heading);
  font-size: 3rem;
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-shadow: 0 0 20px rgba(236, 175, 68, 0.2);
}

.subtitle {
  color: var(--color-light);
  margin: 0 0 2rem 0;
  font-size: 1.15rem;
  max-width: 650px;
  line-height: 1.5;
}

.discord-button {
  background-color: var(--color-accent);
  color: var(--color-primary);
  text-decoration: none;
  padding: 0.8rem 2.25rem;
  font-weight: bold;
  border-radius: 4px;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.85rem;
}

.discord-button:hover {
  transform: translateY(-2px);
  background-color: var(--color-light);
  box-shadow: 0 4px 15px rgba(236, 175, 68, 0.3);
}

.rules-section {
  margin-bottom: 4rem;
}

.section-title {
  color: var(--color-heading);
  font-size: 1.5rem;
  border-left: 4px solid var(--color-accent);
  padding-left: 0.85rem;
  margin-bottom: 1.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style>