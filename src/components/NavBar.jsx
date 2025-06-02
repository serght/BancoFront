// src/components/NavBar.jsx

import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Borra el token
    localStorage.removeItem("token");
    // 2. Lleva al usuario a /login
    navigate("/login");
  };

  return (
    <nav className="h-screen w-48 bg-white border-r shadow-xl flex flex-col">
      {/* Encabezado */}
      <div className="px-4 py-6 border-b">
        <h2 className="text-lg font-semibold text-blue-800">Menú</h2>
      </div>

      {/* Enlaces */}
      <ul className="flex-1 flex flex-col mt-2">
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `block px-4 py-3 mx-2 my-1 rounded-md text-center text-sm font-medium ${
                isActive
                  ? "bg-blue-800 text-white"
                  : "text-blue-800 hover:bg-blue-100"
              }`
            }
          >
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/cuentas"
            className={({ isActive }) =>
              `block px-4 py-3 mx-2 my-1 rounded-md text-center text-sm font-medium ${
                isActive
                  ? "bg-blue-800 text-white"
                  : "text-blue-800 hover:bg-blue-100"
              }`
            }
          >
            Lista de Cuentas
          </NavLink>
        </li>
        <li>
          <button
            onClick={handleLogout}
            className="w-full text-left block px-4 py-3 mx-2 my-1 rounded-md text-center text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Logout
          </button>
        </li>
      </ul>

      {/* Pie de página */}
      <div className="px-4 py-4 border-t text-gray-500 text-xs text-center">
        &copy; 2025 Mi App
      </div>
    </nav>
  );
}
