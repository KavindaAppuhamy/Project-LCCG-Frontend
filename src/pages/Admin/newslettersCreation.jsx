import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { supabase, upploadMediaToSupabase } from "../../utill/mediaUpload.js";
import { FiInfo, FiUpload, FiImage, FiCalendar, FiFileText, FiLink } from "react-icons/fi"; 

export default function NewslettersCreation() {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    pdf: "",
    image: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("adminToken");
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ✅ Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose a valid image file.");
      return;
    }

    // ✅ Validate WebP format
    if (file.type !== "image/webp") {
      toast.error("Only WebP images are allowed.");
      return;
    }

    // ✅ Validate file size (200 KB max)
    if (file.size > 200 * 1024) {
      toast.error("Image must be 200KB or below for better performance.");
      return;
    }

    // ✅ If valid, update state
    setImageFile(file);
    setFormData((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate required fields
    if (!formData.title || !formData.date) {
      setIsLoading(false);
      return toast.error("Title and Date are required.");
    }

    // Validate PDF URL
    const urlRegex = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/;
    if (!urlRegex.test(formData.pdf)) {
      setIsLoading(false);
      return toast.error("Please enter a valid PDF link.");
    }

    try {
      let imageUrl = "";

      if (imageFile) {
        setIsUploading(true);
        const fileName = Date.now() + "_" + imageFile.name;
        const { error } = await upploadMediaToSupabase(new File([imageFile], fileName));
        if (error) throw error;

        const { data } = supabase.storage.from("image").getPublicUrl(fileName);
        imageUrl = data.publicUrl;
        setIsUploading(false);
      }

      const payload = {
        title: formData.title,
        date: formData.date,
        pdf: formData.pdf,
        image: imageUrl
      };

      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/newsletter`, payload, headers);

      toast.success("Newsletter created successfully!");
      navigate("/admin/dashboard/newsletter");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create newsletter.");
    } finally {
      setIsLoading(false);
      setIsUploading(false);
    }
  };

  return (
    <div className="p-3 sm:p-6 text-white min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header - Mobile Responsive */}
        <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--color-primary)]">Create Newsletter</h2>
          <div className="relative group cursor-pointer">
            <div className="w-4 h-4 flex items-center justify-center rounded-full bg-blue-500 text-white text-[10px] font-bold">
              i
            </div>
            <div className="absolute z-10 w-48 sm:w-56 top-full mt-1 left-1/2 -translate-x-1/2 bg-gray-900/95 backdrop-blur-sm text-white text-[10px] rounded-lg px-3 py-2 shadow-xl border border-white/10 opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none">
              Create engaging newsletters with PDF links and cover images for your community members.
            </div>
          </div>
        </div>

        {/* Glass Form Container - Mobile Responsive */}
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl overflow-hidden">
          <div className="p-4 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Title Field */}
                <div className="lg:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-white/90 mb-3">
                    <FiFileText className="text-[var(--color-primary)] text-base sm:text-lg" />
                    Newsletter Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter newsletter title"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all duration-300 text-sm sm:text-base"
                  />
                </div>

                {/* Date Field */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-white/90 mb-3">
                    <FiCalendar className="text-[var(--color-primary)] text-base sm:text-lg" />
                    Publication Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all duration-300 text-sm sm:text-base"
                  />
                </div>

                {/* PDF Link Field */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-white/90 mb-3">
                    <FiLink className="text-[var(--color-primary)] text-base sm:text-lg" />
                    PDF Link
                  </label>
                  <input
                    type="text"
                    name="pdf"
                    value={formData.pdf}
                    onChange={handleChange}
                    placeholder="https://fliphtml5.com/book-link"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] transition-all duration-300 text-sm sm:text-base"
                  />
                  
                  {/* Info Box - Mobile Responsive */}
                  <div className="mt-3 p-3 sm:p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 shadow-lg">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="p-1 rounded-full bg-blue-400/20 border border-blue-400/30 flex-shrink-0 mt-0.5">
                        <FiInfo className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                          <span className="font-medium text-white">How it works:</span> Upload your PDF to{" "}
                          <a
                            href="https://fliphtml5.com"
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-400 hover:text-blue-300 underline transition-colors duration-200 font-medium"
                          >
                            FlipHTML5.com
                          </a>{" "}
                          and paste the public view link here for an interactive reading experience with page-flipping animations.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Image Upload Section - Mobile Responsive */}
                <div className="lg:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-white/90 mb-3">
                    <FiImage className="text-[var(--color-primary)] text-base sm:text-lg" />
                    Cover Image
                  </label>
                  
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                    {/* Image Preview - Mobile Responsive */}
                    {formData.image && (
                      <div className="relative group mx-auto sm:mx-0">
                        <img
                          src={formData.image}
                          alt="Newsletter cover preview"
                          className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border-2 border-white/20 shadow-lg"
                        />
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
                          <span className="text-white text-xs font-medium">Preview</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Upload Button - Mobile Responsive */}
                    <div className="flex-1 w-full">
                      <label className="cursor-pointer">
                        <div className="flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg hover:bg-white/20 hover:border-white/30 transition-all duration-300 group">
                          <FiUpload className="text-[var(--color-primary)] group-hover:scale-110 transition-transform duration-200 text-base sm:text-lg" />
                          <span className="text-white font-medium text-sm sm:text-base">
                            {formData.image ? 'Change Image' : 'Choose Cover Image'}
                          </span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>

                      {/* Info Box - Mobile Responsive */}
                      <div className="mt-3 p-3 sm:p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 shadow-lg">
                        <div className="flex items-start gap-2 sm:gap-3">
                          <div className="p-1.5 rounded-full bg-blue-400/20 border border-blue-400/30 flex-shrink-0 mt-0.5">
                            <FiInfo className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                              <span className="font-bold text-white">Important: </span>  
                              Your project image size <span className="text-blue-400 font-semibold">must be below 200 KB</span> and format should be <span className="text-blue-400 font-semibold">WEBP</span>.  
                              Please use{" "}
                              <a
                                href="https://towebp.io/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 underline transition-colors duration-200 font-medium"
                                >
                                towebp.io
                              </a>{" "}
                              to compress and convert images. This step is required to ensure faster load times and better website performance.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Mobile Responsive */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => navigate("/admin/dashboard/newsletter")}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-white/10 backdrop-blur-md text-white rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/20 font-medium text-sm sm:text-base order-2 sm:order-1"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || isUploading}
                  className="px-6 sm:px-8 py-2 sm:py-3 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg shadow-[var(--color-primary)]/20 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base order-1 sm:order-2"
                >
                  {isLoading || isUploading ? (
                    <>
                      <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      {isUploading ? 'Uploading...' : 'Creating...'}
                    </>
                  ) : (
                    'Create Newsletter'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Loading Overlay - Mobile Responsive */}
        {(isLoading || isUploading) && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 sm:p-8 rounded-2xl shadow-2xl max-w-sm w-full mx-4">
              <div className="flex flex-col items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 border-3 sm:border-4 border-white/20 border-t-[var(--color-primary)] rounded-full animate-spin"></div>
                <p className="text-white font-medium text-sm sm:text-base text-center">
                  {isUploading ? 'Uploading image...' : 'Creating newsletter...'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}