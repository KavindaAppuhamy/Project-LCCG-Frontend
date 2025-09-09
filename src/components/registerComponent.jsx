import { ChevronDown } from "lucide-react";
import React, { useState, useRef } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { supabase, upploadMediaToSupabase } from "../utill/mediaUpload";

const RegisterSection = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    address: "",
    occupation: "",
    image: null,
    imagePreview: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"];

    if (!file) return;

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please select a valid image file (JPEG, PNG, JPG, GIF, WEBP)");
      setForm((prev) => ({ ...prev, image: null, imagePreview: null }));
      return;
    }

    // Validate file name (letters, numbers, underscores, dashes, dots only)
    const nameRegex = /^[a-zA-Z0-9_\-\.]+$/;
    if (!nameRegex.test(file.name)) {
      toast.error("Image name must only contain letters, numbers, underscores, dashes, or dots.");
      setForm((prev) => ({ ...prev, image: null, imagePreview: null }));
      return;
    }

    // ✅ Passed checks → set image
    setForm({
      ...form,
      image: file,
      imagePreview: URL.createObjectURL(file),
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "firstName", "lastName", "email", "phone", "dob",
      "gender", "address", "occupation"
    ];

    const fieldLabels = {
      firstName: "First Name",
      lastName: "Last Name", 
      email: "Email",
      phone: "Phone",
      dob: "Date of Birth",
      gender: "Gender",
      address: "Address",
      occupation: "Occupation",
    };

    // Missing required fields check
    const missingFields = requiredFields.filter(
      (field) => !form[field] || form[field].toString().trim() === ""
    );
    if (missingFields.length > 0) {
      const missingLabels = missingFields.map(field => fieldLabels[field]);
      
      if (missingFields.length >= 2) {
          toast.error(`Please fill in all required fields: ${missingLabels.join(", ")}`);
      } else {
          toast.error(`Please fill: ${missingLabels.join(", ")}`);
      }
      return;
    }

    // --- First Name ---
    if (form.firstName.length < 2 || form.firstName.length > 50) {
      toast.error("First Name must be between 2 and 50 characters");
      return;
    }
    if (!/^[A-Z][a-z]*(?:[\s'-][A-Z][a-z]*)*$/.test(form.firstName)) {
      toast.error("First Name must start with a capital letter and follow proper capitalization throughout");
      return;
    }

    // --- Last Name ---
    if (form.lastName.length < 2 || form.lastName.length > 50) {
      toast.error("Last Name must be between 2 and 50 characters");
      return;
    }
    if (!/^[A-Z][a-z]*(?:[\s'-][A-Z][a-z]*)*$/.test(form.lastName)) {
      toast.error("Last Name must start with a capital letter and follow proper capitalization throughout");
      return;
    }

    // --- Email ---
    if (form.email.length > 100) {
      toast.error("Email cannot exceed 100 characters");
      return;
    }
    
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    // Combine email validation checks to avoid duplicate toasts
    if (!emailRegex.test(form.email) || 
        form.email.includes("..") ||
        form.email.startsWith(".") ||
        form.email.endsWith(".") ||
        form.email.includes("@.") ||
        form.email.includes(".@")) {
      toast.error("Please provide a valid email address");
      return;
    }

    // --- Phone (Sri Lanka) ---
    const cleanedPhone = form.phone.replace(/\D/g, "");
    const validAreaCodes = [
      "011","021","023","024","025","026","027",
      "031","032","033","034","035","036","037","038", 
      "041","045","047","051","052","054","055","057",
      "063","065","066","067","081","091"
    ];
    
    let phoneValid = false;
    if (cleanedPhone.startsWith("94")) {
      phoneValid = cleanedPhone.length === 12 && /^94[1-9]\d{8}$/.test(cleanedPhone);
    } else if (cleanedPhone.length === 10) {
      if (cleanedPhone.startsWith("07")) {
        phoneValid = /^07[0-8]\d{7}$/.test(cleanedPhone);
      } else {
        phoneValid = validAreaCodes.includes(cleanedPhone.substring(0,3));
      }
    }
    
    if (!phoneValid) {
      toast.error("Please provide a valid Sri Lankan phone number (07XXXXXXXX, landline, or +94XXXXXXXXX)");
      return;
    }

    // --- DOB ---
    const dobDate = new Date(form.dob);
    const today = new Date();
    const minAge = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
    const maxAge = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());
    
    if (dobDate > today) {
      toast.error("Date of birth cannot be in the future");
      return;
    }
    if (dobDate < minAge || dobDate > maxAge) {
      toast.error("Date of birth must be between 16 and 120 years ago");
      return;
    }

    // --- Gender ---
    if (!["male","female","other"].includes(form.gender.toLowerCase())) {
      toast.error("Gender must be male, female, or other");
      return;
    }

    // --- Address ---
    if (form.address.length < 10 || form.address.length > 200) {
      toast.error("Address must be between 10 and 200 characters long");
      return;
    }
    if (!/^[a-zA-Z0-9\s,.\-/#]+$/.test(form.address)) {
      toast.error("Address contains invalid characters");
      return;
    }

    // --- Occupation ---
    if (form.occupation.length < 2 || form.occupation.length > 100) {
      toast.error("Occupation must be between 2 and 100 characters long");
      return;
    }
    if (!/^[a-zA-Z\s&,\-./()]+$/.test(form.occupation)) {
      toast.error("Occupation contains invalid characters");
      return;
    }

    // ✅ Profile image required check
    if (!form.image) {
      toast.error("Please upload a valid profile image (JPEG, PNG, JPG, GIF, WEBP)");
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

      const payload = {
        ...form,
        image: imageUrl || "https://www.w3schools.com/howto/img_avatar.png",
        position: "Member",
        status: "pending",
        mylci: form.mylci || "", // optional, validated in backend
      };
      delete payload.imagePreview;

      const token = localStorage.getItem("adminToken");
      const headers = { Authorization: `Bearer ${token}` };

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/member`,
        payload,
        { headers }
      );

      toast.success("Member registered successfully!");
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dob: "",
        gender: "",
        address: "",
        occupation: "",
        image: null,
        imagePreview: null,
      });

      // Clear file input manually
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      console.error("Error creating member:", err);
      if (err.response?.status === 409) {
        toast.error(`${err.response.data.message}`);
      } else {
        toast.error("Failed to register member. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="register" className="relative overflow-hidden min-h-screen flex items-center py-16">
      {/* Professional Register Background */}
      <div
    className="absolute inset-0 z-[-20] bg-cover bg-center bg-fixed"
    style={{
      backgroundImage: `url('/register_bg.webp')`,
      filter: "brightness(0.5) contrast(1.1)",
    }}
  ></div>

      <div className="absolute inset-0 z-[-10] bg-[rgba(0,0,0,0.8)]"></div>

      {/* Elegant ambient effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-24 w-32 h-32 bg-gradient-to-br from-[var(--color-readmore)]/8 to-transparent 
                        rounded-full blur-3xl animate-[elegantPulse_6s_ease-in-out_infinite]"></div>
        <div className="absolute bottom-24 left-20 w-48 h-48 bg-gradient-to-tr from-[var(--color-primary)]/6 to-transparent 
                        rounded-full blur-3xl animate-[elegantPulse_8s_ease-in-out_infinite]" 
            style={{ animationDelay: "3s" }}></div>
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-br from-[var(--color-secheading)]/10 to-transparent 
                        rounded-2xl rotate-45 blur-2xl animate-[elegantRotate_20s_linear_infinite]"
            style={{ animationDelay: "1s" }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10 px-4 sm:px-8 w-full">
        {/* Professional form container */}
        <div className="relative animate-[professionalSlideIn_1s_ease-out_0.2s_both] w-full">
          <div className="p-8 w-full">
            {/* Your original form UI starts here */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center py-6">  
              {/* === Left side titles === */}
              <div className="lg:hidden text-center mb-6 animate-[professionalSlideIn_1s_ease-out] order-1">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4
                                bg-gradient-to-r from-[var(--color-secheading)] via-[var(--color-primary)] to-[var(--color-readmore)] 
                                bg-clip-text text-transparent leading-tight">
                  Want to Join US?
                </h2>
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <div className="h-px w-16 bg-gradient-to-r from-transparent to-[var(--color-primary)]"></div>
                  <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full animate-pulse"></div>
                  <div className="h-px w-16 bg-gradient-to-l from-transparent to-[var(--color-primary)]"></div>
                </div>
              </div>

              <div className="hidden lg:flex flex-col justify-center space-y-8 animate-[professionalSlideIn_1s_ease-out] order-2 lg:order-1">
                <div>
                  <h2 className="text-5xl sm:text-6xl lg:text-6xl xl:text-[6rem] font-bold -mb-1 sm:-mb-2
                                  bg-gradient-to-r from-[var(--color-secheading)] via-[var(--color-primary)] to-[var(--color-readmore)] 
                                  bg-clip-text text-transparent leading-none">
                    Want
                  </h2>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-[4rem] font-bold -mb-4 sm:-mb-6 md:-mb-7
                                  bg-gradient-to-r from-[var(--color-secheading)] via-[var(--color-primary)] to-[var(--color-readmore)] 
                                  bg-clip-text text-transparent leading-none">
                    to Join
                  </h2>
                  <h2 className="text-7xl sm:text-8xl lg:text-9xl xl:text-[15rem] font-bold mb-4 sm:mb-6
                                  bg-gradient-to-r from-[var(--color-secheading)] via-[var(--color-primary)] to-[var(--color-readmore)] 
                                  bg-clip-text text-transparent leading-none">
                    US?
                  </h2>
                  <div className="flex items-center space-x-4 mb-6 sm:mb-8">
                    <div className="h-px w-24 bg-gradient-to-r from-transparent to-[var(--color-primary)]"></div>
                    <div className="w-4 h-4 bg-[var(--color-primary)] rounded-full animate-pulse"></div>
                    <div className="h-px w-24 bg-gradient-to-l from-transparent to-[var(--color-primary)]"></div>
                  </div>
                </div>
              </div>

              {/* === Right side form === */}
              <div className="flex flex-col justify-center animate-[fadeInScale_0.8s_ease-out_0.2s_both] order-1 lg:order-2">
                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 p-0 sm:p-4 lg:p-1 
                              w-full max-w-md mx-auto">
                  {/* Input fields */}
                  <div className="space-y-2 sm:space-y-3">
                    {/* Name fields - Stack on mobile, side by side on larger screens */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      <input
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        placeholder="First Name*"
                        className="p-2.5 sm:p-3 rounded-lg bg-white/5 text-white text-sm
                                placeholder:text-gray-400 border border-white/20
                                focus:border-[var(--color-primary)] focus:ring-1
                                focus:ring-[var(--color-primary)]/50
                                transition-all duration-300 hover:border-[var(--color-highlight)]"
                      />

                      <input
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        placeholder="Last Name*"
                        className="p-2.5 sm:p-3 rounded-lg bg-white/5 text-white text-sm
                                placeholder:text-gray-400 border border-white/20
                                focus:border-[var(--color-primary)] focus:ring-1
                                focus:ring-[var(--color-primary)]/50
                                transition-all duration-300 hover:border-[var(--color-highlight)]"
                      />
                    </div>

                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Email*"
                      className="w-full p-2.5 sm:p-3 rounded-lg bg-white/5 text-white text-sm
                                placeholder:text-gray-400 border border-white/20
                                focus:border-[var(--color-primary)] focus:ring-1
                                focus:ring-[var(--color-primary)]/50
                                transition-all duration-300 hover:border-[var(--color-highlight)]"
                    />

                    <input
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Phone*"
                      className="w-full p-2.5 sm:p-3 rounded-lg bg-white/5 text-white text-sm
                                placeholder:text-gray-400 border border-white/20
                                focus:border-[var(--color-primary)] focus:ring-1
                                focus:ring-[var(--color-primary)]/50
                                transition-all duration-300 hover:border-[var(--color-highlight)]"
                    />

                    {/* DOB and Gender - Stack on mobile, side by side on larger screens */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 w-full">
                      <div className="relative w-full">
                        <input
                          type="date"
                          name="dob"
                          value={form.dob}
                          onChange={handleChange}
                          className={`w-full p-2.5 sm:p-3 rounded-lg bg-white/5 text-white text-sm
                            border border-white/20 focus:border-[var(--color-primary)]
                            focus:ring-1 focus:ring-[var(--color-primary)]/50
                            transition-all duration-300 hover:border-[var(--color-highlight)]
                            [&::-webkit-calendar-picker-indicator]:opacity-0
                            [&::-webkit-inner-spin-button]:appearance-none
                            [&::-webkit-clear-button]:hidden
                            ${!form.dob ? '[&::-webkit-datetime-edit]:opacity-0' : '[&::-webkit-datetime-edit]:opacity-100'}
                          `}
                        />

                        {/* Custom Placeholder */}
                        {!form.dob && (
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
                            DOB
                          </span>
                        )}

                        {/* Custom Calendar Icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70 pointer-events-none"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div className="relative w-full">
                        <select
                          name="gender"
                          value={form.gender}
                          onChange={handleChange}
                          className="w-full p-2.5 sm:p-3 rounded-lg bg-white/5 text-white text-sm
                                    border border-white/20 focus:border-[var(--color-primary)]
                                    focus:ring-1 focus:ring-[var(--color-primary)]/50
                                    transition-all duration-300 hover:border-[var(--color-highlight)]
                                    appearance-none pr-8 sm:pr-10"
                        >
                          <option value="" disabled className="text-gray-400">
                            Select gender
                          </option>
                          <option value="male" className="text-black">Male</option>
                          <option value="female" className="text-black">Female</option>
                          <option value="other" className="text-black">Other</option>
                        </select>

                        <ChevronDown 
                          size={14} 
                          className="absolute right-2.5 sm:right-3 top-1/2 transform -translate-y-1/2 text-white/70 pointer-events-none" 
                        />
                      </div>
                    </div>

                    <input
                      name="occupation"
                      value={form.occupation}
                      onChange={handleChange}
                      placeholder="Occupation*"
                      className="w-full p-2.5 sm:p-3 rounded-lg bg-white/5 text-white text-sm
                                placeholder:text-gray-400 border border-white/20
                                focus:border-[var(--color-primary)] focus:ring-1
                                focus:ring-[var(--color-primary)]/50
                                transition-all duration-300 hover:border-[var(--color-highlight)]"
                    />

                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Address*"
                      rows={2}
                      className="w-full p-2.5 sm:p-3 rounded-lg bg-white/5 text-white placeholder:text-gray-400 text-sm
                                border border-white/20
                                focus:border-[var(--color-primary)] focus:ring-1
                                focus:ring-[var(--color-primary)]/50
                                transition-all duration-300 hover:border-[var(--color-highlight)] resize-none"
                    />

                    {/* File upload */}
                    <div>
                      <label className="block text-xs mb-1.5 text-gray-300 font-medium">
                        Profile Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        className="w-full p-2.5 rounded-lg bg-white/5 text-white border border-white/20 text-xs
                                file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0
                                file:bg-gradient-to-r file:from-[var(--color-primary)] file:to-[var(--color-readmore)]
                                file:text-white file:cursor-pointer file:font-semibold file:text-xs
                                file:hover:opacity-90 transition-all duration-300 hover:border-[var(--color-highlight)]"
                      />

                      {form.imagePreview && (
                        <div className="mt-2 flex items-center gap-2 p-2.5 rounded-lg bg-white/5 border border-white/20">
                          <img
                            src={form.imagePreview}
                            alt="Preview"
                            className="w-10 h-10 object-cover rounded-full border-2 border-[var(--color-primary)] shadow-md"
                          />
                          <div className="flex flex-col gap-1 flex-1">
                            <span className="text-xs text-gray-300">Image preview</span>
                            <button
                              type="button"
                              onClick={() =>
                                setForm((prev) => ({
                                  ...prev,
                                  image: null,
                                  imagePreview: null,
                                }))
                              }
                              className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded transition duration-200 text-xs font-medium self-start"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Submit button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 mt-3
                                  ${
                                    isLoading
                                      ? "bg-gray-500/50 text-gray-300 cursor-not-allowed"
                                      : "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-readmore)] text-white shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95"
                                  }`}
                    >
                      {isLoading ? "Registering Member..." : "Register New Member"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            {/* === End of your original form UI === */}
          </div>
        </div>
      </div>

      {/* Professional Animations - Add to your CSS */}
      <style jsx="true">{`
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
    </section>
  );
};

export default RegisterSection;
