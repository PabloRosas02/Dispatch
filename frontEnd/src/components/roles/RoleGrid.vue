<script setup lang="ts">
import { computed, onMounted } from "vue";

import { useServerService } from "@/services/serverService";

import RoleCard from "./RoleCard.vue";

const service = useServerService();
const servers = computed(() => service.getAllServers().value);

onMounted(async()=>{

    await service.initBasic();

    await service.initRules();

});
</script>

    <template>

        <div class="grid">

            <RoleCard

                v-for="server in servers"

                :key="server.basic.id"

                :server="server"

            />

        </div>

    </template>

<style scoped>

.grid{

    display:grid;

    grid-template-columns:
        repeat(auto-fit,minmax(360px,1fr));

    gap:2rem;

    font-family: "Exo 2", sans-serif;

}

@media(max-width:768px){

    .grid{

    grid-template-columns:1fr;

    }

}

</style>