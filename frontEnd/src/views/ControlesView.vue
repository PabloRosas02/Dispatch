<script setup lang="ts">
import CategoryCard from "@/components/controls/CategoryCard.vue";
import HeroBanner from "@/components/rules/HeroBanner.vue";

const hero = {
  label: "KINSFOLK ROLEPLAY",
  title: "CONTROLES",
  description:
    "Aprende todos los controles esenciales para desenvolverte correctamente dentro del servidor.",
  bannerImage: "controls.webp",
};

const categories = [
  {
    title: "Movimiento",
    description: "Acciones básicas del personaje.",
    icon: "Footprints",
    controls: [
      {
        title: "Caminar",
        description: "Mover al personaje.",
        icon: "Footprints",
        key: "W A S D",
      },
      {
        title: "Correr",
        description: "Sprint.",
        icon: "PersonStanding",
        key: "SHIFT",
      },
      {
        title: "Saltar",
        description: "Realizar un salto.",
        icon: "ArrowUp",
        key: "SPACE",
      },
      {
        title: "Agacharse",
        description: "Ponerse en cuclillas.",
        icon: "ChevronDown",
        key: "CTRL",
      },
    ],
  },

  {
    title: "Vehículos",
    description: "Controles relacionados con vehículos.",
    icon: "Car",
    controls: [
      {
        title: "Entrar / Salir",
        description: "Acceder o abandonar un vehículo.",
        icon: "DoorOpen",
        key: "F",
      },
      {
        title: "Motor",
        description: "Encender o apagar el motor.",
        icon: "Power",
        key: "Y",
      },
      {
        title: "Bloquear",
        description: "Cerrar o abrir el vehículo.",
        icon: "Lock",
        key: "U",
      },
      {
        title: "Cinturón",
        description: "Abrochar o quitar el cinturón.",
        icon: "Shield",
        key: "B",
      },
    ],
  },

  {
    title: "Comunicación",
    description: "Funciones relacionadas con la comunicación.",
    icon: "MessagesSquare",
    controls: [
      {
        title: "Push To Talk",
        description: "Hablar por proximidad.",
        icon: "Mic",
        key: "N",
      },
      {
        title: "Rango de Voz",
        description: "Cambiar la distancia de voz.",
        icon: "Volume2",
        key: "Z",
      },
      {
        title: "Teléfono",
        description: "Abrir el teléfono.",
        icon: "Smartphone",
        key: "F1",
      },
    ],
  },

  {
    title: "Interfaz",
    description: "Menús principales del servidor.",
    icon: "Monitor",
    controls: [
      {
        title: "Inventario",
        description: "Abrir el inventario.",
        icon: "Backpack",
        key: "TAB",
      },
      {
        title: "Animaciones",
        description: "Abrir el menú de animaciones.",
        icon: "Smile",
        key: "F3",
      },
      {
        title: "Menú Radial",
        description: "Abrir el menú radial.",
        icon: "CircleDot",
        key: "F6",
      },
    ],
  },
];
</script>

<template>
    
  <main class="controls-page">
    <HeroBanner
      :bannerImage="hero.bannerImage"
      :bannerLabel="hero.label"
      :title="hero.title"
      :description="hero.description"
    />
    <section class="controls-categories">
      <CategoryCard
        v-for="category in categories"
        :key="category.title"
        :category="category"
      />
    </section>
  </main>
</template>

<style scoped>
.controls-page {
  width: min(1400px, 90%);
  margin: 0 auto;
  padding: 4rem 0 6rem;
  font-family: "exo-2", sans-serif;
}

.controls-categories {
  display: grid;
  gap: 2rem;
}
</style>