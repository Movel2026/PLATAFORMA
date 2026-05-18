"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  List, X, WhatsappLogo, SignIn, SignOut,
  Gavel, Calculator, ChatsCircle, CaretDown,
  UserCircle,
} from "@phosphor-icons/react";
import { MovelLogo } from "./MovelLogo";
import { useCursorGlow } from "@/lib/hooks/useCursorGlow";
import { useUser } from "@/lib/hooks/useUser";

const navPrimary = [
  { label: "Comprar", href: "/buscar"   },
];

const navSecondary = [
  { label: "Subastas",    href: "/subastas",    icon: Gavel,        hot: true },
  { label: "Calculadora", href: "/calculadora", icon: Calculator,   hot: false },
  { label: "Foro",        href: "/foro",        icon: ChatsCircle,  hot: false },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const glowPublicar = useCursorGlow();
  const glowLogin    = useCursorGlow();
  const { user, signOut } = useUser();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Click fuera para cerrar el menú de usuario
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (pathname.startsWith("/admin") || pathname.startsWith("/auth")) return null;

  const userInitials = user?.user_metadata?.nombre
    ? String(user.user_metadata.nombre).split(" ").slice(0, 2).map((w: string) => w[0]).join("").toUpperCase()
    : user?.email?.[0].toUpperCase() ?? "U";

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

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navPrimary.map((link) => {
              const active = pathname === link.href || pathname.startsWith(link.href + "/");
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-5 py-2.5 rounded-xl text-[15px] font-bold transition-all duration-200 ${
                    active ? "text-white bg-white/15" : "text-white/95 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Vender → va al selector grande */}
            <Link
              href={user ? "/publicar" : "/auth?return=/publicar"}
              className={`px-5 py-2.5 rounded-xl text-[15px] font-bold transition-all duration-200 ${
                pathname.startsWith("/publicar")
                  ? "text-white bg-white/15"
                  : "text-white/95 hover:text-white hover:bg-white/10"
              }`}
            >
              Vender
            </Link>

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

            {user ? (
              /* Menú de usuario logueado */
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border-2 border-white/40 text-white hover:bg-white/10 transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-sky text-white text-[12px] font-black flex items-center justify-center">
                    {userInitials}
                  </div>
                  <span className="text-[13px] font-bold hidden lg:inline">
                    {(user.user_metadata?.nombre as string)?.split(" ")[0] ?? "Mi cuenta"}
                  </span>
                  <CaretDown size={12} weight="bold" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-[#dce0e5] overflow-hidden animate-fade-in-down">
                    <div className="p-4 border-b border-[#f0f2f4]">
                      <p className="font-bold text-ink text-[14px] truncate">{(user.user_metadata?.nombre as string) ?? "Mi cuenta"}</p>
                      <p className="text-[12px] text-mute truncate">{user.email}</p>
                    </div>
                    <Link href="/perfil" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 hover:bg-cloud transition-colors text-[14px] text-ink">
                      <UserCircle size={18} color="#0B1E4E" />
                      Mi perfil
                    </Link>
                    <Link href="/mis-publicaciones" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 hover:bg-cloud transition-colors text-[14px] text-ink">
                      <span className="text-[16px]">🚗</span>
                      Mis publicaciones
                    </Link>
                    <Link href="/favoritos" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 hover:bg-cloud transition-colors text-[14px] text-ink">
                      <span className="text-[16px]">♥</span>
                      Mis favoritos
                    </Link>
                    <button
                      onClick={async () => { await signOut(); setUserMenuOpen(false); }}
                      className="w-full flex items-center gap-2 px-4 py-3 hover:bg-red-50 transition-colors text-[14px] text-red-600 border-t border-[#f0f2f4]"
                    >
                      <SignOut size={18} />
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth"
                {...glowLogin}
                className="cursor-glow cursor-glow-dark flex items-center gap-2 px-5 py-2.5 border-2 border-white/40 text-white rounded-xl text-[14px] font-bold hover:bg-white/10 hover:border-white/70 transition-all"
              >
                <SignIn size={17} weight="bold" />
                Iniciar sesión
              </Link>
            )}

            {/* Publicar vehículo → va al selector grande */}
            <Link
              href={user ? "/publicar" : "/auth?return=/publicar"}
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
          <Link href="/buscar" onClick={() => setMobileOpen(false)} className="flex items-center justify-between px-4 py-3.5 rounded-xl text-[16px] font-bold text-white hover:bg-white/10 transition-colors">
            Comprar
          </Link>
          <Link
            href={user ? "/publicar" : "/auth?return=/publicar"}
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-between px-4 py-3.5 rounded-xl text-[16px] font-bold text-white hover:bg-white/10 transition-colors"
          >
            Vender
          </Link>
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
              className="flex items-center justify-center gap-2 px-4 py-3 bg-[#25d366] text-white rounded-xl text-[14px] font-bold"
            >
              <WhatsappLogo size={18} weight="fill" />
              Hablar con asesor
            </a>
            {user ? (
              <>
                <Link href="/perfil" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 py-3 border-2 border-white/40 text-white rounded-xl text-[14px] font-bold">
                  <UserCircle size={18} weight="bold" />
                  Mi perfil
                </Link>
                <button onClick={async () => { await signOut(); setMobileOpen(false); }} className="flex items-center justify-center gap-2 py-3 text-red-300 rounded-xl text-[14px] font-bold">
                  <SignOut size={18} weight="bold" />
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link href="/auth" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 py-3 border-2 border-white/40 text-white rounded-xl text-[14px] font-bold">
                <SignIn size={18} weight="bold" />
                Iniciar sesión
              </Link>
            )}
            <Link href="/publicar" onClick={() => setMobileOpen(false)} className="btn-sky block w-full text-center !py-3">
              Publicar vehículo
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
