import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";  // added for token expiration check
import { LuUsers } from "react-icons/lu";
import { TbPhoto } from "react-icons/tb";
import { FiLogOut } from "react-icons/fi";
import { MdManageAccounts } from "react-icons/md";
import { RiFolderSettingsLine } from "react-icons/ri";
import { FaQuoteLeft } from "react-icons/fa";
import Users from "./users";
import Members from "./members";
import MembersRegistration from "./membersRegistration";
import Newsletters from "./newsletters";
import NewslettersCreation from "./newslettersCreation";
import Testimonials from "./testimonials";
import Projects from "./projects";

function isAdminValid(admin) {
  if (!admin) return false;

  const { status, emailVerified, disabled } = admin;

  if (status !== "accept" || !emailVerified || disabled) {
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
  const [isMobile, setIsMobile] = useState(false);

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminDetails");
    navigate("/admin-login");
  };

  useEffect(() => {
    const storedAdmin = localStorage.getItem("adminDetails");
    const storedToken = localStorage.getItem("adminToken");

    if (storedAdmin && storedToken) {
      const parsedAdmin = JSON.parse(storedAdmin);

      if (!isAdminValid(parsedAdmin)) {
        handleLogout();
        return;
      }

      setAdmin(parsedAdmin);
      setIsChecking(false);

      // Auto logout when token expires
      try {
        const decoded = jwtDecode(storedToken);
        const expTime = decoded.exp * 1000; // convert seconds → ms
        const timeout = expTime - Date.now();

        if (timeout <= 0) {
          handleLogout(); // token already expired
        } else {
          const timer = setTimeout(() => {
            alert("Session expired. Logging out.");
            handleLogout();
          }, timeout);

          return () => clearTimeout(timer); // cleanup on unmount
        }
      } catch (err) {
        handleLogout(); // invalid token
      }
    } else {
      navigate("/admin-login");
    }
  }, [navigate]);

  if (isChecking) return null;

  const defaultImage = "https://www.w3schools.com/howto/img_avatar.png";

  return (
    <>
      {/* Mobile Layout */}
      {isMobile ? (
        <div className="w-full min-h-screen flex flex-col font-sans bg-[var(--color-bg)] text-white">
          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Mobile Sidebar */}
          <aside 
            className={`fixed left-0 top-0 z-50 h-full w-72 bg-[var(--color-accent)] transform transition-transform duration-300 ease-in-out ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } flex flex-col justify-between shadow-2xl`}
          >
            <div className="flex-1 overflow-y-auto">
              {/* Mobile Logo Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/20">
                <div className="flex items-center gap-3">
                  <img src="/LCCG-Logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                  <h1 className="text-xl font-bold text-[var(--color-primary)]">LCCG Admin</h1>
                </div>
                <button 
                  onClick={() => setSidebarOpen(false)} 
                  className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Mobile Navigation */}
              <nav className="flex flex-col gap-2 p-4">
                <MobileSidebarLink 
                  to="/admin/dashboard/users" 
                  icon={<MdManageAccounts size={22} />} 
                  label="Users" 
                  closeSidebar={() => setSidebarOpen(false)} 
                />
                <MobileSidebarLink 
                  to="/admin/dashboard/projects" 
                  icon={<RiFolderSettingsLine size={22} />} 
                  label="Projects" 
                  closeSidebar={() => setSidebarOpen(false)} 
                />
                <MobileSidebarLink 
                  to="/admin/dashboard/newsletter" 
                  icon={<TbPhoto size={22} />} 
                  label="Newsletter" 
                  closeSidebar={() => setSidebarOpen(false)} 
                />
                <MobileSidebarLink 
                  to="/admin/dashboard/members" 
                  icon={<LuUsers size={22} />} 
                  label="Members" 
                  closeSidebar={() => setSidebarOpen(false)} 
                />
                <MobileSidebarLink 
                  to="/admin/dashboard/testimonials" 
                  icon={<FaQuoteLeft size={18} />}
                  label="Testimonials" 
                  closeSidebar={() => setSidebarOpen(false)} 
                />
              </nav>
            </div>

            {/* Mobile Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 p-4 text-white hover:bg-red-600 transition-colors border-t border-white/10"
            >
              <FiLogOut size={22} />
              <span className="font-medium">Logout</span>
            </button>
          </aside>

          {/* Mobile Header */}
          <header className="flex items-center justify-between p-4 border-b border-white/10 bg-[var(--color-bg)] shadow-sm sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setSidebarOpen(true)} 
                className="p-2 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h2 className="text-lg font-semibold text-[var(--color-primary)]">Dashboard</h2>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* <img
                src={admin?.image || defaultImage}
                alt="Admin"
                className="w-8 h-8 rounded-full object-cover border border-[var(--color-highlight)]"
              />
              <div className="hidden xs:block">
                <p className="text-sm font-medium text-[var(--color-primary)] truncate max-w-[100px]">
                  {admin?.userName}
                </p>
              </div> */}
              <div>
                  <p className="font-semibold text-[var(--color-primary)]">
                    {admin?.userName}
                  </p>
                  <p className="text-sm text-[var(--color-secondary)] hidden sm:block">
                    {admin?.email}
                  </p>
              </div>
              {/* <div>
                  <p className="font-semibold text-sm text-[var(--color-primary)]">
                    {admin?.userName}
                  </p>
                  <p className="text-sm text-[var(--color-secondary)] ">
                    {admin?.email}
                  </p>
              </div> */}
            </div>
          </header>

          {/* Mobile Content */}
          <main className="flex-1 overflow-y-auto">
            <section className="p-4 text-white">
              <Routes>
                <Route path="users" element={<Users />} />
                <Route path="members" element={<Members />} />
                <Route path="members-registration" element={<MembersRegistration />} />
                <Route path="newsletter" element={<Newsletters />} />
                <Route path="newsletter-creation" element={<NewslettersCreation />} />
                <Route path="testimonials" element={<Testimonials />} />
                <Route path="projects" element={<Projects />} />
              </Routes>
            </section>
          </main>
        </div>
      ) : (
        /* Desktop Layout - Original Code Preserved */
        <div className="w-full h-screen flex font-sans bg-[var(--color-bg)] text-white overflow-hidden">
          {/* Desktop Sidebar */}
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
              <div
                className={`flex items-center mb-10 pb-3 border-b border-white/20 pt-6 px-4 transition-all duration-300
                  ${isSidebarExpanded || sidebarOpen ? "justify-start gap-3" : "justify-center"}`}
              >
                <img
                  src="/LCCG-Logo.png"
                  alt="Logo"
                  className="w-10 h-10 object-contain"
                />
                <div
                  className={`overflow-hidden ${
                    isSidebarExpanded || sidebarOpen
                      ? "w-auto max-w-[180px] opacity-100 ml-2"
                      : "w-0 max-w-0 opacity-0"
                  } transition-all duration-300 ease-in-out`}
                >
                  <h1 className="text-2xl font-bold text-[var(--color-primary)] whitespace-nowrap">
                    LCCG
                  </h1>
                </div>
                {sidebarOpen && (
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="text-white md:hidden ml-auto"
                  >
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
                <SidebarLink 
                  to="/admin/dashboard/testimonials" 
                  icon={<FaQuoteLeft size={18} />}
                  label="Testimonials" 
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

          {/* Desktop Main content */}
          <main className={`flex-1 flex flex-col bg-[var(--color-bg)] overflow-y-auto transition-all duration-300 ${
            isSidebarExpanded ? "md:ml-0" : "md:ml-0"
          }`}>

            {/* Desktop Topbar */}
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

            {/* Desktop Page Content */}
            <section className="p-6 text-white">
              <Routes>
                <Route path="users" element={<Users />} />
                <Route path="members" element={<Members />} />
                <Route path="members-registration" element={<MembersRegistration />} />
                <Route path="newsletter" element={<Newsletters />} />
                <Route path="newsletter-creation" element={<NewslettersCreation />} />
                <Route path="testimonials" element={<Testimonials />} />
                <Route path="projects" element={<Projects />} />
              </Routes>
            </section>
          </main>
        </div>
      )}
    </>
  );
}

// Desktop Sidebar Link (Original)
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

// Mobile Sidebar Link
function MobileSidebarLink({ to, icon, label, closeSidebar }) {
  return (
    <Link
      to={to}
      onClick={closeSidebar}
      className="group flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-[var(--color-primary)] text-[var(--color-primary)] hover:text-black transition-all duration-200 text-[16px] relative overflow-hidden"
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-primary)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out rounded-lg"></div>
      
      <div className="flex items-center gap-3 relative z-10">
        <div className="p-1 rounded-lg group-hover:scale-110 transition-transform duration-200 ease-in-out">
          {icon}
        </div>
        <span className="font-medium group-hover:translate-x-1 transition-transform duration-200 ease-in-out">
          {label}
        </span>
      </div>
    </Link>
  );
}