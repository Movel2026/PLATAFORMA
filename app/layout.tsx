import type { Metadata, Viewport } from "next";
import { Inter, Archivo_Black, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import dynamic from "next/dynamic";
import { Analytics } from "@vercel/analytics/next";
const ChatWidget     = dynamic(() => import("@/components/ChatWidget"), { ssr: false });
const SocialBar      = dynamic(() => import("@/components/SocialBar"),  { ssr: false });
const ToastContainer = dynamic(() => import("@/components/Toast"),      { ssr: false });

// ── Sistema tipográfico Movel ─────────────────────────────────────────
// Display: Archivo Black — titulares, 900, italic uppercase
const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  variable: "--font-archivo-black",
  weight: "400", // Archivo Black solo viene en 400 (que ya es 900-equivalente)
  display: "swap",
});

// Body / UI: Inter — legibilidad larga, 400/500/700
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

// Mono: JetBrains Mono — VINs, IDs, kilometrajes
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MOVEL — Nosotros vendemos, tú te relajas",
  description:
    "El marketplace de vehículos más confiable de Colombia. Servicio 360° de compra y venta con historial verificado, financiamiento y garantía. Solo 3% de comisión.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MOVEL",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B1E4E",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%230B1E4E'/><text x='16' y='23' text-anchor='middle' font-size='20' font-weight='900' font-family='Arial' font-style='italic' fill='white'>M</text></svg>" />
      </head>
      <body
        className={`${archivoBlack.variable} ${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-white text-ink`}
      >
        <Navbar />
        <main>{children}</main>
        <ChatWidget />
        <SocialBar />
        <ToastContainer />
        <Analytics />
      </body>
    </html>
  );
}
