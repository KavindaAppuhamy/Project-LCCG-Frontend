// src/components/LoaderComponent.jsx
import React, { useEffect, useMemo } from "react";

export default function LoaderComponent() {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Memoize particles for better performance
  const particles = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1,
      duration: 4 + Math.random() * 3,
      delay: Math.random() * 2,
    }));
  }, []);

  return (
    <div className="fixed inset-0 bg-[var(--color-bg)] flex items-center justify-center z-[100] animate-fadeOut">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-bg)] via-[var(--color-accent)] to-[var(--color-bg)] opacity-80 animate-gradientShift"></div>

      {/* Optimized particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-[var(--color-primary)] opacity-20"
            style={{
              left: particle.left,
              top: particle.top,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animation: `float ${particle.duration}s ease-in-out infinite both`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Glow effects */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-[var(--color-primary)] opacity-10 rounded-full blur-3xl animate-pulseGlow"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-[var(--color-readmore)] opacity-10 rounded-full blur-3xl animate-pulseGlowDelay"></div>

      <div className="relative z-10 text-center">
        {/* Multi-layered spinner */}
        <div className="relative w-36 h-36 mx-auto mb-6">
          {/* Outer ring */}
          <div className="absolute inset-0 w-full h-full rounded-full border-[3px] border-transparent border-t-[var(--color-primary)] border-r-[var(--color-primary)] animate-spinSlow shadow-glowPrimary blur-soft"></div>
          
          {/* Middle ring */}
          <div className="absolute inset-3 w-30 h-30 rounded-full border-[3px] border-transparent border-b-[var(--color-readmore)] border-l-[var(--color-readmore)] animate-spinReverse shadow-glowAccent blur-soft"></div>
          
          {/* Inner ring */}
          <div className="absolute inset-6 w-24 h-24 rounded-full border-[2px] border-transparent border-t-[var(--color-secheading)] border-r-[var(--color-secheading)] animate-spinMedium shadow-glowSecondary"></div>
          
          {/* Logo container */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-tr from-[var(--color-card)] to-[var(--color-primary)] shadow-logoGlow animate-softPulse">
              <img
                src="/LCCG-Logo.webp"
                alt="LCCG Logo"
                className="w-12 h-12 object-contain rounded-full drop-shadow-lg transform transition-transform duration-700 hover:scale-110"
              />
            </div>
          </div>
        </div>

        {/* Text content */}
        <div className="mt-8 animate-fadeInUp">
          <h3
            className="text-2xl font-bold text-[var(--color-primary)] mb-2 tracking-wide"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Leo Club of Cinnamon Gardens
          </h3>
          <p className="text-[var(--color-description)] text-sm mb-4">
            Loading experience...
          </p>
          
          {/* Dot loader */}
          <div className="flex justify-center gap-1.5 mt-4">
            <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-dotPulse"></div>
            <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-dotPulse delay-150"></div>
            <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-dotPulse delay-300"></div>
          </div>
        </div>
      </div>

      {/* Progress bar (optional) */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 w-40 h-0.5 bg-[var(--color-bg)] opacity-30 rounded-full overflow-hidden">
        <div className="h-full bg-[var(--color-primary)] animate-progressBar"></div>
      </div>
    </div>
  );
}