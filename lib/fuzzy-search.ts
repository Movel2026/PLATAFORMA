/**
 * fuzzy-search — Utilidad simple para búsqueda tolerante a typos y formatos.
 *
 * Maneja:
 *   - Case insensitive: "BMW" === "bmw"
 *   - Tildes: "mazdá" === "mazda"
 *   - Separadores: "cx-30" === "cx30" === "cx 30"
 *   - Typos pequeños: "chvrolet" ≈ "chevrolet" (Levenshtein ≤ 2)
 *   - Substrings: "ford" matchea "Ford Explorer 2022"
 *
 * Uso:
 *   const matches = fuzzyMatch("cx30", "Mazda CX-30 Touring 2023"); // true
 *   const score   = fuzzyScore("chvrolet", "Chevrolet Onix"); // 0..1 (1 = match perfecto)
 */

// Normaliza texto: lowercase + sin tildes + alphanumeric only
export function normalize(s: string): string {
  if (!s) return "";
  return s
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "") // quita tildes
    .replace(/[^a-z0-9]+/g, "");                       // solo a-z y 0-9
}

// Distancia de Levenshtein (clásico, iterativo, O(n*m))
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const dp: number[] = Array(b.length + 1).fill(0).map((_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = dp[0];
    dp[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = dp[j];
      dp[j] = a[i - 1] === b[j - 1]
        ? prev
        : 1 + Math.min(prev, dp[j - 1], dp[j]);
      prev = tmp;
    }
  }
  return dp[b.length];
}

/**
 * fuzzyMatch — retorna true si `needle` matchea `haystack` con tolerancia.
 *
 * Reglas (en orden):
 *   1. Si needle normalizado es substring de haystack normalizado → match
 *   2. Para cada palabra del needle, si alguna palabra de haystack tiene
 *      Levenshtein ≤ maxDistance(needleWord.length) → match
 */
export function fuzzyMatch(needle: string, haystack: string): boolean {
  const n = normalize(needle);
  const h = normalize(haystack);
  if (!n || !h) return !n; // needle vacío matchea todo

  // 1. Substring directo (cubre cx30 → cx30touring2023, toyot → toyotacorolla)
  if (h.includes(n)) return true;

  // 2. Coincidencia por tokens con tolerancia a typos
  const needleWords = needle.toLowerCase().split(/\s+/).map(normalize).filter(Boolean);
  const haystackWords = haystack.toLowerCase().split(/[\s\-_·,]+/).map(normalize).filter(Boolean);

  return needleWords.every((nw) => {
    if (haystackWords.some((hw) => hw.includes(nw) || nw.includes(hw))) return true;
    // Tolerancia: hasta 2 caracteres de error para palabras de 5+ letras, 1 para 4 letras
    const maxDist = nw.length >= 7 ? 2 : nw.length >= 4 ? 1 : 0;
    return haystackWords.some((hw) => {
      if (Math.abs(hw.length - nw.length) > maxDist) return false;
      return levenshtein(nw, hw) <= maxDist;
    });
  });
}

/**
 * fuzzyScore — devuelve un score 0..1 (1 = match perfecto)
 * Útil para ordenar resultados por relevancia.
 */
export function fuzzyScore(needle: string, haystack: string): number {
  const n = normalize(needle);
  const h = normalize(haystack);
  if (!n) return 0;
  if (!h) return 0;
  if (h === n) return 1;
  if (h.startsWith(n)) return 0.95;
  if (h.includes(n)) return 0.85;
  if (fuzzyMatch(needle, haystack)) return 0.7;
  return 0;
}
