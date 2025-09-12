import { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit2, FiEye, FiTrash2, FiPlus } from "react-icons/fi";
import { supabase, uploadMediaToSupabase, deleteMediaFromSupabase } from "../../utill/mediaUpload.js";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function Members() {
  const [members, setMembers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMember, setSelectedMember] = useState(null);
  const [editData, setEditData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [newImageFile, setNewImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const token = localStorage.getItem("adminToken");
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  const navigete = useNavigate();

  const onlyLettersRegex = /^[A-Za-z\s]+$/;

  const fetchMembers = async (page = 1, status = filter) => {
    try {
      setIsLoading(true);
      const statusQuery = status !== "all" ? `&status=${status}` : "";
      const searchQuery = search ? `&query=${search}` : "";
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/member/search?page=${page}&limit=5${statusQuery}${searchQuery}`,
        headers
      );
      setMembers(res.data.members);
      setTotalPages(res.data.pages);
      setCurrentPage(res.data.page);
      setIsLoading(false);
    } catch (err) {
      console.error("Failed to fetch members", err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [filter, search]);

  const handleEdit = (member) => {
    setEditData({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      phone: member.phone,
      dob: member.dob?.split("T")[0],
      gender: member.gender,
      status: member.status,
      position: member.position,
      occupation: member.occupation || "",
      address: member.address || "",
      mylci: member.mylci || "",
      image: member.image || "",
    });
    setNewImageFile(null);
    setSelectedMember(member);
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setEditData(prev => ({ ...prev, image: previewUrl }));
    }
  };

  const saveEdit = async () => {
    const requiredFields = [
      "firstName", "lastName", "email", "phone", "dob",
      "gender", "address", "occupation", "position", "status"
    ];

    for (let field of requiredFields) {
      if (!editData[field] || editData[field].toString().trim() === "") {
        toast.error(`Please fill in the ${field} field.`);
        return;
      }
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(editData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!onlyLettersRegex.test(editData.firstName)) {
      toast.error("First name should only contain letters.");
      return;
    }
    if (!onlyLettersRegex.test(editData.lastName)) {
      toast.error("Last name should only contain letters.");
      return;
    }
    if (!onlyLettersRegex.test(editData.occupation)) {
      toast.error("Occupation should only contain letters.");
      return;
    }
    if (!onlyLettersRegex.test(editData.position)) {
      toast.error("Position should only contain letters.");
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(editData.phone)) {
      toast.error("Please enter a valid 10-digit phone number.");
      return;
    }

    if (newImageFile && !newImageFile.type.startsWith("image/")) {
      toast.error("Selected file must be an image.");
      return;
    }

    try {
      let imageUrl = editData.image;

      if (newImageFile) {
  // Delete old image
  const oldFileName = selectedMember.image?.split("/").pop()?.split("?")[0];
  if (oldFileName) {
    try {
      await deleteMediaFromSupabase(oldFileName);
    } catch (e) {
      console.warn("Failed to delete old image", e);
    }
  }

  // Upload new image
  const path = await uploadMediaToSupabase(newImageFile); // <-- directly pass the file
  const { data } = supabase.storage.from("image").getPublicUrl(path);
  imageUrl = data.publicUrl;
}


      const updatedData = { ...editData, image: imageUrl };

      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/member/${selectedMember._id}`,
        updatedData,
        headers
      );

      toast.success("Member updated successfully!");
      setShowEditModal(false);
      fetchMembers(currentPage);
    } catch (err) {
      console.error("Failed to update member", err);
      if (err.response?.status === 409) {
        toast.error(`${err.response.data.message}`);
      } else {
        toast.error("Failed to update member. Please try again.");
      }
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this member?")) return;
    try {
      const memberToDelete = members.find(m => m._id === id);
      if (memberToDelete?.image) {
        const fileName = memberToDelete.image.split("/").pop()?.split("?")[0];
        if (fileName) {
          try {
            await deleteMediaFromSupabase(fileName);
          } catch (err) {
            console.warn("Failed to delete image from Supabase:", err);
          }
        }
      }

      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/member/${id}`, headers);
      toast.success("Member deleted successfully!");
      fetchMembers(currentPage);
    } catch (err) {
      console.error("Failed to delete member", err);
      toast.error("Failed to delete member. Please try again.");
    }
  };

  function hadlePlusClick() {
    navigete("/admin/dashboard/members-registration");
  }

  return (
    <div className="p-3 sm:p-6 text-white">
      {/* Header Section - Mobile Responsive */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl sm:text-2xl font-semibold text-[var(--color-primary)]">Manage Members</h2>
          <div className="relative group cursor-pointer">
          </div>
        </div>

        {/* Search and Filter Controls - Mobile Responsive */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or MYLCI"
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
              <option value="pending" className="bg-gray-900/95 text-white hover:bg-gray-800">Pending</option>
              <option value="accept" className="bg-gray-900/95 text-white hover:bg-gray-800">Accepted</option>
              <option value="reject" className="bg-gray-900/95 text-white hover:bg-gray-800">Rejected</option>
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
            {members.map((member) => (
              <div
                key={member._id}
                className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl p-4"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-white/20 shadow-lg flex-shrink-0 bg-white/10 flex items-center justify-center">
                      {member.image ? (
                        <img 
                          src={member.image} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white/50 text-xs">No Image</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm sm:text-base font-medium text-white truncate">{member.fullName}</h3>
                      <p className="text-xs sm:text-sm text-white/60 mt-1">{member.position}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize flex-shrink-0 ${
                    member.status === 'accept' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                    member.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                    'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {member.status}
                  </span>
                </div>

                {/* Card Content */}
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">MYLCI:</span>
                    <span className="text-white font-medium">{member.mylci}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Email:</span>
                    <span className="text-white font-medium truncate max-w-[60%]">{member.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Phone:</span>
                    <span className="text-white font-medium">{member.phone}</span>
                  </div>
                </div>

                {/* Actions Row */}
                <div className="flex items-center justify-end gap-2 pt-3 mt-3 border-t border-white/10">
                  <button
                    className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-all duration-200"
                    title="Edit"
                    onClick={() => handleEdit(member)}
                  >
                    <FiEdit2 size={14} />
                  </button>
                  <button
                    className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all duration-200"
                    title="View"
                    onClick={() => { setSelectedMember(member); setShowViewModal(true); }}
                  >
                    <FiEye size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(member._id)}
                    className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all duration-200"
                    title="Delete"
                  >
                    <FiTrash2 size={14} />
                  </button>
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
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider">MYLCI</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider">Position</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {members.map((member, index) => (
                    <tr 
                      key={member._id} 
                      className="hover:bg-white/5 transition-all duration-200 h-16 group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{member.fullName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white/80">{member.mylci}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white/80">{member.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white/80">{member.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white/80">{member.position}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${
                          member.status === 'accept' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                          member.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                          'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <button
                            className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-all duration-200 hover:scale-110"
                            title="Edit"
                            onClick={() => handleEdit(member)}
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button
                            className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all duration-200 hover:scale-110"
                            title="View"
                            onClick={() => { setSelectedMember(member); setShowViewModal(true); }}
                          >
                            <FiEye size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(member._id)}
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
                  onClick={() => fetchMembers(i + 1)}
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

      {/* Mobile Responsive Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-2 sm:p-4 overflow-auto">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 sm:p-8 rounded-2xl w-full max-w-4xl shadow-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-[var(--color-primary)]">Edit Member</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {Object.entries(editData).map(([key, value]) => (
                key !== "_id" && key !== "__v" && (
                  key === "image" ? (
                    <div key={key} className="flex flex-col lg:col-span-2">
                      <span className="block mb-2 text-sm font-medium text-white/90 capitalize">{key}</span>
                      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                        <img src={value} alt="Preview" className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-white/20" />
                        <label className="px-3 sm:px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-all duration-200 cursor-pointer text-sm sm:text-base">
                          Choose File
                          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        </label>
                      </div>
                    </div>
                  ) : key === "status" ? (
                    <div key={key} className="flex flex-col">
                      <span className="block mb-2 text-sm font-medium text-white/90 capitalize">{key}</span>
                      <select
                        name={key}
                        value={value}
                        onChange={handleEditChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] text-sm sm:text-base"
                      >
                        <option value="pending" className="bg-gray-900/95">Pending</option>
                        <option value="accept" className="bg-gray-900/95">Accepted</option>
                        <option value="reject" className="bg-gray-900/95">Rejected</option>
                      </select>
                    </div>
                  ) : key === "gender" ? (
                    <div key={key} className="flex flex-col">
                      <span className="block mb-2 text-sm font-medium text-white/90 capitalize">{key}</span>
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
                        {["male", "female", "other"].map((g) => (
                          <label key={g} className="flex items-center gap-2 text-white text-sm cursor-pointer">
                            <input
                              type="radio"
                              name="gender"
                              value={g}
                              checked={value === g}
                              onChange={handleEditChange}
                              className="w-4 h-4 text-[var(--color-primary)] bg-white/10 border-white/20 focus:ring-[var(--color-primary)]"
                            />
                            {g.charAt(0).toUpperCase() + g.slice(1)}
                          </label>
                        ))}
                      </div>
                    </div>
                  ) : key === "dob" ? (
                    <div key={key} className="flex flex-col">
                      <span className="block mb-2 text-sm font-medium text-white/90 capitalize">Date of Birth</span>
                      <input
                        type="date"
                        name={key}
                        value={value}
                        onChange={handleEditChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] text-sm sm:text-base"
                      />
                    </div>
                  ) : (
                    <div key={key} className="flex flex-col">
                      <span className="block mb-2 text-sm font-medium text-white/90 capitalize">
                        {key === "firstName" ? "First Name" : 
                         key === "lastName" ? "Last Name" :
                         key === "mylci" ? "MYLCI" :
                         key.charAt(0).toUpperCase() + key.slice(1)}
                      </span>
                      <input
                        type="text"
                        name={key}
                        value={value}
                        onChange={handleEditChange}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)] text-sm sm:text-base"
                      />
                    </div>
                  )
                )
              ))}
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

      {/* Mobile Responsive View Modal */}
      {showViewModal && selectedMember && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-2 sm:p-4 overflow-auto">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 sm:p-6 lg:p-8 rounded-2xl w-full max-w-4xl shadow-2xl max-h-[95vh] overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {/* Left Column - Image and Basic Info */}
              <div className="flex flex-col justify-center items-center">
                <div className="w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 mb-4 rounded-full overflow-hidden border-4 border-white/20 shadow-xl flex items-center justify-center bg-white/10">
                  {selectedMember.image ? (
                    <img 
                      src={selectedMember.image} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white/50 text-sm sm:text-base">No Image</span>
                  )}
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 text-center">{selectedMember.fullName}</h3>
                <p className="text-center text-[var(--color-primary)] font-medium text-sm sm:text-base lg:text-lg">{selectedMember.position}</p>
              </div>

              {/* Right Column - Details */}
              <div className="space-y-2 sm:space-y-3 text-white text-xs sm:text-sm">
                {[ 
                  { label: "MYLCI", value: selectedMember.mylci },
                  { label: "Date of Birth", value: new Date(selectedMember.dob).toLocaleDateString() },
                  { label: "Age", value: selectedMember.age },
                  { label: "Email", value: selectedMember.email },
                  { label: "Phone", value: selectedMember.phone },
                  { label: "Occupation", value: selectedMember.occupation },
                  { label: "Address", value: selectedMember.address },
                  { label: "Gender", value: selectedMember.gender },
                  { label: "Status", value: selectedMember.status },
                  { label: "Joined", value: new Date(selectedMember.joinDate).toLocaleDateString() },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-white/10 gap-1 sm:gap-0">
                    <span className="text-white/70 font-medium">{item.label}:</span>
                    {item.label === "Status" ? (
                      <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium capitalize w-fit ${
                        selectedMember.status === 'accept' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                        selectedMember.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                        'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {item.value}
                      </span>
                    ) : (
                      <span className="font-medium sm:max-w-[70%] sm:text-right leading-relaxed break-words">{item.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center mt-4 sm:mt-6">
              <button 
                onClick={() => setShowViewModal(false)} 
                className="px-4 sm:px-6 py-2 sm:py-3 bg-white/10 backdrop-blur-md text-white rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/20 text-sm sm:text-base"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Add Button - Mobile Responsive */}
      <button
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-[var(--color-primary)]/90 backdrop-blur-md hover:bg-[var(--color-primary)] text-white rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center shadow-2xl border border-white/10 transition-all duration-300 hover:scale-110 hover:shadow-[var(--color-primary)]/20 z-40"
        onClick={hadlePlusClick}
        title="Add New Member"
      >
        <FiPlus className="text-lg sm:text-xl" />
      </button>
    </div>
  );
}