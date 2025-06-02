// src/App.jsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Cuentas from "./pages/Cuentas";
import Login from "./pages/login";
import Register from "./pages/Register";
import NavBar from "./components/NavBar";

function App() {
  return (
    <Router>
      {/* 1. Contenedor general en modo Flex */}
      <div className="flex min-h-screen">
        
        {/* 2. NavBar ocupa toda la altura a la izquierda (w-48) */}
        <NavBar />

        {/* 3. Contenedor de contenido a la derecha: flex-grow para que llene el resto */}
        <div className="flex-1 bg-gray-100">
          {/* Aquí van las rutas */}
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cuentas" element={<Cuentas />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
