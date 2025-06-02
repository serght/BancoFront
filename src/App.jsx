// src/App.jsx

import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Cuentas from "./pages/Cuentas";
import Login from "./pages/login";
import Register from "./pages/Register";
import NavBar from "./components/NavBar";

function AppWrapper() {
  const location = useLocation();
  const path = location.pathname;

  // Sólo mostramos NavBar si NO estamos en /login ni /register
  const showNav = path !== "/login" && path !== "/register";

  return (
    <div className="flex min-h-screen">
      {showNav && <NavBar />}

      <div className={`${showNav ? "flex-1" : "w-full"} bg-gray-100`}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cuentas" element={<Cuentas />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}
