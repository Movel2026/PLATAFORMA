"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MagnifyingGlass, SlidersHorizontal, X, ShieldCheck } from "@phosphor-icons/react";
import { vehicles as mockVehicles, Vehicle } from "@/lib/mock-data";
import VehicleCard from "@/components/VehicleCard";
import BottomNav from "@/components/BottomNav";
import { fuzzyMatch } from "@/lib/fuzzy-search";

const marcas = ["Toyota", "Mazda", "Chevrolet", "Kia", "Renault", "Hyundai", "Nissan", "Ford", "Honda", "Mitsubishi"];
const tipos = ["Sedán", "Hatchback", "SUV / Camioneta", "Pick-up", "Coupé", "Convertible"];
const transmisiones = ["Automático", "Manual"];
const ciudades = ["Bogotá", "Medellín", "Cali", "Barranquilla"];
const combustibles = ["Gasolina", "Híbrido", "Diésel", "Eléctrico", "Mild Hybrid", "Gasolina y gas"];

const YEAR_NOW = new Date().getFullYear();
// Lista de años de 2027 a 1990 (los más recientes primero)
const yearList = Array.from({ length: YEAR_NOW + 2 - 1989 }, (_, i) => YEAR_NOW + 2 - i);

const ultimoDigitoPlaca = (id: string): number => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(hash) % 10;
};

const fmtCOP = (n: number) => new Intl.NumberFormat("es-CO", {
  style: "currency", currency: "COP", minimumFractionDigits: 0, maximumFractionDigits: 0,
}).format(n);

const parseNum = (s: string): number => {
  const n = Number(s.replace(/\D/g, ""));
  return isFinite(n) ? n : 0;
};

// ───────────────────────────────────────────────────────────────────────
function BuscarContent() {
  const router = useRouter();
  const params = useSearchParams();

  // Estado inicial leído de la URL (carrocerías y marcas pueden venir desde la home)
  const [search, setSearch]                       = useState(params.get("q") || "");
  const [selectedMarca, setSelectedMarca]         = useState(params.get("marca") || "");
  const [selectedModelo, setSelectedModelo]       = useState(params.get("modelo") || "");
  const [selectedTipo, setSelectedTipo]           = useState(params.get("tipo") || "");
  const [selectedTransmision, setSelectedTransmision] = useState(params.get("transmision") || "");
  const [selectedCiudad, setSelectedCiudad]       = useState(params.get("ciudad") || "");
  const [selectedCombustible, setSelectedCombustible] = useState<string[]>([]);
  const [selectedDigitos, setSelectedDigitos]     = useState<number[]>([]);

  // Modo año: "rango" o "unico"
  const [anoMode, setAnoMode]   = useState<"rango" | "unico">("rango");
  const [anoMin, setAnoMin]     = useState<string>("");
  const [anoMax, setAnoMax]     = useState<string>("");
  const [anoUnico, setAnoUnico] = useState<string>("");

  const [precioMin, setPrecioMin] = useState<string>("");
  const [precioMax, setPrecioMax] = useState<string>(params.get("precioMax") || "");
  const [kmMin, setKmMin] = useState<string>("");
  const [kmMax, setKmMax] = useState<string>("");

  const [soloVerificados, setSoloVerificados] = useState(params.get("verificados") === "1");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [ordenar, setOrdenar] = useState("recientes");

  // Sincronizar cambios de URL externos
  useEffect(() => {
    if (params.get("marca") && params.get("marca") !== selectedMarca) {
      setSelectedMarca(params.get("marca") || "");
    }
    if (params.get("tipo") && params.get("tipo") !== selectedTipo) {
      setSelectedTipo(params.get("tipo") || "");
    }
    if (params.get("q") && params.get("q") !== search) {
      setSearch(params.get("q") || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  // ── Vehículos: mock + publicaciones activas de Supabase ──
  const [publicados, setPublicados] = useState<Vehicle[]>([]);
  useEffect(() => {
    fetch("/api/vehiculos")
      .then((r) => r.ok ? r.json() : { vehicles: [] })
      .then((d) => setPublicados(d.vehicles || []))
      .catch(() => setPublicados([]));
  }, []);
  const vehicles = [...publicados, ...mockVehicles];

  // ── Ordenamiento ──
  function sortVehicles(list: typeof vehicles) {
    const sorted = [...list];
    if (ordenar === "precio-asc")  sorted.sort((a, b) => a.precio - b.precio);
    else if (ordenar === "precio-desc") sorted.sort((a, b) => b.precio - a.precio);
    else if (ordenar === "km-asc")      sorted.sort((a, b) => parseInt(a.kilometraje) - parseInt(b.kilometraje));
    else if (ordenar === "año-desc")    sorted.sort((a, b) => b.año - a.año);
    return sorted;
  }

  // Parsear valores numéricos solo cuando filtramos
  const precioMinN = parseNum(precioMin);
  const precioMaxN = parseNum(precioMax);
  const kmMinN     = parseNum(kmMin);
  const kmMaxN     = parseNum(kmMax);
  const anoMinN    = parseInt(anoMin)   || 0;
  const anoMaxN    = parseInt(anoMax)   || 0;
  const anoUnicoN  = parseInt(anoUnico) || 0;

  const filtered = sortVehicles(vehicles.filter((v) => {
    const km = parseInt(v.kilometraje.replace(/\D/g, "")) || 0;
    const dig = ultimoDigitoPlaca(v.id);
    // Búsqueda fuzzy: tolera typos, normaliza tildes/separadores
    // Ej: "cx30" → CX-30, "chvrolet" → Chevrolet, "mazdá" → Mazda
    const haystack = `${v.titulo} ${v.marca} ${v.modelo} ${v.tipo} ${v.ciudad} ${v.año}`;
    const matchSearch = !search || fuzzyMatch(search, haystack);
    const matchMarca       = !selectedMarca || v.marca === selectedMarca;
    const matchModelo      = !selectedModelo || v.modelo === selectedModelo;
    const matchTipo        = !selectedTipo  || v.tipo === selectedTipo ||
      (selectedTipo === "SUV / Camioneta" && (v.tipo === "SUV" || v.tipo === "Camioneta"));
    const matchTransmision = !selectedTransmision || v.transmision === selectedTransmision;
    const matchCiudad      = !selectedCiudad || v.ciudad === selectedCiudad;
    const matchCombustible = selectedCombustible.length === 0 || selectedCombustible.includes(v.combustible);
    const matchDigitos     = selectedDigitos.length === 0 || selectedDigitos.includes(dig);
    const matchPrecioMin   = !precioMinN || v.precio >= precioMinN;
    const matchPrecioMax   = !precioMaxN || v.precio <= precioMaxN;
    const matchAno         = anoMode === "unico"
      ? (!anoUnicoN || v.año === anoUnicoN)
      : ((!anoMinN || v.año >= anoMinN) && (!anoMaxN || v.año <= anoMaxN));
    const matchKmMin       = !kmMinN || km >= kmMinN;
    const matchKmMax       = !kmMaxN || km <= kmMaxN;
    const matchVerificado  = !soloVerificados || v.verificado_movel === true;
    return (
      matchSearch && matchMarca && matchModelo && matchTipo && matchTransmision && matchCiudad &&
      matchCombustible && matchDigitos &&
      matchPrecioMin && matchPrecioMax && matchAno && matchKmMin && matchKmMax && matchVerificado
    );
  }));

  // Modelos disponibles según marca seleccionada (o todos si no hay marca)
  const modelosDisponibles = Array.from(new Set(
    vehicles
      .filter((v) => !selectedMarca || v.marca === selectedMarca)
      .map((v) => v.modelo)
      .filter(Boolean)
  )).sort();

  // Si la marca cambia y el modelo seleccionado ya no aplica, limpiarlo
  useEffect(() => {
    if (selectedModelo && !modelosDisponibles.includes(selectedModelo)) {
      setSelectedModelo("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMarca]);

  function clearFilters() {
    setSelectedMarca(""); setSelectedModelo(""); setSelectedTipo(""); setSelectedTransmision("");
    setSelectedCiudad(""); setSelectedCombustible([]); setSelectedDigitos([]);
    setPrecioMin(""); setPrecioMax("");
    setAnoMin(""); setAnoMax(""); setAnoUnico("");
    setKmMin(""); setKmMax("");
    setSearch(""); setSoloVerificados(false);
    router.replace("/buscar");
  }

  const toggleArr = <T extends string | number>(arr: T[], v: T): T[] =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  const hasFilters = !!(
    selectedMarca || selectedModelo || selectedTipo || selectedTransmision || selectedCiudad ||
    selectedCombustible.length || selectedDigitos.length || soloVerificados ||
    precioMin || precioMax || anoMin || anoMax || anoUnico || kmMin || kmMax
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa]">

      {/* ── Header de búsqueda principal ── */}
      <div className="bg-movel-gradient-dark py-7 px-4 border-b border-movel-400/15">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-[26px] md:text-[32px] text-white mb-4 leading-tight">
            Encuentra tu próximo carro
          </h1>
          <div className="bg-white rounded-2xl p-2 flex gap-2 shadow-xl">
            <div className="flex-1 flex items-center gap-3 bg-cloud rounded-xl px-4 py-3">
              <MagnifyingGlass size={18} color="#7A8195" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Marca, modelo, ciudad..."
                className="flex-1 bg-transparent text-ink text-[14px] outline-none placeholder-mute"
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-mute hover:text-ink">
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div className="bg-white border-b border-[#dce0e5] py-3 px-4 sticky top-[68px] z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <p className="text-[14px] text-mute">
            <strong className="text-ink">{filtered.length}</strong> {filtered.length === 1 ? "vehículo" : "vehículos"} encontrados
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="md:hidden flex items-center gap-2 px-3 py-2 rounded-xl border border-[#dce0e5] text-[13px] font-semibold text-ink"
            >
              <SlidersHorizontal size={16} />
              Filtros
              {hasFilters && <span className="w-2 h-2 rounded-full bg-movel-500" />}
            </button>
            <select
              value={ordenar}
              onChange={(e) => setOrdenar(e.target.value)}
              className="px-3 py-2 rounded-xl border border-[#dce0e5] text-[13px] font-semibold text-ink bg-white outline-none focus:border-movel-900"
            >
              <option value="recientes">Más recientes</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
              <option value="km-asc">Kilometraje: menor a mayor</option>
              <option value="año-desc">Año: más nuevos</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Layout 2 columnas: filtros + resultados ── */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">

          {/* ── Filtros desktop ── */}
          <aside className="hidden md:block bg-white rounded-2xl p-5 border border-[#dce0e5] h-fit sticky top-[140px]">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-[18px] text-movel-900">Filtros</h3>
                {hasFilters && (
                  <button onClick={clearFilters} className="text-[12px] text-movel-600 font-bold hover:underline">
                    Limpiar todo
                  </button>
                )}
              </div>

              {/* Verificados MOVEL */}
              <button
                onClick={() => setSoloVerificados(!soloVerificados)}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border-2 font-bold text-[13px] transition-all ${
                  soloVerificados
                    ? "border-movel-900 text-white"
                    : "border-[#dce0e5] text-mute hover:border-movel-300"
                }`}
                style={soloVerificados ? { background: "linear-gradient(135deg,#0B1E4E,#1565c0)" } : {}}
              >
                <ShieldCheck size={16} weight={soloVerificados ? "fill" : "regular"} color={soloVerificados ? "white" : "#1565c0"} />
                Solo verificados <span className={soloVerificados ? "text-white/80" : "text-movel-600"}>MOVEL</span>
              </button>

              {/* Marca */}
              <div>
                <p className="text-[12px] font-bold text-ink uppercase tracking-[0.1em] mb-2.5">Marca</p>
                <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
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

              {/* Modelo (dinámico según marca + publicaciones reales) */}
              {modelosDisponibles.length > 0 && (
                <div>
                  <p className="text-[12px] font-bold text-ink uppercase tracking-[0.1em] mb-2.5">Modelo</p>
                  <select
                    value={selectedModelo}
                    onChange={(e) => setSelectedModelo(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#dce0e5] text-[13px] text-ink bg-white focus:outline-none focus:border-movel-900"
                  >
                    <option value="">Todos los modelos</option>
                    {modelosDisponibles.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Tipo */}
              <div>
                <p className="text-[12px] font-bold text-ink uppercase tracking-[0.1em] mb-2.5">Tipo</p>
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

              {/* Combustible */}
              <div>
                <p className="text-[12px] font-bold text-ink uppercase tracking-[0.1em] mb-2.5">Tipo de combustible</p>
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

              {/* Año (rango / único) */}
              <div>
                <p className="text-[12px] font-bold text-ink uppercase tracking-[0.1em] mb-2.5">Año</p>

                <div className="flex gap-1 mb-2 bg-cloud rounded-lg p-1">
                  <button
                    onClick={() => setAnoMode("rango")}
                    className={`flex-1 py-1.5 text-[12px] font-bold rounded-md transition-all ${
                      anoMode === "rango" ? "bg-white text-movel-900 shadow-sm" : "text-mute"
                    }`}
                  >
                    Rango
                  </button>
                  <button
                    onClick={() => setAnoMode("unico")}
                    className={`flex-1 py-1.5 text-[12px] font-bold rounded-md transition-all ${
                      anoMode === "unico" ? "bg-white text-movel-900 shadow-sm" : "text-mute"
                    }`}
                  >
                    Solo 1 año
                  </button>
                </div>

                {anoMode === "rango" ? (
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={anoMin}
                      onChange={(e) => setAnoMin(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#dce0e5] text-[13px] text-ink bg-white focus:outline-none focus:border-movel-900"
                    >
                      <option value="">Desde</option>
                      {yearList.map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                    <select
                      value={anoMax}
                      onChange={(e) => setAnoMax(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[#dce0e5] text-[13px] text-ink bg-white focus:outline-none focus:border-movel-900"
                    >
                      <option value="">Hasta</option>
                      {yearList.map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                ) : (
                  <select
                    value={anoUnico}
                    onChange={(e) => setAnoUnico(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#dce0e5] text-[13px] text-ink bg-white focus:outline-none focus:border-movel-900"
                  >
                    <option value="">Selecciona un año</option>
                    {yearList.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                )}
              </div>

              {/* Precio (rango) */}
              <div>
                <p className="text-[12px] font-bold text-ink uppercase tracking-[0.1em] mb-2.5">Precio (COP)</p>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={precioMin ? new Intl.NumberFormat("es-CO").format(parseNum(precioMin)) : ""}
                    onChange={(e) => setPrecioMin(e.target.value)}
                    placeholder="Mínimo"
                    className="w-full px-3 py-2 rounded-lg border border-[#dce0e5] text-[13px] text-ink bg-white focus:outline-none focus:border-movel-900"
                  />
                  <input
                    type="text"
                    inputMode="numeric"
                    value={precioMax ? new Intl.NumberFormat("es-CO").format(parseNum(precioMax)) : ""}
                    onChange={(e) => setPrecioMax(e.target.value)}
                    placeholder="Máximo"
                    className="w-full px-3 py-2 rounded-lg border border-[#dce0e5] text-[13px] text-ink bg-white focus:outline-none focus:border-movel-900"
                  />
                </div>
                {(precioMinN || precioMaxN) && (
                  <p className="text-[11px] text-mute mt-1.5">
                    {precioMinN ? fmtCOP(precioMinN) : "$0"} — {precioMaxN ? fmtCOP(precioMaxN) : "Sin tope"}
                  </p>
                )}
              </div>

              {/* Kilometraje (rango) */}
              <div>
                <p className="text-[12px] font-bold text-ink uppercase tracking-[0.1em] mb-2.5">Kilometraje</p>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={kmMin ? new Intl.NumberFormat("es-CO").format(parseNum(kmMin)) : ""}
                    onChange={(e) => setKmMin(e.target.value)}
                    placeholder="Mín km"
                    className="w-full px-3 py-2 rounded-lg border border-[#dce0e5] text-[13px] text-ink bg-white focus:outline-none focus:border-movel-900"
                  />
                  <input
                    type="text"
                    inputMode="numeric"
                    value={kmMax ? new Intl.NumberFormat("es-CO").format(parseNum(kmMax)) : ""}
                    onChange={(e) => setKmMax(e.target.value)}
                    placeholder="Máx km"
                    className="w-full px-3 py-2 rounded-lg border border-[#dce0e5] text-[13px] text-ink bg-white focus:outline-none focus:border-movel-900"
                  />
                </div>
              </div>

              {/* Último dígito de placa */}
              <div>
                <p className="text-[12px] font-bold text-ink uppercase tracking-[0.1em] mb-2.5">Último dígito de placa</p>
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
                <p className="text-[12px] font-bold text-ink uppercase tracking-[0.1em] mb-2.5">Transmisión</p>
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
                <p className="text-[12px] font-bold text-ink uppercase tracking-[0.1em] mb-2.5">Ciudad</p>
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
          </aside>

          {/* ── Resultados ── */}
          <main>
            {filtered.length === 0 ? (
              <div className="bg-white rounded-2xl border border-[#dce0e5] p-12 text-center">
                <p className="font-display text-[20px] text-movel-900 mb-2">Sin resultados</p>
                <p className="text-[14px] text-mute mb-4">No encontramos vehículos con esos filtros.</p>
                {hasFilters && (
                  <button onClick={clearFilters} className="btn-primary text-[14px] !py-2.5 !px-5">
                    Limpiar filtros
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((v) => (
                  <VehicleCard key={v.id} vehicle={v} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ── Drawer filtros mobile ── */}
      {showMobileFilters && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-[88%] max-w-sm bg-white overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-[#dce0e5] px-4 py-3 flex items-center justify-between">
              <h3 className="font-display text-[18px] text-movel-900">Filtros</h3>
              <button onClick={() => setShowMobileFilters(false)} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-cloud">
                <X size={20} color="#15171D" />
              </button>
            </div>
            <div className="p-4">
              {/* Reutiliza la misma sidebar — se le redirige al usuario */}
              <p className="text-[13px] text-mute mb-3">Usa los filtros y se aplican automáticamente.</p>
              <button
                onClick={() => setSoloVerificados(!soloVerificados)}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border-2 font-bold text-[13px] transition-all mb-4 ${
                  soloVerificados ? "border-movel-900 text-white" : "border-[#dce0e5] text-mute"
                }`}
                style={soloVerificados ? { background: "linear-gradient(135deg,#0B1E4E,#1565c0)" } : {}}
              >
                <ShieldCheck size={16} weight={soloVerificados ? "fill" : "regular"} color={soloVerificados ? "white" : "#1565c0"} />
                Solo verificados <span className={soloVerificados ? "text-white/80" : "text-movel-600"}>MOVEL</span>
              </button>
              {hasFilters && (
                <button onClick={() => { clearFilters(); setShowMobileFilters(false); }} className="w-full mb-4 py-2.5 border-2 border-movel-900 text-movel-900 font-bold rounded-xl text-[13px]">
                  Limpiar todo
                </button>
              )}
              <button onClick={() => setShowMobileFilters(false)} className="w-full btn-primary text-[14px]">
                Ver {filtered.length} resultados
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

// Wrapper para Suspense (useSearchParams lo necesita en Next.js 14)
export default function BuscarPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-mute">Cargando…</div>}>
      <BuscarContent />
    </Suspense>
  );
}
