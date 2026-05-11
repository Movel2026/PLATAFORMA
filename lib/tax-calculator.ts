// Calculadora de Impuesto de Rodamiento — Ministerio de Transporte 2026
// Tarifas oficiales basadas en el valor comercial (avalúo) del vehículo

export interface TaxBracket {
  rango: string;
  desde: number;
  hasta: number | null; // null = sin límite
  tarifa: number;       // decimal (0.017 = 1.7%)
  descripcion: string;
}

export const TAX_BRACKETS: TaxBracket[] = [
  { rango: "Rango 1", desde: 0,         hasta: 54_057_000,   tarifa: 0.017, descripcion: "Hasta $54.057.000" },
  { rango: "Rango 2", desde: 54_057_001, hasta: 121_625_000,  tarifa: 0.027, descripcion: "$54.057.001 a $121.625.000" },
  { rango: "Rango 3", desde: 121_625_001, hasta: null,         tarifa: 0.037, descripcion: "Superior a $121.625.000" },
];

export interface TaxResult {
  avaluo:         number;
  impuestoAnual:  number;
  impuestoMensual: number;
  rangoAplicado:  TaxBracket;
  tarifaPorcentaje: string;
}

export function calcularImpuesto(avaluo: number): TaxResult {
  const bracket = TAX_BRACKETS.find(
    (b) => avaluo >= b.desde && (b.hasta === null || avaluo <= b.hasta)
  ) ?? TAX_BRACKETS[0];

  const impuestoAnual = Math.round(avaluo * bracket.tarifa);
  const impuestoMensual = Math.round(impuestoAnual / 12);

  return {
    avaluo,
    impuestoAnual,
    impuestoMensual,
    rangoAplicado: bracket,
    tarifaPorcentaje: `${(bracket.tarifa * 100).toFixed(1)}%`,
  };
}

// ─── Otros gastos aproximados ────────────────────────────────
// Costos típicos en Colombia para un vehículo particular (estimados)
export interface MonthlyExpenses {
  impuestoRodamiento: number;  // del cálculo anterior /12
  soat:               number;  // anual / 12 — varía por modelo
  tecnomecanica:      number;  // ~$200k anual / 12 = ~$17k
  parqueadero:        number;  // ~$200k/mes promedio urbano
  combustible:        number;  // ~$600k/mes uso medio
  mantenimiento:      number;  // ~$1.5M anual / 12 = $125k
  seguroTodoRiesgo:   number;  // ~3% del valor / 12
  total:              number;
}

export interface ExpensesParams {
  avaluo:           number;
  incluyeSeguro?:   boolean;  // todo riesgo
  incluyeParqueadero?: boolean;
  combustibleMes?:  number;   // override manual
}

export function calcularGastosMensuales(p: ExpensesParams): MonthlyExpenses {
  const tax = calcularImpuesto(p.avaluo);

  // SOAT — promedio para particulares (varía pero esto es buen estimado)
  const soatAnual = p.avaluo < 50_000_000 ? 380_000 : p.avaluo < 100_000_000 ? 480_000 : 580_000;
  const soat = Math.round(soatAnual / 12);

  // Tecnomecánica anual: ~$200k (no aplica primeros 6 años pero promediamos)
  const tecnomecanica = Math.round(200_000 / 12);

  // Parqueadero mensual urbano
  const parqueadero = p.incluyeParqueadero === false ? 0 : 200_000;

  // Combustible
  const combustible = p.combustibleMes ?? 600_000;

  // Mantenimiento anual estimado ~$1.5M (cambios de aceite, llantas, frenos)
  const mantenimiento = Math.round(1_500_000 / 12);

  // Seguro todo riesgo: ~3% anual del avalúo
  const seguroTodoRiesgo = p.incluyeSeguro === false ? 0 : Math.round((p.avaluo * 0.03) / 12);

  const total = tax.impuestoMensual + soat + tecnomecanica + parqueadero + combustible + mantenimiento + seguroTodoRiesgo;

  return {
    impuestoRodamiento: tax.impuestoMensual,
    soat,
    tecnomecanica,
    parqueadero,
    combustible,
    mantenimiento,
    seguroTodoRiesgo,
    total,
  };
}

export function formatCOP(n: number): string {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(n);
}
