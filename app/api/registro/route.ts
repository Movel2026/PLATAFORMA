import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase";

const ADMIN_URL = "https://www.movelcar.com/admin";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // ── 1. Guardar en Supabase ──────────────────────────────
    if (supabaseConfigured()) {
      const { error } = await supabaseAdmin.from("usuarios").insert({
        nombre:   data.name   ?? "",
        email:    data.email  ?? "",
        telefono: data.phone  ?? "",
        ciudad:   data.city   ?? "",
        origen:   data.source ?? "web",
      });
      if (error) console.error("[Supabase registro]:", error.message);
    }

    // ── 2. Contar total de usuarios para el mensaje ─────────
    let totalUsuarios = "—";
    if (supabaseConfigured()) {
      const { count } = await supabaseAdmin.from("usuarios").select("count", { count: "exact", head: true });
      if (count !== null) totalUsuarios = `#${count}`;
    }

    // ── 3. Telegram con mensaje enriquecido ─────────────────
    const fecha = new Date().toLocaleString("es-CO", {
      timeZone: "America/Bogota",
      weekday: "long", day: "numeric", month: "long",
      hour: "2-digit", minute: "2-digit",
    });

    const mensaje = [
      "🆕 *Nuevo registro en MOVEL*",
      `📅 ${fecha.charAt(0).toUpperCase() + fecha.slice(1)}`,
      "",
      `👤 *Nombre:* ${data.name ?? "—"}`,
      `📧 *Correo:* ${data.email ?? "—"}`,
      `📱 *Celular:* ${data.phone ?? "—"}`,
      `📍 *Ciudad:* ${data.city || "No indicada"}`,
      `🌐 *Origen:* ${data.source ?? "web"}`,
      `🏷️ *Usuario:* ${totalUsuarios}`,
      "",
      `🔗 [Ver en el panel](${ADMIN_URL})`,
    ].filter(Boolean).join("\n");

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID   = process.env.TELEGRAM_CHAT_ID;

    if (BOT_TOKEN && CHAT_ID) {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text: mensaje, parse_mode: "Markdown", disable_web_page_preview: true }),
      });
    } else {
      console.log("📋 [MOVEL Registro]:", data);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error en registro:", error);
    return NextResponse.json({ ok: true, warning: "Backup parcial" });
  }
}
