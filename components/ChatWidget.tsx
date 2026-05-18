"use client";

import { useState, useRef, useEffect } from "react";
import { WhatsappLogo, X, PaperPlaneTilt, Robot, CaretDown } from "@phosphor-icons/react";
import { MovelLogo } from "@/components/MovelLogo";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_QUESTIONS = [
  "¿Qué carros tienen menos de 50.000 km?",
  "¿Cómo funciona el financiamiento?",
  "¿Cuánto es el SOAT en Colombia?",
  "Quiero vender mi carro",
];

function TypingIndicator() {
  return (
    <div className="flex gap-1.5 items-center px-4 py-3 bg-[#f0f2f4] rounded-2xl rounded-tl-sm w-fit">
      <span className="w-2 h-2 bg-[#637488] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
      <span className="w-2 h-2 bg-[#637488] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
      <span className="w-2 h-2 bg-[#637488] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
    </div>
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "¡Hola! Soy MOVEL IA 🚗 Tu asesor virtual de vehículos. ¿En qué puedo ayudarte hoy? Puedo ayudarte a encontrar el carro ideal, calcular cuotas de financiamiento, o resolver cualquier duda.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open, messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { role: "user", content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.content }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Tuve un problema técnico 😕 Por favor contáctanos directamente por WhatsApp al +57 317 573 7083." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Tooltip when closed */}
        {!open && (
          <div className="animate-fade-in bg-white text-[#111418] text-[13px] font-semibold px-4 py-2 rounded-full shadow-lg border border-[#dce0e5] whitespace-nowrap">
            ¿Tienes alguna duda? 💬
          </div>
        )}

        <button
          onClick={() => setOpen(!open)}
          className="relative w-14 h-14 rounded-full text-white shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center animate-glow"
          style={{ background: "linear-gradient(135deg, #1565c0, #1978e5, #42a5f5)" }}
          aria-label="Abrir chat IA"
        >
          {open ? (
            <CaretDown size={24} weight="bold" />
          ) : (
            <Robot size={26} weight="fill" />
          )}
          {!open && unread > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[11px] font-black rounded-full flex items-center justify-center animate-pulse-red">
              {unread}
            </span>
          )}
        </button>
      </div>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-28 right-6 z-50 w-[360px] max-w-[calc(100vw-24px)] bg-white rounded-3xl shadow-2xl border border-[#dce0e5] flex flex-col overflow-hidden animate-scale-bounce origin-bottom-right"
          style={{ height: "520px" }}>

          {/* Header */}
          <div
            className="flex items-center justify-between px-5 py-4 text-white flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #0d1b2e, #1565c0, #1978e5)" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                <Robot size={20} weight="fill" />
              </div>
              <div>
                <p className="text-[14px] font-black flex items-center gap-1.5"><MovelLogo variant="white" size={18} animate={false} className="inline-block" /> IA</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-[11px] text-white/70">Asesor virtual · En línea</span>
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-hide">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] px-4 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "text-white rounded-2xl rounded-tr-sm"
                      : "text-[#111418] bg-[#f0f2f4] rounded-2xl rounded-tl-sm"
                  }`}
                  style={msg.role === "user" ? { background: "linear-gradient(135deg, #1565c0, #1978e5)" } : {}}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <TypingIndicator />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick questions — solo si hay pocas mensajes */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2 flex gap-2 flex-wrap flex-shrink-0">
              {QUICK_QUESTIONS.slice(0, 2).map((q) => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="text-[11px] font-semibold text-[#1978e5] bg-[#e8f0fd] px-3 py-1.5 rounded-full hover:bg-[#1978e5] hover:text-white transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* WhatsApp shortcut */}
          <div className="px-4 pb-2 flex-shrink-0">
            <a
              href="https://wa.me/573175737083?text=Hola%20MOVEL%2C%20quiero%20hablar%20con%20un%20asesor"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-[#e8f9ef] text-[#16a34a] text-[12px] font-bold hover:bg-[#25d366] hover:text-white transition-all"
            >
              <WhatsappLogo size={15} weight="fill" />
              Hablar con asesor humano
            </a>
          </div>

          {/* Input */}
          <div className="px-4 pb-4 flex-shrink-0">
            <div className="flex gap-2 bg-[#f0f2f4] rounded-2xl p-1.5">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
                placeholder="Escribe tu pregunta..."
                className="flex-1 bg-transparent px-3 text-[14px] text-[#111418] placeholder-[#637488] outline-none"
                disabled={loading}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || loading}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white transition-all disabled:opacity-40 interactive"
                style={{ background: "linear-gradient(135deg, #1565c0, #1978e5)" }}
              >
                <PaperPlaneTilt size={16} weight="fill" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
