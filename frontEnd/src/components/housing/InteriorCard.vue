<script setup lang="ts">
import { RouterLink } from "vue-router";
import {
  BedDouble,
  Bath,
  CarFront,
  ArrowRight
} from "lucide-vue-next";

export interface InteriorCardData {
  id: string;
  zone: string;
  name: string;
  images: string[];
  price: number;
  bedrooms: number;
  bathrooms: number;
  garage: boolean;
}

const props = defineProps<{
  interior: InteriorCardData;
}>();

const formatter = new Intl.NumberFormat("en-US");
</script>

<template>
  <RouterLink
    :to="`/housing/${interior.zone}/${interior.id}`"
    class="interior-card"
  >
    <div
      class="interior-image"
      :style="{
        backgroundImage: `url(/images/housing/interiors/${interior.images[0]})`
      }"
    />

    <div class="interior-content">

      <h3>{{ interior.name }}</h3>

      <div class="stats">

        <div class="stat">
          <BedDouble :size="18"/>
          <span>{{ interior.bedrooms }}</span>
        </div>

        <div class="stat">
          <Bath :size="18"/>
          <span>{{ interior.bathrooms }}</span>
        </div>

        <div class="stat">
          <CarFront :size="18"/>
          <span>{{ interior.garage ? "Yes" : "No" }}</span>
        </div>

      </div>

      <div class="footer">

        <span class="price">
          ${{ formatter.format(interior.price) }}
        </span>

        <div class="details">
          View Details
          <ArrowRight :size="16"/>
        </div>

      </div>

    </div>

  </RouterLink>
</template>

<style scoped>

.interior-card{

  display:flex;
  flex-direction:column;

  text-decoration:none;

  overflow:hidden;

  border-radius:20px;

  border:1px solid rgba(255,255,255,.06);

  background:linear-gradient(
      180deg,
      rgba(26,34,48,.96),
      rgba(17,23,34,.98)
  );

  transition:all .25s ease;

    font-family:"Exo 2",sans-serif;
}

.interior-card:hover{

  transform:translateY(-6px);

  border-color:var(--color-secondary);

  box-shadow:
      0 18px 35px rgba(0,0,0,.35);

}

.interior-image{

  aspect-ratio:16/10;

  background-size:cover;

  background-position:center;

}

.interior-content{

  padding:1.5rem;

}

.interior-content h3{

  margin:0;

  color:var(--color-light);

  font-size:1.15rem;

}

.stats{

  display:flex;

  justify-content:space-between;

  margin:1.25rem 0;

  gap:.75rem;

}

.stat{

  display:flex;

  align-items:center;

  gap:.45rem;

  color:rgba(255,255,255,.7);

  font-size:.95rem;

}

.stat svg{

  color:var(--color-secondary);

}

.footer{

  display:flex;

  justify-content:space-between;

  align-items:center;

  margin-top:.5rem;

}

.price{

  color:var(--color-secondary);

  font-weight:700;

  font-size:1.15rem;

}

.details{

  display:flex;

  align-items:center;

  gap:.35rem;

  color:var(--color-light);

  font-size:.9rem;

  transition:gap .2s;

}

.interior-card:hover .details{

  gap:.65rem;

}

@media (max-width:768px){

  .stats{

    flex-wrap:wrap;

    justify-content:flex-start;

  }

}

</style>