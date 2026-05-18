/**
 * BrandIcons — Representaciones SVG de logos de marcas automotrices.
 * Todas las marcas usan sus formas emblemáticas reconocibles.
 */
import React from "react";

interface BrandIconProps {
  className?: string;
  size?: number;
}

// ── Toyota — Tres elipses superpuestas formando la T ───────────────────
export function ToyotaIcon({ className = "", size = 36 }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 65" fill="none" stroke="currentColor" className={className}>
      <ellipse cx="50" cy="33" rx="47" ry="28" strokeWidth="5.5" />
      <ellipse cx="50" cy="37" rx="15" ry="26" strokeWidth="5" />
      <ellipse cx="50" cy="24" rx="30" ry="11" strokeWidth="5" />
    </svg>
  );
}

// ── Mazda — Alas en V en oval ──────────────────────────────────────────
export function MazdaIcon({ className = "", size = 36 }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeLinecap="round" className={className}>
      <ellipse cx="50" cy="30" rx="47" ry="26" strokeWidth="4" />
      <path d="M16,46 C22,20 38,18 50,34 C62,18 78,20 84,46" strokeWidth="5" />
      <path d="M28,46 C32,30 40,26 50,38 C60,26 68,30 72,46" strokeWidth="4" />
    </svg>
  );
}

// ── Chevrolet — Corbata / Bowtie ───────────────────────────────────────
export function ChevroletIcon({ className = "", size = 36 }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 42" fill="currentColor" stroke="none" className={className}>
      {/* Left arm — angled right edge */}
      <path d="M2,8 L44,8 L38,34 L2,34 Z" />
      {/* Right arm — angled left edge */}
      <path d="M56,8 L98,8 L98,34 L62,34 Z" />
    </svg>
  );
}

// ── Kia — Letras KIA en bloque bold ───────────────────────────────────
export function KiaIcon({ className = "", size = 36 }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 96 44" fill="currentColor" stroke="none" className={className}>
      {/* K */}
      <path d="M4,6 L4,38 L13,38 L13,26 L24,38 L35,38 L21,22 L34,6 L23,6 L13,20 L13,6 Z" />
      {/* I */}
      <path d="M40,6 L40,38 L49,38 L49,6 Z" />
      {/* A */}
      <path d="M63,6 L51,38 L61,38 L64,30 L78,30 L81,38 L91,38 L79,6 Z M67,23 L71,11 L75,23 Z" />
    </svg>
  );
}

// ── Renault — Doble diamante ───────────────────────────────────────────
export function RenaultIcon({ className = "", size = 36 }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="miter" className={className}>
      <path d="M32,4 L58,32 L32,60 L6,32 Z" />
      <path d="M32,14 L50,32 L32,50 L14,32 Z" />
    </svg>
  );
}

// ── Hyundai — H cursiva en oval ────────────────────────────────────────
export function HyundaiIcon({ className = "", size = 36 }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 65" fill="none" stroke="currentColor" strokeLinecap="round" className={className}>
      <ellipse cx="50" cy="33" rx="47" ry="28" strokeWidth="4.5" />
      {/* Left vertical — italic lean */}
      <line x1="30" y1="20" x2="24" y2="46" strokeWidth="6" />
      {/* Right vertical */}
      <line x1="70" y1="20" x2="64" y2="46" strokeWidth="6" />
      {/* Curved crossbar */}
      <path d="M30,33 Q50,27 64,33" strokeWidth="5.5" />
    </svg>
  );
}

// ── Nissan — Círculo con banda horizontal ─────────────────────────────
export function NissanIcon({ className = "", size = 36 }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke="currentColor" className={className}>
      <circle cx="50" cy="50" r="46" strokeWidth="4.5" />
      {/* Wide horizontal band */}
      <rect x="4" y="40" width="92" height="20" fill="currentColor" stroke="none" />
      {/* "N" letters hint inside band */}
      <text x="50" y="55" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="700" textAnchor="middle" fill="white" stroke="none" letterSpacing="1">NISSAN</text>
    </svg>
  );
}

// ── Ford — Óvalo con script ────────────────────────────────────────────
export function FordIcon({ className = "", size = 36 }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 110 55" fill="none" stroke="currentColor" strokeWidth="3.5" className={className}>
      <ellipse cx="55" cy="28" rx="52" ry="24" />
      <text x="55" y="36" fontFamily="Georgia, 'Times New Roman', serif" fontSize="24" fontWeight="700" fontStyle="italic" textAnchor="middle" fill="currentColor" stroke="none">Ford</text>
    </svg>
  );
}

// ── Honda — Marca H con alas ───────────────────────────────────────────
export function HondaIcon({ className = "", size = 36 }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 64" fill="currentColor" stroke="none" className={className}>
      {/* Left column */}
      <path d="M8,10 L20,10 L20,28 L60,28 L60,10 L72,10 L72,54 L60,54 L60,36 L20,36 L20,54 L8,54 Z" />
    </svg>
  );
}

// ── Mitsubishi — Tres diamantes ────────────────────────────────────────
export function MitsubishiIcon({ className = "", size = 36 }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="currentColor" stroke="none" className={className}>
      {/* Top diamond */}
      <path d="M32,4 L43,21 L32,21 L21,21 Z" />
      {/* Bottom-left diamond */}
      <path d="M19,24 L8,42 L19,42 L30,24 Z" />
      {/* Bottom-right diamond */}
      <path d="M45,24 L56,42 L45,42 L34,24 Z" />
    </svg>
  );
}

// ── Map ────────────────────────────────────────────────────────────────
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

export function BrandIcon({ name, className = "", size = 36 }: BrandIconMapProps) {
  const Icon = BRAND_ICON_MAP[name.toLowerCase()];
  if (!Icon) {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
        <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="3.5" />
        <text x="32" y="42" fontFamily="Archivo Black, Arial Black, sans-serif" fontSize="26" fontWeight="900" textAnchor="middle" fill="currentColor">{name.charAt(0).toUpperCase()}</text>
      </svg>
    );
  }
  return <Icon className={className} size={size} />;
}

export default BrandIcon;
