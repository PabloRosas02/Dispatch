<template>
  <div class="view-viewport">

     <div v-if="bLoading" class="loading-state">
      <p>Decryption of Server Directives in progress...</p>
    </div>

    <RulesPage
      v-if="activeServerData"
      :serverData="activeServerData"
    />
    <NotFound
      v-else
    />
   
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'; // 1. Import the router hook
import RulesPage from '../components/rules/RulesPage.vue';
import NotFound from '../components/NotFound.vue';
import type * as ServerTypes  from '../types/serverTypes.ts';
import { useServerService } from '../services/serverService';

const route = useRoute();
const activeServerData = ref<ServerTypes.RPServer | undefined>(undefined);
const { getServerById, getServerFromRouteParam } = useServerService();
const bLoading = ref<boolean>(true);
onMounted(async () => {
  // 3. Grab the ID safely from /rules/:serverId
  activeServerData.value = await getServerFromRouteParam(route.params.serverId as string);
  bLoading.value = false;
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
