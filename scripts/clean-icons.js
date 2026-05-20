// Post-procesa los PNG extraídos:
// 1. Flood-fill desde las 4 esquinas: convierte fondo negro/transparente en alpha=0
//    (preserva los negros INTERNOS del logo como Mini, BMW, Mazda, etc.)
// 2. Trim de píxeles transparentes sobrantes para que cada icono llene su caja.
// 3. Para carrocerías que miran a la derecha → flip horizontal para que todas
//    miren a la izquierda (igual que el Mini Cooper / hatchback).
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

// Umbral: un píxel se considera "fondo" si es muy oscuro (negro de Canva) o ya transparente.
const BLACK_R = 35,
  BLACK_G = 35,
  BLACK_B = 35;

async function clean(file, { flip = false } = {}) {
  const tmp = file + ".tmp.png";
  let img = sharp(file).ensureAlpha();
  if (flip) img = img.flop();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const stride = 4;
  const visited = new Uint8Array(width * height);
  const isBg = (idx) => {
    const r = data[idx * stride],
      g = data[idx * stride + 1],
      b = data[idx * stride + 2],
      a = data[idx * stride + 3];
    return a < 10 || (r <= BLACK_R && g <= BLACK_G && b <= BLACK_B);
  };
  // Stack-based flood fill desde las 4 esquinas
  const stack = [];
  const seedCorners = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
  ];
  // También sembrar todo el borde para casos de marco
  for (let x = 0; x < width; x++) {
    stack.push([x, 0]);
    stack.push([x, height - 1]);
  }
  for (let y = 0; y < height; y++) {
    stack.push([0, y]);
    stack.push([width - 1, y]);
  }
  stack.push(...seedCorners);
  while (stack.length) {
    const [x, y] = stack.pop();
    if (x < 0 || y < 0 || x >= width || y >= height) continue;
    const idx = y * width + x;
    if (visited[idx]) continue;
    if (!isBg(idx)) continue;
    visited[idx] = 1;
    data[idx * stride + 3] = 0;
    stack.push([x + 1, y]);
    stack.push([x - 1, y]);
    stack.push([x, y + 1]);
    stack.push([x, y - 1]);
  }
  await sharp(data, { raw: { width, height, channels: 4 } })
    .png()
    .toFile(tmp);
  // Recortar transparencia sobrante para uniformizar tamaño visual
  await sharp(tmp).trim({ threshold: 1 }).png({ compressionLevel: 9 }).toFile(file + ".trimmed.png");
  fs.unlinkSync(tmp);
  fs.renameSync(file + ".trimmed.png", file);
}

async function main() {
  const root = path.join(__dirname, "..", "public", "icons");
  // Carrocerías: el hatchback (mini) ya mira a la izquierda; el resto miran a la derecha → flip.
  const flipCarroceria = new Set(["suv", "sedan", "pickup", "coupe", "descapotable"]);
  for (const dir of ["carrocerias", "marcas"]) {
    const full = path.join(root, dir);
    const files = fs.readdirSync(full).filter((f) => f.endsWith(".png"));
    for (const f of files) {
      const base = f.replace(/\.png$/, "");
      const flip = dir === "carrocerias" && flipCarroceria.has(base);
      const filePath = path.join(full, f);
      const before = fs.statSync(filePath).size;
      try {
        await clean(filePath, { flip });
        const after = fs.statSync(filePath).size;
        console.log(
          `  ${dir}/${f}  ${flip ? "[flip]" : "      "}  ${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB`
        );
      } catch (err) {
        console.error(`  ${dir}/${f} ERROR:`, err.message);
      }
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
