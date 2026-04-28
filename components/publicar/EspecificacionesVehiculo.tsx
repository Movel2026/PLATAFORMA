"use client";

import { useEffect, useRef, useState } from "react";
import {
  Lightning, Gauge, Gear, Flame, Car, Users,
  CheckCircle, PencilSimple, Sparkle, X,
} from "@phosphor-icons/react";
import { getEspecificaciones, EspecificacionesTecnicas } from "@/lib/specs-data";

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
  /** Versión exacta tal como aparece en specs-data (ej: "LT 1.0 Turbo") */
  version: string;
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
  marca, modelo, version, onOutputChange, onCleared,
}: EspecificacionesVehiculoProps) {
  const [autoSpecs, setAutoSpecs] = useState<EspecificacionesTecnicas | null>(null);
  const [loading, setLoading]     = useState(false);
  const [editMode, setEditMode]   = useState(false);
  const [output, setOutput]       = useState<SpecsOutput>(EMPTY_OUTPUT);

  // usamos ref para no incluir callbacks en deps de useEffect
  const cbRef = useRef({ onOutputChange, onCleared });
  cbRef.current = { onOutputChange, onCleared };

  useEffect(() => {
    const valid = marca && modelo && version && version !== "__otra__";

    if (!valid) {
      setAutoSpecs(null);
      setLoading(false);
      setEditMode(false);
      setOutput(EMPTY_OUTPUT);
      cbRef.current.onCleared?.();
      return;
    }

    setLoading(true);
    setAutoSpecs(null);
    setEditMode(false);

    const timer = setTimeout(() => {
      const found = getEspecificaciones(marca, modelo, version);
      setAutoSpecs(found);
      setLoading(false);

      if (found) {
        const out: SpecsOutput = {
          motor:       found.motor,
          combustible: found.combustible,
          transmision: found.transmision,
          potencia:    found.potencia,
          carroceria:  found.carroceria,
          pasajeros:   String(found.pasajeros),
        };
        setOutput(out);
        cbRef.current.onOutputChange?.(found, out);
      } else {
        setEditMode(true);
        setOutput(EMPTY_OUTPUT);
        cbRef.current.onCleared?.();
      }
    }, 750);

    return () => clearTimeout(timer);
  }, [marca, modelo, version]);

  // Propagate manual edits
  const updateField = (key: keyof SpecsOutput, val: string) => {
    const updated = { ...output, [key]: val };
    setOutput(updated);
    cbRef.current.onOutputChange?.(autoSpecs, updated);
  };

  // ── No hay marca/modelo → no renderizar ──
  if (!marca || !modelo) return null;

  const locked = !!autoSpecs && !editMode;

  const statusText = loading
    ? "Consultando base de datos técnica..."
    : autoSpecs
    ? `Datos verificados para ${version} · Cambia la versión si tu carro difiere`
    : !version || version === "__otra__"
    ? "Selecciona la versión para ver las especificaciones"
    : "No tenemos datos para esta versión — ingresa los valores manualmente";

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
          {loading && (
            <span className="flex items-center gap-1.5 bg-[#e8f0fd] rounded-full px-3 py-1.5">
              <Sparkle size={12} color="#1978e5" weight="fill" className="animate-spin" />
              <span className="text-[11px] text-[#1978e5] font-bold">Cargando</span>
            </span>
          )}

          {/* Auto-complete badge */}
          {autoSpecs && !loading && (
            <span className="flex items-center gap-1 bg-green-50 border border-green-200 rounded-full px-2.5 py-1.5">
              <CheckCircle size={11} color="#16a34a" weight="fill" />
              <span className="text-[11px] text-green-700 font-bold">Auto-completado</span>
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
