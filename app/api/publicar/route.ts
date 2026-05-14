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

/**
 * INSERT resiliente: intenta con todos los campos, si falla por columna inexistente
 * recae a un subset mínimo. Esto evita perder publicaciones si la tabla Supabase
 * no tiene aún las columnas nuevas (placa, motor, etc.).
 */
async function insertPublicacion(data: Record<string, unknown>) {
  // ── 1. Intento completo (todos los campos) ──
  const fullPayload = {
    nombre:       String(data.nombre      ?? ""),
    email:        String(data.email       ?? ""),
    celular:      String(data.celular     ?? ""),
    marca:        String(data.marca       ?? ""),
    modelo:       String(data.modelo      ?? ""),
    ano:          Number(data.año) || null,
    version:      String(data.version     ?? ""),
    placa:        String(data.placa       ?? "").toUpperCase(),
    ultimo_digito_placa: (String(data.placa ?? "").match(/\d(?=\D*$|$)/) || [""])[0],
    precio:       parseInt(String(data.precio ?? "").replace(/\D/g, "")) || 0,
    kilometraje:  parseInt(String(data.kilometraje ?? "").replace(/\D/g, "")) || 0,
    ciudad:       String(data.ciudad      ?? ""),
    color:        String(data.color       ?? ""),
    transmision:  String(data.transmision ?? ""),
    combustible:  String(data.combustible ?? ""),
    motor:        String(data.motor       ?? ""),
    potencia:     String(data.potencia    ?? ""),
    carroceria:   String(data.carroceria  ?? ""),
    pasajeros:    String(data.pasajeros   ?? ""),
    descripcion:  String(data.descripcion ?? ""),
    total_fotos:  Number(data.totalFotos) || 0,
    fotos_urls:   Array.isArray(data.fotosUrls) ? data.fotosUrls : [],
    accept_offers: !!data.accept_offers,
    modo:         String(data.modo ?? "gratis"),
    estado:       "pendiente",
  };

  const fullRes = await supabaseAdmin.from("publicaciones").insert(fullPayload).select().single();
  if (!fullRes.error) {
    console.log("✅ [Supabase] Publicación insertada (full):", fullRes.data?.id);
    return { ok: true, id: fullRes.data?.id, full: true };
  }

  console.warn("[Supabase] Insert full fallido:", fullRes.error.message);

  // ── 2. Fallback con subset mínimo (campos garantizados de la tabla original) ──
  const minimalPayload = {
    nombre:       fullPayload.nombre,
    email:        fullPayload.email,
    celular:      fullPayload.celular,
    marca:        fullPayload.marca,
    modelo:       fullPayload.modelo,
    ano:          fullPayload.ano,
    version:      fullPayload.version,
    precio:       fullPayload.precio,
    kilometraje:  fullPayload.kilometraje,
    ciudad:       fullPayload.ciudad,
    color:        fullPayload.color,
    transmision:  fullPayload.transmision,
    combustible:  fullPayload.combustible,
    descripcion:  fullPayload.descripcion,
    total_fotos:  fullPayload.total_fotos,
    estado:       "pendiente",
  };

  const minRes = await supabaseAdmin.from("publicaciones").insert(minimalPayload).select().single();
  if (!minRes.error) {
    console.log("✅ [Supabase] Publicación insertada (minimal fallback):", minRes.data?.id);
    return {
      ok: true,
      id: minRes.data?.id,
      full: false,
      warning: "Insertada con campos básicos. Ejecuta el ALTER TABLE para guardar también placa, motor, potencia, fotos_urls, etc.",
    };
  }

  console.error("[Supabase] Insert minimal también falló:", minRes.error.message);
  return { ok: false, error: minRes.error.message };
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // ── 1. Guardar en Supabase ──────────────────────────────
    let supabaseResult: { ok: boolean; id?: string; warning?: string; error?: string } = { ok: false };
    if (supabaseConfigured()) {
      supabaseResult = await insertPublicacion(data);
      if (!supabaseResult.ok) {
        console.error("❌ [Supabase] Insert falló por completo. Verifica las env vars y el SQL schema.");
      }
    } else {
      console.warn("⚠️ Supabase NO configurado — la publicación solo va a WhatsApp/Telegram, NO al admin.");
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
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || "smtp.gmail.com",
          port: Number(process.env.SMTP_PORT) || 587,
          secure: false,
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        });

        const precioFormateado = data.precio
          ? new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(
              parseInt(String(data.precio).replace(/\D/g, ""))
            )
          : "No especificado";

        await transporter.sendMail({
          from: `"MOVEL Platform" <${process.env.SMTP_USER}>`,
          to: process.env.CONTACT_EMAIL || process.env.SMTP_USER,
          replyTo: data.email,
          subject: `🚗 Nuevo vehículo: ${data.marca} ${data.modelo} ${data.año}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #0B1E4E; padding: 24px; border-radius: 12px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 22px;">MOVEL — Nueva publicación</h1>
              </div>
              <div style="background: white; border: 1px solid #dce0e5; border-radius: 12px; padding: 24px; margin-top: 16px;">
                <h2 style="color: #111418; font-size: 20px;">${data.marca} ${data.modelo} ${data.año}</h2>
                <p><strong>Precio:</strong> ${precioFormateado}</p>
                <p><strong>Ciudad:</strong> ${data.ciudad || "N/A"}</p>
                <p><strong>Vendedor:</strong> ${data.nombre} · ${data.celular}</p>
                <p><strong>Fotos:</strong> ${data.totalFotos || 0}</p>
                <p><strong>Modo:</strong> ${data.modo === "360" ? "Servicio Integral 360°" : "Publicación gratuita"}</p>
              </div>
            </div>
          `,
        });
      } catch (e) {
        console.error("Email error:", e);
      }
    }

    return NextResponse.json({
      ok: true,
      supabase: supabaseResult,
      message: supabaseResult.ok
        ? "Publicación recibida y guardada"
        : "Publicación recibida (notificada por WhatsApp/Telegram, pero no guardada en BD — verifica config)",
    });
  } catch (error) {
    console.error("Error publicar:", error);
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
