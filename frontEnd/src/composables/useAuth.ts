import { ref } from 'vue';

// Leemos el localStorage al iniciar para saber si ya hay una sesión activa
const isAuthenticated = ref(localStorage.getItem('admin_session_token') === 'true');

export function useAuth() {
  const login = async (password: string) => {
    // deberías hacer un `fetch` a tu backend para verificar un token JWT.
    if (password === 'Crissair2026') { 
      isAuthenticated.value = true;
      localStorage.setItem('admin_session_token', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    isAuthenticated.value = false;
    localStorage.removeItem('admin_session_token');
  };

  return {
    isAuthenticated,
    login,
    logout
  };
}