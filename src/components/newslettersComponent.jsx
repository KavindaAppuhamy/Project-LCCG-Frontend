import React, { useEffect, useState } from "react";

const Newsletter = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [modalPdf, setModalPdf] = useState(null);
  const [startIdx, setStartIdx] = useState(0);

  const [windowSize, setWindowSize] = useState(3); // default desktop

  // Detect screen size and set how many newsletters to show
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setWindowSize(1); // Mobile → show 1 at a time
      } else {
        setWindowSize(3); // Desktop → show 3 at a time
      }
    };
    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/newsletter/search?status=active&limit=50`
    )
      .then((res) => res.json())
      .then((data) => {
        setNewsletters(data.newsletters || []);
        setStartIdx(0);
      })
      .catch((err) => console.error("Failed to load newsletters", err));
  }, []);

  const endIdx = startIdx + windowSize;
  const visibleNewsletters = newsletters.slice(startIdx, endIdx);

  const canGoNext = endIdx < newsletters.length;
  const canGoPrev = startIdx > 0;

  const containerWidth = {
    1: 320,
    2: 640,
    3: 960,
  }[visibleNewsletters.length] || 960;

  return (
    <>
      <section id="newsletter" className="py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <h3 className="text-3xl font-bold text-[var(--color-secheading)] mb-8 text-center">
            Newsletter
          </h3>

          <div className="flex items-center gap-6 justify-center">
            {/* Prev Button */}
            <button
              onClick={() => canGoPrev && setStartIdx(startIdx - 1)}
              disabled={!canGoPrev}
              className={`
                text-3xl font-bold px-6 py-4 rounded-xl transition-all duration-300 transform
                backdrop-blur-md border border-white/20 
                ${canGoPrev
                  ? "text-[var(--color-readmore)] bg-white/10 hover:bg-[var(--color-readmore)]/20 hover:text-white hover:scale-110 hover:shadow-lg shadow-lg"
                  : "text-gray-400 cursor-not-allowed bg-white/5"
                }
              `}
              aria-label="Previous newsletters"
            >
              ‹
            </button>

            {/* Cards Container */}
            <div
              className={`grid gap-8 transition-transform duration-500 ease-[cubic-bezier(0.68,-0.55,0.27,1.55)]`}
              style={{
                gridTemplateColumns: `repeat(${visibleNewsletters.length}, minmax(0, 1fr))`,
                width: containerWidth,
              }}
            >
              {visibleNewsletters.length > 0 ? (
                visibleNewsletters.map((item, index) => (
                  <div
                    key={item._id}
                    className={`
                      group relative overflow-hidden rounded-2xl transition-all duration-500 ease-out transform 
                      hover:scale-105 hover:-translate-y-2 cursor-pointer
                      bg-white/10 backdrop-blur-xl border border-white/30
                      shadow-xl hover:shadow-2xl hover:shadow-[var(--color-readmore)]/25
                      swim-effect
                    `}
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-full group-hover:-translate-x-full transition-transform duration-1000" />
                    </div>

                    {/* Card Content */}
                    <div className="relative z-10 p-6 flex flex-col items-center text-center h-full">
                      <div
                        onClick={() => setModalPdf(item.pdf)}
                        className="
                          relative overflow-hidden rounded-xl mb-6 border border-white/40 w-full max-w-xs aspect-[3/4.5] 
                          cursor-pointer group-hover:border-white/60 transition-all duration-300
                          shadow-lg group-hover:shadow-xl
                        "
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />

                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                          <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                            <svg
                              className="w-6 h-6 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Text Content */}
                      <div className="flex-1 flex flex-col justify-between w-full">
                        <div>
                          <h5
                            className="
                              font-bold text-lg text-[var(--color-primary)] mb-2 leading-tight
                              group-hover:text-white transition-colors duration-300
                              line-clamp-2 min-h-[3.5rem]
                            "
                            onClick={() => setModalPdf(item.pdf)}
                          >
                            {item.title}
                          </h5>

                          <p className="text-[var(--color-description)] text-sm mb-6 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                            {new Date(item.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>

                        {/* Button */}
                        <button
                          onClick={() => setModalPdf(item.pdf)}
                          className="
                            relative px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform
                            bg-[var(--color-readmore)]/90 text-[var(--color-accent)] 
                            hover:bg-[var(--color-readmore)] hover:scale-105 hover:shadow-lg
                            backdrop-blur-sm border border-white/20
                            group-hover:border-white/40 group-hover:shadow-[var(--color-readmore)]/50
                            overflow-hidden
                          "
                        >
                          <span className="relative z-10">View Newsletter</span>
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover:-translate-x-full transition-transform duration-700" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-xl">
                    <p className="text-gray-400 text-lg">
                      No newsletters available at the moment.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Next Button */}
            <button
              onClick={() => canGoNext && setStartIdx(startIdx + 1)}
              disabled={!canGoNext}
              className={`
                text-3xl font-bold px-6 py-4 rounded-xl transition-all duration-300 transform
                backdrop-blur-md border border-white/20
                ${canGoNext
                  ? "text-[var(--color-readmore)] bg-white/10 hover:bg-[var(--color-readmore)]/20 hover:text-white hover:scale-110 hover:shadow-lg shadow-lg"
                  : "text-gray-400 cursor-not-allowed bg-white/5"
                }
              `}
              aria-label="Next newsletters"
            >
              ›
            </button>
          </div>
        </div>
      </section>

      {/* PDF Modal */}
      {modalPdf && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-start z-50 p-4 animate-fade-in">
          <div className="bg-white/10 backdrop-blur-2xl border border-white/30 rounded-3xl shadow-2xl w-full max-w-5xl relative transform animate-scale-in mt-[80px]">
            <button
              onClick={() => setModalPdf(null)}
              className="absolute -top-4 -right-4 z-10 w-12 h-12 rounded-full
                bg-red-500/20 backdrop-blur-xl border border-red-500/30 
                text-white hover:text-red-400 hover:bg-red-500/30 
                text-2xl font-bold transition-all duration-300 transform hover:scale-110
                flex items-center justify-center shadow-lg hover:shadow-red-500/25"
            >
              ✕
            </button>
            <div className="p-2">
              <iframe
                src={modalPdf}
                title="Newsletter PDF"
                width="100%"
                height="550"
                frameBorder="0"
                allowFullScreen
                className="rounded-2xl shadow-inner"
                style={{ background: "white" }}
              />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes swim {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.4s ease-out;
        }
        .swim-effect {
          animation: swim 4s ease-in-out infinite;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default Newsletter;
