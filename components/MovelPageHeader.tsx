"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { WhatsappLogo, Gavel, ChatCircle, SignIn } from "@phosphor-icons/react";
import { MovelLogo } from "./MovelLogo";
import { useCursorGlow } from "@/lib/hooks/useCursorGlow";

/**
 * Header oscuro reutilizable para páginas internas (/buscar, /publicar, /subastas…).
 * Mantiene la identidad Movel Blue + Sky con el logo compartido animado.
 */
export default function MovelPageHeader() {
  const glowPublicar = useCursorGlow();
  const glowLogin    = useCursorGlow();

  return (
    <header
      className="w-full sticky top-0 z-50 bg-movel-gradient-dark"
      style={{
        borderBottom: "1px solid rgba(63,140,255,0.2)",
        boxShadow: "0 4px 32px rgba(5,14,38,0.5)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 h-[68px] flex items-center justify-between gap-4">

        {/* Logo compartido */}
        <Link href="/" className="flex-shrink-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ filter: "drop-shadow(0 0 16px rgba(63,140,255,0.45))" }}
          >
            <MovelLogo variant="white" size={36} animate />
          </motion.div>
        </Link>

        {/* Nav links */}
        <motion.nav
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
          className="hidden md:flex items-center gap-1"
        >
          <Link href="/buscar"   className="px-3 py-2 rounded-lg text-[14px] font-bold text-white hover:bg-white/10 transition-all">Comprar</Link>
          <Link href="/publicar" className="px-3 py-2 rounded-lg text-[14px] font-bold text-white hover:bg-white/10 transition-all">Vender</Link>
          <span className="w-px h-5 bg-white/15 mx-2" aria-hidden />
          <Link href="/subastas" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium text-movel-300 hover:text-white transition-all">
            <Gavel size={14} weight="fill" />
            Subastas
          </Link>
          <Link href="/calculadora" className="px-3 py-2 rounded-lg text-[13px] font-medium text-white/60 hover:text-white transition-all">
            Calculadora
          </Link>
          <Link href="/foro" className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-medium text-white/60 hover:text-white transition-all">
            <ChatCircle size={14} weight="fill" />
            Foro
          </Link>
        </motion.nav>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35, duration: 0.5, ease: "easeOut" }}
          className="flex items-center gap-2.5 flex-shrink-0"
        >
          <a
            href="https://wa.me/573175737083?text=Hola%20MOVEL"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 px-3.5 py-2.5 bg-[#25d366]/20 hover:bg-[#25d366] border border-[#25d366]/40 text-[#25d366] hover:text-white text-[13px] font-bold rounded-xl transition-all"
          >
            <WhatsappLogo size={16} weight="fill" />
            <span className="hidden lg:inline">Asesor</span>
          </a>
          <Link
            href="/auth"
            {...glowLogin}
            className="cursor-glow cursor-glow-dark hidden sm:flex items-center gap-2 px-4 py-2.5 border-2 border-white/30 text-white text-[13px] font-bold rounded-xl hover:bg-white/10 hover:border-white/50 transition-all"
          >
            <SignIn size={15} weight="bold" />
            Iniciar sesión
          </Link>
          <Link
            href="/publicar"
            {...glowPublicar}
            className="cursor-glow btn-sky text-[13px] !py-2.5 !px-4 !rounded-xl"
          >
            Publicar →
          </Link>
        </motion.div>
      </div>
    </header>
  );
}
