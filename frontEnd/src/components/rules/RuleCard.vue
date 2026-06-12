<!-- src/components/rules/RuleCard.vue -->
<template>
  <div
    class="rule-card"
    :class="{ 'is-open': isOpen }"
    :style="{ '--card-color': serverColor }"
    @click="toggleCard"
  >
    <div class="rule-header">
      <div class="rule-number-wrapper">
        <span class="rule-number">{{ index }}</span>
        <div class="rule-number-line"></div>
      </div>
      <h4 class="rule-title">{{ title }}</h4>
      <span class="rule-icon">{{ isOpen ? '−' : '+' }}</span>
    </div>

    <transition name="slide">
      <div v-if="isOpen" class="rule-content">
        <p class="rule-description">{{ description }}</p>

        <div v-if="example" class="rule-example">
          <span class="example-label">EXAMPLE:</span>
          <span class="example-text">{{ example }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { RuleItem } from '@/types/serverTypes.ts';

defineProps<{
  index: string;
  title: RuleItem['title'];
  description: RuleItem['description'];
  example?: RuleItem['example'];
  serverColor: string;
}>();

const isOpen = ref<boolean>(false);

const toggleCard = () => {
  isOpen.value = !isOpen.value;
};
</script>

<style scoped>
.rule-card {
  background: linear-gradient(135deg, rgba(6, 15, 22, 0.5), rgba(6, 15, 22, 0.3));
  backdrop-filter: blur(8px);
  border: 1px solid rgba(99, 166, 218, 0.12);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.rule-card:hover {
  border-color: rgba(99, 166, 218, 0.3);
  transform: translateX(8px);
  background: linear-gradient(135deg, rgba(6, 15, 22, 0.7), rgba(6, 15, 22, 0.5));
}

.rule-card.is-open {
  border-color: var(--card-color);
  background: linear-gradient(135deg, rgba(6, 15, 22, 0.7), rgba(6, 15, 22, 0.5));
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.rule-header {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  padding: 1.2rem 1.5rem;
}

.rule-number-wrapper {
  position: relative;
  min-width: 50px;
}

.rule-number {
  font-size: 1.1rem;
  font-weight: 800;
  font-family: monospace;
  background: linear-gradient(135deg, var(--card-color), var(--color-accent));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.rule-number-line {
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 25px;
  height: 2px;
  background: linear-gradient(90deg, var(--card-color), var(--color-accent));
  opacity: 0.5;
  border-radius: 1px;
}

.rule-title {
  color: var(--color-heading);
  margin: 0;
  flex-grow: 1;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.rule-icon {
  color: var(--color-text);
  font-size: 1.3rem;
  font-weight: 300;
  transition: all 0.3s ease;
}

.rule-card.is-open .rule-icon {
  color: var(--card-color);
  transform: rotate(180deg);
}

.rule-content {
  padding: 0 1.5rem 1.2rem 1.5rem;
  border-top: 1px solid rgba(99, 166, 218, 0.1);
}

.rule-description {
  color: var(--color-text);
  line-height: 1.7;
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
}

.rule-example {
  background: linear-gradient(135deg, rgba(99, 166, 218, 0.08), rgba(236, 175, 68, 0.05));
  border-left: 3px solid var(--card-color);
  padding: 0.8rem 1rem;
  border-radius: 8px;
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.example-label {
  background: linear-gradient(135deg, var(--card-color), var(--color-accent));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: 800;
  font-size: 0.7rem;
  letter-spacing: 1.5px;
}

.example-text {
  color: var(--color-light);
  font-style: italic;
  font-size: 0.85rem;
  flex: 1;
}

/* Transitions */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .rule-header {
    padding: 1rem;
  }

  .rule-title {
    font-size: 0.85rem;
  }

  .rule-content {
    padding: 0 1rem 1rem 1rem;
  }

  .rule-example {
    flex-direction: column;
    gap: 0.3rem;
  }
}
</style>
