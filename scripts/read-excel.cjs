// CommonJS version
const XLSX = require("xlsx");

const filePath = "C:\\Users\\Juane\\OneDrive\\Documentos\\JUAN ESTEBAN\\EMPRENDIMIENTOS\\MOVEL\\Avaluo e Impuestos de vehiculos 2026 - Calculadora.xlsx";

const wb = XLSX.readFile(filePath);
console.log("\n=== HOJAS DEL EXCEL ===");
console.log(wb.SheetNames);

for (const sheetName of wb.SheetNames) {
  console.log(`\n=== HOJA: "${sheetName}" ===`);
  const ws = wb.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
  console.log(`Filas: ${data.length}`);
  data.slice(0, 30).forEach((row, i) => {
    console.log(`  [${i}]`, JSON.stringify(row).slice(0, 300));
  });
  if (data.length > 30) console.log(`  ... y ${data.length - 30} filas más`);
}
