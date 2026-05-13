"use client";

import { useState, useCallback, useRef } from "react";
import { MagnifyingGlass, SlidersHorizontal, X, Sparkle, CircleNotch } from "@phosphor-icons/react";
import { vehicles } from "@/lib/mock-data";
import VehicleCard from "@/components/VehicleCard";
import BottomNav from "@/components/BottomNav";

const marcas = ["Toyota", "Mazda", "Chevrolet", "Kia", "Renault", "Hyundai", "Nissan", "Ford"];
const tipos = ["SUV", "Sedán", "Hatchback", "Camioneta"];
const transmisiones = ["Automático", "Manual"];
const ciudades = ["Bogotá", "Medellín", "Cali", "Barranquilla"];
const combustibles = ["Gasolina", "Híbrido", "Diésel", "Eléctrico", "Mild Hybrid", "Gasolina y gas", "Híbrido/Diésel"];

// Pico y placa: derivar último dígito a partir del id del vehículo (determinístico)
const ultimoDigitoPlaca = (id: string): number => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(hash) % 10;
};

// Helper formato COP
const fmtCOP = (n: number) => new Intl.NumberFormat("es-CO", {
  style: "currency", currency: "COP", minimumFractionDigits: 0, maximumFractionDigits: 0,
}).format(n);

// Helper parse del input (acepta "30000000" o "30.000.000")
const parseNum = (s: string): number => {
  const n = Number(s.replace(/\D/g, ""));
  return isFinite(n) ? n : 0;
};

const YEAR_NOW = new Date().getFullYear();

export default function BuscarPage() {
  const [search, setSearch] = useState("");
  const [selectedMarca, setSelectedMarca] = useState("");
  const [selectedTipo, setSelectedTipo] = useState("");
  const [selectedTransmision, setSelectedTransmision] = useState("");
  const [selectedCiudad, setSelectedCiudad] = useState("");
  const [selectedCombustible, setSelectedCombustible] = useState<string[]>([]);
  const [selectedDigitos, setSelectedDigitos] = useState<number[]>([]);
  const [precioMin, setPrecioMin] = useState<number>(0);
  const [precioMax, setPrecioMax] = useState<number>(0); // 0 = sin tope
  const [anoMin, setAnoMin] = useState<number>(0);
  const [anoMax, setAnoMax] = useState<number>(0);
  const [kmMin, setKmMin]   = useState<number>(0);
  const [kmMax, setKmMax]   = useState<number>(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [ordenar, setOrdenar] = useState("recientes");

  // IA search state
  const [iaQuery, setIaQuery] = useState("");
  const [iaLoading, setIaLoading] = useState(false);
  const [iaIds, setIaIds] = useState<string[] | null>(null);
  const [iaInterpretation, setIaInterpretation] = useState("");
  const iaInputRef = useRef<HTMLInputElement>(null);

  const handleIaSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setIaIds(null); setIaInterpretation(""); return; }
    setIaLoading(true);
    try {
      const res = await fetch("/api/buscar-ia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();
      setIaIds(data.ids);
      setIaInterpretation(data.interpretation);
    } finally {
      setIaLoading(false);
    }
  }, []);

  const clearIa = () => { setIaIds(null); setIaInterpretation(""); setIaQuery(""); };

  // Función de ordenamiento
  function sortVehicles(list: typeof vehicles) {
    const sorted = [...list];
    if (ordenar === "precio-asc") sorted.sort((a, b) => a.precio - b.precio);
    else if (ordenar === "precio-desc") sorted.sort((a, b) => b.precio - a.precio);
    else if (ordenar === "km-asc") sorted.sort((a, b) => parseInt(a.kilometraje) - parseInt(b.kilometraje));
    else if (ordenar === "año-desc") sorted.sort((a, b) => b.año - a.año);
    return sorted;
  }

  // Filtrado normal (se aplica cuando no hay búsqueda IA activa)
  const filteredNormal = sortVehicles(vehicles.filter((v) => {
    const km = parseInt(v.kilometraje.replace(/\D/g, "")) || 0;
    const dig = ultimoDigitoPlaca(v.id);
    const matchSearch =
      !search ||
      v.titulo.toLowerCase().includes(search.toLowerCase()) ||
      v.marca.toLowerCase().includes(search.toLowerCase());
    const matchMarca       = !selectedMarca || v.marca === selectedMarca;
    const matchTipo        = !selectedTipo  || v.tipo === selectedTipo;
    const matchTransmision = !selectedTransmision || v.transmision === selectedTransmision;
    const matchCiudad      = !selectedCiudad || v.ciudad === selectedCiudad;
    const matchCombustible = selectedCombustible.length === 0 || selectedCombustible.includes(v.combustible);
    const matchDigitos     = selectedDigitos.length === 0 || selectedDigitos.includes(dig);
    const matchPrecioMin   = precioMin === 0 || v.precio >= precioMin;
    const matchPrecioMax   = precioMax === 0 || v.precio <= precioMax;
    const matchAnoMin      = anoMin === 0    || v.año >= anoMin;
    const matchAnoMax      = anoMax === 0    || v.año <= anoMax;
    const matchKmMin       = kmMin === 0     || km >= kmMin;
    const matchKmMax       = kmMax === 0     || km <= kmMax;
    return (
      matchSearch && matchMarca && matchTipo && matchTransmision && matchCiudad &&
      matchCombustible && matchDigitos &&
      matchPrecioMin && matchPrecioMax &&
      matchAnoMin && matchAnoMax &&
      matchKmMin && matchKmMax
    );
  }));

  // Si hay búsqueda IA, filtrar por los IDs que devolvió la IA
  const filtered = iaIds
    ? vehicles.filter((v) => iaIds.includes(v.id))
    : filteredNormal;

  function clearFilters() {
    setSelectedMarca(""); setSelectedTipo(""); setSelectedTransmision("");
    setSelectedCiudad(""); setSelectedCombustible([]); setSelectedDigitos([]);
    setPrecioMin(0); setPrecioMax(0);
    setAnoMin(0); setAnoMax(0);
    setKmMin(0); setKmMax(0);
    setSearch("");
  }

  const toggleArr = <T extends string | number>(arr: T[], v: T): T[] =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  const hasFilters = !!(
    selectedMarca || selectedTipo || selectedTransmision || selectedCiudad ||
    selectedCombustible.length || selectedDigitos.length ||
    precioMin || precioMax || anoMin || anoMax || kmMin || kmMax
  );

  // ── Filter Panel ───────────────────────────────────────────────────
  const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <p className="text-[12px] font-bold text-ink uppercase tracking-[0.1em] mb-2.5">{children}</p>
  );

  const RangeInputs = ({
    minVal, maxVal, onMin, onMax, placeholderMin = "Mínimo", placeholderMax = "Máximo", formatter,
  }: {
    minVal: number; maxVal: number;
    onMin: (n: number) => void; onMax: (n: number) => void;
    placeholderMin?: string; placeholderMax?: string;
    formatter?: (n: number) => string;
  }) => (
    <div className="grid grid-cols-2 gap-2">
      <input
        type="text"
        inputMode="numeric"
        value={minVal === 0 ? "" : formatter ? formatter(minVal) : String(minVal)}
        onChange={(e) => onMin(parseNum(e.target.value))}
        placeholder={placeholderMin}
        className="w-full px-3 py-2 rounded-lg border border-[#dce0e5] text-[13px] text-ink bg-white focus:outline-none focus:border-movel-900 focus:ring-2 focus:ring-movel-900/15 transition-all"
      />
      <input
        type="text"
        inputMode="numeric"
        value={maxVal === 0 ? "" : formatter ? formatter(maxVal) : String(maxVal)}
        onChange={(e) => onMax(parseNum(e.target.value))}
        placeholder={placeholderMax}
        className="w-full px-3 py-2 rounded-lg border border-[#dce0e5] text-[13px] text-ink bg-white focus:outline-none focus:border-movel-900 focus:ring-2 focus:ring-movel-900/15 transition-all"
      />
    </div>
  );

  const FilterPanel = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-[18px] text-movel-900">Filtros</h3>
        {hasFilters && (
          <button onClick={clearFilters} className="text-[12px] text-movel-600 font-bold hover:underline">
            Limpiar todo
          </button>
        )}
      </div>

      {/* Marca */}
      <div>
        <SectionLabel>Marca</SectionLabel>
        <div className="space-y-1.5">
          {marcas.map((m) => (
            <label key={m} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="marca"
                checked={selectedMarca === m}
                onChange={() => setSelectedMarca(selectedMarca === m ? "" : m)}
                className="w-4 h-4 accent-movel-900"
              />
              <span className="text-[14px] text-mute group-hover:text-ink">{m}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Tipo */}
      <div>
        <SectionLabel>Tipo</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {tipos.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTipo(selectedTipo === t ? "" : t)}
              className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold border transition-colors ${
                selectedTipo === t
                  ? "bg-movel-900 text-white border-movel-900"
                  : "border-[#dce0e5] text-mute hover:border-movel-900 hover:text-movel-900"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Tipo de combustible (multi-select) */}
      <div>
        <SectionLabel>Tipo de combustible</SectionLabel>
        <div className="space-y-1.5">
          {combustibles.map((c) => (
            <label key={c} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedCombustible.includes(c)}
                onChange={() => setSelectedCombustible(toggleArr(selectedCombustible, c))}
                className="w-4 h-4 accent-movel-900 rounded"
              />
              <span className="text-[14px] text-mute group-hover:text-ink">{c}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Año (rango) */}
      <div>
        <SectionLabel>Año (desde — hasta)</SectionLabel>
        <RangeInputs
          minVal={anoMin}
          maxVal={anoMax}
          onMin={(n) => setAnoMin(n > YEAR_NOW + 2 ? YEAR_NOW + 2 : n)}
          onMax={(n) => setAnoMax(n > YEAR_NOW + 2 ? YEAR_NOW + 2 : n)}
          placeholderMin="Desde"
          placeholderMax="Hasta"
        />
        <p className="text-[11px] text-mute mt-1.5">Ej: 2018 — 2024</p>
      </div>

      {/* Precio (rango) */}
      <div>
        <SectionLabel>Precio (desde — hasta)</SectionLabel>
        <RangeInputs
          minVal={precioMin}
          maxVal={precioMax}
          onMin={setPrecioMin}
          onMax={setPrecioMax}
          placeholderMin="Mínimo COP"
          placeholderMax="Máximo COP"
          formatter={(n) => new Intl.NumberFormat("es-CO").format(n)}
        />
        {(precioMin || precioMax) ? (
          <p className="text-[11px] text-mute mt-1.5">
            {precioMin ? fmtCOP(precioMin) : "$0"} — {precioMax ? fmtCOP(precioMax) : "Sin tope"}
          </p>
        ) : (
          <p className="text-[11px] text-mute mt-1.5">Ej: 30.000.000 — 80.000.000</p>
        )}
      </div>

      {/* Kilometraje (rango) */}
      <div>
        <SectionLabel>Kilometraje (desde — hasta)</SectionLabel>
        <RangeInputs
          minVal={kmMin}
          maxVal={kmMax}
          onMin={setKmMin}
          onMax={setKmMax}
          placeholderMin="Mín km"
          placeholderMax="Máx km"
          formatter={(n) => new Intl.NumberFormat("es-CO").format(n)}
        />
        <p className="text-[11px] text-mute mt-1.5">Ej: 0 — 60.000 km</p>
      </div>

      {/* Último dígito de la placa (pico y placa) */}
      <div>
        <SectionLabel>Último dígito de placa</SectionLabel>
        <div className="grid grid-cols-5 gap-1.5">
          {[0,1,2,3,4,5,6,7,8,9].map((d) => {
            const active = selectedDigitos.includes(d);
            return (
              <button
                key={d}
                onClick={() => setSelectedDigitos(toggleArr(selectedDigitos, d))}
                className={`h-9 rounded-lg text-[13px] font-mono font-bold border transition-all ${
                  active
                    ? "bg-movel-900 text-white border-movel-900 shadow-movel"
                    : "border-[#dce0e5] text-ink hover:border-movel-900"
                }`}
              >
                {d}
              </button>
            );
          })}
        </div>
        <p className="text-[11px] text-mute mt-2">Filtra por pico y placa</p>
      </div>

      {/* Transmisión */}
      <div>
        <SectionLabel>Transmisión</SectionLabel>
        <div className="flex gap-2">
          {transmisiones.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTransmision(selectedTransmision === t ? "" : t)}
              className={`flex-1 py-2 rounded-lg text-[13px] font-semibold border transition-colors ${
                selectedTransmision === t
                  ? "bg-movel-900 text-white border-movel-900"
                  : "border-[#dce0e5] text-mute hover:border-movel-900"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Ciudad */}
      <div>
        <SectionLabel>Ciudad</SectionLabel>
        <div className="space-y-1.5">
          {ciudades.map((c) => (
            <label key={c} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="ciudad"
                checked={selectedCiudad === c}
                onChange={() => setSelectedCiudad(selectedCiudad === c ? "" : c)}
                className="w-4 h-4 accent-movel-900"
              />
              <span className="text-[14px] text-mute group-hover:text-ink">{c}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa]">

      {/* ── BÚSQUEDA CON IA ── */}
      <div
        className="py-8 px-4"
        style={{ background: "linear-gradient(135deg, #0d1b2e 0%, #050E26 70%, #0B1E4E 100%)" }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <Sparkle size={18} color="#60a5fa" weight="fill" />
            <p className="text-[13px] font-bold text-[#60a5fa] uppercase tracking-wider">Búsqueda inteligente con IA</p>
          </div>
          <p className="text-white text-[22px] font-black mb-4 leading-tight">
            Describe el carro que buscas<br />
            <span className="text-white/60 text-[15px] font-normal">en tus propias palabras</span>
          </p>

          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-3">
              {iaLoading ? (
                <CircleNotch size={18} color="white" className="animate-spin flex-shrink-0" />
              ) : (
                <Sparkle size={18} color="#60a5fa" weight="fill" className="flex-shrink-0" />
              )}
              <input
                ref={iaInputRef}
                type="text"
                value={iaQuery}
                onChange={(e) => setIaQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleIaSearch(iaQuery)}
                placeholder='Ej: "carro 2020 único dueño menos de 50.000 km automático"'
                className="flex-1 bg-transparent text-white text-[15px] placeholder-white/40 outline-none"
              />
              {iaQuery && (
                <button onClick={clearIa}>
                  <X size={16} color="white" />
                </button>
              )}
            </div>
            <button
              onClick={() => handleIaSearch(iaQuery)}
              disabled={iaLoading || !iaQuery.trim()}
              className="px-6 py-3 text-white font-bold text-[14px] rounded-2xl transition-all disabled:opacity-50 interactive"
              style={{ background: "linear-gradient(135deg, #42a5f5, #0B1E4E)" }}
            >
              Buscar
            </button>
          </div>

          {/* Ejemplos */}
          {!iaIds && (
            <div className="flex flex-wrap gap-2 mt-3">
              {[
                "SUV automático sin siniestros",
                "Carro económico menos de $40M",
                "Solo un dueño menos de 30.000 km",
                "Sedán Bogotá 2020 o más nuevo",
              ].map((ej) => (
                <button
                  key={ej}
                  onClick={() => { setIaQuery(ej); handleIaSearch(ej); }}
                  className="text-[12px] font-semibold text-white/70 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-all border border-white/10 hover:border-white/30"
                >
                  {ej}
                </button>
              ))}
            </div>
          )}

          {/* Resultado IA */}
          {iaIds && (
            <div className="mt-3 flex items-center gap-3 bg-white/10 rounded-xl px-4 py-2.5">
              <Sparkle size={16} color="#60a5fa" weight="fill" />
              <p className="text-white/80 text-[13px] flex-1">
                {iaInterpretation || `Encontré ${iaIds.length} vehículo(s) que coinciden`}
              </p>
              <button onClick={clearIa} className="text-white/50 hover:text-white text-[12px] font-semibold transition-colors">
                Ver todos
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search bar normal */}
      {!iaIds && (
        <div className="bg-white border-b border-[#dce0e5] sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-3 flex gap-3">
            <div className="flex-1 flex items-center gap-3 bg-[#f0f2f4] rounded-xl h-12 px-4">
              <MagnifyingGlass size={18} color="#7A8195" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por marca, modelo..."
                className="flex-1 bg-transparent text-[15px] text-[#111418] placeholder-[#7A8195] outline-none"
              />
              {search && (
                <button onClick={() => setSearch("")}>
                  <X size={16} color="#7A8195" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center gap-2 px-4 h-12 bg-[#f0f2f4] rounded-xl text-[14px] font-semibold text-[#111418]"
            >
              <SlidersHorizontal size={18} />
              Filtros {hasFilters && <span className="w-2 h-2 bg-[#0B1E4E] rounded-full" />}
            </button>
          </div>

          {/* Chips de filtros activos */}
          {hasFilters && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3 flex flex-wrap gap-2">
              {selectedMarca && (
                <button onClick={() => setSelectedMarca("")}
                  className="flex items-center gap-1.5 bg-[#0B1E4E] text-white text-[12px] font-bold px-3 py-1.5 rounded-full hover:bg-[#050E26] transition-colors">
                  {selectedMarca} <X size={11} weight="bold" />
                </button>
              )}
              {selectedTipo && (
                <button onClick={() => setSelectedTipo("")}
                  className="flex items-center gap-1.5 bg-[#0B1E4E] text-white text-[12px] font-bold px-3 py-1.5 rounded-full hover:bg-[#050E26] transition-colors">
                  {selectedTipo} <X size={11} weight="bold" />
                </button>
              )}
              {selectedTransmision && (
                <button onClick={() => setSelectedTransmision("")}
                  className="flex items-center gap-1.5 bg-[#0B1E4E] text-white text-[12px] font-bold px-3 py-1.5 rounded-full hover:bg-[#050E26] transition-colors">
                  {selectedTransmision} <X size={11} weight="bold" />
                </button>
              )}
              {selectedCiudad && (
                <button onClick={() => setSelectedCiudad("")}
                  className="flex items-center gap-1.5 bg-[#0B1E4E] text-white text-[12px] font-bold px-3 py-1.5 rounded-full hover:bg-[#050E26] transition-colors">
                  {selectedCiudad} <X size={11} weight="bold" />
                </button>
              )}
              <button onClick={clearFilters}
                className="flex items-center gap-1.5 text-[12px] font-semibold text-[#7A8195] bg-[#f0f2f4] px-3 py-1.5 rounded-full hover:bg-[#e5e7eb] transition-colors">
                Limpiar todo
              </button>
            </div>
          )}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar desktop */}
          {!iaIds && (
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="bg-white rounded-2xl p-5 border border-[#dce0e5] sticky top-36">
                <FilterPanel />
              </div>
            </aside>
          )}

          {/* Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[15px] text-[#7A8195]">
                {iaIds ? (
                  <>
                    <Sparkle size={14} color="#0B1E4E" className="inline mr-1" weight="fill" />
                    <strong className="text-[#111418]">{filtered.length}</strong> resultado(s) de IA
                  </>
                ) : (
                  <><strong className="text-[#111418]">{filtered.length}</strong> vehículos encontrados</>
                )}
              </p>
              {!iaIds && (
                <select
                  value={ordenar}
                  onChange={(e) => setOrdenar(e.target.value)}
                  className="text-[14px] text-[#7A8195] bg-white border border-[#dce0e5] rounded-lg px-3 py-2 outline-none cursor-pointer"
                >
                  <option value="recientes">Más recientes</option>
                  <option value="precio-asc">Menor precio</option>
                  <option value="precio-desc">Mayor precio</option>
                  <option value="km-asc">Menor kilometraje</option>
                  <option value="año-desc">Año más nuevo</option>
                </select>
              )}
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-[#dce0e5]">
                <Sparkle size={40} color="#dce0e5" className="mx-auto mb-3" />
                <p className="text-[18px] font-bold text-[#111418] mb-2">Sin resultados</p>
                <p className="text-[14px] text-[#7A8195] mb-4">
                  {iaIds ? "La IA no encontró vehículos con esas características." : "Intenta ajustar los filtros"}
                </p>
                <button
                  onClick={iaIds ? clearIa : clearFilters}
                  className="px-6 py-2.5 text-white rounded-lg font-bold text-[14px]"
                  style={{ background: "linear-gradient(135deg, #050E26, #0B1E4E)" }}
                >
                  {iaIds ? "Ver todos los vehículos" : "Limpiar filtros"}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((v) => (
                  <VehicleCard key={v.id} vehicle={v} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[18px] font-bold text-[#111418]">Filtros</h2>
              <button onClick={() => setShowMobileFilters(false)}>
                <X size={24} color="#111418" />
              </button>
            </div>
            <FilterPanel />
            <button
              onClick={() => setShowMobileFilters(false)}
              className="w-full mt-6 h-12 text-white rounded-xl font-bold"
              style={{ background: "linear-gradient(135deg, #050E26, #0B1E4E)" }}
            >
              Ver resultados ({filtered.length})
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
