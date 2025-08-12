import React, { useEffect, useState } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

const TestimonialsComponent = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [startIdx, setStartIdx] = useState(0);
  const windowSize = 2; // show 2 cards at once

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/testimonials/search?disabled=false&limit=20`)
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
<section id="testimonials" className="py-16 px-6 bg-[var(--color-card)]">
  <div className="max-w-7xl mx-auto text-center">
    <h3 className="text-3xl font-bold text-[var(--color-secheading)] mb-8">
      Testimonials
    </h3>

    <div className="relative flex items-center justify-center gap-6 max-w-[1200px] mx-auto">
      {/* Prev Button */}
      <button
        onClick={() => canGoPrev && setStartIdx(startIdx - 1)}
        disabled={!canGoPrev}
        aria-label="Previous testimonials"
        className={`flex items-center justify-center w-12 h-12 rounded-lg transition text-[var(--color-readmore)] hover:bg-[var(--color-readmore)] hover:text-white ${
          !canGoPrev && "text-gray-400 cursor-not-allowed"
        }`}
        style={{ zIndex: 10 }}
      >
        <HiChevronLeft size={30} />
      </button>

      {/* Cards container - flex-grow so buttons don’t squeeze cards */}
      <div
        className="flex gap-6 overflow-hidden"
        style={{ flexGrow: 1, justifyContent: "center" }}
      >
        {visibleTestimonials.length > 0 ? (
          visibleTestimonials.map(({ _id, name, position, speech, image }) => (
            <div
              key={_id}
              className="p-6 rounded-2xl bg-[rgba(255,255,255,0.02)] backdrop-blur-md shadow-lg flex flex-col items-center text-center"
              style={{
                minWidth: 540,
                maxWidth: 540,
                height: 480,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
              }}
            >
              <img
                src={image}
                alt={name}
                className="w-24 h-24 rounded-full object-cover mb-4 border-2 border-[var(--color-primary)]"
                loading="lazy"
              />
              <h4 className="font-semibold text-[var(--color-primary)] text-lg">{name}</h4>
              <p className="text-[var(--color-description)] text-xs mb-4">{position}</p>
              <p
                className="text-[var(--color-status)] italic leading-relaxed overflow-hidden"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 10,
                  WebkitBoxOrient: "vertical",
                  textOverflow: "ellipsis",
                  minHeight: "15rem",
                  maxHeight: "15rem",
                }}
                title={speech}
              >
                {`"${speech}"`}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-2">No testimonials available.</p>
        )}
      </div>

      {/* Next Button */}
      <button
        onClick={() => canGoNext && setStartIdx(startIdx + 1)}
        disabled={!canGoNext}
        aria-label="Next testimonials"
        className={`flex items-center justify-center w-12 h-12 rounded-lg transition text-[var(--color-readmore)] hover:bg-[var(--color-readmore)] hover:text-white ${
          !canGoNext && "text-gray-400 cursor-not-allowed"
        }`}
        style={{ zIndex: 10 }}
      >
        <HiChevronRight size={30} />
      </button>
    </div>
  </div>
</section>

  );
};

export default TestimonialsComponent;
