import { MetadataRoute } from "next";

/**
 * robots.txt dinámico para Next.js 14.
 * Permite indexación pública de todo el sitio.
 * Bloquea rutas privadas (/admin, /api, /auth).
 *
 * Se sirve automáticamente en /robots.txt
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/", "/auth"],
      },
    ],
    sitemap: "https://movelcar.com/sitemap.xml",
    host: "https://movelcar.com",
  };
}
