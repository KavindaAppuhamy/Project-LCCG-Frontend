// src/pages/admin/Testimonials.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit2, FiTrash2, FiPlus, FiEye } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { supabase, upploadMediaToSupabase, deleteMediaFromSupabase } from "../../utill/mediaUpload.js";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | active | disabled

  // modals / editing
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selected, setSelected] = useState(null); // for view / edit
  const [editData, setEditData] = useState({ name: "", position: "", speech: "", image: "", disabled: false });
  const [createData, setCreateData] = useState({ name: "", position: "", speech: "", image: "" });
  const [newImageFile, setNewImageFile] = useState(null);
  const [newCreateImageFile, setNewCreateImageFile] = useState(null);

  const token = localStorage.getItem("adminToken");
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  const fetchList = async (p = 1) => {
    try {
      const disabledQuery = filter === "all" ? "" : `&disabled=${filter === "disabled" ? "true" : "false"}`;
      const query = search ? `&query=${encodeURIComponent(search)}` : "";
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/testimonials/search?page=${p}&limit=5${disabledQuery}${query}`,
        headers
      );
      setTestimonials(res.data.testimonials || []);
      setPage(res.data.page || 1);
      setPages(res.data.pages || 1);
    } catch (err) {
      console.error("fetch testimonials failed", err);
      toast.error("Failed to fetch testimonials");
    }
  };

  useEffect(() => {
    fetchList(1);
    // eslint-disable-next-line
  }, [filter, search]);

  // common helpers
  const openEdit = (item) => {
    setSelected(item);
    setEditData({
      name: item.name || "",
      position: item.position || "",
      speech: item.speech || "",
      image: item.image || "",
      disabled: !!item.disabled,
    });
    setNewImageFile(null);
    setShowEditModal(true);
  };

  const openView = (item) => {
    setSelected(item);
    setShowViewModal(true);
  };

  // image input change
  const onImageChange = (e, mode = "edit") => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }
    if (mode === "edit") {
      setNewImageFile(f);
      setEditData(prev => ({ ...prev, image: URL.createObjectURL(f) }));
    } else {
      setNewCreateImageFile(f);
      setCreateData(prev => ({ ...prev, image: URL.createObjectURL(f) }));
    }
  };

  // validations
  const validatePayload = (payload) => {
    if (!payload.name || !payload.name.trim()) return "Name is required";
    if (!payload.position || !payload.position.trim()) return "Position is required";
    if (!payload.speech || !payload.speech.trim()) return "Speech is required";
    // image is required on create, optional on edit
    return null;
  };

  // Create testimonial
  const handleCreate = async () => {
    const errMsg = validatePayload(createData);
    if (errMsg) return toast.error(errMsg);
    if (!newCreateImageFile && !createData.image) return toast.error("Image is required");

    try {
      let imageUrl = createData.image;
      if (newCreateImageFile) {
        const fileName = Date.now() + "_" + newCreateImageFile.name;
        const { error } = await upploadMediaToSupabase(new File([newCreateImageFile], fileName));
        if (error) throw error;
        const { data } = supabase.storage.from("image").getPublicUrl(fileName);
        imageUrl = data.publicUrl;
      }

      const payload = { ...createData, image: imageUrl, disabled: false };
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/testimonials`, payload, headers);
      toast.success("Testimonial created");
      setShowCreateModal(false);
      setCreateData({ name: "", position: "", speech: "", image: "" });
      setNewCreateImageFile(null);
      fetchList(page);
    } catch (err) {
      console.error("create failed", err);
      toast.error("Failed to create testimonial");
    }
  };

  // Update testimonial
  const handleUpdate = async () => {
    const errMsg = validatePayload(editData);
    if (errMsg) return toast.error(errMsg);

    try {
      let imageUrl = editData.image;

      if (newImageFile) {
        // delete old file from supabase (if it looks like a supabase publicUrl)
        const oldName = selected?.image?.split("/").pop()?.split("?")[0];
        if (oldName) {
          try { await deleteMediaFromSupabase(oldName); } catch (e) { console.warn("old delete failed", e); }
        }
        const newFileName = Date.now() + "_" + newImageFile.name;
        const { error } = await upploadMediaToSupabase(new File([newImageFile], newFileName));
        if (error) throw error;
        const { data } = supabase.storage.from("image").getPublicUrl(newFileName);
        imageUrl = data.publicUrl;
      }

      const payload = { ...editData, image: imageUrl };
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/testimonials/${selected._id}`, payload, headers);
      toast.success("Testimonial updated");
      setShowEditModal(false);
      fetchList(page);
    } catch (err) {
      console.error("update failed", err);
      toast.error("Failed to update testimonial");
    }
  };

  // Delete testimonial (also delete image from supabase)
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      const t = testimonials.find(x => x._id === id);
      if (t?.image) {
        const fileName = t.image.split("/").pop().split("?")[0];
        if (fileName) {
          try { await deleteMediaFromSupabase(fileName); } catch (e) { console.warn("supabase delete failed", e); }
        }
      }
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/testimonials/${id}`, headers);
      toast.success("Deleted");
      fetchList(page);
    } catch (err) {
      console.error("delete failed", err);
      toast.error("Failed to delete");
    }
  };

  // toggle disabled
  const toggleDisabled = async (item) => {
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/testimonials/${item._id}`, { disabled: !item.disabled }, headers);
      toast.success(!item.disabled ? "Disabled" : "Enabled");
      fetchList(page);
    } catch (err) {
      console.error("toggle failed", err);
      toast.error("Failed to toggle disabled");
    }
  };

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[var(--color-primary)]">Manage Testimonials</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by name/position/speech"
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
          <button onClick={() => setShowCreateModal(true)} className="px-3 py-2 bg-[var(--color-primary)] rounded">Create</button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--color-accent)] text-white">
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Position</th>
              <th className="px-4 py-2">Speech</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.map((t) => (
              <tr key={t._id} className="border-b border-white/10 hover:bg-[var(--color-card)] transition">
                <td className="px-4 py-2"><img src={t.image} alt={t.name} className="w-12 h-12 object-cover rounded" /></td>
                <td className="px-4 py-2">{t.name}</td>
                <td className="px-4 py-2">{t.position}</td>
                <td className="px-4 py-2">{t.speech?.slice(0, 80) || ""}</td>
                <td className="px-4 py-2">{t.disabled ? "Disabled" : "Active"}</td>
                <td className="px-4 py-2 flex gap-3 items-center">
                  <label className="inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={!t.disabled} onChange={() => toggleDisabled(t)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-red-500 peer-checked:bg-green-500 rounded-full relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all" />
                  </label>

                  <button onClick={() => openView(t)} className="text-blue-400" title="View"><FiEye /></button>
                  <button onClick={() => openEdit(t)} className="text-yellow-400" title="Edit"><FiEdit2 /></button>
                  <button onClick={() => handleDelete(t._id)} className="text-red-500" title="Delete"><FiTrash2 /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: pages }, (_, i) => (
          <button
            key={i}
            onClick={() => { fetchList(i + 1); }}
            className={`px-3 py-1 rounded text-sm ${page === i + 1 ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-card)] text-white/60 hover:text-white"}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
          <div className="bg-[var(--color-card)] p-6 rounded-lg w-[90%] max-w-2xl">
            <h3 className="text-xl mb-4 text-[var(--color-primary)]">Create Testimonial</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-sm mb-1">Name</label>
                <input name="name" value={createData.name} onChange={(e) => setCreateData({...createData, name: e.target.value})} className="px-3 py-2 rounded bg-[var(--color-bg)] text-white border border-white/10" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm mb-1">Position</label>
                <input name="position" value={createData.position} onChange={(e) => setCreateData({...createData, position: e.target.value})} className="px-3 py-2 rounded bg-[var(--color-bg)] text-white border border-white/10" />
              </div>
              <div className="flex flex-col md:col-span-2">
                <label className="text-sm mb-1">Speech</label>
                <textarea value={createData.speech} onChange={(e) => setCreateData({...createData, speech: e.target.value})} className="px-3 py-2 rounded bg-[var(--color-bg)] text-white border border-white/10" rows={4} />
              </div>
              <div className="flex flex-col">
                <label className="text-sm mb-1">Image</label>
                <input type="file" accept="image/*" onChange={(e) => onImageChange(e, "create")} className="text-white" />
                {createData.image && <img src={createData.image} className="w-24 h-24 object-cover rounded mt-2" alt="preview" />}
              </div>
            </div>
            <div className="flex justify-end mt-6 gap-3">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 bg-gray-600 rounded text-white">Cancel</button>
              <button onClick={handleCreate} className="px-4 py-2 bg-[var(--color-primary)] rounded text-white">Create</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
          <div className="bg-[var(--color-card)] p-6 rounded-lg w-[90%] max-w-2xl">
            <h3 className="text-xl mb-4 text-[var(--color-primary)]">Edit Testimonial</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-sm mb-1">Name</label>
                <input name="name" value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} className="px-3 py-2 rounded bg-[var(--color-bg)] text-white border border-white/10" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm mb-1">Position</label>
                <input name="position" value={editData.position} onChange={(e) => setEditData({...editData, position: e.target.value})} className="px-3 py-2 rounded bg-[var(--color-bg)] text-white border border-white/10" />
              </div>
              <div className="flex flex-col md:col-span-2">
                <label className="text-sm mb-1">Speech</label>
                <textarea value={editData.speech} onChange={(e) => setEditData({...editData, speech: e.target.value})} className="px-3 py-2 rounded bg-[var(--color-bg)] text-white border border-white/10" rows={4} />
              </div>
              <div className="flex flex-col">
                <label className="text-sm mb-1">Image</label>
                {editData.image && <img src={editData.image} className="w-24 h-24 object-cover rounded mb-2" alt="preview" />}
                <input type="file" accept="image/*" onChange={(e) => onImageChange(e, "edit")} className="text-white" />
              </div>
              <div className="flex flex-col items-start">
                <label className="text-sm mb-1">Disabled</label>
                <input type="checkbox" checked={!!editData.disabled} onChange={(e) => setEditData({...editData, disabled: e.target.checked})} />
              </div>
            </div>
            <div className="flex justify-end mt-6 gap-3">
              <button onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-gray-600 rounded text-white">Cancel</button>
              <button onClick={handleUpdate} className="px-4 py-2 bg-[var(--color-primary)] rounded text-white">Update</button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
          <div className="bg-[var(--color-card)] p-6 rounded-lg w-[90%] max-w-md">
            <div className="flex flex-col items-center">
              <img src={selected.image} alt={selected.name} className="w-28 h-28 rounded-full object-cover mb-4" />
              <h3 className="text-2xl font-bold">{selected.name}</h3>
              <p className="text-sm text-white/70">{selected.position}</p>
              <p className="mt-3 text-white text-sm">{selected.speech}</p>
              <p className="mt-3 text-white/70">Status: {selected.disabled ? "Disabled" : "Active"}</p>
              <div className="mt-4">
                <button onClick={() => setShowViewModal(false)} className="px-4 py-2 bg-gray-600 rounded text-white">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
