import { NextRequest, NextResponse } from "next/server";
import {
  getEstados, getModelos, getMarcas, getReferencias,
} from "@/lib/fasecolda";

/**
 * GET /api/fasecolda/cascade?step=estados&cat=1
 * GET /api/fasecolda/cascade?step=modelos&cat=1&estado=1
 * GET /api/fasecolda/cascade?step=marcas&cat=1&estado=1&modelo=2025
 * GET /api/fasecolda/cascade?step=referencias&cat=1&estado=1&modelo=2025&marca=12
 *
 * Proxy cascada de la API Fasecolda con caché.
 * Requiere FASECOLDA_TOKEN en env vars.
 */
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  const step    = p.get("step") ?? "";
  const cat     = Number(p.get("cat") ?? 0);
  const estado  = Number(p.get("estado") ?? 0);
  const modelo  = Number(p.get("modelo") ?? 0);
  const marca   = Number(p.get("marca") ?? 0);

  try {
    switch (step) {
      case "estados": {
        if (!cat) return NextResponse.json({ error: "Falta cat" }, { status: 400 });
        const data = await getEstados(cat);
        return NextResponse.json({ ok: true, data });
      }
      case "modelos": {
        if (!cat || !estado) return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 });
        const data = await getModelos(cat, estado);
        return NextResponse.json({ ok: true, data });
      }
      case "marcas": {
        if (!cat || !estado || !modelo) return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 });
        const data = await getMarcas(cat, estado, modelo);
        return NextResponse.json({ ok: true, data });
      }
      case "referencias": {
        if (!cat || !estado || !modelo || !marca) return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 });
        const data = await getReferencias(cat, estado, modelo, marca);
        return NextResponse.json({ ok: true, data });
      }
      default:
        return NextResponse.json({ error: "step inválido" }, { status: 400 });
    }
  } catch (err: unknown) {
    const msg = String(err);
    const status = msg.includes("401") ? 401 : 500;
    return NextResponse.json(
      { ok: false, error: msg, tokenExpired: status === 401 },
      { status },
    );
  }
}
