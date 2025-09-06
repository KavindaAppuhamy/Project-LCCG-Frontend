import React, { useEffect, useState } from "react";
import Particles from "react-tsparticles";

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

  useEffect(() => {
    if (modalProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [modalProject]);

  const handleCloseModal = (e) => {
    if (e.target.id === "modalBackdrop") {
      setModalProject(null);
    }
  };

  const particlesInit = async (engine) => {
    try {
      // Try to load the full version
      await loadFull(engine);
    } catch (error) {
      console.warn("loadFull failed, trying alternative approach:", error);
      try {
        // Fallback for older versions
        if (typeof engine.loadFull === 'function') {
          await engine.loadFull();
        }
      } catch (fallbackError) {
        console.error("Both initialization methods failed:", fallbackError);
      }
    }
  };

  return (
    <>
      {/* PROJECTS SECTION - Professional & Elegant */}
      <section id="projects" className="relative overflow-hidden py-12 sm:py-16 md:py-20 min-h-[100vh] sm:min-h-[100vh] flex flex-col justify-center">
        {/* Projects Background */}
        <div
          className="absolute inset-0 z-[-20] bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1920&q=80')`,
            filter: "brightness(0.5) contrast(1.1)",
          }}
        ></div>
        {/* Dark overlay */}
        <div className="absolute inset-0 z-[-10] bg-[rgba(0,0,0,0.7)]"></div>

        {/* Enhanced ambient effects combining both designs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-24 w-32 h-32 bg-gradient-to-br from-[var(--color-primary)]/8 to-transparent 
                            rounded-full blur-3xl animate-[elegantPulse_6s_ease-in-out_infinite]"></div>
          <div
            className="absolute bottom-24 left-20 w-48 h-48 bg-gradient-to-tr from-[var(--color-secheading)]/6 to-transparent 
                            rounded-full blur-3xl animate-[elegantPulse_8s_ease-in-out_infinite]"
            style={{ animationDelay: "3s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-br from-[var(--color-readmore)]/10 to-transparent 
                            rounded-2xl rotate-45 blur-2xl animate-[elegantRotate_20s_linear_infinite]"
            style={{ animationDelay: "1s" }}
          ></div>

          <div className="absolute top-1/4 left-10 w-40 h-40 bg-[var(--color-readmore)] opacity-8 rounded-full blur-3xl 
                            animate-[pulse_5s_ease-in-out_infinite]"></div>
          <div
            className="absolute bottom-1/4 right-10 w-32 h-32 bg-[var(--color-primary)] opacity-12 rounded-full blur-2xl 
                            animate-[pulse_4s_ease-in-out_infinite]"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 py-12 px-4 sm:px-6 text-[var(--color-heading)] select-none">
          {/* Particles animation */}
          <Particles
            id="projects-particles"
            init={particlesInit}
            options={{
              background: { color: "transparent" },
              fpsLimit: 60,
              particles: {
                number: { value: 80, density: { enable: true, area: 800 } },
                color: { value: ["#F0D492", "#FFE5A3", "#D4AF37"] },
                shape: { type: ["star", "circle"], options: { star: { sides: 5 } } },
                opacity: {
                  value: 0.6,
                  random: { enable: true, minimumValue: 0.2 },
                  anim: { enable: true, speed: 0.8, opacity_min: 0.1, sync: false },
                },
                size: {
                  value: 2,
                  random: { enable: true, minimumValue: 0.8 },
                  anim: { enable: true, speed: 1.5, size_min: 0.5, sync: false },
                },
                move: {
                  enable: true,
                  speed: 0.4,
                  direction: "none",
                  random: true,
                  straight: false,
                  outModes: { default: "out" },
                },
              },
              interactivity: {
                detectOn: "canvas",
                events: {
                  onHover: { enable: true, mode: "grab" },
                  resize: true,
                },
                modes: {
                  grab: { distance: 120, links: { opacity: 0.2, color: "#F0D492" } },
                },
              },
              detectRetina: true,
            }}
            className="absolute inset-0 -z-10"
          />

          <div className="max-w-6xl mx-auto relative z-10">
            {/* Title */}
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4
                            bg-gradient-to-r from-[var(--color-secheading)] via-[var(--color-primary)] to-[var(--color-readmore)] 
                            bg-clip-text text-transparent">
                Our Projects
              </h2>
              <div className="flex items-center justify-center space-x-3">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-[var(--color-primary)]"></div>
                <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-pulse"></div>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-[var(--color-primary)]"></div>
              </div>
              <p className="text-[var(--color-description)] mt-3 text-sm max-w-xl mx-auto">
                Discover our innovative solutions that are shaping the future
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Highlight project */}
              {highlightProject ? (
                <article
                  tabIndex={0}
                  aria-label={`Featured project: ${highlightProject.name}`}
                  className="lg:col-span-2 group relative bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-xl transition-all duration-400 hover:scale-[1.01] hover:shadow-[0_20px_40px_rgba(240,212,146,0.15)] cursor-pointer transform-gpu"
                  onClick={() => setModalProject(highlightProject)}
                >
                  <div className="relative">
                    <div className="overflow-hidden">
                      <img
                        src={highlightProject.image}
                        alt={`Featured project: ${highlightProject.name}`}
                        className="w-full h-40 sm:h-80 object-cover transition-transform duration-600 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    </div>
                    
                    <div className="p-4 sm:p-5">
                      <div className="flex items-center mb-2">
                        <span
                          className={`inline-flex items-center text-xs font-bold uppercase px-2.5 py-1 rounded-full ${
                            highlightProject.status === "upcoming"
                              ? "text-blue-300 bg-blue-500/20 border border-blue-400/30"
                              : highlightProject.status === "done"
                              ? "text-green-300 bg-green-500/20 border border-green-400/30"
                              : "text-gray-300 bg-gray-500/20 border border-gray-400/30"
                          }`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            highlightProject.status === "upcoming" ? "bg-blue-400" :
                            highlightProject.status === "done" ? "bg-green-400" : "bg-gray-400"
                          }`}></div>
                          {highlightProject.status}
                        </span>
                      </div>
                      
                      <h4 className="text-lg font-bold leading-tight mb-2 text-[var(--color-heading)] group-hover:text-[#F0D492] transition-colors duration-300">
                        {highlightProject.name}
                      </h4>
                      
                      <p className="text-[var(--color-description)] text-sm leading-relaxed line-clamp-1 mb-3">
                        {highlightProject.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <button className="inline-flex items-center text-[var(--color-readmore)] font-medium text-xs bg-gradient-to-r from-[#F0D492]/10 to-transparent px-3 py-1.5 rounded-md hover:from-[#F0D492]/20 transition-all duration-300 group/btn">
                          <span className="group-hover/btn:mr-2 transition-all duration-300">READ MORE</span>
                          <span className="ml-1 transform group-hover/btn:translate-x-1 transition-transform duration-300">→</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ) : (
                <div className="lg:col-span-2 flex items-center justify-center text-gray-500 bg-white/5 rounded-xl border border-white/10 backdrop-blur-xl min-h-[250px]">
                  <div className="text-center px-4">
                    <div className="animate-pulse text-2xl mb-3">⚡</div>
                    <p className="text-sm">No Highlight Project Available</p>
                  </div>
                </div>
              )}

              {/* Related projects */}
              <div className="flex flex-col gap-3">
                {relatedProjects.length > 0 ? (
                  relatedProjects.map((post, index) => (
                    <article
                      key={post._id}
                      tabIndex={0}
                      aria-label={`Project: ${post.name} (${post.status})`}
                      className="group flex gap-3 items-start bg-gradient-to-br from-white/8 via-white/4 to-white/8 backdrop-blur-xl border border-white/10 rounded-lg p-3 shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_10px_25px_rgba(240,212,146,0.1)] cursor-pointer transform-gpu"
                      onClick={() => setModalProject(post)}
                    >
                      <div className="relative overflow-hidden rounded flex-shrink-0">
                        <img
                          src={post.image}
                          alt={`Project: ${post.name}`}
                          className="w-16 h-12 object-cover transition-transform duration-400 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <span
                          className={`inline-flex items-center text-xs font-medium uppercase mb-1 px-2 py-0.5 rounded-full ${
                            post.status === "upcoming"
                              ? "text-blue-300 bg-blue-500/15 border border-blue-400/20"
                              : post.status === "done"
                              ? "text-green-300 bg-green-500/15 border border-green-400/20"
                              : "text-gray-300 bg-gray-500/15 border border-gray-400/20"
                          }`}
                        >
                          <div className={`w-1.5 h-1.5 rounded-full mr-1 ${
                            post.status === "upcoming" ? "bg-blue-400" :
                            post.status === "done" ? "bg-green-400" : "bg-gray-400"
                          }`}></div>
                          {post.status}
                        </span>
                        
                        <h6 className="text-sm font-semibold leading-snug mb-1 text-[var(--color-heading)] group-hover:text-[#F0D492] transition-colors duration-300 truncate">
                          {post.name}
                        </h6>
                        
                        <p className="text-[var(--color-description)] text-xs leading-relaxed line-clamp-2">
                          {post.description}
                        </p>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="text-gray-500 bg-white/5 rounded-lg border border-white/10 backdrop-blur-xl p-4 text-center">
                    <div className="text-lg mb-1">📋</div>
                    <p className="text-xs">No Related Projects Available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Modal */}
          {modalProject && (
            <div
              id="modalBackdrop"
              onClick={handleCloseModal}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-3 animate-fadeIn overflow-y-auto"
            >
              <div className="bg-gradient-to-br from-[var(--color-bg)] via-[var(--color-bg)] to-black/20 max-w-3xl w-full rounded-xl shadow-xl my-6 relative border border-white/10 backdrop-blur-xl animate-scaleIn">
                <button
                  onClick={() => setModalProject(null)}
                  className="absolute top-3 right-3 z-10 text-gray-400 hover:text-white bg-red-600/10 hover:bg-red-600/20 w-7 h-7 rounded-full flex items-center justify-center text-base font-bold transition-all duration-300 backdrop-blur-sm"
                  aria-label="Close modal"
                >
                  ×
                </button>

                <div className="relative">
                  <img
                    src={modalProject.image}
                    alt={modalProject.name}
                    className="w-full h-40 sm:h-52 object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                </div>

                <div className="p-4 sm:p-5">
                  <div className="flex items-center mb-2">
                    <span
                      className={`inline-flex items-center text-xs font-bold uppercase px-2.5 py-1 rounded-full ${
                        modalProject.status === "upcoming"
                          ? "text-blue-300 bg-blue-500/20 border border-blue-400/30"
                          : modalProject.status === "done"
                          ? "text-green-300 bg-green-500/20 border border-green-400/30"
                          : "text-gray-300 bg-gray-500/20 border border-gray-400/30"
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                        modalProject.status === "upcoming" ? "bg-blue-400" :
                        modalProject.status === "done" ? "bg-green-400" : "bg-gray-400"
                      }`}></div>
                      {modalProject.status}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold mb-2 text-[var(--color-heading)]">
                    {modalProject.name}
                  </h3>
                  
                  <p className="text-[var(--color-description)] leading-relaxed mb-4 text-sm whitespace-pre-wrap">
                    {modalProject.description}
                  </p>

                  {/* Project details */}
                  {(modalProject.date || modalProject.venue || modalProject.time || modalProject.organizer) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white/5 rounded-lg p-3 border border-white/10">
                      {modalProject.date && (
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-[#F0D492]/20 rounded flex items-center justify-center flex-shrink-0">
                            <span className="text-[#F0D492] text-xs">📅</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-gray-400 text-xs uppercase">Date</p>
                            <p className="font-medium text-[var(--color-heading)] truncate">
                              {new Date(modalProject.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {modalProject.venue && (
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-[#F0D492]/20 rounded flex items-center justify-center flex-shrink-0">
                            <span className="text-[#F0D492] text-xs">📍</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-gray-400 text-xs uppercase">Venue</p>
                            <p className="font-medium text-[var(--color-heading)] truncate">{modalProject.venue}</p>
                          </div>
                        </div>
                      )}
                      
                      {modalProject.time && (
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-[#F0D492]/20 rounded flex items-center justify-center flex-shrink-0">
                            <span className="text-[#F0D492] text-xs">⏰</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-gray-400 text-xs uppercase">Time</p>
                            <p className="font-medium text-[var(--color-heading)] truncate">{modalProject.time}</p>
                          </div>
                        </div>
                      )}
                      
                      {modalProject.organizer && (
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-[#F0D492]/20 rounded flex items-center justify-center flex-shrink-0">
                            <span className="text-[#F0D492] text-xs">👥</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-gray-400 text-xs uppercase">Organizer</p>
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

          <style jsx="true">{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
            
            @keyframes scaleIn {
              from {
                opacity: 0;
                transform: scale(0.95);
              }
              to {
                opacity: 1;
                transform: scale(1);
              }
            }
            
            .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
            .animate-scaleIn { animation: scaleIn 0.2s ease-out; }
          `}</style>
        </div>
      </section>
    </>
  );
};

export default ProjectsSection;