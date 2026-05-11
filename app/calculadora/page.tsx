"use client";

import { useState, useEffect, useCallback } from "react";
import MovelPageHeader from "@/components/MovelPageHeader";
import BottomNav from "@/components/BottomNav";
import {
  Calculator, CarProfile, Receipt, MagnifyingGlass,
  CurrencyDollar, Info, CaretDown, Gauge, ShieldCheck,
  Wrench, GasPump, House, ShieldCheckered, ArrowRight,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

function fmt(n: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(n);
}

type Mode = "buscar" | "manual";

interface BrandsResponse { populares: string[]; todas: string[]; }
interface LinesResponse  { lines: string[]; }
interface AvaluoResponse {
  avaluo: number;
  impuesto: { impuestoAnual: number; impuestoMensual: number; tarifaPorcentaje: string; rangoAplicado: { descripcion: string } };
  gastos: { impuestoRodamiento: number; soat: number; tecnomecanica: number; parqueadero: number; combustible: number; mantenimiento: number; seguroTodoRiesgo: number; total: number };
}

export default function CalculadoraPage() {
  const [mode, setMode] = useState<Mode>("buscar");
  // Modo buscar
  const [brands, setBrands] = useState<{ populares: string[]; todas: string[] }>({ populares: [], todas: [] });
  const [brand, setBrand] = useState("");
  const [lines, setLines] = useState<string[]>([]);
  const [lineQuery, setLineQuery] = useState("");
  const [linea, setLinea] = useState("");
  const [ano, setAno] = useState<number>(new Date().getFullYear() - 1);
  // Modo manual
  const [manualAvaluo, setManualAvaluo] = useState<string>("");
  // Resultado
  const [result, setResult] = useState<AvaluoResponse | null>(null);
  const [loading, setLoading] = useState(false);
  // Opciones gastos
  const [incluyeSeguro, setIncluyeSeguro] = useState(true);
  const [incluyeParqueadero, setIncluyeParqueadero] = useState(true);

  // Cargar marcas al montar
  useEffect(() => {
    fetch("/api/catalog/brands").then(r => r.json()).then((d: BrandsResponse) => setBrands(d));
  }, []);

  // Al elegir marca, cargar líneas
  useEffect(() => {
    if (!brand) { setLines([]); return; }
    fetch(`/api/catalog/lines?brand=${encodeURIComponent(brand)}&q=${encodeURIComponent(lineQuery)}&limit=80`)
      .then(r => r.json())
      .then((d: LinesResponse) => setLines(d.lines));
  }, [brand, lineQuery]);

  // Calcular cuando hay vehículo + año
  const calcularDesdeCatalogo = useCallback(async () => {
    if (!brand || !linea || !ano) return;
    setLoading(true);
    try {
      const url = `/api/catalog/avaluo?brand=${encodeURIComponent(brand)}&linea=${encodeURIComponent(linea)}&ano=${ano}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        // recalcular gastos con opciones del usuario
        await calcularConOpciones(data.avaluo);
      }
    } finally {
      setLoading(false);
    }
  }, [brand, linea, ano, incluyeSeguro, incluyeParqueadero]);

  const calcularConOpciones = useCallback(async (avaluo: number) => {
    const url = `/api/calculadora/impuesto?avaluo=${avaluo}&seguro=${incluyeSeguro}&parqueadero=${incluyeParqueadero}`;
    const res = await fetch(url);
    const data = await res.json();
    setResult({ avaluo, impuesto: data.impuesto, gastos: data.gastos });
  }, [incluyeSeguro, incluyeParqueadero]);

  useEffect(() => { calcularDesdeCatalogo(); }, [calcularDesdeCatalogo]);

  function handleManualCalc() {
    const n = Number(manualAvaluo.replace(/\D/g, ""));
    if (n > 0) calcularConOpciones(n);
  }

  // Refrescar resultado al cambiar opciones
  useEffect(() => {
    if (result?.avaluo) calcularConOpciones(result.avaluo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incluyeSeguro, incluyeParqueadero]);

  const years = Array.from({ length: 25 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="min-h-screen pb-24"
      style={{ background: "linear-gradient(160deg, #08101e 0%, #0d1b2e 55%, #0f2040 100%)" }}>
      <MovelPageHeader />

      <div className="max-w-4xl mx-auto px-4 pt-6">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-3"
            style={{ background: "linear-gradient(135deg, #1565c0, #42a5f5)" }}>
            <Calculator size={28} color="white" weight="fill" />
          </div>
          <h1 className="text-white text-[26px] font-black">Calculadora de Impuestos</h1>
          <p className="text-white/50 text-[14px] mt-1">
            Impuesto de Rodamiento 2026 · Tarifa oficial del Ministerio de Transporte
          </p>
        </div>

        {/* Tarifas oficiales */}
        <div className="rounded-2xl p-4 mb-5 grid grid-cols-3 gap-2"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          {[
            { tarifa: "1.7%", rango: "Hasta $54M", color: "#22c55e" },
            { tarifa: "2.7%", rango: "$54M - $121M", color: "#f59e0b" },
            { tarifa: "3.7%", rango: "Más de $121M", color: "#ef4444" },
          ].map(t => (
            <div key={t.tarifa} className="text-center py-2">
              <p className="font-black text-[18px]" style={{ color: t.color }}>{t.tarifa}</p>
              <p className="text-white/40 text-[10px]">{t.rango}</p>
            </div>
          ))}
        </div>

        {/* Tabs modo */}
        <div className="flex rounded-2xl p-1 mb-5"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <button onClick={() => setMode("buscar")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-bold transition-all ${
              mode === "buscar" ? "bg-[#1978e5] text-white" : "text-white/40"
            }`}>
            <CarProfile size={16} weight="fill" /> Buscar mi vehículo
          </button>
          <button onClick={() => setMode("manual")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-bold transition-all ${
              mode === "manual" ? "bg-[#1978e5] text-white" : "text-white/40"
            }`}>
            <CurrencyDollar size={16} weight="fill" /> Ingresar avalúo
          </button>
        </div>

        {/* ── MODO BUSCAR ── */}
        {mode === "buscar" && (
          <div className="rounded-2xl p-5 mb-5"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>

            {/* Marca */}
            <label className="text-white/60 text-[12px] font-bold uppercase mb-2 block">Marca</label>
            <select value={brand} onChange={(e) => { setBrand(e.target.value); setLinea(""); setLineQuery(""); setResult(null); }}
              className="w-full px-4 py-3 rounded-xl text-white text-[14px] mb-4 outline-none"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
              <option value="" style={{ color: "#111" }}>— Selecciona marca —</option>
              {brands.populares.length > 0 && (
                <optgroup label="Más populares en Colombia" style={{ color: "#111" }}>
                  {brands.populares.map(b => <option key={b} value={b} style={{ color: "#111" }}>{b}</option>)}
                </optgroup>
              )}
              <optgroup label="Todas las marcas" style={{ color: "#111" }}>
                {brands.todas.filter(b => !brands.populares.includes(b)).map(b =>
                  <option key={b} value={b} style={{ color: "#111" }}>{b}</option>
                )}
              </optgroup>
            </select>

            {/* Linea / Modelo con búsqueda */}
            {brand && (
              <>
                <label className="text-white/60 text-[12px] font-bold uppercase mb-2 block">Modelo / Línea</label>
                <div className="relative mb-2">
                  <MagnifyingGlass size={16} color="rgba(255,255,255,0.4)"
                    className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Ej: 320i, Hilux, Sandero..."
                    value={lineQuery}
                    onChange={(e) => setLineQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 rounded-xl text-white text-[14px] outline-none"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                  />
                </div>
                <div className="mb-4 max-h-48 overflow-y-auto rounded-xl"
                  style={{ background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  {lines.length === 0 ? (
                    <p className="text-white/30 text-[12px] p-3 text-center">Sin resultados</p>
                  ) : (
                    lines.map((l) => (
                      <button key={l} onClick={() => setLinea(l)}
                        className={`w-full text-left px-3 py-2 text-[13px] hover:bg-white/5 transition-colors ${
                          linea === l ? "bg-[#1978e5]/30 text-white" : "text-white/70"
                        }`}>
                        {l}
                      </button>
                    ))
                  )}
                </div>
              </>
            )}

            {/* Año */}
            {linea && (
              <>
                <label className="text-white/60 text-[12px] font-bold uppercase mb-2 block">Año modelo</label>
                <select value={ano} onChange={(e) => setAno(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl text-white text-[14px] outline-none"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
                  {years.map(y => <option key={y} value={y} style={{ color: "#111" }}>{y}</option>)}
                </select>
              </>
            )}
          </div>
        )}

        {/* ── MODO MANUAL ── */}
        {mode === "manual" && (
          <div className="rounded-2xl p-5 mb-5"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <label className="text-white/60 text-[12px] font-bold uppercase mb-2 block">Avalúo comercial del vehículo</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ej: 80.000.000"
                value={manualAvaluo}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "");
                  setManualAvaluo(v ? Number(v).toLocaleString("es-CO") : "");
                }}
                className="flex-1 px-4 py-3 rounded-xl text-white text-[16px] font-bold outline-none"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
              />
              <button onClick={handleManualCalc}
                className="px-6 py-3 rounded-xl font-bold text-[14px] text-white"
                style={{ background: "linear-gradient(135deg, #1565c0, #42a5f5)" }}>
                Calcular →
              </button>
            </div>
            <p className="text-white/30 text-[11px] mt-2 flex items-center gap-1">
              <Info size={11} /> Encuentra el avalúo en tu certificado de tradición o factura
            </p>
          </div>
        )}

        {/* ── RESULTADO ── */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key={result.avaluo}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-4">

              {/* Card principal — Impuesto */}
              <div className="rounded-3xl p-6"
                style={{ background: "linear-gradient(135deg, #1565c0, #1978e5)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <p className="text-white/70 text-[12px] font-bold uppercase mb-1">Avalúo del vehículo</p>
                <p className="text-white text-[22px] font-bold mb-4">{fmt(result.avaluo)}</p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/15 rounded-2xl p-4 backdrop-blur-sm">
                    <p className="text-white/70 text-[11px] font-bold uppercase mb-1">Impuesto anual</p>
                    <p className="text-white text-[24px] font-black">{fmt(result.impuesto.impuestoAnual)}</p>
                    <p className="text-white/60 text-[11px] mt-0.5">Tarifa: {result.impuesto.tarifaPorcentaje}</p>
                  </div>
                  <div className="bg-white/15 rounded-2xl p-4 backdrop-blur-sm">
                    <p className="text-white/70 text-[11px] font-bold uppercase mb-1">Mensualizado</p>
                    <p className="text-white text-[24px] font-black">{fmt(result.impuesto.impuestoMensual)}</p>
                    <p className="text-white/60 text-[11px] mt-0.5">{result.impuesto.rangoAplicado.descripcion}</p>
                  </div>
                </div>
              </div>

              {/* Opciones de gastos */}
              <div className="rounded-2xl p-4 flex flex-wrap gap-3"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <label className="flex items-center gap-2 text-white/70 text-[12px] cursor-pointer">
                  <input type="checkbox" checked={incluyeSeguro}
                    onChange={(e) => setIncluyeSeguro(e.target.checked)}
                    className="w-4 h-4 accent-[#1978e5]" />
                  Incluir seguro todo riesgo
                </label>
                <label className="flex items-center gap-2 text-white/70 text-[12px] cursor-pointer">
                  <input type="checkbox" checked={incluyeParqueadero}
                    onChange={(e) => setIncluyeParqueadero(e.target.checked)}
                    className="w-4 h-4 accent-[#1978e5]" />
                  Incluir parqueadero
                </label>
              </div>

              {/* Card de gastos mensuales completos */}
              <div className="rounded-3xl p-6"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex items-center gap-2 mb-4">
                  <Receipt size={22} color="#60a5fa" weight="fill" />
                  <h2 className="text-white text-[18px] font-black">Gastos mensuales estimados</h2>
                </div>

                <div className="space-y-3 mb-4">
                  {[
                    { icon: Receipt, label: "Impuesto de rodamiento", val: result.gastos.impuestoRodamiento, color: "#60a5fa" },
                    { icon: ShieldCheckered, label: "SOAT", val: result.gastos.soat, color: "#22c55e" },
                    { icon: Gauge, label: "Tecnomecánica", val: result.gastos.tecnomecanica, color: "#f59e0b" },
                    { icon: GasPump, label: "Combustible", val: result.gastos.combustible, color: "#ef4444" },
                    { icon: Wrench, label: "Mantenimiento", val: result.gastos.mantenimiento, color: "#a855f7" },
                    ...(result.gastos.parqueadero > 0 ? [{ icon: House, label: "Parqueadero", val: result.gastos.parqueadero, color: "#06b6d4" }] : []),
                    ...(result.gastos.seguroTodoRiesgo > 0 ? [{ icon: ShieldCheck, label: "Seguro todo riesgo", val: result.gastos.seguroTodoRiesgo, color: "#ec4899" }] : []),
                  ].map(g => (
                    <div key={g.label} className="flex items-center justify-between py-2.5"
                      style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                          style={{ background: `${g.color}22` }}>
                          <g.icon size={16} color={g.color} weight="fill" />
                        </div>
                        <span className="text-white/80 text-[14px]">{g.label}</span>
                      </div>
                      <span className="text-white font-bold text-[14px]">{fmt(g.val)}</span>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl p-4 mt-2"
                  style={{ background: "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05))", border: "1px solid rgba(34,197,94,0.3)" }}>
                  <p className="text-white/70 text-[11px] font-bold uppercase">Total mensual estimado</p>
                  <p className="text-[#22c55e] text-[28px] font-black">{fmt(result.gastos.total)}</p>
                  <p className="text-white/40 text-[11px] mt-1">
                    ≈ {fmt(result.gastos.total * 12)} al año
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="grid grid-cols-2 gap-3">
                <a href="/buscar" className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl font-bold text-[14px] text-white"
                  style={{ background: "linear-gradient(135deg, #1565c0, #42a5f5)" }}>
                  <CarProfile size={16} weight="fill" /> Ver vehículos
                </a>
                <a href="/publicar" className="flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl font-bold text-[14px] text-white border border-white/15"
                  style={{ background: "rgba(255,255,255,0.04)" }}>
                  Publicar el mío <ArrowRight size={16} />
                </a>
              </div>

              {/* Disclaimer */}
              <p className="text-white/30 text-[11px] text-center leading-relaxed">
                ⚠️ Cálculo aproximado basado en tarifas oficiales 2026.<br/>
                SOAT, mantenimiento y combustible son promedios — pueden variar según uso.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block w-6 h-6 rounded-full border-2 border-white/20 border-t-white animate-spin" />
            <p className="text-white/50 text-[12px] mt-2">Calculando...</p>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
