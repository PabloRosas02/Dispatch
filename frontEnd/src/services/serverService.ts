import { ref } from 'vue';
import type * as ServerType from '../types/serverTypes';

import imgLEO from '@/assets/cards/K_LEO.png';
import imgSAMS from '@/assets/cards/K_SAMS.png';
import imgSAFD from '@/assets/cards/K_SAFD.png';
import imgCiviles from '@/assets/cards/K_CIVILES.png';
import imgIlegales from '@/assets/cards/K_ILEGALES.png';
import imgCreator from '@/assets/cards/K_CREATOR.png';

export const rpServers = <ServerType.RPServer[]>([
  {
    id: "leo",
    title: "L.E.O ROL",
    subtitle: "LAW ENFORCEMENT & ORDER'",
    description: 
    "Infraestructura avanzada para la gestión, control y automatización de los departamentos de seguridad. \
    Diseñado con paneles tácticos intuitivos que garantizan una respuesta inmediata y optimización del flujo operativo de \
    Kinsfolk.",
    image: imgLEO,
    discordLink: "https://discord.gg/",
    sections: [
      {
        title: 'Core Directives',
        rules: [
          { title: 'Metagaming', description: 'Using external stream or discord info in-game.', example: 'Stream-sniping a rival gang raid.' },
          { title: 'Value of Life', description: 'You must value your life under gunpoint.', example: 'Running away while a gun is held to your head.' }
        ]
      },
      {
        title: 'Augment Etiquette',
        rules: [
          { title: 'Powergaming Mods', description: 'Implants must have physical drawbacks.', example: 'Having an un-hackable, bulletproof skull.' }
        ]
      },
      {
        title: 'Netrunning',
        rules: [
          { title: 'Deep Dive Consent', description: 'Brain-wiping another character requires OOC consent.', example: 'Permanently deleting a player character\'s memories without asking.' }
        ]
      },
    ],
  },
]);

export function useServerService() {

  function updateServers(){

    return;
  }

  function getServerById(id: string): ServerType.RPServer | undefined{
    return rpServers.find(server => server.id === id);
  }

  function getServerFromRouteParam(serverIdParam: string | string[]): 
  ServerType.RPServer | undefined {
    console.log(serverIdParam);
    const rawId = Array.isArray(serverIdParam) ? serverIdParam[0] : serverIdParam;
    const targetId = rawId || 'leo';
    return getServerById(targetId);
  }

  return {
    updateServers,
    getServerById,
    getServerFromRouteParam,
  };
}
