import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase";

const ADMIN_PIN = process.env.ADMIN_PIN || "MOVEL2025";

export async function POST(req: NextRequest) {
  const pin = req.headers.get("x-admin-pin");
  if (pin !== ADMIN_PIN) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }

  if (!supabaseConfigured()) {
    return NextResponse.json({ ok: false, error: "Supabase no configurado" }, { status: 503 });
  }

  try {
    const data = await req.json();

    const fotosUrls: string[] = Array.isArray(data.fotos_urls) ? data.fotos_urls : [];

    const payload = {
      nombre:        "MOVEL",
      email:         "movelcol@outlook.com",
      celular:       "573175737083",
      marca:         String(data.marca        ?? "").trim(),
      modelo:        String(data.modelo       ?? "").trim(),
      ano:           Number(data.ano)          || null,
      version:       String(data.version      ?? "").trim(),
      placa:         String(data.placa        ?? "").trim().toUpperCase() || null,
      ultimo_digito_placa: String(data.ultimo_digito_placa ?? "").trim() || null,
      precio:        parseInt(String(data.precio ?? "0").replace(/\D/g, "")) || 0,
      kilometraje:   parseInt(String(data.kilometraje ?? "0").replace(/\D/g, "")) || 0,
      ciudad:        String(data.ciudad       ?? "").trim(),
      color:         String(data.color        ?? "").trim(),
      transmision:   String(data.transmision  ?? "").trim(),
      combustible:   String(data.combustible  ?? "").trim(),
      motor:         String(data.motor        ?? "").trim(),
      potencia:      String(data.potencia     ?? "").trim(),
      carroceria:    String(data.carroceria   ?? "").trim(),
      pasajeros:     String(data.pasajeros    ?? "").trim(),
      descripcion:   String(data.descripcion  ?? "").trim(),
      fotos_urls:    fotosUrls,
      total_fotos:   fotosUrls.length,
      accept_offers: !!data.accept_offers,
      propietarios:  String(data.propietarios ?? "").trim() || null,
      uso:           String(data.uso          ?? "").trim() || null,
      soat_vigente:  String(data.soat_vigente ?? "").trim() || null,
      soat_hasta:    String(data.soat_hasta   ?? "").trim() || null,
      tecno_vigente: String(data.tecno_vigente?? "").trim() || null,
      tecno_hasta:   String(data.tecno_hasta  ?? "").trim() || null,
      sin_siniestros:!!data.sin_siniestros,
      siniestros_desc:String(data.siniestros_desc??"").trim() || null,
      extras:        String(data.extras       ?? "").trim() || null,
      modo:          "movel",
      estado:        "activo",
      publicado_por: "movel",
    };

    const { data: inserted, error } = await supabaseAdmin
      .from("publicaciones")
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error("[publicar-movel]", error.message);
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: inserted.id });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
