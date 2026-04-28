import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { vehicles } from "@/lib/mock-data";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  const { query } = await req.json();

  if (!query?.trim()) {
    return NextResponse.json({ ids: vehicles.map((v) => v.id), interpretation: "" });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    // Fallback: búsqueda por texto simple
    const q = query.toLowerCase();
    const ids = vehicles
      .filter(
        (v) =>
          v.titulo.toLowerCase().includes(q) ||
          v.marca.toLowerCase().includes(q) ||
          v.modelo.toLowerCase().includes(q) ||
          v.ciudad.toLowerCase().includes(q) ||
          v.tipo.toLowerCase().includes(q)
      )
      .map((v) => v.id);
    return NextResponse.json({ ids: ids.length > 0 ? ids : vehicles.map((v) => v.id), interpretation: "" });
  }

  const vehicleList = vehicles
    .map(
      (v) =>
        `ID:${v.id} | ${v.titulo} | Año:${v.año} | KM:${v.kilometraje} | Propietarios:${v.propietarios.length} | Siniestros:${v.siniestros.length} | Precio:${v.precio} | Ciudad:${v.ciudad} | Tipo:${v.tipo} | Transmisión:${v.transmision} | Motor:${v.motor}`
    )
    .join("\n");

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 300,
    messages: [
      {
        role: "user",
        content: `Eres un filtro de búsqueda para un marketplace de autos colombiano.

El usuario busca: "${query}"

Vehículos disponibles:
${vehicleList}

Analiza la búsqueda del usuario y devuelve SOLO un JSON con este formato exacto:
{
  "ids": ["id1", "id2"],
  "interpretation": "texto breve de qué entendiste (máx 60 chars)"
}

Reglas:
- Filtra los vehículos que mejor coinciden con la descripción
- Si el usuario menciona año, filtra por año
- Si menciona KM máximos, filtra por kilometraje (convierte a número)
- Si menciona propietario único, filtra propietarios === 1
- Si menciona sin siniestros, filtra siniestros.length === 0
- Si no hay coincidencias exactas, devuelve los más cercanos
- Devuelve SOLO el JSON, sin explicación adicional`,
      },
    ],
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text.trim() : "";

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const parsed = JSON.parse(jsonMatch?.[0] ?? "{}");
    return NextResponse.json({
      ids: parsed.ids ?? vehicles.map((v) => v.id),
      interpretation: parsed.interpretation ?? "",
    });
  } catch {
    return NextResponse.json({ ids: vehicles.map((v) => v.id), interpretation: "" });
  }
}
