<!-- src/components/rules/RulesPage.vue -->
<template>
  <main
    class="rules-page"
    :style="{ '--server-color': serverData.color }"
  >

    <HeroBanner

    :banner-image="serverData.bannerImage"

    :banner-label="serverData.subtitle"

    title="NORMATIVA"

    :subtitle="serverData.title"

    :description="serverData.description"

/>

<RoleSelector
    :available-roles="roles"
    :current-role-id="serverData.id"
/>

    <StatusBar
    :version="serverData.version"
    :lastUpdate="serverData.lastUpdate"
    :totalRules="totalRules"
/>


    <div class="rules-content">

  <!-- SIDEBAR -->
  <CategorySidebar

      :sections="serverData.sections"

      :selected-index="selectedSection"

      @select="selectedSection = $event"

  />


  <!-- CONTENIDO -->

  <section
    v-if="currentSection"
    class="rules-section"
  >

      <div class="section-header">

        <div>

          <h2 class="section-title">
            {{ currentSection.title }}
          </h2>

          <p class="section-description">
            Consulta todas las reglas pertenecientes a esta categoría.
          </p>

        </div>

      </div>

      <div class="rules-list">

          <RuleCard

              v-for="(rule,rIndex) in currentSection.rules"

              :key="rIndex"

              :index="String(rIndex+1).padStart(2,'0')"

              :title="rule.title"

              :description="rule.description"

              :example="rule.example"

              :serverColor="serverData.color"

          />

      </div>

  </section>

</div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { RPServer } from "@/types/serverTypes";
import RuleCard from "./RuleCard.vue";
import StatusBar from "./StatusBar.vue";
import HeroBanner from "./HeroBanner.vue";
import CategorySidebar from "./CategorySidebar.vue";
import RoleSelector from "./RoleSelector.vue";
import { useServerService } from "@/services/serverService";

const props = defineProps<{
  serverData: RPServer;
}>();

const selectedSection = ref(0);

const currentSection = computed(() =>
    props.serverData.sections[selectedSection.value] ?? null
);

const totalRules = computed(() =>
    props.serverData.sections.reduce(
        (total, section) => total + section.rules.length,
        0
    )
);

const serverService = useServerService();

const roles = serverService.getAllServers();

const selectedRole = ref(props.serverData.id);

</script>

<style scoped>

.rules-page {
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
  padding: 4rem 2rem;

  background:
    radial-gradient(
      circle at top left,
      rgba(45, 92, 180, 0.18),
      transparent 35%
    ),
    radial-gradient(
      circle at bottom right,
      rgba(236, 175, 68, 0.15),
      transparent 40%
    ),
    linear-gradient(
      180deg,
      #08111c 0%,
      #0b1624 45%,
      #08111c 100%
    );
}

/* ------------------------------
   Fondo decorativo
------------------------------- */

.rules-page::before {
  content: "";

  position: absolute;
  inset: 0;

  background-image:
    radial-gradient(rgba(255,255,255,.035) 1px, transparent 1px);

  background-size: 28px 28px;

  opacity: .35;

  pointer-events: none;
}


/* ------------------------------
   Contenido
------------------------------- */

.rules-content{

    display:grid;

    grid-template-columns:280px 1fr;

    gap:36px;

    align-items:start;

    max-width:1400px;

    margin:auto;
}

@media(max-width:900px){

.rules-content{

grid-template-columns:1fr;

}

}

.rules-section{

  padding:2rem;

  margin-bottom:2.5rem;

  border-radius:24px;

  background:
      rgba(255,255,255,.035);

  backdrop-filter:blur(12px);

  border:1px solid rgba(255,255,255,.08);

  box-shadow:
      0 18px 40px rgba(0,0,0,.25);

  animation:fadeUp .7s ease both;
}

.section-title{

    margin:0;

    font-size:2.2rem;

    color:var(--color-secondary);

    font-weight:800;
}

.section-description{

    margin-top:12px;
    font-family:"Exo 2", monospace;
    color:rgba(255,255,255,.55);

    max-width:600px;

    line-height:1.8;
}




.section-title::before{

  content:"";

  width:8px;

  height:38px;

  border-radius:999px;

  background:
      linear-gradient(
          var(--server-color),
          var(--color-accent)
      );

  box-shadow:
      0 0 12px var(--server-color);
}

.rules-list{

  display:flex;

  flex-direction:column;

  gap:1.25rem;
}

/* ------------------------------
   Animación
------------------------------- */

@keyframes fadeUp{

  from{

      opacity:0;

      transform:translateY(30px);

  }

  to{

      opacity:1;

      transform:none;

  }

}


/* ------------------------------
   Responsive
------------------------------- */
@media (max-width:768px){

  .rules-page{
    padding:1.25rem;
  }

  /* ==========================
      Layout principal

  ========================== */

  .rules-content{

    display:flex;

    flex-direction:column;

    gap:1.5rem;
  }

  /* ==========================
      Contenido
  ========================== */

  .rules-section{

    padding:1.5rem;

    border-radius:20px;

    margin-bottom:0;
  }

  .section-title{

    font-size:1.9rem;

    margin-bottom:.5rem;
  }

  .section-description{

    font-size:.95rem;
  }

  .rules-list{

    margin-top:1.25rem;

    gap:1rem;
}

}

</style>
