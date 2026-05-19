export interface Owner {
  nombre: string;
  desde: number;
  hasta: number;
}

export interface Document {
  vigente: boolean;
  hasta: string;
}

export interface Vehicle {
  id: string;
  titulo: string;
  marca: string;
  modelo: string;
  año: number;
  precio: number;
  precioFinanciado?: number;
  kilometraje: string;
  transmision: string;
  cilindros: string;
  caballos: string;
  color: string;
  combustible: string;
  motor: string;
  descripcion: string;
  rating: number;
  fotos: string[];
  propietarios: Owner[];
  siniestros: string[];
  soat: Document;
  tecnomecanica: Document;
  whatsapp: string;
  ciudad: string;
  tipo: string;
  verificado_movel?: boolean;
  subasta?: {
    activa: boolean;
    precioBase: number;
    ofertaActual: number;
    totalOfertas: number;
    finEn: string; // ISO datetime string
  };
}

// Solo vehículos reales desde Supabase — no hay datos de muestra.
export const vehicles: Vehicle[] = [];


export function getVehicleById(id: string): Vehicle | undefined {
  return vehicles.find((v) => v.id === id);
}

export function getAuctionVehicles(): Vehicle[] {
  return vehicles.filter((v) => v.subasta?.activa);
}

export function formatCOP(amount: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
