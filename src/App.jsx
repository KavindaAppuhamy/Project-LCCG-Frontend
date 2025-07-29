import { Toaster } from 'react-hot-toast';
import './App.css'

function App() {

  return (
    <BrowserRouter>
    <Toaster position="top-right" reverseOrder={false}/>
      <Routes path="/*">

        <Route path="/admin/*" element={<AdminPage />} /> 
  
      </Routes>  
    </BrowserRouter>
  );
}

export default App
