/**
 * Exporta un array de objetos a un archivo CSV descargable.
 * Compatible con Excel (BOM UTF-8 + separador coma + escaping de quotes).
 *
 * Uso:
 *   exportToCSV(publicaciones, "publicaciones-movel-2026", [
 *     { key: "id", label: "ID" },
 *     { key: "marca", label: "Marca" },
 *     ...
 *   ]);
 */

export interface CSVColumn<T> {
  key: keyof T | string;
  label: string;
  /** Transforma el valor antes de escribirlo (ej: formatear fechas) */
  format?: (val: unknown, row: T) => string | number;
}

function esc(val: unknown): string {
  if (val === null || val === undefined) return "";
  const s = typeof val === "object" ? JSON.stringify(val) : String(val);
  // Escapar comillas duplicándolas y envolver entre quotes si contiene , " o salto de línea
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function exportToCSV<T extends Record<string, unknown>>(
  rows: T[],
  filename: string,
  columns: CSVColumn<T>[],
): void {
  const header = columns.map((c) => esc(c.label)).join(",");
  const lines = rows.map((row) =>
    columns
      .map((c) => {
        const raw = (row as Record<string, unknown>)[c.key as string];
        const v = c.format ? c.format(raw, row) : raw;
        return esc(v);
      })
      .join(","),
  );

  // BOM para que Excel detecte UTF-8 (sin esto pierde tildes y ñ)
  const csv = "﻿" + [header, ...lines].join("\r\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
