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

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import RulesPage from '../components/rules/RulesPage.vue';
import NotFound from '../components/NotFound.vue';
import type * as ServerTypes from '../types/serverTypes.ts';
import { useServerService } from '../services/serverService';

const route = useRoute();
const activeServerData = ref<ServerTypes.RPServer | undefined>(undefined);
const { getServerFromRouteParam } = useServerService();
const bLoading = ref<boolean>(true);

onMounted(() => {
  activeServerData.value = getServerFromRouteParam(route.params.serverId as string);
  bLoading.value = false;
});
</script>

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
