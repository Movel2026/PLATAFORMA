import { NextRequest, NextResponse } from "next/server";

/**
 * GET /api/telegram/resumen
 * Envía un resumen diario a Telegram con estadísticas de la plataforma.
 *
 * Se llama automáticamente a las 8:00 PM (Colombia) cada día gracias a
 * la configuración de Vercel Cron en vercel.json.
 *
 * También puedes llamarlo manualmente desde el panel admin.
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID   = process.env.TELEGRAM_CHAT_ID;

// En producción real estos números vendrían de tu base de datos.
// Por ahora son contadores que se pueden pasar como query params
// desde el panel admin, o simulados para el MVP.
function buildResumenMessage(stats: {
  registros: number;
  publicaciones: number;
  consultas: number;
  visitas: number;
  fecha: string;
}) {
  const hora = new Date().toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Bogota",
  });

  return [
    "📊 *Resumen diario MOVEL*",
    `📅 ${stats.fecha} · ${hora} (COL)`,
    "",
    "👥 *Usuarios*",
    `  • Nuevos registros hoy: *${stats.registros}*`,
    "",
    "🚗 *Publicaciones*",
    `  • Vehículos publicados hoy: *${stats.publicaciones}*`,
    "",
    "💬 *Actividad*",
    `  • Consultas recibidas: *${stats.consultas}*`,
    `  • Visitas a la plataforma: *${stats.visitas}*`,
    "",
    "──────────────────",
    "🔗 Panel admin: https://project-plfci.vercel.app/admin",
  ].join("\n");
}

export async function GET(req: NextRequest) {
  try {
    if (!BOT_TOKEN || !CHAT_ID) {
      return NextResponse.json(
        { ok: false, error: "Telegram no configurado" },
        { status: 500 }
      );
    }

    // Parámetros opcionales desde query string (?registros=3&publicaciones=5...)
    const { searchParams } = new URL(req.url);
    const hoy = new Date().toLocaleDateString("es-CO", {
      weekday: "long",
      day: "numeric",
      month: "long",
      timeZone: "America/Bogota",
    });

    const stats = {
      registros:    Number(searchParams.get("registros")    ?? 0),
      publicaciones:Number(searchParams.get("publicaciones") ?? 0),
      consultas:    Number(searchParams.get("consultas")    ?? 0),
      visitas:      Number(searchParams.get("visitas")      ?? 0),
      fecha: hoy.charAt(0).toUpperCase() + hoy.slice(1),
    };

    const message = buildResumenMessage(stats);

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

    return NextResponse.json({ ok: true, message: "Resumen enviado a Telegram" });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
