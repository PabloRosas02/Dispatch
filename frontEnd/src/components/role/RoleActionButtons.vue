<script setup lang="ts">
import type { ExtendedRPServer } from '@/composables/useRoleDetail';

defineProps<{
  role: ExtendedRPServer;
  isEditing: boolean;
}>();
</script>

<template>
  <div class="action-buttons-group">
    <button class="explore-button">
      Explora {{ role.basic.title.replace(/<[^>]*>/g, '') }}
    </button>

    <!-- CONFIGURADOR DINÁMICO DE DISCORD EN MODO DISEÑO -->
    <div v-if="isEditing" class="role-discord-editor-container">
      <div class="discord-button mock-disabled">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.14 96.36" fill="currentColor" style="width: 18px; height: 18px; display: inline-block; vertical-align: middle;">
          <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.47,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a74.37,74.37,0,0,0,6.72-10.93,68.6,68.6,0,0,1-10.64-5.12c.91-.67,1.81-1.37,2.65-2.1a75.22,75.22,0,0,0,72.94,0c.84.73,1.74,1.43,2.65,2.1a68.6,68.6,0,0,1-10.64,5.12,74.37,74.37,0,0,0,6.72,10.93,105.73,105.73,0,0,0,31.05-18.83C129.24,50.7,123.4,27.87,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.87,46,53.87,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.11,46,96.11,53,91,65.69,84.69,65.69Z"/>
        </svg>
        <span>Únete al Discord</span>
      </div>
      
      <input 
        type="text" 
        v-model="role.addit.discordLink" 
        class="role-link-field-input" 
        placeholder="Enlace Discord (https://discord.gg/...)"
      />
    </div>

    <!-- BOTÓN PÚBLICO NORMAL -->
    <a v-else-if="role.addit.discordLink" :href="role.addit.discordLink" target="_blank" rel="noopener noreferrer" class="discord-button">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 127.14 96.36" fill="currentColor" style="width: 18px; height: 18px; display: inline-block; vertical-align: middle;">
        <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.47,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a74.37,74.37,0,0,0,6.72-10.93,68.6,68.6,0,0,1-10.64-5.12c.91-.67,1.81-1.37,2.65-2.1a75.22,75.22,0,0,0,72.94,0c.84.73,1.74,1.43,2.65,2.1a68.6,68.6,0,0,1-10.64,5.12,74.37,74.37,0,0,0,6.72,10.93,105.73,105.73,0,0,0,31.05-18.83C129.24,50.7,123.4,27.87,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.87,46,53.87,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.11,46,96.11,53,91,65.69,84.69,65.69Z"/>
      </svg>
      <span>Únete al Discord</span>
    </a>
  </div>
</template>

<style scoped>
.action-buttons-group { 
  display: flex; 
  gap: 16px; 
  align-items: flex-start;
}
.explore-button {
  display: inline-flex; 
  align-items: center; 
  justify-content: center; 
  height: 50px; 
  padding: 0 32px;
  font-size: 0.95rem; 
  font-weight: 800; 
  text-transform: uppercase; 
  border-radius: 4px; 
  background-color: var(--color-accent); 
  color: var(--color-primary); 
  border: none; 
  cursor: pointer;
  flex-shrink: 0;
}
.discord-button {
  display: inline-flex; 
  align-items: center; 
  justify-content: center; 
  gap: 10px; 
  height: 50px; 
  padding: 0 32px;
  font-size: 0.95rem; 
  font-weight: 800; 
  text-transform: uppercase; 
  border-radius: 4px; 
  text-decoration: none; 
  background-color: #5865F2; 
  color: #fff; 
  border: none;
}
.role-discord-editor-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}
.discord-button.mock-disabled {
  cursor: default;
  opacity: 0.9;
}
.discord-button.mock-disabled:hover {
  background-color: #5865F2;
  color: #fff;
}
.role-link-field-input {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #ffffff;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 0.85rem;
  width: 100%;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.2s;
}
.role-link-field-input:focus {
  border-color: var(--color-accent);
}

@media (max-width: 1024px) {
  .action-buttons-group { 
    flex-direction: column; 
    gap: 12px; 
    align-items: center;
  }
  .explore-button, .discord-button { 
    width: 100%; 
    height: 55px; 
  }
}
</style>