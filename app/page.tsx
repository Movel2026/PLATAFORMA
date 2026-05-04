"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MagnifyingGlass, ShieldCheck, CurrencyCircleDollar,
  ClipboardText, ArrowRight, WhatsappLogo,
  Phone, CheckCircle, CaretDown, SlidersHorizontal,
  Gavel, Clock, Fire,
} from "@phosphor-icons/react";
import { vehicles, getAuctionVehicles, formatCOP } from "@/lib/mock-data";
import VehicleCard from "@/components/VehicleCard";
import BottomNav from "@/components/BottomNav";

// ── Shared transition helpers (framer-motion v12 needs `as const` on ease) ──

const EASE_OUT = "easeOut" as const;

const staggerGrid = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
} as const;

const cardReveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
} as const;

// ── Data ─────────────────────────────────────────────────────────────────

const marcas = [
  "Toyota", "Mazda", "Chevrolet", "Kia", "Renault",
  "Hyundai", "Nissan", "Ford", "Honda", "Mitsubishi",
];

// ── Minimalist 2D SVG car silhouettes (gray, no emoji) ──────────────────

function SedanIcon() {
  return (
    <svg viewBox="0 0 80 44" fill="none" className="w-14 h-8">
      <path d="M5,37 L5,25 L18,25 L24,13 L56,13 L62,21 L75,21 L75,37 Z" fill="#9ca3af"/>
      <path d="M21,24 L25,15 L50,15 L50,24 Z" fill="#d1d5db"/>
      <path d="M52,24 L52,15 L60,15 L64,21 L64,24 Z" fill="#d1d5db"/>
      <circle cx="18" cy="37" r="7" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="2.5"/>
      <circle cx="62" cy="37" r="7" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="2.5"/>
    </svg>
  );
}
function HatchbackIcon() {
  return (
    <svg viewBox="0 0 80 44" fill="none" className="w-14 h-8">
      <path d="M5,37 L5,27 L18,27 L24,13 L52,13 L66,31 L75,31 L75,37 Z" fill="#9ca3af"/>
      <path d="M21,26 L25,15 L50,15 L50,26 Z" fill="#d1d5db"/>
      <circle cx="18" cy="37" r="7" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="2.5"/>
      <circle cx="62" cy="37" r="7" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="2.5"/>
    </svg>
  );
}
function SuvIcon() {
  return (
    <svg viewBox="0 0 80 44" fill="none" className="w-14 h-8">
      <path d="M5,37 L5,18 L16,18 L22,8 L62,8 L66,14 L75,14 L75,37 Z" fill="#9ca3af"/>
      <path d="M19,18 L23,10 L44,10 L44,18 Z" fill="#d1d5db"/>
      <path d="M46,18 L46,10 L62,10 L64,14 L64,18 Z" fill="#d1d5db"/>
      <circle cx="19" cy="37" r="8" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="2.5"/>
      <circle cx="61" cy="37" r="8" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="2.5"/>
    </svg>
  );
}
function CamionetaIcon() {
  return (
    <svg viewBox="0 0 80 44" fill="none" className="w-14 h-8">
      <path d="M5,37 L5,17 L18,17 L22,8 L64,8 L70,17 L75,20 L75,37 Z" fill="#9ca3af"/>
      <path d="M19,17 L22,10 L44,10 L44,17 Z" fill="#d1d5db"/>
      <circle cx="19" cy="37" r="8" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="2.5"/>
      <circle cx="62" cy="37" r="8" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="2.5"/>
    </svg>
  );
}
function CoupeIcon() {
  return (
    <svg viewBox="0 0 80 44" fill="none" className="w-14 h-8">
      <path d="M5,37 L5,29 L20,29 L30,14 L58,13 L68,27 L75,27 L75,37 Z" fill="#9ca3af"/>
      <path d="M24,28 L32,16 L54,15 L54,28 Z" fill="#d1d5db"/>
      <circle cx="18" cy="37" r="7" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="2.5"/>
      <circle cx="62" cy="37" r="7" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="2.5"/>
    </svg>
  );
}
function PickupIcon() {
  return (
    <svg viewBox="0 0 80 44" fill="none" className="w-14 h-8">
      {/* Cab */}
      <path d="M5,37 L5,18 L15,18 L19,9 L42,9 L42,37 Z" fill="#9ca3af"/>
      <path d="M17,18 L20,11 L40,11 L40,18 Z" fill="#d1d5db"/>
      {/* Bed */}
      <path d="M42,26 L42,37 L75,37 L75,26 Z" fill="#9ca3af"/>
      <line x1="42" y1="26" x2="75" y2="26" stroke="#7b8a9b" strokeWidth="1.5"/>
      <circle cx="18" cy="37" r="8" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="2.5"/>
      <circle cx="62" cy="37" r="8" fill="#f3f4f6" stroke="#9ca3af" strokeWidth="2.5"/>
    </svg>
  );
}

const tipos = [
  { label: "SUV",       icon: <SuvIcon /> },
  { label: "Sedán",     icon: <SedanIcon /> },
  { label: "Hatchback", icon: <HatchbackIcon /> },
  { label: "Camioneta", icon: <CamionetaIcon /> },
  { label: "Coupé",     icon: <CoupeIcon /> },
  { label: "Pick-up",   icon: <PickupIcon /> },
];

// ── Component ─────────────────────────────────────────────────────────────

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery]           = useState("");
  const [showFilters, setFilters]   = useState(false);
  const [fMarca, setFMarca]         = useState("");
  const [fTipo, setFTipo]           = useState("");
  const [fTransmision, setFTrans]   = useState("");
  const [fPrecioMax, setFPrecio]    = useState("200000000");
  const auctionVehicles             = getAuctionVehicles();

  // ── Video intro state ──────────────────────────────────────────────────
  // showLogo = logo video is the active BG; when it ends we cross-fade to car video
  const [showLogo, setShowLogo] = useState(true);
  const logoVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Fallback: switch to car video after 7 s if onEnded doesn't fire
    const t = setTimeout(() => setShowLogo(false), 7000);
    return () => clearTimeout(t);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (fMarca)       params.set("marca", fMarca);
    if (fTipo)        params.set("tipo", fTipo);
    if (fTransmision) params.set("transmision", fTransmision);
    if (fPrecioMax && fPrecioMax !== "200000000") params.set("precioMax", fPrecioMax);
    router.push(`/buscar${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <div className="min-h-screen bg-white">

      {/* ══════════════════════════════════════════════════════
          HERO — Intro orgánico: logo video → cross-fade → car video
      ══════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

        {/* Logo intro video — empieza visible, desaparece con cross-fade */}
        <video
          ref={logoVideoRef}
          src="/videos/logo-movel.mp4"
          autoPlay muted playsInline
          onEnded={() => setShowLogo(false)}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms]"
          style={{ opacity: showLogo ? 1 : 0, zIndex: 2 }}
        />

        {/* Car video en loop — empieza invisible, aparece cuando intro termina */}
        <video
          src="/videos/video-fondo.mp4"
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms]"
          style={{ opacity: showLogo ? 0 : 1, zIndex: 1 }}
        />

        {/* Overlay: más suave para dejar ver las luces del carro */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-[#08101e]" style={{ zIndex: 3 }} />

        {/* Contenido del hero */}
        <div className="relative flex flex-col items-center px-4 pt-20 pb-16 w-full" style={{ zIndex: 10 }}>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-6"
          >
            <span className="inline-flex items-center gap-2 bg-[#1978e5]/20 border border-[#1978e5]/40 text-[#93c5fd] text-[12px] font-bold px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-[#60a5fa] rounded-full animate-pulse" />
              🇨🇴 El marketplace de carros más confiable de Colombia
            </span>
          </motion.div>

          {/* MOVEL logo SVG animado */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: EASE_OUT }}
            className="mb-6"
            style={{ filter: "drop-shadow(0 0 40px rgba(25,120,229,0.8))" }}
          >
            <svg width="320" height="96" viewBox="0 0 120 36" fill="none" aria-label="MOVEL">
              <text x="0" y="28" fontFamily="Arial Black, Arial, sans-serif" fontSize="30" fontWeight="900" fontStyle="italic" fill="white">M</text>
              <g>
                <text x="23" y="28" fontFamily="Arial Black, Arial, sans-serif" fontSize="30" fontWeight="900" fontStyle="italic" fill="white">O</text>
                <circle cx="36" cy="16" r="7" fill="#1565c0" />
                <circle cx="36" cy="16" r="7" fill="none" stroke="white" strokeWidth="1.2" />
                <motion.line x1="36" y1="16" x2="36" y2="16"
                  animate={{ x2: 40.5, y2: 10.5 }}
                  transition={{ delay: 0.9, duration: 0.5, ease: EASE_OUT }}
                  stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="36" cy="16" r="1.2" fill="white" />
                <line x1="29.5" y1="16" x2="31" y2="16" stroke="white" strokeWidth="1" strokeLinecap="round" />
                <line x1="36" y1="9.5" x2="36" y2="11" stroke="white" strokeWidth="1" strokeLinecap="round" />
                <line x1="42.5" y1="16" x2="41" y2="16" stroke="white" strokeWidth="1" strokeLinecap="round" />
              </g>
              <text x="51" y="28" fontFamily="Arial Black, Arial, sans-serif" fontSize="30" fontWeight="900" fontStyle="italic" fill="white">VEL</text>
            </svg>
          </motion.div>

          {/* Tagline */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.65 }}
            className="text-center text-[26px] md:text-[44px] font-black leading-[1.1] tracking-[-0.025em] text-white mb-3 max-w-2xl"
          >
            Compra y vende tu carro{" "}
            <span className="gradient-text">con total confianza</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.5 }}
            className="text-[15px] text-white/60 text-center mb-8 max-w-md"
          >
            Historial verificado · Peritaje profesional · Financiamiento en 24h
          </motion.p>

          {/* Buscador */}
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.55 }}
            className="w-full max-w-xl bg-white rounded-2xl p-2 flex gap-2 shadow-2xl shadow-black/50 mb-7"
          >
            <div className="flex-1 flex items-center gap-3 bg-[#f0f2f4] rounded-xl px-4 py-3">
              <MagnifyingGlass size={18} color="#637488" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Marca, modelo, ciudad..."
                className="flex-1 bg-transparent text-[#111418] text-[14px] outline-none placeholder-[#637488]"
              />
            </div>
            <button type="submit" className="btn-primary px-6 py-3 text-[14px] rounded-xl font-bold flex-shrink-0">
              Buscar
            </button>
          </motion.form>

          {/* Botones de acción */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, duration: 0.5 }}
            className="flex gap-3 mb-4 w-full max-w-xl"
          >
            <Link href="/publicar"
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 bg-white/12 hover:bg-white/20 border-2 border-white/25 text-white font-black text-[15px] rounded-2xl transition-all hover:-translate-y-0.5"
            >
              <ArrowRight size={18} weight="bold" />
              Vender mi carro
            </Link>
            <button
              type="button"
              onClick={() => setFilters((v) => !v)}
              className={`flex items-center gap-2 px-5 py-3.5 font-bold text-[15px] rounded-2xl border-2 transition-all hover:-translate-y-0.5 ${
                showFilters ? "bg-[#1978e5] border-[#1978e5] text-white" : "bg-white/12 border-white/25 text-white hover:bg-white/20"
              }`}
            >
              <SlidersHorizontal size={18} weight="bold" />
              Filtros
              <motion.span animate={{ rotate: showFilters ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <CaretDown size={14} />
              </motion.span>
            </button>
          </motion.div>

          {/* Panel de filtros colapsable */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -8 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -8 }}
                transition={{ duration: 0.3, ease: "easeOut" as const }}
                className="w-full max-w-xl overflow-hidden mb-6"
              >
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <select value={fMarca} onChange={(e) => setFMarca(e.target.value)}
                    className="bg-white/15 border border-white/20 text-white text-[13px] rounded-xl px-3 py-2.5 outline-none [&>option]:bg-[#0d1b2e]">
                    <option value="">Marca</option>
                    {["Toyota","Mazda","Chevrolet","Kia","Renault","Hyundai","Nissan","Ford"].map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <select value={fTipo} onChange={(e) => setFTipo(e.target.value)}
                    className="bg-white/15 border border-white/20 text-white text-[13px] rounded-xl px-3 py-2.5 outline-none [&>option]:bg-[#0d1b2e]">
                    <option value="">Tipo</option>
                    {["SUV","Sedán","Hatchback","Camioneta","Coupé"].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <select value={fTransmision} onChange={(e) => setFTrans(e.target.value)}
                    className="bg-white/15 border border-white/20 text-white text-[13px] rounded-xl px-3 py-2.5 outline-none [&>option]:bg-[#0d1b2e]">
                    <option value="">Transmisión</option>
                    <option value="Automático">Automático</option>
                    <option value="Manual">Manual</option>
                  </select>
                  <select value={fPrecioMax} onChange={(e) => setFPrecio(e.target.value)}
                    className="bg-white/15 border border-white/20 text-white text-[13px] rounded-xl px-3 py-2.5 outline-none [&>option]:bg-[#0d1b2e]">
                    <option value="200000000">Precio máx</option>
                    <option value="30000000">$30M</option>
                    <option value="50000000">$50M</option>
                    <option value="80000000">$80M</option>
                    <option value="120000000">$120M</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scroll caret */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
            <motion.div animate={{ y: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 1.9, ease: "easeInOut" }}>
              <CaretDown size={22} color="rgba(255,255,255,0.3)" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          BRIDGE — dark feature strip connecting hero to content
      ══════════════════════════════════════════════════════ */}
      <div style={{ background: "#0d1b2e" }} className="border-t border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4"
          >
            {[
              { num: "+500", label: "Vehículos verificados" },
              { num: "98%",  label: "Clientes satisfechos" },
              { num: "24h",  label: "Tiempo de respuesta" },
              { num: "3",    label: "Años en el mercado" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: EASE_OUT }}
                viewport={{ once: true }}
                className="text-center px-6 py-2"
              >
                <p className="text-[28px] font-black text-white">{s.num}</p>
                <p className="text-[12px] text-white/45 font-medium mt-0.5">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Wave transition from dark to white */}
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
          <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="white" />
        </svg>
      </div>

      {/* ══════════════════════════════════════════════════════
          MARCAS — minimalist dark-gray text, no animation
      ══════════════════════════════════════════════════════ */}
      <section className="bg-white pt-2 pb-10 border-b border-[#e5e7eb]">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-center text-[10px] font-bold text-[#9ca3af] uppercase tracking-widest mb-7">
            Todas las marcas disponibles
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-9 gap-y-3">
            {marcas.map((m) => (
              <Link
                key={m}
                href={`/buscar?marca=${m}`}
                className="text-[15px] font-black text-[#374151] hover:text-[#1978e5] transition-colors duration-200 tracking-tight"
              >
                {m}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CATEGORÍAS
      ══════════════════════════════════════════════════════ */}
      <section className="bg-[#f8f9fa] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE_OUT }}
            viewport={{ once: true, amount: 0.3 }}
            className="flex items-center justify-between mb-6"
          >
            <div>
              <p className="text-[12px] font-bold text-[#1978e5] uppercase tracking-widest mb-1">Navega por tipo</p>
              <h2 className="text-[26px] font-black text-[#111418] tracking-tight">Encuentra tu estilo</h2>
            </div>
          </motion.div>

          <motion.div
            variants={staggerGrid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-3 sm:grid-cols-6 gap-3"
          >
            {tipos.map((tipo) => (
              <motion.div key={tipo.label} variants={cardReveal}>
                <Link
                  href={`/buscar?tipo=${tipo.label}`}
                  className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white border border-[#dce0e5] hover:border-[#1978e5] hover:bg-[#e8f0fd] hover:shadow-md transition-all group cursor-pointer"
                >
                  <div className="group-hover:[&_path]:fill-[#1978e5] group-hover:[&_circle]:stroke-[#1978e5] transition-all duration-200">
                    {tipo.icon}
                  </div>
                  <span className="text-[12px] font-bold text-[#637488] group-hover:text-[#1978e5] transition-colors uppercase tracking-wide">
                    {tipo.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          VEHÍCULOS DESTACADOS
      ══════════════════════════════════════════════════════ */}
      <section className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE_OUT }}
            viewport={{ once: true, amount: 0.25 }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <p className="text-[12px] font-bold text-[#1978e5] uppercase tracking-widest mb-1">Disponibles ahora</p>
              <h2 className="text-[32px] font-black text-[#111418] tracking-tight">Vehículos verificados</h2>
              <p className="text-[15px] text-[#637488] mt-1">{vehicles.length} carros listos para entregar hoy</p>
            </div>
            <Link
              href="/buscar"
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 border-2 border-[#1978e5] text-[#1978e5] font-bold rounded-xl hover:bg-[#1978e5] hover:text-white transition-all text-[14px]"
            >
              Ver todos <ArrowRight size={16} />
            </Link>
          </motion.div>

          <motion.div
            variants={staggerGrid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {vehicles.map((v) => (
              <motion.div key={v.id} variants={cardReveal}>
                <VehicleCard vehicle={v} />
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE_OUT, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Link
              href="/buscar"
              className="inline-flex items-center gap-2 px-10 py-4 bg-[#1978e5] text-white font-black rounded-2xl hover:bg-[#1565c0] transition-all text-[16px] shadow-lg shadow-[#1978e5]/30 hover:shadow-[#1978e5]/50 hover:-translate-y-0.5"
            >
              Ver todos los vehículos <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CÓMO FUNCIONA
      ══════════════════════════════════════════════════════ */}
      <section className="bg-[#f8f9fa] py-16 border-y border-[#dce0e5]" id="como-funciona">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE_OUT }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-12"
          >
            <p className="text-[12px] font-bold text-[#1978e5] uppercase tracking-widest mb-2">Simple y transparente</p>
            <h2 className="text-[32px] font-black text-[#111418] tracking-tight">¿Cómo funciona MOVEL?</h2>
            <p className="text-[16px] text-[#637488] mt-2 max-w-lg mx-auto">
              En 3 pasos tienes tu carro. Sin intermediarios, sin sorpresas.
            </p>
          </motion.div>

          <motion.div
            variants={staggerGrid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 relative"
          >
            {/* Connector line */}
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-[#1978e5]/20 via-[#1978e5] to-[#1978e5]/20" />

            {[
              { num: "01", icon: <MagnifyingGlass size={28} color="#1978e5" weight="bold" />, title: "Busca y elige", desc: "Explora +500 vehículos verificados con historial completo, fotos reales y precio fijo." },
              { num: "02", icon: <ClipboardText   size={28} color="#1978e5" weight="fill" />, title: "Verifica el historial", desc: "Consulta propietarios, siniestros, SOAT, tecnomecánica y el peritaje profesional." },
              { num: "03", icon: <CheckCircle     size={28} color="#1978e5" weight="fill" />, title: "Compra seguro", desc: "Obtén financiamiento, firma digitalmente y recibe el vehículo en 48 horas." },
            ].map((step) => (
              <motion.div key={step.num} variants={cardReveal}>
                <div className="relative bg-white rounded-2xl p-7 border border-[#dce0e5] hover:shadow-lg transition-all text-center">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-[#1978e5] text-white text-[12px] font-black rounded-full flex items-center justify-center">
                    {step.num}
                  </div>
                  <div className="w-16 h-16 bg-[#e8f0fd] rounded-2xl flex items-center justify-center mx-auto mb-4 mt-2">
                    {step.icon}
                  </div>
                  <h3 className="text-[18px] font-bold text-[#111418] mb-2">{step.title}</h3>
                  <p className="text-[14px] text-[#637488] leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          POR QUÉ MOVEL
      ══════════════════════════════════════════════════════ */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE_OUT }}
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-12"
          >
            <p className="text-[12px] font-bold text-[#1978e5] uppercase tracking-widest mb-2">Nuestra diferencia</p>
            <h2 className="text-[32px] font-black text-[#111418] tracking-tight">¿Por qué elegir MOVEL?</h2>
          </motion.div>

          <motion.div
            variants={staggerGrid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              { icon: <ClipboardText size={32} color="#1978e5" weight="fill" />,    title: "Historial verificado",  desc: "Consultamos propietarios anteriores, siniestros, SOAT y tecnomecánica. Nada oculto.", badge: "100% transparente" },
              { icon: <ShieldCheck   size={32} color="#1978e5" weight="fill" />,    title: "Peritaje profesional", desc: "Cada vehículo es inspeccionado por nuestros técnicos certificados antes de publicarse.", badge: "Certificado" },
              { icon: <CurrencyCircleDollar size={32} color="#1978e5" weight="fill" />, title: "Financiamiento fácil", desc: "Te ayudamos a conseguir el crédito con las mejores tasas del mercado colombiano.", badge: "Desde 0.9% m.v." },
            ].map((item) => (
              <motion.div key={item.title} variants={cardReveal}>
                <div className="p-7 rounded-2xl border border-[#dce0e5] hover:shadow-lg hover:border-[#1978e5]/30 transition-all group h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-[#e8f0fd] group-hover:bg-[#1978e5] rounded-2xl flex items-center justify-center transition-colors">
                      <div className="group-hover:[&_*]:text-white transition-colors">{item.icon}</div>
                    </div>
                    <span className="text-[11px] font-bold text-[#1978e5] bg-[#e8f0fd] px-2.5 py-1 rounded-full">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-[18px] font-bold text-[#111418] mb-2">{item.title}</h3>
                  <p className="text-[14px] text-[#637488] leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SUBASTAS EN VIVO
      ══════════════════════════════════════════════════════ */}
      {auctionVehicles.length > 0 && (
        <section
          className="py-16"
          style={{ background: "linear-gradient(135deg, #0d1b2e 0%, #0f2a50 50%, #0d1b2e 100%)" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: EASE_OUT }}
              viewport={{ once: true, amount: 0.3 }}
              className="flex items-center justify-between mb-8"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <Fire size={20} color="#ef4444" weight="fill" className="animate-pulse" />
                </div>
                <div>
                  <p className="text-[12px] font-bold text-red-400 uppercase tracking-widest">En tiempo real</p>
                  <h2 className="text-[28px] font-black text-white tracking-tight">Subastas activas</h2>
                </div>
              </div>
              <Link href="/subastas" className="hidden sm:flex items-center gap-2 px-5 py-2.5 border border-white/20 text-white/70 hover:text-white hover:border-white/40 font-bold rounded-xl transition-all text-[14px]">
                Ver todas <ArrowRight size={16} />
              </Link>
            </motion.div>

            <motion.div
              variants={staggerGrid}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {auctionVehicles.slice(0, 3).map((v) => (
                <motion.div key={v.id} variants={cardReveal}>
                  <Link href={`/vehiculo/${v.id}`} className="block group">
                    <div className="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 overflow-hidden transition-all hover:border-[#1978e5]/50">
                      <div className="relative h-44 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={v.fotos[0]} alt={v.titulo} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-500 text-white text-[11px] font-black px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                          SUBASTA ACTIVA
                        </div>
                      </div>
                      <div className="p-4">
                        <p className="text-white font-bold text-[15px] mb-1 truncate">{v.titulo}</p>
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-white/40 text-[11px]">Oferta actual</p>
                            <p className="text-[#60a5fa] font-black text-[18px]">{v.subasta ? formatCOP(v.subasta.ofertaActual) : ""}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-white/40 text-[11px] flex items-center gap-1 justify-end">
                              <Clock size={11} /> Termina en
                            </p>
                            <p className="text-amber-400 font-black text-[14px]">
                              {v.subasta ? `${Math.max(0, Math.floor((new Date(v.subasta.finEn).getTime() - Date.now()) / 3600000))}h` : "—"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white/40 text-[12px] flex items-center gap-1">
                            <Gavel size={12} /> {v.subasta?.totalOfertas ?? 0} ofertas
                          </span>
                          <span className="text-[#1978e5] text-[12px] font-bold group-hover:underline">Ver subasta →</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            <div className="text-center mt-8">
              <Link href="/subastas" className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1978e5] text-white font-black rounded-2xl hover:bg-[#1565c0] transition-all text-[15px]">
                Ver todas las subastas <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════
          BANNER VENDER
      ══════════════════════════════════════════════════════ */}
      <section className="py-14 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE_OUT }}
            viewport={{ once: true, amount: 0.25 }}
          >
            <div
              className="rounded-3xl p-8 md:p-14 text-white flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative"
              style={{ background: "linear-gradient(135deg, #0d1b2e 0%, #1565c0 60%, #1978e5 100%)" }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-20 w-32 h-32 rounded-full bg-[#1978e5]/30 translate-y-1/2" />

              <div className="max-w-xl relative z-10">
                <span className="inline-block text-[#60a5fa] text-[12px] font-bold uppercase tracking-widest mb-3 bg-[#1978e5]/20 px-3 py-1 rounded-full">
                  Para vendedores
                </span>
                <h2 className="text-[32px] md:text-[40px] font-black mt-2 mb-3 tracking-tight leading-tight">
                  Vende tu carro más rápido y seguro
                </h2>
                <p className="text-white/70 text-[16px] leading-relaxed mb-6">
                  Publica gratis, nosotros nos encargamos del peritaje, los documentos y encontrar al comprador ideal. Recibe tu pago garantizado en 48 horas.
                </p>
                <div className="flex flex-wrap gap-3">
                  {["✅ Publicación gratuita", "🔒 Pago garantizado", "⚡ Proceso en 24h"].map((t) => (
                    <span key={t} className="text-[13px] text-white/80 bg-white/10 border border-white/20 px-3 py-1.5 rounded-full">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative z-10 flex flex-col gap-3 w-full md:w-auto">
                <Link
                  href="/publicar"
                  className="px-8 py-4 bg-white text-[#1978e5] font-black text-[16px] rounded-2xl hover:bg-[#f0f2f4] transition-all shadow-xl text-center hover:scale-105"
                >
                  Publicar mi vehículo →
                </Link>
                <a
                  href="https://wa.me/573175737083?text=Hola, quiero vender mi vehículo en MOVEL"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-[#25d366] text-white font-bold text-[15px] rounded-2xl hover:bg-[#20b858] transition-all"
                >
                  <WhatsappLogo size={22} weight="fill" />
                  Hablar con un asesor
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          CTA CONTACTO
      ══════════════════════════════════════════════════════ */}
      <section className="bg-white py-12 border-t border-[#dce0e5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE_OUT }}
            viewport={{ once: true, amount: 0.3 }}
            className="flex flex-col md:flex-row items-center justify-between gap-6 bg-[#e8f0fd] rounded-2xl p-8"
          >
            <div>
              <h3 className="text-[22px] font-black text-[#111418] mb-1">¿Tienes preguntas? Estamos aquí</h3>
              <p className="text-[14px] text-[#637488]">Lunes a viernes 8am–6pm · Sábados 9am–2pm</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <a
                href="https://wa.me/573175737083?text=Hola MOVEL, tengo una consulta"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-[#25d366] text-white font-bold rounded-xl hover:bg-[#20b858] transition-all hover:scale-105 text-[14px]"
              >
                <WhatsappLogo size={20} weight="fill" />
                WhatsApp
              </a>
              <a
                href="tel:+573175737083"
                className="flex items-center gap-2 px-6 py-3 bg-[#1978e5] text-white font-bold rounded-xl hover:bg-[#1565c0] transition-all hover:scale-105 text-[14px]"
              >
                <Phone size={18} weight="fill" />
                Llamar ahora
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════ */}
      <footer className="bg-[#0d1b2e] text-white pt-14 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div className="md:col-span-1">
              <div className="mb-4">
                <svg width="130" height="40" viewBox="0 0 120 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="MOVEL">
                  <text x="0" y="28" fontFamily="Arial Black, Arial, sans-serif" fontSize="30" fontWeight="900" fontStyle="italic" fill="white">M</text>
                  <g>
                    <text x="23" y="28" fontFamily="Arial Black, Arial, sans-serif" fontSize="30" fontWeight="900" fontStyle="italic" fill="white">O</text>
                    <circle cx="36" cy="16" r="7" fill="#1565c0" />
                    <circle cx="36" cy="16" r="7" fill="none" stroke="white" strokeWidth="1.2" />
                    <line x1="36" y1="16" x2="40.5" y2="10.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="36" cy="16" r="1.2" fill="white" />
                    <line x1="29.5" y1="16" x2="31" y2="16" stroke="white" strokeWidth="1" strokeLinecap="round" />
                    <line x1="36" y1="9.5" x2="36" y2="11" stroke="white" strokeWidth="1" strokeLinecap="round" />
                    <line x1="42.5" y1="16" x2="41" y2="16" stroke="white" strokeWidth="1" strokeLinecap="round" />
                  </g>
                  <text x="51" y="28" fontFamily="Arial Black, Arial, sans-serif" fontSize="30" fontWeight="900" fontStyle="italic" fill="white">VEL</text>
                </svg>
              </div>
              <p className="text-white/50 text-[14px] leading-relaxed mb-5">
                El marketplace de vehículos más confiable de Colombia.
              </p>
              <div className="flex gap-3">
                <a href="https://wa.me/573175737083" target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/10 hover:bg-[#25d366] rounded-lg flex items-center justify-center transition-colors">
                  <WhatsappLogo size={18} color="white" weight="fill" />
                </a>
                <a href="tel:+573175737083"
                  className="w-9 h-9 bg-white/10 hover:bg-[#1978e5] rounded-lg flex items-center justify-center transition-colors">
                  <Phone size={16} color="white" weight="fill" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-[14px] font-bold mb-4 text-white">Comprar</h4>
              <ul className="space-y-2.5">
                <li><Link href="/buscar" className="text-[14px] text-white/50 hover:text-white transition-colors">Todos los carros</Link></li>
                <li><Link href="/buscar?tipo=SUV" className="text-[14px] text-white/50 hover:text-white transition-colors">SUVs disponibles</Link></li>
                <li><Link href="/buscar?tipo=Sedan" className="text-[14px] text-white/50 hover:text-white transition-colors">Sedanes</Link></li>
                <li><Link href="/buscar?precioMax=50000000" className="text-[14px] text-white/50 hover:text-white transition-colors">Carros económicos</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[14px] font-bold mb-4 text-white">Vender</h4>
              <ul className="space-y-2.5">
                <li><Link href="/publicar" className="text-[14px] text-white/50 hover:text-white transition-colors">Publicar vehículo</Link></li>
                <li><Link href="/#como-funciona" className="text-[14px] text-white/50 hover:text-white transition-colors">¿Cómo funciona?</Link></li>
                <li><a href="https://wa.me/573175737083?text=Hola%20MOVEL%2C%20quiero%20información%20sobre%20el%20peritaje%20gratuito" target="_blank" rel="noopener noreferrer" className="text-[14px] text-white/50 hover:text-white transition-colors">Peritaje gratis</a></li>
                <li><Link href="/subastas" className="text-[14px] text-white/50 hover:text-white transition-colors">Subastas en vivo</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[14px] font-bold mb-4 text-white">Contacto</h4>
              <ul className="space-y-2.5">
                <li><a href="https://wa.me/573175737083" target="_blank" rel="noopener noreferrer" className="text-[14px] text-white/50 hover:text-white transition-colors">+57 317 573 7083</a></li>
                <li><a href="mailto:movelcol@outlook.com" className="text-[14px] text-white/50 hover:text-white transition-colors">movelcol@outlook.com</a></li>
                <li><span className="text-[14px] text-white/50">Bogotá, Colombia</span></li>
                <li><span className="text-[14px] text-white/50">L–V: 8am–6pm</span></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-[13px] text-white/40">
              © 2025 MOVEL S.A.S. · Todos los derechos reservados · NIT: 901.234.567-8
            </p>
            <div className="flex gap-4">
              <a href="https://wa.me/573175737083?text=Hola%20MOVEL%2C%20quiero%20información%20sobre%20sus%20términos%20y%20condiciones" target="_blank" rel="noopener noreferrer" className="text-[12px] text-white/40 hover:text-white transition-colors">Términos</a>
              <a href="https://wa.me/573175737083?text=Hola%20MOVEL%2C%20quiero%20información%20sobre%20su%20política%20de%20privacidad" target="_blank" rel="noopener noreferrer" className="text-[12px] text-white/40 hover:text-white transition-colors">Privacidad</a>
              <span className="text-[12px] text-white/40">© MOVEL 2025</span>
            </div>
          </div>
        </div>
      </footer>

      <BottomNav />
    </div>
  );
}
