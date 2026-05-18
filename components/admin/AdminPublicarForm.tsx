"use client";

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  UploadSimple, X, CheckCircle, Image as ImageIcon,
  Car, Warning, Info, ShieldCheck, Spinner,
} from "@phosphor-icons/react";
import { getVersiones, EspecificacionesTecnicas } from "@/lib/specs-data";
import { OfertasToggle } from "@/components/publicar/OfertasToggle";
import { EspecificacionesVehiculo, SpecsOutput } from "@/components/publicar/EspecificacionesVehiculo";
import { FichaTecnicaCard } from "@/components/publicar/FichaTecnicaCard";
import { VehicleSelector, VehicleSelection } from "@/components/publicar/VehicleSelector";

// ── Catálogo compartido ────────────────────────────────────────────────────
const modelosPorMarca: Record<string, string[]> = {
  "Chevrolet":["Spark","Spark GT","Onix","Sail","Aveo","Optra","Cruze","Tracker","Trax","Captiva","Equinox","Traverse","Tahoe","Suburban","Colorado","S10","Luv D-Max"],
  "Renault":  ["Kwid","Logan","Sandero","Stepway","Symbol","Duster","Duster Oroch","Captur","Koleos","Kangoo","Trafic"],
  "Toyota":   ["Agya","Yaris","Corolla","Camry","RAV4","C-HR","Land Cruiser","Prado","Fortuner","Hilux","Rush","Innova"],
  "Kia":      ["Picanto","Rio","Rio Hatchback","Stonic","Soul","Cerato","Sportage","Seltos","Sorento","Carnival","Stinger"],
  "Hyundai":  ["Grand i10","i10","i20","Accent","Elantra","Sonata","Creta","Tucson","Santa Fe","Palisade","Ioniq 5","Kona"],
  "Mazda":    ["Mazda2","Mazda3","Mazda3 Sedan","Mazda6","CX-3","CX-30","CX-5","CX-8","CX-9","BT-50","MX-5"],
  "Nissan":   ["March","Versa","Sentra","Altima","Kicks","Qashqai","X-Trail","Murano","Pathfinder","Frontier","NP300"],
  "Ford":     ["Ka","Fiesta","Focus","Fusion","Mustang","EcoSport","Escape","Edge","Explorer","Ranger","F-150","Transit"],
  "Mitsubishi":["Mirage","Attrage","Lancer","Eclipse Cross","ASX","Outlander","Pajero Sport","L200"],
  "Honda":    ["Brio","City","Fit","Civic","Accord","HR-V","CR-V","Pilot","Ridgeline"],
  "Volkswagen":["Polo","Vento","Jetta","Golf","Golf GTI","Tiguan","T-Cross","Touareg","Amarok"],
  "Suzuki":   ["Alto","Celerio","Swift","Baleno","Dzire","S-Cross","Vitara","Grand Vitara","Jimny","XL7"],
  "Jeep":     ["Renegade","Compass","Cherokee","Grand Cherokee","Wrangler","Gladiator"],
  "Mercedes-Benz":["Clase A","Clase C","Clase E","Clase S","GLA","GLC","GLE","GLS"],
  "BMW":      ["Serie 1","Serie 3","Serie 5","X1","X3","X5","X6","M3","M5"],
  "Audi":     ["A3","A4","A5","A6","Q3","Q5","Q7","TT","e-tron"],
  "Otro":     ["Otro modelo"],
};
const marcasCuradas = Object.keys(modelosPorMarca).sort();
const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1989 }, (_, i) => currentYear - i);
const colores = ["Blanco","Negro","Plateado","Gris","Rojo","Azul","Azul oscuro","Verde","Café","Beige","Amarillo","Naranja","Dorado","Vinotinto","Otro"];
const ciudades = ["Bogotá","Medellín","Cali","Barranquilla","Bucaramanga","Manizales","Pereira","Armenia","Ibagué","Villavicencio","Cúcuta","Cartagena","Santa Marta","Pasto","Otra ciudad"];
const propietarioOpciones = ["1 propietario","2 propietarios","3 propietarios","4 o más propietarios","No sé"];
const usoOpciones = ["Particular","Empresa / Flota","Taxi / Plataformas","Escuela de conducción","Otro"];

// ── Tipos internos ─────────────────────────────────────────────────────────
interface PhotoPreview { file: File; url: string }

// ── DraggablePhotoGrid ─────────────────────────────────────────────────────
function DraggablePhotoGrid({ photos, onRemove, onReorder }: {
  photos: PhotoPreview[];
  onRemove: (i: number) => void;
  onReorder: (p: PhotoPreview[]) => void;
}) {
  const dragIdx = useRef<number | null>(null);
  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-3">
      {photos.map((p, i) => (
        <div key={p.url} draggable
          onDragStart={() => { dragIdx.current = i; }}
          onDragOver={(e) => {
            e.preventDefault();
            if (dragIdx.current === null || dragIdx.current === i) return;
            const r = [...photos];
            const [m] = r.splice(dragIdx.current, 1);
            r.splice(i, 0, m);
            dragIdx.current = i;
            onReorder(r);
          }}
          onDragEnd={() => { dragIdx.current = null; }}
          className={`relative group aspect-square rounded-xl overflow-hidden border-2 cursor-grab ${i === 0 ? "border-[#0B1E4E] ring-2 ring-[#0B1E4E]/20" : "border-[#dce0e5]"}`}
        >
          {i === 0 && (
            <div className="absolute top-1 left-1 z-10 bg-[#0B1E4E] text-white text-[9px] font-bold px-2 py-0.5 rounded-md">Principal</div>
          )}
          <Image src={p.url} alt="" fill className="object-cover pointer-events-none" sizes="120px" />
          <button type="button" onClick={(e) => { e.stopPropagation(); onRemove(i); }}
            className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 z-10">
            <X size={12} color="white" />
          </button>
        </div>
      ))}
    </div>
  );
}

// ── Componente principal ───────────────────────────────────────────────────
interface Props { adminPin: string }

export function AdminPublicarForm({ adminPin }: Props) {
  const TRANS_TOKENS = new Set(["AT","MT","CVT","TP","DSG","DCT","AWD","FWD","RWD","4X4","4X2","HV","EV"]);

  const [form, setForm] = useState({
    marca: "", modelo: "", año: "", version: "", placa: "",
    kilometraje: "", precio: "", color: "", ciudad: "Bogotá", descripcion: "",
    motor: "", combustible: "", transmision: "Automático", potencia: "", carroceria: "", pasajeros: "",
    accept_offers: false,
    propietarios: "", uso: "",
    soat_vigente: "", soat_hasta: "", tecno_vigente: "", tecno_hasta: "",
    sin_siniestros: true, siniestros_desc: "", extras: "",
  });

  const [autoSpecs, setAutoSpecs]   = useState<EspecificacionesTecnicas | null>(null);
  const [vehicleSel, setVehicleSel] = useState<VehicleSelection | null>(null);
  const [modoManual, setModoManual] = useState(false);
  const [photos, setPhotos]         = useState<PhotoPreview[]>([]);
  const [dragOver, setDragOver]     = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg]               = useState<{ ok: boolean; text: string } | null>(null);
  const [allBrands, setAllBrands]   = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/catalog/brands")
      .then(r => r.json())
      .then((d: { todas: string[] }) => setAllBrands(d.todas ?? []));
  }, []);

  const marcas = useMemo(() => {
    const curatedSet = new Set(marcasCuradas.map(m => m.toUpperCase()));
    const extras = allBrands.filter(b => !curatedSet.has(b.toUpperCase()));
    return [...marcasCuradas, ...extras];
  }, [allBrands]);

  const setF = (key: string, val: string | boolean) => setForm(f => ({ ...f, [key]: val }));

  const normalizeMarca = (raw: string) => {
    const up = raw.toUpperCase();
    const match = marcasCuradas.find(m => m.toUpperCase() === up);
    return match ?? raw.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
  };

  const extractModelo = (ref: string) => {
    const words = ref.toUpperCase().trim().split(/\s+/);
    const model: string[] = [];
    for (const w of words) {
      if (/^\d/.test(w) || TRANS_TOKENS.has(w)) break;
      model.push(w);
      if (model.length >= 3) break;
    }
    if (model.length === 0) model.push(words[0]);
    return model.map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(" ");
  };

  const tipoToCarroceria: Record<string, string> = {
    AUTOMOVILES: "Sedán",
    "CAMIONETAS Y CAMPEROS": "SUV / Camioneta",
    "CAMIONETAS DOBLECABINA": "Pick-up",
    ELECTRICOS: "Eléctrico",
    HIBRIDOS: "Híbrido",
    PASAJEROS: "SUV / Camioneta",
    CARGA: "Furgoneta",
  };

  const handleVehicleSelect = (sel: VehicleSelection | null) => {
    setVehicleSel(sel);
    if (!sel) {
      setForm(f => ({ ...f, marca: "", modelo: "", version: "", motor: "", combustible: "", transmision: "Automático", potencia: "", carroceria: "", pasajeros: "" }));
      setAutoSpecs(null);
      return;
    }
    const marcaNorm  = normalizeMarca(sel.marca);
    const modelo     = extractModelo(sel.referencia);
    const carroceria = tipoToCarroceria[sel.tipo] ?? "";
    const motorStr   = sel.cilindraje ? `${(sel.cilindraje / 1000).toFixed(1)}L · ${sel.cilindraje} cc` : "";
    setAutoSpecs(null);
    setForm(f => ({ ...f, marca: marcaNorm, modelo, version: sel.referencia, carroceria, motor: motorStr,
      pasajeros: sel.pasajeros ? String(sel.pasajeros) : f.pasajeros,
      combustible: "", potencia: "" }));
  };

  const handleMarcaManual = (marca: string) => {
    setForm(f => ({ ...f, marca, modelo: "", version: "", motor: "", combustible: "", transmision: "Automático", potencia: "", carroceria: "", pasajeros: "" }));
    setAutoSpecs(null);
  };

  const handleSpecsOutput = (_specs: EspecificacionesTecnicas | null, output: SpecsOutput) => {
    setAutoSpecs(_specs);
    setForm(f => ({ ...f, motor: output.motor, combustible: output.combustible,
      transmision: output.transmision, potencia: output.potencia,
      carroceria: output.carroceria, pasajeros: output.pasajeros }));
  };

  const addPhotos = useCallback((files: FileList | null) => {
    if (!files) return;
    const newPhotos = Array.from(files)
      .filter(f => f.type.startsWith("image/"))
      .slice(0, 20 - photos.length)
      .map(file => ({ file, url: URL.createObjectURL(file) }));
    setPhotos(prev => [...prev, ...newPhotos]);
  }, [photos.length]);

  const removePhoto = (i: number) => setPhotos(prev => {
    URL.revokeObjectURL(prev[i].url);
    return prev.filter((_, idx) => idx !== i);
  });

  async function uploadAllPhotos(folder: string): Promise<string[]> {
    const urls: string[] = [];
    for (const photo of photos) {
      try {
        const fd = new FormData();
        fd.append("file", photo.file);
        fd.append("folder", folder);
        const res = await fetch("/api/upload-foto", { method: "POST", body: fd });
        const data = await res.json();
        if (data.ok && data.url) urls.push(data.url);
      } catch { /* ignore */ }
    }
    return urls;
  }

  const formatPrecio = (v: string) => {
    const n = v.replace(/\D/g, "");
    return n ? parseInt(n).toLocaleString("es-CO") : "";
  };
  const formatKm = (v: string) => {
    const n = v.replace(/\D/g, "");
    return n ? parseInt(n).toLocaleString("es-CO") : "";
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.marca || !form.modelo || !form.año || !form.precio) {
      setMsg({ ok: false, text: "Completa los campos obligatorios: Marca, Modelo, Año y Precio." });
      return;
    }
    setSubmitting(true);
    setMsg(null);

    const folder = `movel-${form.marca}-${form.modelo}-${Date.now()}`.toLowerCase().replace(/[^a-z0-9-]+/g, "-");
    const fotosUrls = photos.length > 0 ? await uploadAllPhotos(folder) : [];

    try {
      const res = await fetch("/api/admin/publicar-movel", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-pin": adminPin },
        body: JSON.stringify({
          ...form,
          ano: form.año,
          fotos_urls: fotosUrls,
          ultimo_digito_placa: form.placa ? form.placa.slice(-1) : "",
        }),
      });
      const json = await res.json();
      if (json.ok) {
        setMsg({ ok: true, text: `✅ Publicado y visible en el sitio (ID: ${json.id}) — ${fotosUrls.length} foto(s) subida(s)` });
        setForm({ marca: "", modelo: "", año: "", version: "", placa: "", kilometraje: "", precio: "",
          color: "", ciudad: "Bogotá", descripcion: "", motor: "", combustible: "", transmision: "Automático",
          potencia: "", carroceria: "", pasajeros: "", accept_offers: false,
          propietarios: "", uso: "", soat_vigente: "", soat_hasta: "", tecno_vigente: "", tecno_hasta: "",
          sin_siniestros: true, siniestros_desc: "", extras: "" });
        setPhotos([]);
        setVehicleSel(null);
        setAutoSpecs(null);
        setModoManual(false);
      } else {
        setMsg({ ok: false, text: `❌ Error: ${json.error}` });
      }
    } catch (err) {
      setMsg({ ok: false, text: `❌ Error de red: ${String(err)}` });
    } finally {
      setSubmitting(false);
    }
  }

  const iClass = "w-full h-11 bg-[#f0f2f4] rounded-xl px-4 text-[14px] text-[#111418] placeholder-[#7A8195] outline-none border border-transparent focus:border-[#0B1E4E] focus:bg-white transition-colors";
  const sClass = "w-full h-11 bg-[#f0f2f4] rounded-xl px-4 text-[14px] text-[#111418] appearance-none outline-none border border-transparent focus:border-[#0B1E4E] focus:bg-white transition-colors";
  const lClass = "text-[11px] font-bold text-[#374151] mb-1.5 block uppercase tracking-wide";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* ── FOTOS ── */}
      <div className="bg-[#f8f9fa] rounded-2xl p-5 border border-[#dce0e5]">
        <div className="flex items-center gap-2 mb-2">
          <ImageIcon size={18} color="#0B1E4E" weight="fill" />
          <h3 className="text-[15px] font-bold text-[#111418]">Fotos del vehículo</h3>
          <span className="text-[12px] text-[#7A8195]">({photos.length}/20)</span>
        </div>
        <div className="flex items-start gap-2 bg-[#e8f0fd] rounded-xl px-3 py-2.5 mb-3 text-[12px] text-[#0B1E4E]">
          <Info size={14} className="flex-shrink-0 mt-0.5" weight="fill" />
          <span>La primera foto será la portada. Arrastra las miniaturas para reordenar.</span>
        </div>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); addPhotos(e.dataTransfer.files); }}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
            dragOver ? "border-[#0B1E4E] bg-[#e8f0fd]" : "border-[#dce0e5] hover:border-[#0B1E4E] hover:bg-[#f0f2f4]"
          }`}
        >
          <UploadSimple size={30} color={dragOver ? "#0B1E4E" : "#7A8195"} className="mx-auto mb-2" />
          <p className="text-[14px] font-semibold text-[#111418]">Arrastra fotos aquí</p>
          <p className="text-[12px] text-[#7A8195] mt-0.5">o haz clic · JPG, PNG, WEBP · hasta 5 MB c/u</p>
          <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 text-white rounded-xl text-[13px] font-bold" style={{ background: "linear-gradient(135deg,#050E26,#0B1E4E)" }}>
            <UploadSimple size={14} /> Seleccionar fotos
          </div>
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={e => addPhotos(e.target.files)} />
        {photos.length > 0 && (
          <DraggablePhotoGrid photos={photos} onRemove={removePhoto} onReorder={setPhotos} />
        )}
      </div>

      {/* ── IDENTIFICACIÓN DEL VEHÍCULO ── */}
      <div className="bg-[#f8f9fa] rounded-2xl border border-[#dce0e5] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#f0f2f4] flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg,#0d1b2e,#0B1E4E)" }}>
            <Car size={16} color="white" weight="fill" />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-[#111418]">Identificación del vehículo</h3>
            <p className="text-[11px] text-[#7A8195]">Base oficial Ministerio de Transporte · 11.537 referencias</p>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Placa */}
          <div>
            <label className={lClass}>Placa (privada — solo equipo MOVEL)</label>
            <input type="text" value={form.placa}
              onChange={e => setF("placa", e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,6))}
              placeholder="Ej: ABC123" maxLength={6}
              className={`${iClass} w-44 font-mono font-bold text-[16px] tracking-widest`} />
          </div>

          <hr className="border-[#f0f2f4]" />

          {/* Selector oficial */}
          {!modoManual ? (
            <div>
              <VehicleSelector onChange={handleVehicleSelect} />
              {vehicleSel && (
                <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-xl flex items-start gap-2">
                  <CheckCircle size={15} color="#16a34a" weight="fill" className="flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[12px] font-bold text-green-800">{normalizeMarca(vehicleSel.marca)} · {vehicleSel.referencia}</p>
                    <p className="text-[11px] text-green-700">{vehicleSel.tipoLabel}{vehicleSel.cilindraje ? ` · ${vehicleSel.cilindraje} cc` : ""} · Specs se llenarán automáticamente ✨</p>
                  </div>
                </div>
              )}
              <button type="button" onClick={() => { setModoManual(true); setVehicleSel(null); setForm(f => ({ ...f, marca: "", modelo: "", version: "", motor: "", carroceria: "", pasajeros: "" })); setAutoSpecs(null); }}
                className="mt-2 text-[12px] text-[#7A8195] hover:text-[#0B1E4E] underline underline-offset-2">
                Mi vehículo no aparece en la lista →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                <Warning size={13} color="#d97706" weight="fill" className="flex-shrink-0" />
                <p className="text-[12px] text-amber-800">Modo manual — las specs se completarán con IA.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={lClass}>Marca *</label>
                  <select value={form.marca} onChange={e => handleMarcaManual(e.target.value)} className={sClass}>
                    <option value="">Seleccionar marca</option>
                    {marcas.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className={lClass}>Modelo *</label>
                  <input type="text" value={form.modelo}
                    onChange={e => setForm(f => ({ ...f, modelo: e.target.value }))}
                    disabled={!form.marca} placeholder={form.marca ? "Ej: Corolla, Onix…" : "Selecciona marca primero"}
                    className={`${iClass} disabled:opacity-50`} />
                </div>
                <div>
                  <label className={lClass}>Versión / Trim</label>
                  <input type="text" value={form.version} onChange={e => setF("version", e.target.value)}
                    placeholder="Ej: LT, GT, Sport…" className={iClass} />
                </div>
              </div>
              <button type="button" onClick={() => { setModoManual(false); setForm(f => ({ ...f, marca: "", modelo: "", version: "" })); }}
                className="text-[12px] text-[#7A8195] hover:text-[#0B1E4E] underline underline-offset-2">
                ← Volver al buscador oficial
              </button>
            </div>
          )}

          <hr className="border-[#f0f2f4]" />

          {/* Año · Color · Ciudad */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className={lClass}>Año modelo *</label>
              <select value={form.año} onChange={e => setF("año", e.target.value)} className={sClass}>
                <option value="">Seleccionar año</option>
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div>
              <label className={lClass}>Color</label>
              <select value={form.color} onChange={e => setF("color", e.target.value)} className={sClass}>
                <option value="">Seleccionar</option>
                {colores.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={lClass}>Ciudad</label>
              <select value={form.ciudad} onChange={e => setF("ciudad", e.target.value)} className={sClass}>
                {ciudades.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Km · Precio */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={lClass}>Kilometraje</label>
              <div className="relative">
                <input type="text" inputMode="numeric"
                  value={formatKm(form.kilometraje)}
                  onChange={e => setF("kilometraje", e.target.value.replace(/\D/g,""))}
                  placeholder="45.000" className={iClass} />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-[#7A8195]">km</span>
              </div>
            </div>
            <div>
              <label className={lClass}>Precio (COP) *</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A8195] font-bold text-[13px]">$</span>
                <input type="text" inputMode="numeric"
                  value={form.precio}
                  onChange={e => setF("precio", formatPrecio(e.target.value))}
                  placeholder="85.000.000" className={`${iClass} pl-8`} />
              </div>
              <OfertasToggle value={form.accept_offers} onChange={v => setF("accept_offers", v)}
                disabled={!form.marca || !form.modelo || !form.precio} />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className={lClass}>Descripción</label>
            <textarea value={form.descripcion} onChange={e => setF("descripcion", e.target.value)}
              placeholder="Describe el estado general, extras, historial de mantenimiento, motivo de venta..." rows={3}
              className="w-full bg-[#f0f2f4] rounded-xl px-4 py-3 text-[14px] placeholder-[#7A8195] outline-none border border-transparent focus:border-[#0B1E4E] focus:bg-white transition-colors resize-none" />
          </div>
        </div>
      </div>

      {/* ── ESPECIFICACIONES TÉCNICAS (auto-completado) ── */}
      {form.marca && form.modelo && (
        <EspecificacionesVehiculo
          marca={form.marca} modelo={form.modelo} version={form.version} ano={form.año}
          cilindraje={vehicleSel?.cilindraje ?? null}
          onOutputChange={handleSpecsOutput}
          onCleared={() => setAutoSpecs(null)}
        />
      )}

      {/* ── FICHA TÉCNICA (cuando hay specs cargadas) ── */}
      {autoSpecs && form.año && (
        <FichaTecnicaCard specs={autoSpecs} marca={form.marca} modelo={form.modelo} version={form.version} año={form.año} />
      )}

      {/* ── HISTORIAL ── */}
      <div className="bg-[#f8f9fa] rounded-2xl p-5 border border-[#dce0e5] space-y-4">
        <h3 className="text-[15px] font-bold text-[#111418]">Historial del vehículo</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={lClass}>Propietarios</label>
            <select value={form.propietarios} onChange={e => setF("propietarios", e.target.value)} className={sClass}>
              <option value="">Seleccionar</option>
              {propietarioOpciones.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className={lClass}>Uso del vehículo</label>
            <select value={form.uso} onChange={e => setF("uso", e.target.value)} className={sClass}>
              <option value="">Seleccionar</option>
              {usoOpciones.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <label className={lClass}>SOAT</label>
            <select value={form.soat_vigente} onChange={e => setF("soat_vigente", e.target.value)} className={sClass}>
              <option value="">Estado del SOAT</option>
              <option value="vigente">Vigente</option>
              <option value="vencido">Vencido</option>
              <option value="no_se">No sé</option>
            </select>
          </div>
          {form.soat_vigente === "vigente" && (
            <div>
              <label className={lClass}>SOAT vigente hasta</label>
              <input type="date" value={form.soat_hasta} onChange={e => setF("soat_hasta", e.target.value)} className={iClass} />
            </div>
          )}
          <div>
            <label className={lClass}>Tecnomecánica</label>
            <select value={form.tecno_vigente} onChange={e => setF("tecno_vigente", e.target.value)} className={sClass}>
              <option value="">Estado tecnomecánica</option>
              <option value="vigente">Vigente</option>
              <option value="vencida">Vencida</option>
              <option value="no_aplica">No aplica (vehículo nuevo)</option>
              <option value="no_se">No sé</option>
            </select>
          </div>
          {form.tecno_vigente === "vigente" && (
            <div>
              <label className={lClass}>Tecnomecánica vigente hasta</label>
              <input type="date" value={form.tecno_hasta} onChange={e => setF("tecno_hasta", e.target.value)} className={iClass} />
            </div>
          )}
        </div>

        {/* Siniestros */}
        <div className="p-4 bg-white rounded-xl border border-[#dce0e5]">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <p className="text-[13px] font-bold text-[#111418]">¿El vehículo ha tenido siniestros o choques?</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => setF("sin_siniestros", true)}
                className={`px-4 py-2 rounded-lg text-[12px] font-bold border-2 transition-all ${form.sin_siniestros ? "bg-green-500 text-white border-green-500" : "border-[#dce0e5] text-[#7A8195]"}`}>
                No, ninguno
              </button>
              <button type="button" onClick={() => setF("sin_siniestros", false)}
                className={`px-4 py-2 rounded-lg text-[12px] font-bold border-2 transition-all ${!form.sin_siniestros ? "bg-amber-500 text-white border-amber-500" : "border-[#dce0e5] text-[#7A8195]"}`}>
                Sí, uno o más
              </button>
            </div>
          </div>
          {!form.sin_siniestros && (
            <textarea value={form.siniestros_desc} onChange={e => setF("siniestros_desc", e.target.value)}
              placeholder="Describe el tipo de choque, parte afectada y reparación..." rows={2}
              className="w-full bg-white rounded-xl px-3 py-2.5 text-[13px] placeholder-[#7A8195] outline-none border border-amber-200 focus:border-amber-400 resize-none" />
          )}
        </div>

        {/* Extras */}
        <div>
          <label className={lClass}>Extras y accesorios</label>
          <textarea value={form.extras} onChange={e => setF("extras", e.target.value)}
            placeholder="Ej: Techo panorámico, cámara de reversa, rines originales, pantalla táctil..." rows={2}
            className="w-full bg-[#f0f2f4] rounded-xl px-4 py-2.5 text-[13px] placeholder-[#7A8195] outline-none border border-transparent focus:border-[#0B1E4E] focus:bg-white transition-colors resize-none" />
        </div>
      </div>

      {/* ── Mensaje resultado ── */}
      {msg && (
        <div className={`p-4 rounded-xl text-[13px] font-semibold ${msg.ok ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {msg.text}
        </div>
      )}

      {/* ── Submit ── */}
      <button type="submit" disabled={submitting || !form.marca || !form.modelo || !form.año || !form.precio}
        className="w-full py-4 rounded-xl font-black text-white text-[15px] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        style={{ background: "linear-gradient(135deg,#0B1E4E,#1565c0)" }}>
        {submitting ? <Spinner size={20} className="animate-spin" /> : <ShieldCheck size={20} weight="fill" />}
        {submitting
          ? `Publicando${photos.length > 0 ? ` y subiendo ${photos.length} foto(s)…` : "…"}`
          : "Publicar como vehículo MOVEL verificado"}
      </button>

      <p className="text-[11px] text-center text-[#7A8195]">
        Se publica directamente como activo con el sello "Verificado MOVEL" y aparece en el sitio al instante.
      </p>
    </form>
  );
}
