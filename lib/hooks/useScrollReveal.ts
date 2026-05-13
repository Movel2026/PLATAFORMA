"use client";

import { useEffect } from "react";

/**
 * Activa los elementos con clase `.reveal` cuando entran al viewport,
 * agregándoles la clase `.visible`. Stagger nativo vía reveal-delay-N.
 *
 * Llamar una vez en el layout o en el componente padre:
 *   useScrollReveal();
 */
export function useScrollReveal(rootSelector = ".reveal") {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const els = Array.from(document.querySelectorAll<HTMLElement>(rootSelector));
    if (!els.length) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      els.forEach((el) => el.classList.add("visible"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [rootSelector]);
}
