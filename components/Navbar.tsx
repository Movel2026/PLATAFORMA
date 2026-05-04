"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { MagnifyingGlass, List, X, WhatsappLogo } from "@phosphor-icons/react";

function MovelLogo() {
  return (
    <svg width="120" height="36" viewBox="0 0 120 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="MOVEL">
      <defs>
        <linearGradient id="movel-grad" x1="0" y1="0" x2="120" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1565c0" />
          <stop offset="55%" stopColor="#1978e5" />
          <stop offset="100%" stopColor="#42a5f5" />
        </linearGradient>
      </defs>
      <text x="0" y="28" fontFamily="Arial Black, Arial, sans-serif" fontSize="30" fontWeight="900" fontStyle="italic" fill="url(#movel-grad)">M</text>
      <g>
        <text x="23" y="28" fontFamily="Arial Black, Arial, sans-serif" fontSize="30" fontWeight="900" fontStyle="italic" fill="url(#movel-grad)">O</text>
        <circle cx="36" cy="16" r="7" fill="#0d1b2e" opacity="0.85" />
        <circle cx="36" cy="16" r="7" fill="none" stroke="white" strokeWidth="1.2" />
        <line x1="36" y1="16" x2="40.5" y2="10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="36" cy="16" r="1.2" fill="white" />
        <line x1="29.5" y1="16" x2="31" y2="16" stroke="white" strokeWidth="1" strokeLinecap="round" />
        <line x1="36" y1="9.5" x2="36" y2="11" stroke="white" strokeWidth="1" strokeLinecap="round" />
        <line x1="42.5" y1="16" x2="41" y2="16" stroke="white" strokeWidth="1" strokeLinecap="round" />
      </g>
      <text x="51" y="28" fontFamily="Arial Black, Arial, sans-serif" fontSize="30" fontWeight="900" fontStyle="italic" fill="url(#movel-grad)">VEL</text>
    </svg>
  );
}

const navLinks = [
  { label: "Comprar",        href: "/buscar" },
  { label: "Subastas",       href: "/subastas", hot: true },
  { label: "Vender",         href: "/publicar" },
  { label: "Foro",           href: "/foro" },
  { label: "¿Cómo funciona?", href: "/#como-funciona" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Páginas con su propio header — ocultar Navbar (hooks ya llamados arriba)
  if (
    pathname.startsWith("/buscar") ||
    pathname.startsWith("/publicar") ||
    pathname.startsWith("/subastas") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/foro") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/perfil")
  ) return null;

  return (
    <nav className={`bg-white border-b border-[#dce0e5] sticky top-0 z-50 transition-all duration-300 ${scrolled ? "navbar-scrolled border-transparent" : ""}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <MovelLogo />
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-lg text-[15px] font-semibold transition-all duration-200 ${
                  pathname === link.href
                    ? "text-[#1978e5] bg-[#e8f0fd]"
                    : "text-[#637488] hover:text-[#111418] hover:bg-[#f0f2f4]"
                }`}
              >
                {link.label}
                {link.hot && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse-red" />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/buscar"
              className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#f0f2f4] transition-colors"
            >
              <MagnifyingGlass size={20} color="#637488" />
            </Link>
            <a
              href="https://wa.me/573175737083?text=Hola%20MOVEL%2C%20quisiera%20hablar%20con%20un%20asesor"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-[#25d366] text-white rounded-lg text-[14px] font-semibold hover:bg-[#20b858] transition-colors shadow-sm"
            >
              <WhatsappLogo size={16} weight="fill" />
              Hablar con asesor
            </a>
            <Link
              href="/publicar"
              className="px-5 py-2.5 text-white rounded-lg text-[14px] font-bold transition-all shadow-sm hover:shadow-md hover:opacity-90 interactive"
              style={{ background: "linear-gradient(135deg, #1565c0 0%, #1978e5 55%, #42a5f5 100%)" }}
            >
              Publicar vehículo
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[#f0f2f4] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={24} color="#111418" /> : <List size={24} color="#111418" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#dce0e5] bg-white/95 backdrop-blur-lg px-4 py-4 space-y-1 animate-fade-in-down">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-between px-4 py-3 rounded-lg text-[15px] font-semibold text-[#111418] hover:bg-[#f0f2f4] transition-colors"
            >
              {link.label}
              {link.hot && <span className="badge-live">En vivo</span>}
            </Link>
          ))}
          <div className="pt-3 border-t border-[#dce0e5]">
            <Link
              href="/publicar"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center py-3 text-white rounded-lg font-bold interactive"
              style={{ background: "linear-gradient(135deg, #1565c0 0%, #1978e5 55%, #42a5f5 100%)" }}
            >
              Publicar vehículo
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
