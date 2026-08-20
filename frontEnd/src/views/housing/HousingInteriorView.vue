<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { interiors } from "@/components/housing/interiors";

const route = useRoute();

const interior = computed(() =>
  interiors.find(
    (i) =>
      i.zone === route.params.zoneId &&
      i.id === route.params.interiorId
  )
);

// Imagen seleccionada
const currentImage = ref(0);

const selectedImage = computed(() => {
  if (!interior.value) return "";

  return `/images/housing/interiors/${interior.value.images[currentImage.value]}`;
});

const selectImage = (index: number) => {
  currentImage.value = index;
};

</script>
<template>
  <section v-if="interior" class="interior-page">

    <RouterLink
      class="back-btn"
      :to="{ name: 'housing-zone', params: { zoneId: interior.zone } }"
    >
      ← Volver
    </RouterLink>

    <div class="hero">

      <div class="hero-content">
        <span class="eyebrow">Housing</span>

        <h1>{{ interior.name }}</h1>

        <p>
          Descubre este interior y conoce todas sus características antes de
          adquirir tu próxima propiedad.
        </p>
      </div>

      <div class="gallery">

        <img
            class="hero-image"
            :src="selectedImage"
            :alt="interior.name"
        />

        <div class="thumbnails">

            <button
            v-for="(image, index) in interior.images"
            :key="image"
            class="thumbnail"
            :class="{ active: currentImage === index }"
            @click="selectImage(index)"
            >
            <img
                :src="`/images/housing/interiors/${image}`"
                :alt="`${interior.name} ${index + 1}`"
            />
            </button>

        </div>

        </div>

    </div>

    <div class="content">

      <div class="card">

        <h2>Información</h2>

        <div class="stats">

          <div>
            <span>Precio</span>
            <strong>${{ interior.price.toLocaleString() }}</strong>
          </div>

          <div>
            <span>Habitaciones</span>
            <strong>{{ interior.bedrooms }}</strong>
          </div>

          <div>
            <span>Baños</span>
            <strong>{{ interior.bathrooms }}</strong>
          </div>

          <div>
            <span>Garage</span>
            <strong>
              {{ interior.garage ? "Sí" : "No" }}
            </strong>
          </div>

        </div>

      </div>

      <div class="card">

        <h2>Descripción</h2>

        <p>
          Este interior está disponible dentro de la zona
          <strong>{{ interior.zone }}</strong>. Cuenta con un diseño cómodo y
          funcional, ideal para comenzar o ampliar tu patrimonio dentro de
          Dispatch Roleplay.
        </p>

      </div>

      <div class="card">

        <h2>Características</h2>

        <ul class="features">

          <li>✔ {{ interior.bedrooms }} Habitación<span v-if="interior.bedrooms > 1">es</span></li>

          <li>✔ {{ interior.bathrooms }} Baño<span v-if="interior.bathrooms > 1">s</span></li>

          <li v-if="interior.garage">
            ✔ Garage incluido
          </li>

          <li v-else>
            ✖ Sin garage
          </li>

        </ul>

      </div>

    </div>

  </section>

  <section v-else class="interior-page">

    <h2>Interior no encontrado</h2>

    <p>
      El interior que intentas visualizar no existe o fue eliminado.
    </p>

    <RouterLink
      class="back-btn"
      :to="{ name: 'housing-home' }"
    >
      Volver a Housing
    </RouterLink>

  </section>
</template>

<style scoped>
.interior-page{
    max-width:1200px;
    margin:0 auto;
    padding:4rem 1.5rem;
    font-family:"Exo 2",sans-serif;
}

.back-btn{
    display:inline-flex;
    align-items:center;
    gap:.5rem;

    margin-bottom:2rem;

    color:var(--color-secondary);
    text-decoration:none;
    font-weight:600;

    transition:color .25s ease;
}

.back-btn:hover{
    color:var(--color-light);
}

.hero{
    display:grid;
    grid-template-columns:1fr 420px;
    gap:2rem;
    align-items:center;

    margin-bottom:2rem;
}

.hero-content{
    display:flex;
    flex-direction:column;
    justify-content:center;
}

.eyebrow{
    color:var(--color-secondary);
    text-transform:uppercase;
    letter-spacing:.15em;
    font-size:.8rem;
    font-weight:700;
    margin-bottom:.75rem;
}

.hero h1{
    color:var(--color-light);
    font-size:3rem;
    font-weight:700;
    margin:0 0 1rem;
}

.hero p{
    color:rgba(255,255,255,.7);
    line-height:1.8;
    max-width:650px;
}

.hero-image{
    width:100%;
    aspect-ratio:16/10;

    object-fit:cover;

    border-radius:18px;

    border:1px solid rgba(255,255,255,.06);

    box-shadow:
        0 18px 40px rgba(0,0,0,.35);
}

.content{
    display:grid;
    gap:1.5rem;
}

.card{
    background:linear-gradient(
        180deg,
        rgba(31,39,54,.95),
        rgba(20,27,38,.98)
    );

    border:1px solid rgba(255,255,255,.06);

    border-radius:18px;

    padding:2rem;

    box-shadow:
        inset 0 1px 0 rgba(255,255,255,.03),
        0 12px 28px rgba(0,0,0,.25);
}

.card h2{
    color:var(--color-light);
    margin:0 0 1.5rem;
    font-size:1.3rem;
}

.card p{
    color:rgba(255,255,255,.75);
    line-height:1.8;
}

.stats{
    display:grid;
    grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
    gap:1.25rem;
}

.stats div{
    padding:1rem;

    border-radius:14px;

    background:rgba(255,255,255,.03);

    border:1px solid rgba(255,255,255,.05);
}

.stats span{
    display:block;

    margin-bottom:.5rem;

    color:rgba(255,255,255,.55);

    font-size:.9rem;
}

.stats strong{
    color:var(--color-light);

    font-size:1.2rem;

    font-weight:700;
}

.features{
    display:grid;

    grid-template-columns:repeat(auto-fit,minmax(220px,1fr));

    gap:1rem;

    list-style:none;

    padding:0;
    margin:0;
}

.features li{
    display:flex;
    align-items:center;

    padding:1rem;

    border-radius:14px;

    background:rgba(255,255,255,.03);

    border:1px solid rgba(255,255,255,.05);

    color:rgba(255,255,255,.85);

    font-weight:500;
}

.gallery{
    display:flex;
    flex-direction:column;
    gap:1rem;
}

.thumbnails{
    display:flex;
    gap:.75rem;
    overflow-x:auto;
    padding-bottom:.25rem;
}

.thumbnail{
    border:none;
    padding:0;
    background:none;
    cursor:pointer;
}

.thumbnail img{
    width:90px;
    height:65px;

    object-fit:cover;

    border-radius:10px;

    border:2px solid transparent;

    transition:.25s;
}

.thumbnail:hover img{
    transform:scale(1.05);
}

.thumbnail.active img{
    border-color:var(--color-secondary);
}

@media (max-width:900px){

    .interior-page{
        padding:3rem 1.25rem;
    }

    .hero{
        grid-template-columns:1fr;
    }

    .hero-image{
        order:-1;
    }

    .hero h1{
        font-size:2.3rem;
    }

    .stats{
        grid-template-columns:1fr 1fr;
    }

}

@media (max-width:600px){

    .stats{
        grid-template-columns:1fr;
    }

    .features{
        grid-template-columns:1fr;
    }

}
</style>
