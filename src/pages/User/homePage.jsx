import React from 'react';

// Sample Home Page Component
const HomePage = () => {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-24 px-6 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="mb-8">
            <span className="inline-block px-6 py-2 bg-gradient-to-r from-[var(--color-primary)]/20 to-[var(--color-highlight)]/20 backdrop-blur-sm border border-[var(--color-primary)]/30 rounded-full text-[var(--color-primary)] text-sm font-medium mb-8">
              ✨ Welcome to the Future
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-[var(--color-heading)] mb-8 leading-tight">
            Welcome to Our
            <span className="block bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-highlight)] to-[var(--color-primary)] bg-clip-text text-transparent animate-pulse">
              Digital World
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-[var(--color-description)] mb-16 max-w-4xl mx-auto leading-relaxed font-light">
            Discover amazing projects, innovative solutions, and cutting-edge technology that transforms bold ideas into extraordinary reality.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className="group relative px-10 py-5 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-highlight)] text-[var(--color-accent)] font-bold rounded-2xl transition-all duration-500 shadow-2xl hover:shadow-[var(--color-primary)]/25 hover:scale-110 overflow-hidden">
              <span className="relative z-10">Get Started</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-highlight)] to-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </button>
            <button className="group relative px-10 py-5 bg-transparent border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-bold rounded-2xl transition-all duration-500 hover:bg-[var(--color-primary)] hover:text-[var(--color-accent)] hover:scale-110 hover:shadow-xl overflow-hidden">
              <span className="relative z-10">Learn More</span>
              <div className="absolute inset-0 bg-[var(--color-primary)] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </button>
          </div>
        </div>
        
        {/* Enhanced Background decorative elements */}
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-gradient-to-r from-[var(--color-primary)]/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-gradient-to-l from-[var(--color-secondary)]/30 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-[var(--color-primary)]/5 via-transparent to-[var(--color-secondary)]/5 rounded-full blur-3xl"></div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-[var(--color-primary)]/30 rounded-full animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            ></div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-accent)]/40 via-[var(--color-accent)]/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black text-[var(--color-secheading)] mb-6">
              What We Offer
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-highlight)] mx-auto rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "Innovation",
                description: "Cutting-edge solutions that push the boundaries of what's possible with next-generation technology.",
                icon: "🚀",
                gradient: "from-blue-500/20 to-purple-500/20"
              },
              {
                title: "Quality",
                description: "Exceptional standards in every project we deliver with meticulous attention to detail.",
                icon: "⭐",
                gradient: "from-yellow-500/20 to-orange-500/20"
              },
              {
                title: "Support",
                description: "24/7 dedicated support to ensure your success every step of your journey with us.",
                icon: "🤝",
                gradient: "from-green-500/20 to-teal-500/20"
              }
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-card)]/60 to-[var(--color-card)]/20 backdrop-blur-xl rounded-3xl border border-white/10 group-hover:border-[var(--color-primary)]/50 transition-all duration-500 group-hover:scale-105"></div>
                <div className="relative p-10 h-full">
                  <div className="mb-8">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} backdrop-blur-sm flex items-center justify-center text-4xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-xl`}>
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-[var(--color-heading)] mb-6 group-hover:text-[var(--color-primary)] transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-[var(--color-description)] leading-relaxed text-lg">
                    {feature.description}
                  </p>
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-highlight)] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-bg)] via-[var(--color-accent)]/20 to-[var(--color-bg)]"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-[var(--color-heading)] mb-4">
              Numbers That Speak
            </h2>
            <p className="text-xl text-[var(--color-description)]">Our achievements in numbers</p>
          </div>
          <div className="grid md:grid-cols-4 gap-10">
            {[
              { number: "500+", label: "Projects Completed", icon: "📊" },
              { number: "100+", label: "Happy Clients", icon: "😊" },
              { number: "50+", label: "Team Members", icon: "👥" },
              { number: "5+", label: "Years Experience", icon: "🏆" }
            ].map((stat, index) => (
              <div key={index} className="group text-center">
                <div className="bg-[var(--color-card)]/40 backdrop-blur-xl rounded-3xl p-8 border border-white/10 group-hover:border-[var(--color-primary)]/30 transition-all duration-500 group-hover:scale-110 group-hover:shadow-2xl">
                  <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-6xl font-black bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-highlight)] bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-[var(--color-secondary)] font-semibold text-lg">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)] via-[var(--color-secondary)] to-[var(--color-accent)]"></div>
        <div className="absolute inset-0 backdrop-blur-sm"></div>
        
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-[var(--color-primary)]/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-40 h-40 bg-[var(--color-highlight)]/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-7xl font-black text-[var(--color-heading)] mb-8 leading-tight">
            Ready to Start Your
            <span className="block bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-highlight)] bg-clip-text text-transparent">
              Amazing Journey?
            </span>
          </h2>
          <p className="text-2xl text-[var(--color-description)] mb-12 leading-relaxed">
            Join thousands of satisfied customers who trust us with their most important projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button className="group relative px-12 py-6 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-highlight)] text-[var(--color-accent)] font-black text-xl rounded-2xl transition-all duration-500 shadow-2xl hover:shadow-[var(--color-primary)]/40 hover:scale-110 overflow-hidden">
              <span className="relative z-10">Get In Touch</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-highlight)] to-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-white/20 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
            </button>
            <button className="group relative px-12 py-6 bg-transparent border-2 border-[var(--color-primary)] text-[var(--color-primary)] font-black text-xl rounded-2xl transition-all duration-500 hover:bg-[var(--color-primary)] hover:text-[var(--color-accent)] hover:scale-110 overflow-hidden">
              <span className="relative z-10">View Portfolio</span>
              <div className="absolute inset-0 bg-[var(--color-primary)] scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-bottom"></div>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;