import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase";

async function notificarWhatsApp(mensaje: string) {
  const phone = process.env.CALLMEBOT_PHONE || "573175737083";
  const apikey = process.env.CALLMEBOT_APIKEY;
  if (!apikey) { console.log("📱 [WhatsApp Notif]:", mensaje.slice(0, 100)); return; }
  try {
    await fetch(`https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(mensaje)}&apikey=${apikey}`);
  } catch (e) { console.error("WhatsApp notification error:", e); }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // ── 1. Guardar en Supabase ──────────────────────────────
    if (supabaseConfigured()) {
      const precioNum = parseInt(String(data.precio).replace(/\D/g, "")) || 0;
      const { error } = await supabaseAdmin.from("publicaciones").insert({
        nombre:       data.nombre      ?? "",
        email:        data.email       ?? "",
        celular:      data.celular     ?? "",
        marca:        data.marca       ?? "",
        modelo:       data.modelo      ?? "",
        ano:          Number(data.año) || null,
        version:      data.version     ?? "",
        precio:       precioNum,
        kilometraje:  Number(data.kilometraje) || null,
        ciudad:       data.ciudad      ?? "",
        color:        data.color       ?? "",
        transmision:  data.transmision ?? "",
        combustible:  data.combustible ?? "",
        descripcion:  data.descripcion ?? "",
        total_fotos:  Number(data.totalFotos) || 0,
        estado:       "pendiente",
      });
      if (error) console.error("[Supabase publicar]:", error.message);
    }

    // ── 2. WhatsApp inmediato ──────────────────────────────
    const msgWA = `🚗 *MOVEL - Nueva Publicación*\n\n*${data.marca} ${data.modelo} ${data.año}*\nPrecio: $${data.precio}\nCiudad: ${data.ciudad || "N/A"}\nFotos: ${data.totalFotos || 0}\n\n👤 ${data.nombre}\n📧 ${data.email}\n📱 ${data.celular}`;
    await notificarWhatsApp(msgWA);

    // ── 3. Backup Telegram ─────────────────────────────────
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/telegram`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "nueva_publicacion",
          data: {
            nombre: data.nombre, celular: data.celular, email: data.email,
            marca: data.marca, modelo: data.modelo, año: data.año,
            precio: data.precio, ciudad: data.ciudad,
          },
        }),
      });
    } catch { /* Telegram es opcional */ }

    // ── 4. Email SMTP (si configurado) ─────────────────────
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log("📧 [MOVEL] Publicación recibida (sin SMTP configurado):", data);
      return NextResponse.json({ ok: true, message: "Guardado" });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    const precioFormateado = data.precio
      ? new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(
          parseInt(data.precio.replace(/\D/g, ""))
        )
      : "No especificado";

    await transporter.sendMail({
      from: `"MOVEL Platform" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
      replyTo: data.email,
      subject: `🚗 Nuevo vehículo publicado: ${data.marca} ${data.modelo} ${data.año}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 24px; border-radius: 16px;">
          <div style="background: #1978e5; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 900;">🚗 MOVEL</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">Nueva publicación de vehículo</p>
          </div>
          <div style="background: white; border-radius: 12px; padding: 24px; border: 1px solid #dce0e5;">
            <h2 style="color: #111418; font-size: 20px; margin: 0 0 16px;">${data.marca} ${data.modelo} ${data.año}</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #637488; font-size: 14px;">Precio</td><td style="padding: 8px 0; font-weight: 700;">${precioFormateado}</td></tr>
              <tr><td style="padding: 8px 0; color: #637488; font-size: 14px;">Ciudad</td><td style="padding: 8px 0; font-weight: 600;">${data.ciudad || "N/A"}</td></tr>
              <tr><td style="padding: 8px 0; color: #637488; font-size: 14px;">Vendedor</td><td style="padding: 8px 0; font-weight: 600;">${data.nombre} · ${data.celular}</td></tr>
              <tr><td style="padding: 8px 0; color: #637488; font-size: 14px;">Fotos</td><td style="padding: 8px 0; font-weight: 600;">${data.totalFotos || 0}</td></tr>
            </table>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error publicar:", error);
    return NextResponse.json({ ok: true, warning: "Email no enviado" });
  }
}
