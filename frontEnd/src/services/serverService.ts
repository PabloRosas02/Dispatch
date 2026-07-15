import { ref, readonly } from 'vue';
import type * as ServerType from '../types/serverTypes';

export const rpServers = ref<ServerType.RPServer[]>([]);
const defaultPath = "/api/servers";
const isInitBasic = ref<boolean>(false);
const isInitAddit = ref<boolean>(false);
const isInitVBS = ref<boolean>(false);

interface BasicInfoPayload {
  success: boolean;
  data: ServerType.BasicInfo[];
}

interface AdditInfoPayload {
  success: boolean;
  data: (ServerType.AdditionalInfo & { id: string })[];
}

interface RuleInfoItem {
  id: string;
  banner: ServerType.BannerDetails;
  ver: ServerType.VersionAndStatus;
  sections: ServerType.RuleSection[];
}

interface RuleInfoPayload {
  success: boolean;
  data: RuleInfoItem[];
}

export function useServerService() {

  function updateServers() {

    return;
  }

  function getAllServers() {
    return readonly(rpServers);
  }

  function getServerById(id: string): ServerType.RPServer | undefined {
    return rpServers.value.find(server => server.basic.id === id);
  }

  function getServerColorById(id: string): string {
    const server: ServerType.RPServer | undefined = rpServers.value.find(server => server.basic.id === id);

    if (server) {
      return server.addit.color
    }

    return '#1b2d4a';
  }

  function getSvgUrl(id: string) {
    const server: ServerType.RPServer | undefined = getServerById(id);

    if (server) {
      return `/icons/${server.basic.filename}`;
    }
    return undefined;
  }

  function getServerFromRouteParam(serverIdParam: string | string[]):
    ServerType.RPServer | undefined {
    const rawId = Array.isArray(serverIdParam) ? serverIdParam[0] : serverIdParam;
    const targetId = rawId || 'leo';
    return getServerById(targetId);
  }

  async function fetchBasicInfo(): Promise<void> {
    try {
      const url = `${defaultPath}/basic-info`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const res = (await response.json()) as BasicInfoPayload;

      // Filtra y mapea solo la propiedad basic de cada objeto
      const filteredData = res.data.map((item): ServerType.RPServer => {
        return {
          // Metemos los datos del endpoint de forma segura dentro del objeto 'basic'
          basic: {
            id: item.id,
            title: item.title,
            subtitle: item.subtitle,
            filename: item.filename
          },
          // Rellenamos el resto de propiedades obligatorias con valores por defecto/vacíos
          // para que TypeScript no se queje de que faltan campos en RPServer
          addit: { color: '', description: '', discordLink: '' },
          banner: { bannerImage: '', bannerLabel: '', bannerDescription: '' },
          ver: { version: '1.0.0', lastUpdate: '', status: 'unknown' },
          sections: []
        };
      });
      // Actualiza el estado reactivo con los datos filtrados y mapeados
      rpServers.value = filteredData;
      isInitBasic.value = true;
    } catch (error) {
      isInitBasic.value = false;
      console.error('Error fetching data:', error);
    }
  }

  async function fetchAdditInfo(): Promise<void> {

    try {
      const url = `${defaultPath}/addit-info`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const res = (await response.json()) as AdditInfoPayload;

      if (Array.isArray(res.data)) {

        const serverMap = new Map(
          rpServers.value
            .filter((s) => s?.basic?.id)
            .map((s) => [s.basic.id, s])
        );

        res.data.forEach((info) => {
          const server = serverMap.get(info.id);

          if (server) {
            server.addit = {
              color: info.color,
              description: info.description,
              discordLink: info.discordLink,
            };
          }
        });
      }

      isInitAddit.value = true;
    } catch (error) {
      isInitAddit.value = false;
      console.error('Error fetching data:', error);
    }
  }

  async function fetchRuleInfo(): Promise<void> {

    try {
      const url = `${defaultPath}/rules-info`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const res = (await response.json()) as RuleInfoPayload;

      if (Array.isArray(res.data)) {

        const serverMap = new Map(
          rpServers.value
            .filter((s) => s?.basic?.id)
            .map((s) => [s.basic.id, s])
        );

        res.data.forEach((item) => {
          const server = serverMap.get(item.id);

          if (server) {
            server.banner = {
              bannerImage: item.banner.bannerImage,
              bannerLabel: item.banner.bannerLabel,
              bannerDescription: item.banner.bannerDescription
            };

            server.ver = {
              version: item.ver.version,
              status: item.ver.status,
              lastUpdate: item.ver.lastUpdate
            }

            server.sections = item.sections;
          }
        });
      }

      isInitVBS.value = true;
    } catch (error) {
      isInitVBS.value = false;
      console.error('Error fetching data:', error);
    }
  }

  async function initBasic() {

    if (!isInitBasic.value) {
      await fetchBasicInfo();
    }

    if (!isInitAddit.value) {
      await fetchAdditInfo();
    }

  }

  async function initRules() {

    if (!isInitVBS.value) {
      await fetchRuleInfo();
    }

  }

  return {
    isInitVBS,
    initBasic,
    initRules,
    updateServers,
    getAllServers,
    getServerById,
    getServerColorById,
    getSvgUrl,
    getServerFromRouteParam,
  };
}
