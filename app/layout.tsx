import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Noto_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import dynamic from "next/dynamic";
const ChatWidget = dynamic(() => import("@/components/ChatWidget"), { ssr: false });
const SocialBar  = dynamic(() => import("@/components/SocialBar"),  { ssr: false });

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "MOVEL — Compra y vende vehículos seguros en Colombia",
  description:
    "Compra y vende vehículos usados en Colombia con historial verificado, financiamiento y garantía. El marketplace de carros más confiable del país.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MOVEL",
  },
};

export const viewport: Viewport = {
  themeColor: "#1978e5",
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
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='%231978e5'/><text x='16' y='23' text-anchor='middle' font-size='20' font-weight='900' font-family='Arial' fill='white'>M</text></svg>" />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${notoSans.variable} font-sans antialiased bg-[#f8f9fa] text-[#111418]`}
      >
        <Navbar />
        <main>{children}</main>
        <ChatWidget />
        <SocialBar />
      </body>
    </html>
  );
}
