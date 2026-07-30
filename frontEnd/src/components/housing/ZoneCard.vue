<script setup lang="ts">
import type { HousingZone } from "@/components/housing/zones";
import { ArrowRight } from "lucide-vue-next";
import { RouterLink } from "vue-router";

defineProps<{
  zone: HousingZone;
}>();
</script>

<template>
  <RouterLink
    :to="`/housing/${zone.id}`"
    class="zone-card"
  >
    <div class="zone-content">

      <h3>{{ zone.name }}</h3>

      <p>
        {{ zone.description }}
      </p>

      <div class="zone-footer">

        <span class="price">
          {{ zone.price }}
        </span>

        <ArrowRight
          :size="18"
          class="arrow"
        />

      </div>

    </div>

  </RouterLink>
</template>

<style scoped>

.zone-card{

    display:flex;
    flex-direction:column;

    min-height:230px;

    text-decoration:none;

    border-radius:20px;

    background:linear-gradient(
        180deg,
        rgba(26,34,48,.96),
        rgba(17,23,34,.98)
    );

    border:1px solid rgba(255,255,255,.06);

    transition:
        transform .25s ease,
        border-color .25s ease,
        box-shadow .25s ease;

    overflow:hidden;

}

.zone-card:hover{

    transform:translateY(-6px);

    border-color:var(--color-secondary);

    box-shadow:
        0 18px 35px rgba(0,0,0,.35);

}

.zone-content{

    display:flex;
    flex-direction:column;

    flex:1;

    padding:2rem;

}

.zone-content h3{

    margin:0 0 1rem;

    color:var(--color-light);

    font-size:1.45rem;

    font-weight:700;

}

.zone-content p{

    flex:1;

    margin:0;

    color:rgba(255,255,255,.68);

    line-height:1.7;

}

.zone-footer{

    display:flex;

    justify-content:space-between;

    align-items:center;

    margin-top:2rem;

}

.price{

    color:var(--color-secondary);

    font-weight:700;

    font-size:1.1rem;

}

.arrow{

    color:var(--color-secondary);

    transition:transform .25s ease;

}

.zone-card:hover .arrow{

    transform:translateX(5px);

}

@media (max-width:768px){

    .zone-card{

        min-height:200px;

    }

    .zone-content{

        padding:1.5rem;

    }

    .zone-content h3{

        font-size:1.3rem;

    }

}

</style>