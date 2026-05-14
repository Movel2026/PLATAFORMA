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
  metadataBase: new URL("https://movelcar.com"),
  title: {
    default: "MOVEL — Compra y vende carros con asesoría 360° en Colombia",
    template: "%s · MOVEL",
  },
  description:
    "Marketplace de vehículos en Colombia con asesoría 360°. Compra carros usados con confianza o vende el tuyo con servicio integral por solo 3% de comisión. Bogotá, Medellín, Cali.",
  keywords: [
    "comprar carro Colombia",
    "vender carro Colombia",
    "carros usados Bogotá",
    "carros usados Medellín",
    "marketplace vehículos Colombia",
    "MOVEL",
    "movelcar",
    "venta de carros 3% comisión",
    "Fasecolda Colombia",
  ],
  authors: [{ name: "MOVEL S.A.S." }],
  creator: "MOVEL",
  publisher: "MOVEL S.A.S.",
  manifest: "/manifest.json",
  alternates: {
    canonical: "https://movelcar.com",
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://movelcar.com",
    siteName: "MOVEL",
    title: "MOVEL — Compra y vende carros con asesoría 360°",
    description:
      "Marketplace de vehículos en Colombia. Compra usados verificados o vende el tuyo con servicio integral por solo 3% de comisión.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "MOVEL — Marketplace de carros en Colombia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MOVEL — Compra y vende carros con asesoría 360°",
    description:
      "Marketplace de vehículos en Colombia con solo 3% de comisión. Servicio integral de venta.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MOVEL",
  },
  verification: {
    // Pega aquí el código que te dará Google Search Console
    // google: "XXXXXXXXXXXXXXXXXXXX",
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
