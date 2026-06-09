<!-- src/components/RuleCard.vue -->
<template>
  <div 
    class="rule-card" 
    :class="{ 'is-open': isOpen }" 
    @click="isOpen = !isOpen"
  >
    <div class="rule-header">
      <span class="rule-number">{{ index }}</span>
      <h3 class="rule-title">{{ title }}</h3>
      <span class="rule-icon">{{ isOpen ? '−' : '+' }}</span>
    </div>
    
    <div v-if="isOpen" class="rule-content" @click.stop>
      <p class="rule-description">{{ description }}</p>
      
      <div v-if="example" class="rule-example">
        <strong>Example:</strong> {{ example }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { RuleItem } from '@/types/serverTypes.ts';

// Props mapped smoothly to your updated flat interface keys
defineProps<{
  index: string;
  title: RuleItem['title'];
  description: RuleItem['description'];
  example?: RuleItem['example'];
}>();

const isOpen = ref<boolean>(true);
</script>

<style scoped>
.rule-card {
  background-color: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.25rem;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.rule-card:hover {
  border-color: var(--color-border-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 166, 218, 0.08);
}

.rule-card.is-open {
  border-color: var(--color-heading);
}

.rule-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.rule-number {
  color: var(--color-heading);
  font-weight: bold;
  font-family: monospace;
  font-size: 1.15rem;
}

.rule-title {
  color: var(--color-heading);
  margin: 0;
  flex-grow: 1;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 1.1rem;
}

.rule-icon {
  color: var(--color-text);
  font-weight: bold;
}

.rule-content {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px dashed rgba(239, 188, 149, 0.2);
}

.rule-description {
  color: var(--color-text);
  line-height: 1.6;
  margin: 0 0 0.75rem 0;
}

.rule-example {
  background-color: rgba(6, 15, 22, 0.6);
  border-left: 3px solid var(--color-light);
  padding: 0.75rem;
  color: var(--color-light);
  font-style: italic;
  font-size: 0.9rem;
}
</style>