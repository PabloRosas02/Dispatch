<script setup lang="ts">
import type { ExtendedRPServer } from '@/composables/useRoleDetail';

defineProps<{
  role: ExtendedRPServer;
  isEditing: boolean;
}>();
</script>

<template>
  <div class="info-wrapper">
    <h1 v-if="!isEditing" class="role-title" v-html="role.basic.title"></h1>
    <div v-else contenteditable="true" class="role-title editable-container" @blur="role.basic.title = ($event.target as HTMLElement).innerHTML" v-html="role.basic.title"></div>

    <h2 v-if="!isEditing" class="role-subtitle" v-html="role.basic.subtitle"></h2>
    <div v-else contenteditable="true" class="role-subtitle editable-container" @blur="role.basic.subtitle = ($event.target as HTMLElement).innerHTML" v-html="role.basic.subtitle"></div>

    <p v-if="!isEditing" class="role-description" v-html="role.addit.description"></p>
    <div v-else contenteditable="true" class="role-description editable-container" @blur="role.addit.description = ($event.target as HTMLElement).innerHTML" v-html="role.addit.description"></div>
    
    <!-- Renderizamos los botones aquí usando Slots -->
    <slot></slot>
  </div>
</template>

<style scoped>
.info-wrapper { 
  flex-shrink: 0; 
  width: 540px; 
  color: var(--color-light); 
}
.role-title { 
  font-size: 4.2rem; 
  font-weight: 900; 
  line-height: 1; 
  color: var(--color-accent); 
  text-transform: uppercase; 
  margin-bottom: 0;
}
.role-subtitle { 
  font-size: 1.4rem; 
  font-weight: 700; 
  margin: 12px 0 28px 0; 
  color: var(--color-secondary); 
  text-transform: uppercase; 
}
.role-description { 
  font-size: 1.1rem; 
  line-height: 1.75; 
  color: var(--color-light); 
  margin-bottom: 35px; 
}
.editable-container {
  border: 1px dashed var(--color-accent); 
  outline: none; 
  padding: 6px 12px;
  border-radius: 8px; 
  background: rgba(255, 255, 255, 0.02); 
  text-align: left;
}

@media (max-width: 1024px) {
  .info-wrapper { 
    width: 100%; 
    margin-bottom: 20px; 
  }
  .role-title { font-size: 2.8rem; }
  .role-subtitle { font-size: 1.15rem; margin-bottom: 20px; }
  .role-description { font-size: 1rem; margin-bottom: 25px; }
}
</style>