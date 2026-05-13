/**
 * BrandIcons — Logos abstractos monocromáticos de marcas automotrices.
 *
 * Cada icono se renderiza en 32×32 viewBox, color heredado vía `currentColor`.
 * Optimizados como representaciones simplificadas (no son logos oficiales,
 * son abstracciones gráficas reconocibles).
 *
 * Uso:
 *   <BrandIcon name="toyota" className="w-7 h-7 text-ink" />
 */

import React from "react";

interface BrandIconProps {
  className?: string;
  size?: number;
}

const sx = (size = 28): React.SVGAttributes<SVGElement> => ({
  width: size,
  height: size,
  viewBox: "0 0 32 32",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

// ── Iconos individuales ───────────────────────────────────────────────

export function ToyotaIcon({ className = "", size = 28 }: BrandIconProps) {
  return (
    <svg {...sx(size)} className={className}>
      <ellipse cx="16" cy="16" rx="12" ry="8" />
      <ellipse cx="16" cy="16" rx="3.5" ry="7" />
      <ellipse cx="16" cy="16" rx="8" ry="2.6" />
    </svg>
  );
}

export function MazdaIcon({ className = "", size = 28 }: BrandIconProps) {
  return (
    <svg {...sx(size)} className={className}>
      <ellipse cx="16" cy="16" rx="12" ry="8.5" />
      <path d="M9 19 L13 11 L16 17 L19 11 L23 19" />
    </svg>
  );
}

export function ChevroletIcon({ className = "", size = 28 }: BrandIconProps) {
  return (
    <svg {...sx(size)} className={className} fill="currentColor" stroke="none">
      <path d="M3 14 H29 L25 18 H7 Z" />
      <path d="M11 12 H21 L19 14 H13 Z" />
      <path d="M11 20 H21 L19 18 H13 Z" />
    </svg>
  );
}

export function KiaIcon({ className = "", size = 28 }: BrandIconProps) {
  return (
    <svg {...sx(size)} className={className} fill="currentColor" stroke="none">
      <ellipse cx="16" cy="16" rx="13" ry="6.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <text x="16" y="20.5" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="9" textAnchor="middle" fill="currentColor" fontStyle="italic">KIA</text>
    </svg>
  );
}

export function RenaultIcon({ className = "", size = 28 }: BrandIconProps) {
  return (
    <svg {...sx(size)} className={className}>
      <path d="M16 4 L26 16 L16 28 L6 16 Z" />
      <path d="M16 9 L21 16 L16 23 L11 16 Z" />
    </svg>
  );
}

export function HyundaiIcon({ className = "", size = 28 }: BrandIconProps) {
  return (
    <svg {...sx(size)} className={className} fill="currentColor" stroke="none">
      <ellipse cx="16" cy="16" rx="13" ry="6.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 13 L13 19 M19 13 L23 19 M12 16 L20 16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function NissanIcon({ className = "", size = 28 }: BrandIconProps) {
  return (
    <svg {...sx(size)} className={className}>
      <circle cx="16" cy="16" r="10" />
      <rect x="4" y="14.5" width="24" height="3" rx="0.4" fill="currentColor" stroke="none" />
      <rect x="6" y="15.2" width="20" height="1.6" rx="0.2" fill="white" stroke="none" />
    </svg>
  );
}

export function FordIcon({ className = "", size = 28 }: BrandIconProps) {
  return (
    <svg {...sx(size)} className={className}>
      <ellipse cx="16" cy="16" rx="13" ry="7" />
      <text x="16" y="19.5" fontFamily="Brush Script MT, cursive" fontWeight="700" fontSize="9.5" textAnchor="middle" fill="currentColor" fontStyle="italic" stroke="none">Ford</text>
    </svg>
  );
}

export function HondaIcon({ className = "", size = 28 }: BrandIconProps) {
  return (
    <svg {...sx(size)} className={className}>
      <rect x="4" y="8" width="24" height="16" rx="2.5" />
      <path d="M11 12 V20 M21 12 V20 M11 16 H21" strokeWidth="2.2" />
    </svg>
  );
}

export function MitsubishiIcon({ className = "", size = 28 }: BrandIconProps) {
  return (
    <svg {...sx(size)} className={className} fill="currentColor" stroke="none">
      <path d="M16 6 L20 13 L12 13 Z" />
      <path d="M9 17 L13 24 L5 24 Z" />
      <path d="M23 17 L27 24 L19 24 Z" />
    </svg>
  );
}

// ── Map + componente unificado ────────────────────────────────────────

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

export function BrandIcon({ name, className = "", size = 28 }: BrandIconMapProps) {
  const Icon = BRAND_ICON_MAP[name.toLowerCase()];
  if (!Icon) {
    // Fallback genérico: círculo con inicial
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" className={className}>
        <circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <text x="16" y="20" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="11" textAnchor="middle" fill="currentColor">
          {name.charAt(0).toUpperCase()}
        </text>
      </svg>
    );
  }
  return <Icon className={className} size={size} />;
}

export default BrandIcon;
