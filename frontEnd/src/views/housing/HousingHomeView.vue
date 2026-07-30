<script setup lang="ts">
import HousingMap from "@/components/housing/HousingMap.vue";
import PriceTable from "@/components/housing/PriceTable.vue";
import ZoneGrid from "@/components/housing/ZoneGrid.vue";
</script>

<template>
  <main class="housing-page">

    <HousingMap />

    <section class="housing-grid">

      <PriceTable />

      <ZoneGrid />

    </section>

  </main>
</template>

<style scoped>
.housing-page {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 24px 64px;
    font-family: "Exo 2", sans-serif;
    margin-top: 64px;
}

.housing-grid {
    display: grid;
    grid-template-columns: 350px 1fr;
    gap: 24px;
    margin-top: 32px;
}

@media (max-width: 992px) {
    .housing-grid {
        grid-template-columns: 1fr;
    }
}
</style>