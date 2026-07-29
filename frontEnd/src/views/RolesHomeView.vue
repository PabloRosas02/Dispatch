<script setup lang="ts">
import RoleGrid from "@/components/roles/RoleGrid.vue";
</script>

<template>
  <main class="roles-page">

    <section class="roles-section">

      <div class="container">

        <header class="section-header">

          <h2>
            Elige tu camino
          </h2>

          <h3>
            Conoce cada departamento, sus responsabilidades y encuentra el lugar donde comenzará tu historia dentro de Kinsfolk.
          </h3>

        </header>

        <RoleGrid/>

      </div>

    </section>

  </main>
</template>

<style scoped>

.roles-page{
    display:flex;
    flex-direction:column;
}

.roles-section{
    padding:5rem 0 7rem;
}

.container{
    width:min(1280px,92%);
    margin:auto;
}

.section-header{
    text-align:center;
    max-width:760px;
    margin:0 auto 4rem;
}

.eyebrow{

    color:var(--color-secondary);

    font-size:.85rem;

    font-weight:700;

    letter-spacing:.18rem;

}

h2{

    margin:14px 0;

    color:white;

    font-size:clamp(2.8rem,5vw,4rem);

    font-style:italic;

}

p{

    color:var(--color-text-muted);

    line-height:1.8;

}

</style>