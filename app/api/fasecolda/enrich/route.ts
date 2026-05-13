import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

/**
 * POST /api/fasecolda/enrich
 * Body: { marca, linea, ano }
 *
 * Usa Claude AI para extraer especificaciones técnicas completas
 * a partir del nombre de la referencia Fasecolda.
 *
 * Ejemplo de referencia: "AUDI A5 F5 CABRIO 2.0 TFSI PROGRESSIVE QUATTRO TP 2000CC T TC"
 * → tipologia: Descapotable, cilindraje: 2000, combustible: Gasolina, tipoCaja: Tiptronica...
 */
export async function POST(req: NextRequest) {
  try {
    const { marca, linea, ano } = await req.json();

    if (!marca || !linea) {
      return NextResponse.json({ error: "Faltan marca y linea" }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: "ANTHROPIC_API_KEY no configurado" }, { status: 503 });
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const prompt = `Eres un experto en especificaciones técnicas de vehículos colombianos y en la Guía de Valores Fasecolda.

La siguiente es una referencia técnica oficial de Fasecolda Colombia:

Marca: ${marca}
Línea/Referencia: ${linea}
Año modelo: ${ano || "desconocido"}

Los nombres de referencia Fasecolda contienen información codificada. Por ejemplo:
- "2000CC" o "2.0" indica el cilindraje
- "TP" o "TIPTRONICA" indica transmisión Tiptronica
- "MT" o "MT5/MT6" indica transmisión Manual
- "AT" o "AT6/AT8" indica transmisión Automática
- "CVT" indica CVT
- "DSG" indica Doble Embrague (DCT)
- "CABRIO" o "DESCAPOTABLE" indica tipología Descapotable
- "SEDAN" → Sedán, "SUV" → SUV, "PICK UP" o "DOBLE CABINA" → Pickup/Camioneta
- "TURBO" o "T" al final → motor turboalimentado
- "TC" → Turbo Compresor (gasolina)
- "TDI" / "CRDI" / "CDI" / "DCDI" / "D" → Diésel
- "HYBRID" o "HEV" → Híbrido
- "ELECTRIC" o "EV" → Eléctrico
- "4X4" / "AWD" / "QUATTRO" / "4MOTION" / "XDRIVE" → Tracción 4x4/AWD
- "FWD" / "2WD" / "4X2" → Tracción delantera/2WD

Basándote en la referencia, extrae TODOS los datos técnicos posibles.
Responde ÚNICAMENTE con JSON válido (sin texto antes/después, sin backticks):

{
  "tipologia": "Sedán | SUV | Hatchback | Descapotable | Pickup / Camioneta | Minivan | Coupe | Wagon | Furgoneta",
  "cilindraje": 1598,
  "combustible": "Gasolina | Diésel | Híbrido | Eléctrico | Gas Natural (GNV)",
  "tipoCaja": "Manual | Automático | CVT | Tiptronica | Doble embrague (DCT) | Secuencial",
  "transmision": "descripción de la transmisión incluyendo velocidades si aplica",
  "potencia": 115,
  "potenciaUnidad": "HP",
  "puertas": 4,
  "capacidadPasajeros": 5,
  "traccion": "FWD | RWD | AWD | 4x4 | 4x2",
  "turbo": true,
  "importado": "Si | No",
  "clase": "descripción corta del tipo de vehículo",
  "airbags": 6,
  "confianza": "alta | media | baja"
}

REGLAS:
- "confianza: alta" si la referencia contiene datos explícitos (ej: "2000CC" → cilindraje = 2000 con alta confianza)
- "confianza: media" si inferiste de contexto (ej: la marca/modelo suele tener ese motor)
- Solo devuelve JSON. Nada más.`;

    const response = await client.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 500,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { text: string }).text)
      .join("");

    const cleaned = text.trim().replace(/^```json\s*/i, "").replace(/```$/, "").trim();

    let specs;
    try {
      specs = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ error: "AI no pudo parsear la referencia" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, specs, linea, marca, ano });
  } catch (err) {
    console.error("[fasecolda/enrich]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
