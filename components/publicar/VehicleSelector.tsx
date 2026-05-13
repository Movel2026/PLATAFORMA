"use client";

/**
 * VehicleSelector — Selector jerárquico oficial Ministerio de Transporte 2026
 *
 * Flujo: TIPO (carrocería) → MARCA → REFERENCIA
 * Cada paso filtra el siguiente.
 * Al seleccionar una referencia emite { tipo, marca, referencia, cilindraje, pasajeros }
 */

import { useEffect, useState } from "react";
import { CarProfile, MagnifyingGlass, CheckCircle } from "@phosphor-icons/react";

// ── Tipos ─────────────────────────────────────────────────────────────────

export interface VehicleSelection {
  tipo:        string;      // "AUTOMOVILES"
  tipoLabel:   string;      // "Automóvil"
  marca:       string;      // "ACURA"
  referencia:  string;      // "INTEGRA 1.8 2P MT"
  cilindraje:  number | null;
  pasajeros:   number | null;
  tonelaje:    number | null;
}

interface Props {
  /** Marca inicial (si viene del selector de marca anterior) */
  initialMarca?: string;
  onChange?: (sel: VehicleSelection | null) => void;
}

interface TipoOption   { id: string; label: string }
interface RefOption    { ref: string; cil: number | null; pas: number | null; ton: number | null }

// ── Helpers ───────────────────────────────────────────────────────────────

async function apiFetch<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json() as Promise<T>;
}

// ── Componente ────────────────────────────────────────────────────────────

export function VehicleSelector({ initialMarca = "", onChange }: Props) {
  const [tipos,    setTipos]    = useState<TipoOption[]>([]);
  const [marcas,   setMarcas]   = useState<string[]>([]);
  const [refs,     setRefs]     = useState<RefOption[]>([]);

  const [tipo,     setTipo]     = useState("");
  const [marca,    setMarca]    = useState(initialMarca.toUpperCase());
  const [ref,      setRef]      = useState("");
  const [refQuery, setRefQuery] = useState("");

  const [loadMarcas, setLoadMarcas] = useState(false);
  const [loadRefs,   setLoadRefs]   = useState(false);

  // Cargar tipos al montar
  useEffect(() => {
    apiFetch<{ tipos: TipoOption[] }>("/api/vehicledb?action=tipos")
      .then((r) => setTipos(r.tipos))
      .catch(console.error);
  }, []);

  // Cargar marcas cuando cambia el tipo
  useEffect(() => {
    if (!tipo) { setMarcas([]); setMarca(""); return; }
    setLoadMarcas(true);
    setMarca("");
    setRef("");
    setRefs([]);
    apiFetch<{ marcas: string[] }>(`/api/vehicledb?action=marcas&tipo=${encodeURIComponent(tipo)}`)
      .then((r) => setMarcas(r.marcas))
      .catch(console.error)
      .finally(() => setLoadMarcas(false));
  }, [tipo]);

  // Cargar referencias cuando cambia marca
  useEffect(() => {
    if (!tipo || !marca) { setRefs([]); setRef(""); return; }
    setLoadRefs(true);
    setRef("");
    setRefQuery("");
    apiFetch<{ refs: RefOption[] }>(
      `/api/vehicledb?action=refs&tipo=${encodeURIComponent(tipo)}&marca=${encodeURIComponent(marca)}&limit=300`,
    )
      .then((r) => setRefs(r.refs))
      .catch(console.error)
      .finally(() => setLoadRefs(false));
  }, [tipo, marca]);

  // Emitir selección cuando cambia la referencia
  useEffect(() => {
    if (!tipo || !marca || !ref) { onChange?.(null); return; }
    const found = refs.find((r) => r.ref === ref);
    const tipoLabel = tipos.find((t) => t.id === tipo)?.label ?? tipo;
    onChange?.({
      tipo, tipoLabel, marca, referencia: ref,
      cilindraje: found?.cil ?? null,
      pasajeros:  found?.pas ?? null,
      tonelaje:   found?.ton ?? null,
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  // Filtrar refs por búsqueda local
  const filteredRefs = refQuery
    ? refs.filter((r) => r.ref.toUpperCase().includes(refQuery.toUpperCase()))
    : refs;

  const selectCls =
    "w-full h-11 rounded-xl border border-[#dce0e5] bg-white px-3 text-[13px] text-[#111418] outline-none focus:border-[#1978e5] focus:ring-2 focus:ring-[#1978e5]/20 appearance-none transition-all disabled:opacity-50";

  return (
    <div className="space-y-3">
      {/* ── TIPO ── */}
      <div>
        <label className="block text-[12px] font-semibold text-[#374151] mb-1.5 uppercase tracking-wide">
          Tipo de vehículo
        </label>
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className={selectCls}
        >
          <option value="">— Selecciona el tipo —</option>
          {tipos.map((t) => (
            <option key={t.id} value={t.id}>{t.label}</option>
          ))}
        </select>
      </div>

      {/* ── MARCA ── */}
      <div>
        <label className="block text-[12px] font-semibold text-[#374151] mb-1.5 uppercase tracking-wide">
          Marca
        </label>
        <select
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
          disabled={!tipo || loadMarcas}
          className={selectCls}
        >
          <option value="">
            {loadMarcas ? "Cargando marcas…" : tipo ? "— Selecciona la marca —" : "— Primero elige el tipo —"}
          </option>
          {marcas.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {/* ── BÚSQUEDA DE REFERENCIA ── */}
      {marca && refs.length > 10 && (
        <div className="relative">
          <MagnifyingGlass size={14} color="#9ca3af" className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={refQuery}
            onChange={(e) => setRefQuery(e.target.value)}
            placeholder="Buscar referencia…"
            className="w-full h-9 pl-8 pr-3 rounded-lg border border-[#dce0e5] bg-[#f8f9fa] text-[12px] text-[#111418] outline-none focus:border-[#1978e5] transition-all"
          />
        </div>
      )}

      {/* ── REFERENCIA ── */}
      <div>
        <label className="block text-[12px] font-semibold text-[#374151] mb-1.5 uppercase tracking-wide">
          Referencia / Versión
          {!loadRefs && refs.length > 0 && (
            <span className="ml-1.5 text-[#9ca3af] font-normal normal-case">
              ({filteredRefs.length} opciones)
            </span>
          )}
        </label>
        <select
          value={ref}
          onChange={(e) => setRef(e.target.value)}
          disabled={!marca || loadRefs}
          className={selectCls}
        >
          <option value="">
            {loadRefs ? "Cargando referencias…" : marca ? "— Selecciona la referencia —" : "— Primero elige la marca —"}
          </option>
          {filteredRefs.map((r) => (
            <option key={r.ref} value={r.ref}>
              {r.ref}{r.cil ? ` · ${r.cil}cc` : ""}
            </option>
          ))}
        </select>
      </div>

      {/* ── Ficha resumida ── */}
      {ref && (() => {
        const found = refs.find((r) => r.ref === ref);
        if (!found) return null;
        const tipoLabel = tipos.find((t) => t.id === tipo)?.label ?? tipo;
        return (
          <div className="mt-1 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 bg-[#e8f0fd] text-[#1978e5] text-[11px] font-bold px-2.5 py-1 rounded-full">
              <CarProfile size={11} weight="fill" /> {tipoLabel}
            </span>
            {found.cil && (
              <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-[11px] font-bold px-2.5 py-1 rounded-full">
                <CheckCircle size={11} weight="fill" /> {found.cil} cc
              </span>
            )}
            {found.pas && (
              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-[11px] font-bold px-2.5 py-1 rounded-full">
                {found.pas} pasajeros
              </span>
            )}
            {found.ton && (
              <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-700 text-[11px] font-bold px-2.5 py-1 rounded-full">
                {found.ton}t carga
              </span>
            )}
          </div>
        );
      })()}
    </div>
  );
}
