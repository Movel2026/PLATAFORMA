"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getVehicleById, formatCOP } from "@/lib/mock-data";
import BottomNav from "@/components/BottomNav";
import {
  ArrowLeft, CurrencyCircleDollar, WhatsappLogo,
  Info, ChartBar, CalendarBlank, Percent
} from "@phosphor-icons/react";

// Tasas de referencia en Colombia para crédito de vehículo (2025)
const TASAS = [
  { label: "Banco Popular", tasa: 1.18, descripcion: "Tasa preferencial" },
  { label: "Bancolombia", tasa: 1.32, descripcion: "Tasa estándar" },
  { label: "Davivienda", tasa: 1.45, descripcion: "Tasa estándar" },
  { label: "BBVA", tasa: 1.28, descripcion: "Tasa estándar" },
  { label: "Banco de Bogotá", tasa: 1.35, descripcion: "Tasa referencia" },
];

const PLAZOS = [12, 24, 36, 48, 60, 72];

// Fórmula PMT: cuota = P × [r(1+r)^n] / [(1+r)^n - 1]
function calcularCuota(capital: number, tasaMensual: number, meses: number): number {
  if (capital <= 0 || meses <= 0) return 0;
  const r = tasaMensual / 100;
  return capital * (r * Math.pow(1 + r, meses)) / (Math.pow(1 + r, meses) - 1);
}

export default function FinanciamientoPage() {
  const params = useParams();
  const id = params.id as string;
  const vehicle = getVehicleById(id);

  const precio = vehicle?.precio ?? 85000000;
  const [pctInicial, setPctInicial] = useState(30);
  const [plazo, setPlazo] = useState(48);
  const [tasaIdx, setTasaIdx] = useState(0);

  const [montoInicialManual, setMontoInicialManual] = useState<string>("");

  const tasaSeleccionada = TASAS[tasaIdx];

  // Si el usuario ingresó un monto manual, usarlo; si no, calcular por porcentaje
  const cuotaInicial = montoInicialManual !== ""
    ? Math.min(Math.max(Number(montoInicialManual.replace(/\D/g, "")), 0), precio)
    : Math.round((pctInicial / 100) * precio);
  const pctEfectivo = precio > 0 ? Math.round((cuotaInicial / precio) * 100) : pctInicial;
  const montoFinanciar = Math.max(precio - cuotaInicial, 0);
  const cuotaMensual = useMemo(
    () => calcularCuota(montoFinanciar, tasaSeleccionada.tasa, plazo),
    [montoFinanciar, tasaSeleccionada.tasa, plazo]
  );
  const totalPagar = cuotaMensual * plazo + cuotaInicial;
  const totalIntereses = totalPagar - precio;

  const whatsappMsg = encodeURIComponent(
    `Hola MOVEL, estoy interesado en financiar el ${vehicle?.titulo ?? "vehículo"} por ${formatCOP(precio)}. Cuota inicial: ${formatCOP(cuotaInicial)}, plazo: ${plazo} meses. Cuota estimada: ${formatCOP(Math.round(cuotaMensual))}/mes. ¿Me pueden ayudar?`
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header con gradiente */}
      <div style={{ background: "linear-gradient(135deg, #0d1b2e 0%, #1565c0 60%, #1978e5 100%)" }} className="text-white px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Link href={`/vehiculo/${id}`} className="inline-flex items-center gap-2 text-white/70 hover:text-white text-[14px] mb-4 transition-colors">
            <ArrowLeft size={16} /> Volver al vehículo
          </Link>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <CurrencyCircleDollar size={24} color="white" weight="fill" />
            </div>
            <h1 className="text-[26px] font-black tracking-tight">Calculadora de Financiamiento</h1>
          </div>
          {vehicle && (
            <p className="text-white/70 text-[14px] ml-13">{vehicle.titulo} · {formatCOP(precio)}</p>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">

        {/* ── RESUMEN DEL VEHÍCULO ── */}
        <div className="bg-white rounded-2xl p-5 border border-[#dce0e5] flex items-center justify-between">
          <div>
            <p className="text-[13px] text-[#637488] font-medium">Precio del vehículo</p>
            <p className="text-[28px] font-black text-[#111418]">{formatCOP(precio)}</p>
          </div>
          <div className="text-right">
            <p className="text-[13px] text-[#637488]">A financiar</p>
            <p className="text-[20px] font-bold text-[#1978e5]">{formatCOP(montoFinanciar)}</p>
          </div>
        </div>

        {/* ── CUOTA INICIAL ── */}
        <div className="bg-white rounded-2xl p-6 border border-[#dce0e5]">
          <div className="flex items-center gap-2 mb-4">
            <ChartBar size={20} color="#1978e5" weight="fill" />
            <h2 className="text-[16px] font-bold text-[#111418]">Cuota Inicial</h2>
          </div>

          {/* Campo de valor manual */}
          <div className="mb-4">
            <label className="text-[13px] text-[#637488] font-medium mb-1.5 block">
              Ingresa el valor que tienes disponible
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[15px] font-bold text-[#637488]">$</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder={formatCOP(Math.round(pctInicial / 100 * precio)).replace("$\u00a0", "")}
                value={montoInicialManual}
                onChange={(e) => {
                  const raw = e.target.value.replace(/\D/g, "");
                  if (raw === "") {
                    setMontoInicialManual("");
                  } else {
                    // Formatear con puntos de miles
                    setMontoInicialManual(Number(raw).toLocaleString("es-CO"));
                  }
                }}
                className="w-full pl-8 pr-4 py-3.5 border-2 border-[#dce0e5] rounded-xl text-[16px] font-bold text-[#111418] outline-none focus:border-[#1978e5] transition-colors"
              />
              {montoInicialManual !== "" && (
                <button
                  onClick={() => setMontoInicialManual("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#637488] hover:text-[#111418] text-[12px] font-semibold"
                >
                  Limpiar
                </button>
              )}
            </div>
            <p className="text-[12px] text-[#637488] mt-1.5">
              Equivale al <span className="font-bold text-[#1978e5]">{pctEfectivo}%</span> del precio del vehículo
            </p>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-px bg-[#dce0e5]" />
            <span className="text-[12px] text-[#637488] font-medium">o usa el deslizador</span>
            <div className="flex-1 h-px bg-[#dce0e5]" />
          </div>

          <div className="flex items-center justify-between mb-3">
            <span className="text-[14px] text-[#637488]">Porcentaje de entrada</span>
            <span className="text-[18px] font-black text-[#1978e5]">{pctInicial}%</span>
          </div>

          <input
            type="range" min={10} max={70} step={5} value={pctInicial}
            onChange={(e) => { setPctInicial(Number(e.target.value)); setMontoInicialManual(""); }}
            className="w-full accent-[#1978e5] mb-3 h-2 cursor-pointer"
          />
          <div className="flex justify-between text-[12px] text-[#637488] mb-4">
            <span>10%</span><span>40%</span><span>70%</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[20, 30, 40, 50].map((pct) => (
              <button
                key={pct}
                onClick={() => { setPctInicial(pct); setMontoInicialManual(""); }}
                className={`py-2.5 rounded-xl text-[14px] font-bold border-2 transition-all ${
                  montoInicialManual === "" && pctInicial === pct
                    ? "border-[#1978e5] bg-[#e8f0fd] text-[#1978e5]"
                    : "border-[#dce0e5] text-[#637488] hover:border-[#1978e5]"
                }`}
              >
                {pct}% <br />
                <span className="text-[11px] font-medium">{formatCOP(Math.round(pct / 100 * precio))}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── PLAZO ── */}
        <div className="bg-white rounded-2xl p-6 border border-[#dce0e5]">
          <div className="flex items-center gap-2 mb-4">
            <CalendarBlank size={20} color="#1978e5" weight="fill" />
            <h2 className="text-[16px] font-bold text-[#111418]">Plazo del crédito</h2>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {PLAZOS.map((m) => (
              <button
                key={m}
                onClick={() => setPlazo(m)}
                className={`py-3 rounded-xl text-[14px] font-bold border-2 transition-all ${
                  plazo === m
                    ? "border-[#1978e5] bg-[#1978e5] text-white shadow-lg shadow-[#1978e5]/30"
                    : "border-[#dce0e5] text-[#637488] hover:border-[#1978e5]"
                }`}
              >
                {m} <br />
                <span className="text-[11px] font-normal">meses</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── ENTIDAD FINANCIERA ── */}
        <div className="bg-white rounded-2xl p-6 border border-[#dce0e5]">
          <div className="flex items-center gap-2 mb-1">
            <Percent size={20} color="#1978e5" weight="fill" />
            <h2 className="text-[16px] font-bold text-[#111418]">Entidad financiera</h2>
          </div>
          <p className="text-[12px] text-[#637488] mb-4 ml-7">Tasas de referencia Colombia 2025 (E.M.V.)</p>
          <div className="space-y-2">
            {TASAS.map((t, i) => (
              <button
                key={t.label}
                onClick={() => setTasaIdx(i)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border-2 transition-all text-left ${
                  tasaIdx === i
                    ? "border-[#1978e5] bg-[#e8f0fd]"
                    : "border-[#dce0e5] hover:border-[#1978e5]/50"
                }`}
              >
                <div>
                  <p className="text-[14px] font-bold text-[#111418]">{t.label}</p>
                  <p className="text-[12px] text-[#637488]">{t.descripcion}</p>
                </div>
                <div className="text-right">
                  <p className={`text-[18px] font-black ${tasaIdx === i ? "text-[#1978e5]" : "text-[#637488]"}`}>
                    {t.tasa}%
                  </p>
                  <p className="text-[11px] text-[#637488]">mensual</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── RESULTADO ── */}
        <div
          className="rounded-2xl p-6 text-white"
          style={{ background: "linear-gradient(135deg, #0d1b2e, #1565c0, #1978e5)" }}
        >
          <p className="text-white/70 text-[13px] font-semibold uppercase tracking-widest mb-4">Resultado del cálculo</p>

          <div className="text-center mb-6">
            <p className="text-white/70 text-[14px] mb-1">Tu cuota mensual estimada</p>
            <p className="text-[52px] font-black tracking-tight leading-none">
              {formatCOP(Math.round(cuotaMensual))}
            </p>
            <p className="text-white/60 text-[13px] mt-1">por {plazo} meses</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { label: "Cuota inicial", value: formatCOP(cuotaInicial), sub: `${pctInicial}% del valor` },
              { label: "Monto a financiar", value: formatCOP(montoFinanciar), sub: `${100 - pctInicial}% del valor` },
              { label: "Total intereses", value: formatCOP(Math.round(totalIntereses)), sub: `Tasa ${tasaSeleccionada.tasa}% m.v.` },
              { label: "Total a pagar", value: formatCOP(Math.round(totalPagar)), sub: `Cuota + intereses` },
            ].map((item) => (
              <div key={item.label} className="bg-white/10 rounded-xl p-3">
                <p className="text-white/60 text-[11px] uppercase tracking-wide">{item.label}</p>
                <p className="text-[15px] font-bold text-white mt-0.5">{item.value}</p>
                <p className="text-white/50 text-[11px]">{item.sub}</p>
              </div>
            ))}
          </div>

          {/* Nota legal */}
          <div className="flex items-start gap-2 bg-white/10 rounded-xl p-3 mb-5">
            <Info size={16} color="white" className="flex-shrink-0 mt-0.5 opacity-70" />
            <p className="text-[11px] text-white/60 leading-relaxed">
              Cálculo estimado. La cuota final depende del estudio de crédito, perfil financiero y condiciones de la entidad. No incluye gastos de escrituración ni seguros obligatorios.
            </p>
          </div>

          <a
            href={`https://wa.me/573175737083?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-4 bg-[#25d366] text-white font-black text-[16px] rounded-xl hover:bg-[#20b858] transition-colors"
          >
            <WhatsappLogo size={22} weight="fill" />
            Solicitar financiamiento ahora
          </a>
        </div>

        {/* ── TIPS ── */}
        <div className="bg-white rounded-2xl p-5 border border-[#dce0e5]">
          <h3 className="text-[15px] font-bold text-[#111418] mb-3">💡 Consejos para tu crédito</h3>
          <div className="space-y-2.5">
            {[
              "Una cuota inicial mayor al 30% reduce significativamente los intereses totales.",
              "Plazos de 36–48 meses son los más equilibrados entre cuota y costo total.",
              "Con historial crediticio positivo puedes acceder a tasas preferenciales.",
              "MOVEL gestiona el crédito directamente con las entidades financieras.",
            ].map((tip) => (
              <div key={tip} className="flex items-start gap-2">
                <span className="text-[#1978e5] font-bold mt-0.5 flex-shrink-0">✓</span>
                <p className="text-[13px] text-[#637488] leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
