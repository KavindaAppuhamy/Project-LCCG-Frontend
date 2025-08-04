import { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit2, FiTrash2, FiUserX, FiUserCheck } from "react-icons/fi";

export default function Users() {
  const [admins, setAdmins] = useState([]);
  const [filter, setFilter] = useState("all");
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [editData, setEditData] = useState({ userName: "", status: "pending" });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const token = localStorage.getItem("adminToken");
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_BACKEND_URL + "/api/admin", headers);
      const data = Array.isArray(res.data) ? res.data : res.data.admins;
      setAdmins(data);
    } catch (err) {
      console.error("Failed to fetch admins", err);
      setAdmins([]);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this admin?")) return;
    try {
      await axios.delete(import.meta.env.VITE_BACKEND_URL + `/api/admin/${id}`, headers);
      fetchAdmins();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const toggleDisabled = async (id, current) => {
    try {
      await axios.put(import.meta.env.VITE_BACKEND_URL + `/api/admin/${id}`, {
        disabled: !current,
      }, headers);
      fetchAdmins();
    } catch (err) {
      console.error("Toggle failed", err);
    }
  };

  const openEditModal = (admin) => {
    setEditingAdmin(admin);
    setEditData({
      userName: admin.userName,
      status: admin.status,
    });
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    try {
      await axios.put(import.meta.env.VITE_BACKEND_URL + `/api/admin/${editingAdmin._id}`, editData, headers);
      fetchAdmins();
      setEditingAdmin(null);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const filtered = filter === "all" ? admins : admins.filter(a => a.status === filter);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedAdmins = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-[var(--color-primary)]">Manage Admins</h2>
          <div className="relative group cursor-pointer">
            <div className="w-3 h-3 flex items-center justify-center rounded-full bg-blue-500 text-white text-[8px] font-bold">
              i
            </div>
            <div className="absolute z-10 w-48 top-full mt-1 left-1/2 -translate-x-1/2 bg-[var(--color-card)] text-white text-[10px] rounded px-2 py-1 shadow-md opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none">
              Only <span className="text-green-400 font-medium">accepted</span>, <span className="text-green-400 font-medium">verified</span>, and <span className="text-green-400 font-medium">active</span> admins can log in.
            </div>
          </div>
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-[var(--color-card)] border border-white/10 rounded px-4 py-2 text-white"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="accept">Accept</option>
          <option value="reject">Reject</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--color-accent)] text-white">
              <th className="px-4 py-2">Username</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Email Verified</th>
              <th className="px-4 py-2">Disabled</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedAdmins.map((admin) => (
              <tr key={admin._id} className="border-b border-white/10 hover:bg-[var(--color-card)] transition">
                <td className="px-4 py-2">{admin.userName}</td>
                <td className="px-4 py-2">{admin.email}</td>
                <td className="px-4 py-2 capitalize">{admin.status}</td>
                <td className="px-4 py-2">{admin.emailVerified ? "Yes" : "No"}</td>
                <td className="px-4 py-2">{admin.disabled ? "Yes" : "No"}</td>
                <td className="px-4 py-2 flex gap-3">
                  <button
                    className="text-yellow-400 hover:text-yellow-300"
                    title="Edit"
                    onClick={() => openEditModal(admin)}
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleDelete(admin._id)}
                    className="text-red-500 hover:text-red-400"
                    title="Delete"
                  >
                    <FiTrash2 />
                  </button>
                  <label
                    title={admin.disabled ? "Blocked" : "Active"}
                    className="relative inline-flex items-center cursor-pointer scale-90"
                  >
                    <input
                      type="checkbox"
                      checked={!admin.disabled}
                      onChange={() => toggleDisabled(admin._id, admin.disabled)}
                      className="sr-only peer"
                    />
                    <div className={`w-9 h-5 rounded-full transition-colors duration-300 ${admin.disabled ? "bg-red-500" : "bg-green-500"}`} />
                    <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-4" />
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded text-sm ${currentPage === i + 1 ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-card)] text-white/60 hover:text-white"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingAdmin && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-[var(--color-card)] p-6 rounded-lg w-[90%] max-w-sm shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-[var(--color-primary)]">Edit Admin</h3>
            <label className="block mb-3">
              <span className="block mb-1 text-sm">Username</span>
              <input
                type="text"
                name="userName"
                value={editData.userName}
                onChange={handleEditChange}
                className="w-full px-3 py-2 rounded bg-[var(--color-bg)] border border-white/10 text-white"
              />
            </label>
            <label className="block mb-4">
              <span className="block mb-1 text-sm">Status</span>
              <select
                name="status"
                value={editData.status}
                onChange={handleEditChange}
                className="w-full px-3 py-2 rounded bg-[var(--color-bg)] border border-white/10 text-white"
              >
                <option value="pending">Pending</option>
                <option value="accept">Accept</option>
                <option value="reject">Reject</option>
              </select>
            </label>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditingAdmin(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="px-4 py-2 bg-[var(--color-primary)] text-white rounded hover:opacity-90"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
