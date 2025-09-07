import { Linkedin, Mail, Phone } from "lucide-react";
import { useState } from "react";

export default function ExcomSection() {
  const [showAll, setShowAll] = useState(false);

  // Sample data for demonstration - replace with your actual data
  const excomMembers = [
    {
      photo: "/1_Pasan_mendis.webp",
      name: "Leo Pasan Mendis",
      position: "President",
      linkedin: "www.linkedin.com/in/pasan-mendis",
      email: "mendispasan@gmail.com",
      phone: "0715301583",
    },
    {
      photo: "/2_Hasanka.webp",
      name: "Leo Hasanka Lakshan",
      position: "Immediate Past President",
      linkedin: "www.linkedin.com/in/hasanka-lakshan",
      email: "hasankalakshan.me@gmail.com",
      phone: "0716287379",
    },
    {
      photo: "/3_Hirusha.webp",
      name: "Leo Hirusha Kumaranayake",
      position: "1st Vice President",
      linkedin: "https://lk.linkedin.com/in/hirusha-kumaranayake-363346325",
      email: "int.hirusha.ictc@gmail.con",
      phone: "0714985239",
    },
    {
      photo: "/4_Sheron.webp",
      name: "Leo Sheron Deeshan",
      position: "2nd Vice President",
      linkedin: "https://www.linkedin.com/in/sheron-deeshan",
      email: "Sheron.deeshan@gmail.com",
      phone: "0762623505",
    },
    {
      photo: "/5_Dihan_Masinghe.webp",
      name: "Leo Dihan Masinghe",
      position: "Secretary",
      linkedin: "https://www.linkedin.com/in/dihan-masinghe-8a91442b5?",
      email: "dihanhansaja7@gmail.com",
      phone: "0719348166",
    },
    {
      photo: "/6_Lasath.webp",
      name: "Leo Lasath Gunawardhana",
      position: "Membership Chairperson",
      linkedin: "https://www.linkedin.com/in/lasath-poojitha-gunawardhana-7b7496326?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
      email: "lasathpoojithagunawardhana@gmail.com",
      phone: "0773834414",
    },
    {
      photo: "/7_Vethara_jayaweera.webp",
      name: "Leo Vethara Jayaweera",
      position: "Assistant Secretary",
      linkedin: "https://lk.linkedin.com/in/vethara-jayaweera-67141b381",
      email: "jayaweerakithnuli@gmail.com",
      phone: "0713428932",
    },
    {
      photo: "/8_Pathum.webp",
      name: "Leo Pathum Harshana",
      position: "Assistant Treasurer",
      linkedin: "https://www.linkedin.com/in/pathum-harshana-0390982b3",
      email: "pathum3893@gmail.com",
      phone: "0718779957",
    },
    {
      photo: "/9_Pinidi.webp",
      name: "Leo Pinidi Thanuprabha Mendis",
      position: "Chief Editor",
      linkedin: "https://www.linkedin.com/in/pinidi-mendis-09294b32b",
      email: "pinidimendis41@gmail.com",
      phone: "0756089921",
    },
    {
      photo: "/10_Manushi.webp",
      name: "Leo Manushi Devapriya",
      position: "Marketing Director",
      linkedin: "http://linkedin.com/in/manushi-devapriya",
      email: "manushidevapriya.05@gmail.com",
      phone: "0767686748",
    },
    {
      photo: "/11_Vethmini.webp",
      name: "Leo Vethmini Wimalasinghe",
      position: "Coordinator",
      linkedin: "http://linkedin.com/in/abcsample", // Placeholder link
      email: "Vethminividara@gmail.com",
      phone: "0773494146",
    },
    {
      photo: "/12_Tharushi.webp",
      name: "Leo Tharushi Kularatne",
      position: "Coordinator",
      linkedin: "https://lk.linkedin.com/in/tharushi-kularatne-265388310",
      email: "tharushikularatne20@gmail.com",
      phone: "0725686612",
    },
  ];

  const formatUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  const handleLinkedInClick = (url) => {
    if (!url) return;
    const formattedUrl = formatUrl(url);
    window.open(formattedUrl, '_blank', 'noopener,noreferrer');
  };

  const handleEmailClick = (email) => {
    if (!email) return;
    window.open(`mailto:${email}`, '_self');
  };

  const handlePhoneClick = (phone) => {
    if (!phone) return;
    window.open(`tel:${phone}`, '_self');
  };

  const membersToShow = showAll ? excomMembers : excomMembers.slice(0, 6);

  return (
    <section id="excom" className="relative overflow-hidden py-24">
      {/* Professional Excom Background */}
      <div
        className="absolute inset-0 z-[-20] bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `url('/exco_bg.webp')`,
          filter: "brightness(0.3) contrast(1.1)",
        }}
      ></div>

      <div className="absolute inset-0 z-[-10] bg-[rgba(0,0,0,0.8)]"></div>

      {/* Elegant ambient effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 z-[-10] bg-[rgba(0,0,0,0.8)] backdrop-blur-[30px]" />

        <div
          className="absolute top-16 left-1/2 w-42 h-42 bg-[var(--color-secheading)] opacity-6 
                  rounded-full blur-3xl animate-[pulse_6s_ease-in-out_infinite]"
        ></div>
        <div
          className="absolute bottom-20 left-1/3 w-36 h-36 bg-[var(--color-secheading)] opacity-8 
                  rounded-full blur-2xl animate-[pulse_4.2s_ease-in-out_infinite]"
          style={{ animationDelay: "2.2s" }}
        ></div>
        <div
          className="absolute top-1/2 right-1/4 w-40 h-40 bg-[var(--color-secheading)] opacity-7
                  rounded-full blur-2xl animate-[pulse_3.6s_ease-in-out_infinite]"
          style={{ animationDelay: "1.8s" }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Professional Excom Section */}
        <div className="relative animate-[professionalSlideIn_1s_ease-out_both]">
          {/* ---- Your Original Exco UI ---- */}
          <div className="max-w-6xl mx-auto relative z-10">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2
                className="text-3xl sm:text-4xl font-bold mb-3
                                bg-gradient-to-r from-[var(--color-secheading)] via-[var(--color-primary)] to-[var(--color-readmore)] 
                                bg-clip-text text-transparent"
              >
                Meet the EXCO
              </h2>
              <div className="flex items-center justify-center space-x-3">
                <div className="h-px w-12 bg-gradient-to-r from-transparent to-[var(--color-primary)]"></div>
                <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-pulse"></div>
                <div className="h-px w-12 bg-gradient-to-l from-transparent to-[var(--color-primary)]"></div>
              </div>
            </div>

            {/* Members Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
              {membersToShow.map((member, i) => (
                <div
                  key={i}
                  className="group relative animate-[elegantFadeIn_0.8s_ease-out_both]"
                  style={{ animationDelay: `${i * 100 + 200}ms` }}
                >
                  {/* Card */}
                  <div
                    className="relative bg-gradient-to-br from-white/10 via-white/5 to-white/10 
                                            backdrop-blur-xl border border-white/20 rounded-xl overflow-hidden 
                                            shadow-xl hover:shadow-[0_25px_50px_rgba(240,212,146,0.2)]
                                            transition-all duration-500 hover:scale-[1.02] transform-gpu
                                            hover:-translate-y-1 hover:border-white/40
                                            h-[420px] sm:h-[440px] flex flex-col max-w-sm mx-auto"
                  >
                    {/* Content */}
                    <div className="relative p-5 flex flex-col items-center text-center flex-1">
                      {/* Photo */}
                      <div className="relative group mb-5 flex-shrink-0">
                        <div className="w-40 h-48 sm:w-44 sm:h-52 flex items-center justify-center rounded-lg overflow-hidden">
                          {member.photo ? (
                            <img
                              src={member.photo}
                              alt={member.name}
                              className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                              onError={(e) => {
                                e.target.style.display = "none";
                                e.target.nextSibling.style.display = "flex";
                              }}
                            />
                          ) : null}
                          <div
                            className={`w-full h-full bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-primary)]/20
                                            flex items-center justify-center text-[var(--color-primary)] font-bold text-xl
                                            hover:scale-110 transition-transform duration-300 ${
                                              member.photo ? "hidden" : "flex"
                                            }`}
                          >
                            {member.name.split(" ").map((n) => n[0]).join("")}
                          </div>
                        </div>
                      </div>

                      {/* Name & Position */}
                      <div className="space-y-2 mb-5 flex-grow flex flex-col justify-center px-3">
                        <h4 className="text-lg font-semibold text-white group-hover:text-[var(--color-primary)] transition-colors duration-300">
                          {member.name}
                        </h4>
                        <p className="text-white/70 text-xs uppercase tracking-wide">
                          {member.position}
                        </p>
                      </div>

                      {/* Links */}
                      <div className="flex justify-center gap-3 pb-5">
                        {member.linkedin && (
                          <button
                            onClick={() => handleLinkedInClick(member.linkedin)}
                            className="p-2.5 bg-gradient-to-r from-[var(--color-primary)]/10 to-transparent 
                                                    border border-[var(--color-primary)]/20 rounded-md text-[var(--color-primary)]
                                                    hover:from-[var(--color-primary)]/20 hover:border-[var(--color-primary)]/40 
                                                    transition-all duration-300 hover:scale-110 group/btn"
                            title="LinkedIn Profile"
                            aria-label="LinkedIn Profile"
                          >
                            <Linkedin
                              size={16}
                              className="group-hover/btn:scale-110 transition-transform duration-200"
                            />
                          </button>
                        )}

                        {member.email && (
                          <button
                            onClick={() => handleEmailClick(member.email)}
                            className="p-2.5 bg-gradient-to-r from-[var(--color-secheading)]/10 to-transparent 
                                                    border border-[var(--color-secheading)]/20 rounded-md text-[var(--color-secheading)]
                                                    hover:from-[var(--color-secheading)]/20 hover:border-[var(--color-secheading)]/40 
                                                    transition-all duration-300 hover:scale-110 group/btn"
                            title="Send Email"
                            aria-label="Send Email"
                          >
                            <Mail
                              size={16}
                              className="group-hover/btn:scale-110 transition-transform duration-200"
                            />
                          </button>
                        )}

                        {member.phone && (
                          <button
                            onClick={() => handlePhoneClick(member.phone)}
                            className="p-2.5 bg-gradient-to-r from-[var(--color-readmore)]/10 to-transparent 
                                                    border border-[var(--color-readmore)]/20 rounded-md text-[var(--color-readmore)]
                                                    hover:from-[var(--color-readmore)]/20 hover:border-[var(--color-readmore)]/40 
                                                    transition-all duration-300 hover:scale-110 group/btn"
                            title="Call Phone"
                            aria-label="Call Phone"
                          >
                            <Phone
                              size={16}
                              className="group-hover/btn:scale-110 transition-transform duration-200"
                            />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Accent */}
                    <div
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-readmore)]
                                            rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    ></div>
                  </div>

                  {/* Glow */}
                  <div
                    className="absolute -inset-0.5 bg-gradient-to-r from-[var(--color-primary)]/20 to-[var(--color-secheading)]/20 
                                    rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-400 blur-lg -z-10"
                  ></div>
                </div>
              ))}
            </div>

            {/* Show More */}
            <div className="text-center mt-6">
              <button
                onClick={() => setShowAll(!showAll)}
                className="inline-flex items-center px-5 py-2 bg-gradient-to-r from-[var(--color-primary)]/20 to-[var(--color-secheading)]/20 
                             border border-[var(--color-primary)]/30 rounded-lg text-white font-semibold text-sm
                             hover:from-[var(--color-primary)]/30 hover:to-[var(--color-secheading)]/30 
                             hover:border-[var(--color-primary)]/50 hover:scale-105 
                             transition-all duration-300 transform-gpu backdrop-blur-sm
                             shadow-md hover:shadow-[0_10px_25px_rgba(240,212,146,0.2)]"
              >
                {showAll ? "Show Less Exco" : "See More Exco"}
                <svg
                  className={`ml-2 w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 ${
                    showAll ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        @keyframes professionalSlideIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes elegantFadeIn {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          60% {
            opacity: 0.8;
            transform: translateY(-5px) scale(1.02);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </section>
  );
}
