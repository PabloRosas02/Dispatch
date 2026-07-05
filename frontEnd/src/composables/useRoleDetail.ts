import { ref, watch, onUnmounted } from 'vue';
import type * as ServerType from '@/types/serverTypes';
import { useServerService } from '@/services/serverService';

export interface ExtendedRPServer extends Omit<ServerType.RPServer, 'basic'> {
  basic: Omit<ServerType.BasicInfo, 'filename'>;
  filename?: string;
  images?: string[];
};

// Almacén global temporal para evitar peticiones repetitivas entre navegaciones.
// Usamos un objeto indexado por ID de servidor.
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

  // Lógica de carga única
  const fetchRoleData = async (forceRefresh = false) => {
    const defaultRole = getServerFromRouteParam(currentServerId) as ExtendedRPServer;

    if (!defaultRole) {
      bLoading.value = false;
      return;
    }

    // Si ya tenemos los datos en memoria y no forzamos recarga, usamos la caché local.
    if (fetchedServers[currentServerId] && !forceRefresh) {
      role.value = fetchedServers[currentServerId];
      bLoading.value = false;
      return;
    }

    const targetCacheKey = `server_page_config_${defaultRole.basic.id}`;
    bLoading.value = true;

    try {
      const response = await fetch(`/api/cache/${targetCacheKey}`);
      if (response.status === 404) throw new Error('Not found in cache');

      const result = await response.json();
      const data = result.data ? result.data : result;

      if (data && Object.keys(data).length > 0) {
        const savedImages = data.images || (data.filename ? [data.filename] : [getSvgUrl(defaultRole.basic.id)]);
        role.value = {
          ...defaultRole,
          basic: {
            id: data.basic.id || defaultRole.basic.id,
            title: data.basic.title || defaultRole.basic.title,
            subtitle: data.basic.subtitle || defaultRole.basic.subtitle,
          },
          addit: {
            color: data.addit.color || defaultRole.addit.color,
            description: data.addit.description || defaultRole.addit.description,
            discordLink: data.addit.discordLink || defaultRole.addit.discordLink
          },
          images: savedImages
        };
      } else {
        throw new Error('Empty data');
      }
    } catch (error) {
      // Si falla (o devuelve 404), inicializamos con los valores por defecto
      console.warn(`[useRoleDetail] No se encontraron datos cacheados para ${currentServerId}, cargando defaults.`);
      role.value = { ...defaultRole, images: [getSvgUrl(defaultRole.basic.id) || ''] };
    } finally {
      // Guardamos en la memoria global para la próxima vez
      if (role.value) fetchedServers[currentServerId] = role.value;
      bLoading.value = false;
    }
  };

  // Lógica de imágenes
  const handleAddImage = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0 || !role.value) return;

    const file = input.files[0];
    if (!file) return;

    const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

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
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImageAtIndex = (index: number) => {
    if (!role.value || !role.value.images) return;
    role.value.images.splice(index, 1);
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
