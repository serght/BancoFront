import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  CreditCard, 
  LogOut 
} from "lucide-react";

export default function NavBar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 h-screen w-60 bg-white border-r border-gray-200 flex flex-col z-10">
      {/* Encabezado */}
      <div className="px-6 py-8 border-b border-gray-100">
        <h1 className="text-xl font-bold text-teal-600">Mi App Admin</h1>
      </div>

      {/* Opciones de navegación */}
      <div className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <LayoutDashboard size={20} />
              Dashboard
            </NavLink>
          </li>
          
          <li>
            <NavLink
              to="/cuentas"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              <CreditCard size={20} />
              Lista de Cuentas
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Logout en la parte inferior */}
      <div className="px-4 pb-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </nav>
  );
}