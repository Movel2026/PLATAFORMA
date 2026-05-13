"use client";

import { useEffect, useRef, useState } from "react";
import {
  Lightning, Gauge, Gear, Flame, Car, Users,
  CheckCircle, PencilSimple, Sparkle, X, Warning,
} from "@phosphor-icons/react";
import { getEspecificaciones, getVersiones, getModelosConSpecs, EspecificacionesTecnicas } from "@/lib/specs-data";

// ── Tipos públicos ────────────────────────────────────────────────────────

/** Valores que el componente emite hacia el formulario padre */
export interface SpecsOutput {
  motor: string;
  combustible: string;
  transmision: string;
  potencia: string;
  carroceria: string;
  pasajeros: string;
}

export interface EspecificacionesVehiculoProps {
  marca: string;
  modelo: string;
  /** Versión / referencia oficial (ej: "ONIX PLUS 1.0T AT") */
  version: string;
  /** Año del vehículo — útil para AI fallback */
  ano?: number | string;
  /**
   * Cilindraje oficial del Ministerio de Transporte (cc).
   * Si se pasa, se usa para enriquecer el campo motor y la búsqueda AI.
   */
  cilindraje?: number | null;
  /**
   * Llamado cuando se auto-completan o editan los datos.
   * Recibe el objeto EspecificacionesTecnicas completo (null si no hay datos) y
   * el subconjunto SpecsOutput listo para el formulario.
   */
  onOutputChange?: (specs: EspecificacionesTecnicas | null, output: SpecsOutput) => void;
  /** Llamado cuando se limpia el estado (sin marca / modelo / versión) */
  onCleared?: () => void;
}

// ── Constantes de selects editables ──────────────────────────────────────

const COMBUSTIBLES = [
  "Gasolina", "Diésel", "Híbrido", "Híbrido enchufable (PHEV)",
  "Eléctrico", "Gas Natural (GNV)",
];
const TRANSMISIONES = ["Automático", "Manual", "CVT", "Doble embrague (DCT)", "Secuencial"];
const CARROCERIAS   = ["Hatchback", "Sedán", "SUV", "Pickup / Camioneta", "Minivan", "Coupe", "Wagon"];

const EMPTY_OUTPUT: SpecsOutput = {
  motor: "", combustible: "", transmision: "", potencia: "", carroceria: "", pasajeros: "",
};

// ── Sub-componentes ───────────────────────────────────────────────────────

function SkeletonField() {
  return (
    <div className="p-3 rounded-xl border border-[#dce0e5] bg-[#f0f2f4]">
      <div className="flex items-center gap-1.5 mb-2">
        <div className="w-3 h-3 rounded bg-gray-300 animate-pulse" />
        <div className="w-16 h-2.5 rounded bg-gray-300 animate-pulse" />
      </div>
      <div className="w-3/4 h-4 rounded bg-gray-200 animate-pulse" />
    </div>
  );
}

interface SpecFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  loading: boolean;
  locked: boolean;
  type?: "text" | "select";
  options?: string[];
  onChange?: (val: string) => void;
}

function SpecField({ icon, label, value, loading, locked, type = "text", options = [], onChange }: SpecFieldProps) {
  if (loading) return <SkeletonField />;

  const base = "p-3 rounded-xl border transition-all";
  const cls  = locked
    ? `${base} bg-green-50/60 border-green-200`
    : `${base} bg-[#f8f9fa] border-[#dce0e5]`;

  const inputCls =
    "w-full h-9 bg-white rounded-lg px-3 text-[13px] text-[#111418] border border-[#dce0e5] outline-none focus:border-[#1978e5] appearance-none";

  return (
    <div className={cls}>
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className={locked ? "text-green-600" : "text-[#637488]"}>{icon}</span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#637488]">{label}</span>
        {locked && <CheckCircle size={11} color="#16a34a" weight="fill" className="ml-auto" />}
      </div>

      {locked ? (
        <p className="text-[13px] font-bold text-[#111418] leading-tight">{value || "—"}</p>
      ) : type === "select" ? (
        <select value={value} onChange={(e) => onChange?.(e.target.value)} className={inputCls}>
          <option value="">Seleccionar</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder="—"
          className={inputCls}
        />
      )}
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────

/**
 * Sección de especificaciones técnicas con auto-completado.
 * - Skeleton loader de 750 ms mientras "consulta" la base de datos.
 * - Campos read-only + ícono ✓ cuando hay datos.
 * - Campos editables cuando no hay datos o el usuario presiona "Editar".
 */
export function EspecificacionesVehiculo({
  marca, modelo, version, ano, cilindraje, onOutputChange, onCleared,
}: EspecificacionesVehiculoProps) {
  const [autoSpecs,  setAutoSpecs]  = useState<EspecificacionesTecnicas | null>(null);
  const [loading,    setLoading]    = useState(false);
  const [aiLoading,  setAiLoading]  = useState(false);
  const [aiSource,   setAiSource]   = useState<"db" | "db-fuzzy" | "ai" | null>(null);
  const [editMode,   setEditMode]   = useState(false);
  const [aiError,    setAiError]    = useState(false);
  const [output,     setOutput]     = useState<SpecsOutput>(EMPTY_OUTPUT);

  const cbRef = useRef({ onOutputChange, onCleared });
  cbRef.current = { onOutputChange, onCleared };

  // ── Búsqueda fuzzy en la base curada ────────────────────────────────────
  // Orden de intentos para modelos compuestos ("Spark GT" → "Spark", etc.):
  // 1. Versión exacta + modelo exacto
  // 2. Primera versión disponible + modelo exacto
  // 3. Primera versión + modelo base (primera palabra)
  // 4. Primera versión + modelo que contenga el nombre como substring
  function findInDB(
    m: string, mod: string, ver: string,
  ): { specs: EspecificacionesTecnicas; modeloUsado: string } | null {
    // Intento 1: versión explícita
    if (ver && ver !== "__otra__") {
      const s = getEspecificaciones(m, mod, ver);
      if (s) return { specs: s, modeloUsado: mod };
    }
    // Intento 2: primera versión del modelo exacto
    const vers = getVersiones(m, mod);
    if (vers.length > 0) {
      const s = getEspecificaciones(m, mod, vers[0]);
      if (s) return { specs: s, modeloUsado: mod };
    }
    // Intento 3: modelo base (primera palabra) — "Spark GT" → "Spark"
    const base = mod.split(" ")[0];
    if (base && base !== mod) {
      const bVers = getVersiones(m, base);
      if (bVers.length > 0) {
        const s = getEspecificaciones(m, base, bVers[0]);
        if (s) return { specs: s, modeloUsado: base };
      }
    }
    // Intento 4: búsqueda por substring entre modelos disponibles en la marca
    const available = getModelosConSpecs(m);
    for (const av of available) {
      if (mod.toUpperCase().includes(av.toUpperCase()) ||
          av.toUpperCase().includes(mod.toUpperCase())) {
        const avVers = getVersiones(m, av);
        if (avVers.length > 0) {
          const s = getEspecificaciones(m, av, avVers[0]);
          if (s) return { specs: s, modeloUsado: av };
        }
      }
    }
    return null;
  }

  useEffect(() => {
    const valid = marca && modelo;
    if (!valid) {
      setAutoSpecs(null); setLoading(false); setAiSource(null);
      setEditMode(false); setAiError(false); setOutput(EMPTY_OUTPUT);
      cbRef.current.onCleared?.();
      return;
    }

    setLoading(true);
    setAutoSpecs(null); setAiSource(null);
    setEditMode(false); setAiError(false);

    let cancelled = false;

    const timer = setTimeout(async () => {
      if (cancelled) return;

      // ── 0) Si hay cilindraje oficial pero no version, enriquecer motor base ──
      // (Se sobreescribirá si la DB o IA dan datos más completos)
      const motorBase = cilindraje ? `${(cilindraje / 1000).toFixed(1)}L · ${cilindraje} cc` : "";

      // ── 1) Búsqueda en DB curada (con fuzzy) ──
      const dbResult = findInDB(marca, modelo, version);
      if (dbResult) {
        const { specs: found, modeloUsado } = dbResult;
        const out: SpecsOutput = {
          motor:       found.motor,
          combustible: found.combustible,
          transmision: found.transmision,
          potencia:    found.potencia,
          carroceria:  found.carroceria,
          pasajeros:   String(found.pasajeros),
        };
        setAutoSpecs(found);
        setAiSource(modeloUsado !== modelo ? "db-fuzzy" : "db");
        setOutput(out);
        setLoading(false);
        cbRef.current.onOutputChange?.(found, out);
        return;
      }

      // ── 2) Fallback: Claude AI (pasa cilindraje oficial si está disponible) ──
      setAiLoading(true);
      try {
        const res = await fetch("/api/specs/auto-fill", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ marca, modelo, version, ano, cilindraje }),
        });

        if (cancelled) return;

        if (res.ok) {
          const json = await res.json();
          const s = json.specs ?? {};
          const aiSpecs: EspecificacionesTecnicas = {
            motor:       s.motor ?? "",
            cilindrada:  s.cilindrada ?? "",
            cilindros:   "",
            potencia:    s.potencia ?? "",
            torque:      s.torque ?? "",
            combustible: s.combustible ?? "",
            transmision: s.transmision ?? "",
            traccion:    s.traccion ?? "",
            carroceria:  s.carroceria ?? "",
            puertas:     Number(s.puertas) || 4,
            pasajeros:   Number(s.pasajeros) || 5,
            frenos:      "",
            consumo:     s.consumo ?? "",
            normaEmision: s.normaEmision ?? "",
          };
          const out: SpecsOutput = {
            motor:       aiSpecs.motor,
            combustible: aiSpecs.combustible,
            transmision: aiSpecs.transmision,
            potencia:    aiSpecs.potencia,
            carroceria:  aiSpecs.carroceria,
            pasajeros:   String(aiSpecs.pasajeros),
          };
          setAutoSpecs(aiSpecs);
          setAiSource("ai");
          setOutput(out);
          cbRef.current.onOutputChange?.(aiSpecs, out);
        } else {
          // AI no disponible → modo manual con campos editables
          // Si la IA falla pero tenemos cilindraje oficial, lo mostramos
          const fallbackOutput: SpecsOutput = {
            ...EMPTY_OUTPUT,
            motor: motorBase,
          };
          setAiError(true);
          setEditMode(true);
          setOutput(fallbackOutput);
          if (motorBase) cbRef.current.onOutputChange?.(null, fallbackOutput);
          else cbRef.current.onCleared?.();
        }
      } catch {
        if (!cancelled) {
          const fallbackOutput: SpecsOutput = { ...EMPTY_OUTPUT, motor: motorBase };
          setAiError(true);
          setEditMode(true);
          setOutput(fallbackOutput);
          if (motorBase) cbRef.current.onOutputChange?.(null, fallbackOutput);
        }
      } finally {
        if (!cancelled) {
          setAiLoading(false);
          setLoading(false);
        }
      }
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [marca, modelo, version, ano, cilindraje]);

  // Propagate manual edits
  const updateField = (key: keyof SpecsOutput, val: string) => {
    const updated = { ...output, [key]: val };
    setOutput(updated);
    cbRef.current.onOutputChange?.(autoSpecs, updated);
  };

  // ── No hay marca/modelo → no renderizar ──
  if (!marca || !modelo) return null;

  const locked = !!autoSpecs && !editMode;

  const statusText = aiLoading
    ? "🤖 Consultando con IA para autocompletar..."
    : loading
    ? "Consultando base de datos técnica..."
    : aiError
    ? "No pudimos cargar las especificaciones — completa manualmente"
    : autoSpecs && aiSource === "db"
    ? `Datos verificados · Cambia la versión si tu carro difiere`
    : autoSpecs && aiSource === "db-fuzzy"
    ? `Datos aproximados basados en modelo similar · Verifica y corrige si es necesario`
    : autoSpecs && aiSource === "ai"
    ? `✨ Especificaciones generadas por IA · Verifica y corrige si es necesario`
    : "Selecciona marca y modelo para ver las especificaciones";

  return (
    <div className="bg-white rounded-2xl border border-[#dce0e5] overflow-hidden">
      {/* ── Header ── */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-[#f0f2f4]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#e8f0fd] flex items-center justify-center flex-shrink-0">
            <Gauge size={16} color="#1978e5" weight="fill" />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-[#111418]">Especificaciones técnicas</h3>
            <p className="text-[11px] text-[#637488]">{statusText}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Loading badge */}
          {(loading || aiLoading) && (
            <span className="flex items-center gap-1.5 bg-[#e8f0fd] rounded-full px-3 py-1.5">
              <Sparkle size={12} color="#1978e5" weight="fill" className="animate-spin" />
              <span className="text-[11px] text-[#1978e5] font-bold">
                {aiLoading ? "Consultando IA" : "Cargando"}
              </span>
            </span>
          )}

          {/* Auto-complete badge — DB */}
          {autoSpecs && !loading && aiSource === "db" && (
            <span className="flex items-center gap-1 bg-green-50 border border-green-200 rounded-full px-2.5 py-1.5">
              <CheckCircle size={11} color="#16a34a" weight="fill" />
              <span className="text-[11px] text-green-700 font-bold">Verificado</span>
            </span>
          )}

          {/* Fuzzy-match badge — modelo similar */}
          {autoSpecs && !loading && aiSource === "db-fuzzy" && (
            <span className="flex items-center gap-1 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1.5">
              <Warning size={11} color="#d97706" weight="fill" />
              <span className="text-[11px] text-amber-700 font-bold">Similar</span>
            </span>
          )}

          {/* AI-generated badge */}
          {autoSpecs && !loading && aiSource === "ai" && (
            <span className="flex items-center gap-1 bg-purple-50 border border-purple-200 rounded-full px-2.5 py-1.5">
              <Sparkle size={11} color="#9333ea" weight="fill" />
              <span className="text-[11px] text-purple-700 font-bold">IA</span>
            </span>
          )}

          {/* Error badge */}
          {aiError && !loading && (
            <span className="flex items-center gap-1 bg-red-50 border border-red-200 rounded-full px-2.5 py-1.5">
              <Warning size={11} color="#dc2626" weight="fill" />
              <span className="text-[11px] text-red-700 font-bold">Manual</span>
            </span>
          )}

          {/* Edit / Guardar toggle */}
          {autoSpecs && !loading && (
            <button
              type="button"
              onClick={() => setEditMode((m) => !m)}
              className="flex items-center gap-1 text-[11px] font-bold text-[#637488] hover:text-[#1978e5] px-2 py-1 rounded-lg hover:bg-[#e8f0fd] transition-colors"
            >
              {editMode ? <X size={12} /> : <PencilSimple size={12} />}
              {editMode ? "Cerrar" : "Editar"}
            </button>
          )}
        </div>
      </div>

      {/* ── Banner de error ── */}
      {aiError && (
        <div className="mx-5 mt-4 flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <Warning size={15} color="#dc2626" weight="fill" className="flex-shrink-0 mt-0.5" />
          <p className="text-[12px] text-red-700 leading-snug">
            No pudimos encontrar especificaciones automáticas para este vehículo.
            <span className="font-bold"> Completa los campos manualmente.</span>
          </p>
        </div>
      )}

      {/* ── Grid de 6 campos ── */}
      <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
        <SpecField
          icon={<Lightning size={13} weight="fill" />}
          label="Potencia"
          value={output.potencia}
          loading={loading}
          locked={locked}
          onChange={(v) => updateField("potencia", v)}
        />
        <SpecField
          icon={<Users size={13} weight="fill" />}
          label="Pasajeros"
          value={output.pasajeros}
          loading={loading}
          locked={locked}
          onChange={(v) => updateField("pasajeros", v)}
        />
        <SpecField
          icon={<Gauge size={13} weight="fill" />}
          label="Motor / Cilindraje"
          value={output.motor}
          loading={loading}
          locked={locked}
          onChange={(v) => updateField("motor", v)}
        />
        <SpecField
          icon={<Flame size={13} weight="fill" />}
          label="Combustible"
          value={output.combustible}
          loading={loading}
          locked={locked}
          type="select"
          options={COMBUSTIBLES}
          onChange={(v) => updateField("combustible", v)}
        />
        <SpecField
          icon={<Car size={13} weight="fill" />}
          label="Carrocería"
          value={output.carroceria}
          loading={loading}
          locked={locked}
          type="select"
          options={CARROCERIAS}
          onChange={(v) => updateField("carroceria", v)}
        />
        <SpecField
          icon={<Gear size={13} weight="fill" />}
          label="Transmisión"
          value={output.transmision}
          loading={loading}
          locked={locked}
          type="select"
          options={TRANSMISIONES}
          onChange={(v) => updateField("transmision", v)}
        />
      </div>
    </div>
  );
}
