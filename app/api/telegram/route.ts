import { NextRequest, NextResponse } from "next/server";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID   = process.env.TELEGRAM_CHAT_ID;
const ADMIN_URL = "https://www.movelcar.com/admin";

export async function POST(req: NextRequest) {
  try {
    if (!BOT_TOKEN || !CHAT_ID) {
      return NextResponse.json({ ok: false, error: "Telegram no configurado" }, { status: 500 });
    }

    const body = await req.json();
    const { type, data } = body as { type: string; data: Record<string, string> };

    const fecha = new Date().toLocaleString("es-CO", {
      timeZone: "America/Bogota", day: "numeric", month: "long",
      hour: "2-digit", minute: "2-digit",
    });

    let message = "";

    switch (type) {

      case "nueva_publicacion":
        message = [
          "🚗 *Nueva publicación de vehículo*",
          `📅 ${fecha}`,
          "",
          `🚘 *${data.marca ?? ""} ${data.modelo ?? ""} ${data.año ?? ""}*`,
          `💰 *Precio:* $${data.precio ?? "—"}`,
          `📍 *Ciudad:* ${data.ciudad ?? "—"}`,
          "",
          "👤 *Vendedor*",
          `  • Nombre: ${data.nombre ?? "—"}`,
          `  • Celular: ${data.celular ?? "—"}`,
          `  • Email: ${data.email ?? "—"}`,
          "",
          `🔗 [Ver en el panel](${ADMIN_URL})`,
        ].join("\n");
        break;

      case "oferta": {
        const monto    = data.monto ?? "—";
        const pct      = Number(data.porcentaje ?? data.monto?.match(/\((\d+)%/)?.[1] ?? 0);
        const semaforo = pct >= 95 ? "🟢" : pct >= 85 ? "🟡" : "🔴";
        message = [
          `💰 *Nueva oferta recibida* ${semaforo}`,
          `📅 ${fecha}`,
          "",
          `🚘 *Vehículo:* ${data.vehiculo ?? "—"}`,
          `💵 *Oferta:* ${monto}`,
          "",
          "👤 *Comprador*",
          `  • Nombre: ${data.nombre ?? "—"}`,
          `  • Celular: ${data.celular ?? "—"}`,
          "",
          data.celular
            ? `📲 [Contactar por WhatsApp](https://wa.me/${data.celular.replace(/\D/g, "")})`
            : "",
          `🔗 [Ver en el panel](${ADMIN_URL})`,
        ].filter(Boolean).join("\n");
        break;
      }

      case "consulta_servicio":
        message = [
          "💬 *Nueva consulta de comprador*",
          `📅 ${fecha}`,
          "",
          data.servicio && data.servicio !== "General"
            ? `🚘 *Vehículo:* ${data.servicio}`
            : "",
          `💬 *Mensaje:* _${data.mensaje ?? "Sin mensaje"}_`,
          "",
          "👤 *Contacto*",
          `  • Nombre: ${data.nombre ?? "—"}`,
          `  • Email: ${data.email ?? "—"}`,
          `  • Celular: ${data.celular ?? "—"}`,
          "",
          data.celular
            ? `📲 [Responder por WhatsApp](https://wa.me/${data.celular.replace(/\D/g, "")})`
            : "",
          `🔗 [Ver en el panel](${ADMIN_URL})`,
        ].filter(Boolean).join("\n");
        break;

      default:
        message = `📬 *Notificación MOVEL*\n📅 ${fecha}\n\n${JSON.stringify(data, null, 2)}`;
    }

    const telegramRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: "Markdown",
        disable_web_page_preview: true,
      }),
    });

    const result = await telegramRes.json();
    if (!result.ok) return NextResponse.json({ ok: false, error: result.description }, { status: 400 });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
