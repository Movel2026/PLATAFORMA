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
  Sparkle, Star, Quotes,
} from "@phosphor-icons/react";
import { vehicles, getAuctionVehicles, formatCOP } from "@/lib/mock-data";
import VehicleCard from "@/components/VehicleCard";
import BottomNav from "@/components/BottomNav";
import { MovelLogo } from "@/components/MovelLogo";
import { useCursorGlow } from "@/lib/hooks/useCursorGlow";
import { useScrollReveal } from "@/lib/hooks/useScrollReveal";

// ── Shared transition helpers ────────────────────────────────────────
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
  "Toyota", "Mazda", "Chevrolet", "Kia", "Renault",
  "Hyundai", "Nissan", "Ford", "Honda", "Mitsubishi",
];

// ── 2D vehicle silhouettes ─────────────────────────────────────────────

function SedanIcon()     { return <svg viewBox="0 0 80 44" className="w-14 h-8"><path d="M5,37 L5,25 L18,25 L24,13 L56,13 L62,21 L75,21 L75,37 Z" fill="#7A8195"/><path d="M21,24 L25,15 L50,15 L50,24 Z" fill="#A5C6FF"/><path d="M52,24 L52,15 L60,15 L64,21 L64,24 Z" fill="#A5C6FF"/><circle cx="18" cy="37" r="7" fill="#F4F2EC" stroke="#7A8195" strokeWidth="2.5"/><circle cx="62" cy="37" r="7" fill="#F4F2EC" stroke="#7A8195" strokeWidth="2.5"/></svg>; }
function HatchbackIcon() { return <svg viewBox="0 0 80 44" className="w-14 h-8"><path d="M5,37 L5,27 L18,27 L24,13 L52,13 L66,31 L75,31 L75,37 Z" fill="#7A8195"/><path d="M21,26 L25,15 L50,15 L50,26 Z" fill="#A5C6FF"/><circle cx="18" cy="37" r="7" fill="#F4F2EC" stroke="#7A8195" strokeWidth="2.5"/><circle cx="62" cy="37" r="7" fill="#F4F2EC" stroke="#7A8195" strokeWidth="2.5"/></svg>; }
function SuvIcon()       { return <svg viewBox="0 0 80 44" className="w-14 h-8"><path d="M5,37 L5,18 L16,18 L22,8 L62,8 L66,14 L75,14 L75,37 Z" fill="#7A8195"/><path d="M19,18 L23,10 L44,10 L44,18 Z" fill="#A5C6FF"/><path d="M46,18 L46,10 L62,10 L64,14 L64,18 Z" fill="#A5C6FF"/><circle cx="19" cy="37" r="8" fill="#F4F2EC" stroke="#7A8195" strokeWidth="2.5"/><circle cx="61" cy="37" r="8" fill="#F4F2EC" stroke="#7A8195" strokeWidth="2.5"/></svg>; }
function CamionetaIcon() { return <svg viewBox="0 0 80 44" className="w-14 h-8"><path d="M5,37 L5,17 L18,17 L22,8 L64,8 L70,17 L75,20 L75,37 Z" fill="#7A8195"/><path d="M19,17 L22,10 L44,10 L44,17 Z" fill="#A5C6FF"/><circle cx="19" cy="37" r="8" fill="#F4F2EC" stroke="#7A8195" strokeWidth="2.5"/><circle cx="62" cy="37" r="8" fill="#F4F2EC" stroke="#7A8195" strokeWidth="2.5"/></svg>; }
function CoupeIcon()     { return <svg viewBox="0 0 80 44" className="w-14 h-8"><path d="M5,37 L5,29 L20,29 L30,14 L58,13 L68,27 L75,27 L75,37 Z" fill="#7A8195"/><path d="M24,28 L32,16 L54,15 L54,28 Z" fill="#A5C6FF"/><circle cx="18" cy="37" r="7" fill="#F4F2EC" stroke="#7A8195" strokeWidth="2.5"/><circle cx="62" cy="37" r="7" fill="#F4F2EC" stroke="#7A8195" strokeWidth="2.5"/></svg>; }
function PickupIcon()    { return <svg viewBox="0 0 80 44" className="w-14 h-8"><path d="M5,37 L5,18 L15,18 L19,9 L42,9 L42,37 Z" fill="#7A8195"/><path d="M17,18 L20,11 L40,11 L40,18 Z" fill="#A5C6FF"/><path d="M42,26 L42,37 L75,37 L75,26 Z" fill="#7A8195"/><line x1="42" y1="26" x2="75" y2="26" stroke="#5A6478" strokeWidth="1.5"/><circle cx="18" cy="37" r="8" fill="#F4F2EC" stroke="#7A8195" strokeWidth="2.5"/><circle cx="62" cy="37" r="8" fill="#F4F2EC" stroke="#7A8195" strokeWidth="2.5"/></svg>; }

const tipos = [
  { label: "SUV",       icon: <SuvIcon /> },
  { label: "Sedán",     icon: <SedanIcon /> },
  { label: "Hatchback", icon: <HatchbackIcon /> },
  { label: "Camioneta", icon: <CamionetaIcon /> },
  { label: "Coupé",     icon: <CoupeIcon /> },
  { label: "Pick-up",   icon: <PickupIcon /> },
];

// ─── 3% commission counter ─────────────────────────────────────────────
function CommissionCounter() {
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
    <div ref={ref} className="font-display text-[80px] md:text-[140px] leading-none gradient-text-light">
      {shown.toFixed(1)}<span className="text-movel-300">%</span>
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
  const auctionVehicles           = getAuctionVehicles();

  // Hero video cross-fade
  const [showLogo, setShowLogo] = useState(true);
  const logoVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setShowLogo(false), 7000);
    return () => clearTimeout(t);
  }, []);

  // Scroll reveal
  useScrollReveal();

  // Cursor glow handlers
  const heroCTA = useCursorGlow();
  const heroVentaCTA = useCursorGlow();
  const ctaVer = useCursorGlow();
  const ctaPublicar = useCursorGlow();

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
          HERO — Promesa clara + buscador estrella
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center overflow-hidden">

        {/* Logo intro video */}
        <video
          ref={logoVideoRef}
          src="/videos/logo-movel.mp4"
          autoPlay muted playsInline
          onEnded={() => setShowLogo(false)}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms]"
          style={{ opacity: showLogo ? 1 : 0, zIndex: 2 }}
        />

        {/* Car video en loop */}
        <video
          src="/videos/video-fondo.mp4"
          autoPlay muted loop playsInline
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[1200ms]"
          style={{ opacity: showLogo ? 0 : 1, zIndex: 1 }}
        />

        {/* Overlay gradient Movel Blue */}
        <div
          className="absolute inset-0"
          style={{
            zIndex: 3,
            background: "linear-gradient(180deg, rgba(11,30,78,0.55) 0%, rgba(11,30,78,0.45) 40%, rgba(5,14,38,0.92) 100%)"
          }}
        />

        {/* Contenido */}
        <div className="relative flex flex-col items-center px-4 pt-16 pb-20 w-full max-w-5xl" style={{ zIndex: 10 }}>

          {/* Badge superior */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-7"
          >
            <span className="inline-flex items-center gap-2 bg-movel-900/40 border border-movel-400/50 text-movel-200 text-[12px] font-bold px-4 py-2 rounded-full backdrop-blur-sm">
              <Sparkle size={14} weight="fill" color="#3F8CFF" className="animate-pulse" />
              Servicio 360° · Solo 3% de comisión
            </span>
          </motion.div>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8, ease: EASE_OUT }}
            className="mb-7"
            style={{ filter: "drop-shadow(0 0 50px rgba(63,140,255,0.45))" }}
          >
            <MovelLogo variant="white" size={92} animate />
          </motion.div>

          {/* Promesa principal */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.7 }}
            className="font-display text-center text-[34px] sm:text-[44px] md:text-[56px] leading-[0.95] mb-5 max-w-3xl"
          >
            <span className="text-white">Nosotros vendemos,</span>
            <br />
            <span className="gradient-text-light">tú te relajas.</span>
          </motion.h1>

          {/* Sub-promesa única */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.78, duration: 0.55 }}
            className="text-[15px] md:text-[17px] text-white/70 text-center mb-9 max-w-xl font-medium"
          >
            Atendemos contactos, agendamos visitas y hacemos el traspaso.
            <br className="hidden md:block" />
            Tú solo recibes ofertas serias y firmas.
          </motion.p>

          {/* Buscador grande (estrella) */}
          <motion.form
            onSubmit={handleSearch}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.88, duration: 0.6 }}
            className="w-full max-w-2xl bg-white rounded-2xl p-2 flex gap-2 shadow-2xl shadow-black/40 mb-4 border border-white/20"
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

          {/* Chips de filtro rápido */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.95, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-2 mb-7 max-w-xl"
          >
            {["SUV", "Sedán", "Camioneta", "Hasta $50M", "Automático"].map((chip) => (
              <button
                key={chip}
                onClick={() => router.push(`/buscar?q=${encodeURIComponent(chip)}`)}
                className="text-[12px] font-semibold px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-white/80 hover:bg-white/20 hover:border-white/40 transition-all backdrop-blur-sm"
              >
                {chip}
              </button>
            ))}
          </motion.div>

          {/* CTA: Vender mi carro */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.55 }}
            className="flex gap-3 mb-5 w-full max-w-2xl"
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

          {/* Panel de filtros */}
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
                  <select value={fMarca} onChange={(e) => setFMarca(e.target.value)}
                    className="bg-white/15 border border-white/20 text-white text-[13px] rounded-xl px-3 py-2.5 outline-none [&>option]:bg-night">
                    <option value="">Marca</option>
                    {["Toyota","Mazda","Chevrolet","Kia","Renault","Hyundai","Nissan","Ford"].map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <select value={fTipo} onChange={(e) => setFTipo(e.target.value)}
                    className="bg-white/15 border border-white/20 text-white text-[13px] rounded-xl px-3 py-2.5 outline-none [&>option]:bg-night">
                    <option value="">Tipo</option>
                    {["SUV","Sedán","Hatchback","Camioneta","Coupé"].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <select value={fTransmision} onChange={(e) => setFTrans(e.target.value)}
                    className="bg-white/15 border border-white/20 text-white text-[13px] rounded-xl px-3 py-2.5 outline-none [&>option]:bg-night">
                    <option value="">Transmisión</option>
                    <option value="Automático">Automático</option>
                    <option value="Manual">Manual</option>
                  </select>
                  <select value={fPrecioMax} onChange={(e) => setFPrecio(e.target.value)}
                    className="bg-white/15 border border-white/20 text-white text-[13px] rounded-xl px-3 py-2.5 outline-none [&>option]:bg-night">
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
              <CaretDown size={22} color="rgba(255,255,255,0.35)" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          TRUST STRIP — sin emojis, iconos Phosphor
      ═══════════════════════════════════════════════════════════ */}
      <div className="bg-night border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-6">
            {[
              { icon: ShieldCheck,   title: "Garantía 90 días", desc: "Motor y transmisión cubiertos" },
              { icon: CheckCircle,   title: "Devolución 7 días", desc: "Si no te convence, lo cambias" },
              { icon: ClipboardText, title: "Inspección 150 puntos", desc: "Cada vehículo verificado" },
              { icon: FileText,      title: "Historial transparente", desc: "Sin sorpresas, sin trampas" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className={`reveal reveal-delay-${i + 1} flex items-start gap-3`}
                >
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
          SERVICIO 360° — Diferencial clave
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white py-16 md:py-20 relative overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-movel-50 blur-3xl opacity-60" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-movel-50 blur-3xl opacity-60" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12 reveal">
            <span className="inline-block text-[11px] font-bold text-movel-600 uppercase tracking-[0.15em] mb-3 bg-movel-50 px-3 py-1.5 rounded-full">
              Nuestro diferencial · 360°
            </span>
            <h2 className="font-display text-[36px] md:text-[52px] gradient-text mb-4">
              Nosotros hacemos<br/>el trabajo difícil
            </h2>
            <p className="text-[16px] text-mute max-w-2xl mx-auto">
              Mientras tú sigues con tu vida, nosotros nos ocupamos de cada llamada,
              cada visita y cada papel. Tú solo recibes ofertas serias.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                num: "01",
                icon: Phone,
                title: "Atendemos contactos",
                desc: "Filtramos a cada comprador, respondemos preguntas y descartamos los que no son serios. Tú nunca atiendes una llamada.",
              },
              {
                num: "02",
                icon: CalendarCheck,
                title: "Agendamos visitas",
                desc: "Coordinamos las pruebas de manejo en horarios que te convengan. Estamos contigo durante toda la negociación.",
              },
              {
                num: "03",
                icon: Handshake,
                title: "Hacemos el traspaso",
                desc: "Documentos, peritaje, runt, traspaso. Todo el trámite legal lo hacemos por ti. Tú solo firmas y recibes tu pago.",
              },
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className={`reveal reveal-delay-${i + 1} cursor-glow cursor-glow-soft group relative bg-white rounded-3xl p-8 border border-[#dce0e5] hover:border-movel-200 hover:shadow-movel-lg transition-all`}
                  onMouseMove={(e) => {
                    const el = e.currentTarget;
                    const rect = el.getBoundingClientRect();
                    el.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
                    el.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
                  }}
                >
                  <div className="absolute top-6 right-6 font-display text-[44px] text-movel-50 group-hover:text-movel-100 transition-colors leading-none">
                    {step.num}
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-movel-gradient flex items-center justify-center mb-5 shadow-movel">
                    <Icon size={26} color="white" weight="fill" />
                  </div>
                  <h3 className="font-display text-[22px] text-movel-900 mb-3">{step.title}</h3>
                  <p className="text-[14px] text-mute leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          COMISIÓN 3% — Número grande con orgullo
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-movel-gradient-dark py-20 md:py-28 relative overflow-hidden">
        {/* Blurred orbs decorativos */}
        <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-movel-400 blur-3xl opacity-20" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-movel-500 blur-3xl opacity-25" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div className="reveal">
            <span className="inline-block text-[11px] font-bold text-movel-300 uppercase tracking-[0.15em] mb-5 bg-movel-900/60 px-4 py-2 rounded-full backdrop-blur-sm border border-movel-400/20">
              Sin sorpresas en la factura
            </span>
          </div>
          <h2 className="font-display text-[26px] md:text-[36px] text-white/90 mb-2 reveal reveal-delay-1">
            Solo cobramos
          </h2>
          <div className="reveal reveal-delay-2">
            <CommissionCounter />
          </div>
          <p className="font-display text-[26px] md:text-[36px] text-white/90 mt-2 mb-6 reveal reveal-delay-3">
            de comisión
          </p>
          <p className="text-[16px] md:text-[18px] text-white/70 max-w-2xl mx-auto leading-relaxed reveal reveal-delay-4">
            Es la tarifa más baja del mercado. Sin cuotas mensuales, sin costos
            ocultos, sin letra pequeña. Pagas solo cuando vendemos tu carro.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3 reveal reveal-delay-5">
            <span className="text-[13px] font-semibold px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/90 backdrop-blur-sm">
              ✓ Publicación gratuita
            </span>
            <span className="text-[13px] font-semibold px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/90 backdrop-blur-sm">
              ✓ Peritaje incluido
            </span>
            <span className="text-[13px] font-semibold px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/90 backdrop-blur-sm">
              ✓ Traspaso incluido
            </span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SOCIAL PROOF — Testimonio + cifras
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-cloud py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

            {/* Testimonio */}
            <div className="reveal bg-white rounded-3xl p-8 md:p-10 shadow-movel relative">
              <Quotes size={42} color="#3F8CFF" weight="fill" className="absolute -top-4 left-8 bg-cloud rounded-full p-2 w-12 h-12" />
              <div className="flex gap-1 mb-5 mt-2">
                {[1,2,3,4,5].map(i => <Star key={i} size={18} color="#FF6B3D" weight="fill" />)}
              </div>
              <p className="font-display text-[22px] md:text-[26px] text-ink leading-tight mb-6">
                "Vendí mi carro en 11 días sin atender una sola llamada. Movel hizo todo:
                me trajeron 3 ofertas serias y elegí. <span className="text-movel-600">Es como tener un asesor personal</span>."
              </p>
              <div className="flex items-center gap-3 pt-5 border-t border-[#dce0e5]">
                <div className="w-12 h-12 rounded-full bg-movel-gradient flex items-center justify-center text-white font-bold text-[16px]">
                  MA
                </div>
                <div>
                  <p className="text-[15px] font-bold text-ink">María Acosta</p>
                  <p className="text-[13px] text-mute">Mazda CX-5 2021 · Bogotá</p>
                </div>
              </div>
            </div>

            {/* Cifras */}
            <div className="grid grid-cols-2 gap-5">
              {[
                { num: "847",   label: "Carros vendidos",       sub: "este año" },
                { num: "11",    label: "Días promedio",          sub: "de venta" },
                { num: "98%",   label: "Clientes satisfechos",   sub: "Trustpilot 4.9★" },
                { num: "3%",    label: "Comisión única",         sub: "sin sorpresas" },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className={`reveal reveal-delay-${i + 1} bg-white rounded-2xl p-6 border border-[#dce0e5] hover:border-movel-200 hover:shadow-movel transition-all`}
                >
                  <p className="font-display text-[40px] md:text-[52px] gradient-text leading-none mb-2">
                    {stat.num}
                  </p>
                  <p className="text-[14px] font-bold text-ink">{stat.label}</p>
                  <p className="text-[12px] text-mute">{stat.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          MARCAS
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-white pt-12 pb-10 border-b border-[#e5e7eb]">
        <div className="max-w-4xl mx-auto px-4 reveal">
          <p className="text-center text-[10px] font-bold text-mute uppercase tracking-[0.2em] mb-7">
            Todas las marcas disponibles
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-9 gap-y-3">
            {marcas.map((m) => (
              <Link
                key={m}
                href={`/buscar?marca=${m}`}
                className="text-[15px] font-bold text-ink hover:text-movel-600 transition-colors duration-200 tracking-tight"
              >
                {m}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CATEGORÍAS
      ═══════════════════════════════════════════════════════════ */}
      <section className="bg-cloud py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-7 reveal">
            <div>
              <p className="text-[11px] font-bold text-movel-600 uppercase tracking-[0.15em] mb-2">Navega por tipo</p>
              <h2 className="font-display text-[28px] md:text-[32px] gradient-text">Encuentra tu estilo</h2>
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {tipos.map((tipo, i) => (
              <Link
                key={tipo.label}
                href={`/buscar?tipo=${tipo.label}`}
                className={`reveal reveal-delay-${(i % 5) + 1} cursor-glow cursor-glow-soft flex flex-col items-center gap-3 p-5 rounded-2xl bg-white border border-[#dce0e5] hover:border-movel-300 hover:shadow-movel transition-all group cursor-pointer`}
                onMouseMove={(e) => {
                  const el = e.currentTarget;
                  const rect = el.getBoundingClientRect();
                  el.style.setProperty("--mx", `${((e.clientX - rect.left) / rect.width) * 100}%`);
                  el.style.setProperty("--my", `${((e.clientY - rect.top) / rect.height) * 100}%`);
                }}
              >
                <div className="group-hover:[&_path]:fill-movel-600 group-hover:[&_circle]:stroke-movel-600 transition-all duration-200">
                  {tipo.icon}
                </div>
                <span className="text-[12px] font-bold text-mute group-hover:text-movel-900 transition-colors uppercase tracking-wide">
                  {tipo.label}
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
              <h2 className="font-display text-[28px] md:text-[36px] gradient-text">Vehículos verificados</h2>
              <p className="text-[15px] text-mute mt-1">{vehicles.length} carros listos para entregar hoy</p>
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
            <Link
              href="/buscar"
              className="inline-flex items-center gap-2 px-9 py-3.5 btn-primary text-[15px]"
            >
              Ver todos los vehículos <ArrowRight size={18} />
            </Link>
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
          BANNER VENDER
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-14 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto reveal">
          <div className="rounded-3xl p-8 md:p-14 text-white flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative bg-movel-gradient">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-20 w-32 h-32 rounded-full bg-movel-400/30 translate-y-1/2" />

            <div className="max-w-xl relative z-10">
              <span className="inline-block text-movel-200 text-[11px] font-bold uppercase tracking-[0.15em] mb-3 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                Para vendedores
              </span>
              <h2 className="font-display text-[32px] md:text-[44px] mt-2 mb-3 leading-tight">
                Tú no atiendes,<br/>
                <span className="gradient-text-light">nosotros sí.</span>
              </h2>
              <p className="text-white/75 text-[16px] leading-relaxed mb-6">
                Publica gratis, nosotros hacemos el peritaje, atendemos a los compradores,
                agendamos visitas y hacemos el traspaso. Tú solo recibes tu pago.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { icon: CheckCircle, t: "Publicación gratuita" },
                  { icon: ShieldCheck, t: "Pago garantizado" },
                  { icon: Clock,       t: "Vendido en 11 días promedio" },
                ].map((tag) => {
                  const Icon = tag.icon;
                  return (
                    <span key={tag.t} className="text-[12px] text-white/85 bg-white/10 border border-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm flex items-center gap-1.5">
                      <Icon size={13} weight="fill" /> {tag.t}
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="relative z-10 flex flex-col gap-3 w-full md:w-auto">
              <Link
                href="/publicar"
                {...ctaPublicar}
                className="cursor-glow cursor-glow-dark px-8 py-4 bg-white text-movel-900 font-black text-[16px] rounded-2xl hover:bg-cloud transition-all shadow-2xl text-center hover:scale-105"
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
              <a
                href="tel:+573175737083"
                className="btn-primary flex items-center gap-2 text-[14px]"
              >
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
                Nosotros vendemos, tú te relajas. El marketplace 360° más confiable de Colombia.
              </p>
              <div className="flex gap-3">
                <a href="https://wa.me/573175737083" target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 bg-white/10 hover:bg-[#25d366] rounded-lg flex items-center justify-center transition-colors">
                  <WhatsappLogo size={18} color="white" weight="fill" />
                </a>
                <a href="tel:+573175737083"
                  className="w-9 h-9 bg-white/10 hover:bg-movel-500 rounded-lg flex items-center justify-center transition-colors">
                  <Phone size={16} color="white" weight="fill" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-[14px] font-bold mb-4 text-white">Comprar</h4>
              <ul className="space-y-2.5">
                <li><Link href="/buscar" className="text-[14px] text-white/55 hover:text-white transition-colors">Todos los carros</Link></li>
                <li><Link href="/buscar?tipo=SUV" className="text-[14px] text-white/55 hover:text-white transition-colors">SUVs disponibles</Link></li>
                <li><Link href="/buscar?tipo=Sedan" className="text-[14px] text-white/55 hover:text-white transition-colors">Sedanes</Link></li>
                <li><Link href="/buscar?precioMax=50000000" className="text-[14px] text-white/55 hover:text-white transition-colors">Carros económicos</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-[14px] font-bold mb-4 text-white">Vender</h4>
              <ul className="space-y-2.5">
                <li><Link href="/publicar" className="text-[14px] text-white/55 hover:text-white transition-colors">Publicar vehículo</Link></li>
                <li><a href="#como-funciona" className="text-[14px] text-white/55 hover:text-white transition-colors">Servicio 360°</a></li>
                <li><a href="https://wa.me/573175737083?text=Hola%20MOVEL%2C%20quiero%20información%20sobre%20el%20peritaje%20gratuito" target="_blank" rel="noopener noreferrer" className="text-[14px] text-white/55 hover:text-white transition-colors">Peritaje gratis</a></li>
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
              <a href="https://wa.me/573175737083?text=Términos%20y%20condiciones" target="_blank" rel="noopener noreferrer" className="text-[12px] text-white/40 hover:text-white transition-colors">Términos</a>
              <a href="https://wa.me/573175737083?text=Política%20de%20privacidad" target="_blank" rel="noopener noreferrer" className="text-[12px] text-white/40 hover:text-white transition-colors">Privacidad</a>
            </div>
          </div>
        </div>
      </footer>

      <BottomNav />
    </div>
  );
}
