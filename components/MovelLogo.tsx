"use client";

import React from "react";
import Image from "next/image";

/**
 * MovelLogo — Logo oficial Movel (PNG transparente).
 *
 * Usa /public/logo-movel.png, extraído del archivo de marca oficial.
 * La API se mantiene compatible con la versión anterior (variant, size, animate, className).
 *
 * Variantes:
 *   - "white" / "gradient-light":  logo blanco original (default, óptimo en fondos oscuros)
 *   - "primary" / "mono":          logo invertido a azul navy con filter CSS (para fondos claros)
 */
interface Props {
  variant?: "primary" | "white" | "mono" | "gradient" | "gradient-light";
  /** Altura aproximada en px (32, 40, 88). */
  size?: number;
  /** Mantenido por compatibilidad con la API anterior. */
  animate?: boolean;
  className?: string;
}

// Relación de aspecto del PNG oficial: 582 × 173 ≈ 3.36:1
const LOGO_W = 582;
const LOGO_H = 173;
const ASPECT = LOGO_W / LOGO_H;

export function MovelLogo({
  variant = "primary",
  size = 44,
  animate = true, // eslint-disable-line @typescript-eslint/no-unused-vars
  className = "",
}: Props) {
  const height = size;
  const width  = Math.round(size * ASPECT);

  // Variante "gradient": usa CSS mask para colorear el logo con el mismo
  // gradiente que la clase .gradient-text (sin depender de background-clip).
  if (variant === "gradient") {
    return (
      <span
        className={className}
        aria-label="MOVEL"
        style={{
          display: "inline-block",
          width,
          height,
          flexShrink: 0,
          background: "linear-gradient(135deg, #0B1E4E 0%, #1B57C0 50%, #3F8CFF 100%)",
          WebkitMaskImage: "url(/logo-movel.png)",
          WebkitMaskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskImage: "url(/logo-movel.png)",
          maskSize: "contain",
          maskRepeat: "no-repeat",
          maskPosition: "center",
        } as React.CSSProperties}
      />
    );
  }

  // El PNG es blanco. Para variantes "primary" y "mono", invertimos a navy con filter CSS.
  const filter = (() => {
    if (variant === "primary" || variant === "mono") {
      return "invert(13%) sepia(73%) saturate(2010%) hue-rotate(213deg) brightness(95%) contrast(102%)";
    }
    return undefined;
  })();

  return (
    <Image
      src="/logo-movel.png"
      alt="MOVEL"
      width={width}
      height={height}
      priority
      className={className}
      style={{
        display: "block",
        height,
        width,
        objectFit: "contain",
        filter,
      }}
    />
  );
}

export default MovelLogo;
