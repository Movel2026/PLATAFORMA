import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/telegram
 * Sends a notification message to your Telegram chat via Bot API.
 *
 * SETUP STEPS (see below for full guide):
 *   1. Create a bot with @BotFather → get BOT_TOKEN
 *   2. Send any message to your bot, then visit:
 *      https://api.telegram.org/bot<BOT_TOKEN>/getUpdates
 *      to find your CHAT_ID
 *   3. Add to .env.local:
 *      TELEGRAM_BOT_TOKEN=7123456789:AAxxxxxxxxxxxxxx
 *      TELEGRAM_CHAT_ID=123456789
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID   = process.env.TELEGRAM_CHAT_ID;

export async function POST(req: NextRequest) {
  try {
    if (!BOT_TOKEN || !CHAT_ID) {
      return NextResponse.json(
        { ok: false, error: "Telegram no configurado. Agrega TELEGRAM_BOT_TOKEN y TELEGRAM_CHAT_ID a .env.local" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { type, data } = body as { type: string; data: Record<string, string> };

    // Build message based on notification type
    let message = "";

    switch (type) {
      case "nueva_publicacion":
        message = [
          "🚗 *Nueva solicitud de publicación*",
          "",
          `👤 *Nombre:* ${data.nombre ?? "-"}`,
          `📱 *Teléfono:* ${data.celular ?? "-"}`,
          `📧 *Email:* ${data.email ?? "-"}`,
          `🚘 *Vehículo:* ${data.marca ?? ""} ${data.modelo ?? ""} ${data.año ?? ""}`,
          `💰 *Precio:* ${data.precio ?? "-"}`,
          `📍 *Ciudad:* ${data.ciudad ?? "-"}`,
          "",
          `👉 Revisa el panel: ${process.env.NEXT_PUBLIC_BASE_URL ?? "https://project-plfci.vercel.app"}/admin`,
        ].join("\n");
        break;

      case "oferta":
        message = [
          "💸 *Nueva oferta en subasta*",
          "",
          `👤 *Ofertante:* ${data.nombre ?? "-"}`,
          `📱 *Teléfono:* ${data.celular ?? "-"}`,
          `🚘 *Vehículo:* ${data.vehiculo ?? "-"}`,
          `💰 *Oferta:* ${data.monto ?? "-"}`,
          "",
          `👉 Ver subasta: ${process.env.NEXT_PUBLIC_BASE_URL ?? "https://project-plfci.vercel.app"}/subastas`,
        ].join("\n");
        break;

      case "consulta_servicio":
        message = [
          "📩 *Nueva consulta de servicio*",
          "",
          `👤 *Nombre:* ${data.nombre ?? "-"}`,
          `📱 *Teléfono:* ${data.celular ?? "-"}`,
          `📧 *Email:* ${data.email ?? "-"}`,
          `💬 *Mensaje:* ${data.mensaje ?? "-"}`,
          `🔧 *Servicio:* ${data.servicio ?? "General"}`,
        ].join("\n");
        break;

      default:
        message = `📬 *Notificación MOVEL*\n\n${JSON.stringify(data, null, 2)}`;
    }

    const telegramRes = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    );

    const result = await telegramRes.json();

    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.description }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
