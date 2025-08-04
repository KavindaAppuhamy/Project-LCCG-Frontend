import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import '../../src/index.css';

const HeaderComponent = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About Us' },
    { to: '/project', label: 'Project' },
    { to: '/newsletter', label: 'Newsletter' },
    { to: '/testimonial', label: 'Testimonial' },
    { to: '/teams', label: 'Teams' },
    { to: '/member-registration', label: 'Member Registration', isSpecial: true },
  ];

  const isActiveLink = (path) => location.pathname === path;

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-[#0B1A2F]/95 backdrop-blur-md shadow-lg border-b border-white/10' 
            : 'bg-[#0B1A2F] shadow-md'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-3 group transition-transform duration-200 hover:scale-105"
            >
              <div className="relative">
                <img
                  src="/public/LCCG-LOGO.png"
                  alt="LCCG Logo"
                  className="h-10 w-auto transition-transform duration-200 group-hover:scale-150"
                />
                <div className="absolute inset-0 bg-[#FFD26F]/20 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <span className="text-xl font-bold text-[#FFD26F] tracking-wide">
                LCCG
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
                    isActiveLink(link.to)
                      ? 'text-[#FFD26F] bg-[#FFD26F]/10'
                      : link.isSpecial
                      ? 'text-white bg-gradient-to-r from-[#FFD26F] to-[#fbbf24] hover:from-[#fbbf24] hover:to-[#FFD26F] px-6 py-2.5 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105'
                      : 'text-white/90 hover:text-[#FFD26F] hover:bg-white/5'
                  }`}
                >
                  {!link.isSpecial && (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#FFD26F] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
                  )}
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`lg:hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen 
              ? 'max-h-screen opacity-100' 
              : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="bg-[#0B1A2F]/98 backdrop-blur-md border-t border-white/10">
            <nav className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActiveLink(link.to)
                      ? 'text-[#FFD26F] bg-[#FFD26F]/10 border-l-4 border-[#FFD26F]'
                      : link.isSpecial
                      ? 'text-white bg-gradient-to-r from-[#FFD26F] to-[#fbbf24] text-center font-semibold shadow-lg'
                      : 'text-white/90 hover:text-[#FFD26F] hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Spacer to prevent content from hiding behind fixed header */}
      <div className="h-16 lg:h-20"></div>
    </>
  );
};

export default HeaderComponent;