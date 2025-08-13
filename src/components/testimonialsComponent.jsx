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
    <section 
      id="testimonials" 
      className="py-20 px-4 sm:px-6 lg:px-8  relative overflow-hidden"
    >
      {/* Animated Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-readmore)] blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-gradient-to-br from-[var(--color-readmore)] to-[var(--color-primary)] blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-gradient-to-br from-[var(--color-primary)]/50 to-[var(--color-readmore)]/50 blur-2xl animate-bounce" style={{ animationDuration: '3s', animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-1/3 right-1/4 w-28 h-28 rounded-full bg-gradient-to-br from-[var(--color-readmore)]/40 to-[var(--color-primary)]/40 blur-2xl animate-bounce" style={{ animationDuration: '4s', animationDelay: '2s' }}></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-[var(--color-primary)]/20 rounded-full animate-float"
            style={{
              left: `${20 + (i * 15)}%`,
              top: `${30 + (i * 10)}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${3 + (i % 3)}s`
            }}
          ></div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          {/* Star rating */}
          <div className="flex justify-center mb-6">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-6 h-6 text-[var(--color-primary)] animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
              ))}
            </div>
          </div>
          
          <h3 className="text-4xl lg:text-5xl font-bold text-[var(--color-secheading)] mb-4 animate-fade-in">
            What Our Clients Say
          </h3>
          <p className="text-lg text-[var(--color-description)] max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Don't just take our word for it. Here's what our satisfied clients have to say about their experience.
          </p>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex relative items-stretch justify-center gap-8 max-w-6xl mx-auto">
          {/* Prev Button */}
          <button
            onClick={() => canGoPrev && setStartIdx(startIdx - 1)}
            disabled={!canGoPrev}
            aria-label="Previous testimonials"
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-xl transition-all duration-300 shadow-lg ${
              canGoPrev
                ? 'bg-[var(--color-readmore)] text-white hover:bg-opacity-90 hover:scale-105 hover:shadow-xl'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
            }`}
          >
            <HiChevronLeft size={24} />
          </button>

          {/* Cards Container */}
          <div className="flex-1 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 justify-items-center">
              {visibleTestimonials.length > 0 ? (
                visibleTestimonials.map(({ _id, name, position, speech, image }, index) => (
                  <div
                    key={_id}
                    className="group relative bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-[rgba(255,255,255,0.1)] transition-all duration-500 hover:scale-105 hover:shadow-3xl max-w-md w-full animate-slide-up"
                    style={{ 
                      animationDelay: `${index * 0.2}s`,
                      minHeight: '480px'
                    }}
                  >
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-readmore)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative z-10">
                      {/* Quote icon */}
                      <div className="absolute -top-2 -left-2 w-8 h-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center animate-pulse">
                        <span className="text-white text-lg font-bold">"</span>
                      </div>

                      {/* Profile Image */}
                      <div className="flex flex-col items-center mb-6">
                        <div className="relative mb-4">
                          <img
                            src={image}
                            alt={name}
                            className="w-20 h-20 rounded-full object-cover border-4 border-[var(--color-primary)] shadow-lg group-hover:border-[var(--color-readmore)] transition-all duration-300 group-hover:scale-110"
                            loading="lazy"
                          />
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[var(--color-readmore)] rounded-full flex items-center justify-center animate-bounce">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        </div>

                        {/* Name and Position */}
                        <h4 className="font-bold text-[var(--color-primary)] text-xl mb-1 group-hover:text-[var(--color-readmore)] transition-colors duration-300">
                          {name}
                        </h4>
                        <p className="text-[var(--color-description)] text-sm font-medium opacity-80">
                          {position}
                        </p>
                      </div>

                      {/* Testimonial Text */}
                      <div className="relative flex-grow flex items-center">
                        <p 
                          className="text-[var(--color-status)] leading-relaxed text-center italic text-base overflow-hidden"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 6,
                            WebkitBoxOrient: "vertical",
                            textOverflow: "ellipsis",
                          }}
                          title={speech}
                        >
                          "{speech}"
                        </p>
                      </div>

                      {/* Rating Stars */}
                      <div className="flex justify-center mt-6 gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="w-4 h-4 text-[var(--color-primary)] opacity-80 animate-pulse"
                            style={{ animationDelay: `${i * 0.1}s` }}
                          >
                            <svg fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12 animate-fade-in">
                  <div className="text-6xl text-gray-400/30 mb-4 animate-bounce">💬</div>
                  <p className="text-[var(--color-description)] text-lg">No testimonials available at the moment.</p>
                </div>
              )}
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={() => canGoNext && setStartIdx(startIdx + 1)}
            disabled={!canGoNext}
            aria-label="Next testimonials"
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 flex-shrink-0 flex items-center justify-center w-14 h-14 rounded-xl transition-all duration-300 shadow-lg ${
              canGoNext
                ? 'bg-[var(--color-readmore)] text-white hover:bg-opacity-90 hover:scale-105 hover:shadow-xl'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
            }`}
          >
            <HiChevronRight size={24} />
          </button>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden">
          {/* Navigation dots - mobile only */}
          <div className="flex justify-center mb-8">
            <div className="flex gap-2">
              {Array.from({ length: Math.ceil(testimonials.length / windowSize) }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setStartIdx(i * windowSize)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    Math.floor(startIdx / windowSize) === i 
                      ? 'bg-[var(--color-primary)] w-6 animate-pulse' 
                      : 'bg-[var(--color-description)] opacity-30'
                  }`}
                />
              ))}
            </div>
          </div>

          {visibleTestimonials.length > 0 ? (
            <>
              {/* Mobile Cards */}
              <div className="space-y-6 sm:space-y-8 mb-8">
                {visibleTestimonials.map(({ _id, name, position, speech, image }, index) => (
                  <div
                    key={_id}
                    className="group relative mx-auto max-w-md sm:max-w-lg bg-gradient-to-br from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-2xl border border-[rgba(255,255,255,0.1)] transition-all duration-500 hover:scale-105 hover:shadow-3xl animate-slide-up"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[var(--color-primary)]/5 to-[var(--color-readmore)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative z-10 text-center">
                      {/* Quote icon */}
                      <div className="absolute -top-2 -left-2 w-8 h-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center animate-pulse">
                        <span className="text-white text-lg font-bold">"</span>
                      </div>

                      <div className="relative mb-6 inline-block">
                        <img
                          src={image}
                          alt={name}
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-[var(--color-primary)] shadow-lg group-hover:border-[var(--color-readmore)] transition-all duration-300 group-hover:scale-110 mx-auto"
                          loading="lazy"
                        />
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[var(--color-readmore)] rounded-full flex items-center justify-center animate-bounce">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                      
                      <h4 className="font-bold text-[var(--color-primary)] text-lg sm:text-xl mb-1 group-hover:text-[var(--color-readmore)] transition-colors duration-300">
                        {name}
                      </h4>
                      <p className="text-[var(--color-description)] text-sm mb-6 font-medium opacity-80">
                        {position}
                      </p>
                      
                      <p
                        className="text-[var(--color-status)] italic leading-relaxed text-sm sm:text-base mb-6 overflow-hidden"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: "vertical",
                          textOverflow: "ellipsis",
                        }}
                        title={speech}
                      >
                        "{speech}"
                      </p>

                      {/* Rating Stars */}
                      <div className="flex justify-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="w-4 h-4 text-[var(--color-primary)] opacity-80 animate-pulse"
                            style={{ animationDelay: `${i * 0.1}s` }}
                          >
                            <svg fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile Navigation */}
              <div className="flex justify-between items-center px-4">
                <button
                  onClick={() => canGoPrev && setStartIdx(startIdx - 1)}
                  disabled={!canGoPrev}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    canGoPrev
                      ? 'bg-[var(--color-readmore)] text-white hover:bg-opacity-90'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                  }`}
                >
                  <HiChevronLeft size={18} />
                  <span className="text-sm font-medium">Previous</span>
                </button>

                <div className="text-[var(--color-description)] text-sm">
                  {startIdx + 1} of {testimonials.length}
                </div>

                <button
                  onClick={() => canGoNext && setStartIdx(startIdx + 1)}
                  disabled={!canGoNext}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                    canGoNext
                      ? 'bg-[var(--color-readmore)] text-white hover:bg-opacity-90'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed opacity-50'
                  }`}
                >
                  <span className="text-sm font-medium">Next</span>
                  <HiChevronRight size={18} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
              <div className="text-5xl sm:text-6xl text-gray-400/30 mb-4 animate-bounce">💬</div>
              <p className="text-center text-gray-500 text-base sm:text-lg">No testimonials available at the moment.</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
          opacity: 0;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
};

export default TestimonialsComponent;