"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { getAuctionVehicles, formatCOP } from "@/lib/mock-data";
import BottomNav from "@/components/BottomNav";
import ScrollReveal from "@/components/ScrollReveal";
import MovelPageHeader from "@/components/MovelPageHeader";
import {
  Gavel, Clock, WhatsappLogo, ArrowRight,
  Users, TrendUp, Fire, Warning
} from "@phosphor-icons/react";

function useCountdown(finEn: string) {
  const calcRemaining = useCallback(() => {
    const diff = new Date(finEn).getTime() - Date.now();
    if (diff <= 0) return { h: 0, m: 0, s: 0, total: 0 };
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { h, m, s, total: diff };
  }, [finEn]);

  const [remaining, setRemaining] = useState(calcRemaining);

  useEffect(() => {
    const timer = setInterval(() => setRemaining(calcRemaining()), 1000);
    return () => clearInterval(timer);
  }, [calcRemaining]);

  return remaining;
}

function CountdownBlock({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col items-center bg-white/10 rounded-xl px-3 py-2 min-w-[56px]">
      <span className="text-[28px] font-black leading-none tabular-nums">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[10px] font-semibold uppercase tracking-widest opacity-70 mt-0.5">{label}</span>
    </div>
  );
}

function AuctionCard({ vehicle }: { vehicle: ReturnType<typeof getAuctionVehicles>[0] }) {
  const sub = vehicle.subasta!;
  const { h, m, s, total } = useCountdown(sub.finEn);
  const [ofertaActual, setOfertaActual] = useState(sub.ofertaActual);
  const [totalOfertas, setTotalOfertas] = useState(sub.totalOfertas);
  const [bidAnimation, setBidAnimation] = useState(false);
  const isUrgent = total < 3600000; // menos de 1 hora

  // Simular nuevas pujas ocasionales
  useEffect(() => {
    const chance = setInterval(() => {
      if (Math.random() < 0.15) {
        const increment = Math.floor(Math.random() * 3 + 1) * 500000;
        setOfertaActual((prev) => prev + increment);
        setTotalOfertas((prev) => prev + 1);
        setBidAnimation(true);
        setTimeout(() => setBidAnimation(false), 500);
      }
    }, 8000);
    return () => clearInterval(chance);
  }, []);

  const whatsappMsg = encodeURIComponent(
    `Hola MOVEL, quiero participar en la subasta del ${vehicle.titulo}. Oferta actual: ${formatCOP(ofertaActual)}. ¿Cómo puedo pujar?`
  );

  return (
    <div className={`bg-white rounded-3xl overflow-hidden border-2 transition-all duration-300 card-hover ${isUrgent ? "border-red-400 shadow-lg shadow-red-100" : "border-[#dce0e5]"}`}>
      {/* Foto */}
      <div className="relative h-52 img-zoom">
        <Image src={vehicle.fotos[0]} alt={vehicle.titulo} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Badge LIVE */}
        <div className="absolute top-3 left-3">
          <span className="badge-live">En Vivo</span>
        </div>

        {/* Urgente */}
        {isUrgent && (
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-red-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
            <Warning size={12} weight="fill" />
            ¡Termina pronto!
          </div>
        )}

        {/* Countdown en foto */}
        <div className="absolute bottom-3 left-3 right-3">
          <div className={`glass-dark rounded-xl px-3 py-2 text-white flex items-center gap-3 ${isUrgent ? "bg-red-900/70" : ""}`}>
            <Clock size={16} className="flex-shrink-0" />
            <div className="flex gap-2 items-center">
              <CountdownBlock label="h" value={h} />
              <span className="text-[20px] font-black opacity-60">:</span>
              <CountdownBlock label="m" value={m} />
              <span className="text-[20px] font-black opacity-60">:</span>
              <CountdownBlock label="s" value={s} />
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="text-[17px] font-black text-[#111418] mb-1 leading-tight">{vehicle.titulo}</h3>
        <p className="text-[13px] text-[#637488] mb-4">{vehicle.ciudad} · {vehicle.kilometraje} · {vehicle.transmision}</p>

        {/* Precios */}
        <div className="bg-[#f8f9fa] rounded-2xl p-4 mb-4">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] text-[#637488] uppercase tracking-wide font-semibold mb-0.5">Precio base</p>
              <p className="text-[15px] font-bold text-[#637488] line-through">{formatCOP(sub.precioBase)}</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-[#637488] uppercase tracking-wide font-semibold mb-0.5">Oferta actual</p>
              <p className={`text-[24px] font-black text-[#111418] transition-all duration-300 ${bidAnimation ? "animate-bid text-green-600" : ""}`}>
                {formatCOP(ofertaActual)}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4 mt-3 pt-3 border-t border-[#dce0e5]">
            <div className="flex items-center gap-1.5 text-[13px] text-[#637488]">
              <Users size={14} color="#1978e5" weight="fill" />
              <span><strong className="text-[#111418]">{totalOfertas}</strong> pujas</span>
            </div>
            <div className="flex items-center gap-1.5 text-[13px] text-[#637488]">
              <TrendUp size={14} color="#16a34a" weight="fill" />
              <span className="text-green-600 font-semibold">+{formatCOP(ofertaActual - sub.precioBase)}</span>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex gap-2">
          <a
            href={`https://wa.me/${vehicle.whatsapp}?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl font-bold text-[14px] text-white bg-[#25d366] hover:bg-[#20b858] transition-all interactive"
          >
            <Gavel size={18} weight="fill" />
            Pujar ahora
          </a>
          <Link
            href={`/vehiculo/${vehicle.id}`}
            className="px-4 py-3 rounded-xl border-2 border-[#dce0e5] text-[#637488] hover:border-[#1978e5] hover:text-[#1978e5] transition-all font-bold text-[14px] interactive"
          >
            Ver
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SubastasPage() {
  const vehicles = getAuctionVehicles();

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <MovelPageHeader />
      {/* Hero */}
      <div
        className="text-white py-12 px-4 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0d1b2e 0%, #1565c0 60%, #1978e5 100%)" }}
      >
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-20 w-48 h-48 rounded-full bg-[#42a5f5]/20 translate-y-1/2 animate-float-slow" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-4 animate-fade-in">
            <span className="badge-live">En vivo ahora</span>
            <span className="text-white/60 text-[13px]">{vehicles.length} vehículos en subasta</span>
          </div>

          <h1 className="text-[40px] md:text-[56px] font-black tracking-tight leading-[1.05] mb-4 animate-fade-in delay-100">
            Subastas<br />
            <span style={{
              background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>en vivo</span>
          </h1>

          <p className="text-[17px] text-white/70 max-w-xl leading-relaxed animate-fade-in delay-200">
            Vehículos verificados por MOVEL disponibles para pujar en tiempo real. Precio transparente, sin sorpresas. La mejor oferta se lleva el carro.
          </p>

          <div className="flex gap-6 mt-8 animate-fade-in delay-300">
            {[
              { icon: <Fire size={18} weight="fill" />, label: "Precios competitivos" },
              { icon: <Gavel size={18} weight="fill" />, label: "Pujas en tiempo real" },
              { icon: <WhatsappLogo size={18} weight="fill" />, label: "Proceso por WhatsApp" },
            ].map((f) => (
              <div key={f.label} className="flex items-center gap-2 text-[13px] font-semibold text-white/80">
                <span className="text-[#60a5fa]">{f.icon}</span>
                {f.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cómo funciona */}
      <div className="bg-white border-b border-[#dce0e5] py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-center sm:text-left">
            {[
              { num: "01", title: "Elige el vehículo", desc: "Revisa el historial y especificaciones" },
              { num: "02", title: "Escribe por WhatsApp", desc: 'Toca "Pujar ahora" y envía tu oferta' },
              { num: "03", title: "Gana la subasta", desc: "La oferta más alta al cierre gana" },
            ].map((step, i) => (
              <div key={step.num} className="flex items-center gap-4">
                <div className="flex items-start gap-3">
                  <span className="text-[13px] font-black text-[#1978e5] bg-[#e8f0fd] w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0">{step.num}</span>
                  <div>
                    <p className="text-[14px] font-bold text-[#111418]">{step.title}</p>
                    <p className="text-[12px] text-[#637488]">{step.desc}</p>
                  </div>
                </div>
                {i < 2 && <ArrowRight size={16} color="#dce0e5" className="hidden sm:block flex-shrink-0" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid de subastas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {vehicles.length === 0 ? (
          <div className="text-center py-20">
            <Gavel size={48} color="#dce0e5" className="mx-auto mb-4" />
            <h2 className="text-[22px] font-bold text-[#111418] mb-2">No hay subastas activas</h2>
            <p className="text-[#637488]">Vuelve pronto para ver nuevas subastas en vivo.</p>
          </div>
        ) : (
          <>
            <ScrollReveal className="mb-8">
              <h2 className="text-[26px] font-black text-[#111418]">
                Subastas activas ahora
                <span className="ml-3 text-[16px] font-normal text-[#637488]">— Actualización en tiempo real</span>
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((v, i) => (
                <ScrollReveal key={v.id} delay={i * 100}>
                  <AuctionCard vehicle={v} />
                </ScrollReveal>
              ))}
            </div>
          </>
        )}

        {/* Disclaimer */}
        <ScrollReveal className="mt-12">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-3">
            <Warning size={20} color="#d97706" className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[14px] font-bold text-amber-800 mb-1">¿Cómo funcionan las subastas MOVEL?</p>
              <p className="text-[13px] text-amber-700 leading-relaxed">
                Las pujas se realizan directamente por WhatsApp con nuestro equipo. Todos los vehículos han sido verificados e inspeccionados previamente. El ganador tiene 24 horas para completar el proceso de compra con una cuota inicial del 10%.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>

      <BottomNav />
    </div>
  );
}
