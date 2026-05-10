import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/registro
 * Recibe los datos de un nuevo registro y los envía a Telegram como backup.
 *
 * Body esperado:
 *   { name, email, phone, accountType?, source? }
 */

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const fecha = new Date().toLocaleString("es-CO", {
      timeZone: "America/Bogota",
      year: "numeric", month: "long", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

    // Mensaje formateado para Telegram
    const mensaje = [
      "👤 *Nuevo registro en MOVEL*",
      `📅 ${fecha}`,
      "",
      `*Nombre:* ${data.name ?? "-"}`,
      `*Correo:* ${data.email ?? "-"}`,
      `*Celular:* ${data.phone ?? "-"}`,
      data.accountType ? `*Tipo:* ${data.accountType}` : "",
      data.source ? `*Origen:* ${data.source}` : "",
      "",
      "📊 Ver panel: " + (process.env.NEXT_PUBLIC_BASE_URL ?? "https://movelcar.com") + "/admin",
    ].filter(Boolean).join("\n");

    // Enviar a Telegram si está configurado
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID   = process.env.TELEGRAM_CHAT_ID;

    if (BOT_TOKEN && CHAT_ID) {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: mensaje,
          parse_mode: "Markdown",
        }),
      });
    } else {
      console.log("📋 [MOVEL Registro]:", data);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error en registro:", error);
    return NextResponse.json({ ok: true, warning: "Backup no enviado" });
  }
}
