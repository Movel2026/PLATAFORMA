"use client";

/**
 * MovelLogo — Réplica exacta del logo oficial de Movel.
 *
 * Diseño: "MOVEL" en una sola palabra (bold, sin itálica, letras tight).
 * La letra O contiene una aguja de velocímetro apuntando ~15° arriba-derecha
 * con un punto pivote en el centro. Sin anillos extra, sin ticks.
 *
 * Variantes:
 *   - "primary":        gradiente azul Movel sobre fondo claro
 *   - "white":          blanco sólido sobre fondos oscuros (default del hero)
 *   - "mono":           azul navy plano
 *   - "gradient-light": degradado claro
 */
interface Props {
  variant?: "primary" | "white" | "mono" | "gradient-light";
  size?: number;       // altura en px (default 44)
  animate?: boolean;   // mantenido por compatibilidad con la API anterior
  className?: string;
}

export function MovelLogo({
  variant = "primary",
  size = 44,
  animate = true, // eslint-disable-line @typescript-eslint/no-unused-vars
  className = "",
}: Props) {
  // viewBox 240 × 56 → la altura real es 56 y la palabra ocupa todo el ancho
  const ratio = size / 56;
  const w = 240 * ratio;
  const h = 56 * ratio;

  const textFill = (() => {
    if (variant === "primary")        return "url(#movel-grad-primary)";
    if (variant === "white")          return "#ffffff";
    if (variant === "mono")           return "#0B1E4E";
    return "url(#movel-grad-light)";
  })();
  // El acento del velocímetro siempre va del color complementario fuerte:
  // blanco si el texto es color, color si el texto es blanco
  const accent = variant === "white" || variant === "gradient-light" ? "#0B1E4E" : "#ffffff";
  const needleColor = variant === "white" || variant === "gradient-light" ? "#ffffff" : "#ffffff";

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 240 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="MOVEL"
      role="img"
      className={className}
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id="movel-grad-primary" x1="0" y1="0" x2="240" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#0B1E4E" />
          <stop offset="50%"  stopColor="#1B57C0" />
          <stop offset="100%" stopColor="#3F8CFF" />
        </linearGradient>
        <linearGradient id="movel-grad-light" x1="0" y1="0" x2="240" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#ffffff" />
          <stop offset="55%"  stopColor="#E5EEFF" />
          <stop offset="100%" stopColor="#A5C6FF" />
        </linearGradient>
      </defs>

      {/*
        Texto MOVEL — usamos Impact / Archivo Black para que las letras sean
        muy heavy y compactas, con letter-spacing negativo para que se peguen.
        textLength fuerza el ancho exacto del bloque y mantiene la consistencia.
      */}
      <text
        x="0"
        y="46"
        fontFamily="Impact, 'Archivo Black', 'Arial Black', sans-serif"
        fontSize="60"
        fontWeight="900"
        letterSpacing="0"
        fill={textFill}
        textLength="240"
        lengthAdjust="spacingAndGlyphs"
      >
        MOVEL
      </text>

      {/*
        Aguja del velocímetro DENTRO de la letra O.
        Posición del centro de la O en este viewBox: x≈68, y≈28
        La aguja apunta arriba-derecha (~15° sobre la horizontal),
        con forma de pointer (gruesa en la base, fina en la punta).
      */}
      <g transform="translate(68 28)">
        {/* Pivote / base (un círculo pequeño que sirve como ancla visual) */}
        <circle cx="0" cy="0" r="2" fill={needleColor} />
        {/* Aguja: triángulo apuntando arriba-derecha. Rotado ~-15° para inclinarla. */}
        <g transform="rotate(-15)">
          <path
            d="M 0 -1.6 L 10.5 -0.6 L 10.5 0.6 L 0 1.6 Z"
            fill={needleColor}
          />
          {/* Punta redondeada de la aguja */}
          <circle cx="10.5" cy="0" r="0.9" fill={needleColor} />
        </g>
        {/* Tapón central (encima de todo) */}
        <circle cx="0" cy="0" r="1.6" fill={accent} opacity="0" />
      </g>
    </svg>
  );
}

export default MovelLogo;
