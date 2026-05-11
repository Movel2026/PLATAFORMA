import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // ── 1. Guardar en Supabase ────────────────────────────────
    if (supabaseConfigured()) {
      const { error } = await supabaseAdmin.from("contactos").insert({
        nombre:   data.nombre   ?? "",
        email:    data.email    ?? "",
        celular:  data.celular  ?? "",
        mensaje:  data.mensaje  ?? "",
        vehiculo: data.vehiculo ?? "",
        estado:   "nuevo",
      });
      if (error) console.error("[Supabase contacto]:", error.message);
    }

    // ── 2. Backup Telegram ───────────────────────────────────
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/telegram`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "consulta_servicio",
          data: {
            nombre: data.nombre, celular: data.celular, email: data.email,
            mensaje: data.mensaje, servicio: data.vehiculo || "General",
          },
        }),
      });
    } catch { /* opcional */ }

    // ── 3. Email SMTP (si configurado) ───────────────────────
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log("📧 [MOVEL] Consulta recibida (sin SMTP):", data);
      return NextResponse.json({ ok: true });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    await transporter.sendMail({
      from: `"MOVEL Platform" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
      replyTo: data.email,
      subject: `💬 Nueva consulta sobre: ${data.vehiculo || "vehículo"}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f8f9fa; border-radius: 16px;">
          <div style="background: #1978e5; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; font-size: 22px;">🚗 MOVEL — Nueva consulta</h1>
          </div>
          <div style="background: white; border-radius: 12px; padding: 24px; border: 1px solid #dce0e5;">
            <h2 style="color: #111418; font-size: 18px; margin: 0 0 16px;">${data.vehiculo || "Vehículo"}</h2>
            <p style="color: #637488; font-size: 14px;"><strong>Nombre:</strong> ${data.nombre}</p>
            <p style="color: #637488; font-size: 14px;"><strong>Email:</strong> ${data.email}</p>
            <p style="color: #637488; font-size: 14px;"><strong>Celular:</strong> ${data.celular || "N/A"}</p>
            <p style="color: #637488; font-size: 14px;"><strong>Mensaje:</strong> ${data.mensaje || "Sin mensaje adicional"}</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error contacto:", error);
    return NextResponse.json({ ok: true });
  }
}
