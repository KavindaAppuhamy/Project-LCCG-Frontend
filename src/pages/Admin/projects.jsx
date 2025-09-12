import { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit2, FiTrash2, FiPlus, FiEye, FiInfo } from "react-icons/fi";
import { FaStar, FaRegStar } from "react-icons/fa";
import { toast } from "react-hot-toast";
import {
  supabase,
  uploadMediaToSupabase,
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
      const res = await axios.get(url, headers);
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

    // ✅ Check valid image
    if (!f.type.startsWith("image/")) {
      toast.error("Please choose a valid image file.");
      return;
    }

    // ✅ Check WebP format
    if (f.type !== "image/webp") {
      toast.error("Only WebP images are allowed.");
      return;
    }

    // ✅ Check size (200KB = 200 * 1024 bytes)
    if (f.size > 200 * 1024) {
      toast.error("Image must be 200KB or below for better performance.");
      return;
    }

    setNewCreateImageFile(f);
    setCreateForm((prev) => ({ ...prev, image: URL.createObjectURL(f) }));
  };

  const handleEditImage = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;

    // ✅ Check valid image
    if (!f.type.startsWith("image/")) {
      toast.error("Please choose a valid image file.");
      return;
    }

    // ✅ Check WebP format
    if (f.type !== "image/webp") {
      toast.error("Only WebP images are allowed.");
      return;
    }

    // ✅ Check size (200KB = 200 * 1024 bytes)
    if (f.size > 200 * 1024) {
      toast.error("Image must be 200KB or below for better performance.");
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

      if (newEditImageFile) {
        // Delete old image from Supabase if exists
        const oldFileName = selectedProject.image?.split("/").pop()?.split("?")[0];
        if (oldFileName) {
          try {
            await deleteMediaFromSupabase(oldFileName);
          } catch (err) {
            console.warn("Failed to delete old image:", err.message);
          }
        }

        // Upload new image
        const uploadedPath = await uploadMediaToSupabase(newEditImageFile);
        const { data: { publicUrl } } = supabase.storage.from("image").getPublicUrl(uploadedPath);
        imageUrl = publicUrl;
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

    // Replace with your own validation
    const validationMsg = validateProjectPayload(editForm, false);
    if (validationMsg) {
      toast.error(validationMsg);
      return;
    }

    try {
      toast.loading("Saving project...");

      let imageUrl = editForm.image;

      if (newEditImageFile) {
        // Delete old image from Supabase if exists
        const oldFileName = selectedProject.image?.split("/").pop()?.split("?")[0];
        if (oldFileName) {
          try {
            await deleteMediaFromSupabase(oldFileName);
          } catch (err) {
            console.warn("Failed to delete old image:", err.message);
          }
        }

        // Upload new image
        const uploadedPath = await uploadMediaToSupabase(newEditImageFile);
        const { data: { publicUrl } } = supabase.storage.from("image").getPublicUrl(uploadedPath);
        imageUrl = publicUrl;
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

  return (
    <div className="p-3 sm:p-4 md:p-6 text-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--color-primary)]">Manage Projects</h2>
          <div className="relative group cursor-pointer">
            <div className="w-4 h-4 flex items-center justify-center rounded-full bg-blue-500 text-white text-[10px] font-bold">
              i
            </div>
            <div className="absolute z-10 w-48 top-full mt-1 left-1/2 -translate-x-1/2 bg-gray-900/95 backdrop-blur-sm text-white text-[10px] rounded-lg px-3 py-2 shadow-xl border border-white/10 opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none">
              Only <span className="text-green-400 font-medium">highlighted</span> projects are displayed on the main page.
            </div>
          </div>
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <select
              value={filterOption}
              onChange={handleFilterChange}
              className="appearance-none bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 pr-10 text-white shadow-lg hover:bg-white/15 hover:shadow-xl hover:border-white/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:bg-white/20 cursor-pointer w-full sm:min-w-[140px]"
            >
              <option value="all" className="bg-gray-900/95 text-white hover:bg-gray-800">All Projects</option>
              <option value="upcoming" className="bg-gray-900/95 text-white hover:bg-gray-800">Upcoming</option>
              <option value="done" className="bg-gray-900/95 text-white hover:bg-gray-800">Completed</option>
              <option value="disabled" className="bg-gray-900/95 text-white hover:bg-gray-800">Disabled</option>
              <option value="order" className="bg-gray-900/95 text-white hover:bg-gray-800">By Order</option>
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
      {loading ? (
        <div className="w-full h-full flex justify-center items-center min-h-[400px]"> 
          <div className="w-[70px] h-[70px] border-[5px] border-white/20 border-t-[var(--color-primary)] rounded-full animate-spin">
          </div>
        </div>
      ) : (
        <>
          {/* Mobile Card View for screens smaller than md */}
          <div className="block md:hidden">
            <div className="space-y-4">
              {projects.length === 0 ? (
                <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl p-8 text-center text-white/60">
                  No projects found
                </div>
              ) : (
                projects.map((project, index) => {
                  // If filter is 'order', only show order>0 sorted projects
                  if (filterOption === "order" && (!project.order || project.order === 0)) return null;

                  return (
                    <div key={project._id} className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl p-4">
                      {/* Image and Title */}
                      <div className="flex items-start gap-4 mb-4">
                        {project.image ? (
                          <img
                            src={project.image}
                            alt={project.name}
                            className="w-16 h-12 sm:w-20 sm:h-15 object-cover rounded-lg border border-white/20 shadow-lg flex-shrink-0"
                          />
                        ) : (
                          <div className="w-16 h-12 sm:w-20 sm:h-15 bg-white/10 rounded-lg flex items-center justify-center text-white/50 text-xs border border-white/20 flex-shrink-0">
                            No Image
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm sm:text-base font-medium text-white truncate">{project.name}</h3>
                          <p className="text-xs sm:text-sm text-white/60 truncate">{project.organizer}</p>
                          <p className="text-xs sm:text-sm text-white/80 truncate mt-1">{project.venue}</p>
                        </div>
                      </div>
                      
                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-4 text-xs sm:text-sm">
                        <div>
                          <span className="text-white/60 block">Date</span>
                          <span className="text-white/80">{project.date ? new Date(project.date).toLocaleDateString() : "N/A"}</span>
                        </div>
                        <div>
                          <span className="text-white/60 block">Time</span>
                          <span className="text-white/80">{project.time}</span>
                        </div>
                        <div>
                          <span className="text-white/60 block">Status</span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${
                            project.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                            project.status === 'done' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                            'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                          }`}>
                            {project.status}
                          </span>
                        </div>
                        <div>
                          <span className="text-white/60 block">Order</span>
                          <span className="text-white/80">{project.order ?? 0}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => handleToggleHighlight(project)}
                          className="text-yellow-400 hover:text-yellow-300 transition-colors duration-200 p-2"
                          title={project.highlight ? "Remove highlight" : "Highlight project"}
                        >
                          {project.highlight ? <FaStar size={16} /> : <FaRegStar size={16} />}
                        </button>
                        <div className="flex items-center gap-2">
                          <button
                            className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all duration-200 hover:scale-110"
                            title="View"
                            onClick={() => openViewModal(project)}
                          >
                            <FiEye size={16} />
                          </button>
                          <button
                            className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-all duration-200 hover:scale-110"
                            title="Edit"
                            onClick={() => openEditModal(project)}
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(project._id)}
                            className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all duration-200 hover:scale-110"
                            title="Delete"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Desktop Table View for md screens and larger */}
          <div className="hidden md:block bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/10 backdrop-blur-sm border-b border-white/10">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider">Image</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider">Project</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider">Venue</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider">Order</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider">Highlight</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {projects.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-8 text-center text-white/60">
                        No projects found
                      </td>
                    </tr>
                  ) : (
                    projects.map((project, index) => {
                      // If filter is 'order', only show order>0 sorted projects
                      if (filterOption === "order" && (!project.order || project.order === 0)) return null;

                      return (
                        <tr 
                          key={project._id} 
                          className="hover:bg-white/5 transition-all duration-200 h-16 group"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            {project.image ? (
                              <img
                                src={project.image}
                                alt={project.name}
                                className="w-16 h-12 object-cover rounded-lg border border-white/20 shadow-lg"
                              />
                            ) : (
                              <div className="w-16 h-12 bg-white/10 rounded-lg flex items-center justify-center text-white/50 text-xs border border-white/20">
                                No Image
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-white">{project.name}</div>
                            <div className="text-xs text-white/60 mt-1">{project.organizer}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-white/80">{project.venue}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-white/80">
                              {project.date ? new Date(project.date).toLocaleDateString() : "N/A"}
                            </div>
                            <div className="text-xs text-white/60">{project.time}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${
                              project.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                              project.status === 'done' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                              'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                            }`}>
                              {project.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-white/80">{project.order ?? 0}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleToggleHighlight(project)}
                              className="text-yellow-400 hover:text-yellow-300 transition-colors duration-200"
                              title={project.highlight ? "Remove highlight" : "Highlight project"}
                            >
                              {project.highlight ? <FaStar size={16} /> : <FaRegStar size={16} />}
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <button
                                className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all duration-200 hover:scale-110"
                                title="View"
                                onClick={() => openViewModal(project)}
                              >
                                <FiEye size={16} />
                              </button>
                              <button
                                className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-all duration-200 hover:scale-110"
                                title="Edit"
                                onClick={() => openEditModal(project)}
                              >
                                <FiEdit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(project._id)}
                                className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all duration-200 hover:scale-110"
                                title="Delete"
                              >
                                <FiTrash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2 flex-wrap">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
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

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-auto">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 sm:p-8 rounded-2xl w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-[var(--color-primary)]">Create New Project</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              
              {/* Project Name */}
              <div className="flex flex-col">
                <span className="block mb-2 text-sm font-medium text-white/90">Project Name</span>
                <input
                  type="text"
                  name="name"
                  value={createForm.name}
                  onChange={handleCreateChange}
                  placeholder="Enter project name"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]"
                />
              </div>

              {/* Venue */}
              <div className="flex flex-col">
                <span className="block mb-2 text-sm font-medium text-white/90">Venue</span>
                <input
                  type="text"
                  name="venue"
                  value={createForm.venue}
                  onChange={handleCreateChange}
                  placeholder="Enter venue"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]"
                />
              </div>

              {/* Date */}
              <div className="flex flex-col">
                <span className="block mb-2 text-sm font-medium text-white/90">Date</span>
                <input
                  type="date"
                  name="date"
                  value={createForm.date}
                  onChange={handleCreateChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]"
                />
              </div>

              {/* Time */}
              <div className="flex flex-col">
                <span className="block mb-2 text-sm font-medium text-white/90">Time</span>
                <input
                  type="time"
                  name="time"
                  value={createForm.time}
                  onChange={handleCreateChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]"
                />
              </div>

              {/* Organizer */}
              <div className="flex flex-col">
                <span className="block mb-2 text-sm font-medium text-white/90">Organizer</span>
                <input
                  type="text"
                  name="organizer"
                  value={createForm.organizer}
                  onChange={handleCreateChange}
                  placeholder="Enter organizer name"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]"
                />
              </div>

              {/* Status */}
              <div className="flex flex-col">
                <span className="block mb-2 text-sm font-medium text-white/90">Status</span>
                <select
                  name="status"
                  value={createForm.status}
                  onChange={handleCreateChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]"
                >
                  <option value="upcoming" className="bg-gray-900/95">Upcoming</option>
                  <option value="done" className="bg-gray-900/95">Completed</option>
                  <option value="disabled" className="bg-gray-900/95">Disabled</option>
                </select>
              </div>

              {/* Order */}
              <div className="flex flex-col">
                <span className="block mb-2 text-sm font-medium text-white/90">Order (1-5)</span>
                <input
                  type="number"
                  name="order"
                  min="0"
                  max="5"
                  value={createForm.order}
                  onChange={handleCreateChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]"
                />
              </div>

              {/* Highlight Checkbox */}
              <div className="flex flex-col">
                <span className="block mb-2 text-sm font-medium text-white/90">Highlight Project</span>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="highlight"
                    checked={createForm.highlight}
                    onChange={handleCreateChange}
                    className="w-5 h-5 rounded bg-white/10 border border-white/20 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                  />
                  <span className="text-sm text-white/80">Featured on main page</span>
                </label>
              </div>

              {/* Description - Full Width */}
              <div className="flex flex-col md:col-span-2">
                <span className="block mb-2 text-sm font-medium text-white/90">Description</span>
                <textarea
                  name="description"
                  value={createForm.description}
                  onChange={handleCreateChange}
                  placeholder="Enter project description"
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] resize-y"
                />
              </div>

              {/* Image Upload */}
              <div className="flex flex-col md:col-span-2">
                <span className="block mb-2 text-sm font-medium text-white/90">Project Image</span>
                <div className="flex items-center gap-4">
                  {createForm.image && (
                    <img 
                      src={createForm.image} 
                      alt="Preview" 
                      className="w-20 h-20 rounded-lg object-cover border-2 border-white/20" 
                    />
                  )}
                  <label className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-all duration-200 cursor-pointer">
                    Choose Image
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleCreateImage} 
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
            </div>
            
            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 sm:mt-8">
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-full sm:w-auto px-6 py-3 bg-white/10 backdrop-blur-md text-white rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/20"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSave}
                className="w-full sm:w-auto px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg shadow-[var(--color-primary)]/20"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editForm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-auto">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 sm:p-8 rounded-2xl w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-[var(--color-primary)]">Edit Project</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              
              {/* Project Name */}
              <div className="flex flex-col">
                <span className="block mb-2 text-sm font-medium text-white/90">Project Name</span>
                <input
                  type="text"
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  placeholder="Enter project name"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]"
                />
              </div>

              {/* Venue */}
              <div className="flex flex-col">
                <span className="block mb-2 text-sm font-medium text-white/90">Venue</span>
                <input
                  type="text"
                  name="venue"
                  value={editForm.venue}
                  onChange={handleEditChange}
                  placeholder="Enter venue"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]"
                />
              </div>

              {/* Date */}
              <div className="flex flex-col">
                <span className="block mb-2 text-sm font-medium text-white/90">Date</span>
                <input
                  type="date"
                  name="date"
                  value={editForm.date}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]"
                />
              </div>

              {/* Time */}
              <div className="flex flex-col">
                <span className="block mb-2 text-sm font-medium text-white/90">Time</span>
                <input
                  type="time"
                  name="time"
                  value={editForm.time}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]"
                />
              </div>

              {/* Organizer */}
              <div className="flex flex-col">
                <span className="block mb-2 text-sm font-medium text-white/90">Organizer</span>
                <input
                  type="text"
                  name="organizer"
                  value={editForm.organizer}
                  onChange={handleEditChange}
                  placeholder="Enter organizer name"
                  className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]"
                />
              </div>

              {/* Status */}
              <div className="flex flex-col">
                <span className="block mb-2 text-sm font-medium text-white/90">Status</span>
                <select
                  name="status"
                  value={editForm.status}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]"
                >
                  <option value="upcoming" className="bg-gray-900/95">Upcoming</option>
                  <option value="done" className="bg-gray-900/95">Completed</option>
                  <option value="disabled" className="bg-gray-900/95">Disabled</option>
                </select>
              </div>

              {/* Order */}
              <div className="flex flex-col">
                <span className="block mb-2 text-sm font-medium text-white/90">Order (0-5)</span>
                <input
                  type="number"
                  name="order"
                  min="0"
                  max="5"
                  value={editForm.order}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]"
                />
              </div>

              {/* Highlight Checkbox */}
              <div className="flex flex-col">
                <span className="block mb-2 text-sm font-medium text-white/90">Highlight Project</span>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="highlight"
                    checked={editForm.highlight}
                    onChange={handleEditChange}
                    className="w-5 h-5 rounded bg-white/10 border border-white/20 text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                  />
                  <span className="text-sm text-white/80">Featured on main page</span>
                </label>
              </div>

              {/* Description - Full Width */}
              <div className="flex flex-col md:col-span-2">
                <span className="block mb-2 text-sm font-medium text-white/90">Description</span>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  placeholder="Enter project description"
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] resize-y"
                />
              </div>

              {/* Image Upload */}
              <div className="flex flex-col md:col-span-2">
                <span className="block mb-2 text-sm font-medium text-white/90">Project Image</span>
                <div className="flex items-center gap-4">
                  {editForm.image && (
                    <img 
                      src={editForm.image} 
                      alt="Preview" 
                      className="w-20 h-20 rounded-lg object-cover border-2 border-white/20" 
                    />
                  )}
                  <label className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-all duration-200 cursor-pointer">
                    Choose Image
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleEditImage} 
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
            </div>
            
            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6 sm:mt-8">
              <button
                onClick={() => setShowEditModal(false)}
                className="w-full sm:w-auto px-6 py-3 bg-white/10 backdrop-blur-md text-white rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/20"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="w-full sm:w-auto px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg shadow-[var(--color-primary)]/20"
              >
                Update Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedProject && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-auto">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 sm:p-8 rounded-2xl w-full max-w-4xl shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Left Column - Image */}
              <div className="flex flex-col">
                <div className="mb-4">
                  {selectedProject.image ? (
                    <img 
                      src={selectedProject.image} 
                      alt="Project" 
                      className="w-full h-48 sm:h-64 rounded-xl object-cover border-4 border-white/20 shadow-xl" 
                    />
                  ) : (
                    <div className="w-full h-48 sm:h-64 bg-white/10 rounded-xl flex items-center justify-center border-4 border-white/20">
                      <span className="text-white/50">No Image</span>
                    </div>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 text-center">{selectedProject.name}</h3>
                <p className="text-center text-[var(--color-primary)] font-medium text-base sm:text-lg">{selectedProject.organizer}</p>
              </div>

              {/* Right Column - Details */}
              <div className="space-y-3 sm:space-y-4 text-white text-sm">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start py-3 border-b border-white/10 gap-2">
                  <span className="text-white/70 font-medium">Description:</span>
                  <span className="font-medium sm:text-right sm:max-w-[70%] leading-relaxed">{selectedProject.description}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-white/70 font-medium">Venue:</span>
                  <span className="font-medium">{selectedProject.venue}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-white/70 font-medium">Date:</span>
                  <span className="font-medium">{selectedProject.date ? new Date(selectedProject.date).toLocaleDateString() : "N/A"}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-white/70 font-medium">Time:</span>
                  <span className="font-medium">{selectedProject.time}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-white/70 font-medium">Status:</span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${
                    selectedProject.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                    selectedProject.status === 'done' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}>
                    {selectedProject.status}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/10">
                  <span className="text-white/70 font-medium">Order:</span>
                  <span className="font-medium">{selectedProject.order ?? 0}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-white/70 font-medium">Highlighted:</span>
                  <span className="font-medium flex items-center gap-2">
                    {selectedProject.highlight ? (
                      <>
                        <FaStar className="text-yellow-400" size={16} />
                        <span className="text-yellow-400">Yes</span>
                      </>
                    ) : (
                      <>
                        <FaRegStar className="text-white/50" size={16} />
                        <span className="text-white/50">No</span>
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-center mt-6 sm:mt-8">
              <button 
                onClick={() => setShowViewModal(false)} 
                className="w-full sm:w-auto px-6 py-3 bg-white/10 backdrop-blur-md text-white rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/20"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Add Button with Glass Effect */}
      <button
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-[var(--color-primary)]/90 backdrop-blur-md hover:bg-[var(--color-primary)] text-white rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shadow-2xl border border-white/10 transition-all duration-300 hover:scale-110 hover:shadow-[var(--color-primary)]/20"
        onClick={() => setShowCreateModal(true)}
        title="Add New Project"
      >
        <FiPlus className="text-lg sm:text-xl" />
      </button>
    </div>
  );
}