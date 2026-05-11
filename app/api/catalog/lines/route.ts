import { NextRequest, NextResponse } from "next/server";
import { searchLines } from "@/lib/catalog";

// GET /api/catalog/lines?brand=BMW&q=320 — líneas filtradas para una marca
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const brand = searchParams.get("brand")?.toUpperCase() ?? "";
  const query = searchParams.get("q") ?? "";
  const limit = Math.min(Number(searchParams.get("limit") ?? 50), 200);

  if (!brand) {
    return NextResponse.json({ error: "Falta parámetro 'brand'" }, { status: 400 });
  }

  const lines = searchLines(brand, query, limit);
  // Sólo devolver línea (sin el avalúo completo) para reducir payload
  return NextResponse.json({
    brand,
    total: lines.length,
    lines: lines.map(l => l.linea),
  });
}
