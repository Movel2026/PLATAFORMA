import { NextRequest, NextResponse } from "next/server";
import { getDetalle, getFotoUrl } from "@/lib/fasecolda";

/**
 * GET /api/fasecolda/detalle?cat=1&estado=1&modelo=2025&marca=12&ref=345
 *
 * Devuelve el detalle técnico completo de una referencia Fasecolda:
 * cilindraje, potencia, tipología, combustible, tipoCaja, puertas, pasajeros,
 * airbags, código foto, valor, etc.
 */
export async function GET(req: NextRequest) {
  const p         = req.nextUrl.searchParams;
  const cat       = Number(p.get("cat") ?? 0);
  const estado    = Number(p.get("estado") ?? 0);
  const modelo    = Number(p.get("modelo") ?? 0);
  const marca     = Number(p.get("marca") ?? 0);
  const ref       = Number(p.get("ref") ?? 0);

  if (!cat || !estado || !modelo || !marca || !ref) {
    return NextResponse.json({ error: "Faltan parámetros (cat, estado, modelo, marca, ref)" }, { status: 400 });
  }

  try {
    const detalles = await getDetalle(cat, estado, modelo, marca, ref);
    const d = detalles[0]; // primera coincidencia

    if (!d) {
      return NextResponse.json({ ok: false, error: "Sin resultados" }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      detalle: {
        ...d,
        fotoUrl: getFotoUrl(d.codigoFoto),
      },
    });
  } catch (err: unknown) {
    const msg = String(err);
    const status = msg.includes("401") ? 401 : 500;
    return NextResponse.json(
      { ok: false, error: msg, tokenExpired: status === 401 },
      { status },
    );
  }
}
