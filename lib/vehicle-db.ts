/**
 * vehicle-db.ts
 * Base de datos vehicular oficial — Ministerio de Transporte Colombia 2026
 * Fuente: "Avalúo e Impuestos de Vehículos 2026" (13.289 registros)
 *
 * Estructura del JSON: { tipos[], db: { TIPO: { MARCA: [{ ref, cil, pas, ton, avaluo }] } } }
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const raw = require("./catalog-data/vehicle-db.json") as VehicleDB;

// ── Tipos ─────────────────────────────────────────────────────────────────

export interface VehicleRef {
  /** Referencia completa, ej: "INTEGRA 1.8 2P MT" */
  ref: string;
  /** Cilindraje en cc. null para eléctricos puros */
  cil: number | null;
  /** Capacidad de pasajeros */
  pas: number | null;
  /** Tonelaje (para carga) */
  ton: number | null;
  /** Avalúo por año (cifras en pesos) */
  avaluo: Record<string, number>;
}

interface VehicleDB {
  version: string;
  fuente: string;
  total: number;
  tipos: string[];
  db: Record<string, Record<string, VehicleRef[]>>;
}

// ── Labels amigables para la UI ───────────────────────────────────────────

export const TIPO_LABELS: Record<string, string> = {
  AUTOMOVILES:            "Automóvil",
  "CAMIONETAS DOBLECABINA": "Camioneta Doble Cabina",
  "CAMIONETAS Y CAMPEROS":  "Camioneta / Campero / SUV",
  CARGA:                  "Vehículo de Carga",
  ELECTRICOS:             "Eléctrico",
  HIBRIDOS:               "Híbrido",
  PASAJEROS:              "Bus / Microbus / Pasajeros",
};

/** Orden preferido para mostrar en el selector */
const TIPO_ORDER = [
  "AUTOMOVILES",
  "CAMIONETAS Y CAMPEROS",
  "CAMIONETAS DOBLECABINA",
  "ELECTRICOS",
  "HIBRIDOS",
  "PASAJEROS",
  "CARGA",
];

// ── Funciones de lookup ───────────────────────────────────────────────────

/** Lista de tipos de carrocería disponibles, en orden UI */
export function getTipos(): string[] {
  return TIPO_ORDER.filter((t) => raw.db[t]);
}

/** Lista de marcas para un tipo dado, ordenadas alfabéticamente */
export function getMarcasByTipo(tipo: string): string[] {
  const marcas = raw.db[tipo.toUpperCase()];
  if (!marcas) return [];
  return Object.keys(marcas).sort();
}

/** Referencias completas para un tipo + marca */
export function getReferencias(tipo: string, marca: string): VehicleRef[] {
  const marcas = raw.db[tipo.toUpperCase()];
  if (!marcas) return [];
  return marcas[marca.toUpperCase()] ?? [];
}

/** Busca una referencia específica y devuelve sus datos técnicos */
export function getRefData(tipo: string, marca: string, refNombre: string): VehicleRef | null {
  const refs = getReferencias(tipo, marca);
  return refs.find((r) => r.ref.toUpperCase() === refNombre.toUpperCase()) ?? null;
}

/** Avalúo de una referencia para un año dado */
export function getAvaluo(tipo: string, marca: string, refNombre: string, ano: string | number): number | null {
  const rd = getRefData(tipo, marca, refNombre);
  if (!rd) return null;
  return rd.avaluo[String(ano)] ?? null;
}

/** Cilindraje de una referencia */
export function getCilindraje(tipo: string, marca: string, refNombre: string): number | null {
  return getRefData(tipo, marca, refNombre)?.cil ?? null;
}

/**
 * Búsqueda por texto libre en una marca.
 * Útil para el autocompletado de referencia.
 */
export function searchReferencias(
  tipo: string,
  marca: string,
  query: string,
  limit = 50,
): VehicleRef[] {
  const all = getReferencias(tipo, marca);
  if (!query) return all.slice(0, limit);
  const q = query.toUpperCase();
  return all.filter((r) => r.ref.toUpperCase().includes(q)).slice(0, limit);
}

/**
 * Dado solo marca + referencia (sin tipo), busca en todos los tipos.
 * Devuelve el primer match. Útil cuando el tipo aún no está seleccionado.
 */
export function findRefAnywhere(marca: string, refNombre: string): VehicleRef | null {
  const m = marca.toUpperCase();
  const r = refNombre.toUpperCase();
  for (const tipo of getTipos()) {
    const refs = raw.db[tipo]?.[m];
    if (!refs) continue;
    const found = refs.find((x) => x.ref.toUpperCase() === r);
    if (found) return found;
  }
  return null;
}

/** Estadísticas generales */
export function getVehicleDBStats() {
  return {
    version: raw.version,
    fuente: raw.fuente,
    total: raw.total,
    tipos: raw.tipos.length,
  };
}
