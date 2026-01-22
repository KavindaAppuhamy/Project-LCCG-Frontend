import React from 'react';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTiktok } from "react-icons/fa";

const FooterComponent = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'Facebook',
      icon: <FaFacebookF className="w-4 h-4" />,
      href: "https://www.facebook.com/share/16EVSLXtVr/?mibextid=wwXIfr",
    },
    {
      name: 'Instagram',
      icon: <FaInstagram className="w-4 h-4" />,
      href: "https://www.instagram.com/cinnamon_leos?igsh=OTJweG5vYmYxNGUw&utm_source=qr",
    },
    {
      name: 'LinkedIn',
      icon: <FaLinkedinIn className="w-4 h-4" />,
      href: "https://www.linkedin.com/company/leo-club-of-cinnamon-gardens/",
    },
    {
      name: 'TikTok',
      icon: <FaTiktok className="w-4 h-4" />,
      href: "https://www.tiktok.com/@cinnamon_leos?_t=ZS-8z98dHX4LXc&_r=1",
    },
  ];

  const quickLinks = [
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Newsletter', href: '#newsletter' },
    { name: 'Join Us', href: '#register' },
  ];

  const scrollToId = (id) => {
    const element = document.getElementById(id.replace('#', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="relative bg-gradient-to-b from-[var(--color-card)] to-[var(--color-bg)] 
                       border-t border-[rgba(255,255,255,0.08)] overflow-hidden">
      {/* Background elements - simplified */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-20 w-24 h-24 bg-gradient-to-br from-[var(--color-primary)]/8 to-[var(--color-secheading)]/4 
                        rounded-full blur-xl animate-[elegantFloat_12s_ease-in-out_infinite]"></div>
        
        <div className="absolute bottom-5 right-20 w-20 h-20 bg-gradient-to-tl from-[var(--color-readmore)]/5 to-transparent 
                        rounded-full blur-xl animate-[elegantDrift_15s_ease-in-out_infinite]" 
             style={{animationDelay: '3s'}}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Main Content - made more compact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Logo & Description - compacted */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="relative group">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-secheading)] p-0.5 
                                shadow-md hover:shadow-[0_0_20px_rgba(240,212,146,0.3)] transition-all duration-500">
                  <div className="w-full h-full rounded-lg bg-[var(--color-card)] flex items-center justify-center">
                    <img
                      src="/LCCG-Logo.png"
                      alt="LCCG Logo"
                      className="w-7 h-7 object-contain transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--color-heading)] 
                               bg-gradient-to-r from-[var(--color-secheading)] via-[var(--color-primary)] to-[var(--color-readmore)] 
                               bg-clip-text text-transparent">
                  Leo Club of <br /> Cinnamon Gardens
                </h3>
              </div>
            </div>
            
            <p className="text-[var(--color-description)] leading-relaxed text-xs max-w-xs">
              Empowering young leaders through meaningful community service and leadership development.
            </p>
          </div>

          {/* Quick Links - compacted */}
          <div className="space-y-4">
            <h4 className="text-[var(--color-heading)] font-semibold text-base flex items-center group">
              Quick Links
              <div className="ml-2 h-px flex-1 bg-gradient-to-r from-[var(--color-primary)]/40 to-transparent 
                             group-hover:from-[var(--color-primary)]/60 transition-all duration-500"></div>
            </h4>
            
            <div className="flex flex-col gap-2">
              {quickLinks.map((link, index) => (
                <button
                  key={link.name}
                  onClick={() => scrollToId(link.href)}
                  className="group relative text-[var(--color-description)] hover:text-[var(--color-primary)] 
                            transition-all duration-400 text-xs font-medium py-1 px-2 text-left
                            hover:translate-x-1 transform rounded-lg hover:bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent"
                  style={{
                    animationDelay: `${index * 80}ms`,
                    animation: 'elegantSlideUp 0.7s ease-out forwards'
                  }}
                >
                  <span className="relative z-10 flex items-center">
                    {link.name}
                    <svg className="w-2.5 h-2.5 ml-1 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-0.5 
                                   transition-all duration-300" 
                         fill="none" 
                         stroke="currentColor" 
                         viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Contact & Social - compacted */}
          <div className="space-y-4">
            <h4 className="text-[var(--color-heading)] font-semibold text-base flex items-center group">
              Connect With Us
              <div className="ml-2 h-px flex-1 bg-gradient-to-r from-[var(--color-primary)]/40 to-transparent 
                             group-hover:from-[var(--color-primary)]/60 transition-all duration-500"></div>
            </h4>
            
            <div className="space-y-3">

              {/* Contact Info */}
              <div className="space-y-2">
                <div className="flex items-start space-x-2 group">
                  <div className="w-3 h-3 mt-0.5 text-[var(--color-primary)]/60 group-hover:text-[var(--color-primary)] 
                                 transition-colors duration-300">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="text-xs text-[var(--color-description)] group-hover:text-[var(--color-primary)] 
                                  transition-colors duration-300">
                    Cinnamon Gardens, Western 00007, LK
                  </span>
                </div>

                <div className="flex items-center space-x-2 group">
                  <div className="w-3 h-3 text-[var(--color-primary)]/60 group-hover:text-[var(--color-primary)] 
                                 transition-colors duration-300">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <a href="tel:+94123456789" 
                     className="text-xs text-[var(--color-description)] hover:text-[var(--color-primary)] 
                                transition-colors duration-300">
                    +94 71 530 1583
                  </a>
                </div>

                <div className="flex items-center space-x-2 group">
                  <div className="w-3 h-3 text-[var(--color-primary)]/60 group-hover:text-[var(--color-primary)] 
                                 transition-colors duration-300">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <a href="mailto:leoclubofcinnamongardens@gmail.com" 
                     className="text-xs text-[var(--color-description)] hover:text-[var(--color-primary)] 
                                transition-colors duration-300">
                    leoclubofcinnamongardens@gmail.com
                  </a>
                </div>
              </div>
              
              {/* Social Links - compacted */}
              <div className="flex space-x-2 pt-1">
                {socialLinks.map((social, index) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"                // ✅ Opens in new tab
                    rel="noopener noreferrer"      // ✅ Security best practice
                    className="group relative w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secheading)]/6 
                              border border-[rgba(255,255,255,0.08)] flex items-center justify-center 
                              text-[var(--color-description)] hover:text-[var(--color-primary)] 
                              hover:border-[var(--color-primary)]/40 hover:scale-105
                              transition-all duration-400 shadow-sm hover:shadow-[0_2px_10px_rgba(240,212,146,0.15)]"
                    style={{
                      animationDelay: `${index * 120}ms`,
                      animation: 'elegantSlideUp 0.8s ease-out forwards'
                    }}
                    title={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - compacted */}
        <div className="pt-6 border-t border-[rgba(255,255,255,0.06)]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">

            {/* Copyright - compacted */}
            <div className="flex items-center space-x-2 text-[var(--color-description)] text-xs">
              <div className="w-1 h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-readmore)] rounded-full"></div>
              <p className="font-light">
                &copy; {currentYear} <span className="font-medium text-white">Leo Club of Cinnamon Gardens</span>.  
                All rights reserved.
              </p>
            </div>
          </div>
        </div>

        {/* Developer Credits - compacted */}
        <div className="pt-4 border-t border-[rgba(255,255,255,0.03)] mt-4">
          <div className="text-center">
            <div className="text-[var(--color-description)] text-xs">
              <span className="font-medium text-white/90">Developed & Designed by</span>  
              <div className="flex flex-wrap justify-center items-center gap-2 mt-1">
                {[
                  { name: "CeyCodez Software Solutions (Pvt) Ltd", link: "https://www.ceycodez.com/" }
                ].map((dev, index, arr) => (
                  <span key={dev.name} className="flex items-center">
                    <a
                      href={dev.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center text-xs hover:text-[var(--color-primary)] 
                                transition-all duration-300 px-2 py-0.5 rounded-md hover:bg-gradient-to-r 
                                from-[var(--color-primary)]/5 to-transparent"
                    >
                      {dev.name}
                    </a>
                    {index < arr.length - 1 && (
                      <span className="mx-1 text-[var(--color-description)]/30 group-hover:text-[var(--color-primary)]/50">
                        •
                      </span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Professional Animations */}
      <style jsx = "true">{`
        @keyframes elegantSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes elegantFloat {
          0%, 100% { 
            transform: translateY(0px) scale(1) rotate(0deg); 
            opacity: 0.5;
          }
          33% { 
            transform: translateY(-10px) scale(1.03) rotate(2deg); 
            opacity: 0.7;
          }
          66% { 
            transform: translateY(5px) scale(0.98) rotate(-1deg); 
            opacity: 0.6;
          }
        }
        
        @keyframes elegantDrift {
          0%, 100% { transform: translateX(0px) translateY(0px) rotate(0deg); }
          25% { transform: translateX(-8px) translateY(-12px) rotate(5deg); }
          50% { transform: translateX(6px) translateY(-6px) rotate(-3deg); }
          75% { transform: translateX(-4px) translateY(8px) rotate(2deg); }
        }
      `}</style>
    </footer>
  );
};

export default FooterComponent;