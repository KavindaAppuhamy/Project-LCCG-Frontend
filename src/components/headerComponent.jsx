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
    { id: "home", label: "HOME" },
    { id: "about", label: "ABOUT" },
    { id: "projects", label: "PROJECTS" },
    { id: "newsletter", label: "NEWSLETTERS" },
    { id: "testimonials", label: "TESTIMONIALS" },
    { id: "excom", label: "EXCO" },
    { id: "register", label: "JOIN" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-[rgba(11,26,47,0.85)] backdrop-blur-md border-[rgba(255,255,255,0.04)]"
          : "bg-transparent"
      }`}
    >
      <div className="w-full flex items-center justify-between px-6 lg:px-10 py-2.5">
        {/* Logo */}
        <div className="flex items-center gap-2 animate-slideDown">
          <img src="/LCCG-Logo.webp" alt="logo" className="w-7 h-8 rounded" />
          <div
            className="text-[var(--color-primary)] font-bold text-base"
            style={{
              fontFamily:
                "'Montserrat', 'Inter', 'Playfair Display', serif",
            }}
          >
            Leo Club of Cinnamon Gardens
          </div>
        </div>

        <style jsx="true">{`
          @keyframes slideDown {
            0% {
              opacity: 0;
              transform: translateY(-20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-slideDown {
            animation: slideDown 0.5s ease-out forwards;
          }
        `}</style>

        {/* Desktop Navigation */}
        <nav
          className="hidden lg:flex items-center gap-6 text-[var(--color-primary)] font-bold text-base animate-slideDown"
        >
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

        <style jsx="true">{`
          @keyframes slideDown {
            0% {
              opacity: 0;
              transform: translateY(-20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          .animate-slideDown {
            animation: slideDown 0.5s ease-out forwards;
          }
        `}</style>


        {/* Mobile & Tablet Menu Button (below lg) */}
        <div className="lg:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-[var(--color-primary)] text-2xl focus:outline-none"
          >
            {menuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Menu Dropdown */}
      {menuOpen && (
        <div className="lg:hidden relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[rgba(11,26,47,0.97)] to-[rgba(11,26,47,0.95)] 
                          backdrop-blur-xl border-t border-[rgba(255,255,255,0.08)]
                          shadow-[0_6px_24px_rgba(0,0,0,0.3)]"></div>

          <div className="relative px-6 py-4 space-y-1">
            <div className="flex items-center justify-center mb-3">
              <div className="h-px w-10 bg-gradient-to-r from-transparent to-[var(--color-primary)]/40"></div>
              <div className="w-1 h-1 bg-[var(--color-primary)]/60 rounded-full mx-2"></div>
              <div className="h-px w-10 bg-gradient-to-l from-transparent to-[var(--color-primary)]/40"></div>
            </div>

            <ul className="flex flex-col gap-0 text-[var(--color-primary)]">
              {navLinks.map((link, index) => (
                <li
                  key={link.id}
                  className="group relative overflow-hidden rounded-lg"
                  style={{
                    animation: `elegantSlideIn 0.3s ease-out ${
                      index * 0.08
                    }s both`,
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/5 to-transparent 
                                  opacity-0 group-hover:opacity-100 transition-all duration-300
                                  group-hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"></div>

                  <div
                    className="relative cursor-pointer px-3 py-2 font-medium tracking-wide
                              text-[var(--color-primary)] group-hover:text-[var(--color-readmore)] 
                              transition-all duration-300 group-hover:translate-x-1.5
                              flex items-center justify-between text-sm"
                    onClick={() => {
                      scrollToId(link.id);
                      setMenuOpen(false);
                    }}
                  >
                    <span className="relative">
                      {link.label}
                      <div className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r 
                                      from-[var(--color-readmore)] to-[var(--color-primary)]
                                      group-hover:w-full transition-all duration-400"></div>
                    </span>
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300
                                    transform translate-x-1.5 group-hover:translate-x-0">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="text-[var(--color-readmore)]"
                      >
                        <path
                          d="M9 18L15 12L9 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-center mt-4 pt-3 border-t border-[rgba(255,255,255,0.04)]">
              <div className="w-6 h-px bg-gradient-to-r from-[var(--color-primary)]/20 via-[var(--color-readmore)]/40 to-[var(--color-primary)]/20"></div>
            </div>
          </div>

          <style jsx="true">{`
            @keyframes elegantSlideIn {
              from {
                opacity: 0;
                transform: translateY(15px) translateX(-8px);
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