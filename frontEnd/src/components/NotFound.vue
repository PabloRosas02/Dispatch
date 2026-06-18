<script setup lang="ts">
// Explicit properties defining your fallback texts and customizable route paths
withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    linkUrl?: string;
    linkText?: string;
  }>(),
  {
    title: 'Server not found',
    description: 'El servidor que buscas no se encuentra registrado en nuestro ecosistema.',
    linkUrl: '/',
    linkText: 'Return to Home'
  }
);
</script>

<template>
  <main class="not-found">
    <h1>{{ title }}</h1>
    <p>{{ description }}</p>
    <RouterLink :to="linkUrl" class="error-link">
      {{ linkText }}
    </RouterLink>
  </main>
</template>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /*background-color: #060F16;*/
  color: #f3e9dc;
  gap: 15px;
  text-align: center;
  padding: 1.5rem;
  font-family: "Exo 2", sans-serif;
}

h1 {
  color: #ecaf44;
  margin: 0;
  font-size: 2rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

p {
  color: #f3e9dc;
  margin: 0;
  opacity: 0.85;
  max-width: 500px;
  line-height: 1.5;
}

.error-link {
  color: #63a6da;
  text-decoration: none;
  font-weight: 700;
  transition: color 0.2s ease;
}

.error-link:hover {
  text-decoration: underline;
}
</style>
