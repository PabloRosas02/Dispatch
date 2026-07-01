import { ref, readonly } from 'vue';
import type * as ServerType from '../types/serverTypes';

export const rpServers = ref<ServerType.RPServer[]>([
  {
  id: "leo",

  title: "L.E.O ROL",

  subtitle: "LAW ENFORCEMENT & ORDER",

  description:
    "Infraestructura avanzada para la gestión, control y automatización de los departamentos de seguridad. Diseñado para garantizar profesionalismo, coordinación y una experiencia inmersiva dentro del cuerpo policial de Kinsfolk.",

  filename: "L.e.o.svg",

  discordLink: "https://discord.gg/",

  color: "#1b2d4a",

  bannerImage: "/images/banners/leo.webp",

  bannerLabel: "L.E.O MANUAL",

  bannerDescription:
    "Estas directrices establecen los procedimientos, responsabilidades y estándares que deben seguir todos los miembros del departamento para mantener el orden, el profesionalismo y una experiencia de rol de alta calidad.",

  version: "1.0",

  lastUpdate: "24 JUN 2026",

  status: "VERIFIED",

  sections: [
    {
      title: "Core Directives",
      rules: [
        {
          title: "Metagaming",
          description: "Using external stream or discord info in-game.",
          example: "Stream-sniping a rival gang raid."
        },
        {
          title: "Value of Life",
          description: "You must value your life under gunpoint.",
          example: "Running away while a gun is held to your head."
        }
      ]
    },
    {
      title: "Augment Etiquette",
      rules: [
        {
          title: "Powergaming Mods",
          description: "Implants must have physical drawbacks.",
          example: "Having an un-hackable, bulletproof skull."
        }
      ]
    },
    {
      title: "Netrunning",
      rules: [
        {
          title: "Deep Dive Consent",
          description: "Brain-wiping another character requires OOC consent.",
          example:
            "Permanently deleting a player character's memories without asking."
        }
      ]
    }
  ]
},
{
  id: "sams",

  title: "S.A.M.S ROL",

  subtitle: "MEDICAL ASSISTANCE & SERVICES",

  description:
    "Sistema dedicado al personal médico y de emergencias. Incluye protocolos de atención, coordinación hospitalaria y respuesta inmediata para garantizar un rol médico profesional.",

  filename: "SAMS.svg",

  discordLink: "https://discord.gg/YpvBDNRn",

  color: "#591919",

  bannerImage: "/images/banners/sams.webp",

  bannerLabel: "S.A.M.S MANUAL",

  bannerDescription:
    "Manual oficial para el personal médico. Define los protocolos de atención, respuesta a emergencias y comportamiento profesional durante todas las intervenciones dentro de la ciudad.",

  version: "2.0",

  lastUpdate: "24 JUN 2026",

  status: "VERIFIED",

  sections: [
    {
      title: "Core Directives",
      rules: [
        {
          title: "Metagaming",
          description: "Using external stream or discord info in-game.",
          example: "Stream-sniping a rival gang raid."
        },
        {
          title: "Value of Life",
          description: "You must value your life under gunpoint.",
          example: "Running away while a gun is held to your head."
        }
      ]
    },
    {
      title: "Augment Etiquette",
      rules: [
        {
          title: "Powergaming Mods",
          description: "Implants must have physical drawbacks.",
          example: "Having an un-hackable, bulletproof skull."
        }
      ]
    },
    {
      title: "Netrunning",
      rules: [
        {
          title: "Deep Dive Consent",
          description: "Brain-wiping another character requires OOC consent.",
          example:
            "Permanently deleting a player character's memories without asking."
        }
      ]
    }
  ]
},
  {
  id: "safd",

  title: "S.A.F.D ROL",

  subtitle: "FIRE & RESCUE SOLUTIONS",

  description:
    "Normativas y procedimientos para el cuerpo de bomberos y rescate. Garantiza una coordinación eficiente durante emergencias, incendios y operaciones de salvamento.",

  filename: "SAFD.svg",

  discordLink: "https://discord.gg/3KQ3JwSw",

  color: "#824316",

  bannerImage: "/images/banners/safd.webp",

  bannerLabel: "S.A.F.D MANUAL",

  bannerDescription:
    "Normativas destinadas al cuerpo de bomberos y rescate. Incluye procedimientos para incidentes, emergencias, rescates y coordinación con los demás servicios de la ciudad.",

  version: "2.0",

  lastUpdate: "24 JUN 2026",

  status: "VERIFIED",

  sections: [
    {
      title: "Core Directives",
      rules: [
        {
          title: "Metagaming",
          description: "Using external stream or discord info in-game.",
          example: "Stream-sniping a rival gang raid."
        },
        {
          title: "Value of Life",
          description: "You must value your life under gunpoint.",
          example: "Running away while a gun is held to your head."
        }
      ]
    },
    {
      title: "Augment Etiquette",
      rules: [
        {
          title: "Powergaming Mods",
          description: "Implants must have physical drawbacks.",
          example: "Having an un-hackable, bulletproof skull."
        }
      ]
    },
    {
      title: "Netrunning",
      rules: [
        {
          title: "Deep Dive Consent",
          description: "Brain-wiping another character requires OOC consent.",
          example:
            "Permanently deleting a player character's memories without asking."
        }
      ]
    }
  ]
},
  {
  id: "ilegales",

  title: "ILEGALES",

  subtitle: "CRIMINAL ENTERPRISE NETWORKS",

  description:
    "Manual destinado a organizaciones criminales y actividades ilegales. Define las reglas para enfrentamientos, robos, secuestros y operaciones clandestinas manteniendo el equilibrio entre todas las facciones del servidor.",

  filename: "Ilegales.svg",

  discordLink: "https://discord.gg/BECZxnSWS",

  color: "#2c2d30",

  bannerImage: "/images/banners/ilegales.webp",

  bannerLabel: "UNDERGROUND GUIDE",

  bannerDescription:
    "Normativas destinadas a organizaciones criminales, bandas y actividades ilegales. Establecen los límites del rol criminal para mantener un entorno competitivo, justo e inmersivo.",

  version: "2.0",

  lastUpdate: "24 JUN 2026",

  status: "VERIFIED",

  sections: [
    {
      title: "Core Directives",
      rules: [
        {
          title: "Metagaming",
          description: "Using external stream or discord info in-game.",
          example: "Stream-sniping a rival gang raid."
        },
        {
          title: "Value of Life",
          description: "You must value your life under gunpoint.",
          example: "Running away while a gun is held to your head."
        }
      ]
    },
    {
      title: "Augment Etiquette",
      rules: [
        {
          title: "Powergaming Mods",
          description: "Implants must have physical drawbacks.",
          example: "Having an un-hackable, bulletproof skull."
        }
      ]
    },
    {
      title: "Netrunning",
      rules: [
        {
          title: "Deep Dive Consent",
          description: "Brain-wiping another character requires OOC consent.",
          example:
            "Permanently deleting a player character's memories without asking."
        }
      ]
    }
  ]
},
  {
  id: "creator",

  title: "CREADORES DE CONTENIDO",

  subtitle: "MEDIA & STREAMING TOOLS",

  description:
    "Programa oficial para streamers, fotógrafos, cineastas y creadores de contenido. Establece los lineamientos para representar a Kinsfolk mediante contenido audiovisual de calidad.",

  filename: "Content Creator.svg",

  discordLink: "https://discord.gg/e4GhgKx5s",

  color: "#571c75",

  bannerImage: "/images/banners/creator.webp",

  bannerLabel: "CONTENT CREATOR PROGRAM",

  bannerDescription:
    "Normativas y lineamientos para streamers, fotógrafos, cineastas y creadores de contenido que representan a Kinsfolk mediante transmisiones, videos y material multimedia.",

  version: "2.0",

  lastUpdate: "24 JUN 2026",

  status: "VERIFIED",

  sections: [
    {
      title: "Core Directives",
      rules: [
        {
          title: "Metagaming",
          description: "Using external stream or discord info in-game.",
          example: "Stream-sniping a rival gang raid."
        },
        {
          title: "Value of Life",
          description: "You must value your life under gunpoint.",
          example: "Running away while a gun is held to your head."
        }
      ]
    },
    {
      title: "Augment Etiquette",
      rules: [
        {
          title: "Powergaming Mods",
          description: "Implants must have physical drawbacks.",
          example: "Having an un-hackable, bulletproof skull."
        }
      ]
    },
    {
      title: "Netrunning",
      rules: [
        {
          title: "Deep Dive Consent",
          description: "Brain-wiping another character requires OOC consent.",
          example:
            "Permanently deleting a player character's memories without asking."
        }
      ]
    }
  ]
}
]);

export function useServerService() {

  function updateServers(){

    return;
  }

  function getAllServers(){
    return readonly(rpServers.value);
  }

  function getServerById(id: string): ServerType.RPServer | undefined{
    return rpServers.value.find(server => server.id === id);
  }

  function getServerColorById(id: string): string {
    const server:ServerType.RPServer | undefined = rpServers.value.find(server => server.id === id);

    if(server){
      return server.color
    }

    return '#1b2d4a';
  }

  function getSvgUrl(id: string){
    const server: ServerType.RPServer | undefined = getServerById(id);

    if(server){
      return `/icons/${server.filename}`;
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
