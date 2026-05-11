import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const pin = req.headers.get("x-admin-pin") ?? new URL(req.url).searchParams.get("pin");
  if (pin !== (process.env.ADMIN_PIN || "MOVEL2025")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID   = process.env.TELEGRAM_CHAT_ID;

  // Diagnóstico de variables
  const diagnostico = {
    TELEGRAM_BOT_TOKEN: BOT_TOKEN
      ? `✅ Configurado (empieza con: ${BOT_TOKEN.slice(0, 10)}...)`
      : "❌ NO configurado en Vercel",
    TELEGRAM_CHAT_ID: CHAT_ID
      ? `✅ Configurado: ${CHAT_ID}`
      : "❌ NO configurado en Vercel",
  };

  if (!BOT_TOKEN || !CHAT_ID) {
    return NextResponse.json({ ok: false, diagnostico, solucion: "Agrega las variables en Vercel → Settings → Environment Variables y redeploya" });
  }

  // Intentar enviar mensaje de prueba
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: "✅ *MOVEL — Prueba de conexión*\n\nTelegram está correctamente configurado y las notificaciones llegarán aquí.",
        parse_mode: "Markdown",
      }),
    });

    const result = await res.json();

    if (result.ok) {
      return NextResponse.json({ ok: true, diagnostico, mensaje: "✅ Mensaje enviado a Telegram correctamente" });
    } else {
      return NextResponse.json({
        ok: false,
        diagnostico,
        error: result.description,
        solucion: result.description?.includes("chat not found")
          ? "El bot no puede enviarte mensajes. Abre Telegram y escribe /start al bot primero."
          : result.description?.includes("Unauthorized")
          ? "El BOT_TOKEN es incorrecto. Verifica en @BotFather."
          : "Error desconocido — revisa los valores de las variables.",
      });
    }
  } catch (e) {
    return NextResponse.json({ ok: false, diagnostico, error: String(e) });
  }
}
