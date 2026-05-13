/**
 * BrandIcons — Iconos geométricos abstractos para marcas automotrices.
 *
 * Son representaciones estilizadas (no logos oficiales) diseñadas para
 * funcionar como marcadores visuales reconocibles en listados.
 *
 * Todos renderizan en viewBox 64×64 con stroke `currentColor`.
 */

import React from "react";

interface BrandIconProps {
  className?: string;
  size?: number;
}

const baseAttrs = (size = 32): React.SVGAttributes<SVGElement> => ({
  width: size,
  height: size,
  viewBox: "0 0 64 64",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

// ── Toyota ─ Oval con detalle interno (3 elipses) ───────────────────
export function ToyotaIcon({ className = "", size = 32 }: BrandIconProps) {
  return (
    <svg {...baseAttrs(size)} className={className}>
      <ellipse cx="32" cy="32" rx="26" ry="18" />
      <ellipse cx="32" cy="32" rx="8" ry="16" />
      <ellipse cx="32" cy="32" rx="18" ry="6" />
    </svg>
  );
}

// ── Mazda ─ Oval con M estilizada ───────────────────────────────────
export function MazdaIcon({ className = "", size = 32 }: BrandIconProps) {
  return (
    <svg {...baseAttrs(size)} className={className}>
      <ellipse cx="32" cy="32" rx="26" ry="19" />
      <path d="M18 41 Q24 22 32 32 Q40 22 46 41" />
    </svg>
  );
}

// ── Chevrolet ─ Bowtie / cruz estilizada ────────────────────────────
export function ChevroletIcon({ className = "", size = 32 }: BrandIconProps) {
  return (
    <svg {...baseAttrs(size)} className={className} fill="currentColor" stroke="none">
      <path d="M4 28 L60 28 L52 36 L12 36 Z" />
      <path d="M22 22 L42 22 L38 28 L26 28 Z" />
      <path d="M22 42 L42 42 L38 36 L26 36 Z" />
    </svg>
  );
}

// ── Kia ─ Wordmark italic en oval ───────────────────────────────────
export function KiaIcon({ className = "", size = 32 }: BrandIconProps) {
  return (
    <svg {...baseAttrs(size)} className={className}>
      <ellipse cx="32" cy="32" rx="28" ry="14" />
      <text
        x="32" y="40"
        fontFamily="Arial Black, Archivo Black, sans-serif"
        fontSize="16"
        fontWeight="900"
        fontStyle="italic"
        textAnchor="middle"
        fill="currentColor"
        stroke="none"
        letterSpacing="0.5"
      >KIA</text>
    </svg>
  );
}

// ── Renault ─ Diamante / lozange con interior ───────────────────────
export function RenaultIcon({ className = "", size = 32 }: BrandIconProps) {
  return (
    <svg {...baseAttrs(size)} className={className}>
      <path d="M32 6 L54 32 L32 58 L10 32 Z" />
      <path d="M32 14 L46 32 L32 50 L18 32 Z" />
    </svg>
  );
}

// ── Hyundai ─ H italic en oval ──────────────────────────────────────
export function HyundaiIcon({ className = "", size = 32 }: BrandIconProps) {
  return (
    <svg {...baseAttrs(size)} className={className}>
      <ellipse cx="32" cy="32" rx="28" ry="14" />
      <path d="M22 24 L18 40 M42 24 L46 40 M21 32 L43 32" strokeWidth="3" />
    </svg>
  );
}

// ── Nissan ─ Circle con barra horizontal ────────────────────────────
export function NissanIcon({ className = "", size = 32 }: BrandIconProps) {
  return (
    <svg {...baseAttrs(size)} className={className}>
      <circle cx="32" cy="32" r="20" />
      <rect x="6" y="28" width="52" height="8" fill="currentColor" stroke="none" />
      <rect x="10" y="30" width="44" height="4" fill="white" stroke="none" />
    </svg>
  );
}

// ── Ford ─ Oval clásico ─────────────────────────────────────────────
export function FordIcon({ className = "", size = 32 }: BrandIconProps) {
  return (
    <svg {...baseAttrs(size)} className={className}>
      <ellipse cx="32" cy="32" rx="28" ry="14" strokeWidth="3" />
      <text
        x="32" y="38"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="15"
        fontWeight="700"
        fontStyle="italic"
        textAnchor="middle"
        fill="currentColor"
        stroke="none"
      >Ford</text>
    </svg>
  );
}

// ── Honda ─ H en marco geométrico ───────────────────────────────────
export function HondaIcon({ className = "", size = 32 }: BrandIconProps) {
  return (
    <svg {...baseAttrs(size)} className={className}>
      <rect x="6" y="14" width="52" height="36" rx="4" />
      <path d="M20 22 L20 42 M44 22 L44 42 M20 32 L44 32" strokeWidth="4" />
    </svg>
  );
}

// ── Mitsubishi ─ 3 diamantes ────────────────────────────────────────
export function MitsubishiIcon({ className = "", size = 32 }: BrandIconProps) {
  return (
    <svg {...baseAttrs(size)} className={className} fill="currentColor" stroke="none">
      <path d="M32 8 L40 22 L24 22 Z" />
      <path d="M14 36 L22 50 L6 50 Z" />
      <path d="M50 36 L58 50 L42 50 Z" />
    </svg>
  );
}

// ── Map ────────────────────────────────────────────────────────────
const BRAND_ICON_MAP: Record<string, React.FC<BrandIconProps>> = {
  toyota:     ToyotaIcon,
  mazda:      MazdaIcon,
  chevrolet:  ChevroletIcon,
  kia:        KiaIcon,
  renault:    RenaultIcon,
  hyundai:    HyundaiIcon,
  nissan:     NissanIcon,
  ford:       FordIcon,
  honda:      HondaIcon,
  mitsubishi: MitsubishiIcon,
};

interface BrandIconMapProps extends BrandIconProps {
  name: string;
}

export function BrandIcon({ name, className = "", size = 32 }: BrandIconMapProps) {
  const Icon = BRAND_ICON_MAP[name.toLowerCase()];
  if (!Icon) {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
        <circle cx="32" cy="32" r="26" fill="none" stroke="currentColor" strokeWidth="2.8" />
        <text
          x="32" y="42"
          fontFamily="Archivo Black, Arial Black, sans-serif"
          fontSize="24"
          fontWeight="900"
          textAnchor="middle"
          fill="currentColor"
        >{name.charAt(0).toUpperCase()}</text>
      </svg>
    );
  }
  return <Icon className={className} size={size} />;
}

export default BrandIcon;
