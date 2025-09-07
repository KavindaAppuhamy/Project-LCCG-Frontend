// src/pages/User/LeoClubPage.jsx
import React, { useState, useRef, useEffect, Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

import LoaderComponent from "../../components/loaderComponent";
import HeaderComponent from "../../components/headerComponent";
import FooterComponent from "../../components/footerComponent";
import HomeComponent from "../../components/homeComponent";
import AboutComponent from "../../components/aboutComponent";
import RegisterSection from "../../components/registerComponent";
import ExcomSection from "../../components/excoCompoent";

// Lazy-loaded heavy components
const ProjectsSection = lazy(() => import("../../components/projectComponent"));
const Newsletter = lazy(() => import("../../components/newslettersComponent"));
const TestimonialsComponent = lazy(() => import("../../components/testimonialsComponent"));

export default function LeoClubPage() {
  const navigate = useNavigate();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [modalPdf, setModalPdf] = useState(null);
  const [modalProject, setModalProject] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const pageRef = useRef(null);

  // Page loader
  useEffect(() => {
    const timer = setTimeout(() => setIsPageLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  // Smooth scroll behavior
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => (document.documentElement.style.scrollBehavior = "auto");
  }, []);

  // Optimized back-to-top scroll listener
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const aboutSection = document.getElementById("about");
          if (aboutSection) {
            setShowBackToTop(window.scrollY >= aboutSection.offsetTop - 100);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Particles init
  const particlesInit = async (engine) => {
    try {
      await loadFull(engine);
    } catch (err) {
      console.warn("Particles init failed:", err);
    }
  };

  // Scroll helpers
  const scrollToId = (id) => {
    const section = document.getElementById(id);
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  if (isPageLoading) return <LoaderComponent />;

  return (
    <div ref={pageRef} className="relative min-h-screen text-white overflow-hidden">
      {/* Particles background */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: { color: "transparent" },
          fpsLimit: 60,
          interactivity: { events: { onHover: { enable: false }, onClick: { enable: false } } },
          particles: {
            color: { value: "#F0D492" },
            links: { enable: false },
            move: { enable: true, speed: 0.4, outModes: { default: "out" } },
            number: { value: 40, density: { enable: true, area: 900 } },
            opacity: { value: 0.5, random: { enable: true, minimumValue: 0.3 } },
            size: { value: { min: 1, max: 3 } },
          },
          detectRetina: true,
        }}
        className="fixed inset-0 -z-10"
      />

      {/* Header */}
      {!modalProject && !modalPdf && <HeaderComponent scrollToId={scrollToId} />}

      {/* Back to Top */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-readmore)]
                     text-[var(--color-accent)] rounded-full shadow-lg hover:shadow-xl
                     transform hover:scale-110 transition-all duration-300 flex items-center justify-center"
          aria-label="Back to top"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}

      <main className="pt-5 md:pt-5">
        <HomeComponent scrollToId={scrollToId} />
        <AboutComponent scrollToId={scrollToId} />

        <Suspense fallback={<LoaderComponent />}>
          <ProjectsSection modalProject={modalProject} setModalProject={setModalProject} />
          <Newsletter modalPdf={modalPdf} setModalPdf={setModalPdf} />
          <TestimonialsComponent />
        </Suspense>

        <ExcomSection />
        <RegisterSection />

        <footer>
          <FooterComponent />
        </footer>
      </main>
    </div>
  );
}
