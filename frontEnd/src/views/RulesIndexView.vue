<template>
  <main class="rules-index">

    <!-- Hero -->
    <section class="hero">

      <div class="hero-overlay"></div>

      <div class="hero-content">

        <span class="hero-label">
          KINSFOLK ROLEPLAY
        </span>

        <h1>
          NORMATIVAS
        </h1>

        <p>
          Consulta las reglas generales del servidor y las normativas
          específicas de cada departamento. Conocerlas es indispensable
          para mantener una experiencia de Roleplay seria, inmersiva y justa.
        </p>

      </div>

    </section>

    <!-- General -->

    <section class="general-card">
      <div class="general-info">

        <span>REGLA PRINCIPAL</span>

        <h2>Normativa General</h2>

        <p>
          Todos los jugadores deben conocer y respetar esta normativa antes
          de participar en cualquier actividad dentro del servidor.
        </p>

      </div>

      <RouterLink
        to="/normativas/general"
        class="general-button"
      >
        Leer normativa
      </RouterLink>

    </section>

    <!-- Departamentos -->

    <section class="departments">

      <h2 class="section-title">
        Normativas por Departamento
      </h2>

      <div class="rules-grid">

        <RouterLink
            v-for="server in servers"
            :key="server.basic.id"
            class="rule-card"
            :to="`/normativas/${server.basic.id}`"
            :style="{
            '--server-color': server.addit.color,
            backgroundImage: `
                linear-gradient(
                rgba(5,12,20,.10),
                rgba(5,12,20,.88)
                ),
                url('/images/${server.banner.bannerImage}')
            `
            }"
        >

            <div class="card-content">

            <span class="card-label">
                Explora {{ server.basic.title }}
            </span>

            <h3>
                {{ server.basic.title }}
            </h3>

            <p>
                {{ server.addit.description }}
            </p>

            </div>

        </RouterLink>

        </div>

    </section>

  </main>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useServerService } from "@/services/serverService";

const serverService = useServerService();

const servers = computed(() =>
  serverService
    .getAllServers()
    .value
    .filter(server => server.basic.id !== "general")
);
</script>

<style scoped>

.rules-index{
    font-family:"Exo 2",sans-serif;
    min-height:100vh;

    padding:4rem 2rem 6rem;

    background:
        radial-gradient(circle at top left,
            rgba(45,92,180,.18),
            transparent 35%),
        radial-gradient(circle at bottom right,
            rgba(236,175,68,.14),
            transparent 45%),
        linear-gradient(
            180deg,
            #08111c,
            #0b1624,
            #08111c);
}

/* HERO */

.hero{

    position:relative;

    max-width:1400px;

    height:420px;

    margin:auto;

    overflow:hidden;

    border-radius:28px;

    background:
        url("/images/general.webp")
        center/cover;
}

.hero-overlay{

    position:absolute;

    inset:0;

    background:
        linear-gradient(
            90deg,
            rgba(5,12,20,.92),
            rgba(5,12,20,.55),
            rgba(5,12,20,.20)
        );
}

.hero-content{

    position:relative;

    z-index:2;

    width:min(650px,100%);

    padding:70px;
}

.hero-label{

    color:var(--color-accent);

    letter-spacing:.35rem;

    font-size:.85rem;
}

.hero h1{

    margin:18px 0;

    color:white;

    font-size:4.5rem;

    line-height:.9;

    font-weight:900;
}

.hero p{

    color:rgba(255,255,255,.75);

    line-height:1.9;

    font-size:1.05rem;
}

/* GENERAL */
.general-card{

    position:relative;

    display:flex;

    justify-content:space-between;

    align-items:center;

    gap:48px;

    padding:42px;

    margin:50px auto;

    max-width:1400px;

    min-height:240px;

    border-radius:26px;

    overflow:hidden;

    background:
        linear-gradient(
            90deg,
            rgba(5,12,20,.92) 0%,
            rgba(5,12,20,.78) 35%,
            rgba(5,12,20,.35) 70%,
            rgba(5,12,20,.05) 100%
        ),
        url("/images/rules.webp")
        center/cover no-repeat;

    border:1px solid rgba(255,255,255,.08);
}


.general-info{

    position:relative;

    z-index:2;

    max-width:700px;
}

.general-info span{

    color:var(--color-accent);

    letter-spacing:.25rem;

    font-size:.8rem;

    text-transform:uppercase;
}

.general-info h2{

    margin:14px 0;

    color:white;

    font-size:2.6rem;

    font-weight:800;
}

.general-info p{

    color:rgba(255,255,255,.82);

    line-height:1.9;
}

.general-button{

    position:relative;

    z-index:2;

    flex-shrink:0;

    padding:18px 38px;

    border-radius:999px;

    background:
        linear-gradient(
            135deg,
            var(--color-accent),
            #d89319
        );

    color:#111;

    font-weight:700;

    text-decoration:none;

    transition:
        transform .3s ease,
        box-shadow .3s ease;
}

.general-button:hover{

    transform:translateY(-4px);

    box-shadow:
        0 12px 30px rgba(236,175,68,.35);
}

/* GRID */

.departments{

    max-width:1400px;

    margin:auto;
}

.section-title{

    margin-bottom:30px;

    color:white;

    font-size:2rem;
}
.rules-grid{

    display:grid;

    grid-template-columns:repeat(auto-fit,minmax(340px,1fr));

    gap:24px;
}

.rule-card{

    position:relative;

    overflow:hidden;

    min-height:270px;

    border-radius:24px;

    background-position:center;

    background-size:cover;

    background-repeat:no-repeat;

    border:1px solid rgba(255,255,255,.08);

    text-decoration:none;

    transition:
        transform .35s ease,
        border-color .35s ease,
        box-shadow .35s ease;
}

.rule-card::before{

    content:"";

    position:absolute;

    inset:0;

    background:
        linear-gradient(
            180deg,
            rgba(0,0,0,.02) 0%,
            rgba(4,10,20,.25) 40%,
            rgba(4,10,20,.92) 100%
        );

    transition:.35s ease;
}

.rule-card::after{

    content:"";

    position:absolute;

    inset:0;

    border-radius:24px;

    border:1px solid transparent;

    transition:.35s ease;
}

.rule-card:hover{

    transform:
        translateY(-8px)
        scale(1.015);

    box-shadow:
        0 18px 40px rgba(0,0,0,.45);
}

.rule-card:hover::before{

    background:
        linear-gradient(
            180deg,
            rgba(0,0,0,0),
            rgba(5,12,20,.18),
            rgba(5,12,20,.82)
        );
}

.rule-card:hover::after{

    border-color:var(--server-color);

    box-shadow:
        inset 0 0 0 1px var(--server-color),
        0 0 22px color-mix(in srgb, var(--server-color) 40%, transparent);
}

.card-content{

    position:absolute;

    left:30px;

    right:30px;

    bottom:28px;

    z-index:2;
}

.card-label{

    display:inline-block;

    margin-bottom:12px;

    padding:6px 12px;

    border-radius:999px;

    background:rgba(255,255,255,.08);

    backdrop-filter:blur(8px);

    color:var(--color-accent);

    font-size:.72rem;

    font-weight:700;

    letter-spacing:.18rem;

    text-transform:uppercase;
}

.card-content h3{

    margin:0 0 10px;

    color:white;

    font-size:2rem;

    font-weight:800;

    line-height:1;
}

.card-content p{

    margin:0;

    color:rgba(255,255,255,.78);

    line-height:1.7;

    display:-webkit-box;

    -webkit-line-clamp:3;

    -webkit-box-orient:vertical;

    overflow:hidden;
}
/* Responsive */

@media(max-width:900px){

.hero{

    position:relative;

    overflow:hidden;

    height:430px;

    background:
        url("/images/General.webp")
        center/cover;

    border-radius:30px;
}

.hero-content{

    padding:40px 30px;
}

.hero h1{

    font-size:3rem;
}

.general-card{

    flex-direction:column;

    align-items:flex-start;
}

.general-button{

    width:100%;

    text-align:center;
}

.rules-grid{

    grid-template-columns:1fr;
}

}

</style>