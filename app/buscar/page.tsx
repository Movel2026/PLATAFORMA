"use client";

import { useState, useCallback, useRef } from "react";
import { MagnifyingGlass, SlidersHorizontal, X, Sparkle, CircleNotch } from "@phosphor-icons/react";
import { vehicles } from "@/lib/mock-data";
import VehicleCard from "@/components/VehicleCard";
import BottomNav from "@/components/BottomNav";
import MovelPageHeader from "@/components/MovelPageHeader";

const marcas = ["Toyota", "Mazda", "Chevrolet", "Kia", "Renault", "Hyundai", "Nissan", "Ford"];
const tipos = ["SUV", "Sedán", "Hatchback", "Camioneta"];
const transmisiones = ["Automático", "Manual"];
const ciudades = ["Bogotá", "Medellín", "Cali", "Barranquilla"];

export default function BuscarPage() {
  const [search, setSearch] = useState("");
  const [selectedMarca, setSelectedMarca] = useState("");
  const [selectedTipo, setSelectedTipo] = useState("");
  const [selectedTransmision, setSelectedTransmision] = useState("");
  const [selectedCiudad, setSelectedCiudad] = useState("");
  const [precioMax, setPrecioMax] = useState(200000000);
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
    const matchSearch =
      !search ||
      v.titulo.toLowerCase().includes(search.toLowerCase()) ||
      v.marca.toLowerCase().includes(search.toLowerCase());
    const matchMarca = !selectedMarca || v.marca === selectedMarca;
    const matchTipo = !selectedTipo || v.tipo === selectedTipo;
    const matchTransmision = !selectedTransmision || v.transmision === selectedTransmision;
    const matchCiudad = !selectedCiudad || v.ciudad === selectedCiudad;
    const matchPrecio = v.precio <= precioMax;
    return matchSearch && matchMarca && matchTipo && matchTransmision && matchCiudad && matchPrecio;
  }));

  // Si hay búsqueda IA, filtrar por los IDs que devolvió la IA
  const filtered = iaIds
    ? vehicles.filter((v) => iaIds.includes(v.id))
    : filteredNormal;

  function clearFilters() {
    setSelectedMarca(""); setSelectedTipo(""); setSelectedTransmision("");
    setSelectedCiudad(""); setPrecioMax(200000000); setSearch("");
  }

  const hasFilters = selectedMarca || selectedTipo || selectedTransmision || selectedCiudad;

  const FilterPanel = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-[16px] font-bold text-[#111418]">Filtros</h3>
        {hasFilters && (
          <button onClick={clearFilters} className="text-[13px] text-[#1978e5] font-semibold hover:underline">
            Limpiar todo
          </button>
        )}
      </div>

      {/* Marca */}
      <div>
        <p className="text-[13px] font-bold text-[#637488] uppercase tracking-wide mb-2">Marca</p>
        <div className="space-y-1.5">
          {marcas.map((m) => (
            <label key={m} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="marca"
                checked={selectedMarca === m}
                onChange={() => setSelectedMarca(selectedMarca === m ? "" : m)}
                className="w-4 h-4 accent-[#1978e5]"
              />
              <span className="text-[14px] text-[#637488] group-hover:text-[#111418]">{m}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Tipo */}
      <div>
        <p className="text-[13px] font-bold text-[#637488] uppercase tracking-wide mb-2">Tipo</p>
        <div className="flex flex-wrap gap-2">
          {tipos.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTipo(selectedTipo === t ? "" : t)}
              className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold border transition-colors ${
                selectedTipo === t
                  ? "bg-[#1978e5] text-white border-[#1978e5]"
                  : "border-[#dce0e5] text-[#637488] hover:border-[#1978e5] hover:text-[#1978e5]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Transmisión */}
      <div>
        <p className="text-[13px] font-bold text-[#637488] uppercase tracking-wide mb-2">Transmisión</p>
        <div className="flex gap-2">
          {transmisiones.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTransmision(selectedTransmision === t ? "" : t)}
              className={`flex-1 py-2 rounded-lg text-[13px] font-semibold border transition-colors ${
                selectedTransmision === t
                  ? "bg-[#1978e5] text-white border-[#1978e5]"
                  : "border-[#dce0e5] text-[#637488] hover:border-[#1978e5]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Ciudad */}
      <div>
        <p className="text-[13px] font-bold text-[#637488] uppercase tracking-wide mb-2">Ciudad</p>
        <div className="space-y-1.5">
          {ciudades.map((c) => (
            <label key={c} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="ciudad"
                checked={selectedCiudad === c}
                onChange={() => setSelectedCiudad(selectedCiudad === c ? "" : c)}
                className="w-4 h-4 accent-[#1978e5]"
              />
              <span className="text-[14px] text-[#637488] group-hover:text-[#111418]">{c}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Precio máximo */}
      <div>
        <p className="text-[13px] font-bold text-[#637488] uppercase tracking-wide mb-2">
          Precio máximo:{" "}
          <span className="text-[#111418]">
            {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(precioMax)}
          </span>
        </p>
        <input
          type="range"
          min={10000000}
          max={200000000}
          step={5000000}
          value={precioMax}
          onChange={(e) => setPrecioMax(Number(e.target.value))}
          className="w-full accent-[#1978e5]"
        />
        <div className="flex justify-between text-[11px] text-[#637488] mt-1">
          <span>$10M</span><span>$200M</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <MovelPageHeader />

      {/* ── BÚSQUEDA CON IA ── */}
      <div
        className="py-8 px-4"
        style={{ background: "linear-gradient(135deg, #0d1b2e 0%, #1565c0 70%, #1978e5 100%)" }}
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
              style={{ background: "linear-gradient(135deg, #42a5f5, #1978e5)" }}
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
        <div className="bg-white border-b border-[#dce0e5] py-4 sticky top-16 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-3">
            <div className="flex-1 flex items-center gap-3 bg-[#f0f2f4] rounded-xl h-12 px-4">
              <MagnifyingGlass size={18} color="#637488" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por marca, modelo..."
                className="flex-1 bg-transparent text-[15px] text-[#111418] placeholder-[#637488] outline-none"
              />
              {search && (
                <button onClick={() => setSearch("")}>
                  <X size={16} color="#637488" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center gap-2 px-4 h-12 bg-[#f0f2f4] rounded-xl text-[14px] font-semibold text-[#111418]"
            >
              <SlidersHorizontal size={18} />
              Filtros {hasFilters && <span className="w-2 h-2 bg-[#1978e5] rounded-full" />}
            </button>
          </div>
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
              <p className="text-[15px] text-[#637488]">
                {iaIds ? (
                  <>
                    <Sparkle size={14} color="#1978e5" className="inline mr-1" weight="fill" />
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
                  className="text-[14px] text-[#637488] bg-white border border-[#dce0e5] rounded-lg px-3 py-2 outline-none cursor-pointer"
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
                <p className="text-[14px] text-[#637488] mb-4">
                  {iaIds ? "La IA no encontró vehículos con esas características." : "Intenta ajustar los filtros"}
                </p>
                <button
                  onClick={iaIds ? clearIa : clearFilters}
                  className="px-6 py-2.5 text-white rounded-lg font-bold text-[14px]"
                  style={{ background: "linear-gradient(135deg, #1565c0, #1978e5)" }}
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
              style={{ background: "linear-gradient(135deg, #1565c0, #1978e5)" }}
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
