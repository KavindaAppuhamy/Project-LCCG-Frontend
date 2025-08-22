import React from 'react';

const FooterComponent = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'Facebook',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      href: '#',
    },
    {
      name: 'Instagram',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.988 11.988 11.988c6.62 0 11.988-5.367 11.988-11.988C24.005 5.367 18.637.001 12.017.001zM8.449 16.988c-2.458 0-4.467-2.01-4.467-4.468s2.009-4.468 4.467-4.468c2.46 0 4.47 2.01 4.47 4.468s-2.01 4.468-4.47 4.468zM16.553 6.046c-.584 0-1.056-.472-1.056-1.055s.472-1.056 1.056-1.056 1.056.473 1.056 1.056-.472 1.055-1.056 1.055z"/>
        </svg>
      ),
      href: '#',
    },
    {
      name: 'LinkedIn',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      href: '#',
    },
    {
      name: 'Twitter',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      ),
      href: '#',
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
                  Leo Club of Cinnamon Gardens
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
                  info@leoclub-cg.org
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
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            {/* Copyright */}
            <div className="text-[var(--color-description)] text-xs flex items-center space-x-2">
              <div className="w-1 h-1 bg-[var(--color-primary)]/60 rounded-full"></div>
              <p>&copy; {currentYear} Leo Club of Cinnamon Gardens. All rights reserved.</p>
            </div>

            {/* Links */}
            <div className="flex space-x-4 text-xs">
              {['Privacy', 'Terms', 'Contact'].map((link, index) => (
                <a 
                  key={link}
                  href="#" 
                  className="text-[var(--color-description)] hover:text-[var(--color-primary)] 
                             transition-colors duration-300 relative group"
                >
                  {link}
                  <div className="absolute bottom-0 left-0 w-0 h-px bg-[var(--color-primary)] 
                                  group-hover:w-full transition-all duration-300"></div>
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
                <svg className="w-3 h-3 transform group-hover:-translate-y-0.5 transition-transform duration-300" 
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
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