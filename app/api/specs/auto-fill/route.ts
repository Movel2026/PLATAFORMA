import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// POST /api/specs/auto-fill
// Body: { marca, modelo, version, ano }
// Devuelve especificaciones técnicas usando Claude AI
export async function POST(req: NextRequest) {
  try {
    const { marca, modelo, version, ano } = await req.json();

    if (!marca || !modelo) {
      return NextResponse.json({ error: "Faltan marca/modelo" }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({
        error: "AI no configurado",
        fallback: true,
      }, { status: 503 });
    }

    const prompt = `Eres un experto en especificaciones técnicas de vehículos vendidos en Colombia. Dame las especificaciones técnicas EXACTAS del siguiente vehículo:

Marca: ${marca}
Modelo: ${modelo}
${version ? `Versión: ${version}` : ""}
${ano ? `Año: ${ano}` : ""}

Responde ÚNICAMENTE con un objeto JSON válido (sin texto antes o después, sin backticks de código) con esta estructura exacta:

{
  "motor": "ej: 4 cil DOHC VVT-i",
  "cilindrada": "ej: 1.998 cc",
  "potencia": "ej: 170 HP / 6.600 rpm",
  "combustible": "Gasolina | Diésel | Híbrido | Eléctrico | Gas Natural (GNV)",
  "transmision": "Manual | Automático | CVT | Doble embrague (DCT)",
  "traccion": "FWD | RWD | AWD | 4x4 | 4x2",
  "carroceria": "Hatchback | Sedán | SUV | Pickup / Camioneta | Minivan | Coupe | Wagon",
  "puertas": 4,
  "pasajeros": 5,
  "consumo": "ej: 7.5 L/100km",
  "torque": "ej: 200 Nm / 4.400 rpm",
  "normaEmision": "ej: Euro 5",
  "confianza": "alta | media | baja",
  "fuente": "Descripción breve de la fuente o estimación"
}

REGLAS IMPORTANTES:
1. Si no estás seguro de un valor exacto, usa el valor más común para ese modelo/versión en el mercado colombiano
2. "confianza" debe ser "alta" si conoces bien el modelo, "media" si es estimación basada en la familia, "baja" si es incierto
3. Para "motor" usa formato corto: "4 cil DOHC", "3 cil Turbo"
4. Si no puedes determinar un campo, ponlo como cadena vacía "" pero NUNCA omitas el campo
5. SOLO devuelve el JSON, nada más`;

    const response = await client.messages.create({
      model: "claude-3-5-haiku-20241022", // rápido y económico para esto
      max_tokens: 600,
      messages: [{ role: "user", content: prompt }],
    });

    // Extraer texto de la respuesta
    const text = response.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { text: string }).text)
      .join("");

    // Parsear JSON (limpiando posibles backticks)
    const cleaned = text.trim().replace(/^```json\s*/, "").replace(/```$/, "").trim();
    let specs;
    try {
      specs = JSON.parse(cleaned);
    } catch (e) {
      console.error("[specs auto-fill] JSON parse error:", e, "Raw:", cleaned.slice(0, 200));
      return NextResponse.json({ error: "AI no pudo generar specs válidas" }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      specs,
      source: "ai",
    });

  } catch (err) {
    console.error("[specs auto-fill]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
