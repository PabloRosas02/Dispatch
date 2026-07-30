<script setup lang="ts">
import ZoneCard from "./ZoneCard.vue";
import { housingZones } from "@/components/housing/zones";
</script>

<template>

<section class="zone-grid">

    <ZoneCard
        v-for="zone in housingZones"
        :key="zone.id"
        :zone="zone"
    />

</section>

</template>

<style scoped>

.zone-grid{

    display:grid;

    grid-template-columns:repeat(auto-fit,minmax(280px,1fr));

    gap:24px;
    

}

</style>