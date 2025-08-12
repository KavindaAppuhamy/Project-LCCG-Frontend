import React, { useEffect, useState } from "react";

const Newsletter = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [modalPdf, setModalPdf] = useState(null);
  const [startIdx, setStartIdx] = useState(0); // start index of sliding window

  const windowSize = 3; // show 3 at a time

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/newsletter/search?status=active&limit=50`)
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

  // container width same as before
  const containerWidth = {
    1: 320,
    2: 640,
    3: 960,
  }[visibleNewsletters.length] || 960;

  return (
    <>
      <section id="newsletter" className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-[var(--color-secheading)] mb-6 text-center">
            Newsletter
          </h3>

          <div className="flex items-center gap-4 justify-center">
            {/* Prev Button */}
            <button
              onClick={() => canGoPrev && setStartIdx(startIdx - 1)}
              disabled={!canGoPrev}
              className={`text-3xl font-bold px-4 py-2 rounded-lg transition ${
                canGoPrev
                  ? "text-[var(--color-readmore)] hover:bg-[var(--color-readmore)] hover:text-white"
                  : "text-gray-400 cursor-not-allowed"
              }`}
              aria-label="Previous newsletters"
            >
              ‹
            </button>

            {/* Newsletter cards container */}
            <div
              className="grid gap-6"
              style={{
                gridTemplateColumns: `repeat(${visibleNewsletters.length}, minmax(0, 1fr))`,
                width: containerWidth,
              }}
            >
              {visibleNewsletters.length > 0 ? (
                visibleNewsletters.map((item) => (
                  <div
                    key={item._id}
                    className="bg-[var(--color-card)] p-4 rounded-xl shadow-lg hover:translate-y-[-6px] transition cursor-pointer flex flex-col items-center text-center"
                  >
                    <div
                      onClick={() => setModalPdf(item.pdf)}
                      className="overflow-hidden rounded-md mb-4 border border-white/30 w-full max-w-xs aspect-[3/4.5] cursor-pointer"
                      title={item.title}
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    <h5
                      className="font-semibold text-[var(--color-primary)] truncate"
                      onClick={() => setModalPdf(item.pdf)}
                      title={item.title}
                    >
                      {item.title}
                    </h5>

                    <p className="text-[var(--color-description)] text-sm mt-1 mb-4">
                      {new Date(item.date).toLocaleDateString()}
                    </p>

                    <button
                      onClick={() => setModalPdf(item.pdf)}
                      className="px-6 py-2 rounded bg-[var(--color-readmore)] text-[var(--color-accent)] font-semibold transition hover:bg-[var(--color-readmore)/90]"
                    >
                      View
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 col-span-3">No newsletters available.</p>
              )}
            </div>

            {/* Next Button */}
            <button
              onClick={() => canGoNext && setStartIdx(startIdx + 1)}
              disabled={!canGoNext}
              className={`text-3xl font-bold px-4 py-2 rounded-lg transition ${
                canGoNext
                  ? "text-[var(--color-readmore)] hover:bg-[var(--color-readmore)] hover:text-white"
                  : "text-gray-400 cursor-not-allowed"
              }`}
              aria-label="Next newsletters"
            >
              ›
            </button>
          </div>
        </div>
      </section>

      {/* Modal popup for PDF */}
      {modalPdf && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl w-full max-w-5xl relative">
            {/* Close Button */}
            <button
              onClick={() => setModalPdf(null)}
              className="absolute top-3 right-3 text-white hover:text-red-400 text-2xl font-bold"
              aria-label="Close modal"
            >
              ✕
            </button>

            {/* FlipHTML5 Embed */}
            <iframe
              src={modalPdf}
              title="Newsletter PDF"
              width="100%"
              height="600"
              frameBorder="0"
              allowFullScreen
              className="rounded-b-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Newsletter;
