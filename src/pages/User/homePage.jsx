import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import ProjectsSection from "../../components/projectComponent";
import Newsletter from "../../components/newslettersComponent";
import TestimonialsComponent from "../../components/testimonialsComponent";
import { supabase, upploadMediaToSupabase } from "../../utill/mediaUpload";
import HeaderComponent from "../../components/HeaderComponent"; // Import the new header component
import RegisterSection from "../../components/registerComponent";
import FooterComponent from "../../components/footerComponent";
import ExcomSection from "../../components/excoCompoent";

/*
  IMPORTANT: Add these CSS variables to your global CSS (e.g. index.css or App.css):

  :root {
    --color-primary: #F0D492;
    --color-accent: #0B1A2F;
    --color-secondary: #4E5C69;
    --color-bg: #1C1F26;
    --color-highlight: #FFD26F;
    --color-card: #202733;
    --color-heading: #FFFFFF;
    --color-secheading: #e5b31d;
    --color-status: #bdbdbd;
    --color-description: #9F9FA9;
    --color-readmore: #fbbf24;
  }

  Also enable smooth scrolling (if not already):
  html { scroll-behavior: smooth; }

  Add these keyframes for animations:
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes pulse-loader {
    0%, 100% { 
      opacity: 1;
      transform: scale(1);
    }
    50% { 
      opacity: 0.7;
      transform: scale(1.05);
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideOutUp {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(-100%);
    }
  }

  @keyframes glow {
    0%, 100% {
      box-shadow: 0 0 20px rgba(240, 212, 146, 0.5);
    }
    50% {
      box-shadow: 0 0 40px rgba(240, 212, 146, 0.8);
    }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }

  @keyframes slideInUp {
    from { transform: translateY(30px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }

  @keyframes fadeInScale {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  Tailwind: this code uses arbitrary value classes (bg-[var(...)]) so ensure your Tailwind config
  allows arbitrary values (default Tailwind v2+ does). If you want to convert these to theme colors,
  add them to tailwind.config.js.
*/

export default function LeoClubPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [modalPdf, setModalPdf] = useState(null);
  const [modalProject, setModalProject] = useState(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "male",
    address: "",
    occupation: "",
    image: null,
    imagePreview: null,
  });

  const pageRef = useRef(null);

  // Loading screen effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 3000); // 3 seconds loading time

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setForm((prev) => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file),
      }));
    } else {
      toast.error("Please select a valid image file (JPEG, PNG, etc.)");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "dob",
      "gender",
      "address",
      "occupation",
    ];

    const missingFields = requiredFields.filter(
      (field) => !form[field] || form[field].toString().trim() === ""
    );
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(", ")}`);
      return;
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Please enter a valid email address (e.g., example@domain.com)");
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(form.phone)) {
      toast.error("Please enter a valid 10-digit phone number (numbers only)");
      return;
    }

    try {
      setIsLoading(true);

      let imageUrl = "";
      if (form.image) {
        imageUrl = "";

        const fileName = Date.now() + "_" + form.image.name;
        const { error: uploadError } = await upploadMediaToSupabase(
          new File([form.image], fileName)
        );
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from("image").getPublicUrl(fileName);
        imageUrl = data.publicUrl;
        imageUrl = "";
      }

      const payload = { ...form, image: imageUrl };
      delete payload.imagePreview;

      const token = localStorage.getItem("adminToken");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/member`, payload, { headers });

      toast.success("Member registered successfully!");

      // Clear the form
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dob: "",
        gender: "male",
        address: "",
        occupation: "",
        image: null,
        imagePreview: null,
      });
      
    } catch (err) {
      console.error("Error creating member:", err);
      if (err.response?.status === 409) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Failed to register member. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const particlesInit = async (main) => {
    await loadFull(main);
  };

  const scrollToId = (id) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  // Loading Screen Component
  if (isPageLoading) {
    return (
      <div className="fixed inset-0 bg-[var(--color-bg)] flex items-center justify-center z-[100] animate-[slideOutUp_0.6s_ease-in-out_2.5s_forwards]">
        {/* Background gradient effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-bg)] via-[var(--color-accent)] to-[var(--color-bg)]"></div>
        
        {/* Animated particles background */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-[var(--color-primary)] rounded-full opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${3 + Math.random() * 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center">
          {/* Loader Container */}
          <div className="relative w-36 h-36 mx-auto mb-6">

            {/* Outer glowing ring */}
            <div className="w-36 h-36 rounded-full border-[3px] border-transparent border-t-[var(--color-primary)] border-r-[var(--color-primary)]
              animate-[spin_3s_linear_infinite] shadow-[0_0_15px_var(--color-primary)] blur-[0.5px]"></div>

            {/* Middle gradient ring */}
            <div className="absolute inset-3 w-30 h-30 rounded-full border-[3px] border-transparent 
              border-b-[var(--color-readmore)] border-l-[var(--color-readmore)]
              animate-[spin_2s_linear_infinite_reverse] shadow-[0_0_12px_var(--color-readmore)] blur-[0.4px]"></div>

            {/* Inner soft ring */}
            <div className="absolute inset-6 w-24 h-24 rounded-full border-[2px] border-transparent 
              border-t-[var(--color-secheading)] border-r-[var(--color-secheading)]
              animate-[spin_1.5s_linear_infinite] shadow-[0_0_10px_var(--color-secheading)]"></div>

            {/* Logo core */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center
                bg-gradient-to-tr from-[var(--color-card)] to-[var(--color-primary)]
                shadow-[0_0_20px_rgba(0,0,0,0.2),0_0_15px_var(--color-primary)]
                animate-[pulse_2s_ease-in-out_infinite]">
                <img
                  src="public/LCCG-Logo.png"
                  alt="LCCG Logo"
                  className="w-12 h-12 object-contain rounded-full drop-shadow-lg"
                />
              </div>
            </div>
          </div>

          {/* Loading text */}
          <div className="mt-8 animate-[fadeInUp_1s_ease-out_0.5s_both]">
            <h3 className="text-2xl font-bold text-[var(--color-primary)] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Leo Club of Cinnamon Gardens
            </h3>
            <p className="text-[var(--color-description)] text-sm">
              Loading experience...
            </p>
            
            {/* Progress dots */}
            <div className="flex justify-center gap-1 mt-4">
              <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-[pulse-loader_1s_ease-in-out_infinite]"></div>
              <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-[pulse-loader_1s_ease-in-out_infinite]" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-[pulse-loader_1s_ease-in-out_infinite]" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-[var(--color-primary)] opacity-10 rounded-full blur-3xl animate-[pulse-loader_3s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-[var(--color-readmore)] opacity-10 rounded-full blur-3xl animate-[pulse-loader_4s_ease-in-out_infinite]"></div>
      </div>
    );
  }

  return (
    <div ref={pageRef} className="relative min-h-screen text-white overflow-hidden">
    <Toaster position="top-right" />

    {/* Full background image */}
    <div
      className="fixed inset-0 z-[-20] bg-cover bg-center"
      style={{
        backgroundImage: `url('/public/background.jpg')`, // change to your image path
        filter: 'blur(4px)',
      }}
    ></div>

    {/* Dark overlay to make text readable */}
    <div className="fixed inset-0 z-[-10] bg-[rgba(0,0,0,0.5)]"></div>

    {/* Global Particles animation on top */}
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: { color: "transparent" },
        fpsLimit: 60,
        interactivity: { events: { onHover: { enable: false }, onClick: { enable: false } } },
        particles: {
          color: { value: "#F0D492" },
          links: { enable: false },
          move: { enable: true, speed: 0.6, outModes: { default: "out" } },
          number: { value: 60, density: { enable: true, area: 800 } },
          opacity: { value: 0.5, random: { enable: true, minimumValue: 0.2 } },
          size: { value: { min: 1, max: 3 } },
        },
        detectRetina: true,
      }}
      className="fixed inset-0 -z-5"
    />

      {/* Use the separated HeaderComponent */}
      {!modalProject && !modalPdf && <HeaderComponent scrollToId={scrollToId} />}
     

      {/* Page content wrapper with top padding to account for fixed header */}
      <main className="pt-5 md:pt-5">
        {/* HERO */}
        {/* HERO SECTION - Professional & Elegant */}
        <section
          id="home"
          className="relative min-h-[100vh] flex flex-col md:flex-row items-center justify-center px-6 md:px-20 py-8 md:py-12 text-center md:text-left overflow-hidden"
        >
          {/* Professional Hero Background */}
          {/* <div
            className="absolute inset-0 z-[-20] bg-cover bg-center bg-fixed"
            style={{
              backgroundImage: "url('/images/hero-bg.jpg')",
              filter: 'brightness(0.4) contrast(1.2)',
            }}
          ></div> */}

          {/* Elegant floating elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Sophisticated geometric shapes */}
            <div className="absolute top-20 left-16 w-32 h-32 bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-secheading)]/5 
                            rounded-full blur-2xl animate-[elegantFloat_8s_ease-in-out_infinite]
                            shadow-[0_0_60px_rgba(240,212,146,0.1)]"></div>
            
            <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-tr from-[var(--color-readmore)]/8 to-transparent 
                            rounded-2xl rotate-45 blur-xl animate-[elegantDrift_12s_ease-in-out_infinite]"
                style={{ animationDelay: "2s" }}></div>
            
            <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-tl from-[var(--color-secheading)]/6 to-transparent 
                            rounded-full blur-3xl animate-[elegantPulse_10s_ease-in-out_infinite]"
                style={{ animationDelay: "4s" }}></div>
            
            <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-br from-[var(--color-primary)]/8 to-[var(--color-readmore)]/4 
                            rounded-3xl rotate-12 blur-2xl animate-[elegantRotate_15s_linear_infinite]"
                style={{ animationDelay: "1s" }}></div>

            {/* Elegant light rays */}
            <div className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-transparent via-[var(--color-primary)]/5 to-transparent 
                            animate-[lightRay_6s_ease-in-out_infinite] blur-sm"></div>
            <div className="absolute top-0 right-1/3 w-1 h-full bg-gradient-to-b from-transparent via-[var(--color-secheading)]/4 to-transparent 
                            animate-[lightRay_8s_ease-in-out_infinite_reverse] blur-sm"
                style={{ animationDelay: "3s" }}></div>
          </div>
          
          {/* Professional keyframe animations */}
          <style jsx>{`
            @keyframes elegantFloat {
              0%, 100% { 
                transform: translateY(0px) translateX(0px) scale(1); 
                opacity: 0.8;
              }
              33% { 
                transform: translateY(-15px) translateX(8px) scale(1.05); 
                opacity: 1;
              }
              66% { 
                transform: translateY(8px) translateX(-5px) scale(0.95); 
                opacity: 0.9;
              }
            }
            
            @keyframes elegantDrift {
              0%, 100% { transform: translateX(0px) translateY(0px) rotate(45deg); }
              25% { transform: translateX(15px) translateY(-20px) rotate(60deg); }
              50% { transform: translateX(-10px) translateY(-10px) rotate(75deg); }
              75% { transform: translateX(-20px) translateY(10px) rotate(30deg); }
            }
            
            @keyframes elegantPulse {
              0%, 100% { transform: scale(1); opacity: 0.6; }
              50% { transform: scale(1.2); opacity: 0.8; }
            }
            
            @keyframes elegantRotate {
              0% { transform: rotate(12deg) scale(1); }
              100% { transform: rotate(372deg) scale(1); }
            }
            
            @keyframes lightRay {
              0%, 100% { opacity: 0.3; }
              50% { opacity: 0.7; }
            }
            
            @keyframes professionalSlideIn {
              from {
                opacity: 0;
                transform: translateY(40px) scale(0.95);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }
            
            @keyframes logoEntrance {
              from {
                opacity: 0;
                transform: translateY(30px) scale(0.9) rotate(-5deg);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1) rotate(0deg);
              }
            }
          `}</style>
          
          {/* Left side - Professional Content */}
          <div className="max-w-4xl relative z-10 md:w-2/3">
            {/* Elegant content container */}
            <div className="space-y-6 animate-[professionalSlideIn_1s_ease-out]">
              
              {/* Professional title section */}
              <div className="space-y-4">
                {/* <div className="inline-block px-4 py-2 bg-gradient-to-r from-[var(--color-primary)]/10 to-transparent 
                                border border-[var(--color-primary)]/20 rounded-full backdrop-blur-sm">
                  <span className="text-[var(--color-primary)] text-sm font-medium tracking-wider uppercase">
                    Service • Leadership • Fellowship
                  </span>
                </div> */}
                
                {/* <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white leading-tight"
                    style={{ fontFamily: "'Inter', 'Playfair Display', serif" }}>
                  We are Leos of
                  <span className="block text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mt-2
                                  bg-gradient-to-r from-[var(--color-secheading)] via-[var(--color-primary)] to-[var(--color-readmore)] 
                                  bg-clip-text text-transparent drop-shadow-2xl">
                    Cinnamon Gardens
                  </span>
                </h1> */}

                <h1
                  className="text-2xl sm:text-4xl md:text-5xl font-bold text-white leading-tight"
                  style={{ fontFamily: "'Montserrat', 'Inter', 'Playfair Display', serif" }}
                >
                  We are Leos of
                  <span
                    className="block text-4xl sm:text-5xl md:text-7xl lg:text-[5rem] font-black mt-2
                                bg-gradient-to-r from-[var(--color-secheading)] via-[var(--color-primary)] to-[var(--color-readmore)] 
                                bg-clip-text text-transparent drop-shadow-2xl"
                    style={{ fontFamily: "'Montserrat', 'Inter', 'Playfair Display', serif" }}
                  >
                    Cinnamon Gardens
                  </span>
                </h1>

                
                {/* Elegant underline */}
                <div className="flex items-center justify-center md:justify-start space-x-4 mt-6">
                  <div className="h-px w-16 bg-gradient-to-r from-transparent to-[var(--color-primary)]"></div>
                  <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-pulse"></div>
                  <div className="h-px w-16 bg-gradient-to-l from-transparent to-[var(--color-primary)]"></div>
                </div>
              </div>

              {/* Professional description */}
              <div className="space-y-4 animate-[professionalSlideIn_1s_ease-out_0.2s_both]">
                <p className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-2xl">
                  Together we serve, lead and grow through meaningful community impact.
                </p>
                {/* <p className="text-base text-white/70 leading-relaxed max-w-2xl">
                  Join our passionate community of young leaders dedicated to creating positive change 
                  in Colombo and beyond through innovative service projects and leadership development.
                </p> */}
              </div>

              {/* Professional CTA section */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center 
                              justify-center md:justify-start gap-4 pt-8 
                              animate-[professionalSlideIn_1s_ease-out_0.4s_both]">
                <button
                  onClick={() => scrollToId("register")}
                  className="group relative px-8 py-4 bg-gradient-to-r from-[var(--color-readmore)] to-[var(--color-primary)]
                            text-[var(--color-accent)] font-semibold rounded-xl shadow-lg
                            hover:shadow-[0_10px_40px_rgba(240,212,146,0.3)] hover:scale-105 
                            transition-all duration-300 overflow-hidden"
                >
                  <span className="relative z-10">Join our Movement</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-readmore)] 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
                
                {/* <button
                  onClick={() => scrollToId("about")}
                  className="px-8 py-4 border border-white/20 text-white font-medium rounded-xl
                            backdrop-blur-sm hover:bg-white/10 hover:border-[var(--color-primary)]/40
                            transition-all duration-300"
                >
                  Learn More
                </button> */}
              </div>
            </div>
          </div>

        {/* Right side - Professional Logo */}
        <div className="relative z-10 mt-12 md:mt-0 md:w-1/3 flex justify-center md:justify-end">
          <div className="animate-[logoEntrance_1.2s_ease-out_0.6s_both]">
            <div className="relative group">
              {/* Logo Only */}
              <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 flex items-center justify-center">
                <img
                  src="LCCG-Logo.png"
                  alt="Leos of Cinnamon Gardens Logo"
                  className="w-full h-full object-contain drop-shadow-2xl 
                            group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Subtle glow effect on hover */}
              <div className="absolute inset-0 rounded-full bg-[var(--color-primary)]/20 blur-3xl opacity-0 
                              group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
            </div>
          </div>
        </div>
        </section>

        {/* ABOUT SECTION - Professional & Elegant */}
        <section id="about" className="relative min-h-[100vh] py-24 px-6 md:px-12 overflow-hidden">
          {/* Professional About Background */}
          <div
            className="absolute inset-0 z-[-20] bg-cover bg-center bg-fixed"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1920&q=80')`,
              filter: 'brightness(0.3) contrast(1.1)',
            }}
          ></div>
          
          <div className="absolute inset-0 z-[-10] bg-[rgba(0,0,0,0.8)]"></div>

          <div className="absolute inset-0">
            {/* <div className="absolute inset-0 bg-[rgba(0,0,0,0.6)] backdrop-blur-[4px]" /> */}
            <div className="absolute inset-0 z-[-10] bg-[rgba(0,0,0,0.8)] backdrop-blur-[30px]" />
            <div className="absolute top-20 right-1/4 w-28 h-28 bg-[var(--color-secheading)] opacity-10 rounded-full blur-2xl animate-[pulse_3.5s_ease-in-out_infinite]"></div>
            <div className="absolute bottom-20 left-1/4 w-44 h-44 bg-[var(--color-accent)] opacity-12 rounded-full blur-3xl animate-[pulse_4.5s_ease-in-out_infinite]" style={{animationDelay: '1s'}}></div>
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            
            {/* Professional section header */}
            <div className="text-center mb-16 animate-[professionalSlideIn_1s_ease-out]">
              {/* <div className="inline-block px-6 py-3 bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-secheading)]/5 
                              border border-[var(--color-primary)]/20 rounded-full backdrop-blur-sm mb-6">
                <span className="text-[var(--color-primary)] text-sm font-medium tracking-wider uppercase">
                  Our Story
                </span>
              </div> */}
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4
                            bg-gradient-to-r from-[var(--color-secheading)] via-[var(--color-primary)] to-[var(--color-readmore)] 
                            bg-clip-text text-transparent">
                About Us
              </h2>
              <div className="flex items-center justify-center space-x-4">
                <div className="h-px w-20 bg-gradient-to-r from-transparent to-[var(--color-primary)]"></div>
                <div className="w-3 h-3 bg-[var(--color-primary)] rounded-full animate-pulse"></div>
                <div className="h-px w-20 bg-gradient-to-l from-transparent to-[var(--color-primary)]"></div>
              </div>
            </div>

            {/* Professional content grid */}
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              
              {/* Professional image container */}
              <div className="relative animate-[professionalSlideIn_1s_ease-out_0.2s_both]">
                <div className="relative group">
                  {/* Main image container */}
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl 
                                  hover:shadow-[0_25px_50px_rgba(240,212,146,0.15)] 
                                  transition-all duration-500 hover:scale-105">
                    <img 
                      // src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80" 
                      src="public/about.jpg" 
                      alt="Leo Club Community Service" 
                      className="w-full h-[400px] lg:h-[500px] object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    {/* Professional overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent"></div>
                  </div>
                  
                  {/* Decorative frame */}
                  <div className="absolute -inset-4 rounded-3xl border border-[var(--color-primary)]/20 -z-10
                                  group-hover:border-[var(--color-primary)]/40 transition-colors duration-300"></div>
                  
                  {/* Professional accent elements */}
                  <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-readmore)]
                                  rounded-2xl shadow-lg flex items-center justify-center">
                    <div className="w-6 h-6 bg-white rounded-lg"></div>
                  </div>
                </div>
              </div>

              {/* Professional content */}
              <div className="space-y-8 animate-[professionalSlideIn_1s_ease-out_0.4s_both]">
                
                {/* Professional text content */}
                <div className="space-y-6">
                  <div className="prose prose-lg prose-invert max-w-none">
                    <p className="text-white/90 leading-relaxed text-lg">
                      Founded in 2023 under Lions Clubs International, the Leo Club of Cinnamon Gardens Colombo 
                      is a <span className="text-[var(--color-primary)] font-semibold">vibrant non-profit organization </span> 
                      grounded in strong community values.
                    </p>
                    
                    <p className="text-white/80 leading-relaxed">
                      Led by dedicated leaders and supported by distinguished mentors, the club has rapidly grown 
                      to include over <span className="text-[var(--color-secheading)] font-semibold">100 passionate members </span> 
                      aged 18 to 30.
                    </p>
                    
                    <p className="text-white/75 leading-relaxed">
                      Guided by the motto <em className="text-[var(--color-readmore)]">"Serving with Heart and Vision," </em> 
                      we are deeply committed to leadership development, community service, and fellowship through 
                      education drives, environmental initiatives, and various outreach efforts.
                    </p>
                  </div>
                  
                  {/* Professional stats or highlights */}
                  <div className="grid grid-cols-3 gap-6 py-6 border-y border-white/10">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[var(--color-primary)]">100+</div>
                      <div className="text-sm text-white/60 uppercase tracking-wide">Members</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[var(--color-secheading)]">50+</div>
                      <div className="text-sm text-white/60 uppercase tracking-wide">Projects</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[var(--color-readmore)]">2023</div>
                      <div className="text-sm text-white/60 uppercase tracking-wide">Founded</div>
                    </div>
                  </div>
                </div>

                {/* Professional action buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button 
                    onClick={() => scrollToId('projects')} 
                    className="group relative px-8 py-4 bg-gradient-to-r from-[var(--color-secheading)] to-[var(--color-primary)]
                              text-[var(--color-accent)] font-semibold rounded-xl shadow-lg
                              hover:shadow-[0_10px_40px_rgba(229,179,29,0.3)] hover:scale-105 
                              transition-all duration-300 overflow-hidden"
                  >
                    <span className="relative z-10">View Our Projects</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secheading)] 
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                  
                  <button 
                    onClick={() => scrollToId('newsletter')} 
                    className="px-8 py-4 border border-white/20 text-white font-medium rounded-xl
                              backdrop-blur-sm hover:bg-white/10 hover:border-[var(--color-primary)]/40
                              transition-all duration-300"
                  >
                    Read Newsletter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROJECTS SECTION - Professional & Elegant */}
        {/* COMBINED PROJECTS SECTION - Professional & Elegant */}
        <section id="projects" className="relative overflow-hidden py-16">
          {/* Projects Background */}
          <div
            className="absolute inset-0 z-[-20] bg-cover bg-center bg-fixed"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1920&q=80')`,
              filter: 'brightness(0.5) contrast(1.1)',
            }}
          ></div>
          {/* Dark overlay */}
          <div className="absolute inset-0 z-[-10] bg-[rgba(0,0,0,0.7)]"></div>
          
          {/* Enhanced ambient effects combining both designs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Elegant effects with gradients */}
            <div className="absolute top-20 right-24 w-32 h-32 bg-gradient-to-br from-[var(--color-primary)]/8 to-transparent 
                            rounded-full blur-3xl animate-[elegantPulse_6s_ease-in-out_infinite]"></div>
            <div className="absolute bottom-24 left-20 w-48 h-48 bg-gradient-to-tr from-[var(--color-secheading)]/6 to-transparent 
                            rounded-full blur-3xl animate-[elegantPulse_8s_ease-in-out_infinite]" 
                style={{animationDelay: '3s'}}></div>
            <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-br from-[var(--color-readmore)]/10 to-transparent 
                            rounded-2xl rotate-45 blur-2xl animate-[elegantRotate_20s_linear_infinite]"
                style={{animationDelay: '1s'}}></div>
            
            {/* Original pulsing effects */}
            <div className="absolute top-1/4 left-10 w-40 h-40 bg-[var(--color-readmore)] opacity-8 rounded-full blur-3xl 
                            animate-[pulse_5s_ease-in-out_infinite]"></div>
            <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-[var(--color-primary)] opacity-12 rounded-full blur-2xl 
                            animate-[pulse_4s_ease-in-out_infinite]" 
                style={{animationDelay: '2s'}}></div>
          </div>
          <div className="relative z-10">
            <ProjectsSection
              modalProject={modalProject}
              setModalProject={setModalProject}
            />
          </div>
        </section>

        {/* NEWSLETTER SECTION - Professional & Elegant */}
        <section id="newsletter" className="relative overflow-hidden py-24">
          {/* Professional Newsletter Background */}
          <div
            className="absolute inset-0 z-[-20] bg-cover bg-center bg-fixed"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=1920&q=80')`,
              filter: 'brightness(0.3) contrast(1.1)',
            }}
          ></div>
          
          <div className="absolute inset-0 z-[-10] bg-[rgba(0,0,0,0.8)]"></div>

          {/* Elegant ambient effects */}
          <div className="absolute inset-0">
            {/* <div className="absolute inset-0 bg-[rgba(0,0,0,0.6)] backdrop-blur-[4px]" /> */}
            <div className="absolute inset-0 z-[-10] bg-[rgba(0,0,0,0.8)] backdrop-blur-[30px]" />
            <div className="absolute top-20 right-1/4 w-28 h-28 bg-[var(--color-secheading)] opacity-10 rounded-full blur-2xl animate-[pulse_3.5s_ease-in-out_infinite]"></div>
            <div className="absolute bottom-20 left-1/4 w-44 h-44 bg-[var(--color-accent)] opacity-12 rounded-full blur-3xl animate-[pulse_4.5s_ease-in-out_infinite]" style={{animationDelay: '1s'}}></div>
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
              <Newsletter modalPdf={modalPdf} setModalPdf={setModalPdf} />  
          </div>
        </section>

        {/* TESTIMONIALS SECTION - Professional & Elegant */}
        <section id="testimonials" className="relative overflow-hidden py-16">
          {/* Professional Testimonials Background */}
          <div
            className="absolute inset-0 z-[-20] bg-cover bg-center bg-fixed"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1920&q=80')`,
              filter: 'brightness(0.5) contrast(1.1)',
            }}
          ></div>
          
          <div className="absolute inset-0 z-[-10] bg-[rgba(0,0,0,0.7)]"></div>

          {/* Elegant ambient effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-24 w-32 h-32 bg-gradient-to-br from-[var(--color-primary)]/8 to-transparent 
                            rounded-full blur-3xl animate-[float_8s_ease-in-out_infinite]"></div>
            <div className="absolute bottom-24 left-20 w-48 h-48 bg-gradient-to-tr from-[var(--color-secheading)]/6 to-transparent 
                            rounded-full blur-3xl animate-[float_10s_ease-in-out_infinite]" 
                style={{animationDelay: '4s'}}></div>
            <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-gradient-to-br from-[var(--color-readmore)]/10 to-transparent 
                            rounded-full blur-2xl animate-[float_6s_ease-in-out_infinite]"
                style={{animationDelay: '2s'}}></div>
            <div className="absolute top-1/3 right-1/3 w-36 h-36 bg-[var(--color-readmore)] opacity-8 rounded-full blur-3xl 
                            animate-[float_12s_ease-in-out_infinite]" style={{animationDelay: '6s'}}></div>
            <div className="absolute bottom-1/3 left-1/4 w-28 h-28 bg-[var(--color-primary)] opacity-12 rounded-full blur-2xl 
                            animate-[float_9s_ease-in-out_infinite]" style={{animationDelay: '3s'}}></div>
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="relative z-10 animate-[professionalSlideIn_1s_ease-out_0.2s_both]">
              <TestimonialsComponent />
            </div>
          </div>
        </section>

        {/* EXCOM SECTION - Professional & Elegant */}
        <section
          id="excom"
          className="relative overflow-hidden py-24"
        >
          {/* Professional Excom Background */}
          <div
            className="absolute inset-0 z-[-20] bg-cover bg-center bg-fixed"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1920&q=80')`,
              filter: 'brightness(0.3) contrast(1.1)',
            }}
          ></div>

          <div className="absolute inset-0 z-[-10] bg-[rgba(0,0,0,0.8)]"></div>

          {/* Elegant ambient effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 z-[-10] bg-[rgba(0,0,0,0.8)] backdrop-blur-[30px]" />

            <div className="absolute top-16 left-1/2 w-42 h-42 bg-[var(--color-secheading)] opacity-6 
                  rounded-full blur-3xl animate-[pulse_6s_ease-in-out_infinite]"></div>
            <div className="absolute bottom-20 left-1/3 w-36 h-36 bg-[var(--color-secheading)] opacity-8 
                  rounded-full blur-2xl animate-[pulse_4.2s_ease-in-out_infinite]" 
                  style={{ animationDelay: "2.2s" }}></div>
            <div className="absolute top-1/2 right-1/4 w-40 h-40 bg-[var(--color-secheading)] opacity-7
                  rounded-full blur-2xl animate-[pulse_3.6s_ease-in-out_infinite]" 
                  style={{ animationDelay: "1.8s" }}></div>
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            {/* Professional Excom Section */}
            <div className="relative animate-[professionalSlideIn_1s_ease-out_both]">
              <ExcomSection />
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
          `}</style>
        </section>


        {/* REGISTER SECTION - Professional & Elegant */}
        <section id="register" className="relative overflow-hidden py-16">
          {/* Professional Register Background */}
          <div
            className="absolute inset-0 z-[-20] bg-cover bg-center bg-fixed"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1920&q=80')`,
              filter: 'brightness(0.5) contrast(1.1)',
            }}
          ></div>
          
          <div className="absolute inset-0 z-[-10] bg-[rgba(0,0,0,0.8)]"></div>

          {/* Elegant ambient effects */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-24 w-32 h-32 bg-gradient-to-br from-[var(--color-readmore)]/8 to-transparent 
                            rounded-full blur-3xl animate-[elegantPulse_6s_ease-in-out_infinite]"></div>
            <div className="absolute bottom-24 left-20 w-48 h-48 bg-gradient-to-tr from-[var(--color-primary)]/6 to-transparent 
                            rounded-full blur-3xl animate-[elegantPulse_8s_ease-in-out_infinite]" 
                style={{animationDelay: '3s'}}></div>
            <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-br from-[var(--color-secheading)]/10 to-transparent 
                            rounded-2xl rotate-45 blur-2xl animate-[elegantRotate_20s_linear_infinite]"
                style={{animationDelay: '1s'}}></div>
          </div>

          <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-8">
            {/* Professional form container */}
            <div className="relative animate-[professionalSlideIn_1s_ease-out_0.2s_both]">
                <div className="p-8">
                  <RegisterSection
                    form={form}
                    setForm={setForm}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    handleImageChange={handleImageChange}
                    isLoading={isLoading}
                  />
                </div>
            </div>
          </div>
        </section>

        {/* Professional Animations - Add to your CSS */}
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

          @keyframes elegantPulse {
            0%, 100% {
              opacity: 0.4;
              transform: scale(1);
            }
            50% {
              opacity: 0.8;
              transform: scale(1.05);
            }
          }

          @keyframes elegantRotate {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>


        {/* FOOTER */}
        <footer >
          <FooterComponent/>
        </footer>

      </main>
    </div>
  );
}