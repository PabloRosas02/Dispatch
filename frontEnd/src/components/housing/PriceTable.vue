<script setup lang="ts">
import { housingPrices } from "@/components/housing/prices";

const formatter = new Intl.NumberFormat("en-US");
</script>

<template>
  <section class="price-card">

    <div class="price-header">

      <h3>Property Prices</h3>

      <span>Approximate values</span>

    </div>

    <div class="price-list">

      <div
        v-for="price in housingPrices"
        :key="price.zone"
        class="price-row"
      >

        <span class="zone-name">
          {{ price.zone }}
        </span>

        <span class="zone-price">
          ${{ formatter.format(price.min) }}
          -
          ${{ formatter.format(price.max) }}
        </span>

      </div>

    </div>

  </section>
</template>

<style scoped>

.price-card{

    background:linear-gradient(
        180deg,
        rgba(26,34,48,.96),
        rgba(17,23,34,.98)
    );

    border:1px solid rgba(255,255,255,.05);

    border-radius:18px;

    overflow:hidden;

}

.price-header{

    padding:1.25rem 1.5rem;

    border-bottom:1px solid rgba(255,255,255,.06);

}

.price-header h3{

    color:var(--color-light);

    margin:0;

}

.price-header span{

    color:rgba(255,255,255,.6);

    font-size:.9rem;

}

.price-list{

    display:flex;

    flex-direction:column;

}

.price-row{

    display:flex;

    justify-content:space-between;

    align-items:center;

    padding:1rem 1.5rem;

    transition:.25s;

}

.price-row:not(:last-child){

    border-bottom:1px solid rgba(255,255,255,.05);

}

.price-row:hover{

    background:rgba(255,255,255,.03);

}

.zone-name{

    color:var(--color-light);

    font-weight:600;

}

.zone-price{

    color:var(--color-secondary);

    font-weight:700;

}

</style>