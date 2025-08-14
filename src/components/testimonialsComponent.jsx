import React, { useEffect, useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

const TestimonialsComponent = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [startIdx, setStartIdx] = useState(0);
  const windowSize = 2;

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
    <section
      id="testimonials"
      className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-readmore)] blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-gradient-to-br from-[var(--color-readmore)] to-[var(--color-primary)] blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-[var(--color-primary)]/20 rounded-full animate-float"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${3 + (i % 3)}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10 md:mb-14">
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-secheading)] mb-3">
            What Our Members Say
          </h3>
          <p className="text-base md:text-lg text-[var(--color-description)] max-w-2xl mx-auto px-4">
            Don't just take our word for it. Here's what our members
            have to say about their experience.
          </p>
        </div>

        {/* Desktop */}
        <div className="hidden lg:block relative">
          <div className="flex items-stretch justify-center gap-4 xl:gap-6 max-w-6xl mx-auto relative">
            {/* Prev */}
            <button
              onClick={() => canGoPrev && setStartIdx(startIdx - 1)}
              disabled={!canGoPrev}
              aria-label="Previous testimonials"
              className={`absolute -left-14 xl:-left-16 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-12 h-12 xl:w-14 xl:h-14 rounded-xl transition-all duration-300 shadow-lg ${
                canGoPrev
                  ? "bg-[var(--color-readmore)] text-white hover:bg-opacity-90 hover:scale-105"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed opacity-50"
              }`}
            >
              <HiChevronLeft size={20} />
            </button>

            {/* Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
              {visibleTestimonials.map(
                ({ _id, name, position, speech, image }) => (
                  <div
                    key={_id}
                    className="group relative bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-[rgba(255,255,255,0.1)] hover:scale-[1.02] transition-all duration-500"
                    style={{ minHeight: "360px" }}
                  >
                    {/* Profile */}
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={image}
                        alt={name}
                        className="w-16 h-16 rounded-full object-cover border-4 border-[var(--color-primary)]"
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
                    <p className="text-[var(--color-status)] text-base">
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
              className={`absolute -right-14 xl:-right-16 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-12 h-12 xl:w-14 xl:h-14 rounded-xl transition-all duration-300 shadow-lg ${
                canGoNext
                  ? "bg-[var(--color-readmore)] text-white hover:bg-opacity-90 hover:scale-105"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed opacity-50"
              }`}
            >
              <HiChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Mobile */}
        <div className="lg:hidden">
          <div className="space-y-3 mb-6">
            {visibleTestimonials.map(
              ({ _id, name, position, speech, image }) => (
                <div
                  key={_id}
                  className="group relative mx-auto max-w-sm bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] backdrop-blur-lg rounded-3xl p-6 shadow-2xl border border-[rgba(255,255,255,0.1)]"
                  style={{ minHeight: "300px" }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={image}
                      alt={name}
                      className="w-14 h-14 rounded-full object-cover border-4 border-[var(--color-primary)]"
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
                  <p className="text-[var(--color-status)] text-sm">{speech}</p>
                </div>
              )
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => canGoPrev && setStartIdx(startIdx - 1)}
              disabled={!canGoPrev}
              className={`w-10 h-10 flex items-center justify-center rounded-full border border-[var(--color-readmore)] bg-transparent transition-all ${
                canGoPrev
                  ? "text-[var(--color-readmore)]"
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
              className={`w-10 h-10 flex items-center justify-center rounded-full border border-[var(--color-readmore)] bg-transparent transition-all ${
                canGoNext
                  ? "text-[var(--color-readmore)]"
                  : "text-gray-400 opacity-50 cursor-not-allowed"
              }`}
            >
              <HiChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
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
