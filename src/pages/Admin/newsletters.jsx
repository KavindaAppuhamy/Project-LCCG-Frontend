// FULL CODE FOR Newsletters.jsx with EDIT POPUP and Supabase image handling

import { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  supabase,
  upploadMediaToSupabase,
  deleteMediaFromSupabase,
} from "../../utill/mediaUpload.js";

export default function Newsletters() {
  const [newsletters, setNewsletters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [editData, setEditData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedNewsletter, setSelectedNewsletter] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null);

  const token = localStorage.getItem("adminToken");
  const headers = { headers: { Authorization: `Bearer ${token}` } };
  const navigate = useNavigate();

  const fetchNewsletters = async (page = 1) => {
    try {
      const statusQuery = filter !== "all" ? `&status=${filter}` : "";
      const searchQuery = search ? `&query=${search}` : "";
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/newsletter/search?page=${page}&limit=5${statusQuery}${searchQuery}`,
        headers
      );
      setNewsletters(res.data.newsletters);
      setCurrentPage(res.data.page);
      setTotalPages(res.data.pages);
    } catch (err) {
      toast.error("Failed to fetch newsletters");
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
    const file = e.target.files[0];
    if (!file) return;

    if (type === "image") {
      if (!file.type.startsWith("image/")) return toast.error("Image must be a valid image file.");
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
      const old = selectedNewsletter.image?.split("/").pop()?.split("?")[0];
      if (old) await deleteMediaFromSupabase(old);
      const fileName = Date.now() + "_" + newImageFile.name;
      await upploadMediaToSupabase(new File([newImageFile], fileName));
      const { data } = supabase.storage.from("image").getPublicUrl(fileName);
      imageUrl = data.publicUrl;
    }

    await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/newsletter/${selectedNewsletter._id}`,
      { ...editData, image: imageUrl },
      headers
    );

    toast.success("Newsletter updated");
    setShowEditModal(false);
    fetchNewsletters(currentPage);
  } catch (err) {
    console.error(err);
    toast.error("Failed to update newsletter");
  }
};


  const handleDelete = async (id) => {
    if (!confirm("Delete this newsletter?")) return;
    try {
      const n = newsletters.find((item) => item._id === id);
      if (n?.image) {
        const fileName = n.image.split("/").pop().split("?")[0];
        await deleteMediaFromSupabase(fileName);
      }
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/newsletter/${id}`, headers);
      toast.success("Newsletter deleted");
      fetchNewsletters(currentPage);
    } catch {
      toast.error("Delete failed");
    }
  };

  const toggleDisabled = async (id, disabled) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/newsletter/${id}`,
        { disabled: !disabled },
        headers
      );
      fetchNewsletters(currentPage);
    } catch {
      toast.error("Failed to toggle status");
    }
  };

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[var(--color-primary)]">Manage Newsletters</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 rounded bg-[var(--color-card)] border border-white/10 text-white"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 bg-[var(--color-card)] border border-white/10 rounded text-white"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--color-accent)] text-white">
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">PDF</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {newsletters.map((n) => (
              <tr key={n._id} className="border-b border-white/10 hover:bg-[var(--color-card)] transition">
                <td className="px-4 py-2"><img src={n.image} className="w-12 h-12 object-cover rounded" /></td>
                <td className="px-4 py-2">{n.title}</td>
                <td className="px-4 py-2"><a href={n.pdf} target="_blank" rel="noreferrer" className="text-blue-400">View</a></td>
                <td className="px-4 py-2">{new Date(n.date).toLocaleDateString()}</td>
                <td className="px-4 py-2">{n.disabled ? "Disabled" : "Active"}</td>
                <td className="px-4 py-2 flex gap-3 items-center">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!n.disabled}
                      onChange={() => toggleDisabled(n._id, n.disabled)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-red-500 peer-checked:bg-green-500 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all relative" />
                  </label>
                  <button className="text-yellow-400" onClick={() => handleEditClick(n)}><FiEdit2 /></button>
                  <button className="text-red-500" onClick={() => handleDelete(n._id)}><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => fetchNewsletters(i + 1)}
            className={`px-3 py-1 text-sm rounded ${currentPage === i + 1 ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-card)] text-white/70 hover:text-white"}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Floating Button */}
      <button onClick={() => navigate("/admin/dashboard/newsletter-registration")} className="fixed bottom-6 right-6 bg-[var(--color-primary)] hover:opacity-90 text-white rounded-full w-12 h-12 flex justify-center items-center shadow-lg">
        <FiPlus className="text-xl" />
      </button>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
          <div className="bg-[var(--color-card)] p-6 rounded-lg w-[90%] max-w-2xl">
            <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-4">Edit Newsletter</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-sm mb-1">Title</label>
                <input name="title" value={editData.title} onChange={handleEditChange} className="px-3 py-2 rounded bg-[var(--color-bg)] text-white border border-white/10" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm mb-1">Date</label>
                <input type="date" name="date" value={editData.date} onChange={handleEditChange} className="px-3 py-2 rounded bg-[var(--color-bg)] text-white border border-white/10" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm mb-1">Image</label>
                <img src={editData.image} className="w-24 h-24 object-cover rounded mb-2" />
                <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "image")} className="text-white" />
              </div>
              <div className="flex flex-col">
  <label className="text-sm mb-1">PDF Link</label>
  <input
    type="text"
    name="pdf"
    value={editData.pdf}
    onChange={handleEditChange}
    className="px-3 py-2 rounded bg-[var(--color-bg)] border border-white/10 text-white"
  />
  {editData.pdf && (
    <a
      href={editData.pdf}
      target="_blank"
      rel="noreferrer"
      className="text-blue-400 text-sm mt-1"
    >
      View PDF
    </a>
  )}
</div>
            </div>
            <div className="flex justify-end mt-6 gap-3">
              <button onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-gray-600 rounded text-white">Cancel</button>
              <button onClick={saveEdit} className="px-4 py-2 bg-[var(--color-primary)] text-white rounded">Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
