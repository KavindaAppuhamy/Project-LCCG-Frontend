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
      {/* Subtle elegant background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-8 left-16 w-32 h-32 bg-gradient-to-br from-[var(--color-primary)]/6 to-[var(--color-secheading)]/3 
                        rounded-full blur-2xl animate-[elegantFloat_10s_ease-in-out_infinite]"></div>
        
        <div className="absolute bottom-8 right-16 w-28 h-28 bg-gradient-to-tl from-[var(--color-readmore)]/4 to-transparent 
                        rounded-full blur-2xl animate-[elegantDrift_12s_ease-in-out_infinite]" 
             style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Logo & Description */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-secheading)] p-0.5 
                              shadow-lg hover:shadow-[0_0_20px_rgba(240,212,146,0.3)] transition-all duration-300">
                <div className="w-full h-full rounded-xl bg-[var(--color-card)] flex items-center justify-center">
                  <img
                    src="LCCG-Logo.png"
                    alt="LCCG Logo"
                    className="w-8 h-8 object-contain"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--color-heading)] 
                               bg-gradient-to-r from-[var(--color-secheading)] to-[var(--color-primary)] 
                               bg-clip-text text-transparent">
                  Leo Club of <br /> Cinnamon Gardens
                </h3>
              </div>
            </div>
            
            <p className="text-[var(--color-description)] leading-relaxed text-sm">
              Empowering young leaders through meaningful community service and leadership development.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-[var(--color-heading)] font-semibold flex items-center">
              Quick Links
              <div className="ml-3 h-px flex-1 bg-gradient-to-r from-[var(--color-primary)]/30 to-transparent"></div>
            </h4>
            
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {quickLinks.map((link, index) => (
                <button
                  key={link.name}
                  onClick={() => scrollToId(link.href)}
                  className="text-[var(--color-description)] hover:text-[var(--color-primary)] 
                             transition-colors duration-300 text-sm font-medium
                             hover:translate-x-1 transform"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animation: 'elegantSlideUp 0.6s ease-out forwards'
                  }}
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <h4 className="text-[var(--color-heading)] font-semibold flex items-center">
              Connect
              <div className="ml-3 h-px flex-1 bg-gradient-to-r from-[var(--color-primary)]/30 to-transparent"></div>
            </h4>
            
            <div className="space-y-3">
              <div className="text-sm">
                <a href="mailto:info@leoclub-cg.org" 
                   className="text-[var(--color-description)] hover:text-[var(--color-primary)] transition-colors duration-300">
                  leoclubofcinnamongardens@gmail.com
                </a>
              </div>
              
              <div className="flex space-x-2">
                {socialLinks.map((social, index) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-primary)]/8 to-[var(--color-secheading)]/4 
                               border border-[rgba(255,255,255,0.06)] flex items-center justify-center 
                               text-[var(--color-description)] hover:text-[var(--color-primary)] 
                               hover:border-[var(--color-primary)]/30 hover:scale-110
                               transition-all duration-300"
                    style={{
                      animationDelay: `${index * 100}ms`,
                      animation: 'elegantSlideUp 0.6s ease-out forwards'
                    }}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
<div className="pt-6 border-t border-[rgba(255,255,255,0.05)]">
  <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6 md:gap-4">

    {/* Copyright */}
    <div className="flex items-center justify-center space-x-2 text-[var(--color-description)] text-xs">
      <div className="w-1 h-1 bg-[var(--color-primary)]/60 rounded-full"></div>
      <p>
        &copy; {currentYear} <span className="font-medium text-white">Leo Club of Cinnamon Gardens</span>.  
        All rights reserved.
      </p>
    </div>

    {/* Developer Credits */}
    <div className="text-[var(--color-description)] text-xs leading-relaxed">
      <span className="font-medium text-white">Developed & Designed by</span>  
      <div className="flex flex-col md:flex-row md:space-x-2 text-xs">
        <span>Dhananjaya Perera</span>
        <span>Kavinda Appuhamy</span>
        <span>Thamalu Amarasingha</span>
      </div>
    </div>

    {/* Links */}
    <div className="flex space-x-5 text-xs">
      {['Privacy', 'Terms', 'Contact'].map((link) => (
        <a
          key={link}
          href="#"
          className="relative text-[var(--color-description)] hover:text-[var(--color-primary)] 
                     transition-colors duration-300 group"
        >
          {link}
          <span className="absolute left-0 -bottom-0.5 w-0 h-px bg-[var(--color-primary)] 
                          group-hover:w-full transition-all duration-300"></span>
        </a>
      ))}
    </div>

    {/* Back to Top */}
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="group flex items-center space-x-2 text-[var(--color-description)] 
                 hover:text-[var(--color-primary)] transition-colors duration-300"
    >
      <span className="text-xs">Top</span>
      <div className="w-6 h-6 rounded-lg border border-[rgba(255,255,255,0.06)] 
                      flex items-center justify-center group-hover:border-[var(--color-primary)]/30 
                      group-hover:bg-[var(--color-primary)]/5 transition-all duration-300">
        <svg
          className="w-3 h-3 transform group-hover:-translate-y-0.5 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </div>
    </button>
  </div>
</div>

      </div>

      {/* Streamlined Professional Animations */}
      <style jsx>{`
        @keyframes elegantSlideUp {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes elegantFloat {
          0%, 100% { 
            transform: translateY(0px) scale(1); 
            opacity: 0.4;
          }
          50% { 
            transform: translateY(-8px) scale(1.02); 
            opacity: 0.6;
          }
        }
        
        @keyframes elegantDrift {
          0%, 100% { transform: translateX(0px) translateY(0px); }
          50% { transform: translateX(-5px) translateY(-8px); }
        }
      `}</style>
    </footer>
  );
};

export default FooterComponent;