import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * GET   /api/mis-publicaciones?email=xxx          → publicaciones del usuario por email
 * GET   /api/mis-publicaciones?userId=xxx         → publicaciones del usuario por auth uuid
 * PATCH /api/mis-publicaciones                    → cambiar estado o editar (precio, fotos) de una publicación propia
 */

const ADMIN_URL = "https://www.movelcar.com/admin";

const ESTADO_EMOJI: Record<string, string> = {
  pendiente: "⏳",
  activo:    "🟢",
  pausado:   "⏸️",
  vendido:   "💰",
  rechazado: "❌",
  eliminado: "🗑️",
};

const ESTADO_LABEL: Record<string, string> = {
  pendiente: "En revisión",
  activo:    "Publicado",
  pausado:   "Pausado",
  vendido:   "Vendido",
  rechazado: "Rechazado",
  eliminado: "Eliminado",
};

async function notifyAdminTelegram(message: string) {
  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID   = process.env.TELEGRAM_CHAT_ID;
  if (!BOT_TOKEN || !CHAT_ID) {
    console.log("[Telegram skip]:", message);
    return;
  }
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      }),
    });
  } catch (err) {
    console.error("[Telegram error]:", err);
  }
}

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
    const body = await req.json();
    const { id, estado, precio, fotos_urls, email, userId } = body;

    if (!id) return NextResponse.json({ ok: false, error: "id requerido" }, { status: 400 });
    if (!email && !userId) return NextResponse.json({ ok: false, error: "email o userId requerido" }, { status: 400 });

    // Verificar propiedad
    const { data: pub, error: verifyErr } = await supabaseAdmin
      .from("publicaciones")
      .select("id, email, user_id, marca, modelo, ano, precio, estado, nombre")
      .eq("id", id)
      .maybeSingle();
    if (verifyErr || !pub) {
      return NextResponse.json({ ok: false, error: "Publicación no encontrada" }, { status: 404 });
    }
    const isOwner = (userId && pub.user_id === userId) || (email && String(pub.email || "").toLowerCase() === email.toLowerCase());
    if (!isOwner) {
      return NextResponse.json({ ok: false, error: "No autorizado: esta publicación no es tuya" }, { status: 403 });
    }

    // Construir updates dinámicamente
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    const cambios: string[] = [];

    if (estado !== undefined) {
      if (!["pendiente", "activo", "vendido", "pausado", "eliminado"].includes(estado)) {
        return NextResponse.json({ ok: false, error: "estado inválido" }, { status: 400 });
      }
      updates.estado = estado;
      if (estado !== pub.estado) {
        cambios.push(`Estado: *${ESTADO_LABEL[pub.estado] || pub.estado}* → *${ESTADO_LABEL[estado]}* ${ESTADO_EMOJI[estado] || ""}`);
      }
    }

    if (precio !== undefined && Number(precio) > 0) {
      const nuevoPrecio = Number(precio);
      if (nuevoPrecio !== Number(pub.precio)) {
        updates.precio = nuevoPrecio;
        const fmt = (n: number) => `$ ${n.toLocaleString("es-CO")}`;
        cambios.push(`Precio: *${fmt(Number(pub.precio))}* → *${fmt(nuevoPrecio)}*`);
      }
    }

    if (Array.isArray(fotos_urls)) {
      updates.fotos_urls = fotos_urls;
      updates.total_fotos = fotos_urls.length;
      cambios.push(`Fotos actualizadas: *${fotos_urls.length}* en total`);
    }

    if (Object.keys(updates).length === 1) {
      return NextResponse.json({ ok: false, error: "Nada que actualizar" }, { status: 400 });
    }

    const { error: updErr } = await supabaseAdmin
      .from("publicaciones")
      .update(updates)
      .eq("id", id);
    if (updErr) return NextResponse.json({ ok: false, error: updErr.message }, { status: 500 });

    // Notificar admin si hubo cambios reales
    if (cambios.length > 0) {
      const fecha = new Date().toLocaleString("es-CO", {
        timeZone: "America/Bogota",
        day: "numeric", month: "long", hour: "2-digit", minute: "2-digit",
      });
      const mensaje = [
        "✏️ *Publicación actualizada por el vendedor*",
        `📅 ${fecha}`,
        "",
        `🚗 *${pub.marca} ${pub.modelo} ${pub.ano}*`,
        `👤 ${pub.nombre || "Vendedor"} · ${pub.email || ""}`,
        "",
        ...cambios.map((c) => `• ${c}`),
        "",
        `🔗 [Ver en el panel](${ADMIN_URL})`,
      ].join("\n");
      void notifyAdminTelegram(mensaje);
    }

    return NextResponse.json({ ok: true, id, updates });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
