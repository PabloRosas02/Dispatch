<script setup lang="ts">
import InteriorCard from "./InteriorCard.vue";
import type { InteriorCardData } from "./InteriorCard.vue";

defineProps<{
  interiors: InteriorCardData[];
}>();
</script>

<template>

<section class="interior-grid">

    <InteriorCard
        v-for="interior in interiors"
        :key="interior.id"
        :interior="interior"
    />

</section>

</template>

<style scoped>

.interior-grid{

    display:grid;

    grid-template-columns:repeat(auto-fill,minmax(320px,1fr));

    gap:24px;

}

</style>