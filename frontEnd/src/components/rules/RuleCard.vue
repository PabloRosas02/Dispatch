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
        <span class="rule-tag">{{ index }}</span>
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
  background: linear-gradient(135deg, rgba(99, 166, 218, 0.08), rgba(239, 188, 149, 0.05));
  backdrop-filter: blur(12px);
  border: 1px solid var(--color-light);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

/* Hover sin movimiento, solo cambios visuales sutiles */
.rule-card:hover {
  border-color: var(--card-color);
  background: linear-gradient(135deg, rgba(99, 166, 218, 0.12), rgba(239, 188, 149, 0.08));
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.25);
}

.rule-card.is-open {
  border-color: var(--card-color);
  background: linear-gradient(135deg, rgba(99, 166, 218, 0.12), rgba(239, 188, 149, 0.08));
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.25);
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

.rule-tag {
  font-size: 0.85rem;
  font-weight: 800;
  font-family: 'Exo 2', monospace;
  color: var(--color-secondary);
  background: rgba(99, 166, 218, 0.15);
  padding: 4px 10px;
  border-radius: 20px;
  display: inline-block;
  letter-spacing: 0.5px;
  border: 1px solid rgba(99, 166, 218, 0.3);
}

.rule-title {
  color: var(--color-light);
  margin: 0;
  flex-grow: 1;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.rule-icon {
  color: var(--color-complementary);
  font-size: 1.3rem;
  font-weight: 300;
  transition: all 0.2s ease;
  width: 24px;
  text-align: center;
}

.rule-card.is-open .rule-icon {
  color: var(--card-color);
  transform: rotate(180deg);
}

.rule-content {
  padding: 0 1.5rem 1.2rem 1.5rem;
  border-top: 1px solid rgba(243, 233, 220, 0.1);
}

.rule-description {
  color: rgba(243, 233, 220, 0.85);
  line-height: 1.7;
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
}

/* Example con fondo primary (sólido) */
.rule-example {
  background: var(--color-primary);
  border-left: 3px solid var(--color-complementary);
  padding: 0.8rem 1rem;
  border-radius: 8px;
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.example-label {
  color: var(--color-secondary);
  font-weight: 800;
  font-size: 0.7rem;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  opacity: 0.9;
}

.example-text {
  color: var(--color-light);
  font-style: italic;
  font-size: 0.85rem;
  flex: 1;
  opacity: 0.9;
}

/* Transiciones más rápidas */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.2s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(-8px);
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .rule-header {
    padding: 1rem;
  }

  .rule-tag {
    font-size: 0.7rem;
    padding: 3px 8px;
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

  .example-label {
    font-size: 0.65rem;
  }

  .example-text {
    font-size: 0.8rem;
  }
}
</style>
