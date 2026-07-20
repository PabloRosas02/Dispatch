import { ref, watch, onUnmounted } from 'vue';
import type * as ServerType from '@/types/serverTypes';

export interface ExtendedRPServer extends Omit<ServerType.RPServer, 'basic'> {
  basic: Omit<ServerType.BasicInfo, 'filename'>;
  filename?: string;
  images?: string[];
}

// Almacén global temporal para evitar peticiones repetitivas entre navegaciones.
const fetchedServers: Record<string, ExtendedRPServer> = {};

export function useRoleDetail(currentServerId: string) {
  const role = ref<ExtendedRPServer | undefined>(undefined);
  const bLoading = ref<boolean>(true);
  const activeLightboxImage = ref<string | null>(null);

  // Manejadores del Lightbox
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') activeLightboxImage.value = null;
  };

  watch(activeLightboxImage, (newValue) => {
    if (newValue) window.addEventListener('keydown', handleKeyDown);
    else window.removeEventListener('keydown', handleKeyDown);
  });

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
  });

  const fetchRoleData = async (forceRefresh = false) => {
    if (!currentServerId) {
      bLoading.value = false;
      return;
    }

    // Caché en memoria RAM
    if (fetchedServers[currentServerId] && !forceRefresh) {
      role.value = fetchedServers[currentServerId];
      bLoading.value = false;
      return;
    }

    const targetCacheKey = `server_page_config_${currentServerId}`;
    bLoading.value = true;

    try {
      // Servidor (Ahora el servidor SIEMPRE enviará el objeto completo)
      const response = await fetch(`/api/cache/${targetCacheKey}`);
      if (!response.ok) throw new Error('Not found in server cache or defaults');

      const result = await response.json();
      const data = result.data ? result.data : result;

      if (data && Object.keys(data).length > 0) {
        // Aseguramos que siempre haya un array de imágenes
        if (!data.images || data.images.length === 0) {
          const defaultImg = data.basic?.filename ? `/icons/${data.basic.filename}` : '';
          data.images = defaultImg ? [defaultImg] : [];
        }

        // Asignación directa, el backend ya hizo el trabajo sucio
        role.value = data as ExtendedRPServer;

        // Respaldo local
        localStorage.setItem(`backup_${targetCacheKey}`, JSON.stringify(role.value));
      } else {
        throw new Error('Empty data');
      }
    } catch (error) {
      console.warn(`[useRoleDetail] Fallo API para ${currentServerId}. Buscando respaldo local...`);

      // Capa 3: Respaldo de localStorage
      const localBackup = localStorage.getItem(`backup_${targetCacheKey}`);

      if (localBackup) {
        console.log(`[useRoleDetail] Respaldo local restaurado con éxito.`);
        role.value = JSON.parse(localBackup);
      }
    } finally {
      if (role.value) fetchedServers[currentServerId] = role.value;
      bLoading.value = false;
    }
  };

  // --- SUBIDA DE IMÁGENES FÍSICAS AL SERVIDOR ---
  const handleAddImage = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0 || !role.value) return;

    const file = input.files[0];
    if (!file) return;

    const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

    if (file.size > MAX_FILE_SIZE_BYTES) {
      alert(`El archivo excede el límite máximo permitido de 10 MB.`);
      return;
    }

    // Preparamos el archivo para enviarlo como form-data
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData // Fetch configura los headers correctamente para archivos
      });

      const result = await response.json();

      // Si fue exitoso, guardamos la URL devuelta en lugar de Base64
      if (result.success && result.data?.url && role.value) {
        if (!role.value.images) role.value.images = [];
        role.value.images.push(result.data.url);

        // Guardamos respaldo local de forma segura con el string cortito de la URL
        const targetCacheKey = `server_page_config_${role.value.basic.id}`;
        localStorage.setItem(`backup_${targetCacheKey}`, JSON.stringify(role.value));
      } else {
        alert(`Error: ${result.errorDetail || 'No se pudo subir la imagen'}`);
      }
    } catch (error) {
      console.error('[useRoleDetail] Error subiendo imagen:', error);
      alert('Error de conexión al subir la imagen.');
    } finally {
      // Limpiamos el input
      input.value = '';
    }
  };

  const removeImageAtIndex = (index: number) => {
    if (!role.value || !role.value.images) return;
    role.value.images.splice(index, 1);

    const targetCacheKey = `server_page_config_${role.value.basic.id}`;
    localStorage.setItem(`backup_${targetCacheKey}`, JSON.stringify(role.value));
  };

  return {
    role,
    bLoading,
    activeLightboxImage,
    fetchRoleData,
    handleAddImage,
    removeImageAtIndex
  };
}