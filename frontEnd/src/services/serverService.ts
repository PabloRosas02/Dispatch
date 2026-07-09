import { ref, readonly } from 'vue';
import type * as ServerType from '../types/serverTypes';

export const rpServers = ref<ServerType.RPServer[]>([]);
const defaultPath = "/api/servers/";
const isInitBasic = ref<boolean>(false);
const isInitAddit = ref<boolean>(false);
const isInitVBS = ref<boolean>(false);

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
    console.log(serverIdParam);
    const rawId = Array.isArray(serverIdParam) ? serverIdParam[0] : serverIdParam;
    const targetId = rawId || 'leo';
    return getServerById(targetId);
  }

  async function fetchBasicInfo() {
    try {
      const url = `${defaultPath}basic-info`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const res = await response.json();

      // Filtra y mapea solo la propiedad basic de cada objeto
      const filteredData = res.data.map((item: ServerType.BasicInfo): ServerType.RPServer => {
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

  async function fetchAdditInfo() {
    try {
      const url = `${defaultPath}addit-info`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const res = await response.json();

      // Buscamos y fusionamos los datos dentro de nuestro estado reactivo existente
      res.data.forEach((info: ServerType.AdditionalInfo & { id: string }) => {
        const server = rpServers.value.find(s => s.basic.id === info.id);
        if (server) {
          server.addit = {
            color: info.color,
            description: info.description,
            discordLink: info.discordLink
          };
        }
      });
      isInitAddit.value = true;
    } catch (error) {
      isInitAddit.value = false;
      console.error('Error fetching data:', error);
    }
  }

  async function fetchRuleInfo() {
    try {
      const url = `${defaultPath}rules-info`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const res = await response.json();

      // Buscamos y fusionamos los datos dentro de nuestro estado reactivo existente
      res.data.forEach((item: {
        id: string;
        banner: ServerType.BannerDetails;
        sections: ServerType.RuleSection[]
      }) => {

        // Buscamos el servidor que coincida con el ID de la respuesta
        const server = rpServers.value.find(s => s.basic.id === item.id);

        if (server) {
          // 1. Emparejamos e inyectamos los datos del banner
          server.banner = {
            bannerImage: item.banner.bannerImage,
            bannerLabel: item.banner.bannerLabel,
            bannerDescription: item.banner.bannerDescription
          };

          // 2. Emparejamos e inyectamos el array de secciones directamente
          server.sections = item.sections;
        }
      });
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
