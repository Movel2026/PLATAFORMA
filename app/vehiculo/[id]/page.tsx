"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getVehicleById, formatCOP } from "@/lib/mock-data";
import BottomNav from "@/components/BottomNav";
import { showToast } from "@/components/Toast";
import CalculadoraGastos from "@/components/CalculadoraGastos";
import CalculadoraFinanciacion from "@/components/CalculadoraFinanciacion";
import {
  ArrowLeft, ShareNetwork, Heart, WhatsappLogo,
  Gauge, Gear, Car, Drop, Palette, Star,
  MapPin, ShieldCheck, ClipboardText, CurrencyCircleDollar,
  CaretLeft, CaretRight, Tag, CheckCircle
} from "@phosphor-icons/react";

interface Props {
  params: { id: string };
}

export default function VehicleDetailPage({ params }: Props) {
  const vehicle = getVehicleById(params.id);
  if (!vehicle) notFound();

  const [currentPhoto, setCurrentPhoto] = useState(0);
  const [liked, setLiked] = useState(false);
  const [showOffer, setShowOffer] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");
  const [offerName, setOfferName] = useState("");
  const [offerPhone, setOfferPhone] = useState("");
  const [offerSent, setOfferSent] = useState(false);
  const [offerLoading, setOfferLoading] = useState(false);

  // Pre-rellenar nombre y celular si el usuario ya está registrado
  useEffect(() => {
    const stored = localStorage.getItem("movel_user");
    if (stored) {
      const u = JSON.parse(stored);
      if (u.name)  setOfferName(u.name);
      if (u.phone) setOfferPhone(u.phone);
    }
  }, []);

  const specs = [
    { icon: <Car size={18} />, label: "Modelo", value: vehicle.modelo },
    { icon: <Gauge size={18} />, label: "Kilometraje", value: vehicle.kilometraje },
    { icon: <Gear size={18} />, label: "Transmisión", value: vehicle.transmision },
    { icon: <Drop size={18} />, label: "Combustible", value: vehicle.combustible },
    { icon: <Palette size={18} />, label: "Color", value: vehicle.color },
    { icon: <Car size={18} />, label: "Motor", value: vehicle.motor },
    { icon: <Star size={18} />, label: "Potencia", value: vehicle.caballos },
    { icon: <Car size={18} />, label: "Cilindros", value: vehicle.cilindros },
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
            {/* Main photo */}
            <div className="relative h-72 md:h-[420px] rounded-2xl overflow-hidden bg-gray-200 group">
              <Image
                src={vehicle.fotos[currentPhoto]}
                alt={vehicle.titulo}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              {/* Overlay controls */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

              {vehicle.fotos.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentPhoto((p) => Math.max(0, p - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    disabled={currentPhoto === 0}
                  >
                    <CaretLeft size={20} color="#111418" />
                  </button>
                  <button
                    onClick={() => setCurrentPhoto((p) => Math.min(vehicle.fotos.length - 1, p + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                    disabled={currentPhoto === vehicle.fotos.length - 1}
                  >
                    <CaretRight size={20} color="#111418" />
                  </button>
                </>
              )}

              {/* Photo counter */}
              <div className="absolute bottom-4 right-4 bg-black/60 text-white text-[13px] font-semibold px-3 py-1 rounded-full">
                {currentPhoto + 1} / {vehicle.fotos.length}
              </div>

              {/* Action buttons */}
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => setLiked(!liked)}
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md"
                >
                  <Heart size={20} weight={liked ? "fill" : "regular"} color={liked ? "#ef4444" : "#637488"} />
                </button>
                <button
                  onClick={() => {
                    const url = window.location.href;
                    if (navigator.share) {
                      navigator.share({ title: vehicle.titulo, text: `Mira este ${vehicle.titulo} en MOVEL`, url });
                    } else {
                      navigator.clipboard.writeText(url).then(() =>
                        showToast("¡Link copiado al portapapeles!", "success")
                      );
                    }
                  }}
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
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
            <CalculadoraGastos avaluo={vehicle.precio} defaultOpen={false} theme="light" />
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
    </div>
  );
}
