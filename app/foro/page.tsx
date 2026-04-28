"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChatCircle,
  Heart,
  PencilLine,
  Wrench,
  Tire,
  NewspaperClipping,
  Star,
  Globe,
  MagnifyingGlass,
  X,
  CarProfile,
  ArrowUp,
  MapPin,
  Clock,
  User,
  Warning,
} from "@phosphor-icons/react";
import MovelPageHeader from "@/components/MovelPageHeader";
import BottomNav from "@/components/BottomNav";

/* ─── types & mock data ─────────────────────────────────────────── */
type Category = "todos" | "talleres" | "llantas" | "noticias" | "reseñas" | "general";

interface Post {
  id: string;
  category: Category;
  title: string;
  body: string;
  author: string;
  city: string;
  date: string;
  likes: number;
  comments: number;
  pinned?: boolean;
  tag?: string;
}

const CATEGORIES: { id: Category; label: string; icon: React.ElementType; color: string }[] = [
  { id: "todos",    label: "Todo",        icon: Globe,              color: "#60a5fa" },
  { id: "talleres", label: "Talleres",    icon: Wrench,             color: "#fb923c" },
  { id: "llantas",  label: "Llantas",     icon: Tire,               color: "#a78bfa" },
  { id: "noticias", label: "Noticias",    icon: NewspaperClipping,  color: "#34d399" },
  { id: "reseñas",  label: "Reseñas",     icon: Star,               color: "#fbbf24" },
  { id: "general",  label: "General",     icon: ChatCircle,         color: "#94a3b8" },
];

const INITIAL_POSTS: Post[] = [
  {
    id: "1", category: "talleres",
    title: "Mejor taller multimarca en Medellín — mi experiencia en Automotriz Rápido",
    body: "Llevé mi Toyota Hilux para cambio de embrague y aceite. Excelente servicio, precio justo y entrega en el día. Los recomiendo 100%.",
    author: "Carlos M.", city: "Medellín", date: "Hace 2 horas", likes: 47, comments: 12, tag: "Recomendado",
  },
  {
    id: "2", category: "noticias",
    title: "Colombia sube aranceles a vehículos eléctricos importados — ¿qué significa para los precios?",
    body: "El gobierno anunció un aumento del 15% en aranceles a BEV importados. Aquí te explico el impacto en marcas como BYD, JETOUR y Volvo.",
    author: "Redacción MOVEL", city: "Bogotá", date: "Hace 5 horas", likes: 134, comments: 38, pinned: true, tag: "Destacado",
  },
  {
    id: "3", category: "llantas",
    title: "¿Bridgestone o Michelin para SUV? Comparativa honesta después de 10.000 km",
    body: "Probé ambas en mi Mazda CX-5 en carreteras destapadas y autopistas. Las diferencias en agarre mojado son más grandes de lo que pensaba.",
    author: "Valentina R.", city: "Cali", date: "Hace 1 día", likes: 89, comments: 27,
  },
  {
    id: "4", category: "reseñas",
    title: "Revisión a fondo: Renault Duster 2024 — el rey del precio/rendimiento en Colombia",
    body: "Lo manejé 3 meses como vehículo principal. Motor 1.6 consumiendo ~10L/100km en ciudad, sin mayores problemas. Una opción sólida.",
    author: "Andrés P.", city: "Bucaramanga", date: "Hace 2 días", likes: 201, comments: 54,
  },
  {
    id: "5", category: "talleres",
    title: "Cuidado con el 'taller Los Pinos' en Bogotá — me cobraron doble",
    body: "Llevo el carro con falla en sensores y terminé pagando $700k más de lo cotizado. Sin factura y piezas de dudosa procedencia. Denúncia incluida.",
    author: "Felipe G.", city: "Bogotá", date: "Hace 3 días", likes: 56, comments: 91, tag: "Alerta",
  },
  {
    id: "6", category: "general",
    title: "¿Vale la pena asegurar moto en Colombia? Mi comparativa de 5 aseguradoras",
    body: "Después de cotizar en Sura, Bolívar, AXA, Liberty y QBE, esta fue la conclusión para una moto de $18M...",
    author: "Diana T.", city: "Pereira", date: "Hace 4 días", likes: 73, comments: 19,
  },
  {
    id: "7", category: "llantas",
    title: "¿Dónde comprar llantas baratas en Colombia? Los mejores distribuidores por ciudad",
    body: "Una guía actualizada 2024 con precios reales para Yokohama, BF Goodrich y Kumho en Medellín, Bogotá y Cali.",
    author: "Redacción MOVEL", city: "Nacional", date: "Hace 5 días", likes: 118, comments: 33,
  },
  {
    id: "8", category: "noticias",
    title: "Toyota lanzará la nueva Hilux GR-S en Colombia — precio y fecha de llegada",
    body: "La versión deportiva de la pick-up más vendida del país llegará en el Q3 de 2024 con motor 2.8 TDI y suspensión mejorada.",
    author: "Redacción MOVEL", city: "Bogotá", date: "Hace 1 semana", likes: 245, comments: 61, pinned: false, tag: "Exclusivo",
  },
  {
    id: "9", category: "reseñas",
    title: "BYD Seal 2024 — manejé 500 km en Colombia. El futuro ya llegó.",
    body: "Velocidad máxima de 180 km/h, recarga en 30 min al 80% y un interior que te deja sin palabras. Lo que falló y lo que sorprendió.",
    author: "Luisa F.", city: "Bogotá", date: "Hace 1 semana", likes: 307, comments: 82,
  },
];

const catColorMap: Record<Category, string> = {
  todos:    "#60a5fa",
  talleres: "#fb923c",
  llantas:  "#a78bfa",
  noticias: "#34d399",
  "reseñas": "#fbbf24",
  general:  "#94a3b8",
};

const tagColorMap: Record<string, string> = {
  Recomendado: "text-emerald-400 bg-emerald-500/15 border-emerald-500/25",
  Destacado:   "text-[#fbbf24] bg-yellow-500/15 border-yellow-500/25",
  Alerta:      "text-red-400 bg-red-500/15 border-red-500/25",
  Exclusivo:   "text-[#60a5fa] bg-blue-500/15 border-blue-500/25",
};

/* ─── new post modal ────────────────────────────────────────────── */
function NewPostModal({ onClose, onPost }: { onClose: () => void; onPost: (p: Post) => void }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [cat, setCat] = useState<Category>("general");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    onPost({
      id: Date.now().toString(),
      category: cat,
      title,
      body,
      author: "Juan E.",
      city: "Medellín",
      date: "Ahora",
      likes: 0,
      comments: 0,
    });
    onClose();
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        className="w-full max-w-lg rounded-3xl p-6"
        style={{
          background: "linear-gradient(135deg, #0d1b2e, #0f2040)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <p className="text-white text-[17px] font-black">Nueva publicación</p>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
            <X size={16} color="white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category */}
          <div>
            <label className="block text-white/50 text-[11px] font-bold uppercase tracking-wider mb-2">
              Categoría
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.filter(c => c.id !== "todos").map(c => (
                <button key={c.id} type="button" onClick={() => setCat(c.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all border ${
                    cat === c.id
                      ? "border-transparent text-white"
                      : "border-white/10 text-white/40 hover:text-white/70 bg-transparent"
                  }`}
                  style={cat === c.id ? { background: c.color + "33", borderColor: c.color + "60", color: c.color } : {}}>
                  <c.icon size={13} />
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-white/50 text-[11px] font-bold uppercase tracking-wider mb-1.5">
              Título
            </label>
            <input
              type="text"
              required
              maxLength={100}
              placeholder="¿De qué quieres hablar?"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full h-11 px-4 rounded-xl text-[14px] text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-[#1978e5]/60"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-white/50 text-[11px] font-bold uppercase tracking-wider mb-1.5">
              Contenido
            </label>
            <textarea
              required
              rows={4}
              placeholder="Comparte tu experiencia, recomendación o noticia…"
              value={body}
              onChange={e => setBody(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-[14px] text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-[#1978e5]/60 resize-none"
              style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
            />
          </div>

          <button type="submit"
            className="w-full h-12 rounded-xl font-black text-[15px] text-white"
            style={{ background: "linear-gradient(135deg, #1565c0, #42a5f5)" }}>
            Publicar en el foro →
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* ─── post card ─────────────────────────────────────────────────── */
function PostCard({ post, onLike }: { post: Post; onLike: (id: string) => void }) {
  const [liked, setLiked] = useState(false);
  const catColor = catColorMap[post.category] ?? "#60a5fa";
  const catLabel = CATEGORIES.find(c => c.id === post.category)?.label ?? post.category;

  function handleLike() {
    if (!liked) { onLike(post.id); setLiked(true); }
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-4 hover:border-white/15 transition-all cursor-pointer"
      style={{
        background: post.pinned ? "rgba(25,120,229,0.07)" : "rgba(255,255,255,0.04)",
        border: `1px solid ${post.pinned ? "rgba(25,120,229,0.25)" : "rgba(255,255,255,0.07)"}`,
      }}
    >
      {/* header row */}
      <div className="flex items-center gap-2 flex-wrap mb-2">
        <span className="text-[11px] font-black px-2 py-0.5 rounded-full"
          style={{ background: catColor + "22", color: catColor }}>
          {catLabel}
        </span>
        {post.tag && (
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${tagColorMap[post.tag] ?? "text-white/50"}`}>
            {post.tag}
          </span>
        )}
        {post.pinned && (
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full text-[#60a5fa] bg-blue-500/15 border border-blue-500/20">
            📌 Destacado
          </span>
        )}
      </div>

      {/* title */}
      <h3 className="text-white text-[14px] font-black leading-snug mb-2 line-clamp-2">
        {post.title}
      </h3>

      {/* body snippet */}
      <p className="text-white/40 text-[12px] leading-relaxed line-clamp-2 mb-3">
        {post.body}
      </p>

      {/* footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-white/30 text-[11px]">
          <span className="flex items-center gap-1">
            <User size={11} />
            {post.author}
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={11} />
            {post.city}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {post.date}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 text-[12px] font-bold transition-all ${
              liked ? "text-red-400" : "text-white/30 hover:text-red-400"
            }`}
          >
            <Heart size={14} weight={liked ? "fill" : "regular"} />
            {post.likes + (liked ? 1 : 0)}
          </button>
          <span className="flex items-center gap-1 text-white/30 text-[12px]">
            <ChatCircle size={14} />
            {post.comments}
          </span>
        </div>
      </div>
    </motion.article>
  );
}

/* ─── main ──────────────────────────────────────────────────────── */
export default function ForoPage() {
  const [activeCat, setActiveCat] = useState<Category>("todos");
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = posts.filter(p => {
    const matchCat = activeCat === "todos" || p.category === activeCat;
    const matchSearch = search === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.body.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const pinned = filtered.filter(p => p.pinned);
  const regular = filtered.filter(p => !p.pinned);
  const ordered = [...pinned, ...regular];

  function handleLike(id: string) {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  }

  function handleNewPost(newPost: Post) {
    setPosts(prev => [newPost, ...prev]);
  }

  return (
    <div className="min-h-screen pb-28"
      style={{ background: "linear-gradient(160deg, #08101e 0%, #0d1b2e 55%, #0f2040 100%)" }}>
      <MovelPageHeader />

      <div className="max-w-2xl mx-auto px-4 pt-5">

        {/* page title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-5"
        >
          <h1 className="text-white text-[24px] font-black mb-1">
            Foro <span className="text-[#1978e5]">MOVEL</span>
          </h1>
          <p className="text-white/40 text-[13px]">
            Reseñas, talleres, llantas, noticias y más — de la comunidad automotriz colombiana
          </p>
        </motion.div>

        {/* search */}
        <div className="relative mb-4">
          <MagnifyingGlass size={17} color="rgba(255,255,255,0.3)"
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar en el foro…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl text-[14px] text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-[#1978e5]/60"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
          />
        </div>

        {/* category pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const isActive = activeCat === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-black transition-all duration-200 border"
                style={isActive
                  ? { background: cat.color + "25", borderColor: cat.color + "50", color: cat.color }
                  : { background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)" }
                }
              >
                <Icon size={13} weight={isActive ? "fill" : "regular"} />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* stats bar */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-white/35 text-[12px] font-semibold">
            {ordered.length} publicaciones
          </p>
          <div className="flex items-center gap-3 text-white/30 text-[11px]">
            <span className="flex items-center gap-1">
              <ArrowUp size={11} />
              Más recientes
            </span>
          </div>
        </div>

        {/* posts */}
        <div className="space-y-3">
          <AnimatePresence>
            {ordered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 text-white/30"
              >
                <ChatCircle size={48} className="mx-auto mb-3 opacity-30" />
                <p className="text-[14px] font-semibold">No hay publicaciones aquí todavía</p>
                <p className="text-[12px] mt-1">¡Sé el primero en escribir!</p>
              </motion.div>
            ) : (
              ordered.map(p => (
                <PostCard key={p.id} post={p} onLike={handleLike} />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* FAB — new post */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 260, damping: 18 }}
        onClick={() => setShowModal(true)}
        className="fixed bottom-28 right-5 w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl z-40"
        style={{ background: "linear-gradient(135deg, #1565c0, #42a5f5)" }}
        whileTap={{ scale: 0.93 }}
      >
        <PencilLine size={22} color="white" weight="bold" />
      </motion.button>

      {/* modal */}
      <AnimatePresence>
        {showModal && (
          <NewPostModal onClose={() => setShowModal(false)} onPost={handleNewPost} />
        )}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
