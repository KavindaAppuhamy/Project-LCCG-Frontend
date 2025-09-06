import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import HomeComponent from "../../components/homeComponent";
import ProjectsSection from "../../components/projectComponent";
import Newsletter from "../../components/newslettersComponent";
import TestimonialsComponent from "../../components/testimonialsComponent";
import HeaderComponent from "../../components/HeaderComponent";
import FooterComponent from "../../components/footerComponent";
import ExcomSection from "../../components/excoCompoent";
import RegisterSection from "../../components/registerComponent";
import AboutComponent from "../../components/aboutComponent";

export default function LeoClubPage() {
  const navigate = useNavigate();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [modalPdf, setModalPdf] = useState(null);
  const [modalProject, setModalProject] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const pageRef = useRef(null);

  // Loading screen effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Back to Top visibility logic
  useEffect(() => {
    const handleScroll = () => {
      const aboutSection = document.getElementById("about");
      if (aboutSection) {
        const aboutTop = aboutSection.offsetTop;
        const scrollY = window.scrollY;
        setShowBackToTop(scrollY >= aboutTop - 100);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Add smooth scrolling CSS to document
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  const particlesInit = async (engine) => {
    try {
      await loadFull(engine);
    } catch (error) {
      console.warn("loadFull failed:", error);
      try {
        if (typeof engine.loadFull === "function") {
          await engine.loadFull();
        }
      } catch (fallbackError) {
        console.error("Both initialization methods failed:", fallbackError);
      }
    }
  };

  const scrollToId = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "nearest",
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Loading Screen Component
  if (isPageLoading) {
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
                  src="/LCCG-Logo.png"
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

  return (
    <div ref={pageRef} className="relative min-h-screen text-white overflow-hidden">
      {/* Global Particles animation on top */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: "transparent" },
          fpsLimit: 60,
          interactivity: {
            events: { onHover: { enable: false }, onClick: { enable: false } },
          },
          particles: {
            color: { value: "#F0D492" },
            links: { enable: false },
            move: { enable: true, speed: 0.6, outModes: { default: "out" } },
            number: { value: 60, density: { enable: true, area: 800 } },
            opacity: { value: 0.5, random: { enable: true, minimumValue: 0.2 } },
            size: { value: { min: 1, max: 3 } },
          },
          detectRetina: true,
        }}
        className="fixed inset-0 -z-5"
      />

      {!modalProject && !modalPdf && <HeaderComponent scrollToId={scrollToId} />}

      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-readmore)]
                     text-[var(--color-accent)] rounded-full shadow-lg hover:shadow-xl
                     transform hover:scale-110 transition-all duration-300 flex items-center justify-center
                     animate-[backToTopSlide_0.3s_ease-out] hover:from-[var(--color-readmore)] hover:to-[var(--color-secheading)]"
          aria-label="Back to top"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}

      <main className="pt-5 md:pt-5">
        <HomeComponent scrollToId={scrollToId} />
        <AboutComponent scrollToId={scrollToId} />
        <ProjectsSection modalProject={modalProject} setModalProject={setModalProject}/>
        <Newsletter modalPdf={modalPdf} setModalPdf={setModalPdf} />
        <TestimonialsComponent />
        <ExcomSection />
        <RegisterSection/>
        <footer>
          <FooterComponent />
        </footer>
      </main>

    </div>
  );
}
