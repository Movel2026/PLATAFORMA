"use client";

import { useEffect, useRef } from "react";

/**
 * MovelLogo — Logo oficial Movel con velocímetro animado.
 *
 * Variantes:
 *   - "primary":   gradiente azul Movel sobre fondo claro (default)
 *   - "white":     letras blancas sobre fondos oscuros
 *   - "mono":      negro plano (impresión, favicons grandes)
 *   - "gradient-light": degradado claro para hero oscuro
 *
 * La aguja del velocímetro hace un sweep 0° → 220° al cargar (una sola vez por sesión).
 */
interface Props {
  variant?: "primary" | "white" | "mono" | "gradient-light";
  /** Altura aproximada en px (32, 40, 56). El SVG es responsive. */
  size?: number;
  /** Animar la aguja al montar. Por defecto true en cliente. */
  animate?: boolean;
  className?: string;
}

export function MovelLogo({
  variant = "primary",
  size = 36,
  animate = true,
  className = "",
}: Props) {
  const needleRef = useRef<SVGLineElement>(null);

  // Sweep de la aguja: 0° → 220° una sola vez al montar
  useEffect(() => {
    if (!animate || !needleRef.current) return;
    const needle = needleRef.current;
    // Reset
    needle.style.transformOrigin = "36px 16px";
    needle.style.transform = "rotate(-130deg)";
    needle.style.transition = "transform 900ms cubic-bezier(0.16, 1, 0.3, 1)";
    // Trigger animation in next frame
    const t = setTimeout(() => {
      if (needleRef.current) needleRef.current.style.transform = "rotate(90deg)";
    }, 100);
    return () => clearTimeout(t);
  }, [animate]);

  const ratio = size / 36; // viewBox h = 36
  const w = 120 * ratio;
  const h = 36 * ratio;

  // Colores según variante
  const fill = (() => {
    if (variant === "primary") return "url(#movel-grad-primary)";
    if (variant === "white") return "white";
    if (variant === "mono") return "#0B1E4E";
    return "url(#movel-grad-light)";
  })();

  const dialBg     = variant === "white" || variant === "gradient-light" ? "rgba(255,255,255,0.15)" : "#0B1E4E";
  const dialStroke = variant === "white" || variant === "gradient-light" ? "white" : "white";
  const tickColor  = variant === "white" || variant === "gradient-light" ? "white" : "white";

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 120 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="MOVEL"
      role="img"
      className={className}
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id="movel-grad-primary" x1="0" y1="0" x2="120" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0B1E4E" />
          <stop offset="50%" stopColor="#1B57C0" />
          <stop offset="100%" stopColor="#3F8CFF" />
        </linearGradient>
        <linearGradient id="movel-grad-light" x1="0" y1="0" x2="120" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A5C6FF" />
          <stop offset="55%" stopColor="#D7E5FF" />
          <stop offset="100%" stopColor="#ffffff" />
        </linearGradient>
      </defs>

      {/* M */}
      <text
        x="0" y="28"
        fontFamily="Arial Black, Archivo Black, sans-serif"
        fontSize="30" fontWeight="900" fontStyle="italic"
        fill={fill}
      >M</text>

      {/* O con velocímetro */}
      <g>
        <text
          x="23" y="28"
          fontFamily="Arial Black, Archivo Black, sans-serif"
          fontSize="30" fontWeight="900" fontStyle="italic"
          fill={fill}
        >O</text>
        {/* Esfera del velocímetro */}
        <circle cx="36" cy="16" r="7" fill={dialBg} opacity="0.85" />
        <circle cx="36" cy="16" r="7" fill="none" stroke={dialStroke} strokeWidth="1.2" />
        {/* Aguja (animada) */}
        <line
          ref={needleRef}
          x1="36" y1="16" x2="36" y2="10"
          stroke={tickColor}
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        {/* Eje */}
        <circle cx="36" cy="16" r="1.2" fill={tickColor} />
        {/* Marcas cardinales */}
        <line x1="29.5" y1="16" x2="31"   y2="16" stroke={tickColor} strokeWidth="1" strokeLinecap="round" />
        <line x1="36"   y1="9.5" x2="36"  y2="11" stroke={tickColor} strokeWidth="1" strokeLinecap="round" />
        <line x1="42.5" y1="16" x2="41"   y2="16" stroke={tickColor} strokeWidth="1" strokeLinecap="round" />
      </g>

      {/* VEL */}
      <text
        x="51" y="28"
        fontFamily="Arial Black, Archivo Black, sans-serif"
        fontSize="30" fontWeight="900" fontStyle="italic"
        fill={fill}
      >VEL</text>
    </svg>
  );
}

export default MovelLogo;
