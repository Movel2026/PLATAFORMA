import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase";

// GET /api/admin/stats — métricas completas para el panel admin
export async function GET(req: NextRequest) {
  const pin = req.headers.get("x-admin-pin");
  if (pin !== (process.env.ADMIN_PIN || "MOVEL2025")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (!supabaseConfigured()) {
    return NextResponse.json({ error: "Supabase no configurado", configured: false }, { status: 503 });
  }

  try {
    // Ejecutar todas las consultas en paralelo
    const [
      usuariosRes,
      publicacionesRes,
      ofertasRes,
      contactosRes,
      usuariosUltimos30Res,
      pubEstadosRes,
      ofertasRecientesRes,
      contactosRecientesRes,
      usuariosRecientesRes,
    ] = await Promise.all([
      supabaseAdmin.from("usuarios").select("count", { count: "exact", head: true }),
      supabaseAdmin.from("publicaciones").select("count", { count: "exact", head: true }),
      supabaseAdmin.from("ofertas").select("count", { count: "exact", head: true }),
      supabaseAdmin.from("contactos").select("count", { count: "exact", head: true }),

      // Registros de los últimos 30 días (para gráfico)
      supabaseAdmin
        .from("usuarios")
        .select("created_at")
        .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order("created_at", { ascending: true }),

      // Publicaciones por estado
      supabaseAdmin
        .from("publicaciones")
        .select("estado"),

      // Últimas 20 ofertas
      supabaseAdmin
        .from("ofertas")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20),

      // Últimas 20 consultas
      supabaseAdmin
        .from("contactos")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20),

      // Últimos 50 usuarios
      supabaseAdmin
        .from("usuarios")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50),
    ]);

    // Publicaciones detalladas (separado para no mezclar con count)
    const { data: pubData } = await supabaseAdmin
      .from("publicaciones")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    // Agrupar registros por día (últimos 30 días)
    const registrosPorDia: Record<string, number> = {};
    (usuariosUltimos30Res.data ?? []).forEach((u) => {
      const dia = u.created_at?.split("T")[0] ?? "";
      registrosPorDia[dia] = (registrosPorDia[dia] ?? 0) + 1;
    });

    // Conteos por estado de publicaciones
    const estadoConteos: Record<string, number> = {};
    (pubEstadosRes.data ?? []).forEach((p) => {
      const e = p.estado ?? "pendiente";
      estadoConteos[e] = (estadoConteos[e] ?? 0) + 1;
    });

    return NextResponse.json({
      configured: true,
      totales: {
        usuarios:     usuariosRes.count    ?? 0,
        publicaciones: publicacionesRes.count ?? 0,
        ofertas:      ofertasRes.count     ?? 0,
        contactos:    contactosRes.count   ?? 0,
      },
      registrosPorDia,
      publicacionesPorEstado: estadoConteos,
      publicaciones: pubData ?? [],
      ofertas:       ofertasRecientesRes.data  ?? [],
      contactos:     contactosRecientesRes.data ?? [],
      usuarios:      usuariosRecientesRes.data  ?? [],
    });
  } catch (err) {
    console.error("[admin/stats]", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

// PATCH /api/admin/stats — actualizar estado de publicación u oferta
export async function PATCH(req: NextRequest) {
  const pin = req.headers.get("x-admin-pin");
  if (pin !== (process.env.ADMIN_PIN || "MOVEL2025")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  if (!supabaseConfigured()) {
    return NextResponse.json({ error: "Supabase no configurado" }, { status: 503 });
  }

  const { tabla, id, estado, notas_admin } = await req.json();
  if (!tabla || !id || !estado) {
    return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 });
  }

  const updates: Record<string, string> = { estado };
  if (notas_admin !== undefined) updates.notas_admin = notas_admin;

  const { error } = await supabaseAdmin.from(tabla).update(updates).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
