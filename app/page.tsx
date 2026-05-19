"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MagnifyingGlass, ShieldCheck, CurrencyCircleDollar,
  ClipboardText, ArrowRight, WhatsappLogo,
  Phone, CheckCircle, CaretDown, SlidersHorizontal,
  Gavel, Clock, Fire, Handshake, CalendarCheck, FileText,
  Sparkle, UploadSimple, UsersThree, Camera, Wrench,
  Lightning, ChatCircleDots, Database,
} from "@phosphor-icons/react";
import { vehicles as mockVehicles, getAuctionVehicles, formatCOP, Vehicle } from "@/lib/mock-data";
import VehicleCard from "@/components/VehicleCard";
import BottomNav from "@/components/BottomNav";
import { MovelLogo } from "@/components/MovelLogo";
import { BrandIcon } from "@/components/BrandIcons";
import { useCursorGlow } from "@/lib/hooks/useCursorGlow";
import { useScrollReveal } from "@/lib/hooks/useScrollReveal";

const EASE_OUT = "easeOut" as const;

const staggerGrid = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
} as const;

const cardReveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
} as const;

const marcas = [
  "Chevrolet", "Renault", "Toyota", "Kia", "Hyundai",
  "Mazda", "Nissan", "Ford", "Volkswagen", "BMW",
  "Mercedes-Benz", "Honda", "Suzuki", "Jeep", "Audi",
];

// ── Carrocería icons — siluetas laterales ─────────────────────────────

function SuvIcon() {
  // Alto, cuadrado, 3 ventanas, ruedas grandes — como Toyota Prado
  return (
    <svg viewBox="0 0 180 80" className="w-20 h-9">
      <path d="M14,54 L14,36 L20,24 L30,16 L38,14 L130,14 L140,18 L150,26 L158,36 L162,44 L164,54 Z"
        fill="currentColor" opacity="0.88"/>
      <path d="M38,14 L38,36 L70,36 L70,14 Z" fill="white" opacity="0.35"/>
      <path d="M74,14 L74,36 L118,36 L118,14 Z" fill="white" opacity="0.35"/>
      <path d="M122,14 L130,14 L140,18 L150,26 L150,36 L122,36 Z" fill="white" opacity="0.35"/>
      <line x1="14" y1="38" x2="164" y2="38" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
      <circle cx="46" cy="66" r="14" fill="white" stroke="currentColor" strokeWidth="2.5"/>
      <circle cx="46" cy="66" r="5"  fill="currentColor" opacity="0.4"/>
      <circle cx="150" cy="66" r="14" fill="white" stroke="currentColor" strokeWidth="2.5"/>
      <circle cx="150" cy="66" r="5"  fill="currentColor" opacity="0.4"/>
    </svg>
  );
}

function SedanIcon() {
  // 3 cajas — cofre + habitáculo + maletero con escalón
  return (
    <svg viewBox="0 0 180 80" className="w-20 h-9">
      <path d="M14,54 L14,46 L18,44 L22,36 L38,28 L50,20 L58,17 L118,17 L126,20 L138,28 L150,36 L158,42 L164,46 L164,54 Z"
        fill="currentColor" opacity="0.88"/>
      <path d="M58,17 L58,32 L88,32 L88,17 Z" fill="white" opacity="0.35"/>
      <path d="M92,17 L92,32 L120,32 L120,17 Z" fill="white" opacity="0.35"/>
      <path d="M124,20 L126,20 L138,28 L138,32 L124,32 Z" fill="white" opacity="0.35"/>
      <circle cx="40" cy="65" r="13" fill="white" stroke="currentColor" strokeWidth="2.5"/>
      <circle cx="40" cy="65" r="5"  fill="currentColor" opacity="0.4"/>
      <circle cx="148" cy="65" r="13" fill="white" stroke="currentColor" strokeWidth="2.5"/>
      <circle cx="148" cy="65" r="5"  fill="currentColor" opacity="0.4"/>
    </svg>
  );
}

function HatchbackIcon() {
  // 2 cajas — trasera cae directamente del techo al parachoques
  return (
    <svg viewBox="0 0 180 80" className="w-20 h-9">
      <path d="M16,54 L16,46 L22,38 L34,28 L48,18 L58,15 L118,15 L126,18 L136,26 L148,36 L156,42 L162,46 L162,54 Z"
        fill="currentColor" opacity="0.88"/>
      <path d="M58,15 L58,32 L88,32 L88,15 Z" fill="white" opacity="0.35"/>
      <path d="M92,15 L92,32 L120,32 L120,15 Z" fill="white" opacity="0.35"/>
      <path d="M124,18 L126,18 L136,26 L136,32 L124,32 Z" fill="white" opacity="0.35"/>
      <circle cx="40" cy="65" r="13" fill="white" stroke="currentColor" strokeWidth="2.5"/>
      <circle cx="40" cy="65" r="5"  fill="currentColor" opacity="0.4"/>
      <circle cx="148" cy="65" r="13" fill="white" stroke="currentColor" strokeWidth="2.5"/>
      <circle cx="148" cy="65" r="5"  fill="currentColor" opacity="0.4"/>
    </svg>
  );
}

function CoupeIcon() {
  // Muy bajo, cofre largo, techo cae suavemente hacia la cola — como Mazda MX-5
  return (
    <svg viewBox="0 0 180 80" className="w-20 h-9">
      <path d="M14,54 L14,48 L20,44 L28,38 L42,28 L58,20 L72,16 L112,15 L130,18 L148,26 L160,34 L168,42 L170,48 L170,54 Z"
        fill="currentColor" opacity="0.88"/>
      <path d="M72,16 L72,32 L100,32 L100,15 Z" fill="white" opacity="0.35"/>
      <path d="M104,15 L104,32 L128,32 L130,18 Z" fill="white" opacity="0.35"/>
      <path d="M132,18 L148,26 L148,32 L132,32 Z" fill="white" opacity="0.35"/>
      <circle cx="42" cy="65" r="13" fill="white" stroke="currentColor" strokeWidth="2.5"/>
      <circle cx="42" cy="65" r="5"  fill="currentColor" opacity="0.4"/>
      <circle cx="154" cy="65" r="13" fill="white" stroke="currentColor" strokeWidth="2.5"/>
      <circle cx="154" cy="65" r="5"  fill="currentColor" opacity="0.4"/>
    </svg>
  );
}

function PickupIcon() {
  // Cabina doble + platón largo — como Toyota Hilux
  return (
    <svg viewBox="0 0 180 80" className="w-20 h-9">
      {/* Platón */}
      <path d="M12,54 L12,40 L14,38 L90,38 L90,54 Z" fill="currentColor" opacity="0.88"/>
      <line x1="14" y1="38" x2="90" y2="38" stroke="currentColor" strokeWidth="2" opacity="0.5"/>
      <line x1="12" y1="40" x2="90" y2="40" stroke="white" strokeWidth="1" opacity="0.4"/>
      {/* Cabina */}
      <path d="M90,54 L90,34 L96,22 L108,16 L138,16 L148,20 L158,28 L164,36 L168,44 L168,54 Z"
        fill="currentColor" opacity="0.88"/>
      <path d="M108,16 L108,34 L132,34 L132,16 Z" fill="white" opacity="0.35"/>
      <path d="M136,16 L138,16 L148,20 L158,28 L158,34 L136,34 Z" fill="white" opacity="0.35"/>
      <circle cx="36" cy="65" r="14" fill="white" stroke="currentColor" strokeWidth="2.5"/>
      <circle cx="36" cy="65" r="5"  fill="currentColor" opacity="0.4"/>
      <circle cx="152" cy="65" r="14" fill="white" stroke="currentColor" strokeWidth="2.5"/>
      <circle cx="152" cy="65" r="5"  fill="currentColor" opacity="0.4"/>
    </svg>
  );
}

function ConvertibleIcon() {
  // Sin techo, parabrisas corto, perfil muy bajo — como Porsche 911 cabriolet
  return (
    <svg viewBox="0 0 180 80" className="w-20 h-9">
      <path d="M14,54 L14,48 L20,44 L30,40 L46,36 L62,30 L80,26 L130,25 L142,28 L154,34 L164,40 L168,46 L168,54 Z"
        fill="currentColor" opacity="0.88"/>
      {/* Parabrisas */}
      <path d="M80,26 L76,36 L104,36 L108,25 Z" fill="white" opacity="0.4"/>
      {/* Interior / habitáculo */}
      <path d="M108,25 L108,36 L130,36 L130,25 Z" fill="white" opacity="0.28"/>
      {/* Capota plegada al fondo */}
      <path d="M46,36 L62,30 L64,36 Z" fill="white" opacity="0.2"/>
      <circle cx="44" cy="65" r="13" fill="white" stroke="currentColor" strokeWidth="2.5"/>
      <circle cx="44" cy="65" r="5"  fill="currentColor" opacity="0.4"/>
      <circle cx="152" cy="65" r="13" fill="white" stroke="currentColor" strokeWidth="2.5"/>
      <circle cx="152" cy="65" r="5"  fill="currentColor" opacity="0.4"/>
    </svg>
  );
}

const tipos = [
  { label: "SUV / Camioneta", icon: SuvIcon },
  { label: "Sedán",           icon: SedanIcon },
  { label: "Hatchback",       icon: HatchbackIcon },
  { label: "Pick-up",         icon: PickupIcon },
  { label: "Coupé",           icon: CoupeIcon },
  { label: "Convertible",     icon: ConvertibleIcon },
];

// ── Cursor glow helper ───────────────────────────────────────────────
const onGlowMove = (e: React.MouseEvent<HTMLElement>) => {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
  el.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
};

// ── 3% commission counter ────────────────────────────────────────────
function CommissionCounter({ inverted = false }: { inverted?: boolean }) {
  const [shown, setShown] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setShown(3); return; }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          let v = 0;
          const t = setInterval(() => {
            v += 0.1;
            if (v >= 3) { setShown(3); clearInterval(t); }
            else setShown(parseFloat(v.toFixed(1)));
          }, 35);
          io.disconnect();
        }
      });
    }, { threshold: 0.4 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`font-display text-[68px] md:text-[88px] leading-none ${inverted ? "gradient-text-light" : "gradient-text"}`}>
      {shown.toFixed(1)}<span className={inverted ? "text-movel-300" : "text-movel-500"}>%</span>
    </div>
  );
}

// ── Home component ────────────────────────────────────────────────────
export default function HomePage() {
  const router = useRouter();
  const [query, setQuery]         = useState("");
  const [showFilters, setFilters] = useState(false);
  const [fMarca, setFMarca]       = useState("");
  const [fTipo, setFTipo]         = useState("");
  const [fTransmision, setFTrans] = useState("");
  const [fPrecioMax, setFPrecio]  = useState("200000000");
  const [venderMode, setVenderMode] = useState<"closed" | "options">("closed");

  // ── Vehículos: mock + publicaciones activas de Supabase ──
  const [publicados, setPublicados] = useState<Vehicle[]>([]);
  useEffect(() => {
    fetch("/api/vehiculos")
      .then((r) => r.ok ? r.json() : { vehicles: [] })
      .then((d) => setPublicados(d.vehicles || []))
      .catch(() => setPublicados([]));
  }, []);
  const vehicles = [...publicados, ...mockVehicles];
  const auctionVehicles = getAuctionVehicles();

  const [showLogo, setShowLogo] = useState(true);
  const logoVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setShowLogo(false), 7000);
    return () => clearTimeout(t);
  }, []);

  useScrollReveal();

  const heroCTA      = useCursorGlow();
  const heroVentaCTA = useCursorGlow();
  const ctaVer       = useCursorGlow();
  const ctaPublicar  = useCursorGlow();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim())     params.set("q", query.trim());
    if (fMarca)           params.set("marca", fMarca);
    if (fTipo)            params.set("tipo", fTipo);
    if (fTransmision)     params.set("transmision", fTransmision);
    if (fPrecioMax && fPrecioMax !== "200000000") params.set("precioMax", fPrecioMax);
    router.push(`/buscar${params.toString() ? `?${params}` : ""}`);
  };

  return (
    <div className="min-h-screen bg-white">

      {/* ═══════════════════════════════════════════════════════════
          HERO — Búsqueda como protagonista
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden bg-movel-gradient-dark">
        {/* Fondo gradient como fallback inmediato (sin esperar video) */}
        <div className="absolute inset-0 bg-movel-gradient-dark" style={{ zIndex: 0 }} />

        {/* Videos: solo se cargan en desktop (mobile pesa demasiado) */}
        <video
          ref={logoVideoRef}
          src="/videos/logo-movel.mp4"
          autoPlay muted playsInline preload="metadata"
          onEnded={() => setShowLogo(false)}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] hidden md:block"
          style={{ opacity: showLogo ? 1 : 0, zIndex: 2 }}
        />
        <video
          src="/videos/video-fondo.mp4"
          autoPlay muted loop playsInline preload="metadata"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms] hidden md:block"
          style={{ opacity: showLogo ? 0 : 1, zIndex: 1 }}
        />
        {/* Overlay vertical: más oscuro arriba/abajo, abierto en el centro */}
        <div
          className="absolute inset-0"
          style={{
            zIndex: 3,
            background: "linear-gradient(180deg, rgba(8,16,40,0.85) 0%, rgba(11,30,78,0.35) 25%, rgba(11,30,78,0.40) 65%, rgba(5,14,38,0.96) 100%)"
          }}
        />
        {/* Vignette radial: más oscuro al centro (donde va el texto), para que las letras no se confundan con el video */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 4,
            background: "radial-gradient(ellipse 60% 50% at 50% 55%, rgba(8,16,40,0.55) 0%, rgba(8,16,40,0.20) 50%, transparent 80%)"
          }}
        />

        <div className="relative flex flex-col items-center px-4 pt-20 md:pt-24 pb-24 w-full max-w-3xl" style={{ zIndex: 10 }}>
          {/* ── Bloque 1: badge superior ── */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-10"
          >
            <span className="inline-flex items-center gap-2 bg-movel-900/40 border border-movel-400/50 text-movel-200 text-[12px] font-bold px-4 py-2 rounded-full backdrop-blur-sm">
              <Sparkle size={14} weight="fill" color="#3F8CFF" className="animate-pulse" />
              Catálogo Fasecolda + MinTransporte · Asesoría 360°
            </span>
          </motion.div>

          {/* ── Bloque 2: logo + título + subtítulo (núcleo del hero) ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: EASE_OUT }}
            className="mb-10 md:mb-12"
            style={{
              filter: "drop-shadow(0 0 60px rgba(63,140,255,0.5)) drop-shadow(0 4px 24px rgba(0,0,0,0.55))",
            }}
          >
            <MovelLogo variant="white" size={88} animate />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.7 }}
            className="font-display text-center text-[32px] sm:text-[42px] md:text-[54px] leading-[1.02] mb-6"
            style={{
              textShadow: "0 2px 20px rgba(0,0,0,0.7), 0 4px 40px rgba(0,0,0,0.5)",
            }}
          >
            <span className="text-white">Encuentra tu próximo carro</span>
            <br />
            <span className="gradient-text-light">con total confianza.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.78, duration: 0.55 }}
            className="text-[15px] md:text-[17px] text-white/85 text-center mb-12 md:mb-14 max-w-lg font-medium leading-relaxed"
            style={{
              textShadow: "0 1px 10px rgba(0,0,0,0.65)",
            }}
          >
            Compra y vende vehículos con asesoría 360°.<br className="hidden sm:block" /> Solo 3% de comisión si vendemos por ti.
          </motion.p>

          {/* ── Bloque 3: buscador (acción principal) ── */}
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.88, duration: 0.6 }}
            className="w-full max-w-2xl bg-white rounded-2xl p-2 flex gap-2 shadow-2xl shadow-black/40 mb-6 border border-white/20"
          >
            <div className="flex-1 flex items-center gap-3 bg-cloud rounded-xl px-5 py-3.5">
              <MagnifyingGlass size={20} color="#7A8195" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Marca, modelo, ciudad..."
                className="flex-1 bg-transparent text-ink text-[15px] outline-none placeholder-mute"
              />
            </div>
            <button
              type="submit"
              {...heroCTA}
              className="cursor-glow btn-primary !rounded-xl !py-3.5 !px-7 text-[15px] flex-shrink-0"
            >
              Buscar
            </button>
          </motion.form>

          {/* ── Bloque 4: chips de búsqueda rápida ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-2 mb-10 max-w-xl"
          >
            {["SUV / Camioneta", "Sedán", "Pick-up", "Hasta $50M", "Automático"].map((chip) => (
              <button
                key={chip}
                onClick={() => router.push(`/buscar?q=${encodeURIComponent(chip)}`)}
                className="text-[12px] font-semibold px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 hover:bg-white/20 hover:border-white/40 transition-all backdrop-blur-sm"
              >
                {chip}
              </button>
            ))}
          </motion.div>

          {/* ── Bloque 5: CTAs secundarios (vender + filtros) ── */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.55 }}
            className="flex gap-3 w-full max-w-2xl"
          >
            <Link
              href="/publicar"
              {...heroVentaCTA}
              className="cursor-glow cursor-glow-dark flex-1 flex items-center justify-center gap-2.5 py-3.5 bg-white/10 hover:bg-white/15 border-2 border-white/25 text-white font-bold text-[15px] rounded-2xl transition-all hover:-translate-y-0.5 backdrop-blur-sm"
            >
              <ArrowRight size={18} weight="bold" />
              Vender mi carro
            </Link>
            <button
              type="button"
              onClick={() => setFilters((v) => !v)}
              className={`flex items-center gap-2 px-5 py-3.5 font-bold text-[14px] rounded-2xl border-2 transition-all hover:-translate-y-0.5 backdrop-blur-sm ${
                showFilters ? "bg-movel-500 border-movel-500 text-white" : "bg-white/10 border-white/25 text-white hover:bg-white/15"
              }`}
            >
              <SlidersHorizontal size={18} weight="bold" />
              Filtros
              <motion.span animate={{ rotate: showFilters ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <CaretDown size={14} />
              </motion.span>
            </button>
          </motion.div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -8 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -8 }}
                transition={{ duration: 0.3, ease: "easeOut" as const }}
                className="w-full max-w-2xl overflow-hidden mb-4"
              >
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <select value={fMarca} onChange={(e) => setFMarca(e.target.value)} className="bg-white/15 border border-white/20 text-white text-[13px] rounded-xl px-3 py-2.5 outline-none [&>option]:bg-night">
                    <option value="">Marca</option>
                    {marcas.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <select value={fTipo} onChange={(e) => setFTipo(e.target.value)} className="bg-white/15 border border-white/20 text-white text-[13px] rounded-xl px-3 py-2.5 outline-none [&>option]:bg-night">
                    <option value="">Tipo</option>
                    {tipos.map(t => <option key={t.label} value={t.label}>{t.label}</option>)}
                  </select>
                  <select value={fTransmision} onChange={(e) => setFTrans(e.target.value)} className="bg-white/15 border border-white/20 text-white text-[13px] rounded-xl px-3 py-2.5 outline-none [&>option]:bg-night">
                    <option value="">Transmisión</option>
                    <option value="Automático">Automático</option>
                    <option value="Manual">Manual</option>
                  </select>
                  <select value={fPrecioMax} onChange={(e) => setFPrecio(e.target.value)} className="bg-white/15 border border-white/20 text-white text-[13px] rounded-xl px-3 py-2.5 outline-none [&>option]:bg-night">
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

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
            <motion.div animate={{ y: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 1.9, ease: "easeInOut" }}>
              <CaretDown size={22} color="rgba(255,255,255,0.35)" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          TRUST STRIP — Promesas honestas (sin garantías que no podemos cumplir)
      ═══════════════════════════════════════════════════════════ */}
      <div className="bg-night border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-6">
            {[
              { icon: Lightning,      title: "Vende rápido",       desc: "Te ayudamos a llegar a compradores serios" },
              { icon: ShieldCheck,    title: "Compra con confianza", desc: "Vehículos con documentación al día" },
              { icon: Handshake,      title: "Asesoría 360°",       desc: "Te acompañamos en todo el proceso" },
              { icon: CurrencyCircleDollar, title: "Comisión justa", desc: "Solo 3% si vendemos por ti" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className={`reveal reveal-delay-${i + 1} flex items-start gap-3`}>
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-movel-500/15 border border-movel-400/30 flex items-center justify-center">
                    <Icon size={20} color="#3F8CFF" weight="fill" />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-white leading-tight">{item.title}</p>
                    <p className="text-[12px] text-white/55 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <svg viewBox="0 0 1440 60" className="w-full block">
          <path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="white" />
        </svg>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          CÓMO FUNCIONA MOVEL — 3 pasos
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-cloud py-16" id="como-funciona">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 reveal">
            <p className="text-[11px] font-bold text-movel-600 uppercase tracking-[0.15em] mb-3">Simple y transparente</p>
            <h2 className="font-display text-[28px] md:text-[40px] gradient-text mb-3 flex items-center justify-center gap-2 flex-wrap">
              ¿Cómo funciona{" "}
              <MovelLogo variant="gradient" size={52} animate={false} className="inline-block" />
              ?
            </h2>
            <p className="text-[15px] md:text-[16px] text-mute max-w-xl mx-auto">
              En 3 pasos tienes tu carro. Sin intermediarios, sin sorpresas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-movel-200 via-movel-500 to-movel-200" />

            {[
              { num: "01", Icon: MagnifyingGlass, title: "Busca y elige", desc: "Explora el catálogo de vehículos con filtros por marca, modelo, año, precio y especificaciones técnicas oficiales." },
              { num: "02", Icon: ClipboardText,   title: "Verifica el historial", desc: "Consulta las especificaciones de Fasecolda y Ministerio de Transporte. Datos verificados al detalle." },
              { num: "03", Icon: CheckCircle,     title: "Cierra el trato", desc: "Contacta directamente al vendedor o pídenos que gestionemos la venta integral por ti." },
            ].map((step, i) => (
              <div
                key={step.num}
                onMouseMove={onGlowMove}
                className={`reveal reveal-delay-${i + 1} cursor-glow cursor-glow-soft relative bg-white rounded-2xl p-7 border border-[#dce0e5] hover:border-movel-200 hover:shadow-movel-lg transition-all text-center`}
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-9 h-9 bg-movel-gradient text-white text-[12px] font-black rounded-full flex items-center justify-center shadow-movel">
                  {step.num}
                </div>
                <div className="w-16 h-16 bg-movel-50 rounded-2xl flex items-center justify-center mx-auto mb-4 mt-2">
                  <step.Icon size={28} color="#0B1E4E" weight="fill" />
                </div>
                <h3 className="font-display text-[20px] text-movel-900 mb-2">{step.title}</h3>
                <p className="text-[14px] text-mute leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CARROCERÍAS
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white pt-14 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-7 reveal">
            <div>
              <p className="text-[11px] font-bold text-movel-600 uppercase tracking-[0.15em] mb-2">Navega por tipo</p>
              <h2 className="font-display text-[28px] md:text-[36px] gradient-text">Carrocerías disponibles</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {tipos.map((tipo, i) => {
              const Icon = tipo.icon;
              return (
                <Link
                  key={tipo.label}
                  href={`/buscar?tipo=${tipo.label}`}
                  onMouseMove={onGlowMove}
                  className={`reveal reveal-delay-${(i % 5) + 1} cursor-glow cursor-glow-soft group flex flex-col sm:flex-row items-center gap-3 p-4 rounded-xl bg-white border border-[#e5e7eb] hover:border-movel-300 hover:shadow-movel transition-all cursor-pointer`}
                >
                  <div className="text-mute group-hover:text-movel-900 transition-colors flex-shrink-0">
                    <Icon />
                  </div>
                  <span className="text-[13px] font-bold text-ink group-hover:text-movel-900 transition-colors">
                    {tipo.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          MARCAS
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-cloud py-12 border-y border-[#e5e7eb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 reveal">
            <p className="text-[11px] font-bold text-movel-600 uppercase tracking-[0.15em] mb-2">Marcas disponibles</p>
            <h2 className="font-display text-[24px] md:text-[32px] gradient-text">Las marcas que buscas</h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {marcas.map((m, i) => (
              <Link
                key={m}
                href={`/buscar?marca=${m}`}
                onMouseMove={onGlowMove}
                className={`reveal reveal-delay-${(i % 5) + 1} cursor-glow cursor-glow-soft group flex items-center gap-3 p-3.5 rounded-xl bg-white border border-[#e5e7eb] hover:border-movel-300 hover:shadow-movel transition-all`}
              >
                <div className="text-mute group-hover:text-movel-900 transition-colors flex-shrink-0 w-10 h-10 flex items-center justify-center">
                  <BrandIcon name={m} size={36} />
                </div>
                <span className="text-[14px] font-bold text-ink group-hover:text-movel-900 transition-colors">
                  {m}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          VEHÍCULOS DESTACADOS
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 reveal">
            <div>
              <p className="text-[11px] font-bold text-movel-600 uppercase tracking-[0.15em] mb-2">Disponibles ahora</p>
              <h2 className="font-display text-[28px] md:text-[36px] gradient-text">Vehículos publicados</h2>
              <p className="text-[15px] text-mute mt-1">{vehicles.length} carros en el catálogo</p>
            </div>
            <Link
              href="/buscar"
              {...ctaVer}
              className="cursor-glow cursor-glow-soft hidden sm:flex items-center gap-2 px-5 py-2.5 border-2 border-movel-900 text-movel-900 font-bold rounded-xl hover:bg-movel-900 hover:text-white transition-all text-[14px]"
            >
              Ver todos <ArrowRight size={16} />
            </Link>
          </div>

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

          <div className="text-center mt-10 reveal">
            <Link href="/buscar" className="inline-flex items-center gap-2 px-9 py-3.5 btn-primary text-[15px]">
              Ver todos los vehículos <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          POR QUÉ ELEGIR MOVEL — 3 razones honestas
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-cloud py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 reveal">
            <p className="text-[11px] font-bold text-movel-600 uppercase tracking-[0.15em] mb-3">Nuestra diferencia</p>
            <h2 className="font-display text-[28px] md:text-[40px] gradient-text flex items-center justify-center gap-2 flex-wrap">
              ¿Por qué elegir{" "}
              <MovelLogo variant="gradient" size={52} animate={false} className="inline-block" />
              ?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                Icon: Database,
                title: "Catálogo verificado",
                desc: "Trabajamos con la base de datos oficial de Fasecolda y Ministerio de Transporte. Cada referencia con cilindraje, año y especificaciones técnicas reales.",
                badge: "Datos oficiales",
              },
              {
                Icon: Handshake,
                title: "Asesoría personalizada",
                desc: "Te acompañamos durante todo el proceso de compra o venta. Resolvemos dudas, conectamos partes y orientamos en cada paso.",
                badge: "Servicio humano",
              },
              {
                Icon: CurrencyCircleDollar,
                title: "Comisión transparente",
                desc: "Publicar es gratis. Si quieres que vendamos por ti (atendemos visitas, peritaje, traspaso), solo cobramos 3% del valor final.",
                badge: "Solo 3%",
              },
            ].map((item, i) => (
              <div
                key={item.title}
                onMouseMove={onGlowMove}
                className={`reveal reveal-delay-${i + 1} cursor-glow cursor-glow-soft p-7 rounded-2xl bg-white border border-[#dce0e5] hover:border-movel-300 hover:shadow-movel-lg transition-all group h-full`}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="w-14 h-14 bg-movel-50 group-hover:bg-movel-gradient rounded-2xl flex items-center justify-center transition-all">
                    <item.Icon size={28} color="#0B1E4E" weight="fill" className="group-hover:hidden" />
                    <item.Icon size={28} color="white" weight="fill" className="hidden group-hover:block" />
                  </div>
                  <span className="text-[11px] font-bold text-movel-600 bg-movel-50 px-2.5 py-1 rounded-full">
                    {item.badge}
                  </span>
                </div>
                <h3 className="font-display text-[22px] text-movel-900 mb-3">{item.title}</h3>
                <p className="text-[14px] text-mute leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SUBASTAS EN VIVO
      ═══════════════════════════════════════════════════════════ */}
      {auctionVehicles.length > 0 && (
        <section className="bg-movel-gradient-dark py-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-movel-500 blur-3xl opacity-20" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex items-center justify-between mb-8 reveal">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-red-500/20 border border-red-400/40 flex items-center justify-center">
                  <Fire size={20} color="#ef4444" weight="fill" className="animate-pulse" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-red-300 uppercase tracking-[0.15em]">En tiempo real</p>
                  <h2 className="font-display text-[28px] md:text-[32px] text-white">Subastas activas</h2>
                </div>
              </div>
              <Link href="/subastas" className="hidden sm:flex items-center gap-2 px-5 py-2.5 border border-white/20 text-white/80 hover:text-white hover:border-white/40 font-bold rounded-xl transition-all text-[14px]">
                Ver todas <ArrowRight size={16} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {auctionVehicles.slice(0, 3).map((v, i) => (
                <Link
                  key={v.id}
                  href={`/vehiculo/${v.id}`}
                  className={`reveal reveal-delay-${(i % 3) + 1} block group`}
                >
                  <div className="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 overflow-hidden transition-all hover:border-movel-400/50 card-hover img-zoom">
                    <div className="relative h-44 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={v.fotos[0]} alt={v.titulo} className="w-full h-full object-cover" />
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
                          <p className="text-movel-300 font-black text-[18px]">{v.subasta ? formatCOP(v.subasta.ofertaActual) : ""}</p>
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
                        <span className="text-movel-300 text-[12px] font-bold group-hover:underline">Ver subasta →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-8 reveal">
              <Link href="/subastas" className="btn-sky inline-flex items-center gap-2 text-[15px]">
                Ver todas las subastas <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════
          VENDER — Banner con 2 opciones desplegables
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 md:py-20 bg-white" id="vender">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal rounded-3xl overflow-hidden relative bg-movel-gradient">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-20 w-32 h-32 rounded-full bg-movel-400/30 translate-y-1/2" />

            <div className="relative z-10 p-8 md:p-14">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-8">
                <div>
                  <span className="inline-block text-movel-200 text-[11px] font-bold uppercase tracking-[0.15em] mb-3 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                    Para vendedores
                  </span>
                  <h2 className="font-display text-[32px] md:text-[44px] text-white mt-2 mb-3 leading-tight">
                    ¿Quieres vender tu carro?<br/>
                    <span className="gradient-text-light">Tú decides cómo.</span>
                  </h2>
                  <p className="text-white/75 text-[15px] md:text-[16px] leading-relaxed">
                    Publica gratis y manéjalo tú mismo, o deja que <strong className="text-white inline-flex items-center gap-1"><MovelLogo variant="white" size={18} animate={false} className="inline-block" /> se encargue de todo</strong> por una comisión única del 3%. Sin tarifa fija, sin sorpresas.
                  </p>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <button
                    type="button"
                    onClick={() => setVenderMode(venderMode === "options" ? "closed" : "options")}
                    onMouseMove={onGlowMove}
                    className="cursor-glow cursor-glow-dark w-full lg:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-movel-900 font-black text-[16px] rounded-2xl hover:bg-cloud transition-all shadow-2xl hover:scale-[1.02]"
                  >
                    {venderMode === "options" ? "Ocultar opciones" : "Ver opciones de venta"}
                    <motion.span animate={{ rotate: venderMode === "options" ? 180 : 0 }} transition={{ duration: 0.25 }}>
                      <CaretDown size={18} weight="bold" />
                    </motion.span>
                  </button>
                  <a
                    href="https://wa.me/573175737083?text=Hola, quiero vender mi vehículo en MOVEL"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full lg:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-[#25d366]/90 text-white font-bold text-[14px] rounded-xl hover:bg-[#25d366] transition-all"
                  >
                    <WhatsappLogo size={18} weight="fill" />
                    Hablar con asesor
                  </a>
                </div>
              </div>

              <AnimatePresence>
                {venderMode === "options" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="pt-6 mt-4 border-t border-white/15 grid grid-cols-1 lg:grid-cols-2 gap-5">

                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        onMouseMove={onGlowMove}
                        className="cursor-glow group relative bg-white rounded-2xl p-7 hover:shadow-2xl transition-all"
                      >
                        <div className="flex items-center gap-3 mb-5">
                          <div className="w-12 h-12 rounded-xl bg-movel-50 flex items-center justify-center flex-shrink-0">
                            <UploadSimple size={24} color="#0B1E4E" weight="fill" />
                          </div>
                          <div>
                            <h3 className="font-display text-[20px] text-movel-900 leading-tight">Publica gratis</h3>
                            <p className="text-[12px] text-mute font-semibold uppercase tracking-wide">Tú lo manejas</p>
                          </div>
                        </div>

                        <p className="text-[14px] text-mute leading-relaxed mb-5">
                          Crea tu publicación gratis, sube tus fotos y atiende a los compradores directamente. <strong className="text-ink">$0 comisión</strong> — solo paga si quieres destacar tu anuncio.
                        </p>

                        <ul className="space-y-2.5 mb-6">
                          {[
                            "Publicación 100% gratuita",
                            "Tus fotos, tu precio, tu manejo",
                            "Contacto directo con compradores",
                            "Publicación destacada opcional",
                          ].map((b) => (
                            <li key={b} className="flex items-start gap-2 text-[13px] text-ink">
                              <CheckCircle size={16} color="#3CCF91" weight="fill" className="flex-shrink-0 mt-0.5" />
                              {b}
                            </li>
                          ))}
                        </ul>

                        <Link
                          href="/publicar?modo=gratis"
                          className="block w-full text-center px-5 py-3.5 border-2 border-movel-900 text-movel-900 font-bold rounded-xl hover:bg-movel-900 hover:text-white transition-all text-[14px]"
                        >
                          Publicar gratis →
                        </Link>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.18, duration: 0.4 }}
                        onMouseMove={onGlowMove}
                        className="cursor-glow cursor-glow-dark group relative bg-movel-gradient-dark rounded-2xl p-7 hover:shadow-2xl transition-all border border-movel-400/30 overflow-hidden"
                      >
                        {/* Badge en flujo, separado del título */}
                        <div className="mb-5">
                          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.15em] bg-sky text-white px-3 py-1.5 rounded-full whitespace-nowrap shadow-lg">
                            ⚡ Recomendado
                          </span>
                        </div>

                        <div className="flex items-start gap-3 mb-5">
                          <div className="w-12 h-12 rounded-xl bg-movel-400/20 border border-movel-400/40 flex items-center justify-center flex-shrink-0">
                            <Handshake size={24} color="#3F8CFF" weight="fill" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-display text-[20px] text-white leading-tight">Servicio integral 360°</h3>
                            <p className="text-[12px] text-movel-300 font-semibold uppercase tracking-wide">Nosotros lo hacemos</p>
                          </div>
                        </div>

                        <p className="text-[14px] text-white/75 leading-relaxed mb-5">
                          Nosotros nos encargamos de <strong className="text-white">todo el proceso de venta</strong>: desde las fotos profesionales hasta el traspaso final. Tú no atiendes llamadas, no recibes visitas, no estás disponible. Solo recibes ofertas serias filtradas por nosotros, eliges la mejor y firmas.
                        </p>

                        <ul className="space-y-3 mb-6">
                          {[
                            { Icon: Camera,        t: "Fotos profesionales del vehículo",       sub: "Sesión con fotógrafo en estudio o tu casa" },
                            { Icon: Wrench,        t: "Peritaje técnico profesional",            sub: "Mecánica, latonería, eléctrica, documentos" },
                            { Icon: UsersThree,    t: "Atendemos llamadas y mensajes",           sub: "Filtramos a los curiosos. Solo te pasamos los serios" },
                            { Icon: CalendarCheck, t: "Coordinamos visitas y pruebas de manejo", sub: "Agendamos en horarios que te convengan" },
                            { Icon: FileText,      t: "Gestión legal del traspaso",              sub: "Documentos, RUNT, impuestos, todo nosotros" },
                            { Icon: ShieldCheck,   t: "Publicación en redes y marketplaces",     sub: "Visibilidad multicanal · 4× más alcance" },
                          ].map((b) => (
                            <li key={b.t} className="flex items-start gap-2.5 text-[13px]">
                              <b.Icon size={16} color="#3F8CFF" weight="fill" className="flex-shrink-0 mt-1" />
                              <div>
                                <p className="text-white/95 font-semibold">{b.t}</p>
                                <p className="text-white/55 text-[12px] mt-0.5">{b.sub}</p>
                              </div>
                            </li>
                          ))}
                        </ul>

                        {/* Comparativa rápida */}
                        <div className="grid grid-cols-2 gap-2 mb-5 p-3 rounded-xl bg-white/5 border border-white/10">
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-white/50 font-bold mb-0.5">⏱ Tiempo promedio</p>
                            <p className="text-[16px] font-display text-white">21 días</p>
                            <p className="text-[10px] text-white/40">vs. 60+ por tu cuenta</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-white/50 font-bold mb-0.5">💼 Tu tiempo invertido</p>
                            <p className="text-[16px] font-display text-white">~0 horas</p>
                            <p className="text-[10px] text-white/40">solo firmas al final</p>
                          </div>
                        </div>

                        <div className="flex items-end justify-between mb-5 pt-4 border-t border-white/15">
                          <div>
                            <p className="text-[11px] text-white/60 uppercase tracking-wide font-bold">Solo cobramos</p>
                            <CommissionCounter inverted />
                            <p className="text-[12px] text-white/60 mt-1">de la venta final · sin tarifa fija</p>
                          </div>
                        </div>

                        <Link
                          href="/publicar?modo=360"
                          {...ctaPublicar}
                          className="cursor-glow cursor-glow-dark block w-full text-center px-5 py-3.5 bg-white text-movel-900 font-black rounded-xl hover:bg-cloud transition-all text-[14px]"
                        >
                          Quiero el servicio integral →
                        </Link>
                      </motion.div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CTA CONTACTO
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white py-12 border-t border-[#dce0e5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="reveal flex flex-col md:flex-row items-center justify-between gap-6 bg-movel-50 rounded-2xl p-8">
            <div>
              <h3 className="font-display text-[22px] md:text-[26px] text-movel-900 mb-1">¿Tienes preguntas? Estamos aquí</h3>
              <p className="text-[14px] text-mute">Lunes a viernes 8am–6pm · Sábados 9am–2pm</p>
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
              <a href="tel:+573175737083" className="btn-primary flex items-center gap-2 text-[14px]">
                <Phone size={18} weight="fill" />
                Llamar ahora
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════════ */}
      <footer className="bg-night text-white pt-14 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div className="md:col-span-1">
              <div className="mb-4">
                <MovelLogo variant="white" size={40} animate={false} />
              </div>
              <p className="text-white/55 text-[14px] leading-relaxed mb-5">
                Compra y vende vehículos con asesoría 360°. Solo 3% de comisión si vendemos por ti.
              </p>
              <div className="flex gap-3">
                <a href="https://wa.me/573175737083" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 hover:bg-[#25d366] rounded-lg flex items-center justify-center transition-colors">
                  <WhatsappLogo size={18} color="white" weight="fill" />
                </a>
                <a href="tel:+573175737083" className="w-9 h-9 bg-white/10 hover:bg-movel-500 rounded-lg flex items-center justify-center transition-colors">
                  <Phone size={16} color="white" weight="fill" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-[14px] font-bold mb-4 text-white">Comprar</h4>
              <ul className="space-y-2.5">
                <li><Link href="/buscar" className="text-[14px] text-white/55 hover:text-white transition-colors">Todos los carros</Link></li>
                <li><Link href="/buscar?tipo=SUV+%2F+Camioneta" className="text-[14px] text-white/55 hover:text-white transition-colors">SUVs y Camionetas</Link></li>
                <li><Link href="/buscar?tipo=Sedan" className="text-[14px] text-white/55 hover:text-white transition-colors">Sedanes</Link></li>
                <li><Link href="/buscar?precioMax=50000000" className="text-[14px] text-white/55 hover:text-white transition-colors">Carros económicos</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[14px] font-bold mb-4 text-white">Vender</h4>
              <ul className="space-y-2.5">
                <li><Link href="/publicar?modo=gratis" className="text-[14px] text-white/55 hover:text-white transition-colors">Publicar gratis</Link></li>
                <li><Link href="/publicar?modo=360" className="text-[14px] text-white/55 hover:text-white transition-colors">Servicio integral 3%</Link></li>
                <li><Link href="/#como-funciona" className="text-[14px] text-white/55 hover:text-white transition-colors">¿Cómo funciona?</Link></li>
                <li><Link href="/subastas" className="text-[14px] text-white/55 hover:text-white transition-colors">Subastas en vivo</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[14px] font-bold mb-4 text-white">Contacto</h4>
              <ul className="space-y-2.5">
                <li><a href="https://wa.me/573175737083" target="_blank" rel="noopener noreferrer" className="text-[14px] text-white/55 hover:text-white transition-colors">+57 317 573 7083</a></li>
                <li><a href="mailto:movelcol@outlook.com" className="text-[14px] text-white/55 hover:text-white transition-colors">movelcol@outlook.com</a></li>
                <li><span className="text-[14px] text-white/55">Bogotá, Colombia</span></li>
                <li><span className="text-[14px] text-white/55">L–V: 8am–6pm</span></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-[13px] text-white/40">
              © 2025 MOVEL S.A.S. · Todos los derechos reservados · NIT: 901.234.567-8
            </p>
            <div className="flex gap-4">
              <Link href="/terminos" className="text-[12px] text-white/40 hover:text-white transition-colors">Términos y Condiciones</Link>
              <Link href="/privacidad" className="text-[12px] text-white/40 hover:text-white transition-colors">Política de Privacidad</Link>
            </div>
          </div>
        </div>
      </footer>

      <BottomNav />
    </div>
  );
}
