export interface HousingZone {
  id: string;
  name: string;
  description: string;
  price: string;
  image?: string;
}

export const housingZones: HousingZone[] = [
  {
    id: "barrios-bajos",
    name: "Barrios Bajos",
    description: "Viviendas económicas ideales para comenzar tu historia.",
    image: "barrios-bajos.webp",
    price: "$60,000 - $80,000",
  },
  {
    id: "mirror-park",
    name: "Mirror Park",
    description: "Zona residencial tranquila con propiedades de gama media.",
    image: "mirror-park.webp",
    price: "$180,000 - $250,000",
  },
  {
    id: "vinewood",
    name: "Vinewood",
    description: "Residencias exclusivas con vistas privilegiadas.",
    image: "vinewood.webp",
    price: "$350,000 - $500,000",
  }
];