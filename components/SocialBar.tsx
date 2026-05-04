"use client";

import { usePathname } from "next/navigation";

/* Social media links — update URLs to your real accounts */
const socials = [
  {
    label: "WhatsApp",
    href: "https://wa.me/573175737083?text=Hola%20MOVEL",
    color: "#25d366",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.977-1.418A9.96 9.96 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.95 7.95 0 01-4.073-1.116l-.291-.174-3.02.862.843-3.073-.19-.304A7.96 7.96 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8zm4.406-5.845c-.242-.121-1.432-.707-1.654-.787-.222-.08-.383-.121-.544.121-.16.243-.623.787-.764.948-.14.16-.281.18-.523.06-.242-.12-1.022-.377-1.946-1.201-.72-.641-1.206-1.432-1.347-1.674-.14-.243-.015-.374.106-.494.108-.108.242-.283.363-.424.12-.14.16-.242.24-.403.081-.16.04-.302-.02-.423-.06-.12-.543-1.31-.744-1.794-.196-.472-.396-.408-.544-.415-.14-.007-.302-.009-.463-.009a.89.89 0 00-.644.302c-.222.242-.845.825-.845 2.013s.865 2.333.986 2.494c.12.16 1.7 2.596 4.12 3.64.576.249 1.025.397 1.375.508.578.184 1.104.158 1.52.096.463-.069 1.432-.586 1.634-1.152.2-.566.2-1.052.14-1.152-.06-.1-.222-.16-.464-.281z"/>
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com/movelcolombia",
    color: "#e1306c",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://tiktok.com/@movelcolombia",
    color: "#ff0050",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V9.37a8.16 8.16 0 004.77 1.52V7.44a4.85 4.85 0 01-1-.75z"/>
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@movelcolombia",
    color: "#ff0000",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com/movelcolombia",
    color: "#1877f2",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
];

export default function SocialBar() {
  const pathname = usePathname();

  // Show on all pages except auth
  if (pathname.startsWith("/auth")) return null;

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-0 hidden md:flex">
      {socials.map(({ label, href, color, svg }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          title={label}
          className="group flex items-center justify-end overflow-hidden transition-all duration-300"
          style={{ width: "44px" }}
        >
          <div
            className="flex items-center gap-2 px-3 py-2.5 rounded-l-xl text-white shadow-lg transition-all duration-300 group-hover:pr-4"
            style={{
              background: color,
              minWidth: "44px",
              transform: "translateX(0)",
            }}
          >
            <span className="hidden group-hover:block text-[12px] font-bold whitespace-nowrap">
              {label}
            </span>
            {svg}
          </div>
        </a>
      ))}
    </div>
  );
}

/* ─── Mobile: footer social row ────────────────────────────────── */
export function SocialFooter() {
  return (
    <div className="flex items-center justify-center gap-4 py-4 md:hidden">
      {socials.map(({ label, href, color, svg }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          title={label}
          className="w-10 h-10 flex items-center justify-center rounded-xl text-white shadow-md transition-all active:scale-95"
          style={{ background: color }}
        >
          {svg}
        </a>
      ))}
    </div>
  );
}
