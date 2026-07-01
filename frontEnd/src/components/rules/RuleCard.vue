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
      <div class="rule-icon">
        <svg
          class="chevron"
          :class="{ open: isOpen }"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
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

<style scoped>
.rule-card {
  background: linear-gradient(
    135deg,
    rgba(99, 166, 218, 0.08),
    rgba(239, 188, 149, 0.05)
  );

  backdrop-filter: blur(12px);

  border: 1px solid var(--color-light);

  border-radius: 16px;

  cursor: pointer;

  overflow: hidden;

  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);

  transition:
    border-color .22s ease,
    background .22s ease,
    box-shadow .22s ease;
}

/* Hover */

.rule-card:hover {
  border-color: var(--card-color);

  background: linear-gradient(
    135deg,
    rgba(99, 166, 218, 0.12),
    rgba(239, 188, 149, 0.08)
  );

  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.25);
}

.rule-card.is-open {
  border-color: var(--card-color);

  background: linear-gradient(
    135deg,
    rgba(99, 166, 218, 0.12),
    rgba(239, 188, 149, 0.08)
  );

  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.3);
}

/* ===================================================== */

.rule-header {
  display: flex;
  align-items: center;
  gap: 1.2rem;

  padding: 1.2rem 1.5rem;
}

.rule-number-wrapper {
  min-width: 50px;
}

.rule-tag {
  font-size: .85rem;
  font-weight: 800;
  font-family: "Exo 2", monospace;

  color: var(--color-secondary);

  background: rgba(99,166,218,.15);

  border: 1px solid rgba(99,166,218,.3);

  border-radius: 999px;

  padding: 4px 10px;

  letter-spacing: .5px;
}

.rule-title {

  flex:1;

  margin:0;

  color:var(--color-light);

  font-size:1rem;

  font-weight:600;

  letter-spacing:.5px;

  text-shadow:0 1px 2px rgba(0,0,0,.2);
}

/* ===================================================== */
/* CHEVRON */
/* ===================================================== */

.rule-icon{

  width:38px;
  height:38px;

  display:flex;
  align-items:center;
  justify-content:center;

  flex-shrink:0;

  border-radius:50%;

  background:rgba(255,255,255,.05);

  color:var(--color-accent);

  transition:
      background .25s ease,
      color .25s ease;
}

.rule-card:hover .rule-icon{

  background:rgba(236,175,68,.12);

}

.rule-card.is-open .rule-icon{

  background:rgba(236,175,68,.18);

  color:var(--card-color);

}

/* SOLO EL SVG GIRA */

.chevron{

  width:18px;
  height:18px;

  display:block;

  transform:rotate(0deg);

  transform-origin:center;

  transition:transform .28s cubic-bezier(.22,1,.36,1);

  will-change:transform;
}

.chevron.open{

  transform:rotate(180deg);

}

/* ===================================================== */

.rule-content {

  padding:0 1.5rem 1.2rem;

  border-top:1px solid rgba(243,233,220,.1);
}

.rule-description {

  color:rgba(243,233,220,.85);
  font-family:"Exo 2", monospace;
  line-height:1.7;

  margin:0 0 1rem;

  font-size:.9rem;
}

.rule-example {

  display:flex;

  flex-wrap:wrap;

  gap:.8rem;

  background:var(--color-primary);

  border-left:3px solid var(--color-complementary);

  border-radius:8px;

  padding:.85rem 1rem;
}

.example-label {

  color:var(--color-secondary);

  font-size:.7rem;
  font-family:"Exo 2", monospace;
  font-weight:800;

  letter-spacing:1.5px;

  text-transform:uppercase;
}

.example-text {

  flex:1;

  color:var(--color-light);

  font-size:.85rem;
  font-family:"Exo 2", monospace;
  font-style:italic;

  opacity:.9;
}

/* ===================================================== */
/* TRANSITION */
/* ===================================================== */

.slide-enter-active,
.slide-leave-active{

  transition:
      opacity .22s ease,
      transform .22s ease;
}

.slide-enter-from,
.slide-leave-to{

  opacity:0;

  transform:translateY(-8px);
}

/* ===================================================== */
/* MOBILE */
/* ===================================================== */

@media (max-width:768px){

  .rule-header{

      padding:1rem;
  }

  .rule-tag{

      font-size:.7rem;

      padding:3px 8px;
  }

  .rule-title{

      font-size:.9rem;
  }

  .rule-content{

      padding:0 1rem 1rem;
  }

  .rule-example{

      flex-direction:column;

      gap:.35rem;
  }

  .example-label{

      font-size:.65rem;
  }

  .example-text{

      font-size:.8rem;
  }

}
</style>
