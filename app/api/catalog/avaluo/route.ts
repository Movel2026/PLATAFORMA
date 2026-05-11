import { NextRequest, NextResponse } from "next/server";
import { getAvaluo } from "@/lib/catalog";
import { calcularImpuesto, calcularGastosMensuales } from "@/lib/tax-calculator";

// GET /api/catalog/avaluo?brand=BMW&linea=320i&ano=2022
// Devuelve avalúo + impuesto + gastos mensuales estimados
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const brand = searchParams.get("brand")?.toUpperCase() ?? "";
  const linea = searchParams.get("linea") ?? "";
  const ano   = Number(searchParams.get("ano") ?? new Date().getFullYear());

  if (!brand || !linea) {
    return NextResponse.json({ error: "Faltan parámetros brand/linea" }, { status: 400 });
  }

  const avaluo = getAvaluo(brand, linea, ano);
  if (!avaluo) {
    return NextResponse.json({ error: "Vehículo no encontrado en catálogo", avaluo: 0 }, { status: 404 });
  }

  const impuesto = calcularImpuesto(avaluo);
  const gastos   = calcularGastosMensuales({ avaluo });

  return NextResponse.json({
    brand, linea, ano,
    avaluo,
    impuesto,
    gastos,
  });
}
