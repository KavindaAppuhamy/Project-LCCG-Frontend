import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css'
import AdminLogin from './pages/Admin/adminLogin';

function App() {

  return (
    <BrowserRouter>
    <Toaster position="top-right" reverseOrder={false}/>
      <Routes path="/*">

        <Route path="/admin-login/*" element={<AdminLogin />} /> 
  
      </Routes>  
    </BrowserRouter>
  );
}

export default App
