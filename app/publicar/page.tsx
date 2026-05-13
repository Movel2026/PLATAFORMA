"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  UploadSimple, X, CheckCircle, Image as ImageIcon,
  Car, FileText, CurrencyCircleDollar, ClipboardText,
  Warning, Info,
} from "@phosphor-icons/react";
import BottomNav from "@/components/BottomNav";
import MovelPageHeader from "@/components/MovelPageHeader";
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
            i === 0 ? "border-[#1978e5] ring-2 ring-[#1978e5]/20" : "border-[#dce0e5] hover:border-[#1978e5]/50"
          }`}
        >
          {i === 0 && (
            <div className="absolute top-1 left-1 z-10 bg-[#1978e5] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow">
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
export default function PublicarPage() {
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
    "CAMIONETAS Y CAMPEROS":  "SUV",
    "CAMIONETAS DOBLECABINA": "Pickup / Camioneta",
    ELECTRICOS:               "Eléctrico",
    HIBRIDOS:                 "Híbrido",
    PASAJEROS:                "Minivan",
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

  // ── Validación ──
  function validate(): boolean {
    const e: FormErrors = {};
    if (!form.marca)  e.marca  = "Selecciona una marca";
    if (!form.modelo || form.modelo === "__otro__") e.modelo = "Escribe el modelo del vehículo";
    if (!form.año)    e.año    = "Selecciona el año";
    if (!form.placa)  e.placa  = "Ingresa la placa del vehículo";
    if (!form.nombre) e.nombre = "Ingresa tu nombre";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Email válido requerido";
    if (!form.celular) e.celular = "Ingresa tu celular";
    if (photos.length < 3) e.fotos = "Sube al menos 3 fotos del vehículo";
    const precio = parseInt(form.precio.replace(/\D/g, ""));
    if (form.precio && precio < 5_000_000) e.precio = "El precio mínimo es $5.000.000";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // ── Submit ──
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/publicar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, totalFotos: photos.length }),
      });
      if (res.ok) setShowModal(true);
    } catch {
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

  const selectClass = "w-full h-12 bg-[#f0f2f4] rounded-xl px-4 text-[15px] text-[#111418] appearance-none outline-none border border-transparent focus:border-[#1978e5] focus:bg-white transition-colors";
  const inputClass  = "w-full h-12 bg-[#f0f2f4] rounded-xl px-4 text-[15px] text-[#111418] placeholder-[#637488] outline-none border border-transparent focus:border-[#1978e5] focus:bg-white transition-colors";

  // ── Render ──
  return (
    <div className="min-h-screen bg-[#f8f9fa]">

      {/* Navigation */}
      <MovelPageHeader />

      {/* Header banner */}
      <div
        className="text-white py-8 px-4"
        style={{ background: "linear-gradient(135deg, #0d1b2e 0%, #1565c0 60%, #1978e5 100%)" }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center">
              <Car size={24} color="white" weight="fill" />
            </div>
            <h1 className="text-[30px] font-black tracking-tight">Publicar vehículo</h1>
          </div>
          <p className="text-white/70 text-[15px] ml-14">
            Completa el formulario. Nuestro equipo revisará tu publicación y te contactará en menos de 24 horas.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ════════════════════════════════════════
              SECCIÓN 1 — FOTOS
          ════════════════════════════════════════ */}
          <div className="bg-white rounded-2xl p-6 border border-[#dce0e5]">
            <div className="flex items-center gap-2 mb-2">
              <ImageIcon size={20} color="#1978e5" weight="fill" />
              <h2 className="text-[18px] font-bold text-[#111418]">Fotos del vehículo</h2>
              <span className="text-[13px] text-[#637488]">({photos.length}/20) · Mínimo 3</span>
            </div>
            <div className="flex items-start gap-2 bg-[#e8f0fd] rounded-xl px-4 py-3 mb-4 text-[13px] text-[#1978e5]">
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
                dragOver ? "border-[#1978e5] bg-[#e8f0fd]" : "border-[#dce0e5] hover:border-[#1978e5] hover:bg-[#f8f9fa]"
              }`}
            >
              <UploadSimple size={36} color={dragOver ? "#1978e5" : "#637488"} className="mx-auto mb-3" />
              <p className="text-[15px] font-semibold text-[#111418]">Arrastra tus fotos aquí</p>
              <p className="text-[13px] text-[#637488] mt-1">o haz clic · JPG, PNG, WEBP · Hasta 20 fotos</p>
              <div className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 text-white rounded-xl text-[14px] font-bold" style={{ background: "linear-gradient(135deg, #1565c0, #1978e5)" }}>
                <UploadSimple size={16} /> Seleccionar fotos
              </div>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => addPhotos(e.target.files)} />
            {errors.fotos && <p className="text-[13px] text-red-500 mt-2">{errors.fotos}</p>}
            {photos.length > 0 && (
              <>
                <p className="text-[12px] text-[#637488] mt-3">
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
                  style={{ background: "linear-gradient(135deg, #0d1b2e 0%, #1978e5 100%)" }}>
                  <Car size={18} color="white" weight="fill" />
                </div>
                <div>
                  <h2 className="text-[18px] font-bold text-[#111418] leading-tight">Identificación del vehículo</h2>
                  <p className="text-[11px] text-[#637488]">Base oficial Ministerio de Transporte 2026 · 11.537 referencias</p>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-5">

              {/* ── Placa ── */}
              <div>
                <label className="text-[12px] font-bold text-[#374151] mb-1.5 block uppercase tracking-wide">Placa del vehículo *</label>
                <input
                  type="text"
                  value={form.placa}
                  onChange={(e) => setF("placa", e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6))}
                  placeholder="Ej: ABC123"
                  maxLength={6}
                  className={`${inputClass} w-full sm:w-40 font-mono font-bold text-[18px] tracking-widest uppercase`}
                />
                {errors.placa && <p className="text-[12px] text-red-500 mt-1">{errors.placa}</p>}
                <p className="text-[11px] text-[#9ca3af] mt-1">Solo visible para el equipo MOVEL. No se publica.</p>
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
                    className="mt-3 text-[12px] text-[#637488] hover:text-[#1978e5] underline underline-offset-2 transition-colors"
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
                    className="text-[12px] text-[#637488] hover:text-[#1978e5] underline underline-offset-2 transition-colors"
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
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[13px] text-[#637488] pointer-events-none">km</span>
                  </div>
                </div>
                <div>
                  <label className="text-[12px] font-bold text-[#374151] mb-1.5 block uppercase tracking-wide">Precio (COP) *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#637488] font-bold text-[14px]">$</span>
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
                    disabled={!formValid}
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
                  className="w-full bg-[#f0f2f4] rounded-xl px-4 py-3 text-[15px] text-[#111418] placeholder-[#637488] outline-none border border-transparent focus:border-[#1978e5] focus:bg-white transition-colors resize-none"
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
              <ClipboardText size={20} color="#1978e5" weight="fill" />
              <h2 className="text-[18px] font-bold text-[#111418]">Historial del vehículo</h2>
            </div>
            <p className="text-[13px] text-[#637488] mb-5">Más información = más confianza = mejor precio de venta.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[13px] font-bold text-[#637488] mb-1.5 block uppercase tracking-wide">Número de propietarios</label>
                <select value={form.propietarios} onChange={(e) => setF("propietarios", e.target.value)} className={selectClass}>
                  <option value="">Seleccionar</option>
                  {propietarioOpciones.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[13px] font-bold text-[#637488] mb-1.5 block uppercase tracking-wide">Uso del vehículo</label>
                <select value={form.uso} onChange={(e) => setF("uso", e.target.value)} className={selectClass}>
                  <option value="">Seleccionar</option>
                  {usoOpciones.map((u) => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[13px] font-bold text-[#637488] mb-1.5 block uppercase tracking-wide">SOAT</label>
                <select value={form.soatVigente} onChange={(e) => setF("soatVigente", e.target.value)} className={selectClass}>
                  <option value="">Estado del SOAT</option>
                  <option value="vigente">Vigente</option>
                  <option value="vencido">Vencido</option>
                  <option value="no_se">No sé</option>
                </select>
              </div>
              {form.soatVigente === "vigente" && (
                <div>
                  <label className="text-[13px] font-bold text-[#637488] mb-1.5 block uppercase tracking-wide">SOAT vigente hasta</label>
                  <input type="date" value={form.soatHasta} onChange={(e) => setF("soatHasta", e.target.value)} className={inputClass} />
                </div>
              )}
              <div>
                <label className="text-[13px] font-bold text-[#637488] mb-1.5 block uppercase tracking-wide">Tecnomecánica</label>
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
                  <label className="text-[13px] font-bold text-[#637488] mb-1.5 block uppercase tracking-wide">Tecnomecánica vigente hasta</label>
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
                    className={`px-4 py-2 rounded-lg text-[13px] font-bold border-2 transition-all ${form.sinSiniestros ? "bg-green-500 text-white border-green-500" : "border-[#dce0e5] text-[#637488]"}`}>
                    No, ninguno
                  </button>
                  <button type="button" onClick={() => setF("sinSiniestros", false)}
                    className={`px-4 py-2 rounded-lg text-[13px] font-bold border-2 transition-all ${!form.sinSiniestros ? "bg-amber-500 text-white border-amber-500" : "border-[#dce0e5] text-[#637488]"}`}>
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
                  className="w-full bg-white rounded-xl px-4 py-3 text-[14px] placeholder-[#637488] outline-none border border-amber-200 focus:border-amber-400 resize-none"
                />
              )}
            </div>

            {/* Checklist */}
            <div className="mt-5">
              <p className="text-[13px] font-bold text-[#637488] uppercase tracking-wide mb-3">Extras incluidos</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { key: "revisionAlDia", label: "Revisión al día" },
                  { key: "mantenimientoAgencia", label: "Mantenimiento agencia" },
                  { key: "llavesRepuesto", label: "Llaves de repuesto" },
                  { key: "kitHerramientas", label: "Kit de herramientas" },
                ].map(({ key, label }) => (
                  <label key={key}
                    className="flex items-center gap-2 cursor-pointer p-3 rounded-xl border-2 transition-all hover:border-[#1978e5] border-[#dce0e5]"
                    style={form[key as keyof typeof form] ? { borderColor: "#1978e5", background: "#e8f0fd" } : {}}>
                    <input type="checkbox" checked={!!form[key as keyof typeof form]}
                      onChange={(e) => setF(key, e.target.checked)} className="w-4 h-4 accent-[#1978e5]" />
                    <span className="text-[13px] font-semibold text-[#111418]">{label}</span>
                  </label>
                ))}
              </div>
              <div className="mt-3">
                <label className="text-[13px] font-bold text-[#637488] mb-1.5 block uppercase tracking-wide">Extras y accesorios adicionales</label>
                <textarea value={form.extras} onChange={(e) => setF("extras", e.target.value)}
                  placeholder="Ej: Techo panorámico, cámara de reversa, rines originales, alarma, pantalla táctil..."
                  rows={2}
                  className="w-full bg-[#f0f2f4] rounded-xl px-4 py-3 text-[14px] placeholder-[#637488] outline-none border border-transparent focus:border-[#1978e5] focus:bg-white transition-colors resize-none" />
              </div>
            </div>
          </div>

          {/* ════════════════════════════════════════
              SECCIÓN 4 — DOCUMENTOS
          ════════════════════════════════════════ */}
          <div className="bg-white rounded-2xl p-6 border border-[#dce0e5]">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={20} color="#1978e5" weight="fill" />
              <h2 className="text-[18px] font-bold text-[#111418]">Documentos</h2>
              <span className="text-[13px] text-[#637488]">Opcional — muy recomendado</span>
            </div>
            <p className="text-[13px] text-[#637488] mb-4">Genera más confianza y acelera el proceso de venta.</p>
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
                      : "border-[#dce0e5] hover:border-[#1978e5] hover:bg-[#e8f0fd]"
                  }`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${docUploads[key as keyof typeof docUploads] ? "bg-green-100" : "bg-[#f0f2f4]"}`}>
                    {docUploads[key as keyof typeof docUploads]
                      ? <CheckCircle size={22} color="#16a34a" weight="fill" />
                      : <UploadSimple size={22} color="#637488" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-[14px] font-bold text-[#111418]">{label}</p>
                    <p className="text-[12px] text-[#637488]">{hint}</p>
                  </div>
                  <span className={`text-[13px] font-bold ${docUploads[key as keyof typeof docUploads] ? "text-green-600" : "text-[#1978e5]"}`}>
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
              <CurrencyCircleDollar size={20} color="#1978e5" weight="fill" />
              <h2 className="text-[18px] font-bold text-[#111418]">Tus datos de contacto</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[13px] font-bold text-[#637488] mb-1.5 block uppercase tracking-wide">Nombre completo *</label>
                <input type="text" value={form.nombre} onChange={(e) => setF("nombre", e.target.value)} placeholder="Tu nombre" className={inputClass} />
                {errors.nombre && <p className="text-[12px] text-red-500 mt-1">{errors.nombre}</p>}
              </div>
              <div>
                <label className="text-[13px] font-bold text-[#637488] mb-1.5 block uppercase tracking-wide">Correo electrónico *</label>
                <input type="email" value={form.email} onChange={(e) => setF("email", e.target.value)} placeholder="tucorreo@gmail.com" className={inputClass} />
                {errors.email && <p className="text-[12px] text-red-500 mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="text-[13px] font-bold text-[#637488] mb-1.5 block uppercase tracking-wide">Celular *</label>
                <input type="tel" value={form.celular} onChange={(e) => setF("celular", e.target.value)} placeholder="+57 300 000 0000" className={inputClass} />
                {errors.celular && <p className="text-[12px] text-red-500 mt-1">{errors.celular}</p>}
              </div>
            </div>
          </div>

          {/* ── Submit ── */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full h-14 text-white rounded-2xl font-black text-[17px] transition-all disabled:opacity-60 shadow-lg hover:opacity-90 interactive"
            style={{ background: "linear-gradient(135deg, #1565c0, #1978e5)" }}
          >
            {submitting ? "Enviando publicación..." : "Publicar mi vehículo →"}
          </button>

          <p className="text-center text-[13px] text-[#637488]">
            Al publicar aceptas nuestros{" "}
            <a href="https://wa.me/573175737083?text=Quiero%20información%20sobre%20los%20términos%20de%20MOVEL" target="_blank" rel="noopener noreferrer" className="text-[#1978e5] hover:underline">
              Términos y Condiciones
            </a>.
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
            <p className="text-[15px] text-[#637488] leading-relaxed mb-3">
              Recibimos tu publicación. Un asesor revisará la información y te contactará en las próximas <strong>24 horas</strong>.
            </p>
            <p className="text-[13px] text-[#637488] mb-6">
              Te escribiremos a <strong className="text-[#111418]">{form.email}</strong> y al celular <strong className="text-[#111418]">{form.celular}</strong>.
            </p>
            <div className="flex gap-3">
              <Link href="/buscar" className="flex-1 h-12 border-2 border-[#dce0e5] text-[#111418] rounded-xl font-bold text-[14px] flex items-center justify-center hover:bg-[#f0f2f4] transition-colors">
                Ver vehículos
              </Link>
              <button onClick={() => setShowModal(false)} className="flex-1 h-12 text-white rounded-xl font-bold text-[14px] transition-all hover:opacity-90" style={{ background: "linear-gradient(135deg, #1565c0, #1978e5)" }}>
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
