import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { supabase, upploadMediaToSupabase } from "../../utill/mediaUpload.js";
import { FiInfo } from "react-icons/fi"; 

export default function NewslettersCreation() {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    pdf: "",
    image: ""
  });
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("adminToken");
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      return toast.error("Only image files are allowed.");
    }
    setImageFile(file);
    setFormData({ ...formData, image: URL.createObjectURL(file) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.title || !formData.date) {
      return toast.error("Title and Date are required.");
    }

    // Validate PDF URL
    const urlRegex = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/;
    if (!urlRegex.test(formData.pdf)) {
      return toast.error("Please enter a valid PDF link.");
    }

    try {
      let imageUrl = "";

      if (imageFile) {
        const fileName = Date.now() + "_" + imageFile.name;
        const { error } = await upploadMediaToSupabase(new File([imageFile], fileName));
        if (error) throw error;

        const { data } = supabase.storage.from("image").getPublicUrl(fileName);
        imageUrl = data.publicUrl;
      }

      const payload = {
        title: formData.title,
        date: formData.date,
        pdf: formData.pdf,
        image: imageUrl
      };

      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/newsletter`, payload, headers);

      toast.success("Newsletter created!");
      navigate("/admin/dashboard/newsletter");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create newsletter.");
    }
  };

  return (
    <div className="p-6 text-white max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6">Create Newsletter</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-[var(--color-bg)] border border-white/10 text-white"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-[var(--color-bg)] border border-white/10 text-white"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm mb-1">Image</label>
          {formData.image && (
            <img
              src={formData.image}
              alt="Preview"
              className="w-24 h-24 object-cover rounded mb-2"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="text-white"
          />
        </div>

        {/* PDF Link */}
        <div>
        <label className="text-sm mb-1 text-white flex items-center gap-1">
            PDF Link
        </label>
        <input
            type="text"
            name="pdf"
            value={formData.pdf}
            onChange={handleChange}
            placeholder="https://fliphtml5.com/book-link"
            className="w-full px-4 py-2 rounded bg-[var(--color-bg)] border border-white/10 text-white"
        />
        <p className="text-sm text-white/60 mt-1 flex items-start gap-1">
            <FiInfo className="mt-[2px] text-blue-400" />
            Upload your PDF to{" "}
            <a
            href="https://fliphtml5.com"
            target="_blank"
            rel="noreferrer"
            className="text-blue-400 underline ml-1"
            >
            FlipHTML5.com
            </a>{" "}
            and paste the public view link here.
        </p>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-[var(--color-primary)] text-white rounded hover:opacity-90"
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
