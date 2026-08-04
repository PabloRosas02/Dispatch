<script setup lang="ts">

import type { Component } from "vue";
import type { RuleSection } from "@/types/serverTypes";

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

defineProps<{

    sections: RuleSection[];

    selectedIndex:number;

}>();

defineEmits<{

    (e:"select", index:number):void;

}>();

const categoryIcons:Record<string, Component> = {

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

</script>

<template>

  <aside class="rules-sidebar">

    <h3 class="sidebar-title">

      <span class="section-badge">

        {{ sections.length }}

      </span>

      Categorías

    </h3>

    <button
      v-for="(section,index) in sections"
      :key="section.title"
      class="sidebar-item"
      :class="{ active:index===selectedIndex }"
      @click="$emit('select', index)"
    >

      <div class="sidebar-info">

        <component
          :is="categoryIcons[section.title]"
          class="sidebar-icon"
        />

        <span class="sidebar-name">

          {{ section.title }}

        </span>

      </div>

    </button>

  </aside>

</template>

<style scoped>

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


@media(max-width:900px){

.rules-sidebar{

    display:none;

}


.rules-sidebar{

position:relative;

top:0;

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

}



/* ------------------------------
   Responsive
------------------------------- */
@media (max-width:768px){

  .rules-page{
    padding:1.25rem;
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
}

}


</style>
