<template>
  <header
    class="hero-banner"
    :style="bannerStyle"
  >

    <div class="hero-content">

      <span class="hero-label">
        {{ bannerLabel }}
      </span>

      <h1>
        {{ title || "NORMATIVA" }}
      </h1>

      <h2>
        {{ subtitle }}
      </h2>

      <p>
        {{ description }}
      </p>

    </div>

  </header>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{

    bannerImage:string;

    bannerLabel:string;

    title?:string;

    subtitle:string;

    description:string;

}>();
const bannerStyle = computed(() => {
  // 1. Resolvemos la ruta dinámica para que Vite la detecte en el build
  const imageUrl = new URL(`/src/assets/images/${props.bannerImage}`, import.meta.url).href;

  // 2. Retornamos el objeto con la URL ya procesada por Vite
  return {
    backgroundImage: `
        linear-gradient(
            90deg,
            rgba(8,10,18,.88) 0%,
            rgba(8,10,18,.78) 35%,
            rgba(8,10,18,.25) 70%,
            rgba(8,10,18,.05) 100%
        ),
        url(${imageUrl})
    `
  };
});
</script>

<style scoped>

.hero-banner{

    position:relative;

    max-width:1400px;

    height:380px;

    margin:0 auto 40px;

    border-radius:26px;

    overflow:hidden;

    display:flex;

    align-items:center;

    background-size:cover;

    background-position:center;

    box-shadow:
        0 30px 80px rgba(0,0,0,.45);

}

.hero-content{

    width:50%;

    padding:70px;

    font-family:"Exo 2", monospace;

}

.hero-label{

    display:inline-block;

    color:#d6a94f;

    font-size:.8rem;

    letter-spacing:3px;

    text-transform:uppercase;

    margin-bottom:10px;

}

.hero-content h1{

    font-size:4rem;

    font-weight:900;

    color:white;

    line-height:1;

}

.hero-content h2{

    font-size:3rem;

    color:var(--color-accent);

    font-weight:800;

}

.hero-content p{

    width:520px;

    margin-top:20px;

    color:#c7c7c7;

    line-height:1.8;

}

@media(max-width:768px){

.hero-banner{

    height:280px;

    border-radius:20px;

}

.hero-content{

    width:100%;

    padding:32px;

}

.hero-content h1{

    font-size:2.5rem;

}

.hero-content h2{

    font-size:2rem;

}

.hero-content p{

    width:100%;

    max-width:320px;

    font-size:.95rem;

}

}

</style>
