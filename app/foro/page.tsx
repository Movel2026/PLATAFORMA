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
  MapPin,
  Clock,
  User,
  Image as ImageIcon,
  YoutubeLogo,
  Play,
} from "@phosphor-icons/react";
import MovelPageHeader from "@/components/MovelPageHeader";
import BottomNav from "@/components/BottomNav";

/* ─── types ─────────────────────────────────────────────────────── */
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
  imageUrl?: string;
  youtubeId?: string;
}

/* ─── categories ─────────────────────────────────────────────────── */
const CATEGORIES: { id: Category; label: string; icon: React.ElementType; color: string }[] = [
  { id: "todos",    label: "Todo",      icon: Globe,             color: "#60a5fa" },
  { id: "talleres", label: "Talleres",  icon: Wrench,            color: "#fb923c" },
  { id: "llantas",  label: "Llantas",   icon: Tire,              color: "#a78bfa" },
  { id: "noticias", label: "Noticias",  icon: NewspaperClipping, color: "#34d399" },
  { id: "reseñas",  label: "Reseñas",   icon: Star,              color: "#fbbf24" },
  { id: "general",  label: "General",   icon: ChatCircle,        color: "#94a3b8" },
];

const catColorMap: Record<Category, string> = {
  todos: "#60a5fa", talleres: "#fb923c", llantas: "#a78bfa",
  noticias: "#34d399", "reseñas": "#fbbf24", general: "#94a3b8",
};

const tagColorMap: Record<string, string> = {
  Recomendado: "text-emerald-400 bg-emerald-500/15 border-emerald-500/25",
  Destacado:   "text-[#fbbf24] bg-yellow-500/15 border-yellow-500/25",
  Alerta:      "text-red-400 bg-red-500/15 border-red-500/25",
  Exclusivo:   "text-[#60a5fa] bg-blue-500/15 border-blue-500/25",
};

/* ─── helper: extract YouTube ID ────────────────────────────────── */
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

/* ─── mock posts ─────────────────────────────────────────────────── */
const INITIAL_POSTS: Post[] = [
  {
    id: "1", category: "noticias",
    title: "Colombia sube aranceles a vehículos eléctricos — impacto en precios BYD, JETOUR y Volvo",
    body: "El gobierno anunció un aumento del 15% en aranceles a BEV importados. Así afecta a cada marca y cuánto subirán los precios estimados.",
    author: "Redacción MOVEL", city: "Bogotá", date: "Hace 5 horas",
    likes: 134, comments: 38, pinned: true, tag: "Destacado",
    youtubeId: "dQw4w9WgXcQ",
  },
  {
    id: "2", category: "reseñas",
    title: "BYD Seal 2024 — manejé 500 km en Colombia. El futuro ya llegó.",
    body: "Velocidad máxima de 180 km/h, recarga en 30 min al 80% y un interior que te deja sin palabras. Lo que falló y lo que sorprendió.",
    author: "Luisa F.", city: "Bogotá", date: "Hace 1 día",
    likes: 307, comments: 82,
    imageUrl: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=600&q=80",
  },
  {
    id: "3", category: "talleres",
    title: "Mejor taller multimarca en Medellín — mi experiencia en Automotriz Rápido",
    body: "Llevé mi Toyota Hilux para cambio de embrague y aceite. Excelente servicio, precio justo y entrega en el día. Los recomiendo 100%.",
    author: "Carlos M.", city: "Medellín", date: "Hace 2 horas",
    likes: 47, comments: 12, tag: "Recomendado",
    imageUrl: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=600&q=80",
  },
  {
    id: "4", category: "llantas",
    title: "¿Bridgestone o Michelin para SUV? Comparativa después de 10.000 km",
    body: "Probé ambas en mi Mazda CX-5 en carreteras destapadas y autopistas. Las diferencias en agarre mojado son más grandes de lo que pensaba.",
    author: "Valentina R.", city: "Cali", date: "Hace 1 día",
    likes: 89, comments: 27,
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80",
  },
  {
    id: "5", category: "reseñas",
    title: "Renault Duster 2024 — el rey del precio/rendimiento en Colombia",
    body: "Lo manejé 3 meses como vehículo principal. Motor 1.6 consumiendo ~10L/100km en ciudad. Una opción sólida.",
    author: "Andrés P.", city: "Bucaramanga", date: "Hace 2 días",
    likes: 201, comments: 54,
    imageUrl: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80",
  },
  {
    id: "6", category: "talleres",
    title: "⚠️ Cuidado con el 'taller Los Pinos' en Bogotá — me cobraron doble",
    body: "Llevo el carro con falla en sensores y terminé pagando $700k más de lo cotizado. Sin factura y piezas de dudosa procedencia.",
    author: "Felipe G.", city: "Bogotá", date: "Hace 3 días",
    likes: 56, comments: 91, tag: "Alerta",
  },
  {
    id: "7", category: "noticias",
    title: "Toyota lanzará la nueva Hilux GR-S en Colombia — precio y fecha",
    body: "La versión deportiva de la pick-up más vendida del país llegará en Q3 2024 con motor 2.8 TDI y suspensión mejorada.",
    author: "Redacción MOVEL", city: "Bogotá", date: "Hace 1 semana",
    likes: 245, comments: 61, tag: "Exclusivo",
    youtubeId: "9bZkp7q19f0",
  },
  {
    id: "8", category: "general",
    title: "¿Vale la pena asegurar moto en Colombia? Comparativa 5 aseguradoras",
    body: "Después de cotizar en Sura, Bolívar, AXA, Liberty y QBE, esta fue la conclusión para una moto de $18M...",
    author: "Diana T.", city: "Pereira", date: "Hace 4 días",
    likes: 73, comments: 19,
  },
];

/* ─── YouTube embed ──────────────────────────────────────────────── */
function YouTubeEmbed({ videoId }: { videoId: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative w-full rounded-xl overflow-hidden mt-3 bg-black" style={{ aspectRatio: "16/9" }}>
      {playing ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <>
          <img
            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
            alt="YouTube thumbnail"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <button
              onClick={() => setPlaying(true)}
              className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center shadow-xl hover:bg-red-700 transition-colors"
            >
              <Play size={24} color="white" weight="fill" className="ml-1" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ─── new post modal ─────────────────────────────────────────────── */
function NewPostModal({ onClose, onPost }: { onClose: () => void; onPost: (p: Post) => void }) {
  const [title, setTitle]     = useState("");
  const [body, setBody]       = useState("");
  const [cat, setCat]         = useState<Category>("general");
  const [imageUrl, setImage]  = useState("");
  const [ytUrl, setYtUrl]     = useState("");
  const [step, setStep]       = useState<1 | 2>(1);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    const ytId = ytUrl ? extractYouTubeId(ytUrl) : undefined;
    onPost({
      id: Date.now().toString(), category: cat, title, body,
      author: "Tú", city: "Colombia", date: "Ahora",
      likes: 0, comments: 0,
      imageUrl: imageUrl || undefined,
      youtubeId: ytId || undefined,
    });
    onClose();
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        className="w-full max-w-lg rounded-3xl p-6"
        style={{
          background: "linear-gradient(135deg, #0d1b2e, #0f2040)",
          border: "1px solid rgba(255,255,255,0.1)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <p className="text-white text-[17px] font-black">
            {step === 1 ? "Nueva publicación" : "Añadir multimedia (opcional)"}
          </p>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
            <X size={16} color="white" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 ? (
            <>
              {/* Category */}
              <div>
                <label className="block text-white/50 text-[11px] font-bold uppercase tracking-wider mb-2">Categoría</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.filter(c => c.id !== "todos").map(c => (
                    <button key={c.id} type="button" onClick={() => setCat(c.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-bold transition-all border"
                      style={cat === c.id
                        ? { background: c.color + "33", borderColor: c.color + "60", color: c.color }
                        : { background: "rgba(255,255,255,0.04)", borderColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)" }
                      }>
                      <c.icon size={13} />
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-white/50 text-[11px] font-bold uppercase tracking-wider mb-1.5">Título</label>
                <input type="text" required maxLength={100}
                  placeholder="¿De qué quieres hablar?"
                  value={title} onChange={e => setTitle(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl text-[14px] text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-[#1978e5]/60"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
                />
              </div>

              {/* Body */}
              <div>
                <label className="block text-white/50 text-[11px] font-bold uppercase tracking-wider mb-1.5">Contenido</label>
                <textarea required rows={4}
                  placeholder="Comparte tu experiencia, recomendación o noticia…"
                  value={body} onChange={e => setBody(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-[14px] text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-[#1978e5]/60 resize-none"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
                />
              </div>

              <button type="button" onClick={() => setStep(2)}
                className="w-full h-11 rounded-xl font-bold text-[14px] border border-white/15 text-white/60 hover:text-white hover:border-white/30 transition-all flex items-center justify-center gap-2">
                <ImageIcon size={16} />
                Añadir imagen o video →
              </button>

              <button type="submit"
                className="w-full h-12 rounded-xl font-black text-[15px] text-white"
                style={{ background: "linear-gradient(135deg, #1565c0, #42a5f5)" }}>
                Publicar en el foro →
              </button>
            </>
          ) : (
            <>
              {/* Image URL */}
              <div>
                <label className="block text-white/50 text-[11px] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <ImageIcon size={13} /> URL de imagen (JPG, PNG, WEBP)
                </label>
                <input type="url"
                  placeholder="https://ejemplo.com/foto.jpg"
                  value={imageUrl} onChange={e => setImage(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl text-[14px] text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-[#1978e5]/60"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
                />
                {imageUrl && (
                  <img src={imageUrl} alt="preview"
                    className="mt-2 w-full h-36 object-cover rounded-xl border border-white/10"
                    onError={e => (e.currentTarget.style.display = "none")}
                  />
                )}
              </div>

              {/* YouTube URL */}
              <div>
                <label className="block text-white/50 text-[11px] font-bold uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <YoutubeLogo size={13} /> Link de YouTube
                </label>
                <input type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  value={ytUrl} onChange={e => setYtUrl(e.target.value)}
                  className="w-full h-11 px-4 rounded-xl text-[14px] text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-[#1978e5]/60"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
                />
                {ytUrl && extractYouTubeId(ytUrl) && (
                  <div className="mt-2 rounded-xl overflow-hidden">
                    <img
                      src={`https://img.youtube.com/vi/${extractYouTubeId(ytUrl)}/hqdefault.jpg`}
                      alt="youtube preview"
                      className="w-full h-32 object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)}
                  className="flex-1 h-11 rounded-xl font-bold text-[14px] border border-white/15 text-white/60 hover:text-white transition-all">
                  ← Volver
                </button>
                <button type="submit"
                  className="flex-1 h-11 rounded-xl font-black text-[14px] text-white"
                  style={{ background: "linear-gradient(135deg, #1565c0, #42a5f5)" }}>
                  Publicar →
                </button>
              </div>
            </>
          )}
        </form>
      </motion.div>
    </motion.div>
  );
}

/* ─── post card ─────────────────────────────────────────────────── */
function PostCard({ post, onLike }: { post: Post; onLike: (id: string) => void }) {
  const [liked, setLiked] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const catColor = catColorMap[post.category] ?? "#60a5fa";
  const catLabel = CATEGORIES.find(c => c.id === post.category)?.label ?? post.category;

  function handleLike() {
    if (!liked) { onLike(post.id); setLiked(true); }
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden cursor-pointer hover:border-white/15 transition-all"
      style={{
        background: post.pinned ? "rgba(25,120,229,0.07)" : "rgba(255,255,255,0.04)",
        border: `1px solid ${post.pinned ? "rgba(25,120,229,0.25)" : "rgba(255,255,255,0.07)"}`,
      }}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Media preview — image */}
      {post.imageUrl && (
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-44 object-cover"
          loading="lazy"
        />
      )}

      <div className="p-4">
        {/* badges */}
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
          {post.youtubeId && (
            <span className="flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full text-red-400 bg-red-500/15 border border-red-500/20">
              <YoutubeLogo size={10} weight="fill" /> Video
            </span>
          )}
        </div>

        {/* title */}
        <h3 className="text-white text-[14px] font-black leading-snug mb-2 line-clamp-2">
          {post.title}
        </h3>

        {/* body snippet / expanded */}
        <p className={`text-white/40 text-[12px] leading-relaxed mb-3 ${expanded ? "" : "line-clamp-2"}`}>
          {post.body}
        </p>

        {/* YouTube embed — only when expanded */}
        <AnimatePresence>
          {expanded && post.youtubeId && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={e => e.stopPropagation()}
            >
              <YouTubeEmbed videoId={post.youtubeId} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* footer */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-3 text-white/30 text-[11px]">
            <span className="flex items-center gap-1"><User size={11} />{post.author}</span>
            <span className="flex items-center gap-1"><MapPin size={11} />{post.city}</span>
            <span className="flex items-center gap-1"><Clock size={11} />{post.date}</span>
          </div>
          <div className="flex items-center gap-3" onClick={e => e.stopPropagation()}>
            <button onClick={handleLike}
              className={`flex items-center gap-1 text-[12px] font-bold transition-all ${liked ? "text-red-400" : "text-white/30 hover:text-red-400"}`}>
              <Heart size={14} weight={liked ? "fill" : "regular"} />
              {post.likes + (liked ? 1 : 0)}
            </button>
            <span className="flex items-center gap-1 text-white/30 text-[12px]">
              <ChatCircle size={14} />
              {post.comments}
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* ─── main page ──────────────────────────────────────────────────── */
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

  const ordered = [...filtered.filter(p => p.pinned), ...filtered.filter(p => !p.pinned)];

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
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-5">
          <h1 className="text-white text-[24px] font-black mb-1">
            Foro <span className="text-[#1978e5]">MOVEL</span>
          </h1>
          <p className="text-white/40 text-[13px]">
            Fotos, videos, reseñas y recomendaciones — de la comunidad automotriz colombiana
          </p>
        </motion.div>

        {/* search */}
        <div className="relative mb-4">
          <MagnifyingGlass size={17} color="rgba(255,255,255,0.3)"
            className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input type="text" placeholder="Buscar en el foro…"
            value={search} onChange={e => setSearch(e.target.value)}
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
              <button key={cat.id} onClick={() => setActiveCat(cat.id)}
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

        {/* stats */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-white/35 text-[12px] font-semibold">{ordered.length} publicaciones</p>
          <p className="text-white/25 text-[11px]">Toca una publicación para expandirla</p>
        </div>

        {/* posts */}
        <div className="space-y-3">
          <AnimatePresence>
            {ordered.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-center py-16 text-white/30">
                <ChatCircle size={48} className="mx-auto mb-3 opacity-30" />
                <p className="text-[14px] font-semibold">No hay publicaciones aquí todavía</p>
                <p className="text-[12px] mt-1">¡Sé el primero en escribir!</p>
              </motion.div>
            ) : (
              ordered.map(p => <PostCard key={p.id} post={p} onLike={handleLike} />)
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* FAB */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 260, damping: 18 }}
        onClick={() => setShowModal(true)}
        whileTap={{ scale: 0.93 }}
        className="fixed bottom-28 right-5 w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl z-40"
        style={{ background: "linear-gradient(135deg, #1565c0, #42a5f5)" }}
      >
        <PencilLine size={22} color="white" weight="bold" />
      </motion.button>

      <AnimatePresence>
        {showModal && <NewPostModal onClose={() => setShowModal(false)} onPost={handleNewPost} />}
      </AnimatePresence>

      <BottomNav />
    </div>
  );
}
