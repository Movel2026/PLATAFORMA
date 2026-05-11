import { NextRequest, NextResponse } from "next/server";
import { calcularImpuesto, calcularGastosMensuales, TAX_BRACKETS } from "@/lib/tax-calculator";

// GET /api/calculadora/impuesto?avaluo=80000000&seguro=true&parqueadero=true
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const avaluo            = Number(searchParams.get("avaluo") ?? 0);
  const incluyeSeguro     = searchParams.get("seguro") !== "false";
  const incluyeParqueadero = searchParams.get("parqueadero") !== "false";
  const combustibleMes    = searchParams.get("combustible") ? Number(searchParams.get("combustible")) : undefined;

  if (!avaluo || avaluo < 0) {
    return NextResponse.json({
      error: "Avalúo inválido",
      brackets: TAX_BRACKETS,
    }, { status: 400 });
  }

  const impuesto = calcularImpuesto(avaluo);
  const gastos   = calcularGastosMensuales({ avaluo, incluyeSeguro, incluyeParqueadero, combustibleMes });

  return NextResponse.json({
    impuesto,
    gastos,
    brackets: TAX_BRACKETS,
  });
}
