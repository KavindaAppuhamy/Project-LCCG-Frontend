import React, { useEffect, useState } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const ProjectsSection = ({ modalProject, setModalProject }) => {
  const [highlightProject, setHighlightProject] = useState([]);
  const [relatedProjects, setRelatedProjects] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/project/featured-and-related`)
      .then((res) => res.json())
      .then((data) => {
        setHighlightProject(data.highlightProject);
        setRelatedProjects(data.relatedProjects);
      })
      .catch((err) => console.error("Failed to load projects", err));
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (modalProject) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px'; // Prevent layout shift
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [modalProject]);

  const handleCloseModal = (e) => {
    if (e.target.id === "modalBackdrop") {
      setModalProject(null);
    }
  };

  return (
    <section
      id="projects"
      className="relative py-16 sm:py-16 lg:py-5 px-4 sm:px-6 lg:px-8  text-[var(--color-heading)] select-none "
    >
      {/* Enhanced Starfield animation */}
      <Particles
        id="projects-particles"
        init={async (main) => await loadFull(main)}
        options={{
          background: { color: "transparent" },
          fpsLimit: 60,
          particles: {
            number: { value: 120, density: { enable: true, area: 800 } },
            color: { value: ["#F0D492", "#FFE5A3", "#D4AF37"] },
            shape: { 
              type: ["star", "circle"],
              options: {
                star: { sides: 5 }
              }
            },
            opacity: {
              value: 0.6,
              random: { enable: true, minimumValue: 0.2 },
              anim: { 
                enable: true, 
                speed: 0.8, 
                opacity_min: 0.1, 
                sync: false 
              },
            },
            size: {
              value: 2.5,
              random: { enable: true, minimumValue: 0.8 },
              anim: { 
                enable: true, 
                speed: 1.5, 
                size_min: 0.5, 
                sync: false 
              },
            },
            move: {
              enable: true,
              speed: 0.5,
              direction: "none",
              random: true,
              straight: false,
              outModes: { default: "out" },
              attract: { enable: false },
            },
          },
          interactivity: {
            detectOn: "canvas",
            events: {
              onHover: {
                enable: true,
                mode: "grab"
              },
              resize: true
            },
            modes: {
              grab: {
                distance: 140,
                links: {
                  opacity: 0.2,
                  color: "#F0D492"
                }
              }
            }
          },
          detectRetina: true,
        }}
        className="absolute inset-0 -z-10"
      />

      {/* Gradient overlay for depth */}
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced Title */}
        <div className="text-center mb-16 animate-[professionalSlideIn_1s_ease-out]">
                      <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4
                                    bg-gradient-to-r from-[var(--color-secheading)] via-[var(--color-primary)] to-[var(--color-readmore)] 
                                    bg-clip-text text-transparent">
                        Our Projects
                      </h2>
                      <div className="flex items-center justify-center space-x-4">
                        <div className="h-px w-20 bg-gradient-to-r from-transparent to-[var(--color-primary)]"></div>
                        <div className="w-3 h-3 bg-[var(--color-primary)] rounded-full animate-pulse"></div>
                        <div className="h-px w-20 bg-gradient-to-l from-transparent to-[var(--color-primary)]"></div>
                      </div>
                      <p className="text-[var(--color-description)] mt-4 text-base sm:text-lg max-w-2xl mx-auto px-4">
                        Discover our innovative solutions that are shaping the future
                      </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Enhanced Highlight project */}
          {highlightProject ? (
            <article
              tabIndex={0}
              aria-label={`Featured project: ${highlightProject.name}`}
              className="lg:col-span-2 group relative bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 hover:scale-[1.01] sm:hover:scale-[1.02] hover:shadow-[0_25px_50px_rgba(240,212,146,0.15)] cursor-pointer transform-gpu"
              style={{ maxHeight: "none" }}
              onClick={() => setModalProject(highlightProject)}
            >
              {/* Glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-[#F0D492] to-[var(--color-secheading)] rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-sm"></div>
              
              <div className="relative">
                <div className="overflow-hidden">
                  <img
                    src={highlightProject.image}
                    alt={`Featured project: ${highlightProject.name}`}
                    className="w-full h-48 sm:h-64 lg:h-96 object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Gradient overlay on image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                </div>
                
                <div className="p-4 sm:p-6 lg:p-8">
                  {/* Enhanced status badge */}
                  <div className="flex items-center mb-3 sm:mb-4">
                    <span
                      className={`inline-flex items-center text-xs font-bold uppercase tracking-wider px-3 sm:px-4 py-1.5 sm:py-2 rounded-full ${
                        highlightProject.status === "upcoming"
                          ? "text-blue-300 bg-blue-500/20 border border-blue-400/30"
                          : highlightProject.status === "done"
                          ? "text-green-300 bg-green-500/20 border border-green-400/30"
                          : "text-gray-300 bg-gray-500/20 border border-gray-400/30"
                      }`}
                    >
                      <div className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full mr-2 ${
                        highlightProject.status === "upcoming" ? "bg-blue-400" :
                        highlightProject.status === "done" ? "bg-green-400" : "bg-gray-400"
                      }`}></div>
                      {highlightProject.status}
                    </span>
                  </div>
                  
                  <h4 className="text-lg sm:text-xl lg:text-2xl font-bold leading-tight mb-3 sm:mb-4 text-[var(--color-heading)] group-hover:text-[#F0D492] transition-colors duration-300">
                    {highlightProject.name}
                  </h4>
                  
                  <p className="text-[var(--color-description)] text-sm sm:text-base leading-relaxed line-clamp-1 mb-4 sm:mb-6">
                    {highlightProject.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <button className="inline-flex items-center text-[var(--color-readmore)] font-bold text-sm bg-gradient-to-r from-[#F0D492]/10 to-transparent px-3 sm:px-4 py-2 rounded-lg hover:from-[#F0D492]/20 transition-all duration-300 group/btn">
                      <span className="group-hover/btn:mr-3 transition-all duration-300">READ MORE</span>
                      <span className="ml-2 transform group-hover/btn:translate-x-1 transition-transform duration-300">→</span>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ) : (
            <div className="lg:col-span-2 flex items-center justify-center text-gray-500 bg-white/5 rounded-xl sm:rounded-2xl border border-white/10 backdrop-blur-xl min-h-[300px] sm:min-h-[400px]">
              <div className="text-center px-4">
                <div className="animate-pulse text-3xl sm:text-4xl mb-4">⚡</div>
                <p className="text-sm sm:text-base">No Highlight Project Available</p>
              </div>
            </div>
          )}

          {/* Enhanced Related projects */}
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* <h5 className="text-lg sm:text-xl font-semibold text-[var(--color-secheading)] mb-2">
              Related Projects
            </h5> */}
            {relatedProjects.length > 0 ? (
              relatedProjects.map((post, index) => (
                <article
                  key={post._id}
                  tabIndex={0}
                  aria-label={`Project: ${post.name} (${post.status})`}
                  className="group flex gap-3 sm:gap-4 items-start bg-gradient-to-br from-white/8 via-white/4 to-white/8 backdrop-blur-xl border border-white/10 rounded-lg sm:rounded-xl p-4 sm:p-5 shadow-lg transition-all duration-400 hover:scale-[1.02] sm:hover:scale-[1.03] hover:shadow-[0_15px_35px_rgba(240,212,146,0.1)] cursor-pointer transform-gpu"
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.6s ease-out forwards'
                  }}
                  onClick={() => setModalProject(post)}
                >
                  <div className="relative overflow-hidden rounded-lg flex-shrink-0">
                    <img
                      src={post.image}
                      alt={`Project: ${post.name}`}
                      className="w-20 sm:w-24 h-16 sm:h-20 object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <span
                      className={`inline-flex items-center text-xs font-medium uppercase tracking-wider mb-2 px-2 sm:px-3 py-1 rounded-full ${
                        post.status === "upcoming"
                          ? "text-blue-300 bg-blue-500/15 border border-blue-400/20"
                          : post.status === "done"
                          ? "text-green-300 bg-green-500/15 border border-green-400/20"
                          : "text-gray-300 bg-gray-500/15 border border-gray-400/20"
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                        post.status === "upcoming" ? "bg-blue-400" :
                        post.status === "done" ? "bg-green-400" : "bg-gray-400"
                      }`}></div>
                      {post.status}
                    </span>
                    
                    <h6 className="text-sm font-semibold leading-snug mb-1 sm:mb-2 text-[var(--color-heading)] group-hover:text-[#F0D492] transition-colors duration-300 truncate">
                      {post.name}
                    </h6>
                    
                    <p className="text-[var(--color-description)] text-xs leading-relaxed line-clamp-2">
                      {post.description}
                    </p>
                  </div>
                </article>
              ))
            ) : (
              <div className="text-gray-500 bg-white/5 rounded-lg sm:rounded-xl border border-white/10 backdrop-blur-xl p-4 sm:p-6 text-center">
                <div className="text-xl sm:text-2xl mb-2">📋</div>
                <p className="text-sm sm:text-base">No Related Projects Available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Modal */}
      {modalProject && (
        <div
          id="modalBackdrop"
          onClick={handleCloseModal}
          className="fixed inset-0 bg-black/60 backdrop-blur-md flex justify-center items-center z-50 p-4 animate-fadeIn overflow-y-auto"
        >
          <div className="bg-gradient-to-br from-[var(--color-bg)] via-[var(--color-bg)] to-black/20 max-w-4xl w-full rounded-xl sm:rounded-2xl shadow-2xl my-8 relative border border-white/10 backdrop-blur-xl animate-scaleIn">
            <button
              onClick={() => setModalProject(null)}
              className="absolute top-4 sm:top-6 right-4 sm:right-6 z-10 text-gray-400 hover:text-white bg-red-600/10 hover:bg-red-600/20 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold transition-all duration-300 backdrop-blur-sm"
              aria-label="Close modal"
            >
              ×
            </button>

            <div className="relative">
              <img
                src={modalProject.image}
                alt={modalProject.name}
                className="w-full h-48 sm:h-60 lg:h-72 object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            </div>

            <div className="p-4 sm:p-6 lg:p-8">
              <div className="flex items-center mb-3 sm:mb-4">
                <span
                  className={`inline-flex items-center text-xs sm:text-sm font-bold uppercase tracking-wider px-3 sm:px-4 py-1.5 sm:py-2 rounded-full ${
                    modalProject.status === "upcoming"
                      ? "text-blue-300 bg-blue-500/20 border border-blue-400/30"
                      : modalProject.status === "done"
                      ? "text-green-300 bg-green-500/20 border border-green-400/30"
                      : "text-gray-300 bg-gray-500/20 border border-gray-400/30"
                  }`}
                >
                  <div className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full mr-2 ${
                    modalProject.status === "upcoming" ? "bg-blue-400" :
                    modalProject.status === "done" ? "bg-green-400" : "bg-gray-400"
                  }`}></div>
                  {modalProject.status}
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 text-[var(--color-heading)]">
                {modalProject.name}
              </h3>
              
              <p className="text-[var(--color-description)] leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base lg:text-lg whitespace-pre-wrap">
                {modalProject.description}
              </p>

              {/* Enhanced project details */}
              {(modalProject.date || modalProject.venue || modalProject.time || modalProject.organizer) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-sm bg-white/5 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-white/10">
                  {modalProject.date && (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[#F0D492]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-[#F0D492]">📅</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-gray-400 text-xs uppercase tracking-wide">Date</p>
                        <p className="font-medium text-[var(--color-heading)] truncate">
                          {new Date(modalProject.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {modalProject.venue && (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[#F0D492]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-[#F0D492]">📍</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-gray-400 text-xs uppercase tracking-wide">Venue</p>
                        <p className="font-medium text-[var(--color-heading)] truncate">{modalProject.venue}</p>
                      </div>
                    </div>
                  )}
                  
                  {modalProject.time && (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[#F0D492]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-[#F0D492]">⏰</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-gray-400 text-xs uppercase tracking-wide">Time</p>
                        <p className="font-medium text-[var(--color-heading)] truncate">{modalProject.time}</p>
                      </div>
                    </div>
                  )}
                  
                  {modalProject.organizer && (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-[#F0D492]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-[#F0D492]">👥</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-gray-400 text-xs uppercase tracking-wide">Organizer</p>
                        <p className="font-medium text-[var(--color-heading)] truncate">{modalProject.organizer}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
      `}</style>
    </section>
  );
};

export default ProjectsSection;