import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase";

/**
 * POST /api/telegram/webhook
 *
 * Webhook de Telegram que procesa comandos cuando el admin escribe al bot.
 * Solo responde si el chat_id coincide con TELEGRAM_CHAT_ID (admin único).
 *
 * Para configurar el webhook (una sola vez):
 *   GET /api/telegram/webhook?setup=1
 * Esto le dice a Telegram que envíe los mensajes a este endpoint.
 *
 * Comandos disponibles (gratuitos, sin IA):
 *   /publicaciones            → últimas 10 publicaciones
 *   /publicaciones hoy        → publicaciones del día
 *   /publicaciones pendientes → solo las que esperan aprobación
 *   /ofertas                  → ofertas recientes
 *   /contactos                → mensajes/consultas
 *   /usuarios                 → totales y nuevos registros
 *   /total                    → resumen general
 *   /buscar <texto>           → busca por marca/modelo/nombre
 *   /help                     → ayuda
 */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

interface TgMessage {
  message_id: number;
  chat: { id: number };
  from: { first_name: string };
  text?: string;
}

async function sendTelegram(chatId: string | number, text: string) {
  if (!BOT_TOKEN) return;
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "Markdown",
      disable_web_page_preview: true,
    }),
  });
}

function formatFecha(iso: string): string {
  return new Date(iso).toLocaleString("es-CO", {
    timeZone: "America/Bogota", day: "numeric", month: "short",
    hour: "2-digit", minute: "2-digit",
  });
}

function fmtCOP(n: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency", currency: "COP", minimumFractionDigits: 0,
  }).format(n);
}

// ── Handlers de comandos ──────────────────────────────────────────────

async function handlePublicaciones(chatId: number, arg?: string) {
  if (!supabaseConfigured()) {
    return sendTelegram(chatId, "⚠️ Base de datos no configurada.");
  }
  let query = supabaseAdmin.from("publicaciones").select("*").order("created_at", { ascending: false }).limit(10);

  if (arg === "hoy") {
    const inicioHoy = new Date(); inicioHoy.setHours(0, 0, 0, 0);
    query = supabaseAdmin.from("publicaciones").select("*").gte("created_at", inicioHoy.toISOString()).order("created_at", { ascending: false });
  } else if (arg === "pendientes") {
    query = supabaseAdmin.from("publicaciones").select("*").eq("estado", "pendiente").order("created_at", { ascending: false }).limit(20);
  } else if (arg === "activos") {
    query = supabaseAdmin.from("publicaciones").select("*").eq("estado", "activo").order("created_at", { ascending: false }).limit(20);
  }

  const { data, error } = await query;
  if (error) return sendTelegram(chatId, `⚠️ Error: ${error.message}`);
  if (!data || data.length === 0) return sendTelegram(chatId, "📭 Sin publicaciones para mostrar.");

  const lines = data.slice(0, 15).map((p, i) => {
    const estado = String(p.estado || "").toUpperCase();
    const icon = estado === "ACTIVO" ? "🟢" : estado === "PENDIENTE" ? "🟡" : estado === "RECHAZADO" ? "🔴" : "⚪";
    return `${icon} *${p.marca} ${p.modelo} ${p.ano ?? ""}*\n   ${fmtCOP(Number(p.precio) || 0)} · ${p.ciudad || "—"} · ${formatFecha(p.created_at)}\n   👤 ${p.nombre || "—"} · 📱 ${p.celular || "—"}`;
  });

  const titulo = arg === "hoy" ? "🗓 *Publicaciones de hoy*"
              : arg === "pendientes" ? "🟡 *Pendientes de aprobación*"
              : arg === "activos" ? "🟢 *Publicaciones activas*"
              : "🚗 *Últimas publicaciones*";

  return sendTelegram(chatId, `${titulo} (${data.length})\n\n${lines.join("\n\n")}`);
}

async function handleOfertas(chatId: number) {
  if (!supabaseConfigured()) return sendTelegram(chatId, "⚠️ Base de datos no configurada.");
  const { data, error } = await supabaseAdmin
    .from("ofertas").select("*").order("created_at", { ascending: false }).limit(10);
  if (error) return sendTelegram(chatId, `⚠️ Error: ${error.message}`);
  if (!data || data.length === 0) return sendTelegram(chatId, "📭 Sin ofertas recientes.");

  const lines = data.map((o) => {
    const pct = Number(o.porcentaje) || 0;
    const sem = pct >= 95 ? "🟢" : pct >= 85 ? "🟡" : "🔴";
    return `${sem} *${o.vehiculo || "—"}*\n   Oferta: ${fmtCOP(Number(o.monto_oferta) || 0)} (${pct}%)\n   👤 ${o.nombre || "—"} · 📱 ${o.celular || "—"}\n   ⏱ ${formatFecha(o.created_at)}`;
  });
  return sendTelegram(chatId, `💰 *Ofertas recientes* (${data.length})\n\n${lines.join("\n\n")}`);
}

async function handleContactos(chatId: number) {
  if (!supabaseConfigured()) return sendTelegram(chatId, "⚠️ Base de datos no configurada.");
  const { data, error } = await supabaseAdmin
    .from("contactos").select("*").order("created_at", { ascending: false }).limit(10);
  if (error) return sendTelegram(chatId, `⚠️ Error: ${error.message}`);
  if (!data || data.length === 0) return sendTelegram(chatId, "📭 Sin consultas recientes.");

  const lines = data.map((c) => {
    return `💬 *${c.nombre || "—"}* (${c.estado || "nuevo"})\n   📱 ${c.celular || "—"} · 📧 ${c.email || "—"}\n   🚘 ${c.vehiculo || "General"}\n   _"${(c.mensaje || "").slice(0, 100)}"_\n   ⏱ ${formatFecha(c.created_at)}`;
  });
  return sendTelegram(chatId, `💬 *Consultas recientes* (${data.length})\n\n${lines.join("\n\n")}`);
}

async function handleUsuarios(chatId: number) {
  if (!supabaseConfigured()) return sendTelegram(chatId, "⚠️ Base de datos no configurada.");
  const { data, error, count } = await supabaseAdmin
    .from("usuarios").select("*", { count: "exact" }).order("created_at", { ascending: false }).limit(5);
  if (error) return sendTelegram(chatId, `⚠️ Error: ${error.message}`);

  const total = count ?? data?.length ?? 0;
  const recientes = (data || []).map((u) => `👤 *${u.nombre || "—"}* · ${u.ciudad || "—"}\n   📧 ${u.email || "—"} · ⏱ ${formatFecha(u.created_at)}`);
  return sendTelegram(chatId, `👥 *Usuarios registrados:* ${total}\n\n*Últimos 5:*\n${recientes.join("\n\n") || "—"}`);
}

async function handleTotal(chatId: number) {
  if (!supabaseConfigured()) return sendTelegram(chatId, "⚠️ Base de datos no configurada.");

  const [pubs, ofs, cons, usrs] = await Promise.all([
    supabaseAdmin.from("publicaciones").select("estado", { count: "exact", head: true }),
    supabaseAdmin.from("ofertas").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("contactos").select("id", { count: "exact", head: true }),
    supabaseAdmin.from("usuarios").select("id", { count: "exact", head: true }),
  ]);

  // Conteo por estado de publicaciones
  const { data: porEstado } = await supabaseAdmin.from("publicaciones").select("estado");
  const cnt: Record<string, number> = {};
  (porEstado || []).forEach((r) => {
    const e = String(r.estado || "—");
    cnt[e] = (cnt[e] ?? 0) + 1;
  });
  const estados = Object.entries(cnt).map(([e, n]) => `  • ${e}: ${n}`).join("\n");

  const msg = [
    "📊 *Resumen MOVEL*",
    "",
    `🚗 Publicaciones: *${pubs.count ?? 0}*`,
    estados,
    "",
    `💰 Ofertas: *${ofs.count ?? 0}*`,
    `💬 Contactos: *${cons.count ?? 0}*`,
    `👥 Usuarios: *${usrs.count ?? 0}*`,
  ].join("\n");

  return sendTelegram(chatId, msg);
}

async function handleBuscar(chatId: number, query: string) {
  if (!supabaseConfigured()) return sendTelegram(chatId, "⚠️ Base de datos no configurada.");
  const q = query.trim();
  if (!q) return sendTelegram(chatId, "Uso: `/buscar <texto>` — busca en marca, modelo, nombre o ciudad.");

  const { data, error } = await supabaseAdmin
    .from("publicaciones")
    .select("*")
    .or(`marca.ilike.%${q}%,modelo.ilike.%${q}%,nombre.ilike.%${q}%,ciudad.ilike.%${q}%`)
    .order("created_at", { ascending: false })
    .limit(10);

  if (error) return sendTelegram(chatId, `⚠️ Error: ${error.message}`);
  if (!data || data.length === 0) return sendTelegram(chatId, `🔍 Sin resultados para *"${q}"*`);

  const lines = data.map((p) => {
    return `• *${p.marca} ${p.modelo} ${p.ano ?? ""}* · ${fmtCOP(Number(p.precio) || 0)}\n   👤 ${p.nombre || "—"} · ${p.ciudad || "—"}`;
  });
  return sendTelegram(chatId, `🔍 *${data.length} resultado(s) para "${q}"*\n\n${lines.join("\n\n")}`);
}

async function handleHelp(chatId: number) {
  const msg = [
    "🤖 *MOVEL Bot — Comandos disponibles*",
    "",
    "📋 *Publicaciones*",
    "`/publicaciones`            últimas 10",
    "`/publicaciones hoy`        del día",
    "`/publicaciones pendientes` esperando revisión",
    "`/publicaciones activos`    publicadas",
    "",
    "💰 `/ofertas`        — ofertas recientes",
    "💬 `/contactos`      — consultas de compradores",
    "👥 `/usuarios`       — usuarios registrados",
    "📊 `/total`          — resumen general",
    "🔍 `/buscar <texto>` — busca por marca/modelo/nombre/ciudad",
    "",
    "❓ `/help`           — esta ayuda",
  ].join("\n");
  return sendTelegram(chatId, msg);
}

// ── Webhook handler ────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body.message as TgMessage | undefined;
    if (!message || !message.text) {
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat.id;

    // Solo responder al admin configurado
    if (ADMIN_CHAT_ID && String(chatId) !== String(ADMIN_CHAT_ID)) {
      await sendTelegram(chatId, "🔒 Este bot es privado de MOVEL. Para consultas escribe a https://wa.me/573175737083");
      return NextResponse.json({ ok: true });
    }

    const text = message.text.trim();
    if (!text.startsWith("/")) {
      await sendTelegram(chatId, "Usa `/help` para ver los comandos disponibles.");
      return NextResponse.json({ ok: true });
    }

    const [cmdRaw, ...rest] = text.split(/\s+/);
    const cmd = cmdRaw.toLowerCase().replace(/@\w+$/, ""); // quitar @bot_name si lo trae
    const arg = rest.join(" ");

    switch (cmd) {
      case "/start":
      case "/help":
        await handleHelp(chatId);
        break;
      case "/publicaciones":
      case "/pub":
        await handlePublicaciones(chatId, arg);
        break;
      case "/ofertas":
        await handleOfertas(chatId);
        break;
      case "/contactos":
        await handleContactos(chatId);
        break;
      case "/usuarios":
        await handleUsuarios(chatId);
        break;
      case "/total":
      case "/resumen":
        await handleTotal(chatId);
        break;
      case "/buscar":
        await handleBuscar(chatId, arg);
        break;
      default:
        await sendTelegram(chatId, `❓ Comando no reconocido: \`${cmd}\`\nUsa \`/help\` para ver los disponibles.`);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}

// ── Setup helper: registra el webhook de Telegram ──
// GET /api/telegram/webhook?setup=1
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  if (url.searchParams.get("setup") !== "1") {
    return NextResponse.json({
      info: "MOVEL Telegram bot webhook",
      setup: "GET con ?setup=1 para registrar el webhook en Telegram",
      commands: ["/publicaciones", "/ofertas", "/contactos", "/usuarios", "/total", "/buscar", "/help"],
    });
  }

  if (!BOT_TOKEN) {
    return NextResponse.json({ error: "TELEGRAM_BOT_TOKEN no configurado" }, { status: 500 });
  }

  const webhookUrl = `${url.origin}/api/telegram/webhook`;
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: webhookUrl, allowed_updates: ["message"] }),
  });
  const data = await res.json();

  // También registrar los comandos para que aparezcan en el menú de Telegram
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setMyCommands`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      commands: [
        { command: "publicaciones", description: "Últimas publicaciones de vehículos" },
        { command: "ofertas",       description: "Ofertas recibidas recientes" },
        { command: "contactos",     description: "Consultas de compradores" },
        { command: "usuarios",      description: "Usuarios registrados" },
        { command: "total",         description: "Resumen general de la plataforma" },
        { command: "buscar",        description: "Buscar por marca, modelo o nombre" },
        { command: "help",          description: "Ver todos los comandos" },
      ],
    }),
  });

  return NextResponse.json({ ok: true, webhook: webhookUrl, telegram: data });
}
