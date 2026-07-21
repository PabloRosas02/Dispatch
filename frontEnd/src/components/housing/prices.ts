export interface HousingPrice {
  zone: string;
  min: number;
  max: number;
}

export const housingPrices: HousingPrice[] = [
  {
    zone: "Barrios Bajos",
    min: 60000,
    max: 80000,
  },
  {
    zone: "Mirror Park",
    min: 180000,
    max: 250000,
  },
  {
    zone: "Vinewood",
    min: 350000,
    max: 500000,
  },
  {
    zone: "Rockford Hills",
    min: 600000,
    max: 900000,
  },
];