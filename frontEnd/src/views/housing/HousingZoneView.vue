<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";

import HeroBanner from "@/components/rules/HeroBanner.vue";
import InteriorGrid from "@/components/housing/InteriorGrid.vue";

import { housingZones } from "@/components/housing/zones";
import { interiors } from "@/components/housing/interiors";

const route = useRoute();

const zone = computed(() =>
  housingZones.find(z => z.id === route.params.zoneId)
);

const zoneInteriors = computed(() =>
  interiors.filter(i => i.zone === route.params.zoneId)
);
</script>
<template>
  <div v-if="zone">

    <main class="zone-page">

         <RouterLink
            class="back-btn"
            :to="{ name: 'housing-home' }"
        >
            ← Volver
      </RouterLink>

      <section class="zone-info">

        <div>

          <h2>{{ zone.name }}</h2>

          <p>
            {{ zone.description }}
          </p>

        </div>

        <div class="price-badge">
          {{ zone.price }}
        </div>

      </section>

      <section class="properties">

        <div class="section-header">

          <h2>Available Properties</h2>

          <span>
            {{ zoneInteriors.length }}
            {{ zoneInteriors.length === 1 ? "Property" : "Properties" }}
          </span>

        </div>

        <InteriorGrid
          :interiors="zoneInteriors"
        />

      </section>

    </main>

  </div>

  <main v-else class="not-found">

    <h1>Zone not found</h1>

    <p>
      The requested housing zone does not exist.
    </p>

  </main>

</template>

<style scoped>

.zone-page{

    max-width:1400px;

    margin:0 auto;

    padding:3rem 1.5rem 4rem;

    font-family:"Exo 2",sans-serif;

}

.zone-info{

    display:flex;

    justify-content:space-between;

    align-items:center;

    gap:2rem;

    margin-bottom:3rem;

}

.zone-info h2{

    color:var(--color-light);

    font-size:2rem;

    margin-bottom:.75rem;

}

.zone-info p{

    color:rgba(255,255,255,.7);

    max-width:700px;

    line-height:1.8;

}

.price-badge{

    padding:1rem 1.75rem;

    border-radius:999px;

    border:1px solid rgba(255,255,255,.08);

    background:rgba(255,255,255,.03);

    color:var(--color-secondary);

    font-weight:700;

    white-space:nowrap;

}

.properties{

    display:flex;

    flex-direction:column;

    gap:2rem;

}

.section-header{

    display:flex;

    justify-content:space-between;

    align-items:center;

}

.section-header h2{

    color:var(--color-light);

    margin:0;

    font-size:1.75rem;

}

.section-header span{

    color:rgba(255,255,255,.6);

}

.not-found{

    min-height:70vh;

    display:flex;

    flex-direction:column;

    justify-content:center;

    align-items:center;

    gap:1rem;

    text-align:center;

    font-family:"Exo 2",sans-serif;

}

.not-found h1{

    color:var(--color-light);

}

.not-found p{

    color:rgba(255,255,255,.65);

}

.back-btn{

    display:inline-flex;
    align-items:center;
    gap:.5rem;

    margin:2rem 0 1.5rem;

    color:var(--color-secondary);

    text-decoration:none;

    font-family:"Exo 2",sans-serif;

    font-weight:600;

    transition:all .25s ease;

}

.back-btn:hover{

    color:var(--color-light);

    transform:translateX(-4px);

}

@media (max-width:900px){

    .zone-page{

        padding:2rem 1.25rem 3rem;

    }

    .zone-info{

        flex-direction:column;

        align-items:flex-start;

    }

    .section-header{

        flex-direction:column;

        align-items:flex-start;

        gap:.5rem;

    }

}
</style>