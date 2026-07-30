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
    padding: .5rem;
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

    text-decoration: none;

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

@media (max-width: 768px) {

    .role-selector {

        justify-content: flex-start;

        width: 100%;

        margin: 2rem 0;

        padding: 0 16px 8px;

        overflow-x: auto;
        overflow-y: hidden;

        scrollbar-width: none;
        -webkit-overflow-scrolling: touch;
    }

    .role-selector::-webkit-scrollbar {
        display: none;
    }

    .role-chip {
        flex: 0 0 auto;
    }

    .role-selector::after {
        content: "";
        flex: 0 0 16px;
    }
}

</style>

