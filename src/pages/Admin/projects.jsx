import { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit2, FiTrash2, FiPlus, FiEye } from "react-icons/fi";
import { FaStar, FaRegStar } from "react-icons/fa";
import { toast } from "react-hot-toast";
import {
  supabase,
  upploadMediaToSupabase,
  deleteMediaFromSupabase,
} from "../../utill/mediaUpload.js";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 5;

  // Combined filter dropdown: options are status and order sorting
  const [filterOption, setFilterOption] = useState("all");

  // Create modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    description: "",
    venue: "",
    date: "",
    time: "",
    organizer: "",
    status: "upcoming",
    highlight: false,
    order: 1,
    image: "",
  });
  const [newCreateImageFile, setNewCreateImageFile] = useState(null);

  // Edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [newEditImageFile, setNewEditImageFile] = useState(null);

  // View modal
  const [showViewModal, setShowViewModal] = useState(false);

  const token = localStorage.getItem("adminToken");
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  // Fetch projects based on filter and page
  const fetchProjects = async (page = 1, filter = "all") => {
    setLoading(true);
    try {
      // For status filtering, send status param except for "all" and "order"
      // For order sorting, fetch all and filter client side because backend may not support order param
      let url = `${import.meta.env.VITE_BACKEND_URL}/api/project/search?page=${page}&limit=${perPage}`;
      if (filter !== "all" && filter !== "order") {
        url += `&status=${filter}`;
      }
      const res = await axios.get(url);
      let dataProjects = res.data.projects;

      // If filter is 'order', filter & sort client side:
      if (filter === "order") {
        dataProjects = dataProjects
          .filter((p) => p.order && p.order > 0)
          .sort((a, b) => a.order - b.order);
      }

      setProjects(dataProjects);
      setTotalPages(res.data.totalPages);
      setCurrentPage(res.data.currentPage);
    } catch (err) {
      console.error("Failed fetching projects", err);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(currentPage, filterOption);
  }, [currentPage, filterOption]);

  // Form change handlers
  const handleCreateChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCreateForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };
  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  // Image handlers
  const handleCreateImage = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast.error("Please choose a valid image file.");
      return;
    }
    setNewCreateImageFile(f);
    setCreateForm((prev) => ({ ...prev, image: URL.createObjectURL(f) }));
  };
  const handleEditImage = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast.error("Please choose a valid image file.");
      return;
    }
    setNewEditImageFile(f);
    setEditForm((prev) => ({ ...prev, image: URL.createObjectURL(f) }));
  };

  // Validation
  const validateProjectPayload = (payload, isCreate = false) => {
    const required = ["name", "description", "venue", "date", "time", "organizer", "status"];
    for (let k of required) {
      if (!payload[k] || payload[k].toString().trim() === "") {
        return `${k} is required`;
      }
    }
    const orderVal = Number(payload.order);
    if (payload.highlight && !(orderVal >= 1 && orderVal <= 5)) {
      return "Order must be between 1 and 5 when highlighted.";
    }
    if (payload.order && !(Number.isInteger(orderVal) && orderVal >= 0 && orderVal <= 5)) {
      return "Order must be an integer between 0 and 5.";
    }
    if (isCreate && !payload.image && !newCreateImageFile) {
      return "Project image is required.";
    }
    return null;
  };

  // Create save
  const handleCreateSave = async () => {
    const validationMsg = validateProjectPayload(createForm, true);
    if (validationMsg) {
      toast.error(validationMsg);
      return;
    }
    try {
      toast.loading("Creating project...");
      let imageUrl = createForm.image;

      if (newCreateImageFile) {
        const newFileName = `${Date.now()}_${newCreateImageFile.name}`;
        const { error } = await upploadMediaToSupabase(new File([newCreateImageFile], newFileName));
        if (error) throw error;
        const { data } = supabase.storage.from("image").getPublicUrl(newFileName);
        imageUrl = data.publicUrl;
      }

      const payload = { ...createForm, image: imageUrl };
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/project/create`, payload, headers);
      toast.dismiss();
      toast.success("Project created");
      setShowCreateModal(false);
      setCreateForm({
        name: "",
        description: "",
        venue: "",
        date: "",
        time: "",
        organizer: "",
        status: "upcoming",
        highlight: false,
        order: 1,
        image: "",
      });
      setNewCreateImageFile(null);
      fetchProjects(1, filterOption);
      setCurrentPage(1);
    } catch (err) {
        toast.dismiss();
        // Check if backend sent a detailed error message
        const msg = err.response?.data?.message || "Failed to create project";
        toast.error(msg);
        console.error(err);
        }
  };

  // Open edit modal
  const openEditModal = (project) => {
    setSelectedProject(project);
    setEditForm({
      name: project.name || "",
      description: project.description || "",
      venue: project.venue || "",
      date: project.date ? project.date.split("T")[0] : "",
      time: project.time || "",
      organizer: project.organizer || "",
      status: project.status || "upcoming",
      highlight: !!project.highlight,
      order: project.order || 0,
      image: project.image || "",
    });
    setNewEditImageFile(null);
    setShowEditModal(true);
  };

  // Save edit
  const handleEditSave = async () => {
    if (!selectedProject) return;
    const validationMsg = validateProjectPayload(editForm, false);
    if (validationMsg) {
      toast.error(validationMsg);
      return;
    }
    try {
      toast.loading("Saving project...");
      let imageUrl = editForm.image;

      if (newEditImageFile) {
        const oldFileName = selectedProject.image?.split("/").pop()?.split("?")[0];
        if (oldFileName) {
          try {
            await deleteMediaFromSupabase(oldFileName);
          } catch {}
        }
        const newFileName = `${Date.now()}_${newEditImageFile.name}`;
        const { error } = await upploadMediaToSupabase(new File([newEditImageFile], newFileName));
        if (error) throw error;
        const { data } = supabase.storage.from("image").getPublicUrl(newFileName);
        imageUrl = data.publicUrl;
      }

      const payload = { ...editForm, image: imageUrl };
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/project/update/${selectedProject._id}`, payload, headers);
      toast.dismiss();
      toast.success("Project updated");
      setShowEditModal(false);
      setSelectedProject(null);
      setEditForm(null);
      setNewEditImageFile(null);
      fetchProjects(currentPage, filterOption);
    } catch (err) {
        toast.dismiss();
        // Check if backend sent a detailed error message
        const msg = err.response?.data?.message || "Failed to update project";
        toast.error(msg);
        console.error(err);
        }
  };

  // Delete project
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const proj = projects.find((p) => p._id === id);
      if (proj?.image) {
        const fileName = proj.image.split("/").pop()?.split("?")[0];
        if (fileName) {
          try {
            await deleteMediaFromSupabase(fileName);
          } catch {}
        }
      }
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/project/delete/${id}`, headers);
      toast.success("Project deleted");
      fetchProjects(currentPage, filterOption);
    } catch (err) {
      toast.error("Failed to delete project");
      console.error(err);
    }
  };

  // Toggle highlight
  const handleToggleHighlight = async (p) => {
    if (!p.highlight) {
      if (!(Number.isInteger(Number(p.order)) && Number(p.order) >= 1 && Number(p.order) <= 5)) {
        toast.error("To highlight, order must be between 1 and 5.");
        return;
      }
    }
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/project/update/${p._id}`,
        { highlight: !p.highlight },
        headers
      );
      toast.success(p.highlight ? "Highlight removed" : "Project highlighted");
      fetchProjects(currentPage, filterOption);
    } catch (err) {
      toast.error("Failed to toggle highlight");
      console.error(err);
    }
  };

  // Handle filter dropdown change (status or order)
  const handleFilterChange = (e) => {
    setFilterOption(e.target.value);
    setCurrentPage(1);
  };

  // View modal open
  const openViewModal = (project) => {
    setSelectedProject(project);
    setShowViewModal(true);
  };

  // Filtered projects for order sorting (when filterOption === "order")
  // For pagination, we rely on backend pagination for status filters,
  // but for "order" filter we do client-side filtering and sorting on fetched page only.

  return (
    <div className="p-6 text-white">
      <h2 className="text-xl font-semibold text-[var(--color-primary)] mb-4">Manage Projects</h2>

      {/* Filter dropdown on right top */}
      <div className="flex justify-end mb-4">
        <select
          value={filterOption}
          onChange={handleFilterChange}
          className="bg-[var(--color-bg)] text-white px-3 py-1 rounded border border-white/10"
          title="Filter by status or order"
        >
          <option value="all">All</option>
          <option value="upcoming">Upcoming</option>
          <option value="done">Done</option>
          <option value="disabled">Disabled</option>
          <option value="order">Order (by order field)</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--color-accent)] text-white">
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Order</th>
              <th className="px-4 py-2">Highlight</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="p-4">
                  Loading...
                </td>
              </tr>
            ) : projects.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-4">
                  No projects found.
                </td>
              </tr>
            ) : (
              projects.map((p, idx) => {
                // If filter is 'order', only show order>0 sorted projects on current page (already filtered in fetchProjects if backend supports)
                // If backend doesn't support order filtering, you can filter here client side, but better on backend.
                if (filterOption === "order" && (!p.order || p.order === 0)) return null;

                return (
                  <tr
                    key={p._id}
                    className="border-b border-white/10 hover:bg-[var(--color-card)] transition"
                  >
                    <td className="px-4 py-2">{(currentPage - 1) * perPage + idx + 1}</td>
                    <td className="px-4 py-2">
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-12 h-8 object-cover rounded"
                        />
                      ) : (
                        <span>No Image</span>
                      )}
                    </td>
                    <td className="px-4 py-2">{p.name}</td>
                    <td className="px-4 py-2">{p.description}</td>
                    <td className="px-4 py-2 capitalize">{p.status}</td>
                    <td className="px-4 py-2">{p.order ?? 0}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleToggleHighlight(p)}
                        title={p.highlight ? "Remove highlight" : "Highlight project"}
                      >
                        {p.highlight ? <FaStar className="text-yellow-400" /> : <FaRegStar />}
                      </button>
                    </td>
                    <td className="px-4 py-2 flex gap-3">
                      <button
                        onClick={() => openViewModal(p)}
                        title="View"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <FiEye />
                      </button>
                      <button
                        onClick={() => openEditModal(p)}
                        title="Edit"
                        className="text-yellow-400 hover:text-yellow-300"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        title="Delete"
                        className="text-red-500 hover:text-red-400"
                      >
                        <FiTrash2 />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded text-sm ${
              currentPage === i + 1
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--color-card)] text-white/60 hover:text-white"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Floating Add Button */}
      <button
        className="fixed bottom-6 right-6 bg-[var(--color-primary)] hover:opacity-90 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
        onClick={() => setShowCreateModal(true)}
        title="Add Project"
      >
        <FiPlus className="text-xl" />
      </button>

      {/* Create Modal */}
{showCreateModal && (
  <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overflow-auto">
    <div className="bg-[var(--color-card)] p-6 rounded-lg w-[95%] max-w-3xl">
      <h3 className="text-xl font-semibold mb-6 text-[var(--color-primary)]">
        Create Project
      </h3>

      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 items-center"
        onSubmit={e => { e.preventDefault(); handleCreateSave(); }}
      >
        {/* Name */}
        <label htmlFor="name" className="flex items-center gap-3">
          <span className="w-24 text-white/80 font-medium">Name:</span>
          <input
            id="name"
            name="name"
            value={createForm.name}
            onChange={handleCreateChange}
            placeholder="Name"
            className="flex-grow px-3 py-2 rounded bg-[var(--color-bg)] border border-white/10 text-white"
            required
          />
        </label>

        {/* Venue */}
        <label htmlFor="venue" className="flex items-center gap-3">
          <span className="w-24 text-white/80 font-medium">Venue:</span>
          <input
            id="venue"
            name="venue"
            value={createForm.venue}
            onChange={handleCreateChange}
            placeholder="Venue"
            className="flex-grow px-3 py-2 rounded bg-[var(--color-bg)] border border-white/10 text-white"
            required
          />
        </label>

        {/* Date */}
        <label htmlFor="date" className="flex items-center gap-3">
          <span className="w-24 text-white/80 font-medium">Date:</span>
          <input
            id="date"
            type="date"
            name="date"
            value={createForm.date}
            onChange={handleCreateChange}
            className="flex-grow px-3 py-2 rounded bg-[var(--color-bg)] border border-white/10 text-white"
            required
          />
        </label>

        {/* Time */}
        <label htmlFor="time" className="flex items-center gap-3">
          <span className="w-24 text-white/80 font-medium">Time:</span>
          <input
            id="time"
            type="time"
            name="time"
            value={createForm.time}
            onChange={handleCreateChange}
            className="flex-grow px-3 py-2 rounded bg-[var(--color-bg)] border border-white/10 text-white"
            required
          />
        </label>

        {/* Organizer */}
        <label htmlFor="organizer" className="flex items-center gap-3">
          <span className="w-24 text-white/80 font-medium">Organizer:</span>
          <input
            id="organizer"
            name="organizer"
            value={createForm.organizer}
            onChange={handleCreateChange}
            placeholder="Organizer"
            className="flex-grow px-3 py-2 rounded bg-[var(--color-bg)] border border-white/10 text-white"
            required
          />
        </label>

        {/* Status */}
        <label htmlFor="status" className="flex items-center gap-3">
          <span className="w-24 text-white/80 font-medium">Status:</span>
          <select
            id="status"
            name="status"
            value={createForm.status}
            onChange={handleCreateChange}
            className="flex-grow px-3 py-2 rounded bg-[var(--color-bg)] border border-white/10 text-white"
          >
            <option value="upcoming">Upcoming</option>
            <option value="done">Done</option>
            <option value="disabled">Disabled</option>
          </select>
        </label>

        {/* Highlight */}
        <label className="flex items-center gap-3">
          <span className="w-24 text-white/80 font-medium">Highlight:</span>
          <input
            id="highlight"
            type="checkbox"
            name="highlight"
            checked={createForm.highlight}
            onChange={handleCreateChange}
            className="w-5 h-5"
          />
          <span className="text-sm text-white/80">Only one allowed</span>
        </label>

        {/* Order */}
        <label htmlFor="order" className="flex items-center gap-3">
          <span className="w-24 text-white/80 font-medium">Order:</span>
          <input
            id="order"
            name="order"
            type="number"
            min={0}
            max={5}
            value={createForm.order}
            onChange={handleCreateChange}
            className="flex-grow px-3 py-2 rounded bg-[var(--color-bg)] border border-white/10 text-white"
          />
        </label>

        {/* Description - full width */}
        <label htmlFor="description" className="flex items-start gap-3 md:col-span-2">
          <span className="w-24 text-white/80 font-medium pt-2">Description:</span>
          <textarea
            id="description"
            name="description"
            value={createForm.description}
            onChange={handleCreateChange}
            placeholder="Description"
            rows={3}
            className="flex-grow px-3 py-2 rounded bg-[var(--color-bg)] border border-white/10 text-white resize-y"
            required
          />
        </label>

        {/* Image Upload with small preview */}
        <label className="flex items-center gap-4 md:col-span-2">
          <span className="w-24 text-white/80 font-medium">Image:</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleCreateImage}
            className="text-white flex-grow"
          />
          {createForm.image && (
            <img
              src={createForm.image}
              alt="Preview"
              className="h-16 w-16 object-contain rounded border border-white/20"
            />
          )}
        </label>
      </form>

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={() => setShowCreateModal(false)}
          className="px-4 py-2 rounded border border-white/20 hover:bg-white/10"
        >
          Cancel
        </button>
        <button
          onClick={handleCreateSave}
          className="px-4 py-2 rounded bg-[var(--color-primary)] hover:opacity-90"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}



      {/* Edit Modal */}
{showEditModal && editForm && (
  <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overflow-auto">
    <div className="bg-[var(--color-card)] p-6 rounded-lg w-[95%] max-w-3xl">
      <h3 className="text-xl font-semibold mb-6 text-[var(--color-primary)]">
        Edit Project
      </h3>

      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 items-center"
        onSubmit={e => { e.preventDefault(); handleEditSave(); }}
      >
        {/* Name */}
        <label htmlFor="edit-name" className="flex items-center gap-3">
          <span className="w-24 text-white/80 font-medium">Name:</span>
          <input
            id="edit-name"
            name="name"
            value={editForm.name}
            onChange={handleEditChange}
            placeholder="Name"
            className="flex-grow px-3 py-2 rounded bg-[var(--color-bg)] border border-white/10 text-white"
            required
          />
        </label>

        {/* Venue */}
        <label htmlFor="edit-venue" className="flex items-center gap-3">
          <span className="w-24 text-white/80 font-medium">Venue:</span>
          <input
            id="edit-venue"
            name="venue"
            value={editForm.venue}
            onChange={handleEditChange}
            placeholder="Venue"
            className="flex-grow px-3 py-2 rounded bg-[var(--color-bg)] border border-white/10 text-white"
            required
          />
        </label>

        {/* Date */}
        <label htmlFor="edit-date" className="flex items-center gap-3">
          <span className="w-24 text-white/80 font-medium">Date:</span>
          <input
            id="edit-date"
            type="date"
            name="date"
            value={editForm.date}
            onChange={handleEditChange}
            className="flex-grow px-3 py-2 rounded bg-[var(--color-bg)] border border-white/10 text-white"
            required
          />
        </label>

        {/* Time */}
        <label htmlFor="edit-time" className="flex items-center gap-3">
          <span className="w-24 text-white/80 font-medium">Time:</span>
          <input
            id="edit-time"
            type="time"
            name="time"
            value={editForm.time}
            onChange={handleEditChange}
            className="flex-grow px-3 py-2 rounded bg-[var(--color-bg)] border border-white/10 text-white"
            required
          />
        </label>

        {/* Organizer */}
        <label htmlFor="edit-organizer" className="flex items-center gap-3">
          <span className="w-24 text-white/80 font-medium">Organizer:</span>
          <input
            id="edit-organizer"
            name="organizer"
            value={editForm.organizer}
            onChange={handleEditChange}
            placeholder="Organizer"
            className="flex-grow px-3 py-2 rounded bg-[var(--color-bg)] border border-white/10 text-white"
            required
          />
        </label>

        {/* Status */}
        <label htmlFor="edit-status" className="flex items-center gap-3">
          <span className="w-24 text-white/80 font-medium">Status:</span>
          <select
            id="edit-status"
            name="status"
            value={editForm.status}
            onChange={handleEditChange}
            className="flex-grow px-3 py-2 rounded bg-[var(--color-bg)] border border-white/10 text-white"
          >
            <option value="upcoming">Upcoming</option>
            <option value="done">Done</option>
            <option value="disabled">Disabled</option>
          </select>
        </label>

        {/* Highlight */}
        <label className="flex items-center gap-3">
          <span className="w-24 text-white/80 font-medium">Highlight:</span>
          <input
            id="edit-highlight"
            type="checkbox"
            name="highlight"
            checked={editForm.highlight}
            onChange={handleEditChange}
            className="w-5 h-5"
          />
          <span className="text-sm text-white/80">Only one allowed</span>
        </label>

        {/* Order */}
        <label htmlFor="edit-order" className="flex items-center gap-3">
          <span className="w-24 text-white/80 font-medium">Order:</span>
          <input
            id="edit-order"
            name="order"
            type="number"
            min={0}
            max={5}
            value={editForm.order}
            onChange={handleEditChange}
            className="flex-grow px-3 py-2 rounded bg-[var(--color-bg)] border border-white/10 text-white"
          />
        </label>

        {/* Description - full width */}
        <label htmlFor="edit-description" className="flex items-start gap-3 md:col-span-2">
          <span className="w-24 text-white/80 font-medium pt-2">Description:</span>
          <textarea
            id="edit-description"
            name="description"
            value={editForm.description}
            onChange={handleEditChange}
            placeholder="Description"
            rows={3}
            className="flex-grow px-3 py-2 rounded bg-[var(--color-bg)] border border-white/10 text-white resize-y"
            required
          />
        </label>

        {/* Image Upload with small preview */}
        <label className="flex items-center gap-4 md:col-span-2">
          <span className="w-24 text-white/80 font-medium">Image:</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleEditImage}
            className="text-white flex-grow"
          />
          {editForm.image && (
            <img
              src={editForm.image}
              alt="Preview"
              className="h-16 w-16 object-contain rounded border border-white/20"
            />
          )}
        </label>
      </form>

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={() => setShowEditModal(false)}
          className="px-4 py-2 rounded border border-white/20 hover:bg-white/10"
        >
          Cancel
        </button>
        <button
          onClick={handleEditSave}
          className="px-4 py-2 rounded bg-[var(--color-primary)] hover:opacity-90"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}


      {/* View Modal */}
      {showViewModal && selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overflow-auto">
          <div className="bg-[var(--color-card)] p-6 rounded-lg w-[95%] max-w-md">
            <h3 className="text-xl font-semibold mb-4 text-[var(--color-primary)]">
              Project Details
            </h3>
            <div className="mb-4">
              {selectedProject.image && (
                <img
                  src={selectedProject.image}
                  alt={selectedProject.name}
                  className="w-full h-48 object-cover rounded mb-4"
                />
              )}
              <p><strong>Name:</strong> {selectedProject.name}</p>
              <p><strong>Description:</strong> {selectedProject.description}</p>
              <p><strong>Venue:</strong> {selectedProject.venue}</p>
              <p><strong>Date:</strong> {selectedProject.date ? selectedProject.date.split("T")[0] : ""}</p>
              <p><strong>Time:</strong> {selectedProject.time}</p>
              <p><strong>Organizer:</strong> {selectedProject.organizer}</p>
              <p><strong>Status:</strong> {selectedProject.status}</p>
              <p><strong>Order:</strong> {selectedProject.order}</p>
              <p><strong>Highlight:</strong> {selectedProject.highlight ? "Yes" : "No"}</p>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 rounded bg-[var(--color-primary)] hover:opacity-90"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
