"use client";

import { useEffect, useRef } from "react";

/**
 * MovelLogo — Logo oficial Movel 2.0
 *
 * Diseño: "MOVEL" en bold compacto, con velocímetro INTEGRADO dentro de la letra O.
 * La aguja apunta diagonal (estilo speedometer) y hace un sweep sutil al cargar.
 *
 * Variantes:
 *   - "primary":        gradiente azul Movel sobre fondo claro (default)
 *   - "white":          letras blancas sobre fondos oscuros
 *   - "mono":           negro/azul plano (impresión, favicons grandes)
 *   - "gradient-light": degradado claro para hero oscuro
 */
interface Props {
  variant?: "primary" | "white" | "mono" | "gradient-light";
  size?: number;       // altura aproximada en px
  animate?: boolean;
  className?: string;
}

export function MovelLogo({
  variant = "primary",
  size = 36,
  animate = true,
  className = "",
}: Props) {
  const needleRef = useRef<SVGGElement>(null);

  // Sweep sutil: la aguja arranca un poco más arriba y baja hacia su posición final
  useEffect(() => {
    if (!animate || !needleRef.current) return;
    const needle = needleRef.current;
    needle.style.transformOrigin = "55px 22px";
    needle.style.transform = "rotate(-60deg)";
    needle.style.transition = "transform 1100ms cubic-bezier(0.16, 1, 0.3, 1)";
    const t = setTimeout(() => {
      if (needleRef.current) needleRef.current.style.transform = "rotate(0deg)";
    }, 150);
    return () => clearTimeout(t);
  }, [animate]);

  // Tamaño: viewBox de 220x44 → mantiene proporción del texto MOVEL compacto
  const ratio = size / 44;
  const w = 220 * ratio;
  const h = 44 * ratio;

  // Colores según variante
  const textFill = (() => {
    if (variant === "primary")        return "url(#movel-grad-primary)";
    if (variant === "white")          return "#ffffff";
    if (variant === "mono")           return "#0B1E4E";
    return "url(#movel-grad-light)";
  })();

  const ringColor   = variant === "white" || variant === "gradient-light" ? "#ffffff" : "#0B1E4E";
  const needleColor = variant === "white" || variant === "gradient-light" ? "#ffffff" : "#0B1E4E";
  const tickColor   = variant === "white" || variant === "gradient-light" ? "#ffffff" : "#0B1E4E";

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 220 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="MOVEL"
      role="img"
      className={className}
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id="movel-grad-primary" x1="0" y1="0" x2="220" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0B1E4E" />
          <stop offset="50%" stopColor="#1B57C0" />
          <stop offset="100%" stopColor="#3F8CFF" />
        </linearGradient>
        <linearGradient id="movel-grad-light" x1="0" y1="0" x2="220" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#E5EEFF" />
          <stop offset="100%" stopColor="#A5C6FF" />
        </linearGradient>
      </defs>

      {/* MOVEL — todas las letras juntas en un solo bloque */}
      <text
        x="0" y="36"
        fontFamily="'Archivo Black', 'Arial Black', Impact, sans-serif"
        fontSize="44"
        fontWeight="900"
        letterSpacing="-1"
        fill={textFill}
      >
        MOVEL
      </text>

      {/* Velocímetro INSCRITO en la letra O (centrado aproximadamente en x=55) */}
      <g>
        {/* Anillo interior del velocímetro (decorativo, no tapa la O) */}
        <circle cx="55" cy="22" r="10" fill="none" stroke={ringColor} strokeWidth="1" opacity="0.55" />

        {/* Marcas de ticks alrededor del dial */}
        <g stroke={tickColor} strokeWidth="1.4" strokeLinecap="round" opacity="0.85">
          <line x1="55"   y1="13"   x2="55"   y2="15.2" />
          <line x1="61.5" y1="15.5" x2="60"   y2="17"   />
          <line x1="64"   y1="22"   x2="61.8" y2="22"   />
          <line x1="61.5" y1="28.5" x2="60"   y2="27"   />
          <line x1="48.5" y1="28.5" x2="50"   y2="27"   />
          <line x1="46"   y1="22"   x2="48.2" y2="22"   />
          <line x1="48.5" y1="15.5" x2="50"   y2="17"   />
        </g>

        {/* Aguja del velocímetro (apunta diagonal hacia abajo-derecha) */}
        <g ref={needleRef}>
          <path
            d="M 55 22 L 63.5 26.5 L 55 23.4 Z"
            fill={needleColor}
          />
        </g>

        {/* Eje central */}
        <circle cx="55" cy="22" r="1.6" fill={needleColor} />
      </g>
    </svg>
  );
}

export default MovelLogo;
