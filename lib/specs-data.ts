// Base de datos técnica de vehículos disponibles en Colombia
// Fuentes: Fasecolda, fichas técnicas de fabricantes, datos homologados MinTransporte

export interface EspecificacionesTecnicas {
  motor: string;
  cilindrada: string;
  cilindros: string;
  potencia: string;
  torque: string;
  combustible: string;
  transmision: string;
  traccion: string;
  carroceria: string;
  puertas: number;
  pasajeros: number;
  frenos: string;
  consumo?: string;
  aceleracion?: string;
  velocidadMax?: string;
  normaEmision?: string;
}

export interface ModeloSpecs {
  [version: string]: EspecificacionesTecnicas;
}

export interface MarcaSpecs {
  [modelo: string]: ModeloSpecs;
}

export const especificaciones: Record<string, MarcaSpecs> = {
  Chevrolet: {
    Spark: {
      "Base 1.2": { motor: "4 cil DOHC", cilindrada: "1.199 cc", cilindros: "4", potencia: "82 HP / 6.000 rpm", torque: "106 Nm / 4.400 rpm", combustible: "Gasolina", transmision: "Manual 5 vel", traccion: "FWD", carroceria: "Hatchback", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Tambores traseros", consumo: "6.4 L/100km", normaEmision: "Euro 5" },
      "GT 1.4": { motor: "4 cil DOHC", cilindrada: "1.398 cc", cilindros: "4", potencia: "98 HP / 6.200 rpm", torque: "128 Nm / 4.200 rpm", combustible: "Gasolina", transmision: "Manual 5 vel", traccion: "FWD", carroceria: "Hatchback", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Tambores traseros", consumo: "6.8 L/100km", normaEmision: "Euro 5" },
    },
    Onix: {
      "LT 1.0 Turbo": { motor: "3 cil Turbo DOHC", cilindrada: "999 cc", cilindros: "3", potencia: "100 HP / 5.500 rpm", torque: "168 Nm / 1.800 rpm", combustible: "Gasolina", transmision: "Manual 6 vel", traccion: "FWD", carroceria: "Hatchback", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Tambores traseros", consumo: "5.9 L/100km", aceleracion: "10.5 s", normaEmision: "Euro 5" },
      "Premier 1.0 Turbo AT": { motor: "3 cil Turbo DOHC", cilindrada: "999 cc", cilindros: "3", potencia: "100 HP / 5.500 rpm", torque: "168 Nm / 1.800 rpm", combustible: "Gasolina", transmision: "Automática CVT", traccion: "FWD", carroceria: "Hatchback", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Tambores traseros", consumo: "6.2 L/100km", normaEmision: "Euro 5" },
    },
    Tracker: {
      "LT 1.2 Turbo": { motor: "3 cil Turbo DOHC", cilindrada: "1.199 cc", cilindros: "3", potencia: "133 HP / 5.500 rpm", torque: "220 Nm / 2.000 rpm", combustible: "Gasolina", transmision: "Automática CVT", traccion: "FWD", carroceria: "SUV", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Discos traseros", consumo: "6.6 L/100km", aceleracion: "9.8 s", normaEmision: "Euro 5" },
      "Premier 1.2 Turbo AWD": { motor: "3 cil Turbo DOHC", cilindrada: "1.199 cc", cilindros: "3", potencia: "133 HP / 5.500 rpm", torque: "220 Nm / 2.000 rpm", combustible: "Gasolina", transmision: "Automática 9 vel", traccion: "AWD", carroceria: "SUV", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Discos traseros", consumo: "7.1 L/100km", normaEmision: "Euro 5" },
    },
    Captiva: {
      "LT 1.5 Turbo": { motor: "4 cil Turbo DOHC", cilindrada: "1.451 cc", cilindros: "4", potencia: "163 HP / 5.600 rpm", torque: "230 Nm / 2.000 rpm", combustible: "Gasolina", transmision: "Manual 6 vel", traccion: "FWD", carroceria: "SUV", puertas: 5, pasajeros: 7, frenos: "Discos delanteros / Discos traseros", consumo: "7.5 L/100km", normaEmision: "Euro 5" },
      "Premier 1.5 Turbo AT": { motor: "4 cil Turbo DOHC", cilindrada: "1.451 cc", cilindros: "4", potencia: "163 HP / 5.600 rpm", torque: "230 Nm / 2.000 rpm", combustible: "Gasolina", transmision: "Automática 6 vel", traccion: "FWD", carroceria: "SUV", puertas: 5, pasajeros: 7, frenos: "Discos delanteros / Discos traseros", consumo: "7.8 L/100km", normaEmision: "Euro 5" },
    },
  },

  Renault: {
    Kwid: {
      "Zen 1.0": { motor: "3 cil DOHC", cilindrada: "999 cc", cilindros: "3", potencia: "68 HP / 5.500 rpm", torque: "91 Nm / 4.250 rpm", combustible: "Gasolina", transmision: "Manual 5 vel", traccion: "FWD", carroceria: "Hatchback", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Tambores traseros", consumo: "5.4 L/100km", normaEmision: "Euro 5" },
      "Iconic 1.0 AMT": { motor: "3 cil DOHC", cilindrada: "999 cc", cilindros: "3", potencia: "68 HP / 5.500 rpm", torque: "91 Nm / 4.250 rpm", combustible: "Gasolina", transmision: "Automática AMT 5 vel", traccion: "FWD", carroceria: "Hatchback", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Tambores traseros", consumo: "5.6 L/100km", normaEmision: "Euro 5" },
    },
    Logan: {
      "Zen 1.6": { motor: "4 cil DOHC", cilindrada: "1.598 cc", cilindros: "4", potencia: "114 HP / 5.750 rpm", torque: "148 Nm / 4.000 rpm", combustible: "Gasolina", transmision: "Manual 5 vel", traccion: "FWD", carroceria: "Sedán", puertas: 4, pasajeros: 5, frenos: "Discos delanteros / Tambores traseros", consumo: "7.5 L/100km", normaEmision: "Euro 5" },
      "Intens 1.6": { motor: "4 cil DOHC", cilindrada: "1.598 cc", cilindros: "4", potencia: "114 HP / 5.750 rpm", torque: "148 Nm / 4.000 rpm", combustible: "Gasolina", transmision: "Automática CVT", traccion: "FWD", carroceria: "Sedán", puertas: 4, pasajeros: 5, frenos: "Discos delanteros / Tambores traseros", consumo: "7.8 L/100km", normaEmision: "Euro 5" },
    },
    Duster: {
      "Expression 1.6": { motor: "4 cil DOHC", cilindrada: "1.598 cc", cilindros: "4", potencia: "114 HP / 5.750 rpm", torque: "148 Nm / 4.000 rpm", combustible: "Gasolina", transmision: "Manual 6 vel", traccion: "FWD", carroceria: "SUV", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Tambores traseros", consumo: "8.2 L/100km", normaEmision: "Euro 5" },
      "Zen 2.0 4x4": { motor: "4 cil DOHC", cilindrada: "1.998 cc", cilindros: "4", potencia: "143 HP / 5.500 rpm", torque: "190 Nm / 3.750 rpm", combustible: "Gasolina", transmision: "Manual 6 vel", traccion: "4WD", carroceria: "SUV", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Tambores traseros", consumo: "9.4 L/100km", normaEmision: "Euro 5" },
    },
    Captur: {
      "Zen 1.3 Turbo": { motor: "4 cil Turbo DOHC", cilindrada: "1.332 cc", cilindros: "4", potencia: "140 HP / 5.500 rpm", torque: "240 Nm / 1.700 rpm", combustible: "Gasolina", transmision: "Automática EDC 7 vel", traccion: "FWD", carroceria: "SUV", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Discos traseros", consumo: "6.5 L/100km", normaEmision: "Euro 5" },
      "Intens 1.3 Turbo": { motor: "4 cil Turbo DOHC", cilindrada: "1.332 cc", cilindros: "4", potencia: "155 HP / 5.500 rpm", torque: "270 Nm / 1.700 rpm", combustible: "Gasolina", transmision: "Automática EDC 7 vel", traccion: "FWD", carroceria: "SUV", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Discos traseros", consumo: "6.8 L/100km", normaEmision: "Euro 5" },
    },
  },

  Toyota: {
    Corolla: {
      "GLi 1.8": { motor: "4 cil DOHC Dual VVT-i", cilindrada: "1.798 cc", cilindros: "4", potencia: "139 HP / 6.400 rpm", torque: "172 Nm / 4.000 rpm", combustible: "Gasolina", transmision: "Automática CVT", traccion: "FWD", carroceria: "Sedán", puertas: 4, pasajeros: 5, frenos: "Discos delanteros / Discos traseros", consumo: "7.0 L/100km", aceleracion: "9.2 s", normaEmision: "Euro 5" },
      "XEi 2.0": { motor: "4 cil DOHC Dual VVT-i", cilindrada: "1.987 cc", cilindros: "4", potencia: "170 HP / 6.600 rpm", torque: "200 Nm / 4.400 rpm", combustible: "Gasolina", transmision: "Automática CVT", traccion: "FWD", carroceria: "Sedán", puertas: 4, pasajeros: 5, frenos: "Discos delanteros / Discos traseros", consumo: "7.4 L/100km", aceleracion: "8.1 s", normaEmision: "Euro 5" },
    },
    RAV4: {
      "XLE 2.5 Híbrido": { motor: "4 cil DOHC + 2 motores eléctricos", cilindrada: "2.487 cc", cilindros: "4", potencia: "219 HP (sistema)", torque: "221 Nm", combustible: "Híbrido", transmision: "E-CVT", traccion: "AWD-i", carroceria: "SUV", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Discos traseros", consumo: "5.0 L/100km", aceleracion: "8.1 s", normaEmision: "Euro 6" },
      "Limited 2.5": { motor: "4 cil DOHC VVT-i", cilindrada: "2.487 cc", cilindros: "4", potencia: "203 HP / 6.600 rpm", torque: "243 Nm / 5.200 rpm", combustible: "Gasolina", transmision: "Automática 8 vel", traccion: "AWD", carroceria: "SUV", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Discos traseros", consumo: "8.5 L/100km", normaEmision: "Euro 5" },
    },
    Hilux: {
      "SR 2.4 Diesel 4x2": { motor: "4 cil Turbo Diésel DOHC", cilindrada: "2.393 cc", cilindros: "4", potencia: "150 HP / 3.400 rpm", torque: "400 Nm / 1.600 rpm", combustible: "Diésel", transmision: "Manual 6 vel", traccion: "4x2", carroceria: "Camioneta", puertas: 4, pasajeros: 5, frenos: "Discos delanteros / Tambores traseros", consumo: "8.4 L/100km", normaEmision: "Euro 5" },
      "SRV 2.8 Diesel 4x4 AT": { motor: "4 cil Turbo Diésel DOHC", cilindrada: "2.755 cc", cilindros: "4", potencia: "204 HP / 3.400 rpm", torque: "500 Nm / 1.600 rpm", combustible: "Diésel", transmision: "Automática 6 vel", traccion: "4x4", carroceria: "Camioneta", puertas: 4, pasajeros: 5, frenos: "Discos delanteros / Discos traseros", consumo: "9.1 L/100km", normaEmision: "Euro 5" },
    },
    Fortuner: {
      "SRV 2.7 4x2 AT": { motor: "4 cil DOHC VVT-i", cilindrada: "2.693 cc", cilindros: "4", potencia: "166 HP / 5.200 rpm", torque: "245 Nm / 3.800 rpm", combustible: "Gasolina", transmision: "Automática 6 vel", traccion: "4x2", carroceria: "SUV", puertas: 5, pasajeros: 7, frenos: "Discos delanteros / Discos traseros", consumo: "10.5 L/100km", normaEmision: "Euro 5" },
      "SR5 2.8 Diesel 4x4 AT": { motor: "4 cil Turbo Diésel DOHC", cilindrada: "2.755 cc", cilindros: "4", potencia: "204 HP / 3.400 rpm", torque: "500 Nm / 1.600 rpm", combustible: "Diésel", transmision: "Automática 6 vel", traccion: "4x4", carroceria: "SUV", puertas: 5, pasajeros: 7, frenos: "Discos delanteros / Discos traseros", consumo: "9.4 L/100km", normaEmision: "Euro 5" },
    },
    Camry: {
      "SE 2.5": { motor: "4 cil DOHC Dual VVT-i", cilindrada: "2.487 cc", cilindros: "4", potencia: "203 HP / 6.600 rpm", torque: "243 Nm / 5.200 rpm", combustible: "Gasolina", transmision: "Automática 8 vel", traccion: "FWD", carroceria: "Sedán", puertas: 4, pasajeros: 5, frenos: "Discos delanteros / Discos traseros", consumo: "7.7 L/100km", aceleracion: "7.6 s", normaEmision: "Euro 5" },
      "XSE 2.5 Híbrido": { motor: "4 cil DOHC + motor eléctrico", cilindrada: "2.487 cc", cilindros: "4", potencia: "215 HP (sistema)", torque: "221 Nm", combustible: "Híbrido", transmision: "E-CVT", traccion: "FWD", carroceria: "Sedán", puertas: 4, pasajeros: 5, frenos: "Discos delanteros / Discos traseros", consumo: "5.5 L/100km", normaEmision: "Euro 6" },
    },
  },

  Kia: {
    Picanto: {
      "EX 1.2": { motor: "4 cil DOHC MPI", cilindrada: "1.248 cc", cilindros: "4", potencia: "84 HP / 6.000 rpm", torque: "122 Nm / 4.000 rpm", combustible: "Gasolina", transmision: "Manual 5 vel", traccion: "FWD", carroceria: "Hatchback", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Tambores traseros", consumo: "5.9 L/100km", normaEmision: "Euro 5" },
      "GT Line 1.2 AT": { motor: "4 cil DOHC MPI", cilindrada: "1.248 cc", cilindros: "4", potencia: "84 HP / 6.000 rpm", torque: "122 Nm / 4.000 rpm", combustible: "Gasolina", transmision: "Automática 4 vel", traccion: "FWD", carroceria: "Hatchback", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Tambores traseros", consumo: "6.3 L/100km", normaEmision: "Euro 5" },
    },
    Sportage: {
      "LX 2.0": { motor: "4 cil DOHC MPI", cilindrada: "1.998 cc", cilindros: "4", potencia: "150 HP / 6.200 rpm", torque: "191 Nm / 4.000 rpm", combustible: "Gasolina", transmision: "Manual 6 vel", traccion: "FWD", carroceria: "SUV", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Discos traseros", consumo: "8.6 L/100km", normaEmision: "Euro 5" },
      "EX 2.0 AT": { motor: "4 cil DOHC MPI", cilindrada: "1.998 cc", cilindros: "4", potencia: "150 HP / 6.200 rpm", torque: "191 Nm / 4.000 rpm", combustible: "Gasolina", transmision: "Automática 6 vel", traccion: "FWD", carroceria: "SUV", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Discos traseros", consumo: "9.0 L/100km", normaEmision: "Euro 5" },
      "GT Line 1.6 T-GDI": { motor: "4 cil Turbo GDI DOHC", cilindrada: "1.591 cc", cilindros: "4", potencia: "177 HP / 5.500 rpm", torque: "265 Nm / 1.500 rpm", combustible: "Gasolina", transmision: "Automática DCT 7 vel", traccion: "AWD", carroceria: "SUV", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Discos traseros", consumo: "8.2 L/100km", aceleracion: "8.5 s", normaEmision: "Euro 5" },
    },
    Sorento: {
      "EX 2.0 T-GDI": { motor: "4 cil Turbo GDI DOHC", cilindrada: "1.998 cc", cilindros: "4", potencia: "237 HP / 6.000 rpm", torque: "353 Nm / 1.400 rpm", combustible: "Gasolina", transmision: "Automática 8 vel", traccion: "AWD", carroceria: "SUV", puertas: 5, pasajeros: 7, frenos: "Discos delanteros / Discos traseros", consumo: "9.2 L/100km", normaEmision: "Euro 5" },
    },
    Carnival: {
      "EX 3.5 V6": { motor: "V6 DOHC MPI", cilindrada: "3.470 cc", cilindros: "6", potencia: "294 HP / 6.400 rpm", torque: "355 Nm / 5.200 rpm", combustible: "Gasolina", transmision: "Automática 8 vel", traccion: "FWD", carroceria: "Minivan", puertas: 5, pasajeros: 8, frenos: "Discos delanteros / Discos traseros", consumo: "10.8 L/100km", normaEmision: "Euro 5" },
    },
  },

  Hyundai: {
    "Grand i10": {
      "GL 1.2": { motor: "4 cil DOHC MPI", cilindrada: "1.197 cc", cilindros: "4", potencia: "87 HP / 6.000 rpm", torque: "120 Nm / 4.000 rpm", combustible: "Gasolina", transmision: "Manual 5 vel", traccion: "FWD", carroceria: "Hatchback", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Tambores traseros", consumo: "5.8 L/100km", normaEmision: "Euro 5" },
      "GLS 1.2 AT": { motor: "4 cil DOHC MPI", cilindrada: "1.197 cc", cilindros: "4", potencia: "87 HP / 6.000 rpm", torque: "120 Nm / 4.000 rpm", combustible: "Gasolina", transmision: "Automática 4 vel", traccion: "FWD", carroceria: "Hatchback", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Tambores traseros", consumo: "6.2 L/100km", normaEmision: "Euro 5" },
    },
    Accent: {
      "GL 1.6": { motor: "4 cil DOHC MPI", cilindrada: "1.591 cc", cilindros: "4", potencia: "123 HP / 6.300 rpm", torque: "154 Nm / 4.850 rpm", combustible: "Gasolina", transmision: "Manual 6 vel", traccion: "FWD", carroceria: "Sedán", puertas: 4, pasajeros: 5, frenos: "Discos delanteros / Tambores traseros", consumo: "7.2 L/100km", normaEmision: "Euro 5" },
      "GLS 1.6 AT": { motor: "4 cil DOHC MPI", cilindrada: "1.591 cc", cilindros: "4", potencia: "123 HP / 6.300 rpm", torque: "154 Nm / 4.850 rpm", combustible: "Gasolina", transmision: "Automática 6 vel", traccion: "FWD", carroceria: "Sedán", puertas: 4, pasajeros: 5, frenos: "Discos delanteros / Tambores traseros", consumo: "7.6 L/100km", normaEmision: "Euro 5" },
    },
    Tucson: {
      "GL 2.0": { motor: "4 cil DOHC MPI Nu", cilindrada: "1.998 cc", cilindros: "4", potencia: "155 HP / 6.200 rpm", torque: "196 Nm / 4.000 rpm", combustible: "Gasolina", transmision: "Manual 6 vel", traccion: "FWD", carroceria: "SUV", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Discos traseros", consumo: "9.0 L/100km", normaEmision: "Euro 5" },
      "GLS 2.0 AT": { motor: "4 cil DOHC MPI Nu", cilindrada: "1.998 cc", cilindros: "4", potencia: "155 HP / 6.200 rpm", torque: "196 Nm / 4.000 rpm", combustible: "Gasolina", transmision: "Automática 6 vel", traccion: "FWD", carroceria: "SUV", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Discos traseros", consumo: "9.4 L/100km", normaEmision: "Euro 5" },
    },
    "Santa Fe": {
      "GLS 2.4": { motor: "4 cil DOHC Theta II", cilindrada: "2.359 cc", cilindros: "4", potencia: "188 HP / 6.000 rpm", torque: "241 Nm / 4.000 rpm", combustible: "Gasolina", transmision: "Automática 6 vel", traccion: "AWD", carroceria: "SUV", puertas: 5, pasajeros: 7, frenos: "Discos delanteros / Discos traseros", consumo: "10.3 L/100km", normaEmision: "Euro 5" },
    },
    Creta: {
      "Premium 1.5": { motor: "4 cil DOHC MPI", cilindrada: "1.497 cc", cilindros: "4", potencia: "115 HP / 6.300 rpm", torque: "144 Nm / 4.500 rpm", combustible: "Gasolina", transmision: "Manual 6 vel", traccion: "FWD", carroceria: "SUV", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Tambores traseros", consumo: "7.5 L/100km", normaEmision: "Euro 5" },
      "Limited 1.5 AT": { motor: "4 cil DOHC MPI", cilindrada: "1.497 cc", cilindros: "4", potencia: "115 HP / 6.300 rpm", torque: "144 Nm / 4.500 rpm", combustible: "Gasolina", transmision: "Automática CVT", traccion: "FWD", carroceria: "SUV", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Tambores traseros", consumo: "7.9 L/100km", normaEmision: "Euro 5" },
    },
  },

  Mazda: {
    Mazda3: {
      "Touring 2.0": { motor: "4 cil SKYACTIV-G DOHC", cilindrada: "1.998 cc", cilindros: "4", potencia: "155 HP / 6.000 rpm", torque: "200 Nm / 4.000 rpm", combustible: "Gasolina", transmision: "Manual 6 vel", traccion: "FWD", carroceria: "Hatchback", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Discos traseros", consumo: "7.1 L/100km", normaEmision: "Euro 5" },
      "Grand Touring 2.5 AT": { motor: "4 cil SKYACTIV-G DOHC", cilindrada: "2.488 cc", cilindros: "4", potencia: "186 HP / 6.000 rpm", torque: "252 Nm / 3.000 rpm", combustible: "Gasolina", transmision: "Automática 6 vel", traccion: "FWD", carroceria: "Hatchback", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Discos traseros", consumo: "7.8 L/100km", normaEmision: "Euro 5" },
    },
    "CX-5": {
      "Touring 2.0": { motor: "4 cil SKYACTIV-G DOHC", cilindrada: "1.998 cc", cilindros: "4", potencia: "155 HP / 6.000 rpm", torque: "200 Nm / 4.000 rpm", combustible: "Gasolina", transmision: "Manual 6 vel", traccion: "FWD", carroceria: "SUV", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Discos traseros", consumo: "7.6 L/100km", normaEmision: "Euro 5" },
      "Grand Touring 2.5 AWD": { motor: "4 cil SKYACTIV-G DOHC", cilindrada: "2.488 cc", cilindros: "4", potencia: "186 HP / 6.000 rpm", torque: "252 Nm / 3.000 rpm", combustible: "Gasolina", transmision: "Automática 6 vel", traccion: "AWD", carroceria: "SUV", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Discos traseros", consumo: "8.6 L/100km", normaEmision: "Euro 5" },
      "Grand Touring 2.5T AWD": { motor: "4 cil SKYACTIV-G Turbo DOHC", cilindrada: "2.488 cc", cilindros: "4", potencia: "256 HP / 5.000 rpm", torque: "420 Nm / 2.000 rpm", combustible: "Gasolina", transmision: "Automática 6 vel", traccion: "AWD", carroceria: "SUV", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Discos traseros", consumo: "9.1 L/100km", aceleracion: "7.0 s", normaEmision: "Euro 5" },
    },
    "CX-30": {
      "Touring 2.0": { motor: "4 cil SKYACTIV-G DOHC", cilindrada: "1.998 cc", cilindros: "4", potencia: "155 HP / 6.000 rpm", torque: "200 Nm / 4.000 rpm", combustible: "Gasolina", transmision: "Manual 6 vel", traccion: "FWD", carroceria: "SUV", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Discos traseros", consumo: "7.3 L/100km", normaEmision: "Euro 5" },
      "Grand Touring 2.0 AT": { motor: "4 cil SKYACTIV-G DOHC", cilindrada: "1.998 cc", cilindros: "4", potencia: "155 HP / 6.000 rpm", torque: "200 Nm / 4.000 rpm", combustible: "Gasolina", transmision: "Automática 6 vel", traccion: "FWD", carroceria: "SUV", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Discos traseros", consumo: "7.8 L/100km", normaEmision: "Euro 5" },
    },
  },

  Nissan: {
    Kicks: {
      "Sense 1.6": { motor: "4 cil DOHC MPI", cilindrada: "1.598 cc", cilindros: "4", potencia: "116 HP / 6.000 rpm", torque: "160 Nm / 4.000 rpm", combustible: "Gasolina", transmision: "Manual 5 vel", traccion: "FWD", carroceria: "SUV", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Tambores traseros", consumo: "7.5 L/100km", normaEmision: "Euro 5" },
      "Advance 1.6 AT": { motor: "4 cil DOHC MPI", cilindrada: "1.598 cc", cilindros: "4", potencia: "116 HP / 6.000 rpm", torque: "160 Nm / 4.000 rpm", combustible: "Gasolina", transmision: "Automática CVT", traccion: "FWD", carroceria: "SUV", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Tambores traseros", consumo: "8.0 L/100km", normaEmision: "Euro 5" },
    },
    Versa: {
      "Sense 1.6": { motor: "4 cil DOHC MPI", cilindrada: "1.598 cc", cilindros: "4", potencia: "114 HP / 5.600 rpm", torque: "155 Nm / 4.000 rpm", combustible: "Gasolina", transmision: "Manual 5 vel", traccion: "FWD", carroceria: "Sedán", puertas: 4, pasajeros: 5, frenos: "Discos delanteros / Tambores traseros", consumo: "7.4 L/100km", normaEmision: "Euro 5" },
      "Advance 1.6 AT": { motor: "4 cil DOHC MPI", cilindrada: "1.598 cc", cilindros: "4", potencia: "114 HP / 5.600 rpm", torque: "155 Nm / 4.000 rpm", combustible: "Gasolina", transmision: "Automática CVT", traccion: "FWD", carroceria: "Sedán", puertas: 4, pasajeros: 5, frenos: "Discos delanteros / Tambores traseros", consumo: "7.9 L/100km", normaEmision: "Euro 5" },
    },
    "X-Trail": {
      "Sense 2.5": { motor: "4 cil DOHC MPI", cilindrada: "2.488 cc", cilindros: "4", potencia: "170 HP / 6.000 rpm", torque: "233 Nm / 4.400 rpm", combustible: "Gasolina", transmision: "Manual 6 vel", traccion: "FWD", carroceria: "SUV", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Discos traseros", consumo: "9.5 L/100km", normaEmision: "Euro 5" },
      "Advance 2.5 AT AWD": { motor: "4 cil DOHC MPI", cilindrada: "2.488 cc", cilindros: "4", potencia: "170 HP / 6.000 rpm", torque: "233 Nm / 4.400 rpm", combustible: "Gasolina", transmision: "Automática CVT", traccion: "AWD", carroceria: "SUV", puertas: 5, pasajeros: 7, frenos: "Discos delanteros / Discos traseros", consumo: "10.3 L/100km", normaEmision: "Euro 5" },
    },
  },

  Ford: {
    EcoSport: {
      "SE 1.5 Freestyle": { motor: "3 cil EcoBoost Turbo", cilindrada: "1.497 cc", cilindros: "3", potencia: "121 HP / 6.000 rpm", torque: "170 Nm / 2.500 rpm", combustible: "Gasolina", transmision: "Manual 5 vel", traccion: "FWD", carroceria: "SUV", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Tambores traseros", consumo: "7.8 L/100km", normaEmision: "Euro 5" },
      "SE 2.0 AT": { motor: "4 cil Duratec Ti-VCT DOHC", cilindrada: "1.999 cc", cilindros: "4", potencia: "170 HP / 6.500 rpm", torque: "196 Nm / 4.500 rpm", combustible: "Gasolina", transmision: "Automática 6 vel", traccion: "4WD", carroceria: "SUV", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Discos traseros", consumo: "9.6 L/100km", normaEmision: "Euro 5" },
    },
    Escape: {
      "SE 1.5 EcoBoost": { motor: "3 cil EcoBoost Turbo DOHC", cilindrada: "1.497 cc", cilindros: "3", potencia: "180 HP / 6.000 rpm", torque: "240 Nm / 1.500 rpm", combustible: "Gasolina", transmision: "Automática 8 vel", traccion: "FWD", carroceria: "SUV", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Discos traseros", consumo: "8.0 L/100km", normaEmision: "Euro 5" },
    },
    Ranger: {
      "XL 2.2 Diésel 4x4": { motor: "4 cil Turbo Diésel DOHC", cilindrada: "2.198 cc", cilindros: "4", potencia: "160 HP / 3.200 rpm", torque: "385 Nm / 1.500 rpm", combustible: "Diésel", transmision: "Manual 6 vel", traccion: "4x4", carroceria: "Camioneta", puertas: 4, pasajeros: 5, frenos: "Discos delanteros / Tambores traseros", consumo: "8.6 L/100km", normaEmision: "Euro 5" },
      "XLT 3.2 Diésel 4x4 AT": { motor: "5 cil Turbo Diésel DOHC", cilindrada: "3.198 cc", cilindros: "5", potencia: "200 HP / 3.000 rpm", torque: "470 Nm / 1.750 rpm", combustible: "Diésel", transmision: "Automática 6 vel", traccion: "4x4", carroceria: "Camioneta", puertas: 4, pasajeros: 5, frenos: "Discos delanteros / Discos traseros", consumo: "9.5 L/100km", normaEmision: "Euro 5" },
    },
  },

  Mitsubishi: {
    "Eclipse Cross": {
      "GS-S 1.5 Turbo": { motor: "4 cil MIVEC Turbo DOHC", cilindrada: "1.499 cc", cilindros: "4", potencia: "150 HP / 5.500 rpm", torque: "250 Nm / 2.000 rpm", combustible: "Gasolina", transmision: "Automática CVT 8 vel", traccion: "4WD", carroceria: "SUV", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Discos traseros", consumo: "8.5 L/100km", normaEmision: "Euro 5" },
    },
    Outlander: {
      "GS5 2.4": { motor: "4 cil MIVEC DOHC", cilindrada: "2.360 cc", cilindros: "4", potencia: "169 HP / 6.000 rpm", torque: "222 Nm / 4.200 rpm", combustible: "Gasolina", transmision: "Automática CVT", traccion: "4WD", carroceria: "SUV", puertas: 5, pasajeros: 7, frenos: "Discos delanteros / Discos traseros", consumo: "9.5 L/100km", normaEmision: "Euro 5" },
    },
    L200: {
      "GLX 2.4 Diésel 4x2": { motor: "4 cil Turbo Diésel DOHC", cilindrada: "2.442 cc", cilindros: "4", potencia: "154 HP / 3.500 rpm", torque: "380 Nm / 2.500 rpm", combustible: "Diésel", transmision: "Manual 6 vel", traccion: "4x2", carroceria: "Camioneta", puertas: 4, pasajeros: 5, frenos: "Discos delanteros / Tambores traseros", consumo: "8.8 L/100km", normaEmision: "Euro 5" },
      "GLS 2.4 Diésel 4x4 AT": { motor: "4 cil Turbo Diésel DOHC", cilindrada: "2.442 cc", cilindros: "4", potencia: "181 HP / 3.500 rpm", torque: "430 Nm / 2.500 rpm", combustible: "Diésel", transmision: "Automática 6 vel", traccion: "4x4", carroceria: "Camioneta", puertas: 4, pasajeros: 5, frenos: "Discos delanteros / Discos traseros", consumo: "9.5 L/100km", normaEmision: "Euro 5" },
    },
  },

  Honda: {
    City: {
      "EX 1.5": { motor: "4 cil DOHC i-VTEC", cilindrada: "1.498 cc", cilindros: "4", potencia: "121 HP / 6.600 rpm", torque: "145 Nm / 4.600 rpm", combustible: "Gasolina", transmision: "Manual 6 vel", traccion: "FWD", carroceria: "Sedán", puertas: 4, pasajeros: 5, frenos: "Discos delanteros / Tambores traseros", consumo: "6.9 L/100km", normaEmision: "Euro 5" },
      "EXL 1.5 AT": { motor: "4 cil DOHC i-VTEC", cilindrada: "1.498 cc", cilindros: "4", potencia: "121 HP / 6.600 rpm", torque: "145 Nm / 4.600 rpm", combustible: "Gasolina", transmision: "Automática CVT", traccion: "FWD", carroceria: "Sedán", puertas: 4, pasajeros: 5, frenos: "Discos delanteros / Tambores traseros", consumo: "7.2 L/100km", normaEmision: "Euro 5" },
    },
    "HR-V": {
      "LX 1.8": { motor: "4 cil SOHC i-VTEC", cilindrada: "1.799 cc", cilindros: "4", potencia: "140 HP / 6.500 rpm", torque: "170 Nm / 4.600 rpm", combustible: "Gasolina", transmision: "Manual 6 vel", traccion: "FWD", carroceria: "SUV", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Tambores traseros", consumo: "8.3 L/100km", normaEmision: "Euro 5" },
      "EX 1.8 AT": { motor: "4 cil SOHC i-VTEC", cilindrada: "1.799 cc", cilindros: "4", potencia: "140 HP / 6.500 rpm", torque: "170 Nm / 4.600 rpm", combustible: "Gasolina", transmision: "Automática CVT", traccion: "FWD", carroceria: "SUV", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Tambores traseros", consumo: "8.7 L/100km", normaEmision: "Euro 5" },
    },
    "CR-V": {
      "EX 1.5 Turbo": { motor: "4 cil DOHC Turbo i-VTEC", cilindrada: "1.498 cc", cilindros: "4", potencia: "190 HP / 5.600 rpm", torque: "243 Nm / 2.000 rpm", combustible: "Gasolina", transmision: "Automática CVT", traccion: "AWD", carroceria: "SUV", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Discos traseros", consumo: "8.5 L/100km", aceleracion: "7.8 s", normaEmision: "Euro 5" },
    },
  },

  Volkswagen: {
    Polo: {
      "Trendline 1.6": { motor: "4 cil MPI DOHC", cilindrada: "1.598 cc", cilindros: "4", potencia: "110 HP / 5.800 rpm", torque: "153 Nm / 3.800 rpm", combustible: "Gasolina", transmision: "Manual 5 vel", traccion: "FWD", carroceria: "Sedán", puertas: 4, pasajeros: 5, frenos: "Discos delanteros / Tambores traseros", consumo: "7.5 L/100km", normaEmision: "Euro 5" },
      "Comfortline 1.6 AT": { motor: "4 cil MPI DOHC", cilindrada: "1.598 cc", cilindros: "4", potencia: "110 HP / 5.800 rpm", torque: "153 Nm / 3.800 rpm", combustible: "Gasolina", transmision: "Automática 6 vel", traccion: "FWD", carroceria: "Sedán", puertas: 4, pasajeros: 5, frenos: "Discos delanteros / Tambores traseros", consumo: "7.9 L/100km", normaEmision: "Euro 5" },
    },
    "T-Cross": {
      "Comfortline 1.0 TSI": { motor: "3 cil TSI Turbo DOHC", cilindrada: "999 cc", cilindros: "3", potencia: "110 HP / 5.000 rpm", torque: "200 Nm / 2.000 rpm", combustible: "Gasolina", transmision: "Automática DSG 7 vel", traccion: "FWD", carroceria: "SUV", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Tambores traseros", consumo: "6.5 L/100km", normaEmision: "Euro 5" },
      "Highline 1.4 TSI 4Motion": { motor: "4 cil TSI Turbo DOHC", cilindrada: "1.395 cc", cilindros: "4", potencia: "150 HP / 5.000 rpm", torque: "250 Nm / 1.750 rpm", combustible: "Gasolina", transmision: "Automática DSG 7 vel", traccion: "4Motion", carroceria: "SUV", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Discos traseros", consumo: "7.4 L/100km", normaEmision: "Euro 5" },
    },
    Tiguan: {
      "Comfortline 1.4 TSI": { motor: "4 cil TSI Turbo DOHC", cilindrada: "1.395 cc", cilindros: "4", potencia: "150 HP / 5.000 rpm", torque: "250 Nm / 1.750 rpm", combustible: "Gasolina", transmision: "Automática DSG 7 vel", traccion: "FWD", carroceria: "SUV", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Discos traseros", consumo: "8.0 L/100km", normaEmision: "Euro 5" },
      "Highline 2.0 TSI 4Motion": { motor: "4 cil TSI Turbo DOHC", cilindrada: "1.984 cc", cilindros: "4", potencia: "220 HP / 4.500 rpm", torque: "350 Nm / 1.500 rpm", combustible: "Gasolina", transmision: "Automática DSG 7 vel", traccion: "4Motion", carroceria: "SUV", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Discos traseros", consumo: "9.2 L/100km", aceleracion: "6.5 s", normaEmision: "Euro 5" },
    },
  },

  Suzuki: {
    Swift: {
      "GL 1.2": { motor: "4 cil DUALJET DOHC", cilindrada: "1.197 cc", cilindros: "4", potencia: "90 HP / 6.000 rpm", torque: "120 Nm / 4.400 rpm", combustible: "Gasolina", transmision: "Manual 5 vel", traccion: "FWD", carroceria: "Hatchback", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Tambores traseros", consumo: "5.7 L/100km", normaEmision: "Euro 5" },
      "GLX 1.2 AT": { motor: "4 cil DUALJET DOHC", cilindrada: "1.197 cc", cilindros: "4", potencia: "90 HP / 6.000 rpm", torque: "120 Nm / 4.400 rpm", combustible: "Gasolina", transmision: "Automática CVT", traccion: "FWD", carroceria: "Hatchback", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Tambores traseros", consumo: "6.0 L/100km", normaEmision: "Euro 5" },
    },
    Vitara: {
      "GL 1.6": { motor: "4 cil VVT DOHC", cilindrada: "1.586 cc", cilindros: "4", potencia: "117 HP / 6.000 rpm", torque: "156 Nm / 4.400 rpm", combustible: "Gasolina", transmision: "Manual 6 vel", traccion: "FWD", carroceria: "SUV", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Tambores traseros", consumo: "7.5 L/100km", normaEmision: "Euro 5" },
      "GLX 1.4 Turbo Allgrip AT": { motor: "4 cil Boosterjet Turbo DOHC", cilindrada: "1.373 cc", cilindros: "4", potencia: "140 HP / 5.500 rpm", torque: "220 Nm / 2.000 rpm", combustible: "Gasolina", transmision: "Automática 6 vel", traccion: "4WD Allgrip", carroceria: "SUV", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Discos traseros", consumo: "7.9 L/100km", normaEmision: "Euro 5" },
    },
    Jimny: {
      "GL 1.5 4WD": { motor: "4 cil DOHC VVT", cilindrada: "1.462 cc", cilindros: "4", potencia: "105 HP / 6.000 rpm", torque: "134 Nm / 4.000 rpm", combustible: "Gasolina", transmision: "Automática 4 vel", traccion: "4WD Part-time", carroceria: "SUV", puertas: 3, pasajeros: 4, frenos: "Discos delanteros / Discos traseros", consumo: "8.5 L/100km", normaEmision: "Euro 5" },
    },
  },

  Jeep: {
    Compass: {
      "Longitude 1.3 Turbo FWD": { motor: "4 cil MultiAir Turbo DOHC", cilindrada: "1.332 cc", cilindros: "4", potencia: "150 HP / 5.500 rpm", torque: "270 Nm / 1.750 rpm", combustible: "Gasolina", transmision: "Automática DCT 6 vel", traccion: "FWD", carroceria: "SUV", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Discos traseros", consumo: "7.5 L/100km", normaEmision: "Euro 5" },
      "Limited 1.3 Turbo 4x4": { motor: "4 cil MultiAir Turbo DOHC", cilindrada: "1.332 cc", cilindros: "4", potencia: "185 HP / 5.500 rpm", torque: "270 Nm / 1.750 rpm", combustible: "Gasolina", transmision: "Automática 9 vel", traccion: "4x4", carroceria: "SUV", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Discos traseros", consumo: "8.5 L/100km", normaEmision: "Euro 5" },
    },
    Wrangler: {
      "Sport 3.6 V6": { motor: "V6 Pentastar DOHC", cilindrada: "3.604 cc", cilindros: "6", potencia: "285 HP / 6.400 rpm", torque: "352 Nm / 4.800 rpm", combustible: "Gasolina", transmision: "Manual 6 vel", traccion: "4WD Part-time", carroceria: "SUV", puertas: 4, pasajeros: 5, frenos: "Discos delanteros / Discos traseros", consumo: "11.5 L/100km", normaEmision: "Euro 5" },
    },
  },

  BYD: {
    Atto3: {
      "Standard Range": { motor: "Motor eléctrico síncrono", cilindrada: "—", cilindros: "—", potencia: "204 HP", torque: "310 Nm", combustible: "Eléctrico", transmision: "Automática 1 vel", traccion: "FWD", carroceria: "SUV", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Discos traseros", consumo: "15.4 kWh/100km", aceleracion: "7.3 s", velocidadMax: "160 km/h", normaEmision: "Zero emisiones" },
    },
    Dolphin: {
      "Standard Range": { motor: "Motor eléctrico síncrono", cilindrada: "—", cilindros: "—", potencia: "94 HP", torque: "180 Nm", combustible: "Eléctrico", transmision: "Automática 1 vel", traccion: "FWD", carroceria: "Hatchback", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Discos traseros", consumo: "13.5 kWh/100km", aceleracion: "12.3 s", velocidadMax: "150 km/h", normaEmision: "Zero emisiones" },
    },
  },

  Chery: {
    "Tiggo 4": {
      "Pro 1.5 Turbo": { motor: "4 cil Turbo DOHC", cilindrada: "1.493 cc", cilindros: "4", potencia: "147 HP / 5.500 rpm", torque: "210 Nm / 2.000 rpm", combustible: "Gasolina", transmision: "Automática DCT 7 vel", traccion: "FWD", carroceria: "SUV", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Discos traseros", consumo: "7.8 L/100km", normaEmision: "Euro 5" },
    },
    "Tiggo 7": {
      "Pro 1.5 Turbo": { motor: "4 cil Turbo DOHC", cilindrada: "1.493 cc", cilindros: "4", potencia: "156 HP / 5.500 rpm", torque: "230 Nm / 2.000 rpm", combustible: "Gasolina", transmision: "Automática CVT", traccion: "FWD", carroceria: "SUV", puertas: 5, pasajeros: 5, frenos: "Discos delanteros / Discos traseros", consumo: "8.2 L/100km", normaEmision: "Euro 5" },
    },
  },
};

// Obtiene especificaciones para una combinación marca/modelo/version
export function getEspecificaciones(marca: string, modelo: string, version: string): EspecificacionesTecnicas | null {
  return especificaciones[marca]?.[modelo]?.[version] ?? null;
}

// Obtiene las versiones disponibles para una marca/modelo
export function getVersiones(marca: string, modelo: string): string[] {
  const modSpecs = especificaciones[marca]?.[modelo];
  return modSpecs ? Object.keys(modSpecs) : [];
}

// Obtiene los modelos con specs disponibles para una marca
export function getModelosConSpecs(marca: string): string[] {
  const marcaSpecs = especificaciones[marca];
  return marcaSpecs ? Object.keys(marcaSpecs) : [];
}

// ── PRECIOS BASE DE LISTA (millones COP, año 2024) ───────────────────────
// Fuente: listas de precios fabricantes, TuCarro, OLX Colombia
export const preciosBase: Record<string, Record<string, Record<string, number>>> = {
  Chevrolet: {
    Spark:   { "Base 1.2": 42.9,  "GT 1.4": 49.5 },
    Onix:    { "LT 1.0 Turbo": 58.9, "Premier 1.0 Turbo AT": 68.9 },
    Tracker: { "LT 1.2 Turbo": 87.9, "Premier 1.2 Turbo AWD": 110.9 },
    Captiva: { "LT 1.5 Turbo": 99.9, "Premier 1.5 Turbo AT": 119.9 },
  },
  Renault: {
    Kwid:   { "Zen 1.0": 44.9,  "Iconic 1.0 AMT": 52.9 },
    Logan:  { "Zen 1.6": 63.9,  "Intens 1.6": 74.9 },
    Duster: { "Expression 1.6": 79.9, "Zen 2.0 4x4": 93.9 },
    Captur: { "Zen 1.3 Turbo": 99.9,  "Intens 1.3 Turbo": 116.9 },
  },
  Toyota: {
    Corolla:  { "GLi 1.8": 119.9,  "XEi 2.0": 139.9 },
    RAV4:     { "XLE 2.5 Híbrido": 199.9, "Limited 2.5": 179.9 },
    Hilux:    { "SR 2.4 Diesel 4x2": 169.9, "SRV 2.8 Diesel 4x4 AT": 239.9 },
    Fortuner: { "SRV 2.7 4x2 AT": 195.9,   "SR5 2.8 Diesel 4x4 AT": 269.9 },
    Camry:    { "SE 2.5": 189.9, "XSE 2.5 Híbrido": 229.9 },
  },
  Kia: {
    Picanto:  { "EX 1.2": 46.9, "GT Line 1.2 AT": 55.9 },
    Sportage: { "LX 2.0": 99.9, "EX 2.0 AT": 119.9, "GT Line 1.6 T-GDI": 149.9 },
    Sorento:  { "EX 2.0 T-GDI": 179.9 },
    Carnival: { "EX 3.5 V6": 249.9 },
  },
  Hyundai: {
    "Grand i10": { "GL 1.2": 44.9, "GLS 1.2 AT": 52.9 },
    Accent:      { "GL 1.6": 69.9, "GLS 1.6 AT": 79.9 },
    Tucson:      { "GL 2.0": 119.9, "GLS 2.0 AT": 139.9 },
    "Santa Fe":  { "GLS 2.4": 189.9 },
    Creta:       { "Premium 1.5": 99.9, "Limited 1.5 AT": 115.9 },
  },
  Mazda: {
    Mazda3: { "Touring 2.0": 99.9, "Grand Touring 2.5 AT": 129.9 },
    "CX-5": { "Touring 2.0": 129.9, "Grand Touring 2.5 AWD": 159.9, "Grand Touring 2.5T AWD": 189.9 },
    "CX-30": { "Touring 2.0": 109.9, "Grand Touring 2.0 AT": 129.9 },
  },
  Nissan: {
    Kicks:    { "Sense 1.6": 79.9,  "Advance 1.6 AT": 94.9 },
    Versa:    { "Sense 1.6": 64.9,  "Advance 1.6 AT": 74.9 },
    "X-Trail": { "Sense 2.5": 119.9, "Advance 2.5 AT AWD": 149.9 },
  },
  Ford: {
    EcoSport: { "SE 1.5 Freestyle": 79.9, "SE 2.0 AT": 104.9 },
    Escape:   { "SE 1.5 EcoBoost": 119.9 },
    Ranger:   { "XL 2.2 Diésel 4x4": 159.9, "XLT 3.2 Diésel 4x4 AT": 209.9 },
  },
  Mitsubishi: {
    "Eclipse Cross": { "GS-S 1.5 Turbo": 129.9 },
    Outlander:       { "GS5 2.4": 149.9 },
    L200:            { "GLX 2.4 Diésel 4x2": 139.9, "GLS 2.4 Diésel 4x4 AT": 179.9 },
  },
  Honda: {
    City:   { "EX 1.5": 79.9,   "EXL 1.5 AT": 94.9 },
    "HR-V": { "LX 1.8": 99.9,   "EX 1.8 AT": 115.9 },
    "CR-V": { "EX 1.5 Turbo": 159.9 },
  },
  Volkswagen: {
    Polo:    { "Trendline 1.6": 79.9,  "Comfortline 1.6 AT": 94.9 },
    "T-Cross": { "Comfortline 1.0 TSI": 104.9, "Highline 1.4 TSI 4Motion": 139.9 },
    Tiguan:  { "Comfortline 1.4 TSI": 139.9,   "Highline 2.0 TSI 4Motion": 189.9 },
  },
  Suzuki: {
    Swift:  { "GL 1.2": 59.9,  "GLX 1.2 AT": 69.9 },
    Vitara: { "GL 1.6": 89.9,  "GLX 1.4 Turbo Allgrip AT": 119.9 },
    Jimny:  { "GL 1.5 4WD": 129.9 },
  },
  Jeep: {
    Compass:  { "Longitude 1.3 Turbo FWD": 129.9, "Limited 1.3 Turbo 4x4": 169.9 },
    Wrangler: { "Sport 3.6 V6": 299.9 },
  },
  BYD: {
    Atto3:   { "Standard Range": 159.9 },
    Dolphin: { "Standard Range": 109.9 },
  },
  Chery: {
    "Tiggo 4": { "Pro 1.5 Turbo": 84.9 },
    "Tiggo 7": { "Pro 1.5 Turbo": 99.9 },
  },
};

/**
 * Estima el valor de mercado de un vehículo usado en Colombia.
 * Modelo de depreciación típico del mercado colombiano.
 * @returns { min, max, base } en millones COP, o null si no hay datos base.
 */
export function estimarValorUsado(
  marca: string,
  modelo: string,
  version: string,
  año: number
): { min: number; max: number; base: number } | null {
  const base = preciosBase[marca]?.[modelo]?.[version];
  if (!base) return null;

  const edad = Math.max(0, new Date().getFullYear() - año);

  let factor = 1;
  for (let i = 0; i < edad; i++) {
    if (i === 0)    factor *= 0.88; // −12% primer año
    else if (i < 3) factor *= 0.91; // −9% años 2–3
    else if (i < 6) factor *= 0.93; // −7% años 4–6
    else            factor *= 0.95; // −5% año 7+
  }

  const valor = base * factor;
  return {
    min:  Math.round(valor * 0.92 * 10) / 10,
    max:  Math.round(valor * 1.08 * 10) / 10,
    base,
  };
}
