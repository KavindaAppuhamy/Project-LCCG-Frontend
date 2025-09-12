import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { supabase, uploadMediaToSupabase } from "../../utill/mediaUpload";

export default function MembersRegistration() {
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
    position: "",
    status: "pending",
    mylci: "",
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
      const nameRegex = /^[a-zA-Z0-9_\-\.\[\]\(\) ]+$/;
      if (!nameRegex.test(file.name)) {
        toast.error("Image filename contains invalid characters. Only letters, numbers, spaces, underscores, dashes, dots, parentheses, and brackets are allowed.");
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
      "gender", "address", "occupation", "position", "status"
    ];
    
    const missingFields = requiredFields.filter(field => !form[field] || form[field].toString().trim() === "");
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(", ")}`);
      return;
    }
    // ✅ Only letters regex
    const onlyLettersRegex = /^[A-Za-z\s]+$/;

    if (!onlyLettersRegex.test(form.firstName)) {
      toast.error("First name should only contain letters.");
      return;
    }
    if (!onlyLettersRegex.test(form.lastName)) {
      toast.error("Last name should only contain letters.");
      return;
    }
    if (!onlyLettersRegex.test(form.occupation)) {
      toast.error("Occupation should only contain letters.");
      return;
    }
    if (!onlyLettersRegex.test(form.position)) {
      toast.error("Position should only contain letters.");
      return;
    }
    // ✅ Validate age (10 - 120 years)
    const birthDate = new Date(form.dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--; // Adjust if birthday hasn't occurred yet this year
    }

    if (age < 10 || age > 120) {
      toast.error("Age must be between 10 and 120 years.");
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
        try {
          const path = await uploadMediaToSupabase(form.image); // returns the storage path
          const { data } = supabase.storage.from("image").getPublicUrl(path);
          imageUrl = data.publicUrl;
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
          toast.error("Failed to upload image. Please try again.");
          return;
        }
      }

      const payload = {
        ...form,
        image: imageUrl,
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
      navigate("/admin/dashboard/members");
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
    <div className="p-3 sm:p-4 md:p-6 text-white min-h-screen">
      {/* Header Section - Enhanced Mobile Layout */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
        <div className="flex items-start sm:items-center gap-2 flex-wrap">
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--color-primary)] leading-tight">Register New Member</h2>
          <div className="relative group cursor-pointer flex-shrink-0 mt-1 sm:mt-0">
            <div className="w-4 h-4 flex items-center justify-center rounded-full bg-blue-500 text-white text-[10px] font-bold">
              i
            </div>
            <div className="absolute z-10 w-44 sm:w-48 top-full mt-1 left-1/2 -translate-x-1/2 bg-gray-900/95 backdrop-blur-sm text-white text-xs rounded-lg px-3 py-2 shadow-xl border border-white/10 opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none">
              Fill in all required fields (marked with *) to register a new member.
            </div>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-white/70">All fields marked with * are required</p>
      </div>

      {/* Form Container - Enhanced Mobile Padding */}
      <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl overflow-hidden">
        <form onSubmit={handleSubmit} className="p-3 sm:p-6 md:p-8">
          {/* Profile Picture Section - Mobile Optimized */}
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            <div className="relative mb-4 group">
              <div className="relative w-24 sm:w-28 h-24 sm:h-28 rounded-full overflow-hidden border-4 border-white/20 shadow-lg transition-all duration-300 group-hover:border-[var(--color-primary)]/50">
                {form.imagePreview ? (
                  <img
                    src={form.imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="relative w-full h-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-full flex items-center justify-center overflow-hidden border-2 border-dashed border-white/20 hover:border-[var(--color-primary)]/50 transition-all duration-300 group">
                    {/* Main icon with animation */}
                    <svg 
                      className="w-8 sm:w-10 h-8 sm:h-10 text-white/60 group-hover:text-[var(--color-primary)] transition-all duration-300" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="1.5" 
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                      />
                    </svg>
                    
                    {/* Hover tooltip */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <span className="text-xs font-medium bg-black/70 text-white px-2 py-1 rounded-full">
                        Upload Photo
                      </span>
                    </div>
                    
                    {/* Animated border effect */}
                    <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-[var(--color-primary)]/30 transition-all duration-500" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-[var(--color-primary)] text-white text-xs px-2 py-1 rounded-full shadow-md">
                {form.image ? "✓ Uploaded" : "Optional"}
              </div>
            </div>
            
            <label className="flex flex-col items-center gap-2 cursor-pointer">
              <span className="px-4 sm:px-6 py-2 sm:py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg shadow-[var(--color-primary)]/20 text-xs sm:text-sm font-medium text-center">
                {form.image ? "Change Image" : "Upload Profile Image"}
              </span>
              <span className="text-xs text-white/50 text-center">JPEG, PNG (Max 5MB)</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Form Fields Grid - Enhanced Mobile Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
            {/* Personal Information Section */}
            <div className="lg:col-span-2">
              <h3 className="text-base sm:text-lg font-medium text-white mb-3 sm:mb-4 pb-2 border-b border-white/10">Personal Information</h3>
            </div>

            <div className="flex flex-col">
              <label className="block mb-2 text-sm font-medium text-white/90">
                First Name <span className="text-[var(--color-primary)]">*</span>
              </label>
              <input
                name="firstName"
                type="text"
                value={form.firstName}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all duration-200"
                placeholder="John"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="block mb-2 text-sm font-medium text-white/90">
                Last Name <span className="text-[var(--color-primary)]">*</span>
              </label>
              <input
                name="lastName"
                type="text"
                value={form.lastName}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all duration-200"
                placeholder="Doe"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="block mb-2 text-sm font-medium text-white/90">
                Email <span className="text-[var(--color-primary)]">*</span>
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all duration-200"
                placeholder="john.doe@example.com"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="block mb-2 text-sm font-medium text-white/90">
                Phone <span className="text-[var(--color-primary)]">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-white/50 text-sm">+1</span>
                </div>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all duration-200"
                  placeholder="1234567890"
                  maxLength="10"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="block mb-2 text-sm font-medium text-white/90">
                Date of Birth <span className="text-[var(--color-primary)]">*</span>
              </label>
              <input
                name="dob"
                type="date"
                value={form.dob}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all duration-200"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="block mb-2 text-sm font-medium text-white/90">
                Gender <span className="text-[var(--color-primary)]">*</span>
              </label>
              <div className="flex flex-wrap gap-3 sm:gap-4 mt-1">
                {["male", "female", "other"].map((g) => (
                  <label key={g} className="flex items-center gap-2 text-white text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={form.gender === g}
                      onChange={handleChange}
                      className="w-4 h-4 text-[var(--color-primary)] bg-white/10 border-white/20 focus:ring-[var(--color-primary)]"
                      required
                    />
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            {/* Professional Information Section */}
            <div className="lg:col-span-2 mt-2 sm:mt-4">
              <h3 className="text-base sm:text-lg font-medium text-white mb-3 sm:mb-4 pb-2 border-b border-white/10">Professional Information</h3>
            </div>

            <div className="flex flex-col">
              <label className="block mb-2 text-sm font-medium text-white/90">
                Occupation <span className="text-[var(--color-primary)]">*</span>
              </label>
              <input
                name="occupation"
                type="text"
                value={form.occupation}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all duration-200"
                placeholder="Software Engineer"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="block mb-2 text-sm font-medium text-white/90">
                Position <span className="text-[var(--color-primary)]">*</span>
              </label>
              <input
                name="position"
                type="text"
                value={form.position}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all duration-200"
                placeholder="Club Secretary"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="block mb-2 text-sm font-medium text-white/90">MYLCI Number</label>
              <input
                name="mylci"
                type="text"
                value={form.mylci}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all duration-200"
                placeholder="LCI-123456"
              />
            </div>

            <div className="flex flex-col">
              <label className="block mb-2 text-sm font-medium text-white/90">
                Status <span className="text-[var(--color-primary)]">*</span>
              </label>
              <div className="relative">
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="appearance-none w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-8 sm:pr-10 text-sm sm:text-base rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all duration-200"
                  required
                >
                  <option value="pending" className="bg-gray-900/95 text-white">Pending Review</option>
                  <option value="accept" className="bg-gray-900/95 text-white">Active Member</option>
                  <option value="reject" className="bg-gray-900/95 text-white">Rejected</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Address Section */}
            <div className="lg:col-span-2 mt-2 sm:mt-4">
              <h3 className="text-base sm:text-lg font-medium text-white mb-3 sm:mb-4 pb-2 border-b border-white/10">Contact Information</h3>
            </div>

            <div className="flex flex-col lg:col-span-2">
              <label className="block mb-2 text-sm font-medium text-white/90">
                Full Address <span className="text-[var(--color-primary)]">*</span>
              </label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all duration-200 resize-none"
                placeholder="123 Main St, City, State, ZIP Code"
                required
              />
            </div>
          </div>

          {/* Form Actions - Mobile Optimized */}
          <div className="flex flex-col sm:flex-col-reverse md:flex-row justify-end gap-3 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-white/10 backdrop-blur-md text-white rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/20 text-sm font-medium"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg shadow-[var(--color-primary)]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 justify-center text-sm font-medium"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Register Member</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}