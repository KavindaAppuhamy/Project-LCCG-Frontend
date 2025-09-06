import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css';

import AdminLogin from './pages/Admin/adminLogin';
import AdminDashboard from './pages/Admin/admindashboard';
// import Home from './pages/User/home';
import AdminDashboardPage from './pages/Admin/adminDashboardPage';
import AdminRegister from './pages/Admin/adminRegister';
import HomePage from './pages/Home/homePage';

function App() {
  return (
    <BrowserRouter>
    <div>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          // Default options
          className: "",
          duration: 4000,
          style: {
            background: "#1f2937",      // elegant dark background
            color: "#fff",
            fontSize: "14px",
            borderRadius: "12px",
            padding: "12px 20px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
          },

          // Success toast style
          success: {
            style: {
              background: "#10b981",    // emerald green
              color: "#fff",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#10b981",
            },
          },

          // Error toast style
          error: {
            style: {
              background: "#ef4444",    // modern red
              color: "#fff",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#ef4444",
            },
          },
        }}
      />
      <Routes>
        <Route path="/admin-login/*" element={<AdminLogin />} />
        <Route path="/admin-register/*" element={<AdminRegister />} />
        <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
        <Route path="/admin/*" element={<AdminDashboardPage />} />
        <Route path="/*" element={<HomePage />} />
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;

