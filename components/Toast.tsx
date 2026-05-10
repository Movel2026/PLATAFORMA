"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Warning, Info, X } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

type ToastType = "success" | "error" | "info";

interface ToastData {
  id: number;
  message: string;
  type: ToastType;
}

// ── Singleton store ─────────────────────────────────────────────
let _listeners: ((t: ToastData) => void)[] = [];
let _id = 0;

export function showToast(message: string, type: ToastType = "success") {
  const toast: ToastData = { id: ++_id, message, type };
  _listeners.forEach((fn) => fn(toast));
}

// ── Component ───────────────────────────────────────────────────
const ICONS = {
  success: CheckCircle,
  error:   Warning,
  info:    Info,
};
const COLORS = {
  success: { bg: "#f0fdf4", border: "#bbf7d0", icon: "#16a34a", text: "#15803d" },
  error:   { bg: "#fef2f2", border: "#fecaca", icon: "#dc2626", text: "#b91c1c" },
  info:    { bg: "#eff6ff", border: "#bfdbfe", icon: "#1978e5", text: "#1d4ed8" },
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  useEffect(() => {
    const handler = (t: ToastData) => {
      setToasts((prev) => [...prev, t]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== t.id));
      }, 3500);
    };
    _listeners.push(handler);
    return () => { _listeners = _listeners.filter((fn) => fn !== handler); };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = ICONS[t.type];
          const c = COLORS[t.type];
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0,  scale: 1    }}
              exit={{   opacity: 0, y: -8,  scale: 0.95 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg min-w-[260px] max-w-[340px]"
              style={{ background: c.bg, border: `1px solid ${c.border}` }}
            >
              <Icon size={20} color={c.icon} weight="fill" className="flex-shrink-0" />
              <p className="text-[13px] font-semibold flex-1 leading-snug" style={{ color: c.text }}>
                {t.message}
              </p>
              <button
                onClick={() => setToasts((prev) => prev.filter((x) => x.id !== t.id))}
                className="ml-1 flex-shrink-0 opacity-40 hover:opacity-80 transition-opacity"
              >
                <X size={14} color={c.text} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
