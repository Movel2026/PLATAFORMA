import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Envío de notificación WhatsApp via CallMeBot (gratis, solo requiere activación una vez)
async function notificarWhatsApp(mensaje: string) {
  const phone = process.env.CALLMEBOT_PHONE || "573175737083";
  const apikey = process.env.CALLMEBOT_APIKEY;
  if (!apikey) {
    console.log("📱 [WhatsApp Notif]:", mensaje.slice(0, 100));
    return;
  }
  try {
    const url = `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodeURIComponent(mensaje)}&apikey=${apikey}`;
    await fetch(url);
  } catch (e) {
    console.error("WhatsApp notification error:", e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Notificación WhatsApp inmediata
    const msgWA = `🚗 *MOVEL - Nueva Publicación*\n\n*${data.marca} ${data.modelo} ${data.año}*\nPrecio: $${data.precio}\nCiudad: ${data.ciudad || "N/A"}\nFotos: ${data.totalFotos || 0}\n\n👤 ${data.nombre}\n📧 ${data.email}\n📱 ${data.celular}`;
    await notificarWhatsApp(msgWA);

    // Notificación Telegram (si está configurado)
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
    } catch (_) { /* Telegram es opcional — no bloquear si falla */ }

    // Si no hay config SMTP, retornamos OK de todas formas (MVP sin configurar)
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log("📧 [MOVEL] Publicación recibida (sin SMTP configurado):", data);
      return NextResponse.json({ ok: true, message: "Guardado localmente" });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
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
        <div style="font-family: 'Space Grotesk', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 24px; border-radius: 16px;">
          <div style="background: #1978e5; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 900;">🚗 MOVEL</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px;">Nueva publicación de vehículo</p>
          </div>

          <div style="background: white; border-radius: 12px; padding: 24px; margin-bottom: 16px; border: 1px solid #dce0e5;">
            <h2 style="color: #111418; font-size: 20px; margin: 0 0 16px; font-weight: 800;">
              ${data.marca} ${data.modelo} ${data.año}
            </h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; color: #637488; font-size: 14px; width: 40%;">Precio</td><td style="padding: 8px 0; color: #111418; font-weight: 700; font-size: 16px;">${precioFormateado}</td></tr>
              <tr style="background:#f8f9fa;"><td style="padding: 8px 4px; color: #637488; font-size: 14px;">Versión</td><td style="padding: 8px 4px; color: #111418; font-weight: 600;">${data.version || "N/A"}</td></tr>
              <tr><td style="padding: 8px 0; color: #637488; font-size: 14px;">Kilometraje</td><td style="padding: 8px 0; color: #111418; font-weight: 600;">${data.kilometraje ? data.kilometraje + " km" : "N/A"}</td></tr>
              <tr style="background:#f8f9fa;"><td style="padding: 8px 4px; color: #637488; font-size: 14px;">Color</td><td style="padding: 8px 4px; color: #111418; font-weight: 600;">${data.color || "N/A"}</td></tr>
              <tr><td style="padding: 8px 0; color: #637488; font-size: 14px;">Transmisión</td><td style="padding: 8px 0; color: #111418; font-weight: 600;">${data.transmision || "N/A"}</td></tr>
              <tr style="background:#f8f9fa;"><td style="padding: 8px 4px; color: #637488; font-size: 14px;">Combustible</td><td style="padding: 8px 4px; color: #111418; font-weight: 600;">${data.combustible || "N/A"}</td></tr>
              <tr><td style="padding: 8px 0; color: #637488; font-size: 14px;">Ciudad</td><td style="padding: 8px 0; color: #111418; font-weight: 600;">${data.ciudad || "N/A"}</td></tr>
              <tr style="background:#f8f9fa;"><td style="padding: 8px 4px; color: #637488; font-size: 14px;">Fotos subidas</td><td style="padding: 8px 4px; color: #111418; font-weight: 600;">${data.totalFotos || 0} foto(s)</td></tr>
            </table>
            ${data.descripcion ? `<div style="margin-top: 16px; padding: 12px; background: #f0f2f4; border-radius: 8px;"><p style="color: #637488; font-size: 13px; margin: 0 0 4px; font-weight: 600;">DESCRIPCIÓN:</p><p style="color: #111418; font-size: 14px; margin: 0;">${data.descripcion}</p></div>` : ""}
          </div>

          <div style="background: white; border-radius: 12px; padding: 24px; border: 1px solid #dce0e5;">
            <h3 style="color: #111418; font-size: 16px; margin: 0 0 12px; font-weight: 700;">📞 Datos del vendedor</h3>
            <p style="margin: 4px 0; color: #637488; font-size: 14px;">👤 <strong style="color:#111418;">${data.nombre}</strong></p>
            <p style="margin: 4px 0; color: #637488; font-size: 14px;">📧 <a href="mailto:${data.email}" style="color:#1978e5;">${data.email}</a></p>
            <p style="margin: 4px 0; color: #637488; font-size: 14px;">📱 ${data.celular}</p>
          </div>

          <p style="text-align: center; color: #637488; font-size: 12px; margin-top: 16px;">
            MOVEL · Compra y vende vehículos con confianza en Colombia
          </p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error enviando email:", error);
    // Retornamos ok=true para no bloquear el flujo del usuario en MVP
    return NextResponse.json({ ok: true, warning: "Email no enviado" });
  }
}
