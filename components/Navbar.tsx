"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  List, X, WhatsappLogo, SignIn,
  Gavel, Calculator, ChatsCircle,
} from "@phosphor-icons/react";
import { MovelLogo } from "./MovelLogo";
import { useCursorGlow } from "@/lib/hooks/useCursorGlow";

// Primario (peso visual fuerte): Comprar · Vender
const navPrimary = [
  { label: "Comprar", href: "/buscar"   },
  { label: "Vender",  href: "/publicar" },
];

// Secundario
const navSecondary = [
  { label: "Subastas",    href: "/subastas",    icon: Gavel,        hot: true },
  { label: "Calculadora", href: "/calculadora", icon: Calculator,   hot: false },
  { label: "Foro",        href: "/foro",        icon: ChatsCircle,  hot: false },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const glowPublicar = useCursorGlow();
  const glowLogin    = useCursorGlow();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Ocultar solo en admin/auth
  if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) return null;

  return (
    <nav
      className="sticky top-0 z-50 bg-movel-gradient-dark border-b border-movel-400/15 transition-shadow duration-300"
      style={{ boxShadow: scrolled ? "0 4px 24px rgba(5,14,38,0.4)" : "none" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[68px]">

          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0 pr-2">
            <MovelLogo variant="white" size={36} />
          </Link>

          {/* Desktop nav primario + secundario */}
          <div className="hidden md:flex items-center gap-1">
            {navPrimary.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-5 py-2.5 rounded-xl text-[15px] font-bold tracking-tight transition-all duration-200 ${
                    active
                      ? "text-white bg-white/15"
                      : "text-white/95 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <span className="w-px h-5 bg-white/15 mx-2" aria-hidden />

            {navSecondary.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 py-2 rounded-lg text-[14px] font-medium transition-all duration-200 ${
                    active ? "text-white" : "text-white/65 hover:text-white"
                  }`}
                >
                  {link.label}
                  {link.hot && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-sunset rounded-full animate-pulse-red" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop derecha */}
          <div className="hidden md:flex items-center gap-2.5">
            <a
              href="https://wa.me/573175737083?text=Hola%20MOVEL%2C%20quisiera%20hablar%20con%20un%20asesor"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 bg-[#25d366] text-white rounded-xl text-[13px] font-bold hover:bg-[#20b858] transition-colors shadow-sm"
              title="Hablar con un asesor por WhatsApp"
            >
              <WhatsappLogo size={16} weight="fill" />
              <span className="hidden lg:inline">Asesor</span>
            </a>

            <Link
              href="/auth"
              {...glowLogin}
              className="cursor-glow cursor-glow-dark flex items-center gap-2 px-5 py-2.5 border-2 border-white/40 text-white rounded-xl text-[14px] font-bold hover:bg-white/10 hover:border-white/70 transition-all"
            >
              <SignIn size={17} weight="bold" />
              Iniciar sesión
            </Link>

            <Link
              href="/publicar"
              {...glowPublicar}
              className="cursor-glow btn-sky text-[14px] !py-2.5 !px-5 !rounded-xl"
            >
              Publicar vehículo
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {mobileOpen ? <X size={24} color="white" /> : <List size={24} color="white" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-night/95 backdrop-blur-lg px-4 py-4 space-y-1 animate-fade-in-down">
          {navPrimary.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-4 py-3.5 rounded-xl text-[16px] font-bold text-white hover:bg-white/10 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="h-px bg-white/10 my-2" />
          {navSecondary.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-lg text-[14px] font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <link.icon size={16} weight="regular" />
                {link.label}
              </span>
              {link.hot && <span className="badge-live">Live</span>}
            </Link>
          ))}
          <div className="pt-3 mt-2 border-t border-white/10 flex flex-col gap-2.5">
            <a
              href="https://wa.me/573175737083?text=Hola%20MOVEL%2C%20quisiera%20hablar%20con%20un%20asesor"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-[#25d366] text-white rounded-xl text-[14px] font-bold hover:bg-[#20b858] transition-colors"
            >
              <WhatsappLogo size={18} weight="fill" />
              Hablar con asesor
            </a>
            <Link
              href="/auth"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 py-3 border-2 border-white/40 text-white rounded-xl text-[14px] font-bold hover:bg-white/10 transition-colors"
            >
              <SignIn size={18} weight="bold" />
              Iniciar sesión
            </Link>
            <Link
              href="/publicar"
              onClick={() => setMobileOpen(false)}
              className="btn-sky block w-full text-center !py-3"
            >
              Publicar vehículo
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
