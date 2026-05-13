/**
 * GET /api/vehicledb
 *   ?action=tipos                     → lista de tipos de carrocería
 *   ?action=marcas&tipo=AUTOMOVILES   → marcas para ese tipo
 *   ?action=refs&tipo=AUTOMOVILES&marca=ACURA&q=integra&limit=50
 *                                     → referencias que coincidan con q
 *   ?action=ref&tipo=AUTOMOVILES&marca=ACURA&ref=INTEGRA+1.8+2P+MT
 *                                     → datos completos de una referencia
 *   ?action=stats                     → estadísticas generales
 */

import { NextRequest, NextResponse } from "next/server";
import {
  getTipos,
  getMarcasByTipo,
  searchReferencias,
  getRefData,
  getVehicleDBStats,
  TIPO_LABELS,
} from "@/lib/vehicle-db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action") ?? "tipos";
  const tipo   = (searchParams.get("tipo") ?? "").toUpperCase();
  const marca  = (searchParams.get("marca") ?? "").toUpperCase();
  const ref    = searchParams.get("ref") ?? "";
  const q      = searchParams.get("q") ?? "";
  const limit  = Math.min(Number(searchParams.get("limit") ?? 80), 300);

  switch (action) {
    case "tipos": {
      const tipos = getTipos().map((t) => ({ id: t, label: TIPO_LABELS[t] ?? t }));
      return NextResponse.json({ ok: true, tipos });
    }

    case "marcas": {
      if (!tipo) return NextResponse.json({ error: "Falta 'tipo'" }, { status: 400 });
      const marcas = getMarcasByTipo(tipo);
      return NextResponse.json({ ok: true, tipo, total: marcas.length, marcas });
    }

    case "refs": {
      if (!tipo || !marca) return NextResponse.json({ error: "Falta tipo o marca" }, { status: 400 });
      const refs = searchReferencias(tipo, marca, q, limit);
      return NextResponse.json({
        ok: true,
        tipo,
        marca,
        total: refs.length,
        refs: refs.map((r) => ({
          ref:  r.ref,
          cil:  r.cil,
          pas:  r.pas,
          ton:  r.ton,
        })),
      });
    }

    case "ref": {
      if (!tipo || !marca || !ref)
        return NextResponse.json({ error: "Falta tipo, marca o ref" }, { status: 400 });
      const data = getRefData(tipo, marca, ref);
      if (!data) return NextResponse.json({ error: "Referencia no encontrada" }, { status: 404 });
      return NextResponse.json({ ok: true, tipo, marca, data });
    }

    case "stats": {
      return NextResponse.json({ ok: true, stats: getVehicleDBStats() });
    }

    default:
      return NextResponse.json({ error: "Acción no reconocida" }, { status: 400 });
  }
}
