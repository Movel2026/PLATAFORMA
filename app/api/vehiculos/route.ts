import { NextResponse } from "next/server";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase";

/**
 * GET /api/vehiculos
 *
 * Devuelve las publicaciones con estado = "activo" de Supabase, mapeadas
 * al shape `Vehicle` que consume la UI pública (/buscar, home, /vehiculo/[id]).
 *
 * Cuando una persona publica desde /publicar el registro entra a Supabase
 * con estado = "pendiente". Al pasarlo a "activo" desde /admin, el vehículo
 * aparece automáticamente en este endpoint y en el sitio público.
 */
export async function GET() {
  if (!supabaseConfigured()) {
    return NextResponse.json({ vehicles: [], configured: false });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("publicaciones")
      .select("*")
      .eq("estado", "activo")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[/api/vehiculos]:", error.message);
      return NextResponse.json({ vehicles: [], error: error.message }, { status: 500 });
    }

    // Mapear de la tabla publicaciones al shape Vehicle público
    const vehicles = (data || []).map((p: Record<string, unknown>) => {
      const id = String(p.id ?? "");
      const marca = String(p.marca ?? "");
      const modelo = String(p.modelo ?? "");
      const ano = Number(p.ano ?? 0);
      const slug = `${marca}-${modelo}-${ano}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + `-${id.slice(0, 6)}`;
      const km = Number(p.kilometraje ?? 0);
      // Fotos: leer fotos_urls (jsonb) o array vacío + fallback placeholder
      const fotosRaw = Array.isArray(p.fotos_urls) ? p.fotos_urls as string[] : [];
      const fotos = fotosRaw.length > 0
        ? fotosRaw
        : ["https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80"]; // placeholder genérico

      return {
        id: slug,
        _supabaseId: id,                // ID real para /vehiculo/[id]
        titulo: `${marca} ${modelo} ${ano}`.trim(),
        marca,
        modelo,
        año: ano,
        precio: Number(p.precio ?? 0),
        kilometraje: km ? `${km.toLocaleString("es-CO")} km` : "0 km",
        transmision: String(p.transmision ?? "Automático"),
        cilindros: "—",
        caballos: String(p.potencia ?? "—"),
        color: String(p.color ?? "—"),
        combustible: String(p.combustible ?? "Gasolina"),
        motor: String(p.motor ?? "—"),
        descripcion: String(p.descripcion ?? ""),
        rating: 5,
        fotos,
        propietarios: [{ nombre: "Vendedor verificado", desde: ano, hasta: new Date().getFullYear() }],
        siniestros: [],
        soat:          { vigente: false, hasta: "Por confirmar" },
        tecnomecanica: { vigente: false, hasta: "Por confirmar" },
        whatsapp: String(p.celular ?? "573175737083").replace(/\D/g, ""),
        ciudad: String(p.ciudad ?? "Colombia"),
        tipo: String(p.carroceria ?? "Sedán"),
        ultimoDigitoPlaca: p.ultimo_digito_placa ?? null,
        publicado_en: p.created_at ?? null,
      };
    });

    return NextResponse.json(
      { vehicles, configured: true, count: vehicles.length },
      {
        headers: {
          // Cache edge 30s, stale-while-revalidate 5min → /buscar carga al instante
          "Cache-Control": "public, s-maxage=30, stale-while-revalidate=300",
        },
      }
    );
  } catch (err) {
    return NextResponse.json({ vehicles: [], error: String(err) }, { status: 500 });
  }
}
