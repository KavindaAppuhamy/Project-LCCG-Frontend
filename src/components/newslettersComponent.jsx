import React, { useEffect, useState, useRef } from "react";

const Newsletter = ({ modalPdf, setModalPdf }) => {
  const [newsletters, setNewsletters] = useState([]);
  const [startIdx, setStartIdx] = useState(0);
  const [windowSize, setWindowSize] = useState(3);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [touchStartY, setTouchStartY] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const minSwipeDistance = 50;
  const maxVerticalMovement = 30; // Allow some vertical movement while swiping

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setWindowSize(1);
      } else {
        setWindowSize(3);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (modalPdf) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [modalPdf]);

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
    1: 280,
    2: 560,
    3: 840,
  }[visibleNewsletters.length] || 840;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
    setIsDragging(false);
  };

  const onTouchMove = (e) => {
    const currentX = e.targetTouches[0].clientX;
    const currentY = e.targetTouches[0].clientY;
    
    if (touchStart && touchStartY) {
      const deltaX = Math.abs(currentX - touchStart);
      const deltaY = Math.abs(currentY - touchStartY);
      
      // If horizontal movement is greater than vertical movement and exceeds threshold
      if (deltaX > deltaY && deltaX > 10) {
        setIsDragging(true);
        // Prevent default scrolling only when we detect horizontal swipe intent
        e.preventDefault();
      }
    }
    
    setTouchEnd(currentX);
  };

  const onTouchEnd = (e) => {
    if (!touchStart || !touchEnd || !touchStartY) return;
    
    const distance = touchStart - touchEnd;
    const verticalDistance = Math.abs(e.changedTouches[0].clientY - touchStartY);
    
    // Only process as swipe if horizontal movement dominates and vertical movement is minimal
    if (verticalDistance < maxVerticalMovement && isDragging) {
      const isLeftSwipe = distance > minSwipeDistance;
      const isRightSwipe = distance < -minSwipeDistance;
      
      if (isLeftSwipe && canGoNext) {
        setStartIdx(startIdx + 1);
      } else if (isRightSwipe && canGoPrev) {
        setStartIdx(startIdx - 1);
      }
    }
    
    // Reset touch states
    setTouchStart(null);
    setTouchEnd(null);
    setTouchStartY(null);
    setIsDragging(false);
  };

  return (
    <>
      {/* ===== Newsletter Section Wrapper (from mainPage.jsx) ===== */}
      <section id="newsletter" className="relative min-h-screen flex items-center py-24 px-4 md:px-8 overflow-hidden">
        {/* Professional Newsletter Background */}
        <div
          className="absolute inset-0 z-[-20] bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `url('/newsletters_bg.webp')`,
            filter: "brightness(0.3) contrast(1.1)",
          }}
        ></div>

        <div className="absolute inset-0 z-[-10] bg-[rgba(0,0,0,0.8)]"></div>

        {/* Elegant ambient effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 z-[-10] bg-[rgba(0,0,0,0.8)] backdrop-blur-[30px]" />
          <div className="absolute top-20 right-1/4 w-28 h-28 bg-[var(--color-secheading)] opacity-10 rounded-full blur-2xl animate-[pulse_3.5s_ease-in-out_infinite]"></div>
          <div
            className="absolute bottom-20 left-1/4 w-44 h-44 bg-[var(--color-accent)] opacity-12 rounded-full blur-3xl animate-[pulse_4.5s_ease-in-out_infinite]"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        {/* ===== Your Newsletter Component Content ===== */}
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-8">
            <h2
              className="text-3xl sm:text-4xl font-bold mb-3
                          bg-gradient-to-r from-[var(--color-secheading)] via-[var(--color-primary)] to-[var(--color-readmore)] 
                          bg-clip-text text-transparent"
            >
              Newsletter
            </h2>
            <div className="flex items-center justify-center space-x-3">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-[var(--color-primary)]"></div>
              <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-pulse"></div>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-[var(--color-primary)]"></div>
            </div>
          </div>

          {/* Cards & Buttons Layout */}
          <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
            {/* Prev Button - Desktop Only */}
            <button
              onClick={() => canGoPrev && setStartIdx(startIdx - 1)}
              disabled={!canGoPrev}
              className={`
                hidden md:block text-2xl font-bold px-4 py-3 rounded-lg transition-all duration-300 transform
                backdrop-blur-md border border-white/20 
                ${
                  canGoPrev
                    ? "text-[var(--color-readmore)] bg-white/10 hover:bg-[var(--color-readmore)]/20 hover:text-white hover:scale-105 hover:shadow-md"
                    : "text-gray-400 cursor-not-allowed bg-white/5"
                }
              `}
              aria-label="Previous newsletters"
            >
              ‹
            </button>

            {/* Cards with improved touch events */}
            <div
              ref={containerRef}
              className={`
                grid gap-6 w-full justify-center 
                transition-transform duration-400 ease-[cubic-bezier(0.68,-0.55,0.27,1.55)]
              `}
              style={{
                gridTemplateColumns: `repeat(${windowSize}, minmax(0, 1fr))`,
                touchAction: 'pan-y pinch-zoom', // Allow vertical scrolling and pinch zoom
              }}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {visibleNewsletters.length > 0 ? (
                visibleNewsletters.map((item, index) => (
                  <div
                    key={item._id}
                    className={`
                      group relative overflow-hidden rounded-xl transition-all duration-400 ease-out transform 
                      hover:scale-[1.03] hover:-translate-y-1 cursor-pointer
                      bg-white/10 backdrop-blur-xl border border-white/30
                      shadow-lg hover:shadow-xl hover:shadow-[var(--color-readmore)]/20
                      swim-effect
                      mx-auto w-[90%] sm:w-[80%] md:w-[280px] lg:w-[260px]
                    `}
                    style={{ 
                      animationDelay: `${index * 80}ms`,
                      touchAction: 'manipulation', // Improve touch responsiveness
                    }}
                  >
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-full group-hover:-translate-x-full transition-transform duration-800" />
                    </div>
                    <div className="relative z-10 p-4 flex flex-col items-center text-center h-full">
                      <div
                        onClick={() => setModalPdf(item.pdf)}
                        className="
                          relative overflow-hidden rounded-lg mb-4 border border-white/40 
                          w-full aspect-[3/4] cursor-pointer 
                          group-hover:border-white/60 transition-all duration-300 
                          shadow-md group-hover:shadow-lg
                        "
                        style={{ touchAction: 'manipulation' }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-400 group-hover:scale-110"
                          loading="lazy"
                          style={{
                            touchAction: 'manipulation',
                            userSelect: 'none',
                            WebkitUserSelect: 'none',
                            pointerEvents: 'none'
                          }}
                          draggable={false}
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between w-full">
                        <div>
                          <h5
                            className="font-bold text-base text-[var(--color-primary)] mb-2 leading-tight group-hover:text-white transition-colors duration-300 line-clamp-2 min-h-[3rem] cursor-pointer select-text"
                            onClick={() => setModalPdf(item.pdf)}
                            style={{ touchAction: 'manipulation' }}
                          >
                            {item.title}
                          </h5>
                          <p className="text-[var(--color-description)] text-xs mb-4 opacity-80 group-hover:opacity-100 transition-opacity duration-300 select-text">
                            {new Date(item.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <button
                          onClick={() => setModalPdf(item.pdf)}
                          className="relative px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform bg-gradient-to-r from-[var(--color-secheading)] to-[#F0D492] text-[var(--color-accent)] hover:bg-[var(--color-readmore)] hover:scale-[1.03] hover:shadow-md backdrop-blur-sm border border-white/20 group-hover:border-white/40 group-hover:shadow-[var(--color-readmore)]/40 overflow-hidden text-sm active:scale-95"
                          style={{ touchAction: 'manipulation' }}
                        >
                          <span className="relative z-10">View Newsletter</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-8">
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-6 shadow-md">
                    <p className="text-gray-400 text-base">
                      No newsletters available at the moment.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Next Button - Desktop Only */}
            <button
              onClick={() => canGoNext && setStartIdx(startIdx + 1)}
              disabled={!canGoNext}
              className={`
                hidden md:block text-2xl font-bold px-4 py-3 rounded-lg transition-all duration-300 transform 
                backdrop-blur-md border border-white/20
                ${
                  canGoNext
                    ? "text-[var(--color-readmore)] bg-white/10 hover:bg-[var(--color-readmore)]/20 hover:text-white hover:scale-105 hover:shadow-md"
                    : "text-gray-400 cursor-not-allowed bg-white/5"
                }
              `}
              aria-label="Next newsletters"
            >
              ›
            </button>
          </div>

          {/* Mobile Buttons */}
          <div className="flex md:hidden w-full justify-center gap-3 mt-6">
            <button
              onClick={() => canGoPrev && setStartIdx(startIdx - 1)}
              disabled={!canGoPrev}
              className={`
                text-2xl font-bold px-4 py-2 rounded-lg transition-all duration-300 transform
                backdrop-blur-md border border-white/20 active:scale-95
                ${
                  canGoPrev
                    ? "text-[var(--color-readmore)] bg-white/10 hover:bg-[var(--color-readmore)]/20 hover:text-white hover:scale-105 hover:shadow-md"
                    : "text-gray-400 cursor-not-allowed bg-white/5"
                }
              `}
              style={{ touchAction: 'manipulation' }}
            >
              ‹
            </button>
            <button
              onClick={() => canGoNext && setStartIdx(startIdx + 1)}
              disabled={!canGoNext}
              className={`
                text-2xl font-bold px-4 py-2 rounded-lg transition-all duration-300 transform
                backdrop-blur-md border border-white/20 active:scale-95
                ${
                  canGoNext
                    ? "text-[var(--color-readmore)] bg-white/10 hover:bg-[var(--color-readmore)]/20 hover:text-white hover:scale-105 hover:shadow-md"
                    : "text-gray-400 cursor-not-allowed bg-white/5"
                }
              `}
              style={{ touchAction: 'manipulation' }}
            >
              ›
            </button>
          </div>
        </div>
      </section>

      {/* PDF Modal */}
      {modalPdf && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-start z-[9999] p-3 animate-fade-in overflow-y-auto"
          style={{
            touchAction: 'pan-y',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          <div className="bg-white/10 backdrop-blur-2xl border border-white/30 rounded-xl shadow-xl w-full max-w-4xl relative transform animate-scale-in mt-[60px] mb-6">
            <button
              onClick={() => setModalPdf(null)}
              className="absolute -top-3 -right-3 z-10 w-9 h-9 rounded-full bg-red-500/20 backdrop-blur-xl border border-red-500/30 text-white hover:text-red-400 hover:bg-red-500/30 text-xl font-bold transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-md hover:shadow-red-500/20 active:scale-95"
              style={{ touchAction: 'manipulation' }}
            >
              ✕
            </button>
            <div className="p-1.5">
              <iframe
                src={modalPdf}
                title="Newsletter PDF"
                width="100%"
                height="500"
                frameBorder="0"
                allowFullScreen
                className="rounded-lg shadow-inner"
                style={{ 
                  background: "white",
                  touchAction: 'pan-x pan-y pinch-zoom'
                }}
              />
            </div>
          </div>
        </div>
      )}

      <style jsx="true">{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95) translateY(15px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes swim {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
          100% { transform: translateY(0px); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
        .animate-scale-in { animation: scale-in 0.3s ease-out; }
        .swim-effect { animation: swim 4s ease-in-out infinite; }
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