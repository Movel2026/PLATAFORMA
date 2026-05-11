import { NextResponse } from "next/server";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase";

const BOT_TOKEN  = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID    = process.env.TELEGRAM_CHAT_ID;
const ADMIN_URL  = "https://www.movelcar.com/admin";

// Vercel Analytics — trafico del dia
async function getVisitasHoy(): Promise<{ total: number; ciudadTop: string }> {
  const token     = process.env.VERCEL_ACCESS_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;
  const teamId    = process.env.VERCEL_TEAM_ID;
  if (!token || !projectId) return { total: 0, ciudadTop: "—" };

  const hoy       = new Date().toISOString().split("T")[0];
  const teamParam = teamId ? `&teamId=${teamId}` : "";

  try {
    const [visitasRes, ciudadesRes] = await Promise.all([
      fetch(
        `https://vercel.com/api/web-analytics/timeseries?projectId=${projectId}&from=${hoy}&to=${hoy}&granularity=day&environment=production${teamParam}`,
        { headers: { Authorization: `Bearer ${token}` } }
      ),
      fetch(
        `https://vercel.com/api/web-analytics/cities?projectId=${projectId}&from=${hoy}&to=${hoy}&limit=1&environment=production${teamParam}&filter=%7B%22country%22%3A%22CO%22%7D`,
        { headers: { Authorization: `Bearer ${token}` } }
      ),
    ]);

    const visitas  = visitasRes.ok  ? await visitasRes.json()  : null;
    const ciudades = ciudadesRes.ok ? await ciudadesRes.json() : null;

    const total     = (visitas?.data?.[0]?.total ?? visitas?.data?.[0]?.value ?? 0) as number;
    const ciudadTop = (ciudades?.data?.[0]?.key ?? "—") as string;

    return { total, ciudadTop };
  } catch {
    return { total: 0, ciudadTop: "—" };
  }
}

// Cron: GET /api/telegram/resumen — llamado automáticamente a las 8PM Colombia
export async function GET() {
  if (!BOT_TOKEN || !CHAT_ID) {
    return NextResponse.json({ ok: false, error: "Telegram no configurado" }, { status: 500 });
  }

  const fecha = new Date().toLocaleDateString("es-CO", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
    timeZone: "America/Bogota",
  });
  const fechaCap = fecha.charAt(0).toUpperCase() + fecha.slice(1);

  // Obtener datos de Supabase (hoy)
  const inicioHoy = new Date();
  inicioHoy.setHours(0, 0, 0, 0);
  const inicioISO = inicioHoy.toISOString();

  let registrosHoy = 0, publicacionesHoy = 0, ofertasHoy = 0, consultasHoy = 0;
  let totalUsuarios = 0, totalPublicaciones = 0, mejorOferta = "";
  let ofertasMonto: number[] = [];

  if (supabaseConfigured()) {
    const [regRes, pubRes, ofRes, conRes, totUsRes, totPubRes, ofDataRes] = await Promise.all([
      supabaseAdmin.from("usuarios").select("count", { count: "exact", head: true }).gte("created_at", inicioISO),
      supabaseAdmin.from("publicaciones").select("count", { count: "exact", head: true }).gte("created_at", inicioISO),
      supabaseAdmin.from("ofertas").select("count", { count: "exact", head: true }).gte("created_at", inicioISO),
      supabaseAdmin.from("contactos").select("count", { count: "exact", head: true }).gte("created_at", inicioISO),
      supabaseAdmin.from("usuarios").select("count", { count: "exact", head: true }),
      supabaseAdmin.from("publicaciones").select("count", { count: "exact", head: true }),
      supabaseAdmin.from("ofertas").select("vehiculo,monto_oferta,porcentaje,nombre").gte("created_at", inicioISO).order("monto_oferta", { ascending: false }).limit(1),
    ]);

    registrosHoy     = regRes.count    ?? 0;
    publicacionesHoy = pubRes.count    ?? 0;
    ofertasHoy       = ofRes.count     ?? 0;
    consultasHoy     = conRes.count    ?? 0;
    totalUsuarios    = totUsRes.count  ?? 0;
    totalPublicaciones = totPubRes.count ?? 0;

    const topOferta = ofDataRes.data?.[0];
    if (topOferta) {
      mejorOferta = `${topOferta.vehiculo} · $${Number(topOferta.monto_oferta).toLocaleString("es-CO")} (${topOferta.porcentaje}%) por ${topOferta.nombre}`;
    }

    // Montos de ofertas de hoy para promedio
    const ofAll = await supabaseAdmin.from("ofertas").select("monto_oferta").gte("created_at", inicioISO);
    ofertasMonto = (ofAll.data ?? []).map((o: { monto_oferta: number }) => Number(o.monto_oferta));
  }

  const promedioOferta = ofertasMonto.length
    ? Math.round(ofertasMonto.reduce((a, b) => a + b, 0) / ofertasMonto.length)
    : 0;

  // Tráfico web del día
  const { total: visitasHoy, ciudadTop } = await getVisitasHoy();

  // Calcular emoji de rendimiento
  const actividadTotal = registrosHoy + publicacionesHoy + ofertasHoy + consultasHoy;
  const emoji = actividadTotal >= 10 ? "🔥" : actividadTotal >= 5 ? "📈" : actividadTotal >= 1 ? "✅" : "💤";

  const message = [
    `${emoji} *Resumen del día — MOVEL*`,
    `📅 ${fechaCap}`,
    "",
    "━━━━━━━━━━━━━━━━━━━━",
    "👤 *USUARIOS*",
    `  • Nuevos hoy: *${registrosHoy}*`,
    `  • Total plataforma: *${totalUsuarios}*`,
    "",
    "🚗 *PUBLICACIONES*",
    `  • Nuevas hoy: *${publicacionesHoy}*`,
    `  • Total activas: *${totalPublicaciones}*`,
    "",
    "💰 *OFERTAS*",
    `  • Recibidas hoy: *${ofertasHoy}*`,
    ofertasHoy > 0 && promedioOferta > 0
      ? `  • Promedio: *$${promedioOferta.toLocaleString("es-CO")}*`
      : "",
    mejorOferta
      ? `  • Mejor oferta: ${mejorOferta}`
      : "",
    "",
    "💬 *CONSULTAS*",
    `  • Recibidas hoy: *${consultasHoy}*`,
    "",
    "🌐 *TRÁFICO WEB*",
    `  • Visitas hoy: *${visitasHoy > 0 ? visitasHoy : "—"}*`,
    `  • Ciudad top Colombia: *${ciudadTop}*`,
    "",
    "━━━━━━━━━━━━━━━━━━━━",
    `🔗 [Ver panel admin](${ADMIN_URL})`,
  ].filter(l => l !== "").join("\n");

  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: CHAT_ID, text: message, parse_mode: "Markdown", disable_web_page_preview: true }),
  });

  const result = await res.json();
  if (!result.ok) return NextResponse.json({ ok: false, error: result.description }, { status: 400 });

  return NextResponse.json({ ok: true, message: "Resumen diario enviado" });
}
