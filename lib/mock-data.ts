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
  subasta?: {
    activa: boolean;
    precioBase: number;
    ofertaActual: number;
    totalOfertas: number;
    finEn: string; // ISO datetime string
  };
}

export const vehicles: Vehicle[] = [
  {
    id: "toyota-camry-2021",
    titulo: "Toyota Camry SE 2021",
    marca: "Toyota",
    modelo: "Camry",
    año: 2021,
    precio: 85000000,
    precioFinanciado: 1850000,
    kilometraje: "45,000 km",
    transmision: "Automático",
    cilindros: "4 Cil",
    caballos: "203 HP",
    color: "Plateado",
    combustible: "Gasolina",
    motor: "2.5L",
    descripcion:
      "Excelente estado, único dueño, full equipo. Carro de lujo con todas las características de confort y seguridad. Revisiones al día, sin choques ni siniestros.",
    rating: 5,
    ciudad: "Bogotá",
    tipo: "Sedán",
    fotos: [
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=1200&q=80",
      "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=1200&q=80",
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80",
    ],
    propietarios: [
      { nombre: "Daniela Ramírez", desde: 2018, hasta: 2020 },
      { nombre: "Carlos Mendoza", desde: 2020, hasta: 2022 },
      { nombre: "Sofía Vargas", desde: 2022, hasta: 2024 },
    ],
    siniestros: [],
    soat: { vigente: true, hasta: "2025-08-15" },
    tecnomecanica: { vigente: true, hasta: "2025-09-20" },
    whatsapp: "573175737083",
    subasta: {
      activa: true,
      precioBase: 75000000,
      ofertaActual: 82500000,
      totalOfertas: 14,
      finEn: new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
    },
  },
  {
    id: "mazda-cx5-2020",
    titulo: "Mazda CX-5 Grand Touring 2020",
    marca: "Mazda",
    modelo: "CX-5",
    año: 2020,
    precio: 92000000,
    precioFinanciado: 2100000,
    kilometraje: "38,500 km",
    transmision: "Automático",
    cilindros: "4 Cil",
    caballos: "187 HP",
    color: "Rojo Soul",
    combustible: "Gasolina",
    motor: "2.0L SKYACTIV",
    descripcion:
      "SUV en perfectas condiciones. Mantenimiento estricto con Mazda, carrocería sin rayones ni abolladuras. Equipado con techo panorámico, pantalla táctil y control de crucero.",
    rating: 4,
    ciudad: "Medellín",
    tipo: "SUV",
    fotos: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200&q=80",
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1200&q=80",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80",
      "https://images.unsplash.com/photo-1546614042-7df3c24c9e5d?w=1200&q=80",
    ],
    propietarios: [
      { nombre: "Andrés López", desde: 2020, hasta: 2023 },
      { nombre: "Valentina Torres", desde: 2023, hasta: 2024 },
    ],
    siniestros: [],
    soat: { vigente: true, hasta: "2025-11-30" },
    tecnomecanica: { vigente: false, hasta: "2024-06-15" },
    whatsapp: "573175737083",
  },
  {
    id: "chevrolet-spark-2018",
    titulo: "Chevrolet Spark GT 2018",
    marca: "Chevrolet",
    modelo: "Spark GT",
    año: 2018,
    precio: 32000000,
    precioFinanciado: 720000,
    kilometraje: "72,000 km",
    transmision: "Manual",
    cilindros: "4 Cil",
    caballos: "98 HP",
    color: "Blanco Summit",
    combustible: "Gasolina",
    motor: "1.4L",
    descripcion:
      "Económico y eficiente, ideal para movilizarse por la ciudad. Bajo consumo de combustible, fácil de parquear. Listo para rodar.",
    rating: 3,
    ciudad: "Cali",
    tipo: "Hatchback",
    fotos: [
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=1200&q=80",
      "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=80",
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1200&q=80",
    ],
    propietarios: [
      { nombre: "Miguel Herrera", desde: 2018, hasta: 2021 },
      { nombre: "Laura Gómez", desde: 2021, hasta: 2024 },
    ],
    siniestros: ["Colisión leve trasera - 2020"],
    soat: { vigente: false, hasta: "2024-03-10" },
    tecnomecanica: { vigente: true, hasta: "2025-07-05" },
    whatsapp: "573175737083",
  },
  {
    id: "kia-sportage-2022",
    titulo: "Kia Sportage EX 2022",
    marca: "Kia",
    modelo: "Sportage",
    año: 2022,
    precio: 108000000,
    precioFinanciado: 2450000,
    kilometraje: "22,000 km",
    transmision: "Automático",
    cilindros: "4 Cil",
    caballos: "175 HP",
    color: "Gris Gravity",
    combustible: "Gasolina",
    motor: "2.0L MPI",
    descripcion:
      "SUV de última generación, casi nuevo. Tecnología de punta, asientos de cuero calefaccionados, cámara 360° y todos los sistemas de seguridad activa.",
    rating: 5,
    ciudad: "Bogotá",
    tipo: "SUV",
    fotos: [
      "https://images.unsplash.com/photo-1617469767053-8f0498adfd74?w=1200&q=80",
      "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=1200&q=80",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1200&q=80",
    ],
    propietarios: [{ nombre: "Ricardo Pinto", desde: 2022, hasta: 2024 }],
    siniestros: [],
    soat: { vigente: true, hasta: "2026-01-10" },
    tecnomecanica: { vigente: true, hasta: "2026-03-15" },
    whatsapp: "573175737083",
    subasta: {
      activa: true,
      precioBase: 95000000,
      ofertaActual: 104000000,
      totalOfertas: 8,
      finEn: new Date(Date.now() + 5 * 3600 * 1000).toISOString(),
    },
  },
  {
    id: "renault-logan-2019",
    titulo: "Renault Logan Intens 2019",
    marca: "Renault",
    modelo: "Logan",
    año: 2019,
    precio: 38500000,
    precioFinanciado: 870000,
    kilometraje: "58,000 km",
    transmision: "Manual",
    cilindros: "4 Cil",
    caballos: "116 HP",
    color: "Azul Artic",
    combustible: "Gasolina",
    motor: "1.6L",
    descripcion:
      "Sedán confiable y espacioso. Excelente opción para familia. Mantenimiento preventivo al día, sin novedades mecánicas.",
    rating: 4,
    ciudad: "Barranquilla",
    tipo: "Sedán",
    fotos: [
      "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=1200&q=80",
      "https://images.unsplash.com/photo-1549399542-7d3b9e8c4e42?w=1200&q=80",
    ],
    propietarios: [
      { nombre: "Patricia Moreno", desde: 2019, hasta: 2022 },
      { nombre: "Julio Castillo", desde: 2022, hasta: 2024 },
    ],
    siniestros: [],
    soat: { vigente: true, hasta: "2025-12-20" },
    tecnomecanica: { vigente: true, hasta: "2025-10-08" },
    whatsapp: "573175737083",
  },
  {
    id: "hyundai-tucson-2021",
    titulo: "Hyundai Tucson GL 2021",
    marca: "Hyundai",
    modelo: "Tucson",
    año: 2021,
    precio: 95000000,
    precioFinanciado: 2150000,
    kilometraje: "31,000 km",
    transmision: "Automático",
    cilindros: "4 Cil",
    caballos: "150 HP",
    color: "Negro Phantom",
    combustible: "Gasolina",
    motor: "2.0L Nu",
    descripcion:
      "SUV premium en impecable estado. Un solo dueño, llaves de repuesto, kit de herramientas original. Con todos los extras de fábrica.",
    rating: 4,
    ciudad: "Medellín",
    tipo: "SUV",
    fotos: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200&q=80",
      "https://images.unsplash.com/photo-1619976215249-e4e5e5055d73?w=1200&q=80",
      "https://images.unsplash.com/photo-1617469767053-8f0498adfd74?w=1200&q=80",
    ],
    propietarios: [{ nombre: "Camila Ríos", desde: 2021, hasta: 2024 }],
    siniestros: [],
    soat: { vigente: true, hasta: "2025-09-05" },
    tecnomecanica: { vigente: true, hasta: "2025-11-22" },
    whatsapp: "573175737083",
    subasta: {
      activa: true,
      precioBase: 82000000,
      ofertaActual: 91000000,
      totalOfertas: 21,
      finEn: new Date(Date.now() + 26 * 3600 * 1000).toISOString(),
    },
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
