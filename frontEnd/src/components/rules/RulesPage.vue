<!-- src/components/rules/RulesPage.vue -->
<template>
  <main
    class="rules-page"
    :style="{ '--server-color': serverData.addit.color }"
  >
    <!-- Fondo con gradiente y efectos (sin cambios en la parte visual) -->
    <div class="bg-animation">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
      <div class="grid-overlay"></div>
    </div>

    <div class="page-header">
      <h1 class="server-title">Normativa {{ serverData.basic.title }}</h1>
      <h2 class="server-subtitle">{{ serverData.basic.subtitle }}</h2>
      <div class="title-decoration">
        <span class="line"></span>
        <span class="dot"></span>
        <span class="line"></span>
      </div>
    </div>

    <div class="status-bar">

    <div class="status-item">

        <span class="status-label">
            STATUS
        </span>

        <span class="status-value online">
            ONLINE
        </span>

    </div>

    <div class="status-item">

        <span class="status-label">
            VERSION
        </span>

        <span class="status-value">
            {{ serverData.ver.version }}
        </span>

    </div>

    <div class="status-item">

        <span class="status-label">
            RULES
        </span>

        <span class="status-value">
            {{ serverData.sections.reduce((a,b)=>a+b.rules.length,0) }}
        </span>

    </div>

    <div class="status-item">

        <span class="status-label">
            UPDATED
        </span>

        <span class="status-value">
            {{ serverData.ver.lastUpdate }}
        </span>

    </div>

</div>


    <div class="rules-content">

  <!-- SIDEBAR -->

  <aside class="rules-sidebar">

    <h3 class="sidebar-title">
      <div class="section-badge">
        {{ serverData.sections.length }}
      </div>
      Categorías
    </h3>

    <button
      v-for="(section,index) in serverData.sections"
      :key="section.title"
      class="sidebar-item"
      :class="{ active:index===selectedSection }"
      @click="selectedSection=index"
    >

    <div class="sidebar-info">

        <component
            :is="categoryIcons[section.title]"
            class="sidebar-icon"
        />

        <div>

            <span class="sidebar-name">

                {{ section.title }}

            </span>

        </div>

    </div>

    </button>

  </aside>


  <!-- CONTENIDO -->

  <section
    v-if="currentSection"
    class="rules-section"
  >

      <div class="section-header">

        <div>

          <h2 class="section-title">
            {{ currentSection.title }}
          </h2>

          <p class="section-description">
            Consulta todas las reglas pertenecientes a esta categoría.
          </p>

        </div>

      </div>

      <div class="rules-list">

          <RuleCard

              v-for="(rule,rIndex) in currentSection.rules"

              :key="rIndex"

              :index="String(rIndex+1).padStart(2,'0')"

              :title="rule.title"

              :description="rule.description"

              :example="rule.example"

              :serverColor="serverData.addit.color"

          />

      </div>

  </section>

</div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import type { RPServer } from "@/types/serverTypes";
import RuleCard from "./RuleCard.vue";
import {
  Shield,
  BrainCircuit,
  Network,
  House,
  Cross,
  Crown,
  BookOpen,
  Skull
} from "lucide-vue-next";

import type { Component } from "vue";

const categoryIcons: Record<string, Component> = {
  "Core Directives": Shield,
  "Augment Etiquette": BrainCircuit,
  "Netrunning": Network,
  "Housing": House,
  "LEO": Shield,
  "SAMS": Cross,
  "Staff": Crown,
  "General RP": BookOpen,
  "Criminal": Skull
};

const props = defineProps<{
  serverData: RPServer;
}>();

const selectedSection = ref(0);

const currentSection = computed(() => {
  return props.serverData.sections[selectedSection.value];
});
</script>

<style scoped>

.rules-page {
  position: relative;
  min-height: 100vh;

  overflow-x: hidden;

  padding: 4rem 2rem;
}

/* ------------------------------
   Fondo decorativo
------------------------------- */

.rules-page::before {
  content: "";

  position: absolute;
  inset: 0;

  background-image:
    radial-gradient(rgba(255,255,255,.035) 1px, transparent 1px);

  background-size: 28px 28px;

  opacity: .35;

  pointer-events: none;
}

/* ------------------------------
   Header
------------------------------- */

.page-header {

  position: relative;
  z-index: 2;

  max-width: 1100px;

  margin: 0 auto 5rem;

  padding: 2.2rem;

  text-align: center;

  background: rgba(255,255,255,.04);

  backdrop-filter: blur(18px);

  border: 1px solid rgba(255,255,255,.08);

  border-radius: 28px;

  box-shadow:
      0 25px 60px rgba(0,0,0,.35);

  overflow: hidden;
}

.page-header::before{

  content:"";

  position:absolute;

  top:0;
  left:0;

  width:100%;
  height:3px;

  background:
      linear-gradient(
          90deg,
          transparent,
          var(--server-color),
          var(--color-accent),
          transparent
      );
}

.server-title {

  font-size: clamp(2.5rem,5vw,4rem);

  color: white;

  font-weight: 900;

  text-transform: uppercase;

  letter-spacing: 2px;

  margin-bottom: .6rem;

  text-shadow:
      0 0 18px rgba(0,0,0,.6);
}

.server-subtitle {

  max-width: 700px;

  margin: 0 auto 2rem;

  color: var(--color-secondary);

  font-size: 1.15rem;

  line-height: 1.8;

  opacity: .9;
}

/* ------------------------------
   Decoración
------------------------------- */

.title-decoration {

  display:flex;

  justify-content:center;

  align-items:center;

  gap:18px;
}

.title-decoration .line{

  flex:1;

  max-width:140px;

  height:2px;

  background:
      linear-gradient(
          90deg,
          transparent,
          var(--server-color),
          var(--color-accent),
          transparent
      );
}

.title-decoration .dot{

  width:14px;

  height:14px;

  border-radius:50%;

  background:
      linear-gradient(
          135deg,
          var(--server-color),
          var(--color-accent)
      );

  box-shadow:
      0 0 10px var(--server-color),
      0 0 30px var(--server-color);
}

/* ------------------------------
   Contenido
------------------------------- */

.rules-content{

    display:grid;

    grid-template-columns:280px 1fr;

    gap:36px;

    align-items:start;

    max-width:1400px;

    margin:auto;
}

.rules-sidebar{

    position:sticky;

    top:24px;

    padding:24px;

    border-radius:24px;

    background:rgba(255,255,255,.03);

    backdrop-filter:blur(18px);

    border:1px solid rgba(255,255,255,.08);

    box-shadow:0 15px 35px rgba(0,0,0,.25);

}

.sidebar-title{

    color:var(--color-accent);

    font-size:1.1rem;

    margin-bottom:20px;

    text-transform:uppercase;

    letter-spacing:2px;
}
.sidebar-item{

    width:100%;

    padding:18px;

    margin-bottom:12px;

    display:flex;

    align-items:center;

    justify-content:space-between;

    background:transparent;

    border:1px solid transparent;

    border-radius:16px;

    cursor:pointer;

    transition:.25s;

    color:white;

    text-align:left;
}

.sidebar-item:hover{

    background:rgba(255,255,255,.04);

    border-color:rgba(236,175,68,.15);

    transform:translateX(5px);

}
.sidebar-item.active{

    background:rgba(236,175,68,.08);

    border-color:rgba(236,175,68,.25);

}
.sidebar-item small{

    color:rgba(255,255,255,.5);
}

.sidebar-info{

    display:flex;

    align-items:center;

    gap:14px;
}

.sidebar-icon{

    width:24px;
    height:24px;

    flex-shrink:0;

    color:var(--color-accent);

    transition:
        color .25s ease,
        transform .25s ease;
}

.sidebar-item:hover .sidebar-icon{

    transform:scale(1.15);

    color:white;
}

.sidebar-name{
    font-family:"Exo 2", monospace;
    font-size:1rem;

    font-weight:600;

    letter-spacing:.5px;
}

.section-header{

    display:flex;

    justify-content:space-between;

    align-items:center;

    margin-bottom:30px;

    padding-bottom:18px;

    border-bottom:1px solid rgba(255,255,255,.08);

}

.section-badge{

    font-family:"Exo 2", monospace;

    display:inline-block;

    margin-bottom:12px;

    padding:6px 14px;

    border-radius:999px;

    background:rgba(236,175,68,.12);

    color:var(--color-accent);

    font-size:.75rem;

    letter-spacing:2px;

    font-weight:700;
}
.section-count{

    color:rgba(255,255,255,.5);

    font-size:.9rem;

    text-transform:uppercase;

    letter-spacing:1px;

}
@media(max-width:900px){

.rules-content{

grid-template-columns:1fr;

}

.rules-sidebar{

position:relative;

top:0;

}

}

/* ------------------------------
   Cada sección
------------------------------- */

.rules-section{

  padding:2rem;

  margin-bottom:2.5rem;

  border-radius:24px;

  background:
      rgba(255,255,255,.035);

  backdrop-filter:blur(12px);

  border:1px solid rgba(255,255,255,.08);

  box-shadow:
      0 18px 40px rgba(0,0,0,.25);

  animation:fadeUp .7s ease both;
}

.section-title{

    margin:0;

    font-size:2.2rem;

    color:var(--color-secondary);

    font-weight:800;
}

.section-description{

    margin-top:12px;
    font-family:"Exo 2", monospace;
    color:rgba(255,255,255,.55);

    max-width:600px;

    line-height:1.8;
}


.rules-counter{

    font-size:3rem;
    font-family: "Exo 2", monospace;
    font-weight:900;

    color:var(--color-accent);

    line-height:1;
}

.section-stats small{

    color:rgba(255,255,255,.45);

    text-transform:uppercase;
    font-family:"Exo 2", monospace;
    letter-spacing:2px;

}

.section-title::before{

  content:"";

  width:8px;

  height:38px;

  border-radius:999px;

  background:
      linear-gradient(
          var(--server-color),
          var(--color-accent)
      );

  box-shadow:
      0 0 12px var(--server-color);
}

.rules-list{

  display:flex;

  flex-direction:column;

  gap:1.25rem;
}

/* ------------------------------
   Animación
------------------------------- */

@keyframes fadeUp{

  from{

      opacity:0;

      transform:translateY(30px);

  }

  to{

      opacity:1;

      transform:none;

  }

}

.status-bar{

    display:flex;

    align-items:center;

    justify-content:space-between;

    max-width:1200px;

    margin:0 auto 40px;

    padding:18px 26px;

    border-radius:18px;

    background:rgba(255,255,255,.035);

    backdrop-filter:blur(18px);

    border:1px solid rgba(255,255,255,.08);

    box-shadow:0 15px 35px rgba(0,0,0,.20);

}

.status-item{

    position:relative;

    flex:1;

    display:flex;

    flex-direction:column;

    align-items:center;

    justify-content:center;

    gap:6px;

    text-align:center;

}

/* Línea divisoria */

.status-item:not(:last-child)::after{

    content:"";

    position:absolute;

    right:0;

    top:50%;

    transform:translateY(-50%);

    width:1px;

    height:42px;

    background:rgba(255,255,255,.08);

}

.status-label{

    font-size:.72rem;
    font-family:"Exo 2", monospace;
    letter-spacing:2px;

    text-transform:uppercase;

    color:rgba(255,255,255,.45);

}

.status-value{

    font-size:1rem;
    font-family:"Exo 2", monospace;
    font-weight:700;

    color:white;
}

.online{

    color:#53d769;

    text-shadow:
        0 0 10px rgba(83,215,105,.35);
}


/* ------------------------------
   Responsive
------------------------------- */
@media (max-width:768px){

  .rules-page{
    padding:1.25rem;
  }

  /* ==========================
      Banner
  ========================== */

  .page-header{

    padding:2rem 1.5rem;

    margin-bottom:1.5rem;

    border-radius:22px;

    min-height:260px;

    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
  }

  .server-title{

    font-size:2.2rem;

    line-height:1.1;

    letter-spacing:1px;

    margin-bottom:.8rem;
  }

  .server-subtitle{

    font-size:1rem;

    text-align:center;

    max-width:260px;

    margin-bottom:1.5rem;
  }

  .title-decoration{

    gap:12px;
  }

  .title-decoration .line{

    max-width:55px;
  }

  .title-decoration .dot{

    width:10px;
    height:10px;
  }

  /* ==========================
      Layout principal
  ========================== */

  .rules-content{

    display:flex;

    flex-direction:column;

    gap:1.5rem;
  }

  /* ==========================
      Sidebar
  ========================== */

  .rules-sidebar{

    position:static;

    width:100%;
  }

  .sidebar-card{

    padding:1.25rem;
  }

  /* Si después conviertes las categorías
     a scroll horizontal esto ya te sirve */

  .sidebar-list{

    display:flex;

    overflow-x:auto;

    gap:.75rem;

    padding-bottom:.25rem;

    scrollbar-width:none;
  }

  .sidebar-list::-webkit-scrollbar{

    display:none;
  }

  .sidebar-item{

    min-width:220px;

    flex-shrink:0;
  }

  /* ==========================
      Contenido
  ========================== */

  .rules-section{

    padding:1.5rem;

    border-radius:20px;

    margin-bottom:0;
  }

  .section-title{

    font-size:1.9rem;

    margin-bottom:.5rem;
  }

  .section-description{

    font-size:.95rem;
  }

  .rules-list{

    margin-top:1.25rem;

    gap:1rem;
  }.status-bar{

        display:grid;

        grid-template-columns:repeat(2,1fr);

        gap:18px;

        padding:18px;

    }

    .status-item{

        padding:12px;

        border-radius:12px;

        background:rgba(255,255,255,.03);
    }

    .status-item::after{

        display:none;

    }

    .status-label{

        font-size:.65rem;

        letter-spacing:1px;
    }

    .status-value{

        font-size:1rem;
    }

}



</style>
