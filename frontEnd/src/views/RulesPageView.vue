<template>
  <div class="view-viewport">
    <RulesPage
      v-if="activeServerData"
      :serverData="activeServerData"
    />

    <div v-else class="loading-state">
      <p>Decryption of Server Directives in progress...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'; // 1. Import the router hook
import RulesPage from '../components/rules/RulesPage.vue';
import type * as ServerTypes  from '../types/serverTypes.ts';
import { useServerService } from '../services/serverService';

const route = useRoute();
const activeServerData = ref<ServerTypes.RPServer | undefined>(undefined);
const { getServerById, getServerFromRouteParam } = useServerService();

onMounted(async () => {
  // 3. Grab the ID safely from /rules/:serverId
  activeServerData.value = await getServerFromRouteParam(route.params.serverId);
  console.log(activeServerData);
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
  font-family: monospace;
  font-size: 1.2rem;
}
</style>
