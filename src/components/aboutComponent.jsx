import React from "react";

const AboutComponent = ({ scrollToId }) => {
  return (
    <section
      id="about"
      className="relative min-h-screen flex items-center py-24 px-4 md:px-8 overflow-hidden"
    >
      {/* Professional About Background */}
      <div
        className="absolute inset-0 z-[-20] bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `url('/about_bg.webp')`,
          filter: "brightness(0.3) contrast(1.1)",
        }}
      ></div>

      <div className="absolute inset-0 z-[-10] bg-[rgba(0,0,0,0.8)]"></div>

      <div className="absolute inset-0">
        <div className="absolute inset-0 z-[-10] bg-[rgba(0,0,0,0.8)] backdrop-blur-[20px]" />
        <div className="absolute top-16 right-1/4 w-20 h-20 bg-[var(--color-secheading)] opacity-10 rounded-full blur-xl animate-[pulse_3s_ease-in-out_infinite]"></div>
        <div
          className="absolute bottom-16 left-1/4 w-32 h-32 bg-[var(--color-accent)] opacity-12 rounded-full blur-2xl animate-[pulse_4s_ease-in-out_infinite]"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10 w-full">
        {/* Professional section header */}
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl font-bold mb-3
                          bg-gradient-to-r from-[var(--color-secheading)] via-[var(--color-primary)] to-[var(--color-readmore)] 
                          bg-clip-text text-transparent"
          >
            About Us
          </h2>
          <div className="flex items-center justify-center space-x-3">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[var(--color-primary)]"></div>
            <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-pulse"></div>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[var(--color-primary)]"></div>
          </div>
        </div>

        {/* Professional content grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Professional image container */}
          <div className="relative">
            <div className="relative group">
              {/* Main image container */}
              <div
                className="relative rounded-2xl overflow-hidden shadow-xl 
                                hover:shadow-[0_20px_40px_rgba(240,212,146,0.15)] 
                                transition-all duration-400 hover:scale-[1.03]"
              >
                <img
                  src="\aboutUS.webp"
                  alt="Leo Club Community Service"
                  className="w-full h-[350px] lg:h-[400px] object-cover group-hover:scale-110 transition-transform duration-600"
                />
                {/* Professional overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent"></div>
              </div>

              {/* Decorative frame */}
              <div
                className="absolute -inset-3 rounded-2xl border border-[var(--color-primary)]/20 -z-10
                                group-hover:border-[var(--color-primary)]/40 transition-colors duration-300"
              ></div>
            </div>
          </div>

          {/* Professional content */}
          <div className="space-y-6">
            {/* Professional text content */}
            <div className="space-y-5">
              <div className="prose prose-invert max-w-none">
                <p className="text-white/90 leading-relaxed text-base">
                  The Leo Club of Cinnamon Gardens, established on 14th July
                  2021, is a youth-led social service organization under{" "}
                  <span className="text-[var(--color-primary)] font-semibold">
                    Leo District 306 D7
                  </span>
                  , sponsored by the{" "}
                  <span className="text-[var(--color-secheading)] font-semibold">
                    Lions Club of Udahamulla New Century
                  </span>
                  .
                </p>
                <br />
                <p className="text-white/80 leading-relaxed text-sm">
                  Guided by the motto{" "}
                  <em className="text-[var(--color-readmore)]">
                    "Committed for a Better Community"
                  </em>
                  , we bring together passionate young leaders to serve society
                  through projects in{" "}
                  <span className="font-semibold">
                    healthcare, education, technology, literacy,
                  </span>{" "}
                  and <span className="font-semibold">personal development</span>
                  .
                </p>
                <br />
                <p className="text-white/75 leading-relaxed text-sm">
                  With{" "}
                  <span className="text-[var(--color-primary)] font-semibold">
                    teamwork, leadership,
                  </span>{" "}
                  and{" "}
                  <span className="text-[var(--color-secheading)] font-semibold">
                    service
                  </span>{" "}
                  at our core, we strive to create lasting change and inspire
                  the next generation of youth to make a difference.
                </p>
              </div>

              {/* Professional stats or highlights */}
              <div className="grid grid-cols-3 gap-4 py-4 border-y border-white/10">
                <div className="text-center">
                  <div className="text-xl font-bold text-[var(--color-primary)]">
                    100+
                  </div>
                  <div className="text-xs text-white/60 uppercase tracking-wide">
                    Members
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-[var(--color-secheading)]">
                    50+
                  </div>
                  <div className="text-xs text-white/60 uppercase tracking-wide">
                    Projects
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-[var(--color-readmore)]">
                    2023
                  </div>
                  <div className="text-xs text-white/60 uppercase tracking-wide">
                    Founded
                  </div>
                </div>
              </div>
            </div>

            {/* Professional action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3">
              <button
                onClick={() => scrollToId("projects")}
                className="group relative px-6 py-3 bg-gradient-to-r from-[var(--color-secheading)] to-[var(--color-primary)]
                              text-[var(--color-accent)] font-semibold rounded-lg shadow-md
                              hover:shadow-[0_8px_30px_rgba(229,179,29,0.25)] hover:scale-105 
                              transition-all duration-300 overflow-hidden text-sm"
              >
                <span className="relative z-10">View Our Projects</span>
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secheading)] 
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              <button
                onClick={() => scrollToId("newsletter")}
                className="px-6 py-3 border border-white/20 text-white font-medium rounded-lg
                              backdrop-blur-sm hover:bg-white/10 hover:border-[var(--color-primary)]/40
                              transition-all duration-300 text-sm"
              >
                Read Newsletter
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutComponent;
