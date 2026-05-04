"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { WhatsappLogo, Gavel, ChatCircle } from "@phosphor-icons/react";

/**
 * Animated MOVEL logo header for inner pages (/buscar, /publicar, /subastas…).
 * The logo entrance: fades in + scale up with the blue glow.
 */
export default function MovelPageHeader() {
  return (
    <header
      className="w-full sticky top-0 z-50"
      style={{
        background: "linear-gradient(135deg, #08101e 0%, #0d1b2e 60%, #0f2040 100%)",
        borderBottom: "1px solid rgba(25,120,229,0.2)",
        boxShadow: "0 4px 32px rgba(0,0,0,0.5)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Logo — animated on mount */}
        <Link href="/" className="flex-shrink-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ filter: "drop-shadow(0 0 16px rgba(25,120,229,0.7))" }}
          >
            <svg width="110" height="33" viewBox="0 0 120 36" fill="none" aria-label="MOVEL">
              <text x="0" y="28" fontFamily="Arial Black, Arial, sans-serif" fontSize="30" fontWeight="900" fontStyle="italic" fill="white">M</text>
              <g>
                <text x="23" y="28" fontFamily="Arial Black, Arial, sans-serif" fontSize="30" fontWeight="900" fontStyle="italic" fill="white">O</text>
                <circle cx="36" cy="16" r="7" fill="#1565c0" />
                <circle cx="36" cy="16" r="7" fill="none" stroke="white" strokeWidth="1.2" />
                <motion.line
                  x1="36" y1="16" x2="36" y2="16"
                  animate={{ x2: 40.5, y2: 10.5 }}
                  transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
                  stroke="white" strokeWidth="1.5" strokeLinecap="round"
                />
                <circle cx="36" cy="16" r="1.2" fill="white" />
                <line x1="29.5" y1="16" x2="31" y2="16" stroke="white" strokeWidth="1" strokeLinecap="round" />
                <line x1="36" y1="9.5" x2="36" y2="11" stroke="white" strokeWidth="1" strokeLinecap="round" />
                <line x1="42.5" y1="16" x2="41" y2="16" stroke="white" strokeWidth="1" strokeLinecap="round" />
              </g>
              <text x="51" y="28" fontFamily="Arial Black, Arial, sans-serif" fontSize="30" fontWeight="900" fontStyle="italic" fill="white">VEL</text>
            </svg>
          </motion.div>
        </Link>

        {/* Nav links */}
        <motion.nav
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
          className="hidden md:flex items-center gap-5"
        >
          <Link href="/buscar" className="text-[13px] font-semibold text-white/60 hover:text-white transition-colors">
            Comprar
          </Link>
          <Link href="/publicar" className="text-[13px] font-semibold text-white/60 hover:text-white transition-colors">
            Vender
          </Link>
          <Link href="/subastas" className="flex items-center gap-1 text-[13px] font-semibold text-[#60a5fa] hover:text-white transition-colors">
            <Gavel size={14} weight="fill" />
            Subastas
          </Link>
          <Link href="/foro" className="flex items-center gap-1 text-[13px] font-semibold text-white/60 hover:text-white transition-colors">
            <ChatCircle size={14} weight="fill" />
            Foro
          </Link>
        </motion.nav>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35, duration: 0.5, ease: "easeOut" }}
          className="flex items-center gap-3 flex-shrink-0"
        >
          <a
            href="https://wa.me/573175737083?text=Hola MOVEL"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#25d366]/20 hover:bg-[#25d366] border border-[#25d366]/40 text-[#25d366] hover:text-white text-[13px] font-bold rounded-xl transition-all"
          >
            <WhatsappLogo size={16} weight="fill" />
            <span>Asesor</span>
          </a>
          <Link
            href="/perfil"
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/8 hover:bg-white/15 border border-white/10 transition-all"
            title="Mi perfil"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" fill="rgba(255,255,255,0.6)" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" fill="none"/>
            </svg>
          </Link>
          <Link
            href="/publicar"
            className="px-4 py-2 bg-[#1978e5] hover:bg-[#1565c0] text-white text-[13px] font-black rounded-xl transition-all"
          >
            Publicar →
          </Link>
        </motion.div>
      </div>
    </header>
  );
}
