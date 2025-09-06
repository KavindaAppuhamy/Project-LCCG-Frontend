import React from "react";

const HomeComponent = ({ scrollToId }) => {
  return (
    <section
      id="home"
      className="relative min-h-[100vh] flex flex-col md:flex-row items-center justify-center px-4 md:px-16 py-6 md:py-10 text-center md:text-left"
    >
      {/* Background with scaled blur to avoid borders */}
      <div
        className="absolute inset-0 z-[-20] bg-cover bg-center bg-fixed scale-110"
        style={{
          backgroundImage: `url('/background.jpg')`,
          filter: "blur(6px)",
        }}
      ></div>

      {/* Dark overlay (kept inside the section) */}
      <div className="absolute inset-0 z-[-10] bg-[rgba(0,0,0,0.5)] scale-110"></div>

      {/* Elegant floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-12 w-24 h-24 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secheading)]/5 
                        rounded-full blur-xl animate-[elegantFloat_6s_ease-in-out_infinite]
                        shadow-[0_0_40px_rgba(240,212,146,0.1)]"></div>

        <div
          className="absolute top-32 right-16 w-20 h-20 bg-gradient-to-tr from-[var(--color-readmore)]/8 to-transparent 
                        rounded-2xl rotate-45 blur-lg animate-[elegantDrift_10s_ease-in-out_infinite]"
          style={{ animationDelay: "2s" }}
        ></div>

        <div
          className="absolute bottom-24 left-1/4 w-32 h-32 bg-gradient-to-tl from-[var(--color-secheading)]/6 to-transparent 
                        rounded-full blur-2xl animate-[elegantPulse_8s_ease-in-out_infinite]"
          style={{ animationDelay: "4s" }}
        ></div>

        <div
          className="absolute bottom-16 right-1/3 w-24 h-24 bg-gradient-to-br from-[var(--color-primary)]/8 to-[var(--color-readmore)]/4 
                        rounded-2xl rotate-12 blur-xl animate-[elegantRotate_12s_linear_infinite]"
          style={{ animationDelay: "1s" }}
        ></div>

        {/* Elegant light rays */}
        <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-transparent via-[var(--color-primary)]/5 to-transparent 
                        animate-[lightRay_5s_ease-in-out_infinite] blur-sm"></div>
        <div
          className="absolute top-0 right-1/3 w-1 h-full bg-gradient-to-b from-transparent via-[var(--color-secheading)]/4 to-transparent 
                        animate-[lightRay_6s_ease-in-out_infinite_reverse] blur-sm"
          style={{ animationDelay: "3s" }}
        ></div>
      </div>

      {/* Professional keyframe animations */}
      <style jsx="true">{`
        @keyframes elegantFloat {
          0%,
          100% {
            transform: translateY(0px) translateX(0px) scale(1);
            opacity: 0.8;
          }
          33% {
            transform: translateY(-12px) translateX(6px) scale(1.03);
            opacity: 1;
          }
          66% {
            transform: translateY(6px) translateX(-4px) scale(0.97);
            opacity: 0.9;
          }
        }

        @keyframes elegantDrift {
          0%,
          100% {
            transform: translateX(0px) translateY(0px) rotate(45deg);
          }
          25% {
            transform: translateX(12px) translateY(-16px) rotate(60deg);
          }
          50% {
            transform: translateX(-8px) translateY(-8px) rotate(75deg);
          }
          75% {
            transform: translateX(-16px) translateY(8px) rotate(30deg);
          }
        }

        @keyframes elegantPulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.15);
            opacity: 0.8;
          }
        }

        @keyframes elegantRotate {
          0% {
            transform: rotate(12deg) scale(1);
          }
          100% {
            transform: rotate(372deg) scale(1);
          }
        }

        @keyframes lightRay {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }

        @keyframes professionalSlideIn {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes logoEntrance {
          from {
            opacity: 0;
            transform: translateY(25px) scale(1);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>

      {/* Left side - Professional Content */}
      <div className="max-w-3xl relative z-10 md:w-2/3">
        <div className="space-y-5 animate-[professionalSlideIn_0.8s_ease-out]">
          {/* Professional title section */}
          <div className="space-y-3">
            <h1
              className="text-xl sm:text-3xl md:text-4xl font-bold text-white leading-tight"
              style={{
                fontFamily: "'Montserrat', 'Inter', 'Playfair Display', serif",
              }}
            >
              We are Leos of
              <span
                className="block text-3xl sm:text-4xl md:text-5xl lg:text-[4rem] font-black mt-1
                            bg-gradient-to-r from-[var(--color-secheading)] via-[var(--color-primary)] to-[var(--color-readmore)] 
                            bg-clip-text text-transparent drop-shadow-xl"
                style={{
                  fontFamily:
                    "'Montserrat', 'Inter', 'Playfair Display', serif",
                }}
              >
                Cinnamon Gardens
              </span>
            </h1>

            {/* Elegant underline */}
            <div className="flex items-center justify-center md:justify-start space-x-3 mt-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[var(--color-primary)]"></div>
              <div className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full animate-pulse"></div>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[var(--color-primary)]"></div>
            </div>
          </div>

          {/* Professional description */}
          <div className="space-y-3 animate-[professionalSlideIn_0.8s_ease-out_0.2s_both]">
            <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-xl">
              Together we serve, lead and grow through meaningful community
              impact.
            </p>
          </div>

          {/* Professional CTA section */}
          <div
            className="flex flex-col sm:flex-row items-center sm:items-start md:items-center 
                          justify-center md:justify-start gap-3 pt-6 
                          animate-[professionalSlideIn_0.8s_ease-out_0.3s_both]"
          >
            <button
              onClick={() => scrollToId("register")}
              className="group relative px-6 py-3 bg-gradient-to-r from-[var(--color-readmore)] to-[var(--color-primary)]
                        text-[var(--color-accent)] font-semibold rounded-lg shadow-md
                        hover:shadow-[0_8px_30px_rgba(240,212,146,0.25)] hover:scale-105 
                        transition-all duration-300 overflow-hidden text-sm"
            >
              <span className="relative z-10">Join our Movement</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-readmore)] 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            <button
              onClick={() => scrollToId("about")}
              className="px-6 py-3 border border-white/20 text-white font-medium rounded-lg
                        backdrop-blur-sm hover:bg-white/10 hover:border-[var(--color-primary)]/40
                        transition-all duration-300 text-sm"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Right side - Professional Logo */}
      <div className="relative z-10 mt-10 md:mt-0 md:w-1/3 flex justify-center md:justify-end">
        <div className="animate-[logoEntrance_1s_ease-out_0.5s_both]">
          <div className="relative group">
            {/* Logo Only */}
            <div className="relative w-56 h-56 md:w-72 md:h-72 lg:w-80 lg:h-80 flex items-center justify-center">
              <img
                src="/LCCG-Logo.png"
                alt="Leos of Cinnamon Gardens Logo"
                className="scale-100 object-contain drop-shadow-xl 
                          group-hover:scale-115 transition-transform duration-400"
              />
            </div>

            {/* Subtle glow effect on hover */}
            <div
              className="absolute inset-0 rounded-full bg-[var(--color-primary)]/20 blur-2xl opacity-0 
                            group-hover:opacity-100 transition-opacity duration-400 -z-10"
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeComponent;
