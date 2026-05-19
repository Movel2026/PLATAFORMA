import React from "react";

interface BrandIconProps {
  className?: string;
  size?: number;
}

// ── Toyota — Tres elipses superpuestas ────────────────────────────────
export function ToyotaIcon({ className = "", size = 36 }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 65" fill="none" stroke="currentColor" className={className}>
      <ellipse cx="50" cy="33" rx="47" ry="28" strokeWidth="5.5" />
      <ellipse cx="50" cy="37" rx="15" ry="26" strokeWidth="5" />
      <ellipse cx="50" cy="24" rx="30" ry="11" strokeWidth="5" />
    </svg>
  );
}

// ── Mazda — Alas en óvalo ─────────────────────────────────────────────
export function MazdaIcon({ className = "", size = 36 }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 60" fill="none" stroke="currentColor" strokeLinecap="round" className={className}>
      <ellipse cx="50" cy="30" rx="47" ry="26" strokeWidth="4" />
      <path d="M14,46 C20,18 38,16 50,34 C62,16 80,18 86,46" strokeWidth="5" />
      <path d="M26,46 C30,28 40,24 50,38 C60,24 70,28 74,46" strokeWidth="4" />
    </svg>
  );
}

// ── Chevrolet — Bowtie ────────────────────────────────────────────────
export function ChevroletIcon({ className = "", size = 36 }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 42" fill="currentColor" stroke="none" className={className}>
      <path d="M2,8 L42,8 L36,34 L2,34 Z" />
      <path d="M58,8 L98,8 L98,34 L64,34 Z" />
    </svg>
  );
}

// ── Kia — Letras KIA ──────────────────────────────────────────────────
export function KiaIcon({ className = "", size = 36 }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 96 44" fill="currentColor" stroke="none" className={className}>
      <path d="M4,6 L4,38 L13,38 L13,26 L24,38 L35,38 L21,22 L34,6 L23,6 L13,20 L13,6 Z" />
      <path d="M40,6 L40,38 L49,38 L49,6 Z" />
      <path d="M63,6 L51,38 L61,38 L64,30 L78,30 L81,38 L91,38 L79,6 Z M67,23 L71,11 L75,23 Z" />
    </svg>
  );
}

// ── Renault — Doble diamante ──────────────────────────────────────────
export function RenaultIcon({ className = "", size = 36 }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="miter" className={className}>
      <path d="M32,4 L58,32 L32,60 L6,32 Z" />
      <path d="M32,14 L50,32 L32,50 L14,32 Z" />
    </svg>
  );
}

// ── Hyundai — H cursiva en óvalo ─────────────────────────────────────
export function HyundaiIcon({ className = "", size = 36 }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 65" fill="none" stroke="currentColor" strokeLinecap="round" className={className}>
      <ellipse cx="50" cy="33" rx="47" ry="28" strokeWidth="4.5" />
      <line x1="30" y1="20" x2="24" y2="46" strokeWidth="6" />
      <line x1="70" y1="20" x2="64" y2="46" strokeWidth="6" />
      <path d="M30,33 Q50,27 64,33" strokeWidth="5.5" />
    </svg>
  );
}

// ── Nissan — Círculo con banda y texto ────────────────────────────────
export function NissanIcon({ className = "", size = 36 }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke="currentColor" className={className}>
      <circle cx="50" cy="50" r="46" strokeWidth="4.5" />
      <rect x="4" y="40" width="92" height="20" fill="currentColor" stroke="none" />
      <text x="50" y="55" fontFamily="Arial, sans-serif" fontSize="13" fontWeight="700" textAnchor="middle" fill="white" stroke="none" letterSpacing="1">NISSAN</text>
    </svg>
  );
}

// ── Ford — Óvalo con script ───────────────────────────────────────────
export function FordIcon({ className = "", size = 36 }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 110 55" fill="none" stroke="currentColor" strokeWidth="3.5" className={className}>
      <ellipse cx="55" cy="28" rx="52" ry="24" />
      <text x="55" y="36" fontFamily="Georgia, 'Times New Roman', serif" fontSize="24" fontWeight="700" fontStyle="italic" textAnchor="middle" fill="currentColor" stroke="none">Ford</text>
    </svg>
  );
}

// ── Honda — H clásica ─────────────────────────────────────────────────
export function HondaIcon({ className = "", size = 36 }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 64" fill="currentColor" stroke="none" className={className}>
      <path d="M8,10 L20,10 L20,28 L60,28 L60,10 L72,10 L72,54 L60,54 L60,36 L20,36 L20,54 L8,54 Z" />
    </svg>
  );
}

// ── Mitsubishi — Tres diamantes ───────────────────────────────────────
export function MitsubishiIcon({ className = "", size = 36 }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="currentColor" stroke="none" className={className}>
      <path d="M32,2 L46,23 L32,28 L18,23 Z" />
      <path d="M16,27 L30,32 L16,58 L2,36 Z" />
      <path d="M48,27 L62,36 L48,58 L34,32 Z" />
    </svg>
  );
}

// ── Volkswagen — VW en círculo ────────────────────────────────────────
export function VolkswagenIcon({ className = "", size = 36 }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="32" cy="32" r="29" strokeWidth="4" />
      <path d="M21,15 L32,33 L43,15" strokeWidth="4.5" />
      <path d="M15,28 L23,47 L32,33 L41,47 L49,28" strokeWidth="4.5" />
    </svg>
  );
}

// ── Suzuki — S estilizada ─────────────────────────────────────────────
export function SuzukiIcon({ className = "", size = 36 }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeLinecap="round" className={className}>
      <path d="M46,14 C46,8 40,5 32,5 C20,5 14,11 14,21 C14,29 20,33 32,37 C44,41 50,45 50,55 C50,61 44,59 32,59 C20,59 14,55 14,48" strokeWidth="6.5" />
      <line x1="14" y1="32" x2="50" y2="32" strokeWidth="3.5" />
    </svg>
  );
}

// ── BMW — Cuadrante propeller en círculo ──────────────────────────────
export function BmwIcon({ className = "", size = 36 }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="currentColor" stroke="none" className={className}>
      {/* Outer ring */}
      <path d="M32,3 A29,29 0 1,1 31.99,3 Z" fill="none" stroke="currentColor" strokeWidth="4" />
      <circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" strokeWidth="4" />
      <circle cx="32" cy="32" r="16" fill="none" stroke="currentColor" strokeWidth="2.5" />
      {/* Top-right quadrant filled */}
      <path d="M32,32 L32,3 A29,29 0 0,1 61,32 L48,32 A16,16 0 0,0 32,16 Z" />
      {/* Bottom-left quadrant filled */}
      <path d="M32,32 L32,61 A29,29 0 0,1 3,32 L16,32 A16,16 0 0,0 32,48 Z" />
      {/* Cross lines */}
      <rect x="30.5" y="3" width="3" height="58" fill="none" stroke="currentColor" strokeWidth="0" />
      <line x1="32" y1="3" x2="32" y2="61" stroke="white" strokeWidth="2.5" />
      <line x1="3" y1="32" x2="61" y2="32" stroke="white" strokeWidth="2.5" />
    </svg>
  );
}

// ── Mercedes-Benz — Estrella de 3 puntas en círculo ───────────────────
export function MercedesIcon({ className = "", size = 36 }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="currentColor" stroke="none" className={className}>
      <circle cx="32" cy="32" r="29" fill="none" stroke="currentColor" strokeWidth="4" />
      {/* 3-pointed star: top, bottom-right, bottom-left */}
      {/* Top arm */}
      <path d="M30.5,32 L30.5,6 L32,4 L33.5,6 L33.5,32 Z" />
      {/* Bottom-right arm */}
      <path d="M32,33 L54,45 L55.5,47 L53,48 L32,36 Z" />
      {/* Bottom-left arm */}
      <path d="M32,33 L10,45 L8.5,47 L11,48 L32,36 Z" />
      {/* Center circle */}
      <circle cx="32" cy="32" r="5" />
    </svg>
  );
}

// ── Audi — Cuatro anillos ─────────────────────────────────────────────
export function AudiIcon({ className = "", size = 36 }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="4" className={className}>
      <circle cx="14" cy="20" r="12" />
      <circle cx="38" cy="20" r="12" />
      <circle cx="62" cy="20" r="12" />
      <circle cx="86" cy="20" r="12" />
    </svg>
  );
}

// ── Jeep — Texto bold ─────────────────────────────────────────────────
export function JeepIcon({ className = "", size = 36 }: BrandIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 48" fill="currentColor" stroke="none" className={className}>
      <text x="40" y="36" fontFamily="Impact, Arial Black, sans-serif" fontSize="32" fontWeight="900" textAnchor="middle" fill="currentColor">JEEP</text>
    </svg>
  );
}

// ── BMW alias ─────────────────────────────────────────────────────────
export { BmwIcon as BMWIcon };

// ── Map ───────────────────────────────────────────────────────────────
const BRAND_ICON_MAP: Record<string, React.FC<BrandIconProps>> = {
  toyota:         ToyotaIcon,
  mazda:          MazdaIcon,
  chevrolet:      ChevroletIcon,
  kia:            KiaIcon,
  renault:        RenaultIcon,
  hyundai:        HyundaiIcon,
  nissan:         NissanIcon,
  ford:           FordIcon,
  honda:          HondaIcon,
  mitsubishi:     MitsubishiIcon,
  volkswagen:     VolkswagenIcon,
  suzuki:         SuzukiIcon,
  bmw:            BmwIcon,
  "mercedes-benz":MercedesIcon,
  mercedes:       MercedesIcon,
  audi:           AudiIcon,
  jeep:           JeepIcon,
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
