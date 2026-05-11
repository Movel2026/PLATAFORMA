// Extrae el catalogo de vehiculos y las tarifas de impuesto a JSON estructurado
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

const filePath = "C:\\Users\\Juane\\OneDrive\\Documentos\\JUAN ESTEBAN\\EMPRENDIMIENTOS\\MOVEL\\Avaluo e Impuestos de vehiculos 2026 - Calculadora.xlsx";
const wb = XLSX.readFile(filePath);

// ============== 1. TARIFAS DE IMPUESTO ==============
const rod = XLSX.utils.sheet_to_json(wb.Sheets["Impuesto Rodamiento"], { header: 1, defval: "" });
// Filas 4, 5, 6 son los 3 rangos
const taxBrackets = [];
for (let i = 4; i <= 6; i++) {
  const r = rod[i];
  taxBrackets.push({
    rango:    r[0],
    desde:    Number(r[1]),
    hasta:    r[2] === "Sin límite" ? null : Number(r[2]),
    tarifa:   Number(r[3]),
    descripcion: r[4],
  });
}
console.log("✓ Tarifas de impuesto extraídas:", taxBrackets.length);

// ============== 2. CATÁLOGO DE VEHÍCULOS (Pivot - Linea) ==============
const lineas = XLSX.utils.sheet_to_json(wb.Sheets["Pivot - Linea"], { header: 1, defval: "" });

// Header fila 1: ["MARCA","LÍNEA","2001 y Ant.",2002,2003,...,2025,"TOTAL"]
const yearHeaders = lineas[1].slice(2, 27); // 25 columnas de años

// Crear catalogo: { MARCA: [ { linea, avaluo: { "2001": valor, "2002": valor, ... } } ] }
const catalog = {};
let totalVehicles = 0;

for (let i = 2; i < lineas.length; i++) {
  const row = lineas[i];
  const marca = String(row[0] || "").trim();
  const linea = String(row[1] || "").trim();
  if (!marca || !linea) continue;
  // Saltar fila de totales si la hay
  if (marca.toLowerCase().includes("total")) continue;

  const avaluo = {};
  for (let y = 0; y < yearHeaders.length; y++) {
    const yearKey = String(yearHeaders[y]).replace(" y Ant.", "");
    const val = Number(row[2 + y]) || 0;
    // El valor está en millones COP — convertir a COP enteros
    avaluo[yearKey] = Math.round(val * 1_000_000);
  }

  if (!catalog[marca]) catalog[marca] = [];
  catalog[marca].push({ linea, avaluo });
  totalVehicles++;
}

console.log(`✓ Catálogo extraído: ${Object.keys(catalog).length} marcas, ${totalVehicles} líneas`);

// ============== 3. GUARDAR ARCHIVOS ==============
const outDir = path.join(__dirname, "..", "lib", "catalog-data");
fs.mkdirSync(outDir, { recursive: true });

// Tarifas
fs.writeFileSync(
  path.join(outDir, "tax-brackets.json"),
  JSON.stringify(taxBrackets, null, 2)
);

// Lista de marcas (solo nombres, ordenadas alfabéticamente, sólo con >= 1 línea)
const brands = Object.keys(catalog)
  .filter(b => catalog[b].length > 0)
  .sort();
fs.writeFileSync(
  path.join(outDir, "brands.json"),
  JSON.stringify(brands, null, 2)
);

// Catálogo completo en un solo archivo (compacto)
fs.writeFileSync(
  path.join(outDir, "catalog.json"),
  JSON.stringify(catalog)
);

// Versión "popular" con marcas más relevantes (sólo top marcas con muchas líneas)
const popularBrands = brands.filter(b => catalog[b].length >= 5);
const popularCatalog = {};
popularBrands.forEach(b => { popularCatalog[b] = catalog[b]; });
fs.writeFileSync(
  path.join(outDir, "catalog-popular.json"),
  JSON.stringify(popularCatalog)
);

// Estadísticas
const stats = {
  totalMarcas: brands.length,
  marcasPopulares: popularBrands.length,
  totalLineas: totalVehicles,
  top10MarcasConMasLineas: brands
    .map(b => ({ marca: b, lineas: catalog[b].length }))
    .sort((a, b) => b.lineas - a.lineas)
    .slice(0, 10),
};
fs.writeFileSync(
  path.join(outDir, "stats.json"),
  JSON.stringify(stats, null, 2)
);

console.log("\n=== ESTADÍSTICAS ===");
console.log(JSON.stringify(stats, null, 2));

// Tamaños de archivo
console.log("\n=== TAMAÑOS DE ARCHIVO ===");
fs.readdirSync(outDir).forEach(f => {
  const stat = fs.statSync(path.join(outDir, f));
  console.log(`  ${f}: ${(stat.size / 1024).toFixed(1)} KB`);
});
