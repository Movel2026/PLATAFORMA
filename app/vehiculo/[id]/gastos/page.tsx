"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getVehicleById, formatCOP } from "@/lib/mock-data";
import BottomNav from "@/components/BottomNav";
import {
  ArrowLeft, Receipt, WhatsappLogo, Info,
  Car, FileText, Wrench, Drop, Warning, Calculator
} from "@phosphor-icons/react";

// ── Impuesto de Rodamiento — Tarifas OFICIALES 2026 (Min. Transporte) ──
// Rango 1: hasta $54.057.000 → 1.7%
// Rango 2: $54.057.001 a $121.625.000 → 2.7%
// Rango 3: superior a $121.625.000 → 3.7%
function calcularImpuesto(avaluo: number): { valor: number; tarifa: string; rango: string } {
  if (avaluo <= 54_057_000) {
    return { valor: avaluo * 0.017, tarifa: "1.7%", rango: "Rango 1 · hasta $54.057.000" };
  }
  if (avaluo <= 121_625_000) {
    return { valor: avaluo * 0.027, tarifa: "2.7%", rango: "Rango 2 · $54M a $121M" };
  }
  return { valor: avaluo * 0.037, tarifa: "3.7%", rango: "Rango 3 · superior a $121.625.000" };
}

// ── SOAT Colombia 2025 por cilindraje (tarifa anual aprox.) ──
function calcularSOAT(cilindros: string): number {
  const cc = cilindros.toLowerCase();
  if (cc.includes("4 cil") || cc.includes("1.0") || cc.includes("1.2")) return 432000;
  if (cc.includes("1.4") || cc.includes("1.5") || cc.includes("1.6")) return 530000;
  if (cc.includes("1.8") || cc.includes("2.0") || cc.includes("2.5")) return 648000;
  return 780000; // 3.0L+
}

// ── Tecnomecánica (aplica si vehículo > 5 años) ──
// Vigencia cada 2 años desde el 6° año. Costo aprox. $110.000
function calcularTecnomecanica(año: number): { aplica: boolean; anual: number } {
  const edad = new Date().getFullYear() - año;
  if (edad < 5) return { aplica: false, anual: 0 };
  return { aplica: true, anual: 110000 / 2 }; // cada 2 años, dividido en costo anual
}

// ── Mantenimiento estimado anual ──
function calcularMantenimiento(precio: number, año: number): { items: { label: string; valor: number }[]; total: number } {
  const edad = new Date().getFullYear() - año;
  const items = [
    { label: "Cambio de aceite (3 veces/año)", valor: precio < 50000000 ? 210000 : precio < 100000000 ? 300000 : 420000 },
    { label: "Filtros y revisión general", valor: precio < 50000000 ? 180000 : 250000 },
    { label: "Llantas (promedio anual)", valor: precio < 50000000 ? 600000 : precio < 100000000 ? 800000 : 1100000 },
    { label: "Frenos y suspensión", valor: edad > 4 ? 400000 : 150000 },
    { label: "Imprevistos mecánicos", valor: precio < 50000000 ? 300000 : 450000 },
  ];
  return { items, total: items.reduce((s, i) => s + i.valor, 0) };
}

// ── Combustible estimado mensual (ciudad) ──
function calcularCombustible(motor: string): { litros: number; valor: number } {
  const cc = parseFloat(motor) || 2.0;
  const litrosPorMes = cc <= 1.4 ? 80 : cc <= 2.0 ? 110 : 140;
  const precioPorLitro = 10800; // Gasolina corriente Colombia 2025 aprox.
  return { litros: litrosPorMes, valor: litrosPorMes * precioPorLitro };
}

export default function GastosPage() {
  const params = useParams();
  const id = params.id as string;
  const vehicle = getVehicleById(id);

  const precio = vehicle?.precio ?? 85000000;
  const año = vehicle?.año ?? 2021;

  const impuestoData = calcularImpuesto(precio);
  const impuestoAnual = impuestoData.valor;
  const soatAnual = calcularSOAT(vehicle?.cilindros ?? "4 Cil");
  const tecnomecanica = calcularTecnomecanica(año);
  const mantenimiento = calcularMantenimiento(precio, año);
  const combustible = calcularCombustible(vehicle?.motor ?? "2.0L");

  const resumen = useMemo(() => {
    const items = [
      { label: "Impuesto de rodamiento", anual: Math.round(impuestoAnual), icon: "🏛️", desc: `Tarifa oficial ${impuestoData.tarifa} · ${impuestoData.rango}` },
      { label: "SOAT", anual: soatAnual, icon: "📋", desc: "Seguro obligatorio de accidentes" },
      ...(tecnomecanica.aplica ? [{ label: "Tecnomecánica", anual: Math.round(tecnomecanica.anual), icon: "🔧", desc: "Vehículo mayor de 5 años · Cada 2 años" }] : []),
      { label: "Mantenimiento general", anual: mantenimiento.total, icon: "⚙️", desc: "Aceite, filtros, llantas, frenos, imprevistos" },
      { label: "Combustible", anual: combustible.valor * 12, icon: "⛽", desc: `~${combustible.litros} litros/mes · Gasolina corriente` },
    ];
    const totalAnual = items.reduce((s, i) => s + i.anual, 0);
    return { items, totalAnual, totalMensual: Math.round(totalAnual / 12) };
  }, [impuestoAnual, soatAnual, tecnomecanica, mantenimiento, combustible]);

  const whatsappMsg = encodeURIComponent(
    `Hola MOVEL, calculé los gastos del ${vehicle?.titulo ?? "vehículo"}: Total mensual ~${formatCOP(resumen.totalMensual)}. Me interesa este vehículo. ¿Me pueden ayudar?`
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header gradiente */}
      <div style={{ background: "linear-gradient(135deg, #0d1b2e 0%, #1565c0 60%, #1978e5 100%)" }} className="text-white px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Link href={`/vehiculo/${id}`} className="inline-flex items-center gap-2 text-white/70 hover:text-white text-[14px] mb-4 transition-colors">
            <ArrowLeft size={16} /> Volver al vehículo
          </Link>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Receipt size={24} color="white" weight="fill" />
            </div>
            <h1 className="text-[26px] font-black tracking-tight">Gastos del Propietario</h1>
          </div>
          {vehicle && (
            <p className="text-white/70 text-[14px]">{vehicle.titulo} · {vehicle.año} · {vehicle.motor}</p>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">

        {/* ── RESUMEN RÁPIDO ── */}
        <div
          className="rounded-2xl p-6 text-white text-center"
          style={{ background: "linear-gradient(135deg, #1565c0, #1978e5, #42a5f5)" }}
        >
          <p className="text-white/70 text-[13px] uppercase tracking-widest mb-2">Costo total estimado de propiedad</p>
          <p className="text-[52px] font-black leading-none">{formatCOP(resumen.totalMensual)}</p>
          <p className="text-white/70 text-[15px] mt-1">por mes · {formatCOP(resumen.totalAnual)} al año</p>

          {!tecnomecanica.aplica && (
            <div className="inline-flex items-center gap-1.5 mt-3 bg-green-500/20 border border-green-400/30 text-green-300 text-[12px] font-semibold px-3 py-1.5 rounded-full">
              <span>✓</span> Vehículo menor de 5 años — sin tecnomecánica
            </div>
          )}
        </div>

        {/* ── DESGLOSE DETALLADO ── */}
        <div className="bg-white rounded-2xl overflow-hidden border border-[#dce0e5]">
          <div className="px-5 py-4 border-b border-[#dce0e5]">
            <h2 className="text-[16px] font-bold text-[#111418]">Desglose detallado</h2>
            <p className="text-[12px] text-[#637488] mt-0.5">Costos anuales ÷ 12 = valor mensual</p>
          </div>

          {resumen.items.map((item, i) => (
            <div key={item.label} className={`px-5 py-4 ${i < resumen.items.length - 1 ? "border-b border-[#dce0e5]" : ""}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-xl mt-0.5">{item.icon}</span>
                  <div>
                    <p className="text-[15px] font-bold text-[#111418]">{item.label}</p>
                    <p className="text-[12px] text-[#637488] mt-0.5">{item.desc}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[16px] font-black text-[#111418]">{formatCOP(Math.round(item.anual / 12))}<span className="text-[12px] font-normal text-[#637488]">/mes</span></p>
                  <p className="text-[12px] text-[#637488]">{formatCOP(item.anual)}/año</p>
                </div>
              </div>
            </div>
          ))}

          {/* Total */}
          <div className="px-5 py-4 bg-[#e8f0fd] flex items-center justify-between">
            <div>
              <p className="text-[16px] font-black text-[#111418]">Total mensual estimado</p>
              <p className="text-[12px] text-[#637488]">Suma de todos los gastos</p>
            </div>
            <div className="text-right">
              <p className="text-[28px] font-black text-[#1978e5]">{formatCOP(resumen.totalMensual)}</p>
              <p className="text-[12px] text-[#637488]">{formatCOP(resumen.totalAnual)}/año</p>
            </div>
          </div>
        </div>

        {/* ── DETALLE MANTENIMIENTO ── */}
        <div className="bg-white rounded-2xl overflow-hidden border border-[#dce0e5]">
          <div className="px-5 py-4 border-b border-[#dce0e5] flex items-center gap-2">
            <Wrench size={18} color="#1978e5" weight="fill" />
            <h2 className="text-[15px] font-bold text-[#111418]">Detalle de mantenimiento</h2>
          </div>
          {mantenimiento.items.map((item, i) => (
            <div key={item.label} className={`px-5 py-3 flex items-center justify-between ${i < mantenimiento.items.length - 1 ? "border-b border-[#dce0e5]" : ""}`}>
              <p className="text-[13px] text-[#637488]">{item.label}</p>
              <p className="text-[13px] font-semibold text-[#111418]">{formatCOP(item.valor)}/año</p>
            </div>
          ))}
        </div>

        {/* ── BASES DE CÁLCULO ── */}
        <div className="bg-white rounded-2xl p-5 border border-[#dce0e5]">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={18} color="#1978e5" weight="fill" />
            <h3 className="text-[15px] font-bold text-[#111418]">Bases de cálculo utilizadas</h3>
          </div>
          <div className="space-y-2">
            {[
              { icon: <Car size={14} />, text: `Impuesto Bogotá: ${precio <= 87208000 ? "1.5%" : precio <= 174416000 ? "2.5%" : "3.5%"} sobre avalúo de ${formatCOP(precio)}` },
              { icon: <FileText size={14} />, text: `SOAT: Tarifa ${vehicle?.cilindros ?? "4 Cil"} · Resolución 2025` },
              ...(tecnomecanica.aplica ? [{ icon: <Warning size={14} />, text: `Tecnomecánica: Vehículo de ${new Date().getFullYear() - año} años · Revisión cada 2 años` }] : []),
              { icon: <Drop size={14} />, text: `Gasolina: ${combustible.litros} litros/mes × $10.800/litro (corriente Bogotá)` },
            ].map((b, i) => (
              <div key={i} className="flex items-start gap-2 text-[12px] text-[#637488]">
                <span className="text-[#1978e5] mt-0.5 flex-shrink-0">{b.icon}</span>
                <span>{b.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── DISCLAIMER ── */}
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <Info size={18} color="#d97706" className="flex-shrink-0 mt-0.5" />
          <p className="text-[12px] text-amber-800 leading-relaxed">
            Valores <strong>estimados</strong> para ciudad de Bogotá. El impuesto varía según municipio. El SOAT puede variar por modelo y empresa aseguradora. El combustible depende del uso real del vehículo.
          </p>
        </div>

        {/* ── CTA ── */}
        <div className="space-y-3">
          <a
            href={`https://wa.me/573175737083?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-4 bg-[#25d366] text-white font-black text-[16px] rounded-2xl hover:bg-[#20b858] transition-colors shadow-lg"
          >
            <WhatsappLogo size={22} weight="fill" />
            Hablar con un asesor
          </a>
          <Link
            href={`/vehiculo/${id}/financiamiento`}
            className="flex items-center justify-center gap-2 w-full py-4 bg-[#1978e5] text-white font-black text-[16px] rounded-2xl hover:bg-[#1565c0] transition-colors"
          >
            Calcular financiamiento →
          </Link>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
