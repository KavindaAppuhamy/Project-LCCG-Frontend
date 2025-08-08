import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css';

import AdminLogin from './pages/Admin/adminLogin';
import AdminDashboard from './pages/Admin/admindashboard';
import Home from './pages/User/home';
import AdminDashboardPage from './pages/Admin/adminDashboardPage';
import AdminRegister from './pages/Admin/adminRegister';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/admin-login/*" element={<AdminLogin />} />
        <Route path="/admin-register/*" element={<AdminRegister />} />
        <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
        <Route path="/admin/*" element={<AdminDashboardPage />} />
        <Route path="/*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

