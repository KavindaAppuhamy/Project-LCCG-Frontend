// src/components/LoaderComponent.jsx
import React from "react";

export default function LoaderComponent() {
  return (
    <div className="fixed inset-0 bg-[var(--color-bg)] flex items-center justify-center z-[100] animate-[slideOutUp_0.6s_ease-in-out_2.5s_forwards]">
      {/* Background gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-bg)] via-[var(--color-accent)] to-[var(--color-bg)]"></div>

      {/* Animated particles background */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-[var(--color-primary)] rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center">
        <div className="relative w-36 h-36 mx-auto mb-6">
          <div className="w-36 h-36 rounded-full border-[3px] border-transparent border-t-[var(--color-primary)] border-r-[var(--color-primary)]
            animate-[spin_3s_linear_infinite] shadow-[0_0_15px_var(--color-primary)] blur-[0.5px]"></div>
          <div className="absolute inset-3 w-30 h-30 rounded-full border-[3px] border-transparent 
            border-b-[var(--color-readmore)] border-l-[var(--color-readmore)]
            animate-[spin_2s_linear_infinite_reverse] shadow-[0_0_12px_var(--color-readmore)] blur-[0.4px]"></div>
          <div className="absolute inset-6 w-24 h-24 rounded-full border-[2px] border-transparent 
            border-t-[var(--color-secheading)] border-r-[var(--color-secheading)]
            animate-[spin_1.5s_linear_infinite] shadow-[0_0_10px_var(--color-secheading)]"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center
              bg-gradient-to-tr from-[var(--color-card)] to-[var(--color-primary)]
              shadow-[0_0_20px_rgba(0,0,0,0.2),0_0_15px_var(--color-primary)]
              animate-[pulse_2s_ease-in-out_infinite]">
              <img
                src="/LCCG-Logo.webp"
                alt="LCCG Logo"
                className="w-12 h-12 object-contain rounded-full drop-shadow-lg"
              />
            </div>
          </div>
        </div>
        <div className="mt-8 animate-[fadeInUp_1s_ease-out_0.5s_both]">
          <h3
            className="text-2xl font-bold text-[var(--color-primary)] mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Leo Club of Cinnamon Gardens
          </h3>
          <p className="text-[var(--color-description)] text-sm">
            Loading experience...
          </p>
          <div className="flex justify-center gap-1 mt-4">
            <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-[pulse-loader_1s_ease-in-out_infinite]"></div>
            <div
              className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-[pulse-loader_1s_ease-in-out_infinite]"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-[pulse-loader_1s_ease-in-out_infinite]"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        </div>
      </div>
      <div className="absolute top-20 left-20 w-32 h-32 bg-[var(--color-primary)] opacity-10 rounded-full blur-3xl animate-[pulse-loader_3s_ease-in-out_infinite]"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-[var(--color-readmore)] opacity-10 rounded-full blur-3xl animate-[pulse-loader_4s_ease-in-out_infinite]"></div>
    </div>
  );
}
