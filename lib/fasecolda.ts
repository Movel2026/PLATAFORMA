/**
 * lib/fasecolda.ts
 * Cliente para la API oficial de Fasecolda Guía de Valores
 * API base: https://guiadevalores.fasecolda.com/apifasecolda/api/
 *
 * Endpoints descubiertos por ingeniería inversa (ver: github.com/ahenaor/fasecolda-dataset)
 * Token: variable de entorno FASECOLDA_TOKEN (obtener del DevTools > Network al usar guiadevalores.fasecolda.com)
 */

const BASE = "https://guiadevalores.fasecolda.com/apifasecolda/api/";

function getHeaders(): HeadersInit {
  const token = process.env.FASECOLDA_TOKEN;
  if (!token) throw new Error("FASECOLDA_TOKEN no configurado");
  return {
    Accept: "application/json",
    Authorization: `bearer ${token}`,
  };
}

// ── Cache en memoria (válido durante el tiempo de vida del proceso) ─────────
const cache = new Map<string, { data: unknown; ts: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hora

async function apiFetch<T>(path: string, requireAuth = true): Promise<T> {
  const cacheKey = path;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return cached.data as T;
  }

  const opts: RequestInit = requireAuth
    ? { headers: getHeaders() }
    : { headers: { Accept: "application/json" } };

  const res = await fetch(BASE + path, opts);
  if (!res.ok) {
    throw new Error(`Fasecolda API error ${res.status} en /${path}`);
  }
  const data = (await res.json()) as T;
  cache.set(cacheKey, { data, ts: Date.now() });
  return data;
}

// ── Tipos ────────────────────────────────────────────────────────────────────

export interface FasecoldaItem {
  id: number;
  nombre: string;
}

export interface FasecoldaDetalle {
  idDetalle:            number;
  consecutivo:          number;
  codigo:               string;   // Código Fasecolda 8 dígitos
  cilindraje:           number;   // cc
  potencia:             number;   // HP
  capacidadPasajeros:   number;
  capacidadCarga:       number;
  puertas:              number;
  airbags:              number;
  peso:                 number;
  largo:                number;
  ejes:                 number;
  traccion:             string;
  combustible:          string;
  tipoCaja:             string;
  transmision:          string;
  tipologia:            string;   // Sedán, SUV, Descapotable…
  categoria:            string;
  clase:                string;
  marca:                string;
  referenciaUno:        string;
  referenciaDos:        string;
  referenciaTres:       string;
  nacionalidad:         string;
  servicio:             string;
  frenos:               string;
  tipoDireccion:        string;
  tipoFaros:            string;
  suspensiontrasera:    string;
  sistemaAlimentacion:  string;
  tipoAireAcondicionado:string;
  segmentoTamaño:       string;
  segmentoCilindraje:   string;
  homoloCodigo:         string;   // Código CH
  bcpp:                 string;
  um:                   string;
  valor:                number;   // valor en pesos COP
  modelo:               string;   // año
  modeloId:             number;
  estadoVehiculo:       string;
  codigoFoto:           string;   // para URL de imagen
  // booleans como string "Si"/"No"
  importadoMostrar:     string;
  aireAcondicionadoMostrar: string;
  camaraReversaMostrar: string;
  exploradorasMostrar:  string;
  sensoresMostrar:      string;
  sunroofMostrar:       string;
  absMostrar:           string;
  tapiceriaCueroMostrar:string;
  vidriosElectricos:    number;
  sillasElectricas:     number;
  espejosElectricos:    number;
  novedad:              string;
  observacion:          string;
  grupoActualizacion:   number;
  pesoCategoria:        string;
}

// ── Endpoints públicos (sin auth) ────────────────────────────────────────────

export async function getCategorias(): Promise<FasecoldaItem[]> {
  return apiFetch<FasecoldaItem[]>("categoria", false);
}

// ── Endpoints con auth ────────────────────────────────────────────────────────

/** Estado del vehículo: Nuevo (1) / Usado (2) */
export async function getEstados(idCategoria: number): Promise<FasecoldaItem[]> {
  return apiFetch<FasecoldaItem[]>(`estadovehiculo/getestadovehiculo/${idCategoria}`);
}

/** Años/modelos disponibles */
export async function getModelos(idCategoria: number, idEstado: number): Promise<FasecoldaItem[]> {
  return apiFetch<FasecoldaItem[]>(`modelo/getmodelo/${idCategoria}/${idEstado}`);
}

/** Marcas disponibles */
export async function getMarcas(
  idCategoria: number,
  idEstado: number,
  idModelo: number,
): Promise<FasecoldaItem[]> {
  return apiFetch<FasecoldaItem[]>(`marca/getmarca/${idCategoria}/${idEstado}/${idModelo}`);
}

/** Referencias (líneas técnicas) disponibles */
export async function getReferencias(
  idCategoria: number,
  idEstado: number,
  idModelo: number,
  idMarca: number,
): Promise<FasecoldaItem[]> {
  return apiFetch<FasecoldaItem[]>(
    `referenciauno/getgeferenciauno/${idCategoria}/${idEstado}/${idModelo}/${idMarca}`,
  );
}

/** Detalle técnico completo de una referencia */
export async function getDetalle(
  idCategoria: number,
  idEstado: number,
  idModelo: number,
  idMarca: number,
  idReferencia: number,
): Promise<FasecoldaDetalle[]> {
  return apiFetch<FasecoldaDetalle[]>(
    `listacodigos/getbuscabasica/${idCategoria}/${idEstado}/${idModelo}/${idMarca}/${idReferencia}/1`,
  );
}

// ── URL de foto (patrón observado en el portal) ───────────────────────────────
export function getFotoUrl(codigoFoto: string): string {
  if (!codigoFoto) return "";
  return `https://guiadevalores.fasecolda.com/Fotos/${codigoFoto}.png`;
}

// ── Helper: verificar si el token está configurado ────────────────────────────
export function isFasecoldaConfigured(): boolean {
  return !!process.env.FASECOLDA_TOKEN;
}
