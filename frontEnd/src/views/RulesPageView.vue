<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import RulesPage from '../components/rules/RulesPage.vue';
import NotFound from '../components/miscellaneous/NotFound.vue';
import type * as ServerTypes from '../types/serverTypes.ts';
import { useServerService } from '../services/serverService';
const {
  getServerFromRouteParam,
  initBasic,
  initRules
} = useServerService();

const route = useRoute();
const activeServerData = computed(() => {
  return getServerFromRouteParam(route.params.serverId as string);
});
const bLoading = ref<boolean>(true);

onMounted(async () => {
  await initBasic();
  initRules();
  bLoading.value = false;
});
</script>

<template>
  <div class="view-viewport">
    <div v-if="bLoading" class="loading-state">
      <p>Decryption of Server Directives in progress...</p>
      <div class="loading-spinner"></div>
    </div>

    <RulesPage
      v-if="!bLoading && activeServerData"
      :serverData="activeServerData"
    />
    <NotFound
      v-else-if="!bLoading && !activeServerData"
    />
  </div>
</template>

<style scoped>
.view-viewport {
  min-height: 100vh;
}

.loading-state {
  text-align: center;
  color: var(--color-text);
  padding-top: 10rem;
}

.loading-state p {
  font-family: monospace;
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
