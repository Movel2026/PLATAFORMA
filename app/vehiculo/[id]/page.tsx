"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { getVehicleById, formatCOP } from "@/lib/mock-data";
import BottomNav from "@/components/BottomNav";
import { showToast } from "@/components/Toast";
import CalculadoraGastos from "@/components/CalculadoraGastos";
import CalculadoraFinanciacion from "@/components/CalculadoraFinanciacion";
import { useUser } from "@/lib/hooks/useUser";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import {
  ArrowLeft, ShareNetwork, Heart, WhatsappLogo,
  Gauge, Gear, Car, Drop, Palette, Star,
  MapPin, ShieldCheck, ClipboardText, CurrencyCircleDollar,
  CaretLeft, CaretRight, Tag, CheckCircle, X as XIcon,
  MagnifyingGlassPlus, User as UserIcon, SignIn,
} from "@phosphor-icons/react";

interface Props {
  params: { id: string };
}

import type { Vehicle } from "@/lib/mock-data";

export default function VehicleDetailPage({ params }: Props) {
  const mockVehicle = getVehicleById(params.id);
  const [vehicleFromDb, setVehicleFromDb] = useState<Vehicle | null>(null);
  const [loadingVehicle, setLoadingVehicle] = useState(!mockVehicle);

  // Si no está en mock data, buscar en Supabase (publicaciones reales activas)
  useEffect(() => {
    if (mockVehicle) return;
    fetch("/api/vehiculos")
      .then((r) => r.ok ? r.json() : { vehicles: [] })
      .then((d) => {
        const found = (d.vehicles || []).find((v: Vehicle) => v.id === params.id);
        setVehicleFromDb(found ?? null);
      })
      .catch(() => setVehicleFromDb(null))
      .finally(() => setLoadingVehicle(false));
  }, [params.id, mockVehicle]);

  const vehicle = mockVehicle ?? vehicleFromDb;

  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [liked, setLiked] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50, show: false });
  const photoZoomRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const [showOffer, setShowOffer] = useState(false);

  // Cargar estado de favorito desde Supabase si hay sesión
  useEffect(() => {
    if (!user || !vehicle) return;
    const sb = getSupabaseBrowser();
    if (sb) {
      sb.from("favoritos")
        .select("vehicle_id")
        .eq("user_id", user.id)
        .eq("vehicle_id", vehicle.id)
        .maybeSingle()
        .then(({ data }) => setLiked(!!data));
    }
  }, [user, vehicle]);

  async function handleLike() {
    if (!user) { setShowAuthPrompt(true); return; }
    if (!vehicle) return;
    const next = !liked;
    setLiked(next);

    // Sincronizar con localStorage (siempre funciona)
    try {
      const raw = localStorage.getItem("movel_favoritos");
      const favs: { id: string; titulo: string; precio: number; km?: string }[] = raw ? JSON.parse(raw) : [];
      if (next) {
        if (!favs.find((f) => f.id === vehicle.id)) {
          favs.push({ id: vehicle.id, titulo: vehicle.titulo, precio: vehicle.precio, km: vehicle.kilometraje });
        }
      } else {
        const idx = favs.findIndex((f) => f.id === vehicle.id);
        if (idx !== -1) favs.splice(idx, 1);
      }
      localStorage.setItem("movel_favoritos", JSON.stringify(favs));
    } catch { /* ignore */ }

    // Intentar también en Supabase (si la tabla existe)
    try {
      const sb = getSupabaseBrowser();
      if (sb) {
        if (next) await sb.from("favoritos").upsert({ user_id: user.id, vehicle_id: vehicle.id });
        else      await sb.from("favoritos").delete().eq("user_id", user.id).eq("vehicle_id", vehicle.id);
      }
    } catch { /* tabla aún no creada */ }
  }

  // Zoom lupa al mover el mouse sobre la foto principal
  function handlePhotoMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - el.left) / el.width) * 100;
    const y = ((e.clientY - el.top) / el.height) * 100;
    setZoomPos({ x, y, show: true });
  }

  // Tecla ESC cierra lightbox
  useEffect(() => {
    if (!showLightbox) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowLightbox(false);
      if (e.key === "ArrowLeft")  setCurrentPhoto((p) => Math.max(0, p - 1));
      if (e.key === "ArrowRight" && vehicle) setCurrentPhoto((p) => Math.min(vehicle.fotos.length - 1, p + 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showLightbox, vehicle]);
  const [offerAmount, setOfferAmount] = useState("");
  const [offerName, setOfferName] = useState("");
  const [offerPhone, setOfferPhone] = useState("");
  const [offerSent, setOfferSent] = useState(false);
  const [offerLoading, setOfferLoading] = useState(false);

  // Pre-rellenar nombre y celular si el usuario ya está registrado
  useEffect(() => {
    const stored = localStorage.getItem("movel_user");
    if (stored) {
      try {
        const u = JSON.parse(stored);
        if (u.name)  setOfferName(u.name);
        if (u.phone) setOfferPhone(u.phone);
      } catch { /* ignore */ }
    }
  }, []);

  // ── Estados de carga ──
  if (loadingVehicle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cloud">
        <div className="text-mute text-[14px]">Cargando vehículo…</div>
      </div>
    );
  }
  if (!vehicle) {
    notFound();
    return null;
  }

  // Si el motor ya contiene el cilindraje (ej: "3.0L · 2998 cc") no lo duplico
  const motorTieneCilindraje = /\d{3,4}\s*cc/i.test(String(vehicle.motor ?? ""));
  const cilindrajeVal = motorTieneCilindraje
    ? (String(vehicle.motor).match(/(\d{3,4})\s*cc/i)?.[1] ?? "—") + " cc"
    : (vehicle.cilindros && vehicle.cilindros !== "—" ? vehicle.cilindros : "—");

  const specs = [
    { icon: <Car size={18} />,     label: "Modelo",       value: vehicle.modelo },
    { icon: <Gauge size={18} />,   label: "Kilometraje",  value: vehicle.kilometraje },
    { icon: <Gear size={18} />,    label: "Transmisión",  value: vehicle.transmision },
    { icon: <Drop size={18} />,    label: "Combustible",  value: vehicle.combustible },
    { icon: <Palette size={18} />, label: "Color",        value: vehicle.color },
    { icon: <Car size={18} />,     label: "Motor",        value: vehicle.motor },
    { icon: <Car size={18} />,     label: "Cilindraje",   value: cilindrajeVal },
    { icon: <Star size={18} />,    label: "Potencia",     value: vehicle.caballos },
  ];

  const handleOffer = async () => {
    if (!offerAmount || !offerName || !offerPhone) return;
    setOfferLoading(true);
    try {
      await fetch("/api/oferta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehiculo: vehicle.titulo,
          precio: vehicle.precio,
          oferta: offerAmount.replace(/\D/g, ""),
          nombre: offerName,
          celular: offerPhone,
        }),
      });
      setOfferSent(true);
    } finally {
      setOfferLoading(false);
    }
  };

  const whatsappMsg = encodeURIComponent(
    `Hola, estoy interesado en el ${vehicle.titulo} por ${formatCOP(vehicle.precio)}. ¿Está disponible?`
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* ── BREADCRUMB ── */}
      <div className="bg-white border-b border-[#dce0e5] py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-[13px] text-[#637488]">
          <Link href="/" className="hover:text-[#0B1E4E] flex items-center gap-1">
            <ArrowLeft size={14} /> Inicio
          </Link>
          <span>/</span>
          <Link href="/buscar" className="hover:text-[#0B1E4E]">Vehículos</Link>
          <span>/</span>
          <span className="text-[#111418] font-semibold">{vehicle.titulo}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* ── GALERÍA (izquierda) ── */}
          <div className="lg:col-span-3 space-y-3">
            {/* Main photo con zoom lupa y click → lightbox */}
            <div
              ref={photoZoomRef}
              className="relative h-72 md:h-[420px] rounded-2xl overflow-hidden bg-gray-200 group cursor-zoom-in"
              onMouseMove={handlePhotoMouseMove}
              onMouseLeave={() => setZoomPos((p) => ({ ...p, show: false }))}
              onClick={() => setShowLightbox(true)}
            >
              <Image
                src={vehicle.fotos[currentPhoto]}
                alt={vehicle.titulo}
                fill
                className="object-cover transition-transform duration-300"
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              {/* Lupa de zoom: círculo flotante que aparece al hover */}
              {zoomPos.show && vehicle.fotos[currentPhoto] && (
                <div
                  className="hidden md:block absolute pointer-events-none border-[3px] border-white shadow-2xl overflow-hidden"
                  style={{
                    width: 200,
                    height: 200,
                    borderRadius: "9999px",   // redondo
                    left: `${zoomPos.x}%`,
                    top:  `${zoomPos.y}%`,
                    backgroundImage: `url(${vehicle.fotos[currentPhoto]})`,
                    backgroundSize: "400%",   // zoom 4x (no 7.5x)
                    backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                    backgroundRepeat: "no-repeat",
                    transform: "translate(-50%, -50%)",
                    boxShadow: "0 12px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(0,0,0,0.05)",
                    zIndex: 5,
                  }}
                />
              )}

              {/* Overlay y botones (preserve clicks) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />

              {vehicle.fotos.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); setCurrentPhoto((p) => Math.max(0, p - 1)); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/95 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10"
                    disabled={currentPhoto === 0}
                  >
                    <CaretLeft size={20} color="#111418" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setCurrentPhoto((p) => Math.min(vehicle.fotos.length - 1, p + 1)); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/95 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10"
                    disabled={currentPhoto === vehicle.fotos.length - 1}
                  >
                    <CaretRight size={20} color="#111418" />
                  </button>
                </>
              )}

              {/* Botón expandir + contador */}
              <div className="absolute bottom-4 right-4 flex gap-2 z-10">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowLightbox(true); }}
                  className="flex items-center gap-1.5 bg-black/70 hover:bg-black/85 text-white text-[12px] font-bold px-3 py-1.5 rounded-full transition-colors backdrop-blur-sm"
                  title="Ver fotos completas"
                >
                  <MagnifyingGlassPlus size={14} weight="bold" />
                  Ver completo
                </button>
                <span className="bg-black/70 text-white text-[12px] font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm">
                  {currentPhoto + 1} / {vehicle.fotos.length}
                </span>
              </div>

              {/* Action buttons — top-right (favorito + share) */}
              <div className="absolute top-4 right-4 flex gap-2 z-10">
                <button
                  onClick={(e) => { e.stopPropagation(); handleLike(); }}
                  className={`w-11 h-11 rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110 ${
                    liked ? "bg-red-50" : "bg-white"
                  }`}
                  title={liked ? "Quitar de favoritos" : "Guardar en favoritos"}
                >
                  <Heart size={20} weight={liked ? "fill" : "regular"} color={liked ? "#ef4444" : "#637488"} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const url = window.location.href;
                    if (navigator.share) {
                      navigator.share({ title: vehicle.titulo, text: `Mira este ${vehicle.titulo} en MOVEL`, url });
                    } else {
                      navigator.clipboard.writeText(url).then(() =>
                        showToast("¡Link copiado al portapapeles!", "success")
                      );
                    }
                  }}
                  className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
                  title="Compartir"
                >
                  <ShareNetwork size={20} color="#637488" />
                </button>
              </div>
            </div>

            {/* Thumbnails */}
            {vehicle.fotos.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                {vehicle.fotos.map((foto, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPhoto(i)}
                    className={`relative flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                      i === currentPhoto ? "border-[#0B1E4E] scale-105" : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={foto} alt="" fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}

            {/* Specs grid */}
            <div className="bg-white rounded-2xl p-6 border border-[#dce0e5]">
              <h2 className="text-[18px] font-bold text-[#111418] mb-4">Especificaciones técnicas</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {specs.map((s) => (
                  <div key={s.label} className="bg-[#f0f2f4] rounded-xl p-3 text-center">
                    <div className="flex justify-center text-[#0B1E4E] mb-1">{s.icon}</div>
                    <p className="text-[11px] text-[#637488] uppercase tracking-wide">{s.label}</p>
                    <p className="text-[14px] font-bold text-[#111418] mt-0.5">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Descripción */}
            <div className="bg-white rounded-2xl p-6 border border-[#dce0e5]">
              <h2 className="text-[18px] font-bold text-[#111418] mb-3">Descripción</h2>
              <p className="text-[15px] text-[#637488] leading-relaxed">{vehicle.descripcion}</p>
            </div>

            {/* Financiación — desplegada por defecto (prioridad alta) */}
            <CalculadoraFinanciacion
              precio={vehicle.precio}
              vehicleId={vehicle.id}
              whatsapp={vehicle.whatsapp}
              titulo={vehicle.titulo}
              defaultOpen={true}
            />

            {/* Calculadora de gastos — embebida (colapsada por defecto) */}
            <CalculadoraGastos
              avaluo={vehicle.precio}
              marca={vehicle.marca}
              modelo={vehicle.modelo}
              ano={vehicle.año}
              defaultOpen={false}
              theme="light"
            />
          </div>

          {/* ── INFO / CTAs (derecha) ── */}
          <div className="lg:col-span-2 space-y-4">
            {/* Price card */}
            <div className="bg-white rounded-2xl p-6 border border-[#dce0e5] shadow-sm">
              <div className="flex items-start justify-between mb-1">
                <span className="text-[13px] bg-green-100 text-green-700 font-bold px-2.5 py-1 rounded-full">
                  ✓ Verificado
                </span>
                <div className="flex items-center gap-1">
                  <MapPin size={13} color="#637488" />
                  <span className="text-[13px] text-[#637488]">{vehicle.ciudad}</span>
                </div>
              </div>

              <h1 className="text-[22px] font-black text-[#111418] tracking-tight mt-3 leading-tight">
                {vehicle.titulo}
              </h1>

              <div className="flex items-center gap-1 mt-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} weight={i < vehicle.rating ? "fill" : "regular"} color={i < vehicle.rating ? "#f59e0b" : "#dce0e5"} />
                ))}
                <span className="text-[13px] text-[#637488] ml-1">{vehicle.rating}.0 / 5.0</span>
              </div>

              <div className="border-t border-[#dce0e5] pt-4">
                <p className="text-[32px] font-black text-[#111418]">{formatCOP(vehicle.precio)}</p>
                {vehicle.precioFinanciado && (
                  <p className="text-[14px] text-[#637488] mt-1">
                    o desde <strong className="text-[#0B1E4E]">{formatCOP(vehicle.precioFinanciado)}/mes</strong> con financiamiento
                  </p>
                )}
              </div>

              <div className="mt-4 space-y-3">
                <a
                  href={`https://wa.me/${vehicle.whatsapp}?text=${whatsappMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full h-12 bg-[#25d366] text-white rounded-xl font-bold text-[15px] hover:bg-[#20b858] transition-colors"
                >
                  <WhatsappLogo size={22} weight="fill" />
                  Contactar por WhatsApp
                </a>
                <Link
                  href={`/vehiculo/${vehicle.id}/financiamiento`}
                  className="flex items-center justify-center gap-2 w-full h-12 bg-[#0B1E4E] text-white rounded-xl font-bold text-[15px] hover:bg-[#050E26] transition-colors"
                >
                  <CurrencyCircleDollar size={20} />
                  Obtener financiamiento
                </Link>
                <Link
                  href={`/vehiculo/${vehicle.id}/gastos`}
                  className="flex items-center justify-center gap-2 w-full h-12 bg-[#f0f2f4] text-[#111418] rounded-xl font-bold text-[15px] hover:bg-[#e0e4e8] transition-colors"
                >
                  Calcular gastos mensuales
                </Link>
              </div>

              {/* ── Publicado por (nombre del vendedor) ── */}
              {(() => {
                const vendedorNombre = (vehicle as { vendedor?: { nombre?: string } }).vendedor?.nombre
                  ?? (vehicle.propietarios?.[0]?.nombre ?? "Vendedor verificado").split(/\s+/)[0];
                const iniciales = vendedorNombre.slice(0, 2).toUpperCase();
                return (
                  <div className="mt-4 pt-4 border-t border-[#dce0e5] flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-movel-gradient flex items-center justify-center text-white font-bold text-[14px]">
                      {iniciales}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-mute uppercase tracking-wide">Publicado por</p>
                      <p className="text-[15px] font-bold text-ink truncate">{vendedorNombre}</p>
                      <p className="text-[11px] text-mute">Vendedor particular en MOVEL</p>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Historial card */}
            <div className="bg-white rounded-2xl p-5 border border-[#dce0e5]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[16px] font-bold text-[#111418]">Historial del vehículo</h3>
                <Link
                  href={`/vehiculo/${vehicle.id}/historial`}
                  className="text-[13px] font-bold text-[#0B1E4E] hover:underline"
                >
                  Ver completo →
                </Link>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ShieldCheck size={18} color="#16a34a" weight="fill" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#111418]">
                      {vehicle.siniestros.length === 0 ? "Sin siniestros" : `${vehicle.siniestros.length} siniestro(s) reportado(s)`}
                    </p>
                    <p className="text-[12px] text-[#637488]">{vehicle.propietarios.length} propietario(s) anteriores</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${vehicle.soat.vigente ? "bg-green-100" : "bg-red-100"}`}>
                    <ClipboardText size={18} color={vehicle.soat.vigente ? "#16a34a" : "#dc2626"} weight="fill" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#111418]">
                      SOAT {vehicle.soat.vigente ? "Vigente" : "Vencido"}
                    </p>
                    <p className="text-[12px] text-[#637488]">Hasta {new Date(vehicle.soat.hasta).toLocaleDateString("es-CO")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${vehicle.tecnomecanica.vigente ? "bg-green-100" : "bg-red-100"}`}>
                    <ClipboardText size={18} color={vehicle.tecnomecanica.vigente ? "#16a34a" : "#dc2626"} weight="fill" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#111418]">
                      Tecnomecánica {vehicle.tecnomecanica.vigente ? "Vigente" : "Vencida"}
                    </p>
                    <p className="text-[12px] text-[#637488]">Hasta {new Date(vehicle.tecnomecanica.hasta).toLocaleDateString("es-CO")}</p>
                  </div>
                </div>
              </div>

              {/* Disclaimer: información reportada por el vendedor */}
              <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2">
                <span className="text-[14px] flex-shrink-0">ℹ️</span>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  <strong>Información reportada por el vendedor.</strong> Te recomendamos verificar SOAT, tecnomecánica, comparendos y traspasos en RUNT (runt.gov.co) y SIMIT antes de cerrar la compra. MOVEL no garantiza que los datos sean actualizados.
                </p>
              </div>
            </div>

            {/* Hacer una oferta */}
            <div className="bg-white rounded-2xl border border-[#dce0e5] overflow-hidden">
              <button
                onClick={() => { setShowOffer(!showOffer); setOfferSent(false); }}
                className="w-full flex items-center justify-between p-5 hover:bg-[#f8f9fa] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #050E26, #0B1E4E)" }}>
                    <Tag size={20} color="white" weight="fill" />
                  </div>
                  <div className="text-left">
                    <p className="text-[15px] font-bold text-[#111418]">Hacer una oferta</p>
                    <p className="text-[12px] text-[#637488]">Propón tu precio al vendedor</p>
                  </div>
                </div>
                <span className="text-[#0B1E4E] font-bold text-[20px]">{showOffer ? "−" : "+"}</span>
              </button>

              {showOffer && (
                <div className="px-5 pb-5 border-t border-[#dce0e5] animate-fade-in">
                  {offerSent ? (
                    <div className="text-center py-6">
                      <CheckCircle size={48} color="#16a34a" weight="fill" className="mx-auto mb-3" />
                      <p className="text-[16px] font-bold text-[#111418] mb-1">¡Oferta enviada!</p>
                      <p className="text-[13px] text-[#637488]">El vendedor recibirá tu propuesta. Te contactaremos pronto.</p>
                      <button onClick={() => { setOfferSent(false); setShowOffer(false); }} className="mt-4 text-[13px] text-[#0B1E4E] font-semibold hover:underline">
                        Cerrar
                      </button>
                    </div>
                  ) : (
                    <div className="pt-4 space-y-3">
                      <div className="bg-[#e8f0fd] rounded-xl px-4 py-2.5 text-[13px] text-[#0B1E4E] font-semibold">
                        Precio publicado: {formatCOP(vehicle.precio)}
                      </div>

                      {/* Aviso si datos ya están cargados */}
                      {offerName && offerPhone && (
                        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                          <CheckCircle size={15} color="#16a34a" weight="fill" />
                          <p className="text-[12px] text-green-700 font-semibold">
                            Datos cargados de tu cuenta. Solo escribe tu oferta.
                          </p>
                        </div>
                      )}

                      <div>
                        <label className="text-[12px] font-semibold text-[#637488] mb-1 block">Tu oferta (COP)</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[15px] font-bold text-[#637488]">$</span>
                          <input
                            type="text"
                            inputMode="numeric"
                            placeholder="Ej: 80.000.000"
                            value={offerAmount}
                            onChange={(e) => {
                              const raw = e.target.value.replace(/\D/g, "");
                              setOfferAmount(raw ? Number(raw).toLocaleString("es-CO") : "");
                            }}
                            className="offer-input w-full pl-8 pr-4 py-3 border-2 border-[#dce0e5] rounded-xl text-[15px] font-bold text-[#111418]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[12px] font-semibold text-[#637488] mb-1 block">Tu nombre</label>
                        <input
                          type="text"
                          placeholder="Nombre completo"
                          value={offerName}
                          onChange={(e) => setOfferName(e.target.value)}
                          className="offer-input w-full px-4 py-3 border-2 border-[#dce0e5] rounded-xl text-[15px] text-[#111418]"
                        />
                      </div>

                      <div>
                        <label className="text-[12px] font-semibold text-[#637488] mb-1 block">Celular</label>
                        <input
                          type="tel"
                          placeholder="3XX XXX XXXX"
                          value={offerPhone}
                          onChange={(e) => setOfferPhone(e.target.value)}
                          className="offer-input w-full px-4 py-3 border-2 border-[#dce0e5] rounded-xl text-[15px] text-[#111418]"
                        />
                      </div>

                      <button
                        onClick={handleOffer}
                        disabled={!offerAmount || !offerName || !offerPhone || offerLoading}
                        className="w-full py-3.5 rounded-xl font-bold text-[15px] text-white transition-all interactive disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ background: "linear-gradient(135deg, #050E26, #0B1E4E)" }}
                      >
                        {offerLoading ? "Enviando..." : "Enviar oferta"}
                      </button>

                      <p className="text-[11px] text-[#637488] text-center">
                        Tu oferta será revisada por el vendedor. No es vinculante hasta confirmar.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Trust badges */}
            <div className="bg-[#e8f0fd] rounded-2xl p-5 border border-[#0B1E4E]/20">
              <p className="text-[13px] font-bold text-[#0B1E4E] mb-3 uppercase tracking-wide">Compra con confianza</p>
              <div className="space-y-2">
                {["Precio fijo, sin regateo", "Documentos al día garantizados", "Entrega en 48 horas"].map((t) => (
                  <div key={t} className="flex items-center gap-2">
                    <span className="text-green-500 font-bold text-[14px]">✓</span>
                    <span className="text-[13px] text-[#637488] font-medium">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BARRA CTA FIJA MÓVIL (solo mobile) ── */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 py-3 flex gap-3"
        style={{
          background: "rgba(255,255,255,0.97)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid #e5e7eb",
          boxShadow: "0 -4px 24px rgba(0,0,0,0.08)",
        }}
      >
        <a
          href={`https://wa.me/${vehicle.whatsapp}?text=${whatsappMsg}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 h-12 bg-[#25d366] text-white rounded-xl font-bold text-[14px] hover:bg-[#20b858] transition-colors"
        >
          <WhatsappLogo size={20} weight="fill" />
          WhatsApp
        </a>
        <button
          onClick={() => { setShowOffer(true); window.scrollTo({ top: 9999, behavior: "smooth" }); }}
          className="flex-1 flex items-center justify-center gap-2 h-12 text-white rounded-xl font-bold text-[14px] transition-colors"
          style={{ background: "linear-gradient(135deg, #050E26, #0B1E4E)" }}
        >
          <Tag size={18} weight="fill" />
          Hacer oferta
        </button>
      </div>

      {/* Espacio para que el contenido no quede tapado por la barra fija en móvil */}
      <div className="md:hidden h-20" />

      <BottomNav />

      {/* ════════════════════════════════════════════════════
          LIGHTBOX: galería de fotos a tamaño completo
      ════════════════════════════════════════════════════ */}
      {showLightbox && (
        <div
          className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center animate-fade-in"
          onClick={() => setShowLightbox(false)}
        >
          {/* Cerrar */}
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors z-10"
            aria-label="Cerrar galería"
          >
            <XIcon size={22} color="white" weight="bold" />
          </button>

          {/* Contador + título */}
          <div className="absolute top-4 left-4 text-white z-10">
            <p className="text-[13px] font-bold">{vehicle.titulo}</p>
            <p className="text-[12px] text-white/60">
              Foto {currentPhoto + 1} de {vehicle.fotos.length}
            </p>
          </div>

          {/* Foto principal a tamaño completo */}
          <div className="relative w-full h-full max-w-7xl max-h-[90vh] mx-4 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={vehicle.fotos[currentPhoto]}
              alt={vehicle.titulo}
              className="max-w-full max-h-full object-contain rounded-lg select-none"
              draggable={false}
            />

            {/* Navegación */}
            {vehicle.fotos.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentPhoto((p) => Math.max(0, p - 1))}
                  disabled={currentPhoto === 0}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors disabled:opacity-30"
                >
                  <CaretLeft size={26} color="white" weight="bold" />
                </button>
                <button
                  onClick={() => setCurrentPhoto((p) => Math.min(vehicle.fotos.length - 1, p + 1))}
                  disabled={currentPhoto === vehicle.fotos.length - 1}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors disabled:opacity-30"
                >
                  <CaretRight size={26} color="white" weight="bold" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails inferiores */}
          {vehicle.fotos.length > 1 && (
            <div
              className="absolute bottom-4 left-0 right-0 flex justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-2 max-w-full">
                {vehicle.fotos.map((f, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPhoto(i)}
                    className={`relative flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                      i === currentPhoto ? "border-white scale-110" : "border-transparent opacity-50 hover:opacity-100"
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={f} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="absolute bottom-4 right-4 text-white/40 text-[11px] hidden md:block">
            ESC para cerrar · ← → para navegar
          </p>
        </div>
      )}

      {/* ════════════════════════════════════════════════════
          AUTH PROMPT: para guardar favoritos sin sesión
      ════════════════════════════════════════════════════ */}
      {showAuthPrompt && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] px-4 animate-fade-in"
          onClick={() => setShowAuthPrompt(false)}
        >
          <div
            className="bg-white rounded-3xl p-7 w-full max-w-sm shadow-2xl animate-scale-bounce relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowAuthPrompt(false)}
              className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-lg hover:bg-cloud transition-colors"
              aria-label="Cerrar"
            >
              <XIcon size={20} color="#7A8195" />
            </button>
            <div className="w-14 h-14 rounded-2xl bg-[#FFE8DC] flex items-center justify-center mb-4">
              <Heart size={28} color="#FF6B3D" weight="fill" />
            </div>
            <h3 className="font-display text-[22px] text-movel-900 mb-2">Guarda tus favoritos</h3>
            <p className="text-[14px] text-mute leading-relaxed mb-5">
              Crea una cuenta o inicia sesión para guardar este carro y recibir alertas si baja de precio.
            </p>
            <div className="flex flex-col gap-2.5">
              <Link
                href={`/auth?return=${encodeURIComponent(typeof window !== "undefined" ? window.location.pathname : "/")}`}
                className="w-full flex items-center justify-center gap-2 py-3 btn-primary text-[14px] !rounded-xl"
              >
                <SignIn size={17} weight="bold" />
                Iniciar sesión
              </Link>
              <Link
                href={`/auth?modo=registro&return=${encodeURIComponent(typeof window !== "undefined" ? window.location.pathname : "/")}`}
                className="w-full text-center py-3 border-2 border-movel-900 text-movel-900 font-bold rounded-xl text-[14px] hover:bg-movel-50 transition-colors"
              >
                Crear cuenta gratis
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
