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
    { id: "excom", label: "Excom" },
    { id: "register", label: "Register" },
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
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Leo Club Cinnamon Gardens
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
        <div className="md:hidden bg-[rgba(11,26,47,0.95)] backdrop-blur-md border-t border-[rgba(255,255,255,0.04)] px-6 py-4">
          <ul className="flex flex-col gap-4 text-[var(--color-primary)]">
            {navLinks.map((link) => (
              <li
                key={link.id}
                className="cursor-pointer hover:text-[var(--color-readmore)] transition-colors duration-300"
                onClick={() => {
                  scrollToId(link.id);
                  setMenuOpen(false);
                }}
              >
                {link.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};

export default HeaderComponent;
