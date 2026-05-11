// Análisis detallado del Excel
const XLSX = require("xlsx");
const fs = require("fs");

const filePath = "C:\\Users\\Juane\\OneDrive\\Documentos\\JUAN ESTEBAN\\EMPRENDIMIENTOS\\MOVEL\\Avaluo e Impuestos de vehiculos 2026 - Calculadora.xlsx";
const wb = XLSX.readFile(filePath);

// === Hoja 1: Calculadora — sólo las primeras filas para entender ===
console.log("\n========== CALCULADORA (primeras 20 filas) ==========");
const calc = XLSX.utils.sheet_to_json(wb.Sheets["Calculadora"], { header: 1, defval: "" });
calc.slice(0, 20).forEach((row, i) => {
  // Eliminar cells vacías al final para que sea más legible
  const cleaned = row.filter(c => c !== "" && c !== null);
  if (cleaned.length > 0) console.log(`  [${i}]`, JSON.stringify(cleaned).slice(0, 300));
});

// === Hoja 2: Bases Gravables — RANGOS DE IMPUESTO ===
console.log("\n========== BASES GRAVABLES (TARIFAS DE IMPUESTO) ==========");
const bases = XLSX.utils.sheet_to_json(wb.Sheets["Bases Gravables"], { header: 1, defval: "" });
console.log(`Total filas: ${bases.length}`);
bases.forEach((row, i) => {
  const cleaned = row.filter(c => c !== "" && c !== null);
  if (cleaned.length > 0) console.log(`  [${i}]`, JSON.stringify(cleaned).slice(0, 200));
});

// === Hoja: Impuesto Rodamiento ===
console.log("\n========== IMPUESTO RODAMIENTO ==========");
const rod = XLSX.utils.sheet_to_json(wb.Sheets["Impuesto Rodamiento"], { header: 1, defval: "" });
console.log(`Total filas: ${rod.length}`);
rod.slice(0, 30).forEach((row, i) => {
  const cleaned = row.filter(c => c !== "" && c !== null);
  if (cleaned.length > 0) console.log(`  [${i}]`, JSON.stringify(cleaned).slice(0, 250));
});

// === Pivot - Marca (lista de marcas) ===
console.log("\n========== PIVOT MARCA ==========");
const marcas = XLSX.utils.sheet_to_json(wb.Sheets["Pivot - Marca"], { header: 1, defval: "" });
console.log(`Total filas: ${marcas.length}`);
marcas.slice(0, 15).forEach((row, i) => {
  const cleaned = row.filter(c => c !== "" && c !== null);
  if (cleaned.length > 0) console.log(`  [${i}]`, JSON.stringify(cleaned).slice(0, 200));
});

// === Pivot - Linea (catálogo completo) ===
console.log("\n========== PIVOT LINEA (primeras 30 filas) ==========");
const lineas = XLSX.utils.sheet_to_json(wb.Sheets["Pivot - Linea"], { header: 1, defval: "" });
console.log(`Total filas: ${lineas.length}`);
lineas.slice(0, 30).forEach((row, i) => {
  const cleaned = row.filter(c => c !== "" && c !== null);
  if (cleaned.length > 0) console.log(`  [${i}]`, JSON.stringify(cleaned).slice(0, 250));
});

// === _Lookup ===
console.log("\n========== _LOOKUP (primeras 20 filas) ==========");
const lookup = XLSX.utils.sheet_to_json(wb.Sheets["_Lookup"], { header: 1, defval: "" });
console.log(`Total filas: ${lookup.length}`);
lookup.slice(0, 20).forEach((row, i) => {
  const cleaned = row.filter(c => c !== "" && c !== null);
  if (cleaned.length > 0) console.log(`  [${i}]`, JSON.stringify(cleaned).slice(0, 250));
});

// Guardar todo el lookup para inspección
fs.writeFileSync("scripts/lookup-full.json", JSON.stringify(lookup, null, 2));
fs.writeFileSync("scripts/lineas-full.json", JSON.stringify(lineas, null, 2));
fs.writeFileSync("scripts/bases-full.json", JSON.stringify(bases, null, 2));
fs.writeFileSync("scripts/rodamiento-full.json", JSON.stringify(rod, null, 2));
console.log("\n✓ Archivos JSON completos guardados en scripts/");
