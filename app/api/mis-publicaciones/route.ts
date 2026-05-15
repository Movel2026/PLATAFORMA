import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase";

/**
 * GET  /api/mis-publicaciones?email=xxx          → publicaciones del usuario por email
 * GET  /api/mis-publicaciones?userId=xxx         → publicaciones del usuario por auth uuid
 * PATCH /api/mis-publicaciones                   → cambiar estado de una publicación propia
 *
 * Permite al vendedor ver sus propias publicaciones y gestionarlas (bajar, marcar vendido).
 */

export async function GET(req: NextRequest) {
  if (!supabaseConfigured()) {
    return NextResponse.json({ vehicles: [], configured: false });
  }

  const url = new URL(req.url);
  const email = (url.searchParams.get("email") || "").toLowerCase().trim();
  const userId = url.searchParams.get("userId") || "";

  if (!email && !userId) {
    return NextResponse.json({ vehicles: [], error: "email o userId requerido" }, { status: 400 });
  }

  try {
    let query = supabaseAdmin.from("publicaciones").select("*").order("created_at", { ascending: false });
    if (userId) {
      query = query.eq("user_id", userId);
    } else {
      query = query.eq("email", email);
    }
    const { data, error } = await query;
    if (error) {
      console.error("[/api/mis-publicaciones]:", error.message);
      return NextResponse.json({ vehicles: [], error: error.message }, { status: 500 });
    }
    return NextResponse.json({ vehicles: data || [], count: data?.length || 0 });
  } catch (err) {
    return NextResponse.json({ vehicles: [], error: String(err) }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!supabaseConfigured()) {
    return NextResponse.json({ ok: false, error: "BD no configurada" }, { status: 503 });
  }
  try {
    const { id, estado, email, userId } = await req.json();

    if (!id) return NextResponse.json({ ok: false, error: "id requerido" }, { status: 400 });
    if (!email && !userId) return NextResponse.json({ ok: false, error: "email o userId requerido" }, { status: 400 });
    if (!["pendiente", "activo", "vendido", "pausado", "eliminado"].includes(estado)) {
      return NextResponse.json({ ok: false, error: "estado inválido" }, { status: 400 });
    }

    // Verificar que la publicación pertenezca al usuario antes de modificar
    const verifyQuery = supabaseAdmin.from("publicaciones").select("id, email, user_id").eq("id", id).maybeSingle();
    const { data: pub, error: verifyErr } = await verifyQuery;
    if (verifyErr || !pub) {
      return NextResponse.json({ ok: false, error: "Publicación no encontrada" }, { status: 404 });
    }
    const isOwner = (userId && pub.user_id === userId) || (email && String(pub.email || "").toLowerCase() === email.toLowerCase());
    if (!isOwner) {
      return NextResponse.json({ ok: false, error: "No autorizado: esta publicación no es tuya" }, { status: 403 });
    }

    // Actualizar
    const { error: updErr } = await supabaseAdmin
      .from("publicaciones")
      .update({ estado, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (updErr) return NextResponse.json({ ok: false, error: updErr.message }, { status: 500 });

    return NextResponse.json({ ok: true, id, estado });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
