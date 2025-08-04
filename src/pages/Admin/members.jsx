import { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit2, FiEye, FiTrash2, FiPlus } from "react-icons/fi";

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

  const token = localStorage.getItem("adminToken");
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  const fetchMembers = async (page = 1, status = filter) => {
    try {
      const statusQuery = status !== "all" ? `&status=${status}` : "";
      const searchQuery = search ? `&query=${search}` : "";
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/member/search?page=${page}&limit=5${statusQuery}${searchQuery}`,
        headers
      );
      setMembers(res.data.members);
      setTotalPages(res.data.pages);
      setCurrentPage(res.data.page);
    } catch (err) {
      console.error("Failed to fetch members", err);
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
    setSelectedMember(member);
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // TODO: handle file upload to Supabase and get URL
      console.log("Image selected:", file);
    }
  };

  const saveEdit = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/member/${selectedMember._id}`,
        editData,
        headers
      );
      setShowEditModal(false);
      fetchMembers(currentPage);
    } catch (err) {
      console.error("Failed to update member", err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this member?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/member/${id}`, headers);
      fetchMembers(currentPage);
    } catch (err) {
      console.error("Failed to delete member", err);
    }
  };

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-[var(--color-primary)]">Manage Members</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by name or MYLCI"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 rounded bg-[var(--color-card)] border border-white/10 text-white"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-[var(--color-card)] border border-white/10 rounded px-4 py-2 text-white"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="accept">Accepted</option>
            <option value="reject">Rejected</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--color-accent)] text-white">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">MYLCI</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Position</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member._id} className="border-b border-white/10 hover:bg-[var(--color-card)] transition">
                <td className="px-4 py-2">{member.fullName}</td>
                <td className="px-4 py-2">{member.mylci}</td>
                <td className="px-4 py-2">{member.email}</td>
                <td className="px-4 py-2">{member.phone}</td>
                <td className="px-4 py-2">{member.position}</td>
                <td className="px-4 py-2 capitalize">{member.status}</td>
                <td className="px-4 py-2 flex gap-3">
                  <button onClick={() => handleEdit(member)} title="Edit" className="text-yellow-400 hover:text-yellow-300">
                    <FiEdit2 />
                  </button>
                  <button onClick={() => { setSelectedMember(member); setShowViewModal(true); }} title="View" className="text-blue-400 hover:text-blue-300">
                    <FiEye />
                  </button>
                  <button onClick={() => handleDelete(member._id)} title="Delete" className="text-red-500 hover:text-red-400">
                    <FiTrash2 />
                  </button>
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
            key={i + 1}
            onClick={() => fetchMembers(i + 1)}
            className={`px-3 py-1 rounded text-sm ${currentPage === i + 1 ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-card)] text-white/60 hover:text-white"}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overflow-auto">
            <div className="bg-[var(--color-card)] p-6 rounded-lg w-[95%] max-w-3xl shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-[var(--color-primary)]">Edit Member</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(editData).map(([key, value]) => (
                  key !== "_id" && key !== "__v" && (
                    key === "image" ? (
                      <div key={key} className="flex flex-col">
                        <label className="text-sm mb-1 capitalize">{key}</label>
                        <img src={value} alt="Preview" className="w-24 h-24 rounded-full object-cover mb-2" />
                        <input type="file" accept="image/*" onChange={handleImageChange} className="text-white" />
                      </div>
                    ) : key === "status" ? (
                      <div key={key} className="flex flex-col">
                        <label className="text-sm mb-1 capitalize">{key}</label>
                        <select
                          name={key}
                          value={value}
                          onChange={handleEditChange}
                          className="px-3 py-2 rounded bg-[var(--color-bg)] border border-white/10 text-white"
                        >
                          <option value="pending">Pending</option>
                          <option value="accept">Accepted</option>
                          <option value="reject">Rejected</option>
                        </select>
                      </div>
                    ) : key === "gender" ? (
                      <div key={key} className="flex flex-col">
                        <label className="text-sm mb-1 capitalize">{key}</label>
                        <div className="flex gap-4">
                          {["male", "female", "other"].map((g) => (
                            <label key={g} className="flex items-center gap-2 text-white text-sm">
                              <input
                                type="radio"
                                name="gender"
                                value={g}
                                checked={value === g}
                                onChange={handleEditChange}
                              />
                              {g.charAt(0).toUpperCase() + g.slice(1)}
                            </label>
                          ))}
                        </div>
                      </div>
                    ) : key === "dob" ? (
                      <div key={key} className="flex flex-col">
                        <label className="text-sm mb-1 capitalize">{key}</label>
                        <input
                          type="date"
                          name={key}
                          value={value}
                          onChange={handleEditChange}
                          className="px-3 py-2 rounded bg-[var(--color-bg)] border border-white/10 text-white"
                        />
                      </div>
                    ) : (
                      <div key={key} className="flex flex-col">
                        <label className="text-sm mb-1 capitalize">{key}</label>
                        <input
                          type="text"
                          name={key}
                          value={value}
                          onChange={handleEditChange}
                          className="px-3 py-2 rounded bg-[var(--color-bg)] border border-white/10 text-white"
                        />
                      </div>
                    )
                  )
                ))}
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">Cancel</button>
                <button onClick={saveEdit} className="px-4 py-2 bg-[var(--color-primary)] text-white rounded hover:opacity-90">Update</button>
              </div>
            </div>
          </div>
        )}


      {/* View Modal */}
      {showViewModal && selectedMember && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 overflow-auto">
          <div className="bg-[var(--color-card)] p-6 rounded-lg w-[90%] max-w-md shadow-lg text-left">
            <div className="flex justify-center">
              <img src={selectedMember.image} alt="Profile" className="w-28 h-28 rounded-full object-cover mb-4" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1 text-center">{selectedMember.fullName}</h3>
            <p className="text-center text-white/70 mb-4">{selectedMember.position}</p>
            <div className="text-white text-sm space-y-1">
              <p><strong>MYLCI:</strong> {selectedMember.mylci}</p>
              <p><strong>Date of Birth:</strong> {new Date(selectedMember.dob).toLocaleDateString()}</p>
              <p><strong>Age:</strong> {selectedMember.age}</p>
              <p><strong>Email:</strong> {selectedMember.email}</p>
              <p><strong>Phone:</strong> {selectedMember.phone}</p>
              <p><strong>Occupation:</strong> {selectedMember.occupation}</p>
              <p><strong>Address:</strong> {selectedMember.address}</p>
              <p><strong>Gender:</strong> {selectedMember.gender}</p>
              <p><strong>Status:</strong> {selectedMember.status}</p>
              <p><strong>Joined:</strong> {new Date(selectedMember.joinDate).toLocaleDateString()}</p>
            </div>
            <div className="flex justify-center mt-4">
              <button onClick={() => setShowViewModal(false)} className="px-4 py-2 bg-gray-600 rounded text-white hover:bg-gray-700">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Add Button */}
      <button
        className="fixed bottom-6 right-6 bg-[var(--color-primary)] hover:opacity-90 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
        onClick={() => alert("TODO: Show create member modal")}
      >
        <FiPlus className="text-xl" />
      </button>
    </div>
  );
}
