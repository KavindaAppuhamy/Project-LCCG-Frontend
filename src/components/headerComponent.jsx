import React from 'react';

const HeaderComponent = ({ scrollToId }) => {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[rgba(11,26,47,0.55)] backdrop-blur-md border-b border-[rgba(255,255,255,0.04)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <img src="public/LCCG-Logo.png" alt="logo" className="w-10 h-10 rounded" />
          <div className="text-[var(--color-primary)] font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
            Leo Club Cinnamon Gardens
          </div>
        </div>

        <nav>
          <ul className="hidden md:flex items-center gap-6 text-[var(--color-primary)]">
            <li className="cursor-pointer hover:text-[var(--color-readmore)] transition-colors duration-300" onClick={() => scrollToId("home")}>Home</li>
            <li className="cursor-pointer hover:text-[var(--color-readmore)] transition-colors duration-300" onClick={() => scrollToId("about")}>About</li>
            <li className="cursor-pointer hover:text-[var(--color-readmore)] transition-colors duration-300" onClick={() => scrollToId("projects")}>Projects</li>
            <li className="cursor-pointer hover:text-[var(--color-readmore)] transition-colors duration-300" onClick={() => scrollToId("newsletter")}>Newsletter</li>
            <li className="cursor-pointer hover:text-[var(--color-readmore)] transition-colors duration-300" onClick={() => scrollToId("testimonials")}>Testimonials</li>
            <li className="cursor-pointer hover:text-[var(--color-readmore)] transition-colors duration-300" onClick={() => scrollToId("excom")}>Excom</li>
            <li className="cursor-pointer hover:text-[var(--color-readmore)] transition-colors duration-300" onClick={() => scrollToId("register")}>Register</li>
          </ul>
        </nav>

        <div className="md:hidden">
          <button onClick={() => scrollToId("register")} className="bg-[var(--color-readmore)] text-[var(--color-accent)] px-3 py-1 rounded-md font-semibold hover:scale-105 transition-transform duration-300">Join</button>
        </div>
      </div>
    </header>
  );
};

export default HeaderComponent;