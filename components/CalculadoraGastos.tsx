"use client";

import { useState, useEffect } from "react";
import {
  Calculator, Receipt, ShieldCheckered, Gauge, GasPump,
  Wrench, House, ShieldCheck, Info, CaretDown, CaretUp,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

function fmt(n: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(n);
}

interface CalcResult {
  impuesto: {
    impuestoAnual: number;
    impuestoMensual: number;
    tarifaPorcentaje: string;
    rangoAplicado: { descripcion: string };
  };
  gastos: {
    impuestoRodamiento: number;
    soat: number;
    tecnomecanica: number;
    parqueadero: number;
    combustible: number;
    mantenimiento: number;
    seguroTodoRiesgo: number;
    total: number;
  };
}

export interface CalculadoraGastosProps {
  /** Avalúo o precio del vehículo en COP. Usado como fallback si no hay match en Min de Transporte */
  avaluo: number;
  /** Marca del vehículo (opcional). Si se pasa, busca el avalúo oficial del Min de Transporte */
  marca?: string;
  /** Modelo/línea (opcional). Junto con marca y año busca el avalúo real */
  modelo?: string;
  /** Año del vehículo (opcional) */
  ano?: number;
  /** Si es true, abre el panel expandido por defecto */
  defaultOpen?: boolean;
  /** Variante de tema: "dark" (sobre fondo oscuro) o "light" (sobre fondo claro) */
  theme?: "dark" | "light";
}

export default function CalculadoraGastos({ avaluo, marca, modelo, ano, defaultOpen = false, theme = "light" }: CalculadoraGastosProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [result, setResult] = useState<CalcResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [incluyeSeguro, setIncluyeSeguro] = useState(true);
  const [incluyeParqueadero, setIncluyeParqueadero] = useState(true);
  // Avalúo oficial obtenido del Min de Transporte (si hay match)
  const [avaluoOficial, setAvaluoOficial] = useState<number | null>(null);
  const [fuenteAvaluo, setFuenteAvaluo] = useState<"oficial" | "precio">("precio");

  // Buscar avalúo oficial del Min de Transporte si se proporciona marca+modelo+ano
  useEffect(() => {
    if (!marca || !modelo || !ano) {
      setAvaluoOficial(null);
      setFuenteAvaluo("precio");
      return;
    }
    fetch(`/api/catalog/avaluo?brand=${encodeURIComponent(marca)}&linea=${encodeURIComponent(modelo)}&ano=${ano}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data?.avaluo && data.avaluo > 0) {
          setAvaluoOficial(data.avaluo);
          setFuenteAvaluo("oficial");
        } else {
          setAvaluoOficial(null);
          setFuenteAvaluo("precio");
        }
      })
      .catch(() => {
        setAvaluoOficial(null);
        setFuenteAvaluo("precio");
      });
  }, [marca, modelo, ano]);

  // Avalúo efectivo: oficial > avaluo proporcionado (precio)
  const avaluoEfectivo = avaluoOficial ?? avaluo;

  useEffect(() => {
    if (!avaluoEfectivo || avaluoEfectivo <= 0) return;
    setLoading(true);
    fetch(`/api/calculadora/impuesto?avaluo=${avaluoEfectivo}&seguro=${incluyeSeguro}&parqueadero=${incluyeParqueadero}`)
      .then((r) => r.json())
      .then(setResult)
      .finally(() => setLoading(false));
  }, [avaluoEfectivo, incluyeSeguro, incluyeParqueadero]);

  const isDark = theme === "dark";
  const containerCls = isDark
    ? "bg-white/5 border border-white/10 backdrop-blur-sm"
    : "bg-white border border-[#dce0e5]";
  const titleCls = isDark ? "text-white" : "text-[#111418]";
  const subCls   = isDark ? "text-white/50" : "text-[#637488]";
  const dividerCls = isDark ? "border-white/5" : "border-[#f0f2f4]";

  if (!avaluo || avaluo <= 0) return null;

  return (
    <div className={`rounded-2xl overflow-hidden ${containerCls}`}>
      {/* Header — toggle */}
      <button
        onClick={() => setOpen(!open)}
        className={`w-full px-5 py-4 flex items-center justify-between ${open ? `border-b ${dividerCls}` : ""}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #1565c0, #42a5f5)" }}>
            <Calculator size={18} color="white" weight="fill" />
          </div>
          <div className="text-left">
            <h3 className={`text-[15px] font-black ${titleCls}`}>
              Calculadora de gastos
            </h3>
            <p className={`text-[11px] ${subCls}`}>
              Impuesto · SOAT · mantenimiento · combustible
            </p>
          </div>
        </div>
        {open ? <CaretUp size={18} color={isDark ? "rgba(255,255,255,0.4)" : "#637488"} /> : <CaretDown size={18} color={isDark ? "rgba(255,255,255,0.4)" : "#637488"} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            {loading && !result && (
              <div className="p-8 text-center">
                <div className="inline-block w-5 h-5 rounded-full border-2 border-[#1978e5]/30 border-t-[#1978e5] animate-spin" />
                <p className={`text-[12px] mt-2 ${subCls}`}>Calculando...</p>
              </div>
            )}

            {result && (
              <div className="p-5">
                {/* Fuente del avalúo */}
                <div className={`rounded-xl px-3 py-2 mb-3 flex items-start gap-2 text-[11px] ${
                  fuenteAvaluo === "oficial"
                    ? "bg-green-50 border border-green-200 text-green-800"
                    : "bg-amber-50 border border-amber-200 text-amber-800"
                }`}>
                  <Info size={13} weight="fill" className="flex-shrink-0 mt-0.5" />
                  <div>
                    {fuenteAvaluo === "oficial" ? (
                      <>
                        <strong>Avalúo oficial Min. de Transporte 2026:</strong> {fmt(avaluoEfectivo)}.
                        Los impuestos se calculan sobre este valor (no sobre el precio publicado).
                      </>
                    ) : (
                      <>
                        <strong>Cálculo estimado sobre {fmt(avaluoEfectivo)}.</strong>
                        {" "}Sin coincidencia exacta con catálogo Min. de Transporte, usamos el precio como referencia.
                      </>
                    )}
                  </div>
                </div>

                {/* Impuesto destacado */}
                <div className="rounded-2xl p-4 mb-4"
                  style={{ background: "linear-gradient(135deg, #1565c0, #1978e5)" }}>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-white/70 text-[10px] font-bold uppercase">Impuesto anual</p>
                      <p className="text-white text-[20px] font-black">{fmt(result.impuesto.impuestoAnual)}</p>
                      <p className="text-white/60 text-[10px]">Tarifa: {result.impuesto.tarifaPorcentaje}</p>
                    </div>
                    <div>
                      <p className="text-white/70 text-[10px] font-bold uppercase">Mensualizado</p>
                      <p className="text-white text-[20px] font-black">{fmt(result.impuesto.impuestoMensual)}</p>
                      <p className="text-white/60 text-[10px]">{result.impuesto.rangoAplicado.descripcion}</p>
                    </div>
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex gap-4 mb-3 flex-wrap">
                  <label className={`flex items-center gap-2 text-[12px] cursor-pointer ${subCls}`}>
                    <input type="checkbox" checked={incluyeSeguro}
                      onChange={(e) => setIncluyeSeguro(e.target.checked)}
                      className="w-3.5 h-3.5 accent-[#1978e5]" />
                    Seguro todo riesgo
                  </label>
                  <label className={`flex items-center gap-2 text-[12px] cursor-pointer ${subCls}`}>
                    <input type="checkbox" checked={incluyeParqueadero}
                      onChange={(e) => setIncluyeParqueadero(e.target.checked)}
                      className="w-3.5 h-3.5 accent-[#1978e5]" />
                    Parqueadero
                  </label>
                </div>

                {/* Lista de gastos */}
                <div className="space-y-2">
                  {[
                    { icon: Receipt,        label: "Impuesto rodamiento", val: result.gastos.impuestoRodamiento, color: "#60a5fa" },
                    { icon: ShieldCheckered, label: "SOAT",                val: result.gastos.soat,              color: "#22c55e" },
                    { icon: Gauge,          label: "Tecnomecánica",       val: result.gastos.tecnomecanica,     color: "#f59e0b" },
                    { icon: GasPump,        label: "Combustible",         val: result.gastos.combustible,       color: "#ef4444" },
                    { icon: Wrench,         label: "Mantenimiento",       val: result.gastos.mantenimiento,     color: "#a855f7" },
                    ...(result.gastos.parqueadero > 0    ? [{ icon: House,        label: "Parqueadero",         val: result.gastos.parqueadero,       color: "#06b6d4" }] : []),
                    ...(result.gastos.seguroTodoRiesgo > 0 ? [{ icon: ShieldCheck,  label: "Seguro todo riesgo",  val: result.gastos.seguroTodoRiesgo, color: "#ec4899" }] : []),
                  ].map((g) => (
                    <div key={g.label} className="flex items-center justify-between py-2"
                      style={{ borderBottom: isDark ? "1px solid rgba(255,255,255,0.05)" : "1px solid #f0f2f4" }}>
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ background: `${g.color}22` }}>
                          <g.icon size={13} color={g.color} weight="fill" />
                        </div>
                        <span className={`text-[13px] ${isDark ? "text-white/80" : "text-[#111418]"}`}>{g.label}</span>
                      </div>
                      <span className={`font-bold text-[13px] ${isDark ? "text-white" : "text-[#111418]"}`}>
                        {fmt(g.val)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="mt-4 rounded-xl p-4"
                  style={{ background: "linear-gradient(135deg, rgba(34,197,94,0.12), rgba(34,197,94,0.04))", border: "1px solid rgba(34,197,94,0.25)" }}>
                  <p className={`text-[10px] font-bold uppercase ${subCls}`}>Total mensual estimado</p>
                  <p className="text-[#16a34a] text-[26px] font-black leading-none">{fmt(result.gastos.total)}</p>
                  <p className={`text-[11px] mt-1 ${subCls}`}>≈ {fmt(result.gastos.total * 12)} al año</p>
                </div>

                <p className={`text-[10px] mt-3 flex items-start gap-1 ${subCls}`}>
                  <Info size={10} className="mt-0.5 shrink-0" />
                  Cálculo basado en tarifas oficiales 2026 del Min. Transporte. SOAT, combustible y mantenimiento son promedios — pueden variar según uso.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
