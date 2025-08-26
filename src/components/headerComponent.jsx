import React, { useState, useEffect } from "react";
import { HiMenu, HiX } from "react-icons/hi";

const HeaderComponent = ({ scrollToId }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Change navbar background on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "projects", label: "Projects" },
    { id: "newsletter", label: "Newsletter" },
    { id: "testimonials", label: "Testimonials" },
    { id: "excom", label: "Exco" },
    { id: "register", label: "Join" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[rgba(11,26,47,0.85)] backdrop-blur-md  border-[rgba(255,255,255,0.04)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src="public/LCCG-Logo.png"
            alt="logo"
            className="w-10 h-10 rounded"
          />
          <div
            className="text-[var(--color-primary)] font-bold text-lg"
            // style={{ fontFamily: "'Playfair Display', serif" }}
            style={{ fontFamily: "'Montserrat', 'Inter', 'Playfair Display', serif" }}
          >
            Leo Club of Cinnamon Gardens
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-[var(--color-primary)]">
          {navLinks.map((link) => (
            <li
              key={link.id}
              className="list-none cursor-pointer hover:text-[var(--color-readmore)] transition-colors duration-300"
              onClick={() => scrollToId(link.id)}
            >
              {link.label}
            </li>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-[var(--color-primary)] text-3xl focus:outline-none"
          >
            {menuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden relative">
          {/* Elegant backdrop with subtle animations */}
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(11,26,47,0.97)] to-[rgba(11,26,47,0.95)] 
                          backdrop-blur-xl border-t border-[rgba(255,255,255,0.08)]
                          shadow-[0_8px_32px_rgba(0,0,0,0.3)]"></div>
          
          {/* Professional content container */}
          <div className="relative px-8 py-6 space-y-2">
            {/* Elegant decorative line */}
            <div className="flex items-center justify-center mb-4">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-[var(--color-primary)]/40"></div>
              <div className="w-1 h-1 bg-[var(--color-primary)]/60 rounded-full mx-3"></div>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-[var(--color-primary)]/40"></div>
            </div>
            
            <ul className="flex flex-col gap-1 text-[var(--color-primary)]">
              {navLinks.map((link, index) => (
                <li
                  key={link.id}
                  className="group relative overflow-hidden rounded-xl"
                  style={{
                    animation: `elegantSlideIn 0.4s ease-out ${index * 0.1}s both`
                  }}
                >
                  {/* Elegant hover background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent 
                                  opacity-0 group-hover:opacity-100 transition-all duration-300
                                  group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"></div>
                  
                  <div
                    className="relative cursor-pointer px-4 py-3 font-medium tracking-wide
                              text-[var(--color-primary)] group-hover:text-[var(--color-readmore)] 
                              transition-all duration-300 group-hover:translate-x-2
                              flex items-center justify-between"
                    onClick={() => {
                      scrollToId(link.id);
                      setMenuOpen(false);
                    }}
                  >
                    <span className="relative">
                      {link.label}
                      {/* Elegant underline animation */}
                      <div className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r 
                                      from-[var(--color-readmore)] to-[var(--color-primary)]
                                      group-hover:w-full transition-all duration-500"></div>
                    </span>
                    
                    {/* Professional arrow indicator */}
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300
                                    transform translate-x-2 group-hover:translate-x-0">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" 
                           className="text-[var(--color-readmore)]">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" 
                              strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            
            {/* Elegant bottom decoration */}
            <div className="flex items-center justify-center mt-6 pt-4 border-t border-[rgba(255,255,255,0.04)]">
              <div className="w-8 h-px bg-gradient-to-r from-[var(--color-primary)]/20 via-[var(--color-readmore)]/40 to-[var(--color-primary)]/20"></div>
            </div>
          </div>
          
          {/* Professional animation styles */}
          <style jsx>{`
            @keyframes elegantSlideIn {
              from {
                opacity: 0;
                transform: translateY(20px) translateX(-10px);
              }
              to {
                opacity: 1;
                transform: translateY(0) translateX(0);
              }
            }
          `}</style>
        </div>
      )}
    </header>
  );
};

export default HeaderComponent;
