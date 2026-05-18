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

// ─────────────────────────────────────────────────────────────────────
// Catálogo de vehículos de muestra (mercado colombiano 2024).
// Sustituir por DB real (Supabase) cuando esté lista.
// ─────────────────────────────────────────────────────────────────────
export const vehicles: Vehicle[] = [
  {
    id: "mazda-cx30-2023",
    titulo: "Mazda CX-30 Touring 2023",
    marca: "Mazda",
    modelo: "CX-30",
    año: 2023,
    precio: 92500000,
    precioFinanciado: 1980000,
    kilometraje: "28.000 km",
    transmision: "Automático",
    cilindros: "4",
    caballos: "186 HP",
    color: "Gris Polimetálico",
    combustible: "Gasolina",
    motor: "2.5L SkyActiv-G",
    descripcion: "SUV compacta en excelente estado, un solo dueño. Mantenimientos al día en concesionario Mazda, llantas en buen estado. Equipamiento Touring con techo solar, asientos en cuero y pantalla 8.8\".",
    rating: 5,
    fotos: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=80",
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1200&q=80",
    ],
    propietarios: [{ nombre: "Carlos Rivera", desde: 2023, hasta: 2025 }],
    siniestros: [],
    soat:          { vigente: true, hasta: "2026-03-15" },
    tecnomecanica: { vigente: true, hasta: "2026-08-20" },
    whatsapp: "573175737083",
    ciudad: "Bogotá",
    tipo: "SUV",
  },
  {
    id: "chevrolet-onix-2022",
    titulo: "Chevrolet Onix Premier 2022",
    marca: "Chevrolet",
    modelo: "Onix",
    año: 2022,
    precio: 56900000,
    precioFinanciado: 1230000,
    kilometraje: "42.500 km",
    transmision: "Automático",
    cilindros: "3",
    caballos: "116 HP",
    color: "Rojo Carmín",
    combustible: "Gasolina",
    motor: "1.0L Turbo",
    descripcion: "Sedán Onix Premier con todos los extras: pantalla MyLink 8\", cámara de reversa, aire acondicionado digital, sensores de parqueo, cruise control. Excelente rendimiento de combustible.",
    rating: 4,
    fotos: [
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200&q=80",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=80",
    ],
    propietarios: [{ nombre: "Andrea Gómez", desde: 2022, hasta: 2025 }],
    siniestros: [],
    soat:          { vigente: true, hasta: "2026-01-10" },
    tecnomecanica: { vigente: true, hasta: "2025-12-05" },
    whatsapp: "573175737083",
    ciudad: "Medellín",
    tipo: "Sedán",
  },
  {
    id: "renault-duster-2021",
    titulo: "Renault Duster Intens 2021",
    marca: "Renault",
    modelo: "Duster",
    año: 2021,
    precio: 64800000,
    precioFinanciado: 1410000,
    kilometraje: "65.300 km",
    transmision: "Manual",
    cilindros: "4",
    caballos: "115 HP",
    color: "Blanco Glaciar",
    combustible: "Gasolina",
    motor: "1.6L 16V",
    descripcion: "Duster Intens 4x2 ideal para ciudad y carretera. Mantenida en taller autorizado Renault. Llantas nuevas hace 8.000 km. Tapizado en perfecto estado, motor sin fugas. Lista para rodar.",
    rating: 4,
    fotos: [
      "https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=1200&q=80",
      "https://images.unsplash.com/photo-1612825173281-9a193378527e?w=1200&q=80",
    ],
    propietarios: [
      { nombre: "Luis Hernández",   desde: 2021, hasta: 2023 },
      { nombre: "Patricia Morales", desde: 2023, hasta: 2025 },
    ],
    siniestros: ["Rayón menor en puerta lateral derecha (2023, reparado)"],
    soat:          { vigente: true, hasta: "2026-05-22" },
    tecnomecanica: { vigente: true, hasta: "2026-02-18" },
    whatsapp: "573175737083",
    ciudad: "Cali",
    tipo: "SUV",
  },
  {
    id: "kia-picanto-2024",
    titulo: "Kia Picanto Vibrant 2024",
    marca: "Kia",
    modelo: "Picanto",
    año: 2024,
    precio: 49500000,
    precioFinanciado: 1075000,
    kilometraje: "12.800 km",
    transmision: "Manual",
    cilindros: "4",
    caballos: "84 HP",
    color: "Azul Sparkling",
    combustible: "Gasolina",
    motor: "1.25L Dual CVVT",
    descripcion: "Picanto Vibrant prácticamente nuevo. Único dueño, garantía Kia vigente hasta 2027. Económico de mantenimiento, ideal para movilidad urbana. Bluetooth, pantalla táctil, sensores traseros.",
    rating: 5,
    fotos: [
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&q=80",
      "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=1200&q=80",
    ],
    propietarios: [{ nombre: "Diana Castaño", desde: 2024, hasta: 2025 }],
    siniestros: [],
    soat:          { vigente: true, hasta: "2026-09-30" },
    tecnomecanica: { vigente: false, hasta: "Pendiente (vehículo nuevo, no requiere aún)" },
    whatsapp: "573175737083",
    ciudad: "Bogotá",
    tipo: "Hatchback",
  },
  {
    id: "toyota-corolla-cross-2023",
    titulo: "Toyota Corolla Cross XLI 2023",
    marca: "Toyota",
    modelo: "Corolla Cross",
    año: 2023,
    precio: 112900000,
    precioFinanciado: 2390000,
    kilometraje: "31.200 km",
    transmision: "Automático",
    cilindros: "4",
    caballos: "169 HP",
    color: "Plata Metálico",
    combustible: "Gasolina",
    motor: "2.0L Dynamic Force",
    descripcion: "SUV crossover con la calidad y durabilidad Toyota. Caja CVT suave, espacio amplio para 5 pasajeros, baúl de 487 litros. Toyota Safety Sense (alerta de colisión, control de crucero adaptativo, asistente de carril).",
    rating: 5,
    fotos: [
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=1200&q=80",
      "https://images.unsplash.com/photo-1617469767053-8f0498adfd74?w=1200&q=80",
    ],
    propietarios: [{ nombre: "Roberto Salazar", desde: 2023, hasta: 2025 }],
    siniestros: [],
    soat:          { vigente: true, hasta: "2026-07-14" },
    tecnomecanica: { vigente: true, hasta: "2026-06-08" },
    whatsapp: "573175737083",
    ciudad: "Barranquilla",
    tipo: "SUV",
  },
];


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
