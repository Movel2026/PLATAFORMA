"use client";

import { useState } from "react";

interface PhotoCarouselProps {
  photos: string[];
  title: string;
}

export default function PhotoCarousel({ photos, title }: PhotoCarouselProps) {
  const [current, setCurrent] = useState(0);

  return (
    <div className="relative w-full h-72 overflow-hidden bg-gray-200">
      {/* Gradient placeholder when no real photo */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #1a3a5c 0%, #1978e5 50%, #0d47a1 100%)",
        }}
      >
        <div className="text-white text-center px-6">
          <div className="w-16 h-16 mx-auto mb-3 opacity-50">
            <svg viewBox="0 0 24 24" fill="white">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
            </svg>
          </div>
          <p className="text-lg font-semibold opacity-80">{title}</p>
        </div>
      </div>

      {/* Dots indicator */}
      {photos.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-2 h-2 rounded-full transition-all ${
                i === current ? "bg-white w-4" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}

      {/* Single dot for single photo */}
      {photos.length <= 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          <div className="w-4 h-2 rounded-full bg-white" />
          <div className="w-2 h-2 rounded-full bg-white/50" />
          <div className="w-2 h-2 rounded-full bg-white/50" />
        </div>
      )}

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />
    </div>
  );
}
