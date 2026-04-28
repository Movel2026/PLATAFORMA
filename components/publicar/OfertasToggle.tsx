"use client";

import { Tag, CheckCircle, Info } from "@phosphor-icons/react";

export interface OfertasToggleProps {
  /** Valor actual del toggle */
  value: boolean;
  /** Callback cuando el usuario cambia el estado */
  onChange: (val: boolean) => void;
  /**
   * Cuando está deshabilitado el toggle no responde a clics.
   * Por defecto false (siempre activo).
   */
  disabled?: boolean;
}

/**
 * Toggle reutilizable para activar/desactivar la opción de recibir ofertas.
 * Ubicar en la sección de precio del formulario de publicación.
 */
export function OfertasToggle({ value, onChange, disabled = false }: OfertasToggleProps) {
  const toggle = () => {
    if (!disabled) onChange(!value);
  };

  return (
    <div
      onClick={toggle}
      className={[
        "mt-4 p-4 rounded-xl border-2 transition-all duration-200 select-none",
        disabled
          ? "opacity-50 cursor-not-allowed border-[#dce0e5] bg-[#f8f9fa]"
          : value
          ? "cursor-pointer border-[#1978e5] bg-[#e8f0fd]"
          : "cursor-pointer border-[#dce0e5] bg-[#f8f9fa] hover:border-[#1978e5]/40",
      ].join(" ")}
    >
      {/* ── Row ── */}
      <div className="flex items-center justify-between gap-4">
        {/* Icon + copy */}
        <div className="flex items-start gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
              value && !disabled ? "bg-[#1978e5]" : "bg-[#dce0e5]"
            }`}
          >
            <Tag size={18} color="white" weight="fill" />
          </div>
          <div>
            <p className="text-[14px] font-bold text-[#111418]">Recibir ofertas</p>
            <p className="text-[12px] text-[#637488] mt-0.5">
              {disabled
                ? "Completa el formulario para activar esta opción."
                : value
                ? "Los compradores podrán enviarte ofertas por este vehículo."
                : "Activa para recibir propuestas de precio de compradores."}
            </p>
          </div>
        </div>

        {/* Toggle pill */}
        <div
          role="switch"
          aria-checked={value}
          aria-disabled={disabled}
          className={`relative flex-shrink-0 w-12 h-6 rounded-full transition-colors duration-200 ${
            value && !disabled ? "bg-[#1978e5]" : "bg-[#cbd5e1]"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
              value && !disabled ? "translate-x-6" : "translate-x-0"
            }`}
          />
        </div>
      </div>

      {/* ── Expanded confirmation ── */}
      {value && !disabled && (
        <div className="mt-3 flex items-center gap-2 bg-white/70 rounded-lg px-3 py-2">
          <CheckCircle size={14} color="#1978e5" weight="fill" />
          <p className="text-[12px] text-[#1978e5] font-semibold">
            Aparecerá el botón &quot;Hacer una oferta&quot; en tu publicación.
          </p>
        </div>
      )}

      {/* ── Disabled hint ── */}
      {disabled && (
        <div className="mt-3 flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          <Info size={13} color="#d97706" weight="fill" />
          <p className="text-[11px] text-amber-700 font-semibold">
            Disponible después de completar los campos obligatorios.
          </p>
        </div>
      )}
    </div>
  );
}
