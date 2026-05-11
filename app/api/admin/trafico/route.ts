import { NextRequest, NextResponse } from "next/server";

// GET /api/admin/trafico — métricas de tráfico desde Vercel Analytics API
export async function GET(req: NextRequest) {
  const pin = req.headers.get("x-admin-pin");
  if (pin !== (process.env.ADMIN_PIN || "MOVEL2025")) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const token     = process.env.VERCEL_ACCESS_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;
  const teamId    = process.env.VERCEL_TEAM_ID; // opcional

  if (!token || !projectId) {
    return NextResponse.json({ configured: false }, { status: 200 });
  }

  // Últimos 30 días
  const from = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const to   = new Date().toISOString().split("T")[0];

  const teamParam = teamId ? `&teamId=${teamId}` : "";
  const baseUrl   = `https://vercel.com/api/web-analytics`;

  try {
    // 1. Visitas por día (timeseries)
    const [timeseriesRes, pagesRes, devicesRes, countriesRes, ciudadesRes] = await Promise.all([
      fetch(
        `${baseUrl}/timeseries?projectId=${projectId}&from=${from}&to=${to}&granularity=day&environment=production${teamParam}`,
        { headers: { Authorization: `Bearer ${token}` } }
      ),
      // 2. Páginas más vistas
      fetch(
        `${baseUrl}/pages?projectId=${projectId}&from=${from}&to=${to}&limit=10&environment=production${teamParam}`,
        { headers: { Authorization: `Bearer ${token}` } }
      ),
      // 3. Dispositivos
      fetch(
        `${baseUrl}/devices?projectId=${projectId}&from=${from}&to=${to}&environment=production${teamParam}`,
        { headers: { Authorization: `Bearer ${token}` } }
      ),
      // 4. Países (top 5)
      fetch(
        `${baseUrl}/countries?projectId=${projectId}&from=${from}&to=${to}&limit=5&environment=production${teamParam}`,
        { headers: { Authorization: `Bearer ${token}` } }
      ),
      // 5. Ciudades de Colombia (filtradas por CO)
      fetch(
        `${baseUrl}/cities?projectId=${projectId}&from=${from}&to=${to}&limit=20&environment=production${teamParam}&filter=%7B%22country%22%3A%22CO%22%7D`,
        { headers: { Authorization: `Bearer ${token}` } }
      ),
    ]);

    const [timeseries, pages, devices, countries, ciudadesRaw] = await Promise.all([
      timeseriesRes.ok ? timeseriesRes.json() : null,
      pagesRes.ok      ? pagesRes.json()      : null,
      devicesRes.ok    ? devicesRes.json()    : null,
      countriesRes.ok  ? countriesRes.json()  : null,
      ciudadesRes.ok   ? ciudadesRes.json()   : null,
    ]);

    // Filtrar solo ciudades colombianas si la API no lo hizo automáticamente
    const ciudadesCO: { key: string; total: number }[] = (
      ciudadesRaw?.data ?? ciudadesRaw ?? []
    )
      .filter((c: { country?: string; key: string; total?: number; value?: number }) =>
        !c.country || c.country === "CO" || c.country === "Colombia"
      )
      .slice(0, 5)
      .map((c: { key: string; total?: number; value?: number }) => ({
        key:   c.key,
        total: c.total ?? c.value ?? 0,
      }));

    // Calcular totales
    const visitasPorDia: Record<string, number> = {};
    let totalVisitas = 0;
    let totalSesiones = 0;

    if (timeseries?.data) {
      for (const punto of timeseries.data) {
        const dia = punto.key?.split("T")[0] ?? punto.date?.split("T")[0] ?? "";
        const v   = punto.total ?? punto.value ?? punto.visitors ?? 0;
        if (dia) visitasPorDia[dia] = v;
        totalVisitas  += v;
        totalSesiones += punto.sessions ?? punto.visits ?? v;
      }
    }

    return NextResponse.json({
      configured:   true,
      periodo:      { from, to },
      totalVisitas,
      totalSesiones,
      visitasPorDia,
      paginas:      pages?.data      ?? pages      ?? [],
      dispositivos: devices?.data    ?? devices    ?? [],
      paises:       countries?.data  ?? countries  ?? [],
      ciudadesCO,
    });
  } catch (err) {
    console.error("[admin/trafico]", err);
    return NextResponse.json({ configured: false, error: String(err) }, { status: 200 });
  }
}
