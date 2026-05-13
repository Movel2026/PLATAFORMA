import { NextRequest, NextResponse } from "next/server";
import { searchLines } from "@/lib/catalog";

// GET /api/catalog/lines?brand=BMW&q=320&limit=50&full=1
// full=1 → incluye el objeto avaluo completo por año (para FasecoldaSelector)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const brand = searchParams.get("brand")?.toUpperCase() ?? "";
  const query = searchParams.get("q") ?? "";
  const limit = Math.min(Number(searchParams.get("limit") ?? 50), 300);
  const full  = searchParams.get("full") === "1";

  if (!brand) {
    return NextResponse.json({ error: "Falta parámetro 'brand'" }, { status: 400 });
  }

  const lines = searchLines(brand, query, limit);

  if (full) {
    // Devuelve objetos completos { linea, avaluo } para uso en FasecoldaSelector
    return NextResponse.json({
      brand,
      total: lines.length,
      full:  lines,          // array de { linea, avaluo: { "2020": 45000000, ... } }
    });
  }

  // Por defecto: sólo nombres para reducir payload del datalist
  return NextResponse.json({
    brand,
    total: lines.length,
    lines: lines.map(l => l.linea),
  });
}
