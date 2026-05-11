// Helper server-side para acceder al catálogo de vehículos
// Cargado de forma lazy desde lib/catalog-data/catalog.json

import catalogData from "./catalog-data/catalog.json";
import brandsData from "./catalog-data/brands.json";

export interface VehicleLine {
  linea: string;
  avaluo: Record<string, number>; // año => valor en COP
}

export type VehicleCatalog = Record<string, VehicleLine[]>;

const catalog = catalogData as VehicleCatalog;
const brands  = brandsData as string[];

export function getBrands(): string[] {
  return brands;
}

export function getLinesByBrand(brand: string): VehicleLine[] {
  return catalog[brand.toUpperCase()] ?? [];
}

export function searchLines(brand: string, query: string, limit = 20): VehicleLine[] {
  const lines = getLinesByBrand(brand);
  if (!query) return lines.slice(0, limit);
  const q = query.toUpperCase();
  return lines.filter(l => l.linea.toUpperCase().includes(q)).slice(0, limit);
}

export function getAvaluo(brand: string, linea: string, ano: number): number {
  const lines = getLinesByBrand(brand);
  const match = lines.find(l => l.linea.toUpperCase() === linea.toUpperCase());
  if (!match) return 0;

  // Buscar el avalúo del año, fallback al año más cercano disponible
  const anoStr = String(ano);
  if (match.avaluo[anoStr]) return match.avaluo[anoStr];

  // Si es muy antiguo, usar "2001"
  if (ano < 2001) return match.avaluo["2001"] ?? 0;
  // Si es muy nuevo, usar el último año disponible
  const years = Object.keys(match.avaluo).map(Number).sort((a, b) => b - a);
  for (const y of years) {
    if (y <= ano && match.avaluo[String(y)]) return match.avaluo[String(y)];
  }
  return match.avaluo[String(years[0])] ?? 0;
}

// Top marcas más populares en Colombia (para destacar en UI)
export const TOP_BRANDS_COLOMBIA = [
  "CHEVROLET", "RENAULT", "MAZDA", "TOYOTA", "NISSAN",
  "KIA", "HYUNDAI", "FORD", "VOLKSWAGEN", "SUZUKI",
  "MITSUBISHI", "BMW", "MERCEDES BENZ", "AUDI", "HONDA",
];
