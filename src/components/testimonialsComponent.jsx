import React, { useEffect, useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

const TestimonialsComponent = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [startIdx, setStartIdx] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const [windowSize, setWindowSize] = useState(() => {
    if (window.innerWidth < 768) return 1; // Mobile
    if (window.innerWidth < 1024) return 1; // Tablet/iPad
    return 2; // Desktop
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setWindowSize(1); // Mobile
      } else if (window.innerWidth < 1024) {
        setWindowSize(1); // Tablet/iPad
      } else {
        setWindowSize(2); // Desktop
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/testimonials/search?disabled=false&limit=20`
    )
      .then((res) => res.json())
      .then((data) => {
        setTestimonials(data.testimonials || []);
        setStartIdx(0);
      })
      .catch((err) => console.error("Failed to load testimonials", err));
  }, []);

  const endIdx = startIdx + windowSize;
  const visibleTestimonials = testimonials.slice(startIdx, endIdx);

  const canGoPrev = startIdx > 0;
  const canGoNext = endIdx < testimonials.length;

  return (
    <section id="testimonials" className="relative min-h-screen flex flex-col justify-center overflow-hidden px-4 sm:px-6 lg:px-12">
      {/* Professional Testimonials Background */}
      <div
        className="absolute inset-0 z-[-20] bg-cover bg-center bg-fixed" 
        style={{
          backgroundImage: `url('/testimonials_bg.webp')`,
          filter: "brightness(0.5) contrast(1.1)",
        }}
      ></div>

      <div className="absolute inset-0 z-[-10] bg-[rgba(0,0,0,0.7)]"></div>

      {/* Elegant ambient effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-24 w-32 h-32 bg-gradient-to-br from-[var(--color-primary)]/8 to-transparent 
                        rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-24 left-20 w-48 h-48 bg-gradient-to-tr from-[var(--color-secheading)]/6 to-transparent 
                        rounded-full blur-3xl animate-[float_10s_ease-in-out_infinite]" 
            style={{ animationDelay: "4s" }}></div>
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-br from-[var(--color-readmore)]/10 to-transparent 
                        rounded-full blur-2xl animate-[float_6s_ease-in-out_infinite]"
            style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/3 right-1/3 w-36 h-36 bg-[var(--color-readmore)] opacity-8 rounded-full blur-3xl 
                        animate-[float_12s_ease-in-out_infinite]" 
            style={{ animationDelay: "6s" }}></div>
        <div className="absolute bottom-1/3 left-1/4 w-28 h-28 bg-[var(--color-primary)] opacity-12 rounded-full blur-2xl 
                        animate-[float_9s_ease-in-out_infinite]" 
            style={{ animationDelay: "3s" }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="relative z-10 animate-[professionalSlideIn_1s_ease-out_0.2s_both]">
          {/* ---------- Your Existing Testimonials UI ---------- */}
          <div className="max-w-6xl mx-auto relative z-10">
            {/* Professional section header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-3
                            bg-gradient-to-r from-[var(--color-secheading)] via-[var(--color-primary)] to-[var(--color-readmore)] 
                            bg-clip-text text-transparent">
                What Our Members Say
              </h2>
              <div className="flex items-center justify-center space-x-3">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-[var(--color-primary)]"></div>
                <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-pulse"></div>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-[var(--color-primary)]"></div>
              </div>
              <br />
              <p className="text-sm md:text-base text-[var(--color-description)] max-w-xl mx-auto">
                Don't just take our word for it. Here's what our members <br />
                have to say about their experience.
              </p>
            </div>

            {/* Desktop */}
            <div className="hidden lg:block relative">
              <div className="flex items-stretch justify-center gap-4 max-w-5xl mx-auto relative">
                {/* Prev */}
                <button
                  onClick={() => canGoPrev && setStartIdx(startIdx - 1)}
                  disabled={!canGoPrev}
                  aria-label="Previous testimonials"
                  className={`absolute -left-12 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 shadow-md ${
                    canGoPrev
                      ? "bg-gradient-to-r from-[var(--color-secheading)] to-[#F0D492] text-white hover:bg-opacity-90 hover:scale-105"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed opacity-50"
                  }`}
                >
                  <HiChevronLeft size={18} />
                </button>

                {/* Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 w-full">
                  {visibleTestimonials.map(
                    ({ _id, name, position, speech, image }) => (
                      <div
                        key={_id}
                        className="group relative bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] backdrop-blur-lg rounded-2xl p-5 shadow-xl border border-[rgba(255,255,255,0.1)] hover:scale-[1.02] transition-all duration-400"
                        style={{ minHeight: "300px" }}
                      >
                        {/* Profile */}
                        <div className="flex items-center gap-3 mb-3">
                          <img
                            src={image}
                            alt={name}
                            className="w-14 h-14 rounded-full object-cover border-3 border-[var(--color-primary)]"
                          />
                          <div>
                            <h4 className="font-bold text-[var(--color-primary)] text-base">
                              {name}
                            </h4>
                            <p className="text-[var(--color-description)] text-xs">
                              {position}
                            </p>
                          </div>
                        </div>
                        <p className="text-[var(--color-status)] text-sm">
                          {speech}
                        </p>
                      </div>
                    )
                  )}
                </div>

                {/* Next */}
                <button
                  onClick={() => canGoNext && setStartIdx(startIdx + 1)}
                  disabled={!canGoNext}
                  aria-label="Next testimonials"
                  className={`absolute -right-12 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 shadow-md ${
                    canGoNext
                      ? "bg-gradient-to-r from-[var(--color-secheading)] to-[#F0D492] text-white hover:bg-opacity-90 hover:scale-105"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed opacity-50"
                  }`}
                >
                  <HiChevronRight size={18} />
                </button>
              </div>
            </div>

            {/* Tablet/iPad View (md to lg) */}
            <div
              className="hidden md:block lg:hidden"
              onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
              onTouchMove={(e) => setTouchEnd(e.touches[0].clientX)}
              onTouchEnd={() => {
                if (!touchStart || !touchEnd) return;
                const distance = touchStart - touchEnd;
                const minSwipe = 50;
                if (distance > minSwipe && canGoNext) {
                  setStartIdx(startIdx + 1);
                }
                if (distance < -minSwipe && canGoPrev) {
                  setStartIdx(startIdx - 1);
                }
                setTouchStart(null);
                setTouchEnd(null);
              }}
            >
              <div className="space-y-6 mb-6">
                {visibleTestimonials.map(
                  ({ _id, name, position, speech, image }) => (
                    <div
                      key={_id}
                      className="group relative mx-auto max-w-2xl bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-[rgba(255,255,255,0.1)] hover:scale-[1.02] transition-all duration-400"
                      style={{ minHeight: "350px" }}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <img
                          src={image}
                          alt={name}
                          className="w-16 h-16 rounded-full object-cover border-3 border-[var(--color-primary)]"
                        />
                        <div>
                          <h4 className="font-bold text-[var(--color-primary)] text-lg">
                            {name}
                          </h4>
                          <p className="text-[var(--color-description)] text-sm">
                            {position}
                          </p>
                        </div>
                      </div>
                      <p className="text-[var(--color-status)] text-base leading-relaxed">
                        {speech}
                      </p>
                    </div>
                  )
                )}
              </div>

              {/* Tablet Navigation */}
              <div className="flex justify-between items-center px-4">
                <button
                  onClick={() => canGoPrev && setStartIdx(startIdx - 1)}
                  disabled={!canGoPrev}
                  className={`w-12 h-12 flex items-center justify-center rounded-full border border-[var(--color-readmore)] bg-transparent transition-all ${
                    canGoPrev
                      ? "text-[var(--color-readmore)] hover:bg-[var(--color-readmore)] hover:text-white"
                      : "text-gray-400 opacity-50 cursor-not-allowed"
                  }`}
                >
                  <HiChevronLeft size={20} />
                </button>

                <span className="text-[var(--color-description)] text-sm">
                  {startIdx + 1}-{Math.min(endIdx, testimonials.length)} of{" "}
                  {testimonials.length}
                </span>

                <button
                  onClick={() => canGoNext && setStartIdx(startIdx + 1)}
                  disabled={!canGoNext}
                  className={`w-12 h-12 flex items-center justify-center rounded-full border border-[var(--color-readmore)] bg-transparent transition-all ${
                    canGoNext
                      ? "text-[var(--color-readmore)] hover:bg-[var(--color-readmore)] hover:text-white"
                      : "text-gray-400 opacity-50 cursor-not-allowed"
                  }`}
                >
                  <HiChevronRight size={20} />
                </button>
              </div>
            </div>

            {/* Mobile View (sm and below) */}
            <div
              className="md:hidden"
              onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
              onTouchMove={(e) => setTouchEnd(e.touches[0].clientX)}
              onTouchEnd={() => {
                if (!touchStart || !touchEnd) return;
                const distance = touchStart - touchEnd;
                const minSwipe = 50;
                if (distance > minSwipe && canGoNext) {
                  setStartIdx(startIdx + 1);
                }
                if (distance < -minSwipe && canGoPrev) {
                  setStartIdx(startIdx - 1);
                }
                setTouchStart(null);
                setTouchEnd(null);
              }}
            >
              <div className="space-y-4 mb-5 px-4">
                {visibleTestimonials.map(
                  ({ _id, name, position, speech, image }) => (
                    <div
                      key={_id}
                      className="group relative mx-auto max-w-sm bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] backdrop-blur-lg rounded-2xl p-5 shadow-xl border border-[rgba(255,255,255,0.1)] mx-3"
                      style={{ minHeight: "260px" }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={image}
                          alt={name}
                          className="w-12 h-12 rounded-full object-cover border-3 border-[var(--color-primary)]"
                        />
                        <div>
                          <h4 className="font-bold text-[var(--color-primary)] text-sm">
                            {name}
                          </h4>
                          <p className="text-[var(--color-description)] text-xs">
                            {position}
                          </p>
                        </div>
                      </div>
                      <p className="text-[var(--color-status)] text-xs">{speech}</p>
                    </div>
                  )
                )}
              </div>

              {/* Mobile Buttons */}
              <div className="flex justify-between items-center px-4">
                <button
                  onClick={() => canGoPrev && setStartIdx(startIdx - 1)}
                  disabled={!canGoPrev}
                  className={`w-9 h-9 flex items-center justify-center rounded-full border border-[var(--color-readmore)] bg-transparent transition-all ${
                    canGoPrev
                      ? "text-[var(--color-readmore)]"
                      : "text-gray-400 opacity-50 cursor-not-allowed"
                  }`}
                >
                  <HiChevronLeft size={18} />
                </button>

                <span className="text-[var(--color-description)] text-xs">
                  {startIdx + 1}-{Math.min(endIdx, testimonials.length)} of{" "}
                  {testimonials.length}
                </span>

                <button
                  onClick={() => canGoNext && setStartIdx(startIdx + 1)}
                  disabled={!canGoNext}
                  className={`w-9 h-9 flex items-center justify-center rounded-full border border-[var(--color-readmore)] bg-transparent transition-all ${
                    canGoNext
                      ? "text-[var(--color-readmore)]"
                      : "text-gray-400 opacity-50 cursor-not-allowed"
                  }`}
                >
                  <HiChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
          {/* ---------- End Testimonials UI ---------- */}
        </div>
      </div>

      <style jsx="true">{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default TestimonialsComponent;