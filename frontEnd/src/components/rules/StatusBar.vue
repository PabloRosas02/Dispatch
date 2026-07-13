<template>
  <div class="status-bar">

    <div
      v-for="item in stats"
      :key="item.label"
      class="status-item"
    >

      <span class="status-label">
        {{ item.label }}
      </span>

      <span
        class="status-value"
        :class="item.class"
      >
        {{ item.value }}
      </span>

    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  version: string;
  lastUpdate: string;
  totalRules: number;
}>();

const stats = computed(() => [
  {
    label: "STATUS",
    value: "ONLINE",
    class: "online"
  },
  {
    label: "VERSION",
    value: props.version
  },
  {
    label: "RULES",
    value: props.totalRules
  },
  {
    label: "UPDATED",
    value: props.lastUpdate
  }
]);
</script>

<style scoped>

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

    text-shadow:0 0 10px rgba(83,215,105,.35);

}

@media (max-width:768px){

    .status-bar{

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