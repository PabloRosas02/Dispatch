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

const serverId = computed(() => route.params.serverId as string | undefined);
const isGeneral = computed(() => !serverId.value);

const activeServerData = computed(() => {
  return getServerFromRouteParam(route.params.serverId as string);
});

onMounted(async () => {
  await initBasic();
  await initRules();
});
</script>

<template>
  <div class="view-viewport">

    <!-- Página general -->
    <RulesHome
      v-if="isGeneral"
    />

    <!-- Página de un departamento -->
    <RulesPage
      v-else-if="activeServerData"
      :serverData="activeServerData"
    />

    <!-- Departamento inexistente -->
    <NotFound
      v-else
    />

  </div>
</template>

<style scoped>
.view-viewport {
  min-height: 100vh;
}

</style>
