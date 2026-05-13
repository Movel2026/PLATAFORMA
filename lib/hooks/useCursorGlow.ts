"use client";

import { useCallback } from "react";

/**
 * Hook que retorna handlers de mousemove/mouseleave
 * para actualizar las variables CSS --mx y --my dentro de
 * un elemento con clase `.cursor-glow`.
 *
 * Uso:
 *   const glow = useCursorGlow();
 *   <button className="cursor-glow" {...glow}>…</button>
 */
export function useCursorGlow() {
  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--mx", `${x}%`);
    el.style.setProperty("--my", `${y}%`);
  }, []);

  const onMouseLeave = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.removeProperty("--mx");
    e.currentTarget.style.removeProperty("--my");
  }, []);

  return { onMouseMove, onMouseLeave };
}
