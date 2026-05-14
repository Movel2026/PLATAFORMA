import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase";

/**
 * PATCH /api/admin/update-publicacion
 *
 * Body: { id: string, fields: Record<string, any> }
 *
 * Permite al admin editar/agregar campos de una publicación.
 * Protección básica: requiere header `x-admin-pin` igual a ADMIN_PIN env.
 */
export async function PATCH(req: NextRequest) {
  if (!supabaseConfigured()) {
    return NextResponse.json({ error: "Supabase no configurado" }, { status: 503 });
  }

  // ── Auth simple por PIN (igual que el dashboard) ──
  const pin = req.headers.get("x-admin-pin");
  const expected = process.env.ADMIN_PIN ?? "1234";
  if (pin !== expected) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const { id, fields } = await req.json();
    if (!id || !fields || typeof fields !== "object") {
      return NextResponse.json({ error: "Body inválido" }, { status: 400 });
    }

    // Whitelist de campos editables (proteger contra inyección de columnas)
    const allowed = [
      "marca", "modelo", "ano", "version", "color", "ciudad",
      "kilometraje", "precio", "carroceria", "combustible", "transmision",
      "motor", "potencia", "pasajeros", "descripcion", "placa",
      "ultimo_digito_placa", "estado", "notas_admin", "modo", "accept_offers",
      "total_fotos",
    ];
    const update: Record<string, unknown> = {};
    for (const k of Object.keys(fields)) {
      if (allowed.includes(k)) update[k] = fields[k];
    }
    update.updated_at = new Date().toISOString();

    if (Object.keys(update).length === 1) {
      // Solo el timestamp, nada útil
      return NextResponse.json({ error: "Sin campos para actualizar" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("publicaciones")
      .update(update)
      .eq("id", id);

    if (error) {
      console.error("[update-publicacion]:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, updated: Object.keys(update) });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
