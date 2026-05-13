"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Tag, Car, Calendar, GasPump, Lightning, Users,
  Door, Gauge, Wrench, CheckCircle, Spinner, MagnifyingGlass,
  ShieldCheck, ArrowsClockwise,
} from "@phosphor-icons/react";

// ── Tipos ────────────────────────────────────────────────────────────────────

export interface FasecoldaSpecs {
  tipologia:          string;
  cilindraje:         number;
  combustible:        string;
  tipoCaja:           string;
  transmision:        string;
  potencia:           number;
  puertas:            number;
  capacidadPasajeros: number;
  traccion:           string;
  turbo:              boolean;
  importado:          string;
  clase:              string;
  airbags:            number;
  confianza:          string;
}

export interface FasecoldaSelectorOutput {
  marca:     string;
  linea:     string;    // referencia técnica Fasecolda
  ano:       string;
  avaluo:    number;
  specs:     FasecoldaSpecs | null;
}

interface Props {
  /** Callback cuando el usuario selecciona referencia + specs cargadas */
  onChange?: (output: FasecoldaSelectorOutput) => void;
  /** Marca pre-seleccionada desde el form padre */
  marcaInicial?: string;
  /** Año pre-seleccionado desde el form padre */
  anoInicial?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(n);
}

// ── Ficha técnica resultado ───────────────────────────────────────────────────

interface FichaProps {
  marca: string;
  linea: string;
  ano:   string;
  avaluo: number;
  specs: FasecoldaSpecs;
}

function FichaResultado({ marca, linea, ano, avaluo, specs }: FichaProps) {
  const grid = [
    { icon: <Gauge size={14} weight="fill" color="#1978e5" />,     label: "Cilindraje",    val: specs.cilindraje ? `${specs.cilindraje.toLocaleString("es-CO")} cm³` : "—" },
    { icon: <Users size={14} weight="fill" color="#7c3aed" />,     label: "Pasajeros",     val: specs.capacidadPasajeros || "—" },
    { icon: <GasPump size={14} weight="fill" color="#16a34a" />,   label: "Combustible",   val: specs.combustible || "—" },
    { icon: <Wrench size={14} weight="fill" color="#d97706" />,    label: "Transmisión",   val: specs.tipoCaja || "—" },
    { icon: <Lightning size={14} weight="fill" color="#dc2626" />, label: "Potencia",      val: specs.potencia ? `${specs.potencia} HP` : "—" },
    { icon: <Door size={14} weight="fill" color="#0891b2" />,      label: "Puertas",       val: specs.puertas || "—" },
    { icon: <ShieldCheck size={14} weight="fill" color="#059669" />,label: "Airbags",      val: specs.airbags ?? "—" },
    { icon: <Car size={14} weight="fill" color="#6366f1" />,       label: "Tracción",      val: specs.traccion || "—" },
  ];

  const confidenceColor =
    specs.confianza === "alta"   ? "text-green-700 bg-green-50 border-green-200" :
    specs.confianza === "media"  ? "text-amber-700 bg-amber-50 border-amber-200" :
                                   "text-[#637488] bg-[#f0f2f4] border-[#dce0e5]";

  return (
    <div className="rounded-2xl border border-[#dce0e5] bg-white overflow-hidden mt-4">
      {/* Header */}
      <div className="p-4 border-b border-[#f0f2f4] bg-[#f8f9fa]">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="bg-[#1978e5] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {specs.tipologia || "Vehículo"}
              </span>
              {specs.turbo && (
                <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-200">
                  TURBO
                </span>
              )}
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${confidenceColor}`}>
                Confianza {specs.confianza}
              </span>
            </div>
            <p className="text-[13px] font-black text-[#111418] leading-tight">
              {marca} — <span className="text-[#1978e5]">{ano}</span>
            </p>
            <p className="text-[11px] text-[#637488] mt-0.5 font-mono leading-snug">{linea}</p>
          </div>
          {avaluo > 0 && (
            <div className="text-right flex-shrink-0">
              <p className="text-[9px] font-bold text-[#637488] uppercase">Avalúo {ano}</p>
              <p className="text-[15px] font-black text-[#111418]">{fmt(avaluo)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Grid de specs */}
      <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {grid.map((g) => (
          <div key={g.label} className="bg-[#f8f9fa] rounded-xl p-2.5 border border-[#f0f2f4]">
            <div className="flex items-center gap-1 mb-1">
              {g.icon}
              <span className="text-[9px] font-bold uppercase tracking-wide text-[#637488]">{g.label}</span>
            </div>
            <p className="text-[12px] font-bold text-[#111418]">{String(g.val)}</p>
          </div>
        ))}
      </div>

      {/* Pie */}
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl">
          <CheckCircle size={15} color="#16a34a" weight="fill" className="flex-shrink-0" />
          <p className="text-[12px] text-green-800">
            <strong>Referencia técnica vinculada.</strong> Los datos se han auto-completado en el formulario.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────

export function FasecoldaSelector({ onChange, marcaInicial = "", anoInicial = "" }: Props) {
  const [allBrands,   setAllBrands]   = useState<string[]>([]);
  const [lineas,      setLineas]      = useState<{ linea: string; avaluo: Record<string, number> }[]>([]);
  const [years,       setYears]       = useState<string[]>([]);

  const [selMarca,    setSelMarca]    = useState(marcaInicial.toUpperCase());
  const [selAno,      setSelAno]      = useState(anoInicial);
  const [lineaSearch, setLineaSearch] = useState("");
  const [selLinea,    setSelLinea]    = useState<{ linea: string; avaluo: Record<string, number> } | null>(null);

  const [loadingLineas,  setLoadingLineas]  = useState(false);
  const [loadingSpecs,   setLoadingSpecs]   = useState(false);
  const [specs,          setSpecs]          = useState<FasecoldaSpecs | null>(null);
  const [showDropdown,   setShowDropdown]   = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectClass = "w-full h-11 bg-[#f0f2f4] rounded-xl px-3 text-[14px] text-[#111418] appearance-none outline-none border border-transparent focus:border-[#1978e5] focus:bg-white transition-colors disabled:opacity-40";
  const inputClass  = "w-full h-11 bg-[#f0f2f4] rounded-xl px-3 pr-9 text-[14px] text-[#111418] placeholder-[#637488] outline-none border border-transparent focus:border-[#1978e5] focus:bg-white transition-colors";

  // Cargar marcas al montar
  useEffect(() => {
    fetch("/api/catalog/brands")
      .then(r => r.json())
      .then(d => setAllBrands(d.todas ?? []));
  }, []);

  // Cargar líneas cuando cambia marca
  useEffect(() => {
    if (!selMarca) { setLineas([]); setYears([]); return; }
    setLoadingLineas(true);
    setSelLinea(null);
    setSpecs(null);
    setLineaSearch("");
    fetch(`/api/catalog/lines?brand=${encodeURIComponent(selMarca)}&limit=200`)
      .then(r => r.json())
      .then(d => {
        // d.lines sólo trae nombres, pero necesito avaluo también
        // Usamos otro endpoint que devuelve todo
        return fetch(`/api/catalog/lines?brand=${encodeURIComponent(selMarca)}&limit=200&full=1`);
      })
      .then(r => r.json())
      .then(d => {
        const ls = d.full ?? d.lines?.map((l: string) => ({ linea: l, avaluo: {} })) ?? [];
        setLineas(ls);
        // Calcular años disponibles de todas las líneas
        const yearSet = new Set<string>();
        ls.forEach((l: { avaluo: Record<string, number> }) =>
          Object.keys(l.avaluo || {}).forEach(y => yearSet.add(y))
        );
        const sortedYears = Array.from(yearSet).sort((a, b) => Number(b) - Number(a));
        setYears(sortedYears);
        if (anoInicial && yearSet.has(anoInicial)) setSelAno(anoInicial);
        else if (sortedYears.length) setSelAno(sortedYears[0]);
      })
      .finally(() => setLoadingLineas(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selMarca]);

  // Líneas filtradas según búsqueda y año
  const lineasFiltradas = lineas.filter(l => {
    const matchSearch = !lineaSearch || l.linea.toUpperCase().includes(lineaSearch.toUpperCase());
    const matchYear   = !selAno || (l.avaluo && l.avaluo[selAno] !== undefined);
    return matchSearch && matchYear;
  }).slice(0, 50);

  // Enriquecer con AI cuando se selecciona una línea
  const enrichLine = useCallback(async (l: { linea: string; avaluo: Record<string, number> }) => {
    setSelLinea(l);
    setSpecs(null);
    setShowDropdown(false);
    if (!selMarca || !l.linea) return;

    const avaluo = selAno && l.avaluo ? (l.avaluo[selAno] ?? 0) : 0;
    setLoadingSpecs(true);
    try {
      const res = await fetch("/api/fasecolda/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ marca: selMarca, linea: l.linea, ano: selAno }),
      });
      const json = await res.json();
      if (json.ok) {
        setSpecs(json.specs);
        onChange?.({
          marca:  selMarca,
          linea:  l.linea,
          ano:    selAno,
          avaluo,
          specs:  json.specs,
        });
      }
    } finally {
      setLoadingSpecs(false);
    }
  }, [selMarca, selAno, onChange]);

  // Cerrar dropdown al click fuera
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-[#dce0e5] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-[#f0f2f4] flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#e8f0fd] flex items-center justify-center flex-shrink-0">
              <Tag size={15} color="#1978e5" weight="fill" />
            </div>
            <div>
              <h3 className="text-[14px] font-bold text-[#111418]">Referencia técnica Fasecolda</h3>
              <p className="text-[11px] text-[#637488]">
                164 marcas · +4.200 referencias oficiales · Datos verificados
              </p>
            </div>
          </div>
          {loadingLineas && (
            <span className="flex items-center gap-1.5 text-[11px] text-[#1978e5]">
              <Spinner size={12} className="animate-spin" />Cargando referencias…
            </span>
          )}
        </div>

        <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">

          {/* Marca */}
          <div>
            <label className="text-[11px] font-bold text-[#637488] uppercase tracking-wide mb-1.5 flex items-center gap-1 block">
              <Car size={10} />Marca
            </label>
            <select
              value={selMarca}
              onChange={e => setSelMarca(e.target.value)}
              className={selectClass}
            >
              <option value="">Seleccionar marca</option>
              {allBrands.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          {/* Año */}
          <div>
            <label className="text-[11px] font-bold text-[#637488] uppercase tracking-wide mb-1.5 flex items-center gap-1 block">
              <Calendar size={10} />Año modelo
            </label>
            <select
              value={selAno}
              onChange={e => { setSelAno(e.target.value); setSelLinea(null); setSpecs(null); }}
              disabled={!years.length}
              className={selectClass}
            >
              <option value="">Todos los años</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          {/* Referencia / línea — autocomplete con dropdown */}
          <div className="sm:col-span-1 relative" ref={dropdownRef}>
            <label className="text-[11px] font-bold text-[#637488] uppercase tracking-wide mb-1.5 flex items-center gap-1 block">
              <ArrowsClockwise size={10} />Referencia
              {lineasFiltradas.length > 0 && !selLinea && (
                <span className="ml-auto normal-case font-medium text-[#637488]">
                  {lineasFiltradas.length} disponibles
                </span>
              )}
            </label>
            <div className="relative">
              <input
                ref={searchRef}
                type="text"
                value={selLinea ? selLinea.linea : lineaSearch}
                onChange={e => {
                  if (selLinea) { setSelLinea(null); setSpecs(null); }
                  setLineaSearch(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                disabled={!selMarca}
                placeholder={selMarca ? "Buscar referencia…" : "Selecciona marca primero"}
                className={inputClass}
              />
              <MagnifyingGlass
                size={15}
                color="#637488"
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
              />
            </div>

            {/* Dropdown */}
            {showDropdown && selMarca && lineasFiltradas.length > 0 && (
              <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-white border border-[#dce0e5] rounded-xl shadow-xl max-h-64 overflow-y-auto">
                {lineasFiltradas.map((l) => {
                  const avaluo = selAno ? l.avaluo?.[selAno] : 0;
                  return (
                    <button
                      key={l.linea}
                      type="button"
                      onClick={() => enrichLine(l)}
                      className="w-full text-left px-3 py-2.5 hover:bg-[#e8f0fd] transition-colors border-b border-[#f0f2f4] last:border-0"
                    >
                      <p className="text-[12px] font-bold text-[#111418] font-mono leading-tight">{l.linea}</p>
                      {avaluo > 0 && (
                        <p className="text-[11px] text-[#637488] mt-0.5">
                          Avalúo {selAno}: <span className="font-semibold text-[#1978e5]">{fmt(avaluo)}</span>
                        </p>
                      )}
                    </button>
                  );
                })}
                {lineasFiltradas.length === 50 && (
                  <p className="px-3 py-2 text-[11px] text-[#637488] bg-[#f8f9fa]">
                    Mostrando 50 de {lineas.length} — escribe más para filtrar
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Cargando specs */}
        {loadingSpecs && (
          <div className="px-4 pb-4 flex items-center gap-2">
            <Spinner size={15} className="animate-spin text-[#1978e5]" />
            <span className="text-[13px] text-[#637488]">
              Analizando referencia técnica con IA…
            </span>
          </div>
        )}
      </div>

      {/* Ficha resultado */}
      {selLinea && specs && !loadingSpecs && (
        <FichaResultado
          marca={selMarca}
          linea={selLinea.linea}
          ano={selAno}
          avaluo={selAno ? (selLinea.avaluo?.[selAno] ?? 0) : 0}
          specs={specs}
        />
      )}
    </div>
  );
}
