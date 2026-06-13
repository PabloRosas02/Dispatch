import { ref, readonly } from 'vue';
import type * as ServerType from '../types/serverTypes';

export const rpServers = <ServerType.RPServer[]>([
  {
    id: "leo",
    title: "L.E.O ROL",
    subtitle: "LAW ENFORCEMENT & ORDER'",
    description:
    "Infraestructura avanzada para la gestión, control y automatización de los departamentos de seguridad. \
    Diseñado con paneles tácticos intuitivos que garantizan una respuesta inmediata y optimización del flujo operativo de \
    Kinsfolk.",
    filename: "L.e.o.svg",
    discordLink: "https://discord.gg/",
    color: '#1b2d4a',
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
  {
    id: 'sams',
    title: 'S.A.M.S ROL',
    subtitle: 'MEDICAL ASSISTANCE & SERVICES',
    description: 'Ecosistema robusto enfocado en servicios médicos y de asistencia rápida. Permite la clasificación inteligente de registros médicos, control de pacientes en tiempo real y una distribución visual ágil de recursos.',
    filename: 'SAMS.svg',
    color: '#591919',
    discordLink: 'https://discord.gg/YpvBDNRn',
    sections: []
  },
  {
    id: 'safd',
    title: 'S.A.F.D ROL',
    subtitle: 'FIRE & RESCUE SOLUTIONS',
    description: 'Solución táctica dedicada al cuerpo de bomberos y mitigación de riesgos. Proporciona interfaces adaptativas de mapeo interactivo y flujos de alertas críticas optimizados para situaciones de alta prioridad.',
    filename: 'SAFD.svg',
    color: '#824316',
    discordLink: 'https://discord.gg/3KQ3JwSw',
    sections: []
  },
  {
    id: 'civiles',
    title: 'CIVILES',
    subtitle: 'CITIZEN ECOSYSTEM & JOBS',
    description: 'El núcleo de la interacción social y económica. Un entorno dinámico donde los usuarios gestionan identidades, empleos civiles, licencias y propiedades bajo una interfaz estilizada y fluida.',
    filename: 'Proyectos civiles.svg',
    color: '#133a2d',
    discordLink: 'https://discord.gg/KfN8vKhZ7',
    sections: []
  },
  {
    id: 'ilegales',
    title: 'ILEGALES',
    subtitle: 'CRIMINAL ENTERPRISE NETWORKS',
    description: 'Sistemas diseñados con interfaces oscuras y minimalistas para la gestión de redes clandestinas, mercados negros y economías alternativas controladas desde las sombras de la ciudad.',
    filename: 'Ilegales.svg',
    color: '#2c2d30',
    discordLink: 'https://discord.gg/BECZxnSWS',
    sections: []
  },
  {
    id: 'creator',
    title: 'CREADORES DE CONTENIDO',
    subtitle: 'MEDIA & STREAMING TOOLS',
    description: 'Espacio dedicado a creadores de contenido y distribución multimedia. Ofrece integración directa de transmisiones, galerías dinámicas y herramientas exclusivas para potenciar la marca Kinsfolk.',
    filename: 'Content Creator.svg',
    color: '#571c75',
    discordLink: 'https://discord.gg/e4GhgKx5s',
    sections: []
  }
]);

export function useServerService() {

  function updateServers(){

    return;
  }

  function getAllServers(){
    return readonly(rpServers);
  }

  function getServerById(id: string): ServerType.RPServer | undefined{
    return rpServers.find(server => server.id === id);
  }

  function getServerColorById(id: string): string {
    const server:ServerType.RPServer | undefined = rpServers.find(server => server.id === id);

    if(server){
      return server.color
    }

    return '#1b2d4a';
  }

  function getSvgUrl(id: string){
    const server: ServerType.RPServer | undefined = getServerById(id);

    if(server){
      return new URL(`/src/assets/icons/${server.filename}`, import.meta.url).href;
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

  return {
    updateServers,
    getAllServers,
    getServerById,
    getServerColorById,
    getSvgUrl,
    getServerFromRouteParam,
  };
}
