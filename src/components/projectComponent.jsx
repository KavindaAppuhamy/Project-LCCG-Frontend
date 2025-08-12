import React, { useEffect, useState } from "react";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const ProjectsSection = () => {
  const [highlightProject, setHighlightProject] = useState(null);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [modalProject, setModalProject] = useState(null); // Track project in modal

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/project/featured-and-related`)
      .then((res) => res.json())
      .then((data) => {
        setHighlightProject(data.highlightProject);
        setRelatedProjects(data.relatedProjects);
      })
      .catch((err) => console.error("Failed to load projects", err));
  }, []);

  // Close modal on backdrop click
  const handleCloseModal = (e) => {
    if (e.target.id === "modalBackdrop") {
      setModalProject(null);
    }
  };

  return (
    <section
      id="projects"
      className="relative py-16 px-6 bg-[var(--color-bg)] text-[var(--color-heading)] select-none"
    >
      {/* Starfield animation */}
      <Particles
        id="projects-particles"
        init={async (main) => await loadFull(main)}
        options={{
          background: { color: "transparent" },
          fpsLimit: 60,
          particles: {
            number: { value: 80, density: { enable: true, area: 900 } },
            color: { value: "#F0D492" },
            shape: { type: "star" },
            opacity: {
              value: 0.5,
              random: { enable: true, minimumValue: 0.1 },
              anim: { enable: false },
            },
            size: {
              value: 2,
              random: { enable: true, minimumValue: 1 },
              anim: { enable: false },
            },
            move: {
              enable: true,
              speed: 0.3,
              direction: "none",
              random: true,
              straight: false,
              outModes: { default: "out" },
              attract: { enable: false },
            },
          },
          detectRetina: true,
        }}
        className="absolute inset-0 -z-10"
      />

      <div className="max-w-7xl mx-auto">
        <h3 className="text-3xl font-bold mb-8 text-[var(--color-secheading)]">
          Our Projects
        </h3>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Left: Highlight project */}
          {highlightProject ? (
            <article
              tabIndex={0}
              aria-label={`Featured project: ${highlightProject.name}`}
              className="md:col-span-2 bg-[rgba(255,255,255,0.05)] backdrop-blur-md rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-[1.02] hover:shadow-2xl cursor-pointer"
              style={{ maxHeight: "560px" }}
              onClick={() => setModalProject(highlightProject)}
            >
              <img
                src={highlightProject.image}
                alt={`Featured project: ${highlightProject.name}`}
                className="w-full h-82 object-cover"
                loading="lazy"
              />
              <div className="p-6 overflow-hidden">
                <p
                  className={`inline-block text-xs uppercase tracking-wider mb-2 font-medium ${
                    highlightProject.status === "upcoming"
                      ? "text-blue-500 bg-blue-100 px-3 py-0.5 rounded"
                      : highlightProject.status === "done"
                      ? "text-green-600 bg-green-100 px-3 py-0.5 rounded"
                      : "text-gray-400 bg-gray-100 px-3 py-0.5 rounded"
                  }`}
                >
                  {highlightProject.status}
                </p>
                <h4 className="text-xl font-bold leading-snug truncate">
                  {highlightProject.name}
                </h4>
                <p className="text-[var(--color-description)] mt-3 text-sm leading-relaxed line-clamp-3">
                  {highlightProject.description}
                </p>
                <div className="mt-6">
                  <a
                    href="#"
                    className="text-[var(--color-readmore)] font-bold text-sm inline-flex items-center hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--color-readmore)] rounded"
                    tabIndex={0}
                  >
                    READ MORE <span className="ml-2">→</span>
                  </a>
                </div>
              </div>
            </article>
          ) : (
            <div className="md:col-span-2 flex items-center justify-center text-gray-500">
              No Highlight Project Available
            </div>
          )}

          {/* Right: Related projects (max 4) */}
          <div className="flex flex-col gap-6">
            {relatedProjects.length > 0 ? (
              relatedProjects.map((post) => (
                <article
                  key={post._id}
                  tabIndex={0}
                  aria-label={`Project: ${post.name} (${post.status})`}
                  className="flex gap-4 items-start bg-[rgba(255,255,255,0.05)] backdrop-blur-md rounded-lg p-4 shadow-md transition-transform hover:scale-[1.05] hover:shadow-xl cursor-pointer"
                  onClick={() => setModalProject(post)}
                >
                  <img
                    src={post.image}
                    alt={`Project: ${post.name}`}
                    className="w-28 h-20 object-cover rounded"
                    loading="lazy"
                  />
                  <div>
                    <p
                      className={`inline-block text-xs uppercase font-medium mb-1 tracking-wider ${
                        post.status === "upcoming"
                          ? "text-blue-500 bg-blue-100 px-3 py-0.5 rounded"
                          : post.status === "done"
                          ? "text-green-600 bg-green-100 px-3 py-0.5 rounded"
                          : "text-gray-400 bg-gray-100 px-3 py-0.5 rounded"
                      }`}
                    >
                      {post.status}
                    </p>
                    <h5 className="text-sm font-semibold leading-snug truncate">
                      {post.name}
                    </h5>
                    <p className="text-[var(--color-description)] mt-1 text-sm line-clamp-3">
                      {post.description}
                    </p>
                  </div>
                </article>
              ))
            ) : (
              <div className="text-gray-500">No Related Projects Available</div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Popup */}
      {modalProject && (
<div
  id="modalBackdrop"
  onClick={handleCloseModal}
  className="fixed inset-0 bg-transparent backdrop-blur-sm flex justify-center items-center z-50 p-4"
>
          <div className="bg-[var(--color-bg)] max-w-3xl w-full rounded-lg shadow-xl overflow-auto max-h-[90vh] p-6 relative">
            <button
              onClick={() => setModalProject(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
              aria-label="Close modal"
            >
              &times;
            </button>

            <img
              src={modalProject.image}
              alt={modalProject.name}
              className="w-full h-60 object-cover rounded mb-4"
              loading="lazy"
            />
            <p
              className={`inline-block text-xs uppercase tracking-wider mb-2 font-medium ${
                modalProject.status === "upcoming"
                  ? "text-blue-500 bg-blue-100 px-3 py-0.5 rounded"
                  : modalProject.status === "done"
                  ? "text-green-600 bg-green-100 px-3 py-0.5 rounded"
                  : "text-gray-400 bg-gray-100 px-3 py-0.5 rounded"
              }`}
            >
              {modalProject.status}
            </p>
            <h3 className="text-2xl font-bold mb-2">{modalProject.name}</h3>
            <p className="text-[var(--color-description)] leading-relaxed mb-4 whitespace-pre-wrap">
              {modalProject.description}
            </p>

            {/* You can add more details here, e.g. date, venue, time, organizer */}
            <div className="text-sm text-gray-400 space-y-1">
              {modalProject.date && (
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(modalProject.date).toLocaleDateString()}
                </p>
              )}
              {modalProject.venue && (
                <p>
                  <strong>Venue:</strong> {modalProject.venue}
                </p>
              )}
              {modalProject.time && (
                <p>
                  <strong>Time:</strong> {modalProject.time}
                </p>
              )}
              {modalProject.organizer && (
                <p>
                  <strong>Organizer:</strong> {modalProject.organizer}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProjectsSection;
