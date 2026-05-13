import { NextResponse } from "next/server";
import { getCategorias, isFasecoldaConfigured } from "@/lib/fasecolda";

// GET /api/fasecolda/categorias
// Endpoint público — no requiere auth con Fasecolda
export async function GET() {
  try {
    const categorias = await getCategorias();
    return NextResponse.json({
      ok: true,
      configured: isFasecoldaConfigured(),
      categorias,
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
