import { useEffect, useState } from "react";
import axios from "axios";
import { FiEdit2, FiTrash2, FiUserX, FiUserCheck } from "react-icons/fi";

export default function Users() {
  const [admins, setAdmins] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchAdmins();
  }, []);

const fetchAdmins = async () => {
  try {
    const res = await axios.get(import.meta.env.VITE_BACKEND_URL + "/api/admin");
    // check if res.data.admins exists, otherwise assume it's directly the array
    const data = Array.isArray(res.data) ? res.data : res.data.admins;
    setAdmins(data);
  } catch (err) {
    console.error("Failed to fetch admins", err);
    setAdmins([]); // set to empty array on error to avoid .map crash
  }
};

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this admin?")) return;
    try {
      await axios.delete(import.meta.env.VITE_BACKEND_URL + `/api/admins/${id}`);
      fetchAdmins();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const toggleDisabled = async (id, current) => {
    try {
      await axios.put(import.meta.env.VITE_BACKEND_URL + `/api/admins/${id}`, {
        disabled: !current,
      });
      fetchAdmins();
    } catch (err) {
      console.error("Toggle failed", err);
    }
  };

  const filtered = filter === "all" ? admins : admins.filter(a => a.status === filter);

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-[var(--color-primary)]">Manage Admins</h2>
        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
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
            {filtered.map(admin => (
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
                    // Add edit logic here
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
                  <button
                    onClick={() => toggleDisabled(admin._id, admin.disabled)}
                    className="text-blue-400 hover:text-blue-300"
                    title={admin.disabled ? "Unblock" : "Block"}
                  >
                    {admin.disabled ? <FiUserCheck /> : <FiUserX />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
