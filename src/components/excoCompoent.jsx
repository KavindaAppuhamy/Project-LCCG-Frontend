import { Linkedin, Mail, Phone } from "lucide-react";

export default function ExcomSection() {
  // Sample data for demonstration - replace with your actual data
  //Add your photos to public\Exco and update the photo links accordingly 
  const excomMembers = [
    {
        photo: "public/Exco/pasan.png",    
        name: "Leo Pasan Perera",
        position: "President",
        linkedin: "https://www.linkedin.com/in/username1",
        email: "leo1@example.com",
        phone: "+1234567890"
    },
    {
        photo: "https://randomuser.me/api/portraits/men/1.jpg",
        name: "Leo Name 2", 
        position: "Vice President",
        linkedin: "https://www.linkedin.com/in/username2",
        email: "leo2@example.com",
        phone: "+1234567891"
    },
    {
        photo: "https://randomuser.me/api/portraits/men/1.jpg",
        name: "Leo Name 3", 
        position: "Secretary",
        linkedin: "https://www.linkedin.com/in/username3",
        email: "leo3@example.com",
        phone: "+1234567892"
    },
    {
        photo: "https://randomuser.me/api/portraits/men/1.jpg",
        name: "Leo Name 4", 
        position: "Treasurer",
        linkedin: "https://www.linkedin.com/in/username4",
        email: "leo4@example.com",
        phone: "+1234567893"
    },
    {
        photo: "https://randomuser.me/api/portraits/men/1.jpg",
        name: "Leo Name 5", 
        position: "Member",
        linkedin: "https://www.linkedin.com/in/username5",
        email: "leo5@example.com",
        phone: "+1234567894"
    },
    // Add more members as needed
  ];

  const handleLinkedInClick = (url) => {
    window.open(url, '_blank');
  };

  const handleEmailClick = (email) => {
    window.location.href = `mailto:${email}`;
  };

  const handlePhoneClick = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  return (             
    <section id="excom" className="relative py-24 sm:py-16 lg:py-5 px-4 sm:px-6 lg:px-8 ">
        <div className="max-w-7xl mx-auto relative z-10">
            {/* Professional section header */}
            <div className="text-center mb-16 animate-[professionalSlideIn_1s_ease-out]">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4
                                bg-gradient-to-r from-[var(--color-secheading)] via-[var(--color-primary)] to-[var(--color-readmore)] 
                                bg-clip-text text-transparent">
                    Meet the Exco
                </h2>
                <div className="flex items-center justify-center space-x-4">
                    <div className="h-px w-20 bg-gradient-to-r from-transparent to-[var(--color-primary)]"></div>
                    <div className="w-3 h-3 bg-[var(--color-primary)] rounded-full animate-pulse"></div>
                    <div className="h-px w-20 bg-gradient-to-l from-transparent to-[var(--color-primary)]"></div>
                </div>
            </div>

            {/* Professional member cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {Array.from({ length: 8 }).map((_, i) => {
                const member = excomMembers[i] || {
                name: `Leo Name ${i + 1}`,
                position: "Position",
                linkedin: `https://www.linkedin.com/in/username${i + 1}`,
                email: `leo${i + 1}@example.com`,
                phone: `+123456789${i}`
                };

                return (
                <div
                    key={i}
                    className="group relative animate-[professionalSlideIn_1s_ease-out_both]"
                    style={{ animationDelay: `${i * 100 + 200}ms` }}
                >
                    {/* Professional card container */}
                    <div className="relative bg-gradient-to-br from-white/10 via-white/5 to-white/10 
                                backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden 
                                shadow-2xl hover:shadow-[0_25px_50px_rgba(240,212,146,0.15)]
                                transition-all duration-500 hover:scale-105 transform-gpu">
                    
                        {/* Professional card content */}
                        <div className="relative p-6 flex flex-col items-center text-center"> 
                            {/* Professional profile placeholder - No circular avatar */}
                            <div className="relative group mb-6">
                            <div className="w-28 h-28 flex items-center justify-center rounded-2xl   overflow-hidden">
                                {member.photo ? (
                                    <img 
                                    src={member.photo} 
                                    alt={member.name} 
                                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-primary)]/20
                                        flex items-center justify-center text-[var(--color-primary)] font-bold text-xl
                                        hover:scale-110 transition-transform duration-300">
                                    {member.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                )}
                                </div>
                            </div>

                            {/* Professional name & position */}
                            <div className="space-y-2 mb-4">
                            <h4 className="text-xl font-semibold text-white group-hover:text-[var(--color-primary)] 
                                        transition-colors duration-300">
                                {member.name}
                            </h4>
                            <p className="text-white/70 text-sm uppercase tracking-wider">{member.position}</p>
                            </div>

                            {/* Functional social links with icons */}
                            <div className="flex justify-center gap-2">
                            <button 
                                onClick={() => handleLinkedInClick(member.linkedin)}
                                className="p-3 bg-gradient-to-r from-[var(--color-primary)]/10 to-transparent 
                                        border border-[var(--color-primary)]/20 rounded-lg text-[var(--color-primary)]
                                        hover:from-[var(--color-primary)]/20 hover:border-[var(--color-primary)]/40 
                                        transition-all duration-300 hover:scale-110 group/btn"
                                title="LinkedIn Profile"
                            >
                                <Linkedin size={18} className="group-hover/btn:scale-110 transition-transform duration-200" />
                            </button>
                            
                            <button 
                                onClick={() => handleEmailClick(member.email)}
                                className="p-3 bg-gradient-to-r from-[var(--color-secheading)]/10 to-transparent 
                                        border border-[var(--color-secheading)]/20 rounded-lg text-[var(--color-secheading)]
                                        hover:from-[var(--color-secheading)]/20 hover:border-[var(--color-secheading)]/40 
                                        transition-all duration-300 hover:scale-110 group/btn"
                                title="Send Email"
                            >
                                <Mail size={18} className="group-hover/btn:scale-110 transition-transform duration-200" />
                            </button>
                            
                            <button 
                                onClick={() => handlePhoneClick(member.phone)}
                                className="p-3 bg-gradient-to-r from-[var(--color-readmore)]/10 to-transparent 
                                        border border-[var(--color-readmore)]/20 rounded-lg text-[var(--color-readmore)]
                                        hover:from-[var(--color-readmore)]/20 hover:border-[var(--color-readmore)]/40 
                                        transition-all duration-300 hover:scale-110 group/btn"
                                title="Call Phone"
                            >
                                <Phone size={18} className="group-hover/btn:scale-110 transition-transform duration-200" />
                            </button>
                            </div>
                        </div>

                        {/* Professional accent decoration */}
                        <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-readmore)]
                                        rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Professional glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-primary)]/20 to-[var(--color-secheading)]/20 
                                rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"></div>
                </div>
                );
            })}
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
        `}
        </style>
    </section>
  );
}