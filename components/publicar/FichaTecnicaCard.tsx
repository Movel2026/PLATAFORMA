"use client";

import {
  Lightning, Gauge, Gear, Flame, Car, Users,
  Leaf, Wind, Wrench, ArrowsOut, ArrowsClockwise, Door,
} from "@phosphor-icons/react";
import { EspecificacionesTecnicas, estimarValorUsado } from "@/lib/specs-data";

// ── Tipos ─────────────────────────────────────────────────────────────────

export interface FichaTecnicaCardProps {
  specs: EspecificacionesTecnicas;
  marca: string;
  modelo: string;
  version: string;
  /** Año como string (viene del select del formulario) */
  año: string;
}

// ── Sub-componentes internos ──────────────────────────────────────────────

interface SpecItemProps {
  icon: React.ReactNode;
  label: string;
  value?: string | number;
}

function SpecItem({ icon, label, value }: SpecItemProps) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="flex items-start gap-2.5 py-3 border-b border-[#f0f2f4] last:border-0">
      <div className="w-7 h-7 rounded-lg bg-[#e8f0fd] flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-[#1978e5]">{icon}</span>
      </div>
      <div>
        <p className="text-[10px] font-bold text-[#637488] uppercase tracking-wider">{label}</p>
        <p className="text-[13px] font-bold text-[#111418] leading-tight mt-0.5">{value}</p>
      </div>
    </div>
  );
}

interface StatPillProps {
  label: string;
  value: string;
}
function StatPill({ label, value }: StatPillProps) {
  return (
    <div className="text-center">
      <p className="text-[9px] font-bold text-[#637488] uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-[15px] font-black text-[#111418]">{value}</p>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────

/**
 * Tarjeta de Ficha Técnica inspirada en el formato FASECOLDA.
 * Muestra especificaciones técnicas + valor de referencia del mercado colombiano.
 * Se renderiza dentro del formulario de publicación una vez seleccionada la versión.
 */
export function FichaTecnicaCard({ specs, marca, modelo, version, año }: FichaTecnicaCardProps) {
  const añoNum   = parseInt(año) || new Date().getFullYear();
  const valorRef = estimarValorUsado(marca, modelo, version, añoNum);
  const edad     = new Date().getFullYear() - añoNum;

  // Columna izquierda: motor + consumo
  const col1: SpecItemProps[] = [
    { icon: <Wrench size={14} weight="fill" />,          label: "Motor",        value: specs.motor },
    { icon: <Gauge size={14} weight="fill" />,           label: "Cilindraje",   value: specs.cilindrada },
    { icon: <Lightning size={14} weight="fill" />,       label: "Potencia",     value: specs.potencia },
    { icon: <ArrowsClockwise size={14} weight="fill" />, label: "Torque",       value: specs.torque },
    { icon: <Flame size={14} weight="fill" />,           label: "Combustible",  value: specs.combustible },
    { icon: <Leaf size={14} weight="fill" />,            label: "Consumo",      value: specs.consumo },
  ];

  // Columna derecha: transmisión + carrocería
  const col2: SpecItemProps[] = [
    { icon: <Gear size={14} weight="fill" />,      label: "Transmisión", value: specs.transmision },
    { icon: <ArrowsOut size={14} weight="bold" />, label: "Tracción",    value: specs.traccion },
    { icon: <Car size={14} weight="fill" />,       label: "Carrocería",  value: specs.carroceria },
    { icon: <Door size={14} weight="fill" />,      label: "Puertas",     value: specs.puertas },
    { icon: <Users size={14} weight="fill" />,     label: "Pasajeros",   value: specs.pasajeros },
    { icon: <Wind size={14} weight="fill" />,      label: "Norma",       value: specs.normaEmision },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#dce0e5] overflow-hidden shadow-sm">

      {/* ── Header gradient (estilo FASECOLDA / autoridad sector) ── */}
      <div
        className="px-6 py-5"
        style={{ background: "linear-gradient(135deg, #0d1b2e 0%, #1565c0 65%, #1978e5 100%)" }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="inline-block bg-white/20 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest mb-2">
              Ficha Técnica
            </span>
            <h3 className="text-white font-black text-[20px] leading-tight">
              {marca} {modelo}
            </h3>
            <p className="text-white/65 text-[13px] mt-0.5">
              {version} &nbsp;·&nbsp; {año}
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-white/45 text-[9px] uppercase tracking-widest font-bold mb-1">
              Datos verificados
            </p>
            <div className="flex items-center justify-end gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-300 text-[11px] font-bold">Ref. Fasecolda</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="p-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 sm:gap-6">

          {/* Col 1 */}
          <div className="sm:col-span-1">
            {col1.map((item) => <SpecItem key={item.label} {...item} />)}
          </div>

          {/* Col 2 */}
          <div className="sm:col-span-1 sm:border-l border-[#f0f2f4] sm:pl-6">
            {col2.map((item) => (
              (item.value !== undefined && item.value !== "") && (
                <SpecItem key={item.label} {...item} />
              )
            ))}
          </div>

          {/* Col 3 — Valor de referencia */}
          <div className="sm:col-span-1 sm:border-l border-[#f0f2f4] sm:pl-6 mt-5 sm:mt-0">
            <p className="text-[10px] font-black text-[#637488] uppercase tracking-widest mb-3">
              Valor de referencia
            </p>

            {valorRef ? (
              <>
                {/* Price band */}
                <div
                  className="rounded-xl p-4 mb-3"
                  style={{ background: "linear-gradient(135deg, #e8f0fd, #f0f7ff)" }}
                >
                  <p className="text-[10px] text-[#637488] font-bold uppercase tracking-wide mb-1">
                    Estimado mercado colombiano
                  </p>
                  <p className="text-[22px] font-black text-[#1565c0] leading-none">
                    ${valorRef.min.toLocaleString("es-CO")}M
                  </p>
                  <p className="text-[12px] text-[#637488] mt-0.5">
                    — ${valorRef.max.toLocaleString("es-CO")}M COP
                  </p>
                </div>

                {/* Meta */}
                <ul className="text-[11px] text-[#637488] space-y-1 mb-3">
                  <li>
                    · Precio base 2024:{" "}
                    <strong className="text-[#111418]">
                      ${valorRef.base.toLocaleString("es-CO")}M
                    </strong>
                  </li>
                  <li>
                    · Antigüedad:{" "}
                    <strong className="text-[#111418]">
                      {edad <= 0 ? "0–1 años" : `${edad} año${edad !== 1 ? "s" : ""}`}
                    </strong>
                  </li>
                  <li>· Condición estimada: buenas</li>
                </ul>

                <a
                  href="https://www.fasecolda.com/guia-de-valores/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-[#1978e5] font-bold hover:underline"
                >
                  Ver Guía de Valores Fasecolda →
                </a>
              </>
            ) : (
              <div className="bg-[#f8f9fa] rounded-xl p-4 text-center">
                <p className="text-[12px] text-[#637488] mb-2">
                  Sin referencia para esta versión
                </p>
                <a
                  href="https://www.fasecolda.com/guia-de-valores/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[12px] text-[#1978e5] font-bold hover:underline"
                >
                  Consultar Fasecolda →
                </a>
              </div>
            )}
          </div>
        </div>

        {/* ── Stats bar (aceleración / vel. máx / cilindros) ── */}
        {(specs.aceleracion || specs.velocidadMax || specs.cilindros) && (
          <div className="mt-5 pt-4 border-t border-[#f0f2f4] flex items-center gap-8 flex-wrap">
            {specs.aceleracion  && <StatPill label="0–100 km/h"    value={specs.aceleracion} />}
            {specs.velocidadMax && <StatPill label="Vel. máxima"   value={specs.velocidadMax} />}
            {specs.cilindros    && <StatPill label="Cilindros"      value={specs.cilindros} />}
          </div>
        )}

        {/* ── Disclaimer ── */}
        <div className="mt-4 bg-[#f8f9fa] rounded-xl p-3">
          <p className="text-[11px] text-[#637488] leading-relaxed">
            ⚠️{" "}
            <strong className="text-[#111418]">Nota:</strong> Datos basados en fichas técnicas
            homologadas para Colombia. El valor de referencia es estimativo y puede variar según
            estado, kilometraje y equipamiento. Consulte la{" "}
            <a
              href="https://www.fasecolda.com/guia-de-valores/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1978e5] font-semibold hover:underline"
            >
              Guía de Valores Fasecolda
            </a>{" "}
            para un valor comercial exacto.
          </p>
        </div>
      </div>
    </div>
  );
}
