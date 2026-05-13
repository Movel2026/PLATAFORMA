const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

// ── Cargar la base de datos del Ministerio de Transporte ──
const db = JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/catalog-data/vehicle-db.json'), 'utf8'));

// ── Helpers de parseo de referencias Fasecolda ──

const TRANS_MAP = {
  'AT':'Automático','AT5':'Automático 5V','AT6':'Automático 6V','AT7':'Automático 7V',
  'AT8':'Automático 8V','AT9':'Automático 9V',
  'MT':'Manual','MT5':'Manual 5V','MT6':'Manual 6V',
  'CVT':'CVT',
  'TP':'Tiptronica','TIPTRONICA':'Tiptronica','TIPTRONIC':'Tiptronica',
  'DSG':'Doble embrague (DSG)','DCT':'Doble embrague (DCT)',
  'AMT':'Automatizada (AMT)',
};

const TRAC_MAP = {
  '4X4':'4x4','4WD':'4x4','AWD':'AWD','4MOTION':'AWD','QUATTRO':'AWD','XDRIVE':'AWD',
  '4X2':'4x2','FWD':'FWD','RWD':'RWD',
};

const FUEL_MAP = {
  'TDI':'Diesel','CRDI':'Diesel','CDI':'Diesel','DCDI':'Diesel','DIESEL':'Diesel',
  'HV':'Hibrido','HYBRID':'Hibrido','HIBRIDO':'Hibrido','HEV':'Hibrido',
  'PHEV':'Hibrido enchufable','RECHARGEABLE':'Hibrido enchufable',
  'EV':'Electrico','ELECTRIC':'Electrico','ELECTRICO':'Electrico',
  'GNV':'Gas Natural','GAS':'Gas Natural',
};

const SPEC_STOPS = new Set([
  'AT','AT5','AT6','AT7','AT8','AT9','MT','MT5','MT6','CVT','TP','DSG','DCT','AMT',
  '4X4','4X2','AWD','FWD','RWD','4WD','4MOTION','QUATTRO','XDRIVE',
  'TDI','CRDI','CDI','DIESEL','HV','HYBRID','EV','GNV',
  'LT','LTZ','SE','LE','XLE','XEI','STD','SEL','EX','SX',
]);

function parseRef(ref) {
  const words = ref.toUpperCase().split(/\s+/);
  let transmision = '';
  let traccion = '';
  let combustible = 'Gasolina';
  let turbo = false;
  const modelWords = [];
  let inSpecs = false;

  for (const w of words) {
    if (FUEL_MAP[w]) { combustible = FUEL_MAP[w]; inSpecs = true; continue; }
    if (TRANS_MAP[w]) { transmision = TRANS_MAP[w]; inSpecs = true; continue; }
    if (TRAC_MAP[w]) { traccion = TRAC_MAP[w]; inSpecs = true; continue; }
    if (w === 'TURBO' || w === 'TC') { turbo = true; inSpecs = true; continue; }
    if (/^\d/.test(w)) { inSpecs = true; continue; }
    if (!inSpecs) modelWords.push(w);
  }

  // Ajuste turbo: si tiene "T" al final de token numérico (ej: "1.0T")
  for (const w of words) {
    if (/^\d.*T$/.test(w)) turbo = true;
  }

  const modelo = modelWords.slice(0, 3)
    .map(w => w.charAt(0) + w.slice(1).toLowerCase())
    .join(' ') || ref.split(' ')[0];

  return { modelo, transmision, traccion, combustible, turbo };
}

function cilindrToMotor(cil) {
  if (!cil) return '';
  return (cil / 1000).toFixed(1) + 'L';
}

const TIPO_CARROCERIA_LABEL = {
  'AUTOMOVILES': 'Sedan / Hatchback',
  'CAMIONETAS Y CAMPEROS': 'SUV / Campero',
  'CAMIONETAS DOBLECABINA': 'Pickup Doble Cabina',
  'ELECTRICOS': 'Electrico',
  'HIBRIDOS': 'Hibrido',
  'PASAJEROS': 'Bus / Microbus / Pasajeros',
  'CARGA': 'Vehiculo de Carga',
};

const MARCA_DISPLAY = {
  'CHEVROLET':'Chevrolet','RENAULT':'Renault','TOYOTA':'Toyota','KIA':'Kia',
  'HYUNDAI':'Hyundai','MAZDA':'Mazda','NISSAN':'Nissan','FORD':'Ford',
  'SUZUKI':'Suzuki','VOLKSWAGEN':'Volkswagen','BMW':'BMW',
  'MERCEDES BENZ':'Mercedes-Benz','AUDI':'Audi','HONDA':'Honda',
  'MITSUBISHI':'Mitsubishi','JEEP':'Jeep','VOLVO':'Volvo',
  'LAND ROVER':'Land Rover','LEXUS':'Lexus','PORSCHE':'Porsche',
  'ACURA':'Acura','INFINITI':'Infiniti','SUBARU':'Subaru',
  'PEUGEOT':'Peugeot','FIAT':'Fiat','CITROEN':'Citroen','JAC':'JAC',
  'CHERY':'Chery','HAVAL':'Haval','BYD':'BYD','MG':'MG',
  'GEELY':'Geely','ISUZU':'Isuzu','SSANGYONG':'SsangYong',
  'DFSK':'DFSK','MINI':'Mini','RAM':'Ram','DODGE':'Dodge',
  'MASERATI':'Maserati','JAGUAR':'Jaguar','ALFA ROMEO':'Alfa Romeo',
  'FERRARI':'Ferrari','LAMBORGHINI':'Lamborghini','TESLA':'Tesla',
};

// ── Construir filas ──
const rows = [];
let id = 1;

for (const tipo of db.tipos) {
  const tipoLabel = TIPO_CARROCERIA_LABEL[tipo] || tipo;
  const marcasObj = db.db[tipo];

  for (const marca of Object.keys(marcasObj).sort()) {
    const refs = marcasObj[marca];
    const marcaDisplay = MARCA_DISPLAY[marca] ||
      marca.split(' ').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');

    for (const r of refs) {
      const parsed = parseRef(r.ref);

      const años = Object.keys(r.avaluo || {}).filter(y => (r.avaluo[y] || 0) > 0).sort();
      const añoDesde = años[0] || '';
      const añoHasta = años[años.length - 1] || '';
      const avaluo2025 = r.avaluo?.['2025'] || r.avaluo?.['2024'] || '';

      // Estado de completitud del registro
      const tiene = [r.cil, parsed.transmision, parsed.combustible !== 'Gasolina' || r.ref.includes('GASOLINA')];
      const estado = tiene.every(Boolean) ? 'Parcial' : 'Pendiente';

      rows.push({
        ID: id++,
        TIPO_CARROCERIA: tipo,
        TIPO_LABEL: tipoLabel,
        MARCA: marca,
        MARCA_DISPLAY: marcaDisplay,
        MODELO: parsed.modelo,
        VERSION_OFICIAL: r.ref,
        VERSION_CORTA: '',           // A completar manualmente (ej: LT, LTZ, Premier)
        AÑO_DESDE: añoDesde,
        AÑO_HASTA: añoHasta,
        CILINDRAJE_CC: r.cil || '',
        MOTOR_DESCRIPCION: cilindrToMotor(r.cil),
        COMBUSTIBLE: parsed.combustible,
        TRANSMISION: parsed.transmision,
        TURBO: parsed.turbo ? 'Si' : '',
        TRACCION: parsed.traccion,
        POTENCIA_HP: '',             // A completar
        TORQUE_NM: '',               // A completar
        CARROCERIA_DETALLADA: '',    // A completar (Sedan, Hatchback, SUV compacto...)
        PUERTAS: '',                 // A completar
        PASAJEROS: r.pas || '',
        TONELAJE: r.ton || '',
        COLORES_DISPONIBLES: '',     // A completar
        PRECIO_BASE_COP: '',         // A completar (precio 0km en concesionario)
        AVALUO_2025_COP: avaluo2025,
        FUENTE: 'Fasecolda / MinTransporte 2026',
        ESTADO: estado,
        NOTAS: '',
      });
    }
  }
}

console.log('Total filas:', rows.length);

// Muestra
const onix = rows.filter(r => r.MARCA === 'CHEVROLET' && r.MODELO.toLowerCase().startsWith('onix'));
console.log('Onix records:', onix.length);
console.log('Sample:', JSON.stringify(onix.slice(0, 2), null, 2));

// ── Generar Excel ──
async function buildExcel() {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'MOVEL';
  wb.created = new Date();

  // ── Hoja 1: Catálogo completo ──
  const ws = wb.addWorksheet('Catalogo Vehiculos', {
    views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }],
  });

  const cols = [
    { header: 'ID',               key: 'ID',                  width: 7  },
    { header: 'TIPO CARROCERIA',  key: 'TIPO_CARROCERIA',     width: 22 },
    { header: 'TIPO LABEL',       key: 'TIPO_LABEL',          width: 22 },
    { header: 'MARCA',            key: 'MARCA',               width: 18 },
    { header: 'MARCA DISPLAY',    key: 'MARCA_DISPLAY',       width: 18 },
    { header: 'MODELO',           key: 'MODELO',              width: 18 },
    { header: 'VERSION OFICIAL (Fasecolda)', key: 'VERSION_OFICIAL', width: 40 },
    { header: 'VERSION CORTA',    key: 'VERSION_CORTA',       width: 20 },
    { header: 'AÑO DESDE',        key: 'AÑO_DESDE',           width: 11 },
    { header: 'AÑO HASTA',        key: 'AÑO_HASTA',           width: 11 },
    { header: 'CILINDRAJE (cc)',   key: 'CILINDRAJE_CC',       width: 14 },
    { header: 'MOTOR',            key: 'MOTOR_DESCRIPCION',   width: 12 },
    { header: 'COMBUSTIBLE',      key: 'COMBUSTIBLE',         width: 22 },
    { header: 'TRANSMISION',      key: 'TRANSMISION',         width: 20 },
    { header: 'TURBO',            key: 'TURBO',               width: 8  },
    { header: 'TRACCION',         key: 'TRACCION',            width: 10 },
    { header: 'POTENCIA (HP)',     key: 'POTENCIA_HP',         width: 13 },
    { header: 'TORQUE (Nm)',       key: 'TORQUE_NM',           width: 12 },
    { header: 'CARROCERIA DETALLADA', key: 'CARROCERIA_DETALLADA', width: 22 },
    { header: 'PUERTAS',          key: 'PUERTAS',             width: 9  },
    { header: 'PASAJEROS',        key: 'PASAJEROS',           width: 11 },
    { header: 'TONELAJE',         key: 'TONELAJE',            width: 10 },
    { header: 'COLORES DISPONIBLES', key: 'COLORES_DISPONIBLES', width: 35 },
    { header: 'PRECIO BASE (COP)', key: 'PRECIO_BASE_COP',    width: 18 },
    { header: 'AVALUO 2025 (COP)', key: 'AVALUO_2025_COP',    width: 18 },
    { header: 'FUENTE',           key: 'FUENTE',              width: 25 },
    { header: 'ESTADO',           key: 'ESTADO',              width: 12 },
    { header: 'NOTAS',            key: 'NOTAS',               width: 30 },
  ];

  ws.columns = cols;

  // Estilo del header
  const headerRow = ws.getRow(1);
  headerRow.height = 28;
  headerRow.eachCell(cell => {
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0D1B2E' } };
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10, name: 'Calibri' };
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
    cell.border = {
      bottom: { style: 'medium', color: { argb: 'FF1978E5' } },
    };
  });

  // Colores por tipo
  const TIPO_COLORS = {
    'AUTOMOVILES':            'FFE8F0FD',
    'CAMIONETAS Y CAMPEROS':  'FFECFDF5',
    'CAMIONETAS DOBLECABINA': 'FFFFF3CD',
    'ELECTRICOS':             'FFE0F2FE',
    'HIBRIDOS':               'FFF0FDF4',
    'PASAJEROS':              'FFFDF4FF',
    'CARGA':                  'FFFFF7ED',
  };

  const ESTADO_COLORS = {
    'Parcial':   'FFFFF3CD',
    'Pendiente': 'FFFDE8E8',
    'Completo':  'FFD1FAE5',
  };

  // Agregar filas
  for (const row of rows) {
    const exRow = ws.addRow(row);
    exRow.height = 16;

    const bg = TIPO_COLORS[row.TIPO_CARROCERIA] || 'FFFFFFFF';
    exRow.eachCell({ includeEmpty: true }, cell => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bg } };
      cell.font = { size: 9, name: 'Calibri' };
      cell.alignment = { vertical: 'middle' };
    });

    // Estado con color
    const estCell = exRow.getCell('ESTADO');
    const estColor = ESTADO_COLORS[row.ESTADO] || 'FFFFFFFF';
    estCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: estColor } };
    estCell.font = { bold: true, size: 9, name: 'Calibri' };

    // Formatear valores monetarios
    const av = exRow.getCell('AVALUO_2025_COP');
    if (row.AVALUO_2025_COP) {
      av.numFmt = '#,##0';
    }
  }

  // Filtros automáticos
  ws.autoFilter = { from: 'A1', to: `AB1` };

  // ── Hoja 2: Resumen ──
  const ws2 = wb.addWorksheet('Resumen');
  ws2.getColumn(1).width = 30;
  ws2.getColumn(2).width = 15;
  ws2.getColumn(3).width = 20;

  ws2.addRow(['MOVEL — Base de Datos Vehicular Colombia 2026', '', '']);
  ws2.addRow(['Fuente: Ministerio de Transporte / Fasecolda', '', '']);
  ws2.addRow(['']);
  ws2.addRow(['TIPO DE VEHICULO', 'REGISTROS', 'MARCAS']);

  const tipoStats = {};
  for (const r of rows) {
    if (!tipoStats[r.TIPO_CARROCERIA]) tipoStats[r.TIPO_CARROCERIA] = { count: 0, marcas: new Set() };
    tipoStats[r.TIPO_CARROCERIA].count++;
    tipoStats[r.TIPO_CARROCERIA].marcas.add(r.MARCA);
  }

  for (const [tipo, s] of Object.entries(tipoStats)) {
    ws2.addRow([TIPO_CARROCERIA_LABEL[tipo] || tipo, s.count, s.marcas.size]);
  }
  ws2.addRow(['']);
  ws2.addRow(['TOTAL', rows.length, '']);

  // ── Hoja 3: Guía de uso ──
  const ws3 = wb.addWorksheet('Guia de Uso');
  ws3.getColumn(1).width = 30;
  ws3.getColumn(2).width = 60;

  const guia = [
    ['CAMPO', 'DESCRIPCION Y VALORES'],
    ['ID', 'Identificador único autoincremental'],
    ['TIPO_CARROCERIA', 'Categoría oficial MinTransporte: AUTOMOVILES, CAMIONETAS Y CAMPEROS, CAMIONETAS DOBLECABINA, ELECTRICOS, HIBRIDOS, PASAJEROS, CARGA'],
    ['TIPO_LABEL', 'Nombre amigable del tipo para mostrar en la app'],
    ['MARCA', 'Marca en mayúsculas (como aparece en Fasecolda)'],
    ['MARCA_DISPLAY', 'Marca con formato de presentación (ej: Mercedes-Benz)'],
    ['MODELO', 'Nombre del modelo extraído de la referencia (ej: Onix, Tracker, Corolla)'],
    ['VERSION_OFICIAL', 'Referencia completa Fasecolda / MinTransporte (ej: ONIX PLUS 1.0T AT)'],
    ['VERSION_CORTA', 'Trim / versión comercial (ej: LT, LTZ, Premier, RS) — completar manualmente'],
    ['AÑO_DESDE', 'Primer año modelo disponible en el catálogo de avalúos'],
    ['AÑO_HASTA', 'Último año modelo disponible en el catálogo de avalúos'],
    ['CILINDRAJE_CC', 'Cilindraje en cc (ej: 998, 1600, 2000) — fuente oficial MinTransporte'],
    ['MOTOR_DESCRIPCION', 'Descripción del motor calculada (ej: 1.6L, 2.0L) — enriquecer manualmente'],
    ['COMBUSTIBLE', 'Gasolina | Diesel | Hibrido | Hibrido enchufable | Electrico | Gas Natural'],
    ['TRANSMISION', 'Automatico | Manual | CVT | Tiptronica | Doble embrague (DSG/DCT)'],
    ['TURBO', 'Si = motor turboalimentado'],
    ['TRACCION', '4x4 | AWD | FWD | RWD | 4x2'],
    ['POTENCIA_HP', 'Potencia en HP — completar desde ficha técnica del fabricante'],
    ['TORQUE_NM', 'Torque en Nm — completar desde ficha técnica del fabricante'],
    ['CARROCERIA_DETALLADA', 'Sedan | Hatchback | SUV | SUV compacto | Pickup | Coupe | Wagon | Minivan — completar'],
    ['PUERTAS', 'Número de puertas: 2, 3, 4, 5 — completar'],
    ['PASAJEROS', 'Capacidad de pasajeros (para buses y vans viene de la fuente oficial)'],
    ['TONELAJE', 'Tonelaje de carga (para vehículos de carga)'],
    ['COLORES_DISPONIBLES', 'Colores disponibles separados por coma — completar desde web del fabricante'],
    ['PRECIO_BASE_COP', 'Precio de lista 0 km en Colombia (pesos) — completar desde concesionario oficial'],
    ['AVALUO_2025_COP', 'Valor de avalúo año 2025 según MinTransporte (pesos)'],
    ['FUENTE', 'Origen del registro'],
    ['ESTADO', 'Completo | Parcial | Pendiente — según campos completados'],
    ['NOTAS', 'Observaciones adicionales'],
  ];

  guia.forEach((row, i) => {
    const exRow = ws3.addRow(row);
    if (i === 0) {
      exRow.eachCell(cell => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0D1B2E' } };
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 };
      });
    }
  });

  // Guardar
  const outPath = path.join(__dirname, '../MOVEL-Base-Vehiculos-Colombia-2026.xlsx');
  await wb.xlsx.writeFile(outPath);
  const size = fs.statSync(outPath).size;
  console.log('\nExcel generado:', outPath);
  console.log('Tamanio:', (size / 1024 / 1024).toFixed(2), 'MB');
  console.log('Hojas: Catalogo Vehiculos (' + rows.length + ' filas), Resumen, Guia de Uso');
}

buildExcel().catch(e => { console.error('ERROR:', e.message); process.exit(1); });
