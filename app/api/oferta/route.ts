import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase";

async function notificarWhatsApp(mensaje: string) {
  const phone = process.env.CALLMEBOT_PHONE || "573175737083";
  const apikey = process.env.CALLMEBOT_APIKEY;
  if (!apikey) { console.log("📱 [Oferta WA]:", mensaje.slice(0, 100)); return; }
  try {
    await fetch(`https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(mensaje)}&apikey=${apikey}`);
  } catch (e) { console.error("WA notif error:", e); }
}

export async function POST(req: NextRequest) {
  const data = await req.json();

  const ofertaNum = Number(data.oferta);
  const precioNum = Number(data.precio);
  const pct = precioNum > 0 ? Math.round((ofertaNum / precioNum) * 100) : 0;

  // ── 1. Guardar en Supabase ────────────────────────────────
  if (supabaseConfigured()) {
    const { error } = await supabaseAdmin.from("ofertas").insert({
      vehiculo:     data.vehiculo    ?? "",
      precio_pub:   precioNum,
      monto_oferta: ofertaNum,
      porcentaje:   pct,
      nombre:       data.nombre     ?? "",
      celular:      data.celular    ?? "",
      estado:       "nueva",
    });
    if (error) console.error("[Supabase oferta]:", error.message);
  }

  // ── 2. WhatsApp inmediato ─────────────────────────────────
  const msgWA = `💰 *MOVEL - Nueva Oferta*\n\n*${data.vehiculo}*\nPrecio: $${precioNum.toLocaleString("es-CO")}\n*Oferta: $${ofertaNum.toLocaleString("es-CO")}* (${pct}%)\n\n👤 ${data.nombre}\n📱 ${data.celular}`;
  await notificarWhatsApp(msgWA);

  // ── 3. Backup Telegram ───────────────────────────────────
  try {
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/telegram`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "oferta",
        data: {
          nombre: data.nombre, celular: data.celular,
          vehiculo: data.vehiculo,
          monto: `$${ofertaNum.toLocaleString("es-CO")} (${pct}% del precio)`,
        },
      }),
    });
  } catch { /* opcional */ }

  // ── 4. Email SMTP (si configurado) ───────────────────────
  const smtpConfigured = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
  if (!smtpConfigured) {
    console.log("[OFERTA RECIBIDA]", data);
    return NextResponse.json({ ok: true });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  await transporter.sendMail({
    from: `"MOVEL Ofertas" <${process.env.SMTP_USER}>`,
    to: process.env.CONTACT_EMAIL,
    subject: `💰 Nueva oferta: ${data.vehiculo}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 24px; border-radius: 16px;">
        <div style="background: linear-gradient(135deg, #1565c0, #1978e5); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
          <h1 style="margin: 0; font-size: 22px;">💰 Nueva Oferta Recibida</h1>
        </div>
        <div style="background: white; padding: 20px; border-radius: 12px;">
          <h2 style="color: #111418; margin-top: 0;">${data.vehiculo}</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #f0f2f4;">
              <td style="padding: 10px 0; color: #637488; font-size: 14px;">Precio publicado</td>
              <td style="padding: 10px 0; font-weight: bold; color: #111418; text-align: right;">$${precioNum.toLocaleString("es-CO")}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f0f2f4;">
              <td style="padding: 10px 0; color: #637488; font-size: 14px;">Oferta del comprador</td>
              <td style="padding: 10px 0; font-weight: bold; color: #1978e5; font-size: 20px; text-align: right;">$${ofertaNum.toLocaleString("es-CO")}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f0f2f4;">
              <td style="padding: 10px 0; color: #637488; font-size: 14px;">% del precio</td>
              <td style="padding: 10px 0; font-weight: bold; text-align: right; color: ${pct >= 95 ? "#16a34a" : "#d97706"};">${pct}%</td>
            </tr>
            <tr style="border-bottom: 1px solid #f0f2f4;">
              <td style="padding: 10px 0; color: #637488; font-size: 14px;">Nombre</td>
              <td style="padding: 10px 0; font-weight: bold; color: #111418; text-align: right;">${data.nombre}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #637488; font-size: 14px;">Celular</td>
              <td style="padding: 10px 0; font-weight: bold; color: #111418; text-align: right;">${data.celular}</td>
            </tr>
          </table>
          <div style="margin-top: 16px; padding: 12px; background: #e8f0fd; border-radius: 8px; text-align: center;">
            <a href="https://wa.me/${data.celular?.replace(/\D/g,"")}" style="color: #1978e5; font-weight: bold; font-size: 15px;">
              📱 Contactar por WhatsApp
            </a>
          </div>
        </div>
      </div>
    `,
  });

  return NextResponse.json({ ok: true });
}
