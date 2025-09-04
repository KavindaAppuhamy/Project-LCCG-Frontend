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
  const [isLoading, setIsLoading] = useState(true);

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
      setIsLoading(true);
      const disabledQuery = filter === "all" ? "" : `&disabled=${filter === "disabled" ? "true" : "false"}`;
      const query = search ? `&query=${encodeURIComponent(search)}` : "";
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/testimonials/search?page=${p}&limit=5${disabledQuery}${query}`,
        headers
      );
      setTestimonials(res.data.testimonials || []);
      setPage(res.data.page || 1);
      setPages(res.data.pages || 1);
      setIsLoading(false);
    } catch (err) {
      console.error("fetch testimonials failed", err);
      toast.error("Failed to fetch testimonials");
      setIsLoading(false);
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
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold text-[var(--color-primary)]">Manage Testimonials</h2>
          <div className="relative group cursor-pointer">
            <div className="w-4 h-4 flex items-center justify-center rounded-full bg-blue-500 text-white text-[10px] font-bold">
              i
            </div>
            <div className="absolute z-10 w-48 top-full mt-1 left-1/2 -translate-x-1/2 bg-gray-900/95 backdrop-blur-sm text-white text-[10px] rounded-lg px-3 py-2 shadow-xl border border-white/10 opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none">
              Only <span className="text-green-400 font-medium">active</span> testimonials are displayed on the public website.
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search testimonials"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="appearance-none bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/50 shadow-lg hover:bg-white/15 hover:shadow-xl hover:border-white/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:bg-white/20 min-w-[200px]"
            />  
          </div>

          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 pr-10 text-white shadow-lg hover:bg-white/15 hover:shadow-xl hover:border-white/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:bg-white/20 cursor-pointer min-w-[120px]"
            >
              <option value="all" className="bg-gray-900/95 text-white hover:bg-gray-800">All</option>
              <option value="active" className="bg-gray-900/95 text-white hover:bg-gray-800">Active</option>
              <option value="disabled" className="bg-gray-900/95 text-white hover:bg-gray-800">Disabled</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Spinner or Table */}
      {isLoading ? (
        <div className="w-full h-full flex justify-center items-center min-h-[400px]"> 
          <div className="w-[70px] h-[70px] border-[5px] border-white/20 border-t-[var(--color-primary)] rounded-full animate-spin">
          </div>
        </div>
      ) : (
        <>
          {/* Glass Table Container */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/10 backdrop-blur-sm border-b border-white/10">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider">Image</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider">Position</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider">Speech</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {testimonials.map((t) => (
                    <tr 
                      key={t._id} 
                      className="hover:bg-white/5 transition-all duration-200 h-16 group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img 
                          src={t.image} 
                          alt={t.name} 
                          className="w-12 h-12 object-cover rounded-full border-2 border-white/20 shadow-lg" 
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{t.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white/80">{t.position}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-white/80 max-w-xs truncate">
                          {t.speech?.slice(0, 80) || ""}...
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${
                          !t.disabled ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                          'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {t.disabled ? "Disabled" : "Active"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <label className="inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={!t.disabled} 
                              onChange={() => toggleDisabled(t)} 
                              className="sr-only peer" 
                            />
                            <div className="relative w-11 h-6 bg-red-500/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500/30" />
                          </label>

                          <button
                            onClick={() => openView(t)}
                            className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all duration-200 hover:scale-110"
                            title="View"
                          >
                            <FiEye size={16} />
                          </button>
                          <button
                            onClick={() => openEdit(t)}
                            className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-all duration-200 hover:scale-110"
                            title="Edit"
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(t._id)}
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

          {/* Pagination Controls */}
          {pages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              {Array.from({ length: pages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => fetchList(i + 1)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    page === i + 1 
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

      {/* Glass Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-auto">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-semibold mb-6 text-[var(--color-primary)]">Create Testimonial</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <span className="block mb-2 text-sm font-medium text-white/90">Name</span>
                <input 
                  name="name" 
                  value={createData.name} 
                  onChange={(e) => setCreateData({...createData, name: e.target.value})} 
                  className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]"
                />
              </div>
              
              <div className="flex flex-col">
                <span className="block mb-2 text-sm font-medium text-white/90">Position</span>
                <input 
                  name="position" 
                  value={createData.position} 
                  onChange={(e) => setCreateData({...createData, position: e.target.value})} 
                  className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]"
                />
              </div>
              
              <div className="flex flex-col md:col-span-2">
                <span className="block mb-2 text-sm font-medium text-white/90">Speech</span>
                <textarea 
                  value={createData.speech} 
                  onChange={(e) => setCreateData({...createData, speech: e.target.value})} 
                  className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]" 
                  rows={4} 
                />
                  <p className="text-xs mt-1 text-gray-300">
                  Recommended: 50–90 words
                </p>
              </div>
              
              <div className="flex flex-col">
                <span className="block mb-2 text-sm font-medium text-white/90">Image</span>
                <div className="flex items-center gap-4">
                  {createData.image && <img src={createData.image} className="w-20 h-20 rounded-full object-cover border-2 border-white/20" alt="preview" />}
                  <label className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-all duration-200 cursor-pointer">
                    Choose File
                    <input type="file" accept="image/*" onChange={(e) => onImageChange(e, "create")} className="hidden" />
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-6 py-3 bg-white/10 backdrop-blur-md text-white rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/20"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg shadow-[var(--color-primary)]/20"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Glass Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-auto">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-semibold mb-6 text-[var(--color-primary)]">Edit Testimonial</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <span className="block mb-2 text-sm font-medium text-white/90">Name</span>
                <input 
                  name="name" 
                  value={editData.name} 
                  onChange={(e) => setEditData({...editData, name: e.target.value})} 
                  className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]"
                />
              </div>
              
              <div className="flex flex-col">
                <span className="block mb-2 text-sm font-medium text-white/90">Position</span>
                <input 
                  name="position" 
                  value={editData.position} 
                  onChange={(e) => setEditData({...editData, position: e.target.value})} 
                  className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]"
                />
              </div>
              
              <div className="flex flex-col md:col-span-2">
                <span className="block mb-2 text-sm font-medium text-white/90">Speech</span>
                <textarea 
                  value={editData.speech} 
                  onChange={(e) => setEditData({...editData, speech: e.target.value})} 
                  className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]" 
                  rows={4} 
                />
                <p className="text-xs mt-1 text-gray-300">
                  Recommended: 50–90 words
                </p>
              </div>
              
              <div className="flex flex-col">
                <span className="block mb-2 text-sm font-medium text-white/90">Image</span>
                <div className="flex items-center gap-4">
                  {editData.image && <img src={editData.image} className="w-20 h-20 rounded-full object-cover border-2 border-white/20" alt="preview" />}
                  <label className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-all duration-200 cursor-pointer">
                    Choose File
                    <input type="file" accept="image/*" onChange={(e) => onImageChange(e, "edit")} className="hidden" />
                  </label>
                </div>
              </div>
              
              <div className="flex flex-col items-start">
                <span className="block mb-2 text-sm font-medium text-white/90">Disabled</span>
                <label className="inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={!!editData.disabled} 
                    onChange={(e) => setEditData({...editData, disabled: e.target.checked})} 
                    className="sr-only peer" 
                  />
                  <div className="relative w-11 h-6 bg-gray-500/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500/30" />
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-6 py-3 bg-white/10 backdrop-blur-md text-white rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/20"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg shadow-[var(--color-primary)]/20"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Glass View Modal */}
      {showViewModal && selected && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-auto">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex justify-center mb-6">
              <img src={selected.image} alt={selected.name} className="w-28 h-28 rounded-full object-cover border-4 border-white/20 shadow-xl" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 text-center">{selected.name}</h3>
            <p className="text-center text-[var(--color-primary)] font-medium mb-6">{selected.position}</p>
            
            <div className="space-y-4 text-white text-sm mb-6">
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <p className="text-white/90 leading-relaxed">{selected.speech}</p>
              </div>
              
              <div className="flex justify-between items-center py-2 border-b border-white/10">
                <span className="text-white/70">Status:</span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${
                  !selected.disabled ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {selected.disabled ? "Disabled" : "Active"}
                </span>
              </div>
            </div>
            
            <div className="flex justify-center">
              <button 
                onClick={() => setShowViewModal(false)} 
                className="px-6 py-3 bg-white/10 backdrop-blur-md text-white rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/20"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Add Button with Glass Effect */}
      <button
        className="fixed bottom-6 right-6 bg-[var(--color-primary)]/90 backdrop-blur-md hover:bg-[var(--color-primary)] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-2xl border border-white/10 transition-all duration-300 hover:scale-110 hover:shadow-[var(--color-primary)]/20"
        onClick={() => setShowCreateModal(true)}
        title="Add New Testimonial"
      >
        <FiPlus className="text-xl" />
      </button>
    </div>
  );
}