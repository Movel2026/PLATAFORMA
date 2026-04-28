import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { vehicles } from "@/lib/mock-data";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const vehiclesContext = vehicles
  .map(
    (v) =>
      `- ${v.titulo}: ${v.año}, ${v.kilometraje}, ${v.transmision}, ${v.combustible}, ${v.motor}, ${v.cilindros}, ${v.ciudad}, Precio: $${v.precio.toLocaleString("es-CO")} COP, ${v.propietarios.length} propietario(s), Siniestros: ${v.siniestros.length === 0 ? "ninguno" : v.siniestros.join(", ")}`
  )
  .join("\n");

const SYSTEM_PROMPT = `Eres MOVEL IA, el asistente virtual experto en vehículos usados de MOVEL, el marketplace de carros más confiable de Colombia.

Eres amigable, profesional y conoces todo sobre:
- Los vehículos disponibles actualmente en MOVEL
- Financiamiento de vehículos en Colombia (tasas bancarias, plazos, cuotas)
- Gastos de propiedad: impuesto de rodamiento, SOAT, tecnomecánica, mantenimiento, combustible
- Proceso de compra y venta segura
- Historial vehicular y verificaciones

VEHÍCULOS DISPONIBLES ACTUALMENTE:
${vehiclesContext}

REGLAS:
- Responde SIEMPRE en español colombiano, de manera cálida y directa
- Si preguntan por un carro específico, usa los datos reales de arriba
- Para financiamiento: usa tasas reales colombianas (1.18%–1.45% mensual en 2025)
- Para gastos: usa tarifas de Bogotá 2025 (impuesto, SOAT, tecnomecánica)
- Si te preguntan algo fuera de vehículos/MOVEL, lleva la conversación de vuelta al tema
- Cuando alguien esté interesado en comprar, sugiéreles contactar al WhatsApp: wa.me/573175737083
- Cuando alguien quiera vender, dirígelos a /publicar
- Mantén respuestas concisas (máximo 3 párrafos o una lista)
- Usa emojis ocasionalmente para hacer la conversación más amena 🚗`;

export async function POST(req: NextRequest) {
  const { messages } = await req.json();

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({
      role: "assistant",
      content:
        "¡Hola! Soy MOVEL IA. Para activar el asistente, configura la clave ANTHROPIC_API_KEY en el archivo .env.local. Por ahora, puedes contactarnos por WhatsApp al +57 317 573 7083 🚗",
    });
  }

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 600,
    system: SYSTEM_PROMPT,
    messages: messages.map((m: { role: string; content: string }) => ({
      role: m.role,
      content: m.content,
    })),
  });

  const text =
    response.content[0].type === "text" ? response.content[0].text : "";

  return NextResponse.json({ role: "assistant", content: text });
}
