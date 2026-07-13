import { ref, watch, onUnmounted } from 'vue';
import type * as ServerType from '@/types/serverTypes';
import { useServerService } from '@/services/serverService';

export interface ExtendedRPServer extends Omit<ServerType.RPServer, 'filename'> {
  filename?: string;
  images?: string[];
}

// Almacén global temporal para evitar peticiones repetitivas entre navegaciones.
const fetchedServers: Record<string, ExtendedRPServer> = {};

export function useRoleDetail(currentServerId: string) {
  const { getServerFromRouteParam, getSvgUrl } = useServerService();

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

  /**
   * Lógica de carga con triple capa de seguridad:
   * 1. Memoria RAM volatil (fetchedServers)
   * 2. Servidor Backend (API Cache / database.json)
   * 3. Disco local del navegador (localStorage Backup)
   */
  const fetchRoleData = async (forceRefresh = false) => {
    const defaultRole = getServerFromRouteParam(currentServerId) as ExtendedRPServer;

    if (!defaultRole) {
      bLoading.value = false;
      return;
    }

    // Capa 1: Si ya tenemos los datos en memoria y no forzamos recarga, usamos la caché local.
    if (fetchedServers[currentServerId] && !forceRefresh) {
      role.value = fetchedServers[currentServerId];
      bLoading.value = false;
      return;
    }

    const targetCacheKey = `server_page_config_${defaultRole.id}`;
    bLoading.value = true;

    try {
      // Capa 2: Intentar traer los datos desde el servidor
      const response = await fetch(`/api/cache/${targetCacheKey}`);
      if (response.status === 404) throw new Error('Not found in cache');

      const result = await response.json();
      const data = result.data ? result.data : result;

      if (data && Object.keys(data).length > 0) {
        const savedImages = data.images || (data.filename ? [data.filename] : [getSvgUrl(defaultRole.id)]);
        
        role.value = {
          ...defaultRole,
          title: data.title || defaultRole.title,
          subtitle: data.subtitle || defaultRole.subtitle,
          description: data.description || defaultRole.description,
          discordLink: data.discordLink || defaultRole.discordLink, // 🔥 CORRECCIÓN: Sincroniza el link dinámico de Discord
          images: savedImages
        };

        // Guardamos una copia exacta en el almacenamiento local del navegador
        localStorage.setItem(`backup_${targetCacheKey}`, JSON.stringify(role.value));
      } else {
        throw new Error('Empty data');
      }
    } catch (error) {
      console.warn(`[useRoleDetail] No se pudo conectar con el servidor para ${currentServerId}. Buscando respaldo local...`);
      
      // Capa 3: Si el servidor falla o no responde, intentamos extraer el respaldo de localStorage
      const localBackup = localStorage.getItem(`backup_${targetCacheKey}`);
      
      if (localBackup) {
        console.log(`[useRoleDetail] Respaldo local detectado y restaurado con éxito.`);
        role.value = JSON.parse(localBackup);
      } else {
        // Red de seguridad final: Si tampoco hay respaldo local, cargamos los valores por defecto crudos
        console.warn(`[useRoleDetail] Sin respaldo local disponible. Inicializando con defaults de fábrica.`);
        role.value = { ...defaultRole, images: [getSvgUrl(defaultRole.id) || ''] };
      }
    } finally {
      // Guardamos en la memoria global para optimizar la navegación actual
      if (role.value) fetchedServers[currentServerId] = role.value;
      bLoading.value = false;
    }
  };

  // Lógica de carga de imágenes
  const handleAddImage = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0 || !role.value) return;

    const file = input.files[0];
    if (!file) return;
    
    const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
    
    if (file.size > MAX_FILE_SIZE_BYTES) {
      alert(`El archivo excede el límite máximo permitido de 10 MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Result = e.target?.result as string;
      if (base64Result && role.value) {
        if (!role.value.images) role.value.images = [];
        role.value.images.push(base64Result);
        
        const targetCacheKey = `server_page_config_${role.value.id}`;
        localStorage.setItem(`backup_${targetCacheKey}`, JSON.stringify(role.value));
      }
    };
    reader.readAsDataURL(file);
  };

  // Lógica de eliminación de imágenes
  const removeImageAtIndex = (index: number) => {
    if (!role.value || !role.value.images) return;
    role.value.images.splice(index, 1);
    
    const targetCacheKey = `server_page_config_${role.value.id}`;
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