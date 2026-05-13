"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  MagnifyingGlass, List, X, WhatsappLogo, UserCircle,
  CaretDown, Gavel, Calculator, ChatsCircle, Newspaper,
} from "@phosphor-icons/react";
import { MovelLogo } from "./MovelLogo";
import { useCursorGlow } from "@/lib/hooks/useCursorGlow";

// ── Estructura de navegación jerarquizada ────────────────────────────
// Primario (peso 2x): Comprar · Vender
// Secundario: Subastas · Calculadora · Foro · Blog
const navPrimary = [
  { label: "Comprar", href: "/buscar"   },
  { label: "Vender",  href: "/publicar" },
];

const navSecondary = [
  { label: "Subastas",    href: "/subastas",    icon: Gavel,        hot: true },
  { label: "Calculadora", href: "/calculadora", icon: Calculator,   hot: false },
  { label: "Foro",        href: "/foro",        icon: ChatsCircle,  hot: false },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const glow = useCursorGlow();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cerrar dropdown "Más" al hacer click fuera
  useEffect(() => {
    if (!moreOpen) return;
    const handler = () => setMoreOpen(false);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [moreOpen]);

  // Páginas con su propio header — ocultar Navbar
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/auth")
  ) return null;

  return (
    <nav className={`bg-white border-b border-[#dce0e5] sticky top-0 z-50 transition-all duration-300 ${scrolled ? "navbar-scrolled border-transparent" : ""}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Padding 16px en mobile y 24px+ en md+ para respetar zona de respeto = 1× altura O */}
        <div className="flex items-center justify-between h-[68px]">

          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0 pr-2">
            <MovelLogo variant="primary" size={36} />
          </Link>

          {/* Desktop nav — primario (peso fuerte) + secundario (peso normal) */}
          <div className="hidden md:flex items-center gap-1">
            {/* Primario: Comprar / Vender */}
            {navPrimary.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-5 py-2.5 rounded-xl text-[15px] font-bold tracking-tight transition-all duration-200 ${
                    active
                      ? "text-movel-900 bg-movel-50"
                      : "text-ink hover:text-movel-900 hover:bg-movel-50/60"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Divisor */}
            <span className="w-px h-5 bg-[#dce0e5] mx-2" aria-hidden />

            {/* Secundario */}
            {navSecondary.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 py-2 rounded-lg text-[14px] font-medium transition-all duration-200 ${
                    active
                      ? "text-movel-900"
                      : "text-mute hover:text-ink"
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
          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/buscar"
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-cloud transition-colors"
              title="Buscar vehículos"
            >
              <MagnifyingGlass size={20} color="#7A8195" />
            </Link>
            <Link
              href="/perfil"
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-cloud transition-colors"
              title="Mi cuenta"
            >
              <UserCircle size={22} color="#7A8195" weight="regular" />
            </Link>
            <a
              href="https://wa.me/573175737083?text=Hola%20MOVEL%2C%20quisiera%20hablar%20con%20un%20asesor"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3.5 py-2 bg-[#25d366] text-white rounded-lg text-[13px] font-semibold hover:bg-[#20b858] transition-colors shadow-sm"
            >
              <WhatsappLogo size={15} weight="fill" />
              Asesor
            </a>
            {/* CTA principal: degradado Movel */}
            <Link
              href="/publicar"
              {...glow}
              className="cursor-glow btn-primary text-[14px] !py-2.5 !px-5"
            >
              Publicar vehículo
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-cloud transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {mobileOpen ? <X size={24} color="#15171D" /> : <List size={24} color="#15171D" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#dce0e5] bg-white/95 backdrop-blur-lg px-4 py-4 space-y-1 animate-fade-in-down">
          {/* Primario destacado */}
          {navPrimary.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-4 py-3.5 rounded-xl text-[16px] font-bold text-ink hover:bg-movel-50 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="h-px bg-[#dce0e5] my-2" />
          {/* Secundario */}
          {navSecondary.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-lg text-[14px] font-medium text-mute hover:bg-cloud transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <link.icon size={16} weight="regular" />
                {link.label}
              </span>
              {link.hot && <span className="badge-live">Live</span>}
            </Link>
          ))}
          <div className="pt-3 mt-2 border-t border-[#dce0e5] flex flex-col gap-2">
            <Link
              href="/perfil"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-4 py-3 rounded-lg text-[14px] font-semibold text-ink hover:bg-cloud transition-colors"
            >
              <UserCircle size={20} color="#7A8195" />
              Mi cuenta
            </Link>
            <Link
              href="/publicar"
              onClick={() => setMobileOpen(false)}
              className="btn-primary block w-full text-center !py-3"
            >
              Publicar vehículo
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
