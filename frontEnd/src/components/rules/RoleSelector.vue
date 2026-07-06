<template>

  <div class="role-selector">

    <RouterLink
      v-for="role in availableRoles"
      :key="role.basic.id"
      class="role-chip"
      :class="{ active: role.basic.id === currentRoleId }"
      :style="{ '--role-color': role.addit.color }"
      :to="{
        name: 'rules-detail',
        params: { serverId: role.basic.id }
      }"
    >
      <img
        class="role-icon"
        :src="`/icons/${role.basic.filename}`"
        :alt="role.basic.title"
      />

      <span>{{ role.basic.title }}</span>
    </RouterLink>

  </div>

</template>

<script setup lang="ts">
import type { RPServer } from "@/types/serverTypes";

defineProps<{
  availableRoles: ReadonlyArray<RPServer>;
  currentRoleId: string;
}>();

defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();
</script>

<style scoped>

.role-selector {

    display: flex;

    justify-content: center;

    align-items: center;

    gap: 14px;

    width: fit-content;

    margin: 2rem auto;

    padding: 0.5rem;

}

.role-selector::-webkit-scrollbar{

    display:none;

}

.role-chip{

    display:flex;

    align-items:center;

    gap:12px;

    flex-shrink:0;

    padding:12px 18px;

    border-radius:999px;

    border:1px solid rgba(255,255,255,.08);

    background:rgba(255,255,255,.03);

    backdrop-filter:blur(10px);

    color:white;

    cursor:pointer;

    transition:.25s;

}

.role-chip:hover{

    border-color:var(--role-color);

}

.role-chip.active{

    background:var(--role-color);

    border-color:var(--role-color);

}

.role-icon{

    width:22px;

    height:22px;

    object-fit:contain;

}

.role-chip span{

    font-size:.9rem;

    font-family:"Exo 2", monospace;

    font-weight:600;

}

</style>

