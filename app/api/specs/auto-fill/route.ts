/**
 * POST /api/specs/auto-fill
 *
 * Body: { marca, modelo, version?, ano?, cilindraje? }
 *
 * Usa Claude AI para extraer especificaciones técnicas completas.
 * Funciona con cualquier vehículo del mercado colombiano aunque
 * no esté en la base de datos curada specs-data.ts.
 *
 * La "version" puede ser la referencia oficial Fasecolda/Mintransporte,
 * lo que permite decodificar: transmisión, potencia, combustible, etc.
 *
 * Ejemplos de referencia:
 *   "ONIX PLUS 1.0T AT" → motor 1.0T, automático, gasolina
 *   "HILUX 4X4 2.8 TDI AT" → 2800cc, diésel, automático, 4x4
 *   "SPARK GT 1.0 MT" → 1000cc, manual, gasolina, hatchback
 */

import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { marca, modelo, version, ano, cilindraje } = await req.json();

    if (!marca || !modelo) {
      return NextResponse.json({ error: "Faltan marca y modelo" }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "API key no configurada" }, { status: 503 });
    }

    const referencia = version || modelo;
    const cilContext = cilindraje ? `Cilindraje confirmado en base oficial: ${cilindraje}cc. ` : "";

    const prompt = `Eres un experto en especificaciones técnicas de vehículos del mercado colombiano.

Vehículo a identificar:
- Marca: ${marca}
- Modelo / Referencia: ${referencia}
- Año modelo: ${ano || "no especificado"}
${cilContext}
Instrucciones de decodificación de referencias Ministerio de Transporte Colombia:
- "1.0T" / "1.0 TURBO" → motor 1000cc turbo gasolina
- "1.5T" → 1500cc turbo, "2.0" / "2000CC" → 2000cc
- "2.8 TDI" / "DIESEL" → diésel
- "AT" / "AT6" / "AT8" → automático (número = velocidades)
- "MT" / "MT5" / "MT6" → manual
- "TP" / "TIPTRONICA" → tiptronica
- "CVT" → CVT
- "4X4" / "AWD" → tracción 4x4/AWD
- "4X2" / "FWD" → tracción delantera
- "HV" / "HYBRID" → híbrido
- "EV" / "ELECTRIC" → eléctrico

Responde SOLO con JSON válido (sin texto antes/después ni backticks):

{
  "motor": "descripción del motor (ej: 1.0L Turbo, 2.8L Diesel)",
  "combustible": "Gasolina | Diésel | Híbrido | Híbrido enchufable (PHEV) | Eléctrico | Gas Natural (GNV)",
  "transmision": "Automático | Manual | CVT | Tiptronica | Doble embrague (DCT)",
  "transmisionDetalle": "descripción completa (ej: Automático de 6 velocidades)",
  "potencia": 116,
  "carroceria": "Hatchback | Sedán | SUV | Pickup / Camioneta | Minivan | Coupe | Wagon | Furgoneta",
  "pasajeros": 5,
  "traccion": "FWD | RWD | AWD | 4x4 | 4x2",
  "puertas": 4,
  "turbo": true,
  "confianza": "alta | media | baja"
}`;

    const response = await client.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 400,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { text: string }).text)
      .join("");

    const cleaned = text.trim()
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/, "")
      .trim();

    let specs;
    try {
      specs = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ error: "IA no pudo parsear la respuesta" }, { status: 500 });
    }

    const output = {
      motor:       specs.motor ?? "",
      combustible: specs.combustible ?? "",
      transmision: specs.transmisionDetalle || specs.transmision || "",
      potencia:    specs.potencia ? `${specs.potencia} HP` : "",
      carroceria:  specs.carroceria ?? "",
      pasajeros:   String(specs.pasajeros ?? 5),
      traccion:    specs.traccion ?? "",
      puertas:     String(specs.puertas ?? 4),
      turbo:       specs.turbo ?? false,
      confianza:   specs.confianza ?? "baja",
    };

    return NextResponse.json({ ok: true, specs: output, marca, modelo, version, ano });

  } catch (err) {
    console.error("[specs/auto-fill]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
