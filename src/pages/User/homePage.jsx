import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import ProjectsSection from "../../components/projectComponent";
import Newsletter from "../../components/newslettersComponent";
import TestimonialsComponent from "../../components/testimonialsComponent";
import { supabase, upploadMediaToSupabase } from "../../utill/mediaUpload";

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

  Tailwind: this code uses arbitrary value classes (bg-[var(...)]) so ensure your Tailwind config
  allows arbitrary values (default Tailwind v2+ does). If you want to convert these to theme colors,
  add them to tailwind.config.js.
*/

export default function LeoClubPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
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

  // Utility to smooth-scroll to section
  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div ref={pageRef} className="relative min-h-screen bg-[var(--color-bg)] text-white">
      <Toaster position="top-right" />

      {/* Global Particles */}
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
        className="absolute inset-0 -z-10"
      />

      {/* Fixed Navbar */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[rgba(11,26,47,0.55)] backdrop-blur-md border-b border-[rgba(255,255,255,0.04)]">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <img src="/logo192.png" alt="logo" className="w-10 h-10 rounded" />
            <div className="text-[var(--color-primary)] font-bold text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
              Leo Club Cinnamon Grand
            </div>
          </div>

          <nav>
            <ul className="hidden md:flex items-center gap-6 text-[var(--color-primary)]">
              <li className="cursor-pointer hover:text-[var(--color-readmore)]" onClick={() => scrollToId("home")}>Home</li>
              <li className="cursor-pointer hover:text-[var(--color-readmore)]" onClick={() => scrollToId("about")}>About</li>
              <li className="cursor-pointer hover:text-[var(--color-readmore)]" onClick={() => scrollToId("projects")}>Projects</li>
              <li className="cursor-pointer hover:text-[var(--color-readmore)]" onClick={() => scrollToId("newsletter")}>Newsletter</li>
              <li className="cursor-pointer hover:text-[var(--color-readmore)]" onClick={() => scrollToId("testimonials")}>Testimonials</li>
              <li className="cursor-pointer hover:text-[var(--color-readmore)]" onClick={() => scrollToId("excom")}>Excom</li>
              <li className="cursor-pointer hover:text-[var(--color-readmore)]" onClick={() => scrollToId("register")}>Register</li>
            </ul>
          </nav>

          <div className="md:hidden">
            {/* Mobile: simple anchor to register section */}
            <button onClick={() => scrollToId("register")} className="bg-[var(--color-readmore)] text-[var(--color-accent)] px-3 py-1 rounded-md font-semibold">Join</button>
          </div>
        </div>
      </header>

      {/* Page content wrapper with top padding to account for fixed header */}
      <main className="pt-20">
        {/* HERO */}
        <section id="home" className="min-h-[75vh] flex items-center justify-center px-6 text-center">
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-extrabold text-[var(--color-secheading)] leading-tight drop-shadow-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
              Leo Club Cinnamon Grand
            </h1>
            <p className="mt-4 text-[var(--color-description)] text-lg">Together we serve, lead and grow. Join our community-driven projects and make an impact.</p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <button onClick={() => scrollToId('register')} className="px-6 py-3 rounded-lg font-semibold bg-[var(--color-readmore)] text-[var(--color-accent)] shadow hover:scale-105 transition">Register Now</button>
              <button onClick={() => scrollToId('projects')} className="px-6 py-3 rounded-lg border border-[rgba(255,255,255,0.06)] text-[var(--color-primary)] hover:text-[var(--color-readmore)] transition">Our Projects</button>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="py-16 px-6 md:px-12">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 items-center">
            <div className="rounded-2xl overflow-hidden shadow-lg transform hover:scale-105 transition">
              <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80" alt="about" className="w-full h-96 object-cover" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-secheading)] mb-4">About Us</h2>
              <p className="text-[var(--color-description)] leading-relaxed">Founded in 2023 under Lions Clubs International, the Leo Club of Cinnamon Grand Colombo is dedicated to community service, leadership development, and fellowship. We run education drives, tree planting, senior support programs, and more.</p>
              <div className="mt-6 flex gap-4">
                <button onClick={() => scrollToId('projects')} className="px-5 py-2 rounded-md bg-[var(--color-readmore)] text-[var(--color-accent)] font-semibold">View Projects</button>
                <button onClick={() => scrollToId('newsletter') } className="px-5 py-2 rounded-md border border-[rgba(255,255,255,0.06)]">Newsletter</button>
              </div>
            </div>
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <ProjectsSection />

        {/* NEWSLETTER */}
        <Newsletter />

        {/* TESTIMONIALS */}
        <TestimonialsComponent />

        {/* EXCOM */}
        <section id="excom" className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-3xl font-bold text-[var(--color-secheading)] mb-6">Meet the Excom</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="p-6 rounded-2xl bg-[var(--color-card)] text-center hover:scale-105 transition">
                  <div className="mx-auto w-28 h-28 rounded-full bg-[var(--color-secondary)] flex items-center justify-center text-[var(--color-primary)] font-bold text-xl shadow-md">L{i + 1}</div>
                  <h4 className="mt-4 font-semibold text-[var(--color-primary)]">Leo Name {i + 1}</h4>
                  <p className="text-[var(--color-description)] text-sm">Position</p>
                  <div className="mt-3 flex justify-center gap-3 text-[var(--color-primary)]">
                    <a href="#" className="hover:text-[var(--color-readmore)]">Li</a>
                    <a href="#" className="hover:text-[var(--color-readmore)]">Em</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* REGISTER FORM */}
        <section id="register" className="py-16 px-6 bg-[var(--color-card)]">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-[var(--color-secheading)] mb-6">Register New Member</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 rounded-2xl bg-[rgba(255,255,255,0.025)]">
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="First Name*"
                className="p-3 rounded bg-[var(--color-bg)]"
              />
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Last Name*"
                className="p-3 rounded bg-[var(--color-bg)]"
              />
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email*"
                className="p-3 rounded bg-[var(--color-bg)]"
                type="email"
              />
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone*"
                className="p-3 rounded bg-[var(--color-bg)]"
                type="tel"
              />
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                className="p-3 rounded bg-[var(--color-bg)]"
              />
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="p-3 rounded bg-[var(--color-bg)]"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>

              <input
                name="occupation"
                value={form.occupation}
                onChange={handleChange}
                placeholder="Occupation*"
                className="p-3 rounded bg-[var(--color-bg)]"
              />

              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Address*"
                className="p-3 rounded bg-[var(--color-bg)] md:col-span-2"
                rows={3}
              />

              <div className="md:col-span-2">
                <label className="block text-sm mb-2 text-[var(--color-description)]">Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-sm"
                />

                {form.imagePreview && (
                  <img
                    src={form.imagePreview}
                    alt="preview"
                    className="mt-3 w-40 h-40 object-cover rounded"
                  />
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="md:col-span-2 py-3 rounded bg-[var(--color-readmore)] text-[var(--color-accent)] font-semibold"
              >
                {isLoading ? "Submitting..." : "Submit"}
              </button>
            </form>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="w-full bg-[var(--color-accent)] text-[var(--color-primary)] py-8 mt-8">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>© {new Date().getFullYear()} Leo Club Cinnamon Grand. All rights reserved.</div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-[var(--color-readmore)]">Privacy</a>
              <a href="#" className="hover:text-[var(--color-readmore)]">Terms</a>
              <a href="#" className="hover:text-[var(--color-readmore)]">Contact</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
