import { MetadataRoute } from "next";
import { vehicles } from "@/lib/mock-data";

/**
 * sitemap.xml dinámico para Next.js 14.
 * Se sirve automáticamente en /sitemap.xml
 *
 * Incluye:
 *  - Rutas estáticas principales (home, buscar, publicar, etc.)
 *  - Rutas dinámicas de /vehiculo/[id] cuando existan publicaciones
 *
 * Cuando integres Supabase/DB, reemplaza `vehicles` por el query real.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://movelcar.com";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`,            lastModified: now, changeFrequency: "daily",   priority: 1.0 },
    { url: `${base}/buscar`,      lastModified: now, changeFrequency: "hourly",  priority: 0.95 },
    { url: `${base}/publicar`,    lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${base}/subastas`,    lastModified: now, changeFrequency: "hourly",  priority: 0.8 },
    { url: `${base}/calculadora`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/foro`,        lastModified: now, changeFrequency: "daily",   priority: 0.6 },
  ];

  // Rutas dinámicas de vehículos publicados
  const vehicleRoutes: MetadataRoute.Sitemap = vehicles.map((v) => ({
    url: `${base}/vehiculo/${v.id}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...vehicleRoutes];
}
