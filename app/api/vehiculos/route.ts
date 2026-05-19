import { NextResponse } from "next/server";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase";

// Forzar ejecución dinámica: sin esto, Next 14 cachea el GET en build-time
// y las publicaciones nuevas no aparecen hasta el siguiente deploy.
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Columnas explícitas para evitar problemas de schema cache tras migraciones
const COLS = [
  "id", "nombre", "celular", "marca", "modelo", "ano", "version",
  "placa", "ultimo_digito_placa", "precio", "kilometraje", "ciudad",
  "color", "transmision", "combustible", "motor", "potencia",
  "carroceria", "pasajeros", "descripcion", "fotos_urls", "total_fotos",
  "accept_offers", "estado", "publicado_por", "created_at",
].join(", ");

export async function GET() {
  if (!supabaseConfigured()) {
    return NextResponse.json({ vehicles: [], configured: false });
  }

  try {
    // Usamos columnas explícitas en lugar de select("*") para evitar
    // problemas con schema cache de PostgREST después de ALTER TABLE
    const { data, error } = await supabaseAdmin
      .from("publicaciones")
      .select(COLS)
      .eq("estado", "activo")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[/api/vehiculos] error:", error.message);
      // Fallback: intentar con select(*) por si las columnas explícitas fallaron
      const fallback = await supabaseAdmin
        .from("publicaciones")
        .select("*")
        .eq("estado", "activo")
        .order("created_at", { ascending: false });
      if (fallback.error) {
        console.error("[/api/vehiculos] fallback error:", fallback.error.message);
        return NextResponse.json({ vehicles: [], error: fallback.error.message }, { status: 500 });
      }
      return buildResponse(fallback.data ?? []);
    }

    console.log(`[/api/vehiculos] ${(data || []).length} activos`);
    return buildResponse(data ?? []);

  } catch (err) {
    console.error("[/api/vehiculos] excepción:", err);
    return NextResponse.json({ vehicles: [], error: String(err) }, { status: 500 });
  }
}

function buildResponse(data: Record<string, unknown>[]) {
  const vehicles = data.map((p) => {
    const id       = String(p.id    ?? "");
    const marca    = String(p.marca  ?? "");
    const modelo   = String(p.modelo ?? "");
    const ano      = Number(p.ano    ?? 0);
    const slug     = `${marca}-${modelo}-${ano}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") + `-${id.slice(0, 6)}`;
    const km = Number(p.kilometraje ?? 0);

    const fotosRaw = Array.isArray(p.fotos_urls) ? (p.fotos_urls as string[]) : [];
    const fotos    = fotosRaw.length > 0
      ? fotosRaw
      : ["https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80"];

    const nombreCompleto      = String(p.nombre ?? "Vendedor").trim();
    const vendedorPrimerNombre = nombreCompleto.split(/\s+/)[0] || "Vendedor";

    const motorStr        = String(p.motor ?? "");
    const cilindrajeMatch = motorStr.match(/(\d{3,4})\s*cc/i);
    const cilindrajeFromMotor = cilindrajeMatch ? `${cilindrajeMatch[1]} cc` : null;

    return {
      id:    slug,
      _supabaseId: id,
      titulo: `${marca} ${modelo} ${ano}`.trim(),
      marca,
      modelo,
      año:    ano,
      precio: Number(p.precio ?? 0),
      kilometraje: km ? `${km.toLocaleString("es-CO")} km` : "0 km",
      transmision: String(p.transmision ?? "Automático"),
      cilindros:   cilindrajeFromMotor ?? "—",
      cilindraje:  cilindrajeFromMotor,
      caballos:    String(p.potencia ?? "—"),
      color:       String(p.color    ?? "—"),
      combustible: String(p.combustible ?? "Gasolina"),
      motor:       motorStr || "—",
      descripcion: String(p.descripcion ?? ""),
      rating: 5,
      fotos,
      vendedor:    { nombre: vendedorPrimerNombre },
      propietarios:[{ nombre: vendedorPrimerNombre, desde: ano, hasta: new Date().getFullYear() }],
      siniestros:  [],
      soat:          { vigente: false, hasta: "Por confirmar" },
      tecnomecanica: { vigente: false, hasta: "Por confirmar" },
      whatsapp:    String(p.celular ?? "573175737083").replace(/\D/g, ""),
      ciudad:      String(p.ciudad ?? "Colombia"),
      tipo:        String(p.carroceria ?? "Sedán"),
      verificado_movel:  p.publicado_por === "movel",
      ultimoDigitoPlaca: (p.ultimo_digito_placa as string | null) ?? null,
      publicado_en:      (p.created_at as string | null) ?? null,
    };
  });

  return NextResponse.json(
    { vehicles, configured: true, count: vehicles.length },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}
