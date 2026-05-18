"use client";

import { useState, useRef, useCallback, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  UploadSimple, X, CheckCircle, Image as ImageIcon,
  Car, FileText, CurrencyCircleDollar, ClipboardText,
  Warning, Info, Handshake, WhatsappLogo, SignIn,
  Camera, Wrench, UsersThree, CalendarCheck,
} from "@phosphor-icons/react";
import BottomNav from "@/components/BottomNav";
import { MovelLogo } from "@/components/MovelLogo";
import { useUser } from "@/lib/hooks/useUser";
import { getVersiones, EspecificacionesTecnicas } from "@/lib/specs-data";
import { OfertasToggle }           from "@/components/publicar/OfertasToggle";
import { EspecificacionesVehiculo, SpecsOutput } from "@/components/publicar/EspecificacionesVehiculo";
import { FichaTecnicaCard }        from "@/components/publicar/FichaTecnicaCard";
import { VehicleSelector, VehicleSelection } from "@/components/publicar/VehicleSelector";

// ── CATÁLOGO DE MARCAS Y MODELOS ─────────────────────────────────────────
const modelosPorMarca: Record<string, string[]> = {
  "Chevrolet":    ["Spark", "Spark GT", "Onix", "Sail", "Aveo", "Optra", "Cruze", "Tracker", "Trax", "Captiva", "Equinox", "Traverse", "Tahoe", "Suburban", "Colorado", "S10", "N300", "Luv D-Max"],
  "Renault":      ["Kwid", "Logan", "Sandero", "Stepway", "Symbol", "Megane", "Fluence", "Duster", "Duster Oroch", "Captur", "Koleos", "Kangoo", "Trafic", "Master"],
  "Toyota":       ["Agya", "Yaris", "Corolla", "Camry", "Avalon", "RAV4", "C-HR", "Land Cruiser", "Prado", "Fortuner", "Hilux", "Rush", "Innova", "Sequoia"],
  "Kia":          ["Picanto", "Rio", "Rio Hatchback", "Stonic", "Soul", "Cerato", "Optima", "Sportage", "Seltos", "Sorento", "Carnival", "Telluride", "Stinger"],
  "Hyundai":      ["Grand i10", "i10", "i20", "Accent", "Elantra", "Sonata", "Veloster", "Creta", "Tucson", "Santa Fe", "Palisade", "Ioniq", "Ioniq 5", "Kona"],
  "Mazda":        ["Mazda2", "Mazda3", "Mazda3 Sedan", "Mazda6", "CX-3", "CX-30", "CX-5", "CX-8", "CX-9", "BT-50", "MX-5"],
  "Nissan":       ["March", "Versa", "Sentra", "Altima", "Maxima", "Kicks", "Qashqai", "X-Trail", "Murano", "Pathfinder", "Frontier", "Navara", "NP300", "NV200"],
  "Ford":         ["Ka", "Fiesta", "Focus", "Fusion", "Mustang", "EcoSport", "Escape", "Edge", "Explorer", "Expedition", "Ranger", "F-150", "F-250", "Transit", "Transit Connect"],
  "Mitsubishi":   ["Mirage", "Attrage", "Lancer", "Galant", "Eclipse Cross", "ASX", "Outlander", "Outlander PHEV", "Pajero Sport", "Montero", "L200", "Canter"],
  "Honda":        ["Brio", "City", "Fit", "Civic", "Accord", "HR-V", "CR-V", "Pilot", "Odyssey", "Ridgeline"],
  "Volkswagen":   ["Polo", "Vento", "Jetta", "Passat", "Golf", "Golf GTI", "Tiguan", "T-Cross", "Touareg", "Amarok", "Transporter", "Caravelle"],
  "Suzuki":       ["Alto", "Celerio", "Swift", "Baleno", "Dzire", "S-Cross", "Vitara", "Grand Vitara", "Jimny", "XL7", "Carry"],
  "Jeep":         ["Renegade", "Compass", "Cherokee", "Grand Cherokee", "Wrangler", "Gladiator", "Commander"],
  "Ram":          ["700", "1500", "2500", "3500", "ProMaster"],
  "Dodge":        ["Attitude", "Neon", "Journey", "Durango", "Challenger", "Charger"],
  "Mercedes-Benz":["Clase A", "Clase B", "Clase C", "Clase E", "Clase S", "CLA", "CLS", "GLA", "GLB", "GLC", "GLE", "GLS", "AMG GT", "Vito", "Sprinter"],
  "BMW":          ["Serie 1", "Serie 2", "Serie 3", "Serie 4", "Serie 5", "Serie 7", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "M2", "M3", "M4", "M5"],
  "Audi":         ["A1", "A3", "A4", "A5", "A6", "A7", "A8", "Q2", "Q3", "Q5", "Q7", "Q8", "TT", "R8", "e-tron"],
  "Volvo":        ["S60", "S90", "V60", "V90", "XC40", "XC60", "XC90"],
  "Land Rover":   ["Defender", "Discovery", "Discovery Sport", "Range Rover", "Range Rover Sport", "Range Rover Evoque", "Range Rover Velar"],
  "Peugeot":      ["208", "301", "308", "408", "508", "2008", "3008", "5008", "Expert", "Boxer"],
  "Fiat":         ["Mobi", "Argo", "Cronos", "Linea", "500", "500X", "Toro", "Strada", "Doblò", "Ducato"],
  "Citroën":      ["C3", "C3 Aircross", "C4 Cactus", "C4 Picasso", "Berlingo", "Jumper"],
  "Subaru":       ["Impreza", "Legacy", "Outback", "Forester", "XV", "WRX", "BRZ"],
  "Lexus":        ["IS", "ES", "GS", "LS", "UX", "NX", "RX", "GX", "LX"],
  "Chery":        ["QQ", "Tiggo 2", "Tiggo 4", "Tiggo 5X", "Tiggo 7", "Tiggo 8", "Arrizo 5", "Arrizo 6"],
  "JAC":          ["J2", "J3", "J4", "J7", "S2", "S3", "S4", "S5", "S7", "T6", "T8"],
  "Haval":        ["H1", "H2", "H6", "H9", "Jolion", "Dargo"],
  "MG":           ["3", "5", "6", "ZS", "ZS EV", "HS", "RX5", "One"],
  "BYD":          ["Dolphin", "Atto 3", "Han", "Tang", "Song Plus", "Seal"],
  "Geely":        ["Coolray", "Tugella", "Atlas Pro", "Okavango"],
  "Isuzu":        ["D-Max", "MU-X", "Trooper", "NPR", "NQR", "FTR"],
  "SsangYong":    ["Tivoli", "Korando", "Rexton", "Actyon", "Musso"],
  "DFSK":         ["Glory 330", "Glory 580", "Glory 600", "C35", "C37"],
  "Porsche":      ["911", "Cayenne", "Macan", "Panamera", "Taycan"],
  "Mini":         ["Cooper", "Cooper S", "Clubman", "Countryman", "Paceman"],
  "Acura":        ["ILX", "TLX", "RDX", "MDX"],
  "Infiniti":     ["Q50", "Q60", "QX50", "QX60", "QX80"],
  "Maserati":     ["Ghibli", "Quattroporte", "Levante", "Grecale"],
  "Jaguar":       ["XE", "XF", "XJ", "E-Pace", "F-Pace", "I-Pace", "F-Type"],
  "Otro":         ["Otro modelo"],
};

const marcasCuradas = Object.keys(modelosPorMarca).sort();
const currentYear = new Date().getFullYear();
const years  = Array.from({ length: currentYear - 1989 }, (_, i) => currentYear - i);
const colores = ["Blanco", "Negro", "Plateado", "Gris", "Rojo", "Azul", "Azul oscuro", "Verde", "Café", "Beige", "Amarillo", "Naranja", "Dorado", "Vinotinto", "Otro"];
const ciudades = ["Bogotá", "Medellín", "Cali", "Barranquilla", "Bucaramanga", "Manizales", "Pereira", "Armenia", "Ibagué", "Villavicencio", "Cúcuta", "Cartagena", "Santa Marta", "Pasto", "Otra ciudad"];
const propietarioOpciones = ["1 propietario", "2 propietarios", "3 propietarios", "4 o más propietarios", "No sé"];
const usoOpciones = ["Particular", "Empresa / Flota", "Taxi / Plataformas", "Escuela de conducción", "Otro"];

// ── Tipos ─────────────────────────────────────────────────────────────────
interface PhotoPreview { file: File; url: string }
interface FormErrors {
  marca?: string; modelo?: string; año?: string; placa?: string;
  precio?: string; fotos?: string; nombre?: string; email?: string; celular?: string;
}

// ── DraggablePhotoGrid ────────────────────────────────────────────────────
function DraggablePhotoGrid({ photos, onRemove, onReorder }: {
  photos: PhotoPreview[];
  onRemove: (i: number) => void;
  onReorder: (p: PhotoPreview[]) => void;
}) {
  const dragIdx = useRef<number | null>(null);
  const handleDragStart = (i: number) => { dragIdx.current = i; };
  const handleDragOver  = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    if (dragIdx.current === null || dragIdx.current === i) return;
    const r = [...photos];
    const [m] = r.splice(dragIdx.current, 1);
    r.splice(i, 0, m);
    dragIdx.current = i;
    onReorder(r);
  };
  const handleDragEnd = () => { dragIdx.current = null; };

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-3">
      {photos.map((p, i) => (
        <div
          key={p.url}
          draggable
          onDragStart={() => handleDragStart(i)}
          onDragOver={(e) => handleDragOver(e, i)}
          onDragEnd={handleDragEnd}
          className={`relative group aspect-square rounded-xl overflow-hidden border-2 cursor-grab active:cursor-grabbing transition-all ${
            i === 0 ? "border-[#0B1E4E] ring-2 ring-[#0B1E4E]/20" : "border-[#dce0e5] hover:border-[#0B1E4E]/50"
          }`}
        >
          {i === 0 && (
            <div className="absolute top-1 left-1 z-10 bg-[#0B1E4E] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow">
              Principal
            </div>
          )}
          <Image src={p.url} alt="" fill className="object-cover pointer-events-none" sizes="120px" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 bg-black/50 rounded-lg p-1.5">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="white">
                <circle cx="5" cy="4" r="1.5"/><circle cx="11" cy="4" r="1.5"/>
                <circle cx="5" cy="8" r="1.5"/><circle cx="11" cy="8" r="1.5"/>
                <circle cx="5" cy="12" r="1.5"/><circle cx="11" cy="12" r="1.5"/>
              </svg>
            </div>
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onRemove(i); }}
            className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <X size={12} color="white" />
          </button>
        </div>
      ))}
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────────────────
function PublicarContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const modo = searchParams.get("modo"); // "gratis" | "360" | null
  const isServicioIntegral = modo === "360";

  // ── Auth guard: solo usuarios logueados pueden publicar ──
  const { user, loading: userLoading, configured: authConfigured } = useUser();

  // ── Estado del formulario ──
  const [form, setForm] = useState({
    // Identificación
    marca: "", modelo: "", año: "", version: "", placa: "",
    // Básicos
    kilometraje: "", precio: "", color: "", ciudad: "", descripcion: "",
    // Specs (auto-llenadas por EspecificacionesVehiculo)
    motor: "", combustible: "", transmision: "", potencia: "", carroceria: "", pasajeros: "",
    // Oferta
    accept_offers: false,
    // Contacto
    nombre: "", email: "", celular: "",
    // Historial
    propietarios: "", uso: "",
    sinSiniestros: true, siniestrosDesc: "",
    soatVigente: "", soatHasta: "",
    tecnoVigente: "", tecnoHasta: "",
    revisionAlDia: false, mantenimientoAgencia: false,
    llavesRepuesto: false, kitHerramientas: false,
    extras: "",
  });

  const [autoSpecs,  setAutoSpecs]  = useState<EspecificacionesTecnicas | null>(null);
  const [vehicleSel, setVehicleSel] = useState<VehicleSelection | null>(null);
  // Modo manual: el usuario escribe marca/modelo a mano (vehículo no en la base)
  const [modoManual, setModoManual] = useState(false);
  const [errors, setErrors]         = useState<FormErrors>({});
  const [photos, setPhotos]         = useState<PhotoPreview[]>([]);
  const [dragOver, setDragOver]     = useState(false);
  const [showModal, setShowModal]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [docUploads, setDocUploads] = useState({ tarjeta: false, cedula: false, soat: false, tecno: false });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Catálogo dinámico — marcas adicionales del Excel oficial (164 marcas)
  const [allBrands, setAllBrands] = useState<string[]>([]);

  // Cargar todas las marcas del catálogo una sola vez
  useEffect(() => {
    fetch("/api/catalog/brands")
      .then(r => r.json())
      .then((d: { todas: string[] }) => setAllBrands(d.todas ?? []));
  }, []);

  // Lista combinada de marcas: curadas primero + resto del catálogo oficial
  const marcas = useMemo(() => {
    const curatedSet = new Set(marcasCuradas.map(m => m.toUpperCase()));
    const extras = allBrands.filter(b => !curatedSet.has(b.toUpperCase()));
    return [...marcasCuradas, ...extras];
  }, [allBrands]);

  // Normalizar marca UPPERCASE del vehicle-db → nombre curado (ej: "ACURA" → "Acura")
  const normalizeMarca = (raw: string): string => {
    const up = raw.toUpperCase();
    const match = marcasCuradas.find((m) => m.toUpperCase() === up);
    return match ?? raw.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
  };

  // Extraer nombre del modelo desde referencia oficial Fasecolda/Mintransporte
  // "ONIX PLUS 1.0T AT" → "Onix Plus"  |  "COROLLA XEI 2.0 AT" → "Corolla Xei"
  const TRANS_TOKENS = new Set(["AT","MT","CVT","TP","DSG","DCT","AWD","FWD","RWD","4X4","4X2","HV","EV"]);
  const extractModelo = (ref: string): string => {
    const words = ref.toUpperCase().trim().split(/\s+/);
    const model: string[] = [];
    for (const w of words) {
      if (/^\d/.test(w)) break;          // empieza con dígito → spec
      if (TRANS_TOKENS.has(w)) break;    // token de transmisión/tracción → parar
      model.push(w);
      if (model.length >= 3) break;      // máximo 3 palabras de modelo
    }
    if (model.length === 0) model.push(words[0]);
    return model.map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(" ");
  };

  // Mapeo tipo vehicle-db → carrocería amigable para el form
  const tipoToCarroceria: Record<string, string> = {
    AUTOMOVILES:              "Sedán",
    "CAMIONETAS Y CAMPEROS":  "SUV / Camioneta",
    "CAMIONETAS DOBLECABINA": "Pick-up",
    ELECTRICOS:               "Eléctrico",
    HIBRIDOS:                 "Híbrido",
    PASAJEROS:                "SUV / Camioneta",
    CARGA:                    "Furgoneta",
  };

  // Formulario válido si los campos obligatorios están completos
  const formValid = !!(
    form.marca && form.modelo && form.año && form.placa &&
    form.nombre && form.email && form.celular && photos.length >= 3 &&
    form.precio
  );

  // Versiones disponibles desde specs-data
  const versionesDB = form.marca && form.modelo ? getVersiones(form.marca, form.modelo) : [];

  // ── Helpers ──
  const setF = (key: string, val: string | boolean) =>
    setForm((f) => ({ ...f, [key]: val }));

  const addPhotos = useCallback((files: FileList | null) => {
    if (!files) return;
    const newPhotos = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, 20 - photos.length)
      .map((file) => ({ file, url: URL.createObjectURL(file) }));
    setPhotos((prev) => [...prev, ...newPhotos]);
    setErrors((e) => ({ ...e, fotos: undefined }));
  }, [photos.length]);

  const removePhoto = (index: number) =>
    setPhotos((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });

  // ── Handler VehicleSelector (camino oficial) ──
  const handleVehicleSelect = (sel: VehicleSelection | null) => {
    setVehicleSel(sel);
    if (!sel) {
      setForm((f) => ({ ...f, marca: "", modelo: "", version: "", motor: "", combustible: "", transmision: "", potencia: "", carroceria: "", pasajeros: "" }));
      setAutoSpecs(null);
      return;
    }
    const marcaNorm  = normalizeMarca(sel.marca);
    const modelo     = extractModelo(sel.referencia);
    const carroceria = tipoToCarroceria[sel.tipo] ?? "";
    const motorStr   = sel.cilindraje ? `${(sel.cilindraje / 1000).toFixed(1)}L · ${sel.cilindraje} cc` : "";
    setAutoSpecs(null);
    setForm((f) => ({
      ...f,
      marca:      marcaNorm,
      modelo:     modelo,
      version:    sel.referencia,
      carroceria: carroceria,
      motor:      motorStr,
      pasajeros:  sel.pasajeros ? String(sel.pasajeros) : f.pasajeros,
      // Limpiar specs para que EspecificacionesVehiculo recalcule
      combustible: "", transmision: "", potencia: "",
    }));
  };

  // ── Cascada manual (modo fallback) ──
  const handleMarcaManual = (marca: string) => {
    setForm((f) => ({ ...f, marca, modelo: "", version: "", motor: "", combustible: "", transmision: "", potencia: "", carroceria: "", pasajeros: "" }));
    setAutoSpecs(null);
  };
  const handleModeloManual = (modelo: string) => {
    const versionAuto = getVersiones(form.marca, modelo)[0] ?? "";
    setForm((f) => ({
      ...f, modelo,
      version: versionAuto,
      motor: "", combustible: "", transmision: "", potencia: "", carroceria: "", pasajeros: "",
    }));
    setAutoSpecs(null);
  };

  // ── Callback de EspecificacionesVehiculo ──
  const handleSpecsOutput = (specs: EspecificacionesTecnicas | null, output: SpecsOutput) => {
    setAutoSpecs(specs);
    setForm((f) => ({
      ...f,
      motor:       output.motor,
      combustible: output.combustible,
      transmision: output.transmision,
      potencia:    output.potencia,
      carroceria:  output.carroceria,
      pasajeros:   output.pasajeros,
    }));
  };

  // ── Validaciones específicas Colombia ──
  // Celular CO: 10 dígitos empezando por 3 (móviles)
  const isCelularCOValido = (c: string) => /^3\d{9}$/.test(c.replace(/\D/g, ""));
  // Email con reglas anti-spam básicas (descarta a@a.a, test@test.com, etc.)
  const isEmailValido = (e: string) => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)) return false;
    // Heurísticas anti-fake
    const low = e.toLowerCase();
    const banned = ["test@test", "aaa@aaa", "asdf@asdf", "fake@", "noreply@", "@example.com", "@test.com", "@fake.", "1234@1234"];
    if (banned.some((b) => low.includes(b))) return false;
    const [local, domain] = low.split("@");
    if (local.length < 2) return false;
    // Dominio debe tener al menos 2 partes y la TLD mínimo 2 chars
    const parts = domain.split(".");
    if (parts.length < 2 || parts[parts.length - 1].length < 2) return false;
    return true;
  };
  // Placa CO: 3 letras + 3 dígitos (autos) o 3 letras + 2 dígitos + 1 letra (motos)
  const isPlacaCOValida = (p: string) => /^[A-Z]{3}\d{3}$/.test(p) || /^[A-Z]{3}\d{2}[A-Z]$/.test(p);

  // ── Validación ──
  function validate(): boolean {
    const e: FormErrors = {};
    if (!form.marca)  e.marca  = "Selecciona una marca";
    if (!form.modelo || form.modelo === "__otro__") e.modelo = "Escribe el modelo del vehículo";
    if (!form.año)    e.año    = "Selecciona el año";

    // Placa: formato colombiano
    if (!form.placa) e.placa = "Ingresa la placa del vehículo";
    else if (!isPlacaCOValida(form.placa)) {
      e.placa = "Formato inválido. Usa ABC123 (autos) o ABC12D (motos)";
    }

    if (!form.nombre) e.nombre = "Ingresa tu nombre completo";
    else if (form.nombre.trim().length < 3) e.nombre = "Nombre muy corto";

    // Email: válido + anti-fake
    if (!form.email) e.email = "Email requerido";
    else if (!isEmailValido(form.email)) e.email = "Email inválido (revisa que sea real)";

    // Celular Colombia
    if (!form.celular) e.celular = "Ingresa tu celular";
    else if (!isCelularCOValido(form.celular)) e.celular = "Celular Colombia: 10 dígitos empezando con 3";

    if (photos.length < 3) e.fotos = "Sube al menos 3 fotos del vehículo";
    const precio = parseInt(form.precio.replace(/\D/g, ""));
    if (form.precio && precio < 5_000_000) e.precio = "El precio mínimo es $5.000.000";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // ── Helper: subir todas las fotos a Supabase Storage ──
  async function uploadAllPhotos(folder: string): Promise<string[]> {
    const urls: string[] = [];
    for (let i = 0; i < photos.length; i++) {
      try {
        const fd = new FormData();
        fd.append("file", photos[i].file);
        fd.append("folder", folder);
        const res = await fetch("/api/upload-foto", { method: "POST", body: fd });
        const data = await res.json();
        if (data.ok && data.url) urls.push(data.url);
        else console.warn(`[upload foto ${i + 1}]`, data.error);
      } catch (err) {
        console.error(`[upload foto ${i + 1}]`, err);
      }
    }
    return urls;
  }

  // ── Submit ──
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    // ── 1. Subir fotos a Supabase Storage primero ──
    const folder = `${form.marca}-${form.modelo}-${Date.now()}`.toLowerCase().replace(/[^a-z0-9-]+/g, "-");
    const fotosUrls = photos.length > 0 ? await uploadAllPhotos(folder) : [];
    if (photos.length > 0 && fotosUrls.length === 0) {
      console.warn("⚠️ No se pudieron subir las fotos. La publicación se enviará sin URLs (verifica el bucket 'vehiculos' en Supabase Storage).");
    }

    // ── 2. Modo Servicio Integral 360°: enviar a WhatsApp ──
    if (isServicioIntegral) {
      const ultimo = (form.placa || "").replace(/\D/g, "").slice(-1) || "?";
      const msg = `Hola MOVEL, quiero el *Servicio Integral 360°* para vender mi vehículo.

🚗 *Vehículo*
• Marca: ${form.marca}
• Modelo: ${form.modelo}${form.version ? ` (${form.version})` : ""}
• Año: ${form.año}
• Color: ${form.color || "—"}
• Kilometraje: ${form.kilometraje} km
• Placa (último dígito): ••• • ${ultimo}

⚙️ *Especificaciones*
• Carrocería: ${form.carroceria || "—"}
• Motor: ${form.motor || "—"}
• Combustible: ${form.combustible || "—"}
• Transmisión: ${form.transmision || "—"}
• Potencia: ${form.potencia || "—"}

💰 *Precio esperado*: $${form.precio}
🏙️ *Ciudad*: ${form.ciudad || "—"}
📷 *Fotos*: ${fotosUrls.length} subidas
${form.descripcion ? `\n📝 *Descripción*\n${form.descripcion}\n` : ""}
👤 *Contacto*
• Nombre: ${form.nombre}
• Celular: ${form.celular}
• Email: ${form.email}

Quiero que Movel se encargue de todo el proceso (fotos, peritaje, visitas, traspaso) por la comisión del 3%.`;

      const waLink = `https://wa.me/573175737083?text=${encodeURIComponent(msg)}`;
      try {
        await fetch("/api/publicar", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, totalFotos: photos.length, fotosUrls, modo: "360", user_id: user?.id ?? null }),
        });
      } catch { /* swallow */ }
      window.open(waLink, "_blank");
      setSubmitting(false);
      setShowModal(true);
      return;
    }

    // ── 3. Modo gratis: API publicar ──
    try {
      const res = await fetch("/api/publicar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, totalFotos: photos.length, fotosUrls, modo: "gratis", user_id: user?.id ?? null }),
      });
      const data = await res.json();
      if (!data.ok) console.warn("Publicación con advertencia:", data);
      setShowModal(true);
    } catch (err) {
      console.error("Submit error:", err);
      setShowModal(true);
    } finally {
      setSubmitting(false);
    }
  }

  // ── Formateo ──
  const formatPrecio = (v: string) => {
    const n = v.replace(/\D/g, "");
    return n ? parseInt(n).toLocaleString("es-CO") : "";
  };
  const formatKm = (raw: string) => {
    const n = raw.replace(/\D/g, "");
    return n ? parseInt(n).toLocaleString("es-CO") : "";
  };

  const selectClass = "w-full h-12 bg-[#f0f2f4] rounded-xl px-4 text-[15px] text-[#111418] appearance-none outline-none border border-transparent focus:border-[#0B1E4E] focus:bg-white transition-colors";
  const inputClass  = "w-full h-12 bg-[#f0f2f4] rounded-xl px-4 text-[15px] text-[#111418] placeholder-[#7A8195] outline-none border border-transparent focus:border-[#0B1E4E] focus:bg-white transition-colors";

  // ── Selector de modalidad: cuando no viene ?modo= en la URL ──
  if (!modo && user) {
    return (
      <div className="min-h-screen bg-cloud py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center gap-2 text-mute hover:text-ink text-[13px] font-semibold mb-6">
            ← Volver al inicio
          </Link>
          <div className="text-center mb-8">
            <span className="inline-block text-[11px] font-bold uppercase tracking-[0.15em] text-movel-600 bg-movel-50 px-3 py-1.5 rounded-full mb-3">
              Vender tu vehículo
            </span>
            <h1 className="font-display text-[32px] md:text-[42px] text-movel-900 leading-tight mb-3">
              ¿Cómo prefieres vender tu carro?
            </h1>
            <p className="text-[15px] text-mute max-w-xl mx-auto">
              Tú decides cómo: lo manejas todo gratis o nosotros nos encargamos del proceso completo por una comisión única del 3%.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Opción 1: Publica gratis */}
            <Link
              href="/publicar?modo=gratis"
              className="group bg-white rounded-3xl p-7 border border-[#dce0e5] hover:border-movel-300 hover:shadow-movel-lg transition-all relative"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-movel-50 flex items-center justify-center">
                  <UploadSimple size={24} color="#0B1E4E" weight="fill" />
                </div>
                <div>
                  <h3 className="font-display text-[20px] text-movel-900 leading-tight">Publica gratis</h3>
                  <p className="text-[12px] text-mute font-semibold uppercase tracking-wide">Tú lo manejas</p>
                </div>
              </div>
              <p className="text-[14px] text-mute leading-relaxed mb-5">
                Crea tu publicación gratis, sube tus fotos y atiende a los compradores directamente. <strong className="text-ink">$0 de comisión</strong>.
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  "Publicación 100% gratuita",
                  "Tu precio, tu manejo, tu negociación",
                  "Contacto directo con compradores",
                  "Publicación destacada opcional (pago)",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-2 text-[13px] text-ink">
                    <CheckCircle size={16} color="#3CCF91" weight="fill" className="flex-shrink-0 mt-0.5" />
                    {b}
                  </li>
                ))}
              </ul>
              <div className="w-full text-center px-5 py-3 border-2 border-movel-900 text-movel-900 font-bold rounded-xl text-[14px] group-hover:bg-movel-900 group-hover:text-white transition-all">
                Publicar gratis →
              </div>
            </Link>

            {/* Opción 2: Servicio integral 360° */}
            <Link
              href="/publicar?modo=360"
              className="group bg-movel-gradient-dark rounded-3xl p-7 hover:shadow-2xl transition-all border border-movel-400/30 relative overflow-hidden"
            >
              <div className="mb-5">
                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.15em] bg-sky text-white px-3 py-1.5 rounded-full shadow-lg">
                  ⚡ Recomendado
                </span>
              </div>
              <div className="flex items-start gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-movel-400/20 border border-movel-400/40 flex items-center justify-center flex-shrink-0">
                  <Handshake size={24} color="#3F8CFF" weight="fill" />
                </div>
                <div>
                  <h3 className="font-display text-[20px] text-white leading-tight">Servicio integral 360°</h3>
                  <p className="text-[12px] text-movel-300 font-semibold uppercase tracking-wide">Nosotros lo hacemos</p>
                </div>
              </div>
              <p className="text-[14px] text-white/75 leading-relaxed mb-5">
                Nosotros nos encargamos de <strong className="text-white">todo el proceso</strong>: fotos, peritaje, atención, visitas, traspaso. Tú solo firmas al final.
              </p>
              <ul className="space-y-3 mb-5">
                {[
                  { Icon: Camera,        t: "Fotos profesionales",      sub: "Sesión con fotógrafo" },
                  { Icon: Wrench,        t: "Peritaje técnico",          sub: "Mecánica, latonería, docs" },
                  { Icon: UsersThree,    t: "Atendemos los compradores", sub: "Filtramos curiosos" },
                  { Icon: CalendarCheck, t: "Coordinamos visitas",       sub: "En tus horarios" },
                  { Icon: FileText,      t: "Traspaso legal completo",   sub: "RUNT, impuestos, papeles" },
                ].map((b) => (
                  <li key={b.t} className="flex items-start gap-2.5 text-[13px]">
                    <b.Icon size={16} color="#3F8CFF" weight="fill" className="flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-white/95 font-semibold">{b.t}</p>
                      <p className="text-white/55 text-[11px]">{b.sub}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="grid grid-cols-2 gap-2 mb-5 p-3 rounded-xl bg-white/5 border border-white/10">
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-white/50 font-bold">Comisión</p>
                  <p className="text-[20px] font-display text-white">3%</p>
                  <p className="text-[10px] text-white/40">solo al vender</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-white/50 font-bold">Tu tiempo</p>
                  <p className="text-[20px] font-display text-white">~0h</p>
                  <p className="text-[10px] text-white/40">solo firmas</p>
                </div>
              </div>
              <div className="w-full text-center px-5 py-3 bg-white text-movel-900 font-black rounded-xl text-[14px] group-hover:bg-cloud transition-all">
                Quiero el servicio integral →
              </div>
            </Link>
          </div>

          <p className="text-center text-[12px] text-mute mt-8">
            ¿Tienes dudas?{" "}
            <a href="https://wa.me/573175737083?text=Tengo%20una%20duda%20sobre%20vender%20mi%20carro%20en%20MOVEL" target="_blank" rel="noopener noreferrer" className="text-movel-600 font-bold hover:underline">
              Hablar con un asesor por WhatsApp
            </a>
          </p>
        </div>
      </div>
    );
  }

  // ── Auth guard: si la auth está configurada y no hay sesión, redirigir ──
  if (authConfigured && !userLoading && !user) {
    return (
      <div className="min-h-screen bg-cloud flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-[#dce0e5] shadow-movel text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-movel-50 flex items-center justify-center mb-4">
            <SignIn size={28} color="#0B1E4E" weight="bold" />
          </div>
          <h2 className="font-display text-[24px] text-movel-900 mb-2">Inicia sesión para publicar</h2>
          <p className="text-[14px] text-mute leading-relaxed mb-6">
            Para garantizar la calidad y seguridad del catálogo, necesitas tener una cuenta verificada
            antes de publicar un vehículo. Es gratis y solo te toma 1 minuto.
          </p>
          <div className="flex flex-col gap-2.5">
            <Link
              href={`/auth?return=${encodeURIComponent(`/publicar${modo ? `?modo=${modo}` : ""}`)}`}
              className="w-full btn-primary !rounded-xl flex items-center justify-center gap-2"
            >
              <SignIn size={17} weight="bold" />
              Iniciar sesión
            </Link>
            <Link
              href={`/auth?modo=registro&return=${encodeURIComponent(`/publicar${modo ? `?modo=${modo}` : ""}`)}`}
              className="w-full text-center py-3 border-2 border-movel-900 text-movel-900 font-bold rounded-xl text-[14px] hover:bg-movel-50 transition-colors"
            >
              Crear cuenta gratis
            </Link>
            <Link href="/" className="text-[12px] text-mute hover:text-ink mt-2">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Render ──
  return (
    <div className="min-h-screen bg-[#f8f9fa]">

      {/* Header banner */}
      <div className="text-white py-8 px-4 bg-movel-gradient-dark">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center">
              {isServicioIntegral ? <Handshake size={24} color="white" weight="fill" /> : <Car size={24} color="white" weight="fill" />}
            </div>
            <div className="flex-1">
              <h1 className="font-display text-[26px] md:text-[30px] text-white leading-tight">
                {isServicioIntegral ? "Servicio Integral 360°" : "Publicar vehículo"}
              </h1>
              {isServicioIntegral && (
                <span className="inline-block mt-1 text-[11px] font-bold uppercase tracking-[0.12em] bg-sky/90 text-white px-2.5 py-0.5 rounded-full">
                  Nosotros lo hacemos · 3% comisión
                </span>
              )}
            </div>
          </div>
          {isServicioIntegral ? (
            <div className="ml-14 mt-3 p-4 bg-white/10 border border-movel-400/30 rounded-xl backdrop-blur-sm">
              <p className="text-white/90 text-[14px] leading-relaxed mb-2">
                <strong className="text-white">Cuéntanos sobre tu carro.</strong> Cuando completes el formulario y le des "Enviar",
                te llevamos a WhatsApp con un mensaje listo para que nuestro equipo te contacte y agendemos el peritaje + fotos profesionales.
              </p>
              <p className="text-[12px] text-movel-200">
                ⚡ Esto <strong>no publica</strong> tu carro automáticamente — <MovelLogo variant="white" size={14} animate={false} className="inline-block align-middle" /> se encarga de todo el proceso.
              </p>
            </div>
          ) : (
            <p className="text-white/70 text-[15px] ml-14">
              Completa el formulario. Nuestro equipo revisará tu publicación y te contactará en menos de 24 horas.
            </p>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ════════════════════════════════════════
              SECCIÓN 1 — FOTOS
          ════════════════════════════════════════ */}
          <div className="bg-white rounded-2xl p-6 border border-[#dce0e5]">
            <div className="flex items-center gap-2 mb-2">
              <ImageIcon size={20} color="#0B1E4E" weight="fill" />
              <h2 className="text-[18px] font-bold text-[#111418]">Fotos del vehículo</h2>
              <span className="text-[13px] text-[#7A8195]">({photos.length}/20) · Mínimo 3</span>
            </div>
            <div className="flex items-start gap-2 bg-[#e8f0fd] rounded-xl px-4 py-3 mb-4 text-[13px] text-[#0B1E4E]">
              <Info size={16} className="flex-shrink-0 mt-0.5" weight="fill" />
              <span>
                <strong>Tip:</strong> La primera foto será la principal.
                Recomendamos una foto de ¾ frontal con buena iluminación. Arrastra para reordenar.
              </span>
            </div>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); addPhotos(e.dataTransfer.files); }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                dragOver ? "border-[#0B1E4E] bg-[#e8f0fd]" : "border-[#dce0e5] hover:border-[#0B1E4E] hover:bg-[#f8f9fa]"
              }`}
            >
              <UploadSimple size={36} color={dragOver ? "#0B1E4E" : "#7A8195"} className="mx-auto mb-3" />
              <p className="text-[15px] font-semibold text-[#111418]">Arrastra tus fotos aquí</p>
              <p className="text-[13px] text-[#7A8195] mt-1">o haz clic · JPG, PNG, WEBP · Hasta 20 fotos</p>
              <div className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 text-white rounded-xl text-[14px] font-bold" style={{ background: "linear-gradient(135deg, #050E26, #0B1E4E)" }}>
                <UploadSimple size={16} /> Seleccionar fotos
              </div>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => addPhotos(e.target.files)} />
            {errors.fotos && <p className="text-[13px] text-red-500 mt-2">{errors.fotos}</p>}
            {photos.length > 0 && (
              <>
                <p className="text-[12px] text-[#7A8195] mt-3">
                  💡 <strong>Arrastra</strong> las miniaturas para reordenar.
                </p>
                <DraggablePhotoGrid photos={photos} onRemove={removePhoto} onReorder={setPhotos} />
              </>
            )}
          </div>

          {/* ════════════════════════════════════════
              SECCIÓN 2 — IDENTIFICACIÓN DEL VEHÍCULO
              (Base oficial Min. Transporte 2026 — 11.537 referencias)
          ════════════════════════════════════════ */}
          <div className="bg-white rounded-2xl border border-[#dce0e5] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#f0f2f4]">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #0d1b2e 0%, #0B1E4E 100%)" }}>
                  <Car size={18} color="white" weight="fill" />
                </div>
                <div>
                  <h2 className="text-[18px] font-bold text-[#111418] leading-tight">Identificación del vehículo</h2>
                  <p className="text-[11px] text-[#7A8195]">Base oficial Ministerio de Transporte 2026 · 11.537 referencias</p>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-5">

              {/* ── Placa (con privacidad) ── */}
              <div>
                <label className="text-[12px] font-bold text-[#374151] mb-1.5 block uppercase tracking-wide">Placa del vehículo *</label>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <input
                    type="text"
                    value={form.placa}
                    onChange={(e) => setF("placa", e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6))}
                    placeholder="Ej: ABC123"
                    maxLength={6}
                    autoComplete="off"
                    className={`${inputClass} w-full sm:w-44 font-mono font-bold text-[18px] tracking-widest uppercase`}
                  />

                  {/* Preview de lo que verán los compradores */}
                  {form.placa && (() => {
                    const ultimo = form.placa.replace(/\D/g, "").slice(-1) || "?";
                    return (
                      <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-[#EEF4FF] border border-movel-200">
                        <span className="text-[11px] font-bold text-movel-600 uppercase tracking-wide">Verán</span>
                        <span className="font-mono font-bold text-[18px] tracking-widest text-movel-900">
                          •••&nbsp;•&nbsp;{ultimo}
                        </span>
                      </div>
                    );
                  })()}
                </div>

                {errors.placa && <p className="text-[12px] text-red-500 mt-1">{errors.placa}</p>}

                <div className="mt-2 flex items-start gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-200">
                  <span className="text-[14px] flex-shrink-0">🔒</span>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    <strong className="font-bold">Tu placa completa es privada.</strong> Solo el equipo MOVEL la verá para verificar el vehículo en el RUNT. A los compradores solo se les mostrará el último dígito (para pico y placa).
                  </p>
                </div>
              </div>

              <hr className="border-[#f0f2f4]" />

              {/* ── Selector oficial (camino primario) ── */}
              {!modoManual ? (
                <div>
                  <VehicleSelector
                    onChange={handleVehicleSelect}
                  />

                  {/* Confirmación visual cuando hay selección */}
                  {vehicleSel && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl flex items-start gap-2.5">
                      <CheckCircle size={16} color="#16a34a" weight="fill" className="flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[12px] font-bold text-green-800">
                          {normalizeMarca(vehicleSel.marca)} · {vehicleSel.referencia}
                        </p>
                        <p className="text-[11px] text-green-700 mt-0.5">
                          {vehicleSel.tipoLabel}
                          {vehicleSel.cilindraje ? ` · ${vehicleSel.cilindraje} cc` : ""}
                          {vehicleSel.pasajeros ? ` · ${vehicleSel.pasajeros} pasajeros` : ""}
                          {" · "}Las especificaciones técnicas se completarán automáticamente ✨
                        </p>
                      </div>
                    </div>
                  )}

                  {errors.marca && !vehicleSel && (
                    <p className="text-[12px] text-red-500 mt-2 flex items-center gap-1">
                      <Warning size={13} weight="fill" /> {errors.marca}
                    </p>
                  )}
                  {errors.modelo && !vehicleSel && (
                    <p className="text-[12px] text-red-500 mt-1 flex items-center gap-1">
                      <Warning size={13} weight="fill" /> {errors.modelo}
                    </p>
                  )}

                  {/* Escapatoria a ingreso manual */}
                  <button
                    type="button"
                    onClick={() => { setModoManual(true); setVehicleSel(null); setForm(f => ({ ...f, marca: "", modelo: "", version: "", motor: "", carroceria: "", pasajeros: "" })); setAutoSpecs(null); }}
                    className="mt-3 text-[12px] text-[#7A8195] hover:text-[#0B1E4E] underline underline-offset-2 transition-colors"
                  >
                    Mi vehículo no aparece en la lista →
                  </button>
                </div>
              ) : (
                /* ── Entrada manual (fallback) ── */
                <div className="space-y-3">
                  <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
                    <Warning size={14} color="#d97706" weight="fill" className="flex-shrink-0" />
                    <p className="text-[12px] text-amber-800">
                      Modo manual — las especificaciones se completarán con IA según los datos que ingreses.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[12px] font-bold text-[#374151] mb-1.5 block uppercase tracking-wide">Marca *</label>
                      <select value={form.marca} onChange={(e) => handleMarcaManual(e.target.value)} className={selectClass}>
                        <option value="">Seleccionar marca</option>
                        {marcas.map((m) => <option key={m} value={m}>{m}</option>)}
                      </select>
                      {errors.marca && <p className="text-[12px] text-red-500 mt-1">{errors.marca}</p>}
                    </div>
                    <div>
                      <label className="text-[12px] font-bold text-[#374151] mb-1.5 block uppercase tracking-wide">Modelo *</label>
                      <input
                        type="text"
                        value={form.modelo}
                        onChange={(e) => handleModeloManual(e.target.value)}
                        disabled={!form.marca}
                        placeholder={form.marca ? "Ej: Corolla, Onix, Tucson…" : "Selecciona marca primero"}
                        className={`${inputClass} disabled:opacity-50`}
                      />
                      {errors.modelo && <p className="text-[12px] text-red-500 mt-1">{errors.modelo}</p>}
                    </div>
                    <div>
                      <label className="text-[12px] font-bold text-[#374151] mb-1.5 block uppercase tracking-wide">Versión / Trim</label>
                      <input
                        type="text"
                        value={form.version}
                        onChange={(e) => setF("version", e.target.value)}
                        placeholder="Ej: LT, GT, Sport, Active…"
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setModoManual(false); setForm(f => ({ ...f, marca: "", modelo: "", version: "" })); }}
                    className="text-[12px] text-[#7A8195] hover:text-[#0B1E4E] underline underline-offset-2 transition-colors"
                  >
                    ← Volver al buscador oficial
                  </button>
                </div>
              )}

              <hr className="border-[#f0f2f4]" />

              {/* ── Año + Color + Ciudad ── */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[12px] font-bold text-[#374151] mb-1.5 block uppercase tracking-wide">Año modelo *</label>
                  <select value={form.año} onChange={(e) => setF("año", e.target.value)} className={selectClass}>
                    <option value="">Seleccionar año</option>
                    {years.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                  {errors.año && <p className="text-[12px] text-red-500 mt-1">{errors.año}</p>}
                </div>
                <div>
                  <label className="text-[12px] font-bold text-[#374151] mb-1.5 block uppercase tracking-wide">Color</label>
                  <select value={form.color} onChange={(e) => setF("color", e.target.value)} className={selectClass}>
                    <option value="">Seleccionar</option>
                    {colores.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-[12px] font-bold text-[#374151] mb-1.5 block uppercase tracking-wide">Ciudad</label>
                  <select value={form.ciudad} onChange={(e) => setF("ciudad", e.target.value)} className={selectClass}>
                    <option value="">Seleccionar</option>
                    {ciudades.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* ── Kilometraje + Precio ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[12px] font-bold text-[#374151] mb-1.5 block uppercase tracking-wide">Kilometraje</label>
                  <div className="relative">
                    <input
                      type="text" inputMode="numeric"
                      value={formatKm(form.kilometraje)}
                      onChange={(e) => setF("kilometraje", e.target.value.replace(/\D/g, ""))}
                      placeholder="45.000"
                      className={inputClass}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-[#7A8195] pointer-events-none">km</span>
                  </div>
                </div>
                <div>
                  <label className="text-[12px] font-bold text-[#374151] mb-1.5 block uppercase tracking-wide">Precio (COP) *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A8195] font-bold text-[14px]">$</span>
                    <input
                      type="text" inputMode="numeric"
                      value={form.precio}
                      onChange={(e) => setF("precio", formatPrecio(e.target.value))}
                      placeholder="85.000.000"
                      className={`${inputClass} pl-8`}
                    />
                  </div>
                  {errors.precio && <p className="text-[12px] text-red-500 mt-1">{errors.precio}</p>}
                  <OfertasToggle
                    value={form.accept_offers}
                    onChange={(v) => setF("accept_offers", v)}
                    disabled={!form.marca || !form.modelo || !form.precio}
                  />
                </div>
              </div>

              {/* ── Descripción ── */}
              <div>
                <label className="text-[12px] font-bold text-[#374151] mb-1.5 block uppercase tracking-wide">Descripción del vehículo</label>
                <textarea
                  value={form.descripcion}
                  onChange={(e) => setF("descripcion", e.target.value)}
                  placeholder="Describe el estado general, extras, historial de mantenimiento, motivo de venta..."
                  rows={4}
                  className="w-full bg-[#f0f2f4] rounded-xl px-4 py-3 text-[15px] text-[#111418] placeholder-[#7A8195] outline-none border border-transparent focus:border-[#0B1E4E] focus:bg-white transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          {/* ════════════════════════════════════════
              ESPECIFICACIONES TÉCNICAS
              Auto-completado con DB + IA para todos los vehículos
          ════════════════════════════════════════ */}
          {form.marca && form.modelo && (
            <EspecificacionesVehiculo
              marca={form.marca}
              modelo={form.modelo}
              version={form.version}
              ano={form.año}
              cilindraje={vehicleSel?.cilindraje ?? null}
              onOutputChange={handleSpecsOutput}
              onCleared={() => setAutoSpecs(null)}
            />
          )}

          {/* ════════════════════════════════════════
              FUNCIONALIDAD 3 — MINI FICHA TÉCNICA
              (aparece cuando hay especificaciones cargadas)
          ════════════════════════════════════════ */}
          {autoSpecs && form.año && form.modelo !== "__otro__" && (
            <FichaTecnicaCard
              specs={autoSpecs}
              marca={form.marca}
              modelo={form.modelo}
              version={form.version}
              año={form.año}
            />
          )}

          {/* ════════════════════════════════════════
              SECCIÓN 3 — HISTORIAL
          ════════════════════════════════════════ */}
          <div className="bg-white rounded-2xl p-6 border border-[#dce0e5]">
            <div className="flex items-center gap-2 mb-2">
              <ClipboardText size={20} color="#0B1E4E" weight="fill" />
              <h2 className="text-[18px] font-bold text-[#111418]">Historial del vehículo</h2>
            </div>
            <p className="text-[13px] text-[#7A8195] mb-5">Más información = más confianza = mejor precio de venta.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[13px] font-bold text-[#7A8195] mb-1.5 block uppercase tracking-wide">Número de propietarios</label>
                <select value={form.propietarios} onChange={(e) => setF("propietarios", e.target.value)} className={selectClass}>
                  <option value="">Seleccionar</option>
                  {propietarioOpciones.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[13px] font-bold text-[#7A8195] mb-1.5 block uppercase tracking-wide">Uso del vehículo</label>
                <select value={form.uso} onChange={(e) => setF("uso", e.target.value)} className={selectClass}>
                  <option value="">Seleccionar</option>
                  {usoOpciones.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[13px] font-bold text-[#7A8195] mb-1.5 block uppercase tracking-wide">SOAT</label>
                <select value={form.soatVigente} onChange={(e) => setF("soatVigente", e.target.value)} className={selectClass}>
                  <option value="">Estado del SOAT</option>
                  <option value="vigente">Vigente</option>
                  <option value="vencido">Vencido</option>
                  <option value="no_se">No sé</option>
                </select>
              </div>
              {form.soatVigente === "vigente" && (
                <div>
                  <label className="text-[13px] font-bold text-[#7A8195] mb-1.5 block uppercase tracking-wide">SOAT vigente hasta</label>
                  <input type="date" value={form.soatHasta} onChange={(e) => setF("soatHasta", e.target.value)} className={inputClass} />
                </div>
              )}
              <div>
                <label className="text-[13px] font-bold text-[#7A8195] mb-1.5 block uppercase tracking-wide">Tecnomecánica</label>
                <select value={form.tecnoVigente} onChange={(e) => setF("tecnoVigente", e.target.value)} className={selectClass}>
                  <option value="">Estado tecnomecánica</option>
                  <option value="vigente">Vigente</option>
                  <option value="vencida">Vencida</option>
                  <option value="no_aplica">No aplica (vehículo nuevo)</option>
                  <option value="no_se">No sé</option>
                </select>
              </div>
              {form.tecnoVigente === "vigente" && (
                <div>
                  <label className="text-[13px] font-bold text-[#7A8195] mb-1.5 block uppercase tracking-wide">Tecnomecánica vigente hasta</label>
                  <input type="date" value={form.tecnoHasta} onChange={(e) => setF("tecnoHasta", e.target.value)} className={inputClass} />
                </div>
              )}
            </div>

            {/* Siniestros */}
            <div className="mt-5 p-4 bg-[#f8f9fa] rounded-xl border border-[#dce0e5]">
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <p className="text-[14px] font-bold text-[#111418]">¿El vehículo ha tenido siniestros o choques?</p>
                <div className="flex gap-2">
                  <button type="button" onClick={() => setF("sinSiniestros", true)}
                    className={`px-4 py-2 rounded-lg text-[13px] font-bold border-2 transition-all ${form.sinSiniestros ? "bg-green-500 text-white border-green-500" : "border-[#dce0e5] text-[#7A8195]"}`}>
                    No, ninguno
                  </button>
                  <button type="button" onClick={() => setF("sinSiniestros", false)}
                    className={`px-4 py-2 rounded-lg text-[13px] font-bold border-2 transition-all ${!form.sinSiniestros ? "bg-amber-500 text-white border-amber-500" : "border-[#dce0e5] text-[#7A8195]"}`}>
                    Sí, uno o más
                  </button>
                </div>
              </div>
              {!form.sinSiniestros && (
                <textarea
                  value={form.siniestrosDesc}
                  onChange={(e) => setF("siniestrosDesc", e.target.value)}
                  placeholder="Describe el tipo de choque, parte afectada y si fue reparado correctamente..."
                  rows={3}
                  className="w-full bg-white rounded-xl px-4 py-3 text-[14px] placeholder-[#7A8195] outline-none border border-amber-200 focus:border-amber-400 resize-none"
                />
              )}
            </div>

            {/* Checklist */}
            <div className="mt-5">
              <p className="text-[13px] font-bold text-[#7A8195] uppercase tracking-wide mb-3">Extras incluidos</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { key: "revisionAlDia", label: "Revisión al día" },
                  { key: "mantenimientoAgencia", label: "Mantenimiento agencia" },
                  { key: "llavesRepuesto", label: "Llaves de repuesto" },
                  { key: "kitHerramientas", label: "Kit de herramientas" },
                ].map(({ key, label }) => (
                  <label key={key}
                    className="flex items-center gap-2 cursor-pointer p-3 rounded-xl border-2 transition-all hover:border-[#0B1E4E] border-[#dce0e5]"
                    style={form[key as keyof typeof form] ? { borderColor: "#0B1E4E", background: "#e8f0fd" } : {}}>
                    <input type="checkbox" checked={!!form[key as keyof typeof form]}
                      onChange={(e) => setF(key, e.target.checked)} className="w-4 h-4 accent-[#0B1E4E]" />
                    <span className="text-[13px] font-semibold text-[#111418]">{label}</span>
                  </label>
                ))}
              </div>
              <div className="mt-3">
                <label className="text-[13px] font-bold text-[#7A8195] mb-1.5 block uppercase tracking-wide">Extras y accesorios adicionales</label>
                <textarea value={form.extras} onChange={(e) => setF("extras", e.target.value)}
                  placeholder="Ej: Techo panorámico, cámara de reversa, rines originales, alarma, pantalla táctil..."
                  rows={2}
                  className="w-full bg-[#f0f2f4] rounded-xl px-4 py-3 text-[14px] placeholder-[#7A8195] outline-none border border-transparent focus:border-[#0B1E4E] focus:bg-white transition-colors resize-none" />
              </div>
            </div>
          </div>

          {/* ════════════════════════════════════════
              SECCIÓN 4 — DOCUMENTOS
          ════════════════════════════════════════ */}
          <div className="bg-white rounded-2xl p-6 border border-[#dce0e5]">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={20} color="#0B1E4E" weight="fill" />
              <h2 className="text-[18px] font-bold text-[#111418]">Documentos</h2>
              <span className="text-[13px] text-[#7A8195]">Opcional — muy recomendado</span>
            </div>
            <p className="text-[13px] text-[#7A8195] mb-4">Genera más confianza y acelera el proceso de venta.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: "tarjeta", label: "Tarjeta de propiedad", hint: "PDF o foto" },
                { key: "cedula",  label: "Documento de identidad", hint: "PDF o foto" },
                { key: "soat",   label: "SOAT vigente",           hint: "PDF o foto" },
                { key: "tecno",  label: "Tecnomecánica",          hint: "PDF o foto" },
              ].map(({ key, label, hint }) => (
                <label key={key}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    docUploads[key as keyof typeof docUploads]
                      ? "border-green-400 bg-green-50"
                      : "border-[#dce0e5] hover:border-[#0B1E4E] hover:bg-[#e8f0fd]"
                  }`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${docUploads[key as keyof typeof docUploads] ? "bg-green-100" : "bg-[#f0f2f4]"}`}>
                    {docUploads[key as keyof typeof docUploads]
                      ? <CheckCircle size={22} color="#16a34a" weight="fill" />
                      : <UploadSimple size={22} color="#7A8195" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-[14px] font-bold text-[#111418]">{label}</p>
                    <p className="text-[12px] text-[#7A8195]">{hint}</p>
                  </div>
                  <span className={`text-[13px] font-bold ${docUploads[key as keyof typeof docUploads] ? "text-green-600" : "text-[#0B1E4E]"}`}>
                    {docUploads[key as keyof typeof docUploads] ? "✓ Cargado" : "Subir"}
                  </span>
                  <input type="file" accept="image/*,.pdf" className="hidden"
                    onChange={() => setDocUploads((d) => ({ ...d, [key]: true }))} />
                </label>
              ))}
            </div>
            <div className="mt-4 flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-4">
              <Warning size={16} color="#d97706" className="flex-shrink-0 mt-0.5" weight="fill" />
              <p className="text-[12px] text-amber-700">
                Tus documentos son <strong>confidenciales</strong>. Solo los revisa el equipo MOVEL para verificar la publicación.
              </p>
            </div>
          </div>

          {/* ════════════════════════════════════════
              SECCIÓN 5 — DATOS DE CONTACTO
          ════════════════════════════════════════ */}
          <div className="bg-white rounded-2xl p-6 border border-[#dce0e5]">
            <div className="flex items-center gap-2 mb-5">
              <CurrencyCircleDollar size={20} color="#0B1E4E" weight="fill" />
              <h2 className="text-[18px] font-bold text-[#111418]">Tus datos de contacto</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[13px] font-bold text-[#7A8195] mb-1.5 block uppercase tracking-wide">Nombre completo *</label>
                <input type="text" value={form.nombre} onChange={(e) => setF("nombre", e.target.value)} placeholder="Tu nombre" className={inputClass} />
                {errors.nombre && <p className="text-[12px] text-red-500 mt-1">{errors.nombre}</p>}
              </div>
              <div>
                <label className="text-[13px] font-bold text-[#7A8195] mb-1.5 block uppercase tracking-wide">Correo electrónico *</label>
                <input type="email" value={form.email} onChange={(e) => setF("email", e.target.value)} placeholder="tucorreo@gmail.com" className={inputClass} />
                {errors.email && <p className="text-[12px] text-red-500 mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="text-[13px] font-bold text-[#7A8195] mb-1.5 block uppercase tracking-wide">Celular *</label>
                <input type="tel" value={form.celular} onChange={(e) => setF("celular", e.target.value)} placeholder="+57 300 000 0000" className={inputClass} />
                {errors.celular && <p className="text-[12px] text-red-500 mt-1">{errors.celular}</p>}
              </div>
            </div>
          </div>

          {/* ── Submit ── */}
          <button
            type="submit"
            disabled={submitting}
            className={`w-full h-14 text-white rounded-2xl font-black text-[16px] md:text-[17px] transition-all disabled:opacity-60 shadow-lg hover:opacity-90 interactive flex items-center justify-center gap-2.5 ${
              isServicioIntegral ? "bg-[#25d366] hover:bg-[#20b858]" : "bg-movel-gradient"
            }`}
          >
            {isServicioIntegral && !submitting && <WhatsappLogo size={22} weight="fill" />}
            {submitting
              ? (isServicioIntegral ? "Abriendo WhatsApp..." : "Enviando publicación...")
              : (isServicioIntegral ? <>Enviar a <MovelLogo variant="white" size={16} animate={false} className="inline-block align-middle mx-1" /> por WhatsApp →</> : "Publicar mi vehículo →")}
          </button>

          <p className="text-center text-[13px] text-[#7A8195]">
            {isServicioIntegral ? (
              <>Al enviar aceptas que el equipo <MovelLogo variant="primary" size={14} animate={false} className="inline-block align-middle mx-0.5" /> te contacte para coordinar el servicio integral.</>
            ) : (
              <>Al publicar aceptas nuestros{" "}
                <a href="https://wa.me/573175737083?text=Quiero%20información%20sobre%20los%20términos%20de%20MOVEL" target="_blank" rel="noopener noreferrer" className="text-[#0B1E4E] hover:underline">
                  Términos y Condiciones
                </a>.
              </>
            )}
          </p>
        </form>
      </div>

      <BottomNav />

      {/* ── Modal de éxito ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md text-center shadow-2xl animate-scale-bounce">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={44} color="#16a34a" weight="fill" />
            </div>
            <h3 className="text-[24px] font-black text-[#111418] mb-2">¡Vehículo publicado!</h3>
            <p className="text-[15px] text-[#7A8195] leading-relaxed mb-3">
              Recibimos tu publicación. Un asesor revisará la información y te contactará en las próximas <strong>24 horas</strong>.
            </p>
            <p className="text-[13px] text-[#7A8195] mb-6">
              Te escribiremos a <strong className="text-[#111418]">{form.email}</strong> y al celular <strong className="text-[#111418]">{form.celular}</strong>.
            </p>
            <div className="flex gap-3">
              <Link href="/buscar" className="flex-1 h-12 border-2 border-[#dce0e5] text-[#111418] rounded-xl font-bold text-[14px] flex items-center justify-center hover:bg-[#f0f2f4] transition-colors">
                Ver vehículos
              </Link>
              <button onClick={() => setShowModal(false)} className="flex-1 h-12 text-white rounded-xl font-bold text-[14px] transition-all hover:opacity-90" style={{ background: "linear-gradient(135deg, #050E26, #0B1E4E)" }}>
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Wrapper para Suspense (useSearchParams lo necesita en Next.js 14)
export default function PublicarPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-mute">Cargando…</div>}>
      <PublicarContent />
    </Suspense>
  );
}
