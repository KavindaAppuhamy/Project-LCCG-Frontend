import { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit2, FiTrash2, FiUserX, FiUserCheck } from "react-icons/fi";

export default function Users() {
  const [admins, setAdmins] = useState([]);
  const [filter, setFilter] = useState("all");
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [editData, setEditData] = useState({ userName: "", status: "pending" });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true); // Added loading state
  const itemsPerPage = 5;

  const token = localStorage.getItem("adminToken");
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setIsLoading(true); // Set loading to true when starting fetch
      const res = await axios.get(import.meta.env.VITE_BACKEND_URL + "/api/admin", headers);
      const data = Array.isArray(res.data) ? res.data : res.data.admins;
      setAdmins(data);
      setIsLoading(false); // Set loading to false when fetch completes
    } catch (err) {
      console.error("Failed to fetch admins", err);
      setAdmins([]);
      setIsLoading(false); // Set loading to false on error as well
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
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-semibold text-[var(--color-primary)]">Manage Admins</h2>
          <div className="relative group cursor-pointer">
            <div className="w-4 h-4 flex items-center justify-center rounded-full bg-blue-500 text-white text-[10px] font-bold">
              i
            </div>
            <div className="absolute z-10 w-48 top-full mt-1 left-1/2 -translate-x-1/2 bg-gray-900/95 backdrop-blur-sm text-white text-[10px] rounded-lg px-3 py-2 shadow-xl border border-white/10 opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none">
              Only <span className="text-green-400 font-medium">accepted</span>, <span className="text-green-400 font-medium">verified</span>, and <span className="text-green-400 font-medium">active</span> admins can log in.
            </div>
          </div>
        </div>

        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="appearance-none bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 pr-10 text-white shadow-lg hover:bg-white/15 hover:shadow-xl hover:border-white/30 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:bg-white/20 cursor-pointer min-w-[120px]"
          >
            <option value="all" className="bg-gray-900/95 text-white hover:bg-gray-800">All</option>
            <option value="pending" className="bg-gray-900/95 text-white hover:bg-gray-800">Pending</option>
            <option value="accept" className="bg-gray-900/95 text-white hover:bg-gray-800">Accept</option>
            <option value="reject" className="bg-gray-900/95 text-white hover:bg-gray-800">Reject</option>
          </select>
          {/* Custom dropdown arrow */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="w-4 h-4 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
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
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider">Username</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider">Email Verified</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider">Disabled</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-[var(--color-primary)] uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {paginatedAdmins.map((admin, index) => (
                    <tr 
                      key={admin._id} 
                      className="hover:bg-white/5 transition-all duration-200 h-16 group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-white">{admin.userName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-white/80">{admin.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${
                          admin.status === 'accept' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                          admin.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                          'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {admin.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          admin.emailVerified ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {admin.emailVerified ? "Verified" : "Not Verified"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          admin.disabled ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                        }`}>
                          {admin.disabled ? "Disabled" : "Active"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <button
                            className="p-2 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-all duration-200 hover:scale-110"
                            title="Edit"
                            onClick={() => openEditModal(admin)}
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(admin._id)}
                            className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all duration-200 hover:scale-110"
                            title="Delete"
                          >
                            <FiTrash2 size={16} />
                          </button>
                          <label
                            title={admin.disabled ? "Blocked" : "Active"}
                            className="relative inline-flex items-center cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={!admin.disabled}
                              onChange={() => toggleDisabled(admin._id, admin.disabled)}
                              className="sr-only peer"
                            />
                            <div className={`w-11 h-6 rounded-full transition-all duration-300 ${
                              admin.disabled ? "bg-red-500/30 border border-red-500/50" : "bg-green-500/30 border border-green-500/50"
                            }`} />
                            <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 shadow-lg ${
                              !admin.disabled ? "translate-x-5" : ""
                            }`} />
                          </label>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
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

      {/* Glass Edit Modal */}
      {editingAdmin && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-semibold mb-6 text-[var(--color-primary)]">Edit Admin</h3>
            <div className="space-y-4">
              <label className="block">
                <span className="block mb-2 text-sm font-medium text-white/90">Username</span>
                <input
                  type="text"
                  name="userName"
                  value={editData.userName}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]"
                />
              </label>
              <label className="block">
                <span className="block mb-2 text-sm font-medium text-white/90">Status</span>
                <select
                  name="status"
                  value={editData.status}
                  onChange={handleEditChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 focus:border-[var(--color-primary)]"
                >
                  <option className="bg-gray-900/95 text-white hover:bg-gray-800" value="pending">Pending</option>
                  <option className="bg-gray-900/95 text-white hover:bg-gray-800" value="accept">Accept</option>
                  <option className="bg-gray-900/95 text-white hover:bg-gray-800" value="reject">Reject</option>
                </select>
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setEditingAdmin(null)}
                className="px-6 py-3 bg-white/10 backdrop-blur-md text-white rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/20"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg shadow-[var(--color-primary)]/20"
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