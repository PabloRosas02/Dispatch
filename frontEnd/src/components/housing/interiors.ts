export interface Interior {
  id: string;
  zone: string;
  name: string;

  images: string[];

  price: number;
  bedrooms: number;
  bathrooms: number;
  garage: boolean;
}

export const interiors: Interior[] = [
  {
    id: "starter-1",
    zone: "barrios-bajos",
    name: "Starter House I",

    images: [
      "starter-1/hall.webp",
      "starter-1/room.webp",
    ],

    price: 60000,
    bedrooms: 1,
    bathrooms: 1,
    garage: false,
  }
];