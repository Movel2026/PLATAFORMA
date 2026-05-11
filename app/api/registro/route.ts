import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase";

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

    // ── 2. Backup Telegram ─────────────────────────────────
    const fecha = new Date().toLocaleString("es-CO", {
      timeZone: "America/Bogota",
      year: "numeric", month: "long", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

    const mensaje = [
      "👤 *Nuevo registro en MOVEL*",
      `📅 ${fecha}`,
      "",
      `*Nombre:* ${data.name ?? "-"}`,
      `*Correo:* ${data.email ?? "-"}`,
      `*Celular:* ${data.phone ?? "-"}`,
      data.source ? `*Origen:* ${data.source}` : "",
      "",
      "📊 Ver panel: " + (process.env.NEXT_PUBLIC_BASE_URL ?? "https://movelcar.com") + "/admin",
    ].filter(Boolean).join("\n");

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID   = process.env.TELEGRAM_CHAT_ID;

    if (BOT_TOKEN && CHAT_ID) {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text: mensaje, parse_mode: "Markdown" }),
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
