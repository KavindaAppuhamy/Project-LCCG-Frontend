import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LuUsers } from "react-icons/lu";
import { TbPhoto } from "react-icons/tb";
import { FiLogOut } from "react-icons/fi";
import { MdManageAccounts } from "react-icons/md";
import { RiFolderSettingsLine } from "react-icons/ri";
import Users from "./users";
import Members from "./members";
import MembersRegistration from "./membersRegistration";
import Newsletters from "./newsletters";

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
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

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
      <aside 
        className={`fixed md:static z-50 h-full transition-all duration-300 ${
          sidebarOpen ? "w-64" : isSidebarExpanded ? "w-60" : "w-20"
        } md:${isSidebarExpanded ? "w-60" : "w-20"} bg-[var(--color-accent)] flex flex-col justify-between shadow-lg ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
      >
        <div>
          <div className="flex items-center gap-3 mb-10 pb-3 border-b border-white/20 pt-6 px-4">
            <img src="/LCCG-Logo.png" alt="Logo" className="w-10 h-10 object-contain" />
            <div className={`overflow-hidden ${isSidebarExpanded || sidebarOpen ? "w-auto max-w-[180px] opacity-100" : "w-0 max-w-0 opacity-0"} transition-all duration-300 ease-in-out`}>
              <h1 className="text-2xl font-bold text-[var(--color-primary)] whitespace-nowrap">LEO CLUB</h1>
            </div>
            {sidebarOpen && (
              <button onClick={() => setSidebarOpen(false)} className="text-white md:hidden ml-auto">
                ✕
              </button>
            )}
          </div>

          <nav className="flex flex-col gap-1 px-4">
            <SidebarLink 
              to="/admin/dashboard/users" 
              icon={<MdManageAccounts size={24} />} 
              label="Users" 
              show={isSidebarExpanded || sidebarOpen}
              closeSidebar={() => setSidebarOpen(false)} 
            />
            <SidebarLink 
              to="/admin/dashboard/projects" 
              icon={<RiFolderSettingsLine size={24} />} 
              label="Projects" 
              show={isSidebarExpanded || sidebarOpen}
              closeSidebar={() => setSidebarOpen(false)} 
            />
            <SidebarLink 
              to="/admin/dashboard/newsletter" 
              icon={<TbPhoto size={24} />} 
              label="Newsletter" 
              show={isSidebarExpanded || sidebarOpen}
              closeSidebar={() => setSidebarOpen(false)} 
            />
            <SidebarLink 
              to="/admin/dashboard/members" 
              icon={<LuUsers size={24} />} 
              label="Members" 
              show={isSidebarExpanded || sidebarOpen}
              closeSidebar={() => setSidebarOpen(false)} 
            />
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className={`text-white flex items-center gap-3 px-4 py-3 hover:bg-red-600 transition border-t border-white/10 group ${
            !(isSidebarExpanded || sidebarOpen) ? "justify-center" : ""
          }`}
        >
          <FiLogOut size={22} />
          <span className={`font-medium overflow-hidden ${isSidebarExpanded || sidebarOpen ? "w-auto max-w-[120px] opacity-100" : "w-0 max-w-0 opacity-0"} transition-all duration-300 ease-in-out whitespace-nowrap`}>
            Logout
          </span>
        </button>
      </aside>

      {/* Main content */}
      <main className={`flex-1 flex flex-col bg-[var(--color-bg)] overflow-y-auto transition-all duration-300 ${
        isSidebarExpanded ? "md:ml-0" : "md:ml-0"
      }`}>

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
            <Route path="members-registration" element={<MembersRegistration />} />
            <Route path="newsletter" element={<Newsletters />} />
            {/* <Route path="projects" element={<AdminProjects />} />
            
             */}
          </Routes>
        </section>
      </main>
    </div>
  );
}

function SidebarLink({ to, icon, label, show, closeSidebar }) {
  return (
    <Link
      to={to}
      onClick={() => {
        if (window.innerWidth < 768) closeSidebar();
      }}
      className={`
        group flex items-center px-4 py-3 rounded-lg hover:bg-[var(--color-primary)] text-[var(--color-primary)] hover:text-black transition-all duration-200 text-[18px] relative overflow-hidden
        ${!show ? "justify-center" : ""}
      `}
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-primary)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out rounded-lg"></div>
      
      <div className="flex items-center relative z-10">
        {/* Icon with subtle hover effect */}
        <div className={`p-1 rounded-lg group-hover:scale-110 transition-transform duration-200 ease-in-out ${show ? "mr-3" : ""}`}>
          <span className="text-[22px]">{icon}</span>
        </div>
        {show && (
          <span className="font-medium group-hover:translate-x-1 transition-transform duration-200 ease-in-out whitespace-nowrap">
            {label}
          </span>
        )}
      </div>
    </Link>
  );
}