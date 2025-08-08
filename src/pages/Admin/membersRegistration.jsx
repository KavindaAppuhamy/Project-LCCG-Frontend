import { useState } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { supabase, upploadMediaToSupabase } from "../../utill/mediaUpload";

export default function MembersRegistration() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // Added loading state

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
    if (file && file.type.startsWith("image/")) {
      setForm({
        ...form,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    } else {
      toast.error("Please select a valid image.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "firstName", "lastName", "email", "phone", "dob",
      "gender", "address", "occupation", "position", "status"
    ];
    for (let field of requiredFields) {
      if (!form[field] || form[field].toString().trim() === "") {
        toast.error(`Please fill in the ${field} field.`);
        return;
      }
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(form.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(form.phone)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }

    try {
      setIsLoading(true); // Set loading to true when starting submission
      
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
        toast.error("Failed to register member.");
      }
    } finally {
      setIsLoading(false); // Set loading to false when submission completes or fails
    }
  };

  return (
    <div className="p-6 text-white">
      {/* Header with Glass Effect */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold text-[var(--color-primary)]">Register New Member</h2>
          <div className="relative group cursor-pointer">
            <div className="w-4 h-4 flex items-center justify-center rounded-full bg-blue-500 text-white text-[10px] font-bold">
              i
            </div>
            <div className="absolute z-10 w-48 top-full mt-1 left-1/2 -translate-x-1/2 bg-gray-900/95 backdrop-blur-sm text-white text-[10px] rounded-lg px-3 py-2 shadow-xl border border-white/10 opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none">
              Fill in all required fields to register a new member. The member status can be changed later.
            </div>
          </div>
        </div>
      </div>

      {/* Glass Form Container */}
      <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8">
          {/* Image Upload Section */}
          <div className="flex justify-center mb-8">
            <div className="flex flex-col items-center">
              <div className="relative">
                {form.imagePreview ? (
                  <img
                    src={form.imagePreview}
                    alt="Preview"
                    className="w-28 h-28 rounded-full object-cover border-4 border-white/20 shadow-xl"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-white/10 backdrop-blur-md border-4 border-white/20 flex items-center justify-center">
                    <svg className="w-12 h-12 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
              <label className="mt-4 px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-all duration-200 cursor-pointer shadow-lg shadow-[var(--color-primary)]/20">
                Choose Profile Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div className="flex flex-col">
              <label className="block mb-2 text-sm font-medium text-white/90">First Name *</label>
              <input
                name="firstName"
                type="text"
                value={form.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all duration-200"
                placeholder="Enter first name"
              />
            </div>

            {/* Last Name */}
            <div className="flex flex-col">
              <label className="block mb-2 text-sm font-medium text-white/90">Last Name *</label>
              <input
                name="lastName"
                type="text"
                value={form.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all duration-200"
                placeholder="Enter last name"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label className="block mb-2 text-sm font-medium text-white/90">Email *</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all duration-200"
                placeholder="Enter email address"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col">
              <label className="block mb-2 text-sm font-medium text-white/90">Phone *</label>
              <input
                name="phone"
                type="text"
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all duration-200"
                placeholder="Enter 10-digit phone number"
              />
            </div>

            {/* Date of Birth */}
            <div className="flex flex-col">
              <label className="block mb-2 text-sm font-medium text-white/90">Date of Birth *</label>
              <input
                name="dob"
                type="date"
                value={form.dob}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all duration-200"
              />
            </div>

            {/* Gender */}
            <div className="flex flex-col">
              <label className="block mb-2 text-sm font-medium text-white/90">Gender *</label>
              <div className="flex gap-6 mt-2">
                {["male", "female", "other"].map((g) => (
                  <label key={g} className="flex items-center gap-2 text-white text-sm cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={form.gender === g}
                      onChange={handleChange}
                      className="w-4 h-4 text-[var(--color-primary)] bg-white/10 border-white/20 focus:ring-[var(--color-primary)]"
                    />
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            {/* MYLCI */}
            <div className="flex flex-col">
              <label className="block mb-2 text-sm font-medium text-white/90">MYLCI</label>
              <input
                name="mylci"
                type="text"
                value={form.mylci}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all duration-200"
                placeholder="Enter MYLCI number"
              />
            </div>

            {/* Position */}
            <div className="flex flex-col">
              <label className="block mb-2 text-sm font-medium text-white/90">Position *</label>
              <input
                name="position"
                type="text"
                value={form.position}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all duration-200"
                placeholder="Enter position/role"
              />
            </div>

            {/* Occupation */}
            <div className="flex flex-col">
              <label className="block mb-2 text-sm font-medium text-white/90">Occupation *</label>
              <input
                name="occupation"
                type="text"
                value={form.occupation}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all duration-200"
                placeholder="Enter occupation"
              />
            </div>

            {/* Status */}
            <div className="flex flex-col">
              <label className="block mb-2 text-sm font-medium text-white/90">Status *</label>
              <div className="relative">
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="appearance-none w-full px-4 py-3 pr-10 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all duration-200"
                >
                  <option value="pending" className="bg-gray-900/95 text-white">Pending</option>
                  <option value="accept" className="bg-gray-900/95 text-white">Accepted</option>
                  <option value="reject" className="bg-gray-900/95 text-white">Rejected</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Address - Full Width */}
            <div className="flex flex-col md:col-span-2">
              <label className="block mb-2 text-sm font-medium text-white/90">Address *</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all duration-200 resize-none"
                placeholder="Enter full address"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-white/10 backdrop-blur-md text-white rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/20"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg shadow-[var(--color-primary)]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-[120px] justify-center"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Registering...</span>
                </>
              ) : (
                "Register Member"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}