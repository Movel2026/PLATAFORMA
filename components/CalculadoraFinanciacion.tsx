"use client";

/**
 * CalculadoraFinanciacion — Versión compacta y expandible para embeber en /vehiculo/[id].
 * Permite simular cuota inicial, plazo y tasa, y construye un link a WhatsApp.
 */

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  CurrencyCircleDollar, CaretDown, WhatsappLogo, ArrowRight,
} from "@phosphor-icons/react";

const TASAS_REF = [
  { label: "Tasa preferencial", tasa: 1.18 },
  { label: "Tasa estándar",     tasa: 1.32 },
  { label: "Tasa referencia",   tasa: 1.45 },
];

const PLAZOS = [12, 24, 36, 48, 60, 72];

function calcularCuota(capital: number, tasaMensual: number, meses: number): number {
  if (capital <= 0 || meses <= 0) return 0;
  const r = tasaMensual / 100;
  return capital * (r * Math.pow(1 + r, meses)) / (Math.pow(1 + r, meses) - 1);
}

const fmtCOP = (n: number) => new Intl.NumberFormat("es-CO", {
  style: "currency", currency: "COP", minimumFractionDigits: 0, maximumFractionDigits: 0,
}).format(n);

interface Props {
  /** Precio total del vehículo */
  precio: number;
  /** Slug para link a la página completa */
  vehicleId: string;
  /** WhatsApp del vendedor (sin +) */
  whatsapp?: string;
  /** Título del vehículo (para WhatsApp) */
  titulo?: string;
  /** Si arranca desplegada (default true) */
  defaultOpen?: boolean;
}

export default function CalculadoraFinanciacion({
  precio,
  vehicleId,
  whatsapp = "573175737083",
  titulo = "vehículo",
  defaultOpen = true,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const [pctInicial, setPctInicial] = useState(30);
  const [plazo, setPlazo] = useState(48);
  const [tasaIdx, setTasaIdx] = useState(0);

  const tasaSel       = TASAS_REF[tasaIdx];
  const cuotaInicial  = Math.round((pctInicial / 100) * precio);
  const montoFinanciar = Math.max(precio - cuotaInicial, 0);
  const cuotaMensual  = useMemo(
    () => calcularCuota(montoFinanciar, tasaSel.tasa, plazo),
    [montoFinanciar, tasaSel.tasa, plazo]
  );
  const totalPagar    = cuotaMensual * plazo + cuotaInicial;
  const totalIntereses = totalPagar - precio;

  const wabMsg = encodeURIComponent(
    `Hola MOVEL, estoy interesado en financiar el ${titulo} por ${fmtCOP(precio)}. ` +
    `Cuota inicial: ${fmtCOP(cuotaInicial)} (${pctInicial}%), plazo: ${plazo} meses. ` +
    `Cuota estimada: ${fmtCOP(Math.round(cuotaMensual))}/mes. ¿Me pueden ayudar?`
  );

  return (
    <div className="bg-white rounded-2xl border border-[#dce0e5] overflow-hidden">

      {/* ── Header (toggle) ── */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-3 p-5 hover:bg-cloud transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-movel-gradient flex items-center justify-center flex-shrink-0">
            <CurrencyCircleDollar size={22} color="white" weight="fill" />
          </div>
          <div>
            <h3 className="font-display text-[18px] text-movel-900 leading-tight">Financia este carro</h3>
            <p className="text-[13px] text-mute mt-0.5">
              Desde <strong className="text-movel-600">{fmtCOP(Math.round(cuotaMensual))}/mes</strong> · {plazo} meses
            </p>
          </div>
        </div>
        <div className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}>
          <CaretDown size={22} color="#0B1E4E" weight="bold" />
        </div>
      </button>

      {/* ── Contenido expandible ── */}
      {open && (
        <div className="border-t border-[#dce0e5] p-5 space-y-5 animate-fade-in-down">

          {/* Cuota inicial */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-[12px] font-bold text-ink uppercase tracking-[0.08em]">Cuota inicial</p>
              <p className="text-[13px] font-bold text-movel-900">{pctInicial}% · {fmtCOP(cuotaInicial)}</p>
            </div>
            <input
              type="range"
              min={10}
              max={70}
              step={5}
              value={pctInicial}
              onChange={(e) => setPctInicial(Number(e.target.value))}
              className="w-full accent-movel-900"
            />
            <div className="flex justify-between text-[10px] text-mute mt-1">
              <span>10%</span><span>40%</span><span>70%</span>
            </div>
          </div>

          {/* Plazo */}
          <div>
            <p className="text-[12px] font-bold text-ink uppercase tracking-[0.08em] mb-2">Plazo</p>
            <div className="grid grid-cols-6 gap-1.5">
              {PLAZOS.map((p) => (
                <button
                  key={p}
                  onClick={() => setPlazo(p)}
                  className={`py-2 rounded-lg text-[12px] font-bold transition-all ${
                    plazo === p
                      ? "bg-movel-900 text-white shadow-movel"
                      : "bg-cloud text-mute hover:bg-movel-50 hover:text-movel-900"
                  }`}
                >
                  {p}m
                </button>
              ))}
            </div>
          </div>

          {/* Tasa */}
          <div>
            <p className="text-[12px] font-bold text-ink uppercase tracking-[0.08em] mb-2">Tasa estimada</p>
            <div className="grid grid-cols-3 gap-1.5">
              {TASAS_REF.map((t, i) => (
                <button
                  key={t.label}
                  onClick={() => setTasaIdx(i)}
                  className={`py-2 px-2 rounded-lg text-[11px] font-bold transition-all border ${
                    tasaIdx === i
                      ? "bg-movel-50 text-movel-900 border-movel-900"
                      : "bg-white text-mute border-[#dce0e5] hover:border-movel-900"
                  }`}
                >
                  {t.tasa}% E.M.
                </button>
              ))}
            </div>
          </div>

          {/* Resultado destacado */}
          <div className="bg-movel-gradient-dark rounded-2xl p-5 text-white">
            <p className="text-[11px] font-bold text-movel-300 uppercase tracking-[0.1em] mb-1">Cuota mensual estimada</p>
            <p className="font-display text-[34px] md:text-[40px] leading-none mb-3">
              {fmtCOP(Math.round(cuotaMensual))}
            </p>
            <div className="grid grid-cols-2 gap-3 text-[12px] pt-3 border-t border-white/15">
              <div>
                <p className="text-white/55">Monto a financiar</p>
                <p className="font-bold text-white">{fmtCOP(montoFinanciar)}</p>
              </div>
              <div>
                <p className="text-white/55">Intereses totales</p>
                <p className="font-bold text-white">{fmtCOP(Math.round(totalIntereses))}</p>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <a
              href={`https://wa.me/${whatsapp}?text=${wabMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 bg-[#25d366] text-white font-bold rounded-xl text-[14px] hover:bg-[#20b858] transition-colors"
            >
              <WhatsappLogo size={18} weight="fill" />
              Hablar con asesor
            </a>
            <Link
              href={`/vehiculo/${vehicleId}/financiamiento`}
              className="flex items-center justify-center gap-2 py-3 border-2 border-movel-900 text-movel-900 font-bold rounded-xl text-[14px] hover:bg-movel-50 transition-colors"
            >
              Ver simulación completa
              <ArrowRight size={16} weight="bold" />
            </Link>
          </div>

          <p className="text-[11px] text-mute text-center leading-relaxed">
            Tasas referenciales 2025. La tasa final depende del perfil del solicitante y la entidad financiera.
          </p>
        </div>
      )}
    </div>
  );
}
