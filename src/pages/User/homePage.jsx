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
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
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
              Leo Club Cinnamon Gardens
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
      <HeaderComponent scrollToId={scrollToId} />

      {/* Page content wrapper with top padding to account for fixed header */}
      <main className="pt-20">
        {/* HERO */}
        <section
          id="home"
          className="relative min-h-[75vh] flex flex-col md:flex-row items-center md:items-center justify-center md:justify-between px-6 md:px-20 py-20 text-center md:text-left"
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Floating orbs with various movements */}
            <div className="absolute top-16 left-8 w-24 h-24 bg-[var(--color-primary)] opacity-15 rounded-full blur-2xl animate-[float_6s_ease-in-out_infinite]"></div>
            <div 
              className="absolute top-32 right-16 w-32 h-32 bg-[var(--color-readmore)] opacity-12 rounded-full blur-2xl animate-[float_8s_ease-in-out_infinite_reverse]"
              style={{ animationDelay: "1s" }}
            ></div>
            <div 
              className="absolute bottom-24 left-20 w-40 h-40 bg-[var(--color-secheading)] opacity-8 rounded-full blur-3xl animate-[float_10s_ease-in-out_infinite]"
              style={{ animationDelay: "2s" }}
            ></div>
            <div 
              className="absolute bottom-16 right-8 w-28 h-28 bg-[var(--color-primary)] opacity-10 rounded-full blur-2xl animate-[drift_12s_linear_infinite]"
              style={{ animationDelay: "3s" }}
            ></div>
            <div 
              className="absolute top-1/2 left-1/4 w-20 h-20 bg-[var(--color-readmore)] opacity-18 rounded-full blur-xl animate-[pulse_4s_ease-in-out_infinite]"
              style={{ animationDelay: "1.5s" }}
            ></div>
            <div 
              className="absolute top-3/4 right-1/3 w-36 h-36 bg-[var(--color-secheading)] opacity-6 rounded-full blur-3xl animate-[float_7s_ease-in-out_infinite_reverse]"
              style={{ animationDelay: "4s" }}
            ></div>
            
            {/* Gradient waves */}
            <div 
              className="absolute -top-10 -left-10 w-80 h-80 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-readmore)] opacity-5 rounded-full blur-3xl animate-[rotate_20s_linear_infinite]"
            ></div>
            <div 
              className="absolute -bottom-10 -right-10 w-96 h-96 bg-gradient-to-tl from-[var(--color-readmore)] to-[var(--color-secheading)] opacity-4 rounded-full blur-3xl animate-[rotate_25s_linear_infinite_reverse]"
              style={{ animationDelay: "5s" }}
            ></div>
          </div>
          
          {/* Custom animations */}
          <style jsx>{`
            @keyframes float {
              0%, 100% { transform: translateY(0px) scale(1); }
              50% { transform: translateY(-20px) scale(1.05); }
            }
            
            @keyframes drift {
              0% { transform: translateX(0px) translateY(0px); }
              25% { transform: translateX(10px) translateY(-15px); }
              50% { transform: translateX(-5px) translateY(-10px); }
              75% { transform: translateX(-15px) translateY(5px); }
              100% { transform: translateX(0px) translateY(0px); }
            }
            
            @keyframes rotate {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            
            @keyframes slideInUp {
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
          
          {/* Left side - Content */}
          <div className="max-w-4xl relative z-10 md:w-2/3">
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--color-heading)] leading-tight drop-shadow-lg animate-[slideInUp_0.8s_ease-out]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              We are Leos of
            </h1>
            <h1
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold text-[var(--color-secheading)] leading-tight drop-shadow-lg animate-[slideInUp_0.8s_ease-out]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <span className="text-yellow-500">Cinnamon Gardens</span>
            </h1>
            <p className="mt-1 text-[var(--color-description)] text-base sm:text-lg animate-[slideInUp_0.8s_ease-out_0.2s_both]">
              Together we serve, lead and grow. <br className="hidden sm:block" /> 
              Join our community-driven projects and make an impact.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center sm:items-start md:items-center justify-center md:justify-start gap-4 animate-[slideInUp_0.8s_ease-out_0.4s_both]">
              <button
                onClick={() => scrollToId("register")}
                className="px-6 py-3 rounded-lg font-semibold bg-[var(--color-readmore)] text-[var(--color-accent)] shadow hover:scale-105 transition-transform duration-300"
              >
                Join our Movement
              </button>
            </div>
          </div>

          {/* Right side - Logo */}
          <div className="relative z-10 mt-10 md:mt-0 md:w-1/3 flex justify-center md:justify-end">
            <div className="animate-[slideInUp_0.8s_ease-out_0.6s_both]">
              <img
                src="LCCG-Logo.png"
                alt="Leos of Cinnamon Gardens Logo"
                className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="relative py-37 px-6 md:px-12 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-10 right-20 w-24 h-24 bg-[var(--color-primary)] opacity-10 rounded-full blur-2xl animate-[pulse_4s_ease-in-out_infinite]"></div>
            <div className="absolute bottom-10 left-20 w-36 h-36 bg-[var(--color-accent)] opacity-15 rounded-full blur-2xl animate-[pulse_3s_ease-in-out_infinite]" style={{animationDelay: '1.5s'}}></div>
          </div>

          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center relative z-10">
            <div className="rounded-2xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-500 animate-[fadeInScale_0.8s_ease-out]">
              <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80" alt="about" className="w-full h-full object-cover" />
            </div>
            <div className="animate-[slideInUp_0.8s_ease-out_0.2s_both]">
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-secheading)] mb-4">About Us</h2>
              <p className="text-[var(--color-heading)] leading-relaxed">Founded in 2023 under Lions Clubs International, the Leo Club of Cinnamon Gardens Colombo is a vibrant non-profit organization grounded in strong community values. Led by President Leo [Name] and Vice President Leo [Name], and supported by distinguished mentors such as [Mentor Names], the club has rapidly grown to include over 100 passionate members aged 18 to 30. Guided by the motto "Serving with Heart and Vision," the club is deeply committed to leadership development, community service, and fellowship. Their programs address critical social needs through education drives, tree planting initiatives, senior citizen support, and various outreach efforts—reflecting a steadfast dedication to fostering meaningful, positive change in society.</p>
              <div className="mt-6 flex gap-4">
                <button onClick={() => scrollToId('projects')} className="px-5 py-2 rounded-md bg-[var(--color-readmore)] text-[var(--color-accent)] font-semibold hover:scale-105 transition-transform duration-300">View Projects</button>
                <button onClick={() => scrollToId('newsletter')} className="px-5 py-2 rounded-md border border-[rgba(255,255,255,0.06)] hover:border-[var(--color-primary)] transition-colors duration-300">Newsletter</button>
              </div>
            </div>
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" className="relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-10 w-40 h-40 bg-[var(--color-readmore)] opacity-8 rounded-full blur-3xl animate-[pulse_5s_ease-in-out_infinite]"></div>
            <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-[var(--color-primary)] opacity-12 rounded-full blur-2xl animate-[pulse_4s_ease-in-out_infinite]" style={{animationDelay: '2s'}}></div>
          </div>
          <div className="relative z-10">
            <ProjectsSection />
          </div>
        </section>

        {/* NEWSLETTER */}
        <section id="newsletter" className="relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 right-1/4 w-28 h-28 bg-[var(--color-secheading)] opacity-10 rounded-full blur-2xl animate-[pulse_3.5s_ease-in-out_infinite]"></div>
            <div className="absolute bottom-20 left-1/4 w-44 h-44 bg-[var(--color-accent)] opacity-12 rounded-full blur-3xl animate-[pulse_4.5s_ease-in-out_infinite]" style={{animationDelay: '1s'}}></div>
          </div>
          <div className="relative z-10">
            <Newsletter />
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section id="testimonials" className="relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-10 left-1/3 w-36 h-36 bg-[var(--color-primary)] opacity-8 rounded-full blur-3xl animate-[pulse_4s_ease-in-out_infinite]"></div>
            <div className="absolute bottom-10 right-1/3 w-52 h-52 bg-[var(--color-readmore)] opacity-6 rounded-full blur-3xl animate-[pulse_5s_ease-in-out_infinite]" style={{animationDelay: '2.5s'}}></div>
          </div>
          <div className="relative z-10">
            <TestimonialsComponent />
          </div>
        </section>

        {/* EXCOM */}
        <section id="excom" className="relative py-16 px-6 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-1/3 left-20 w-32 h-32 bg-[var(--color-accent)] opacity-15 rounded-full blur-2xl animate-[pulse_3s_ease-in-out_infinite]"></div>
            <div className="absolute bottom-1/3 right-20 w-40 h-40 bg-[var(--color-primary)] opacity-10 rounded-full blur-3xl animate-[pulse_4s_ease-in-out_infinite]" style={{animationDelay: '1.5s'}}></div>
            <div className="absolute top-10 right-1/2 w-20 h-20 bg-[var(--color-readmore)] opacity-12 rounded-full blur-xl animate-[pulse_2.5s_ease-in-out_infinite]" style={{animationDelay: '0.5s'}}></div>
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <h3 className="text-3xl font-bold text-[var(--color-secheading)] mb-6 animate-[slideInUp_0.6s_ease-out]">Meet the Excom</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="p-6 rounded-2xl bg-[var(--color-card)] text-center hover:scale-105 transition-transform duration-300 animate-[fadeInScale_0.8s_ease-out]" style={{animationDelay: `${i * 0.1}s`}}>
                  <div className="mx-auto w-28 h-28 rounded-full bg-[var(--color-secondary)] flex items-center justify-center text-[var(--color-primary)] font-bold text-xl shadow-md animate-[float_3s_ease-in-out_infinite]" style={{animationDelay: `${i * 0.3}s`}}>L{i + 1}</div>
                  <h4 className="mt-4 font-semibold text-[var(--color-primary)]">Leo Name {i + 1}</h4>
                  <p className="text-[var(--color-description)] text-sm">Position</p>
                  <div className="mt-3 flex justify-center gap-3 text-[var(--color-primary)]">
                    <a href="#" className="hover:text-[var(--color-readmore)] transition-colors duration-300">Li</a>
                    <a href="#" className="hover:text-[var(--color-readmore)] transition-colors duration-300">Em</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* REGISTER FORM - Using CSS Custom Properties */}
        <section id="register" className="relative py-16 px-6 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-1/4 w-48 h-48 bg-[var(--color-primary)] opacity-8 rounded-full blur-3xl animate-[pulse_5s_ease-in-out_infinite]"></div>
            <div className="absolute bottom-20 right-1/4 w-36 h-36 bg-[var(--color-readmore)] opacity-10 rounded-full blur-2xl animate-[pulse_4s_ease-in-out_infinite]" style={{animationDelay: '2s'}}></div>
            <div className="absolute top-1/2 right-10 w-24 h-24 bg-[var(--color-secheading)] opacity-12 rounded-full blur-xl animate-[pulse_3s_ease-in-out_infinite]" style={{animationDelay: '1s'}}></div>
          </div>

          <div className="max-w-4xl mx-auto relative z-10">
            <h3 className="text-3xl font-bold text-[var(--color-secheading)] mb-6 animate-[slideInUp_0.6s_ease-out]">
              Register New Member
            </h3>

            {/* Form card using CSS custom properties */}
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 rounded-2xl
                        bg-[var(--color-card)] backdrop-blur-lg
                        border border-[var(--color-secondary)] shadow-lg
                        animate-[fadeInScale_0.8s_ease-out_0.2s_both]"
              style={{ borderColor: 'rgba(78, 92, 105, 0.3)' }}
            >
              {/* Input fields with consistent styling using CSS custom properties */}
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="First Name*"
                className="p-3 rounded-lg bg-[var(--color-bg)] text-[var(--color-heading)]
                          placeholder:text-[var(--color-description)]
                          border border-[var(--color-secondary)] focus:border-[var(--color-primary)]
                          focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-30
                          outline-none transition-all duration-300 hover:border-[var(--color-highlight)]"
                style={{ 
                  borderColor: 'rgba(78, 92, 105, 0.4)',
                  backgroundColor: 'rgba(28, 31, 38, 0.7)'
                }}
              />

              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Last Name*"
                className="p-3 rounded-lg bg-[var(--color-bg)] text-[var(--color-heading)]
                          placeholder:text-[var(--color-description)]
                          border border-[var(--color-secondary)] focus:border-[var(--color-primary)]
                          focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-30
                          outline-none transition-all duration-300 hover:border-[var(--color-highlight)]"
                style={{ 
                  borderColor: 'rgba(78, 92, 105, 0.4)',
                  backgroundColor: 'rgba(28, 31, 38, 0.7)'
                }}
              />

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email*"
                type="email"
                className="p-3 rounded-lg bg-[var(--color-bg)] text-[var(--color-heading)]
                          placeholder:text-[var(--color-description)]
                          border border-[var(--color-secondary)] focus:border-[var(--color-primary)]
                          focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-30
                          outline-none transition-all duration-300 hover:border-[var(--color-highlight)]"
                style={{ 
                  borderColor: 'rgba(78, 92, 105, 0.4)',
                  backgroundColor: 'rgba(28, 31, 38, 0.7)'
                }}
              />

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone*"
                type="tel"
                className="p-3 rounded-lg bg-[var(--color-bg)] text-[var(--color-heading)]
                          placeholder:text-[var(--color-description)]
                          border border-[var(--color-secondary)] focus:border-[var(--color-primary)]
                          focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-30
                          outline-none transition-all duration-300 hover:border-[var(--color-highlight)]"
                style={{ 
                  borderColor: 'rgba(78, 92, 105, 0.4)',
                  backgroundColor: 'rgba(28, 31, 38, 0.7)'
                }}
              />

              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                className="p-3 rounded-lg bg-[var(--color-bg)] text-[var(--color-heading)]
                          placeholder:text-[var(--color-description)]
                          border border-[var(--color-secondary)] focus:border-[var(--color-primary)]
                          focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-30
                          outline-none transition-all duration-300 hover:border-[var(--color-highlight)]"
                style={{ 
                  borderColor: 'rgba(78, 92, 105, 0.4)',
                  backgroundColor: 'rgba(28, 31, 38, 0.7)'
                }}
              />

              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="p-3 rounded-lg bg-[var(--color-bg)] text-[var(--color-heading)]
                          border border-[var(--color-secondary)] focus:border-[var(--color-primary)]
                          focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-30
                          outline-none transition-all duration-300 hover:border-[var(--color-highlight)]"
                style={{ 
                  borderColor: 'rgba(78, 92, 105, 0.4)',
                  backgroundColor: 'rgba(28, 31, 38, 0.7)'
                }}
              >
                <option value="" disabled style={{ color: 'var(--color-description)' }}>Select gender</option>
                <option value="male" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-heading)' }}>Male</option>
                <option value="female" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-heading)' }}>Female</option>
                <option value="other" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-heading)' }}>Other</option>
              </select>

              <input
                name="occupation"
                value={form.occupation}
                onChange={handleChange}
                placeholder="Occupation*"
                className="p-3 rounded-lg bg-[var(--color-bg)] text-[var(--color-heading)]
                          placeholder:text-[var(--color-description)]
                          border border-[var(--color-secondary)] focus:border-[var(--color-primary)]
                          focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-30
                          outline-none transition-all duration-300 hover:border-[var(--color-highlight)]"
                style={{ 
                  borderColor: 'rgba(78, 92, 105, 0.4)',
                  backgroundColor: 'rgba(28, 31, 38, 0.7)'
                }}
              />

              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Address*"
                rows={3}
                className="p-3 rounded-lg bg-[var(--color-bg)] text-[var(--color-heading)]
                          placeholder:text-[var(--color-description)] md:col-span-2
                          border border-[var(--color-secondary)] focus:border-[var(--color-primary)]
                          focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-30
                          outline-none transition-all duration-300 hover:border-[var(--color-highlight)] resize-vertical"
                style={{ 
                  borderColor: 'rgba(78, 92, 105, 0.4)',
                  backgroundColor: 'rgba(28, 31, 38, 0.7)'
                }}
              />

              <div className="md:col-span-2">
                <label className="block text-sm mb-2 text-[var(--color-description)] font-medium">Profile Image</label>

                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full p-3 rounded-lg bg-[var(--color-bg)] text-[var(--color-heading)]
                              border border-[var(--color-secondary)] hover:border-[var(--color-highlight)]
                              file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                              file:bg-[var(--color-primary)] file:text-[var(--color-accent)] file:cursor-pointer file:font-medium
                              file:hover:bg-[var(--color-highlight)] file:transition-colors file:duration-200
                              outline-none transition-all duration-300"
                    style={{ 
                      borderColor: 'rgba(78, 92, 105, 0.4)',
                      backgroundColor: 'rgba(28, 31, 38, 0.7)'
                    }}
                  />
                </div>

                {form.imagePreview && (
                  <div className="mt-4 flex items-center gap-4 p-3 rounded-lg bg-[var(--color-bg)] border border-[var(--color-secondary)]"
                       style={{ 
                         borderColor: 'rgba(78, 92, 105, 0.4)',
                         backgroundColor: 'rgba(28, 31, 38, 0.7)'
                       }}>
                    <img
                      src={form.imagePreview}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-full border-2 border-[var(--color-primary)] shadow-lg"
                    />
                    <div className="flex flex-col gap-2">
                      <span className="text-sm text-[var(--color-description)]">Image preview</span>
                      <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, image: null, imagePreview: null }))}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md 
                                 transition-colors duration-200 text-sm font-medium"
                      >
                        Remove Image
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="md:col-span-2 flex justify-end mt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 text-sm
                              ${isLoading
                                ? "bg-[var(--color-status)] cursor-not-allowed text-[var(--color-description)] opacity-60"
                                : "bg-[var(--color-readmore)] text-[var(--color-accent)] hover:bg-[var(--color-highlight)] hover:scale-105 shadow-lg hover:shadow-xl"}
                            `}
                >
                  {isLoading ? "Registering Member..." : "Register New Member"}
                </button>
              </div>
            </form>
          </div>
        </section>


        {/* FOOTER */}
        <footer className="py-8 text-center bg-[var(--color-card)] text-[var(--color-description)] border-t border-[rgba(255,255,255,0.05)]">
          <p>&copy; {new Date().getFullYear()} Leo Club Cinnamon Gardens. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}