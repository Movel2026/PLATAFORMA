// Extrae los PNG embebidos en los SVG de Canva (carrocerías + logos marcas)
// y los guarda como archivos individuales en public/icons/.
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

function extract(svgPath, outDir, prefix) {
  if (!fs.existsSync(svgPath)) {
    console.error("NO EXISTE:", svgPath);
    return [];
  }
  const data = fs.readFileSync(svgPath, "utf8");
  // Captura cualquier <g ... transform="matrix(...)"> seguido de <image> con base64.
  // Filtramos duplicados (shadows de Canva usan otro filter pero mismo contenido) por hash.
  const blockRe =
    /<g[^>]*transform="matrix\(([^)]+)\)"[^>]*>\s*<image[^>]*xlink:href="data:image\/png;base64,([^"]+)"/g;
  let m,
    idx = 0;
  const items = [];
  while ((m = blockRe.exec(data))) {
    const matrix = m[1].split(",").map((s) => parseFloat(s.trim()));
    const [sx, , , sy, tx, ty] = matrix;
    const b64 = m[2];
    const hash = crypto.createHash("sha1").update(b64).digest("hex").slice(0, 8);
    items.push({ idx, tx, ty, sx, sy, hash, b64 });
    idx++;
  }
  // Dedup por hash
  const seen = new Set();
  const unique = [];
  for (const it of items) {
    if (seen.has(it.hash)) continue;
    seen.add(it.hash);
    unique.push(it);
  }
  // Filas: agrupar por ty redondeado a 50 px
  unique.sort((a, b) => {
    const ra = Math.round(a.ty / 50);
    const rb = Math.round(b.ty / 50);
    if (ra !== rb) return ra - rb;
    return a.tx - b.tx;
  });
  fs.mkdirSync(outDir, { recursive: true });
  console.log(`\n=== ${prefix} (total raw ${items.length}, únicos ${unique.length}) ===`);
  unique.forEach((it, i) => {
    const file = path.join(outDir, `${String(i + 1).padStart(2, "0")}.png`);
    fs.writeFileSync(file, Buffer.from(it.b64, "base64"));
    const kb = (fs.statSync(file).size / 1024).toFixed(0);
    console.log(
      `  ${String(i + 1).padStart(2, "0")} → pos(${it.tx.toFixed(0)},${it.ty.toFixed(0)})  ${kb}KB  ${path.basename(file)}`
    );
  });
  return unique;
}

const HOME = process.env.USERPROFILE || process.env.HOME;
extract(
  path.join(HOME, "Downloads", "SILUETA CARROCERIAS.svg"),
  path.join(__dirname, "..", "public", "icons", "carrocerias"),
  "carrocerías"
);
extract(
  path.join(HOME, "Downloads", "LOGOS MARCAS DE CARROS.svg"),
  path.join(__dirname, "..", "public", "icons", "marcas"),
  "marcas"
);
