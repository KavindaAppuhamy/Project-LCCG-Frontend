import { Toaster } from 'react-hot-toast';
import './App.css'
import Home from './pages/Home/home'
import Admin from './pages/Admin/admin'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
function App() {

  return (
    
    <BrowserRouter>
    <Toaster position="top-right" reverseOrder={false}/>
      <Routes path="/*">

        <Route path="/admin/*" element={<Admin />} /> 
        <Route path="/*" element={<Home />} />
  
      </Routes>  
    </BrowserRouter>
  );
}

export default App
