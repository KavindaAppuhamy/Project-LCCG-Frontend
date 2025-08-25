import { Linkedin, Mail, Phone } from "lucide-react";
import { useState } from "react";

export default function ExcomSection() {
  const [showAll, setShowAll] = useState(false);

  // Sample data for demonstration - replace with your actual data
  //Add your photos to public\Exco and update the photo links accordingly 
  const excomMembers = [
    {
        photo: "public/Exco/1_Pasan_mendis.png",
        name: "Leo Pasan Mendis",
        position: "President",
        linkedin: "www.linkedin.com/in/pasan-mendis",
        email: "mendispasan@gmail.com",
        phone: "0715301583",
    },
    {
        photo: "public/Exco/hasanka.png",
        name: "Leo Hasanka Lakshan",
        position: "Immediate Past President",
        linkedin: "www.linkedin.com/in/hasanka-lakshan",
        email: "hasankalakshan.me@gmail.com",
        phone: "0716287379",
    },
    {
        photo: "public/Exco/3_Hirusha.png",
        name: "Hirusha Kumaranayake",
        position: "1st Vice President",
        linkedin: "http://linkedin.com/in/abcsample",
        email: "int.hirusha.ictc@gmail.con",
        phone: "0714985239",
    },
    {
        photo: "public/Exco/sheron.png",
        name: "Sheron Deeshan",
        position: "2nd Vice President",
        linkedin: "https://www.linkedin.com/in/sheron-deeshan",
        email: "Sheron.deeshan@gmail.com",
        phone: "0123456789",
    },
    {
        photo: "public/Exco/5_Dihan_Masinghe.png",
        name: "Leo Dihan Masinghe",
        position: "Secretary",
        linkedin: "https://www.linkedin.com/in/dihan-masinghe-8a91442b5?",
        email: "dihanhansaja7@gmail.com",
        phone: "0719348166",
    },
    {
        photo: "public/Exco/6_Lasath.png",
        name: "Leo Lasath Gunawardhana",
        position: "Membership Chairperson",
        linkedin: "www.linkedin.com/in/lasath-poojitha-gunawardhana",
        email: "lasathpoojithagunawardhana@gmail.com",
        phone: "0773834414",
    },
    {
        photo: "public/Exco/7_Vethara_jayaweera.png",
        name: "Leo Vethara Jayaweera",
        position: "Assistant Secretary",
        linkedin: "http://linkedin.com/in/abcsample",
        email: "jayaweerakithnuli@gmail.com",
        phone: "0713428932",
    },
    {
        photo: "public/Exco/8_Pathum.png",
        name: "Pathum Harshana",
        position: "Assistant Treasurer",
        linkedin: "https://www.linkedin.com/in/pathum-harshana-0390982b3",
        email: "pathum3893@gmail.com",
        phone: "0718779957",
    },
    {
        photo: "public/Exco/9_Pinidi.png",
        name: "Leo Pinidi Thanuprabha Mendis",
        position: "Chief Editor",
        linkedin: "https://www.linkedin.com/in/pinidi-mendis-09294b32b",
        email: "pinidimendis41@gmail.com",
        phone: "0756089921",
    },
    {
        photo: "public/Exco/10_Manushi.png",
        name: "Manushi Devapriya",
        position: "Marketing Director",
        linkedin: "http://linkedin.com/in/manushi-devapriya",
        email: "manushidevapriya.05@gmail.com",
        phone: "0767686748",
    },
    {
        photo: "public/Exco/11_Vethmini.png",
        name: "Leo Vethmini Wimalasinghe",
        position: "Coordinator",
        linkedin: "http://linkedin.com/in/abcsample",
        email: "Vethminividara@gmail.com",
        phone: "0773494146",
    },
    {
        photo: "public/Exco/12_Tharushi.png",
        name: "Leo Tharushi Kularatne",
        position: "Coordinator",
        linkedin: "https://www.linkedin.com/in/tharushi-kularatne",
        email: "tharushikularatne20@gmail.com",
        phone: "0725686612",
    },
  ];

  // Helper function to format URLs properly
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

  // Determine how many members to show based on showAll state
  const membersToShow = showAll ? excomMembers : excomMembers.slice(0, 6);

  return (             
    <section id="excom" className="relative py-24 sm:py-16 lg:py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto relative z-10">
            {/* Professional section header */}
            <div className="text-center mb-16 animate-[professionalSlideIn_1s_ease-out]">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4
                                bg-gradient-to-r from-[var(--color-secheading)] via-[var(--color-primary)] to-[var(--color-readmore)] 
                                bg-clip-text text-transparent">
                    Meet the Exco
                </h2>
                <div className="flex items-center justify-center space-x-4">
                    <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-[var(--color-primary)]"></div>
                    <div className="w-2 h-2 sm:w-3 sm:h-3 bg-[var(--color-primary)] rounded-full animate-pulse"></div>
                    <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-[var(--color-primary)]"></div>
                </div>
            </div>

            {/* Professional member cards - Updated responsive grid: 1 card on mobile, 3 cards on desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {membersToShow.map((member, i) => (
                    <div
                        key={i}
                        className="group relative animate-[professionalSlideIn_1s_ease-out_both]"
                        style={{ animationDelay: `${i * 100 + 200}ms` }}
                        >
                            {/* Card container - Increased height to match reference image */}
                            <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-white/10 
                                            backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl overflow-hidden 
                                            shadow-2xl hover:shadow-[0_25px_50px_rgba(240,212,146,0.15)]
                                            transition-all duration-500 hover:scale-105 transform-gpu
                                            h-[500px] sm:h-[520px] lg:h-[550px] flex flex-col">
                                
                                {/* Card content */}
                                <div className="relative p-6 sm:p-8 flex flex-col items-center text-center flex-1"> 
                                    {/* Profile photo container - Increased size */}
                                    <div className="relative group mb-6 flex-shrink-0">
                                        <div className="w-48 h-56 sm:w-52 sm:h-60 lg:w-56 lg:h-64 flex items-center justify-center rounded-xl overflow-hidden">
                                        {member.photo ? (
                                            <img 
                                            src={member.photo} 
                                            alt={member.name} 
                                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                            />
                                        ) : null}
                                        <div className={`w-full h-full bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-primary)]/20
                                            flex items-center justify-center text-[var(--color-primary)] font-bold text-2xl lg:text-3xl
                                            hover:scale-110 transition-transform duration-300 ${member.photo ? 'hidden' : 'flex'}`}>
                                            {member.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Name & Position - Increased text sizes */}
                                <div className="space-y-3 mb-6 flex-grow flex flex-col justify-center px-4">
                                    <h4 className="text-xl lg:text-2xl font-semibold text-white group-hover:text-[var(--color-primary)] transition-colors duration-300">
                                    {member.name}
                                    </h4>
                                    <p className="text-white/70 text-sm lg:text-base uppercase tracking-wide">
                                    {member.position}
                                    </p>
                                </div>

                                {/* Functional social links - Increased button sizes */}
                                <div className="flex justify-center gap-4 pb-6">
                                    {member.linkedin && (
                                        <button 
                                            onClick={() => handleLinkedInClick(member.linkedin)}
                                            className="p-3 lg:p-4 bg-gradient-to-r from-[var(--color-primary)]/10 to-transparent 
                                                    border border-[var(--color-primary)]/20 rounded-lg text-[var(--color-primary)]
                                                    hover:from-[var(--color-primary)]/20 hover:border-[var(--color-primary)]/40 
                                                    transition-all duration-300 hover:scale-110 group/btn"
                                            title="LinkedIn Profile"
                                            aria-label="LinkedIn Profile"
                                        >
                                            <Linkedin size={18} className="lg:w-5 lg:h-5 group-hover/btn:scale-110 transition-transform duration-200" />
                                        </button>
                                    )}
                                    
                                    {member.email && (
                                        <button 
                                            onClick={() => handleEmailClick(member.email)}
                                            className="p-3 lg:p-4 bg-gradient-to-r from-[var(--color-secheading)]/10 to-transparent 
                                                    border border-[var(--color-secheading)]/20 rounded-lg text-[var(--color-secheading)]
                                                    hover:from-[var(--color-secheading)]/20 hover:border-[var(--color-secheading)]/40 
                                                    transition-all duration-300 hover:scale-110 group/btn"
                                            title="Send Email"
                                            aria-label="Send Email"
                                        >
                                            <Mail size={18} className="lg:w-5 lg:h-5 group-hover/btn:scale-110 transition-transform duration-200" />
                                        </button>
                                    )}
                                    
                                    {member.phone && (
                                        <button 
                                            onClick={() => handlePhoneClick(member.phone)}
                                            className="p-3 lg:p-4 bg-gradient-to-r from-[var(--color-readmore)]/10 to-transparent 
                                                    border border-[var(--color-readmore)]/20 rounded-lg text-[var(--color-readmore)]
                                                    hover:from-[var(--color-readmore)]/20 hover:border-[var(--color-readmore)]/40 
                                                    transition-all duration-300 hover:scale-110 group/btn"
                                            title="Call Phone"
                                            aria-label="Call Phone"
                                        >
                                            <Phone size={18} className="lg:w-5 lg:h-5 group-hover/btn:scale-110 transition-transform duration-200" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Professional accent decoration */}
                            <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-readmore)]
                                            rounded-lg sm:rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>

                        {/* Professional glow effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-primary)]/20 to-[var(--color-secheading)]/20 
                                    rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"></div>
                    </div>
                ))}
            </div>

            {/* See More / Show Less Button */}
            <div className="text-center mt-8 sm:mt-10 md:mt-12">
                <button
                    onClick={() => setShowAll(!showAll)}
                    className="inline-flex items-center px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-[var(--color-primary)]/20 to-[var(--color-secheading)]/20 
                             border border-[var(--color-primary)]/30 rounded-xl sm:rounded-2xl text-white font-semibold text-sm sm:text-base
                             hover:from-[var(--color-primary)]/30 hover:to-[var(--color-secheading)]/30 
                             hover:border-[var(--color-primary)]/50 hover:scale-105 
                             transition-all duration-300 transform-gpu backdrop-blur-sm
                             shadow-lg hover:shadow-[0_15px_35px_rgba(240,212,146,0.2)]"
                >
                    {showAll ? 'Show Less Exco' : 'See More Exco'}
                    <svg 
                        className={`ml-2 w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-1 ${
                            showAll ? 'rotate-180' : ''
                        }`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>
        </div>

        <style jsx>{`
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
        `}</style>
    </section>
  );
}