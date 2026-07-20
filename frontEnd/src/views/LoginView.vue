<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const password = ref('');
const errorMessage = ref(false);
const router = useRouter();
const { login } = useAuth();

const handleLogin = async () => {
  const success = await login(password.value);
  if (success) {
    router.push('/'); 
  } else {
    errorMessage.value = true;
    password.value = '';
  }
};
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="login-title">Acceso Restringido</h2>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <input 
          type="password" 
          v-model="password" 
          placeholder="Código de acceso..." 
          class="login-input"
        />
        
        <p v-if="errorMessage" class="error-text">Acceso denegado. Código incorrecto.</p>
        
        <button type="submit" class="login-btn">Ingresar al Modo Diseñador</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-container { min-height: 100vh; display: flex; align-items: center; justify-content: center; background-color: #060f16; }
.login-card { background: #0d1721; padding: 40px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); width: 100%; max-width: 400px; text-align: center; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
.login-title { color: #ecaf44; font-size: 1.5rem; margin-bottom: 25px; text-transform: uppercase; letter-spacing: 1px; }
.login-form { display: flex; flex-direction: column; gap: 15px; }
.login-input { padding: 12px; background: #060f16; border: 1px solid rgba(255,255,255,0.1); color: white; border-radius: 4px; font-size: 1rem; text-align: center; }
.login-input:focus { border-color: #ecaf44; outline: none; }
.login-btn { padding: 12px; background: #ecaf44; color: #060f16; font-weight: bold; border: none; border-radius: 4px; cursor: pointer; transition: 0.2s; }
.login-btn:hover { background: #d69d3a; }
.error-text { color: #e74c3c; font-size: 0.85rem; margin: 0; }
</style>