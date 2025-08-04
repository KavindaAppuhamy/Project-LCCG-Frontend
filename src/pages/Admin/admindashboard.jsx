import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LuUsers } from "react-icons/lu";
import { TbPhoto } from "react-icons/tb";
import { FiLogOut } from "react-icons/fi";
import { MdManageAccounts } from "react-icons/md";
import { RiFolderSettingsLine } from "react-icons/ri";
import Users from "./users";
import Members from "./members";

function isAdminValid(admin) {
  if (!admin) return false;

  const { status, emailVerified, disabled } = admin;

  if (
    status !== "accept" ||
    !emailVerified ||
    disabled
  ) {
    return false;
  }

  return true;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [isChecking, setIsChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const storedAdmin = localStorage.getItem("adminDetails");

    if (storedAdmin) {
      const parsed = JSON.parse(storedAdmin);
      if (isAdminValid(parsed)) {
        setAdmin(parsed);
        setIsChecking(false);
      } else {
        navigate("/admin/login");
      }
    } else {
      navigate("/admin/login");
    }
  }, [navigate]);

  if (isChecking) return null;

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminDetails");
    navigate("/admin-login");
  };

  const defaultImage = "https://www.w3schools.com/howto/img_avatar.png";

  return (
    <div className="w-full h-screen flex font-sans bg-[var(--color-bg)] text-white overflow-hidden">

      {/* Sidebar */}
      <aside className={`fixed md:static z-50 h-full md:w-60 w-64 bg-[var(--color-accent)] flex flex-col justify-between shadow-lg transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <div>
          <div className="flex items-center justify-between md:justify-center gap-3 mb-10 pb-3 border-b border-white/20 pt-6 px-4">
            <div className="flex items-center gap-3">
              <img src="/LCCG-Logo.png" alt="Logo" className="w-10 h-10 object-contain" />
              <h1 className="text-2xl font-bold text-[var(--color-primary)]">LEO CLUB</h1>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="text-white md:hidden">
              ✕
            </button>
          </div>

          <nav className="flex flex-col gap-1 px-4">
            <SidebarLink to="/admin/dashboard/users" icon={<MdManageAccounts size={24} />} label="Users" closeSidebar={() => setSidebarOpen(false)} />
            <SidebarLink to="/admin/dashboard/projects" icon={<RiFolderSettingsLine size={24} />} label="Projects" closeSidebar={() => setSidebarOpen(false)} />
            <SidebarLink to="/admin/dashboard/newsletter" icon={<TbPhoto size={24} />} label="Newsletter" closeSidebar={() => setSidebarOpen(false)} />
            <SidebarLink to="/admin/dashboard/members" icon={<LuUsers size={24} />} label="Members" closeSidebar={() => setSidebarOpen(false)} />
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="text-white flex items-center gap-3 px-4 py-3 hover:bg-red-600 transition border-t border-white/10"
        >
          <FiLogOut size={22} /> Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col bg-[var(--color-bg)] overflow-y-auto">

        {/* Topbar */}
        <header className="flex justify-between items-center p-4 border-b border-white/10 bg-[var(--color-bg)] shadow-sm">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden text-[var(--color-primary)]">
            ☰
          </button>
          <h2 className="text-xl font-semibold text-[var(--color-primary)]">
            <span className="block sm:hidden">Admin Dashboard</span>
            <span className="hidden sm:block">Welcome to Admin Dashboard</span>
            </h2>
          <div className="flex items-center gap-4">
            <img
              src={admin?.image || defaultImage}
              alt="Admin"
              className="w-10 h-10 rounded-full object-cover border border-[var(--color-highlight)]"
            />
            <div>
              <p className="font-semibold text-[var(--color-primary)]">
                {admin?.userName}
              </p>
              <p className="text-sm text-[var(--color-secondary)] hidden sm:block">
                {admin?.email}
              </p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <section className="p-6 text-white">
          <Routes>
            <Route path="users" element={<Users />} />
            <Route path="members" element={<Members />} />
            {/* <Route path="projects" element={<AdminProjects />} />
            <Route path="newsletter" element={<AdminNewsletter />} />
             */}
          </Routes>
        </section>
      </main>
    </div>
  );
}

function SidebarLink({ to, icon, label, closeSidebar }) {
  return (
    <Link
      to={to}
      onClick={() => {
        if (window.innerWidth < 768) closeSidebar();
      }}
      className="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-[var(--color-primary)] text-[var(--color-primary)] hover:text-black transition text-[18px]"
    >
      <span className="text-[22px]">{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );
}
