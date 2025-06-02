import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login'
import Register from './pages/Register'
import Dashboard  from "./pages/Dashboard";

function App() {
  const [count, setCount] = useState(0)
 return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard"  element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App
