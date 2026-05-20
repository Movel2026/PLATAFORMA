import Image from "next/image";

interface BrandIconProps {
  name: string;
  className?: string;
  size?: number;
}

// Mapeo de marca → archivo PNG en /public/icons/marcas/
const BRAND_FILE: Record<string, string> = {
  audi:            "audi",
  bmw:             "bmw",
  byd:             "byd",
  chevrolet:       "chevrolet",
  dodge:           "dodge",
  fiat:            "fiat",
  ford:            "ford",
  honda:           "honda",
  hyundai:         "hyundai",
  isuzu:           "isuzu",
  jeep:            "jeep",
  kia:             "kia",
  mazda:           "mazda",
  "mercedes-benz": "mercedes",
  mercedes:        "mercedes",
  mini:            "mini",
  nissan:          "nissan",
  porsche:         "porsche",
  ram:             "ram",
  renault:         "renault",
  toyota:          "toyota",
  volkswagen:      "volkswagen",
};

export function BrandIcon({ name, className = "", size = 36 }: BrandIconProps) {
  const file = BRAND_FILE[name.toLowerCase()];
  if (!file) {
    // Fallback: inicial dentro de un círculo
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" className={className}>
        <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="3.5" />
        <text
          x="32" y="42"
          fontFamily="Archivo Black, Arial Black, sans-serif"
          fontSize="26" fontWeight="900"
          textAnchor="middle" fill="currentColor"
        >
          {name.charAt(0).toUpperCase()}
        </text>
      </svg>
    );
  }
  // Caja cuadrada con la imagen contenida — todos los logos lucen del mismo
  // tamaño visual aunque el aspect ratio interno varíe (Ford ancho, Mercedes alto).
  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={`/icons/marcas/${file}.png`}
        alt={`${name} logo`}
        fill
        sizes={`${size}px`}
        className="object-contain"
      />
    </div>
  );
}

export default BrandIcon;
