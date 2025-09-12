// FULL CODE FOR Newsletters.jsx with Mobile Responsive Design

import { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit2, FiTrash2, FiPlus, FiInfo } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  supabase,
  uploadMediaToSupabase,
  deleteMediaFromSupabase,
} from "../../utill/mediaUpload.js";

export default function Newsletters() {
  const [newsletters, setNewsletters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const [editData, setEditData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedNewsletter, setSelectedNewsletter] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null);

  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");

  const token = localStorage.getItem("adminToken");
  const headers = { headers: { Authorization: `Bearer ${token}` } };
  const navigate = useNavigate();

  const fetchNewsletters = async (page = 1) => {
    try {
      setIsLoading(true);
      const statusQuery = filter !== "all" ? `&status=${filter}` : "";
      const searchQuery = search ? `&query=${search}` : "";
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/newsletter/search?page=${page}&limit=5${statusQuery}${searchQuery}`,
        headers
      );
      setNewsletters(res.data.newsletters);
      setCurrentPage(res.data.page);
      setTotalPages(res.data.pages);
      setIsLoading(false);
    } catch (err) {
      console.error("Failed to fetch newsletters", err);
      toast.error("Failed to fetch newsletters");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsletters();
  }, [filter, search]);

  const handleEditClick = (newsletter) => {
    setSelectedNewsletter(newsletter);
    setEditData({
      title: newsletter.title,
      date: newsletter.date?.split("T")[0],
      image: newsletter.image,
      pdf: newsletter.pdf,
      disabled: newsletter.disabled || false,
    });
    setNewImageFile(null);
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "image") {
      if (!file.type.startsWith("image/")) {
        toast.error("Please choose a valid image file.");
        return;
      }
      if (file.type !== "image/webp") {
        toast.error("Only WebP images are allowed.");
        return;
      }
      if (file.size > 200 * 1024) {
        toast.error("Image must be 200KB or below for better performance.");
        return;
      }

      setNewImageFile(file);
      setEditData((prev) => ({ ...prev, image: URL.createObjectURL(file) }));
    }
  };

  const saveEdit = async () => {
    if (!editData.title || !editData.date) {
      return toast.error("Title and Date are required.");
    }

    const urlRegex = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/;
    if (editData.pdf && !urlRegex.test(editData.pdf)) {
      return toast.error("Please enter a valid PDF link.");
    }

    try {
      let imageUrl = editData.image;

      if (newImageFile) {
        const oldFile = selectedNewsletter.image?.split("/").pop()?.split("?")[0];
        if (oldFile) {
          try {
            await deleteMediaFromSupabase(oldFile);
          } catch (e) {
            console.warn("Failed to delete old image", e);
          }
        }

        // Upload new image
        const path = await uploadMediaToSupabase(newImageFile);

        // Get public URL
        const { data } = supabase.storage.from("image").getPublicUrl(path);
        imageUrl = data.publicUrl;
      }

      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/newsletter/${selectedNewsletter._id}`,
        { ...editData, image: imageUrl },
        headers
      );

      toast.success("Newsletter updated successfully!");
      setShowEditModal(false);
      fetchNewsletters(currentPage);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update newsletter");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this newsletter?")) return;
    try {
      const n = newsletters.find((item) => item._id === id);
      if (n?.image) {
        const fileName = n.image.split("/").pop()?.split("?")[0];
        if (fileName) {
          try {
            await deleteMediaFromSupabase(fileName);
          } catch (err) {
            console.warn("Failed to delete image from Supabase:", err);
          }
        }
      }
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/newsletter/${id}`, headers);
      toast.success("Newsletter deleted successfully!");
      fetchNewsletters(currentPage);
    } catch (err) {
      console.error("Failed to delete newsletter", err);
      toast.error("Failed to delete newsletter. Please try again.");
    }
  };

  const toggleDisabled = async (id, disabled) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/newsletter/${id}`,
        { disabled: !disabled },
        headers
      );
      toast.success(`Newsletter ${disabled ? 'enabled' : 'disabled'} successfully!`);
      fetchNewsletters(currentPage);
    } catch (err) {
      console.error("Failed to toggle status", err);
      toast.error("Failed to toggle status");
    }
  };

  return (
    <div className="p-3 sm:p-4 md:p-6 text-white">
      {/* Header Section - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--color-primary)]">Manage Newsletters</h2>
          <div className="relative group cursor-pointer">
            <div className="w-4 h-4 flex items-center justify-center rounded-full bg-blue-500 text-white text-[10px] font-bold">
              i
            </div>
            <div className="absolute z-10 w-48 top-full mt-1 left-1/2 -translate-x-1/2 bg-gray-900/95 backdrop-blur-sm text-white text-[10px] rounded-lg px-3 py-2 shadow-xl border border-white/10 opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none">
              Only <span className="text-green-400 font-medium">active</span> newsletters are displayed to the public.
            </div>
          </div>
        </div>

        {/* Search and Filter Controls - Mobile Responsive */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search newsletters..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="appearance-none bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base text-white placeholder-white/50 shadow-lg hover:bg-white/15 hover:shadow-xl hover:border-white/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:bg-white/20 w-full sm:min-w-[200px]"
            />
          </div>

          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-3 sm:px-4 py-2 sm:py-3 pr-8 sm:pr-10 text-sm sm:text-base text-white shadow-lg hover:bg-white/15 hover:shadow-xl hover:border-white/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:bg-white/20 cursor-pointer w-full sm:min-w-[120px]"
            >
              <option value="all" className="bg-gray-900/95 text-white hover:bg-gray-800">All</option>
              <option value="active" className="bg-gray-900/95 text-white hover:bg-gray-800">Active</option>
              <option value="disabled" className="bg-gray-900/95 text-white hover:bg-gray-800">Disabled</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3 pointer-events-none">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Spinner or Content */}
      {isLoading ? (
        <div className="w-full h-full flex justify-center items-center min-h-[400px]">
          <div className="w-[50px] h-[50px] sm:w-[70px] sm:h-[70px] border-[4px] sm:border-[5px] border-white/20 border-t-[var(--color-primary)] rounded-full animate-spin">
          </div>
        </div>
      ) : (
        <>
          {/* Mobile Card View (Hidden on Desktop) */}
          <div className="block lg:hidden space-y-4">
            {newsletters.map((newsletter) => (
              <div
                key={newsletter._id}
                className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl p-4"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <img
                      src={newsletter.image}
                      alt="Newsletter"
                      className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg border border-white/20 shadow-lg flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm sm:text-base font-medium text-white truncate">{newsletter.title}</h3>
                      <p className="text-xs sm:text-sm text-white/60 mt-1">{new Date(newsletter.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="space-y-3">
                  {/* PDF and Status Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      {newsletter.pdf ? (
                        <button
                          onClick={() => {
                            setPdfUrl(newsletter.pdf);
                            setShowPdfModal(true);
                          }}
                          className="inline-flex items-center px-2 sm:px-3 py-1 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-all duration-200 text-xs sm:text-sm font-medium"
                        >
                          View PDF
                        </button>
                      ) : (
                        <span className="text-white/50 text-xs sm:text-sm">No PDF</span>
                      )}
                    </div>
                    
                    <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium capitalize ${
                      newsletter.disabled
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-green-500/20 text-green-400 border border-green-500/30'
                    }`}>
                      {newsletter.disabled ? 'Disabled' : 'Active'}
                    </span>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <div className="flex items-center gap-2 sm:gap-3">
                      {/* Toggle Switch */}
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!newsletter.disabled}
                          onChange={() => toggleDisabled(newsletter._id, newsletter.disabled)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 sm:w-11 sm:h-6 bg-red-500/70 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--color-primary)]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-green-500/70"></div>
                      </label>
                      
                      <span className="text-xs sm:text-sm text-white/70">
                        {newsletter.disabled ? 'Enable' : 'Disable'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-all duration-200"
                        title="Edit"
                        onClick={() => handleEditClick(newsletter)}
                      >
                        <FiEdit2 size={14} />
                      </button>
                      
                      <button
                        onClick={() => handleDelete(newsletter._id)}
                        className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all duration-200"
                        title="Delete"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View (Hidden on Mobile) */}
          <div className="hidden lg:block bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/10 backdrop-blur-sm border-b border-white/10">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider">Image</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider">Title</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider">PDF</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {newsletters.map((newsletter) => (
                    <tr
                      key={newsletter._id}
                      className="hover:bg-white/5 transition-all duration-200 h-16 group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img
                          src={newsletter.image}
                          alt="Newsletter"
                          className="w-12 h-12 object-cover rounded-lg border border-white/20 shadow-lg"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white max-w-xs truncate">{newsletter.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {newsletter.pdf ? (
                          <button
                          onClick={() => {
                            setPdfUrl(newsletter.pdf);
                            setShowPdfModal(true);
                          }}
                          className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-all duration-200 text-sm font-medium"
                        >
                          View PDF
                        </button>
                        ) : (
                          <span className="text-white/50 text-sm">No PDF</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white/80">{new Date(newsletter.date).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${
                          newsletter.disabled
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-green-500/20 text-green-400 border border-green-500/30'
                        }`}>
                          {newsletter.disabled ? 'Disabled' : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          {/* Toggle Switch */}
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={!newsletter.disabled}
                              onChange={() => toggleDisabled(newsletter._id, newsletter.disabled)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-red-500/70 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[var(--color-primary)]/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500/70"></div>
                          </label>
                          
                          <button
                            className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-all duration-200 hover:scale-110"
                            title="Edit"
                            onClick={() => handleEditClick(newsletter)}
                          >
                            <FiEdit2 size={16} />
                          </button>
                          
                          <button
                            onClick={() => handleDelete(newsletter._id)}
                            className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all duration-200 hover:scale-110"
                            title="Delete"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls - Mobile Responsive */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 sm:mt-8 gap-1 sm:gap-2 flex-wrap">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => fetchNewsletters(i + 1)}
                  className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                    currentPage === i + 1
                      ? "bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/20"
                      : "bg-white/10 backdrop-blur-md text-white/60 hover:text-white hover:bg-white/20 border border-white/10"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Floating Add Button - Mobile Responsive */}
      <button
        onClick={() => navigate("/admin/dashboard/newsletter-creation")}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-[var(--color-primary)]/90 backdrop-blur-md hover:bg-[var(--color-primary)] text-white rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shadow-2xl border border-white/10 transition-all duration-300 hover:scale-110 hover:shadow-[var(--color-primary)]/20 z-40"
        title="Add New Newsletter"
      >
        <FiPlus className="text-lg sm:text-xl" />
      </button>

      {/* Mobile Responsive Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-2 sm:p-4 overflow-auto">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 sm:p-8 rounded-2xl w-full max-w-4xl shadow-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-[var(--color-primary)]">Edit Newsletter</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="flex flex-col">
                <span className="block mb-2 text-sm font-medium text-white/90">Title</span>
                <input
                  name="title"
                  value={editData.title}
                  onChange={handleEditChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] text-sm sm:text-base"
                />
              </div>
              
              <div className="flex flex-col">
                <span className="block mb-2 text-sm font-medium text-white/90">Date</span>
                <input
                  type="date"
                  name="date"
                  value={editData.date}
                  onChange={handleEditChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] text-sm sm:text-base"
                />
              </div>
              
              <div className="flex flex-col lg:col-span-2">
                <span className="block mb-2 text-sm font-medium text-white/90">Image</span>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  <img
                    src={editData.image}
                    alt="Newsletter Preview"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover border-2 border-white/20"
                  />
                  <label className="px-3 sm:px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-all duration-200 cursor-pointer text-sm sm:text-base">
                    Choose File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "image")}
                      className="hidden"
                    />
                  </label>
                </div>
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
              
              <div className="flex flex-col lg:col-span-2">
                <span className="block mb-2 text-sm font-medium text-white/90">PDF Link</span>
                <input
                  type="url"
                  name="pdf"
                  value={editData.pdf || ""}
                  onChange={handleEditChange}
                  placeholder="https://example.com/newsletter.pdf"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] text-sm sm:text-base"
                />
                {editData.pdf && (
                  <a
                    href={editData.pdf}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 text-xs sm:text-sm mt-2 hover:text-blue-300 transition-colors"
                  >
                    View Current PDF →
                  </a>
                )}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-6 sm:mt-8">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-white/10 backdrop-blur-md text-white rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/20 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="px-4 sm:px-6 py-2 sm:py-3 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg shadow-[var(--color-primary)]/20 text-sm sm:text-base"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Responsive PDF View Modal */}
      {showPdfModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-2 sm:p-4">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-5xl relative max-h-[95vh] sm:max-h-[90vh]">
            {/* Close Button */}
            <button
              onClick={() => setShowPdfModal(false)}
              className="absolute top-2 right-2 sm:top-3 sm:right-3 text-white hover:text-red-400 text-lg sm:text-xl z-10 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-black/50 rounded-full backdrop-blur-sm"
            >
              ✕
            </button>

            {/* FlipHTML5 Embed */}
            <iframe
              src={pdfUrl}
              title="Newsletter PDF"
              width="100%"
              height="500"
              className="sm:h-[600px] rounded-xl sm:rounded-2xl"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

    </div>
  );
}