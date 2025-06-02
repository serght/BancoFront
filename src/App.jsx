import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Cuentas from "./pages/Cuentas";
import Login from "./pages/login";
import Register from "./pages/Register";
import NavBar from "./components/NavBar";

/**
 * Componente para rutas protegidas.
 * Verifica si existe un token en localStorage; de lo contrario redirige a /login.
 */
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
}

function AppWrapper() {
  const location = useLocation();
  const path = location.pathname;

  // Sólo mostramos NavBar si NO estamos en /login ni /register
  const showNav = path !== "/login" && path !== "/register";

  return (
    <div className="min-h-screen">
      {showNav && <NavBar />}

      {/* Contenido principal con margen izquierdo cuando hay navbar */}
      <div className={`${showNav ? "ml-60" : ""} min-h-screen bg-gray-100`}>
        <Routes>
          {/* Si se entra a "/", redirige automáticamente a "/login" */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rutas protegidas: solo accesibles si hay token */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/cuentas"
            element={
              <PrivateRoute>
                <Cuentas />
              </PrivateRoute>
            }
          />

          {/* Si la ruta no existe, redirigimos a /login o /dashboard según exista token */}
          <Route
            path="*"
            element={
              localStorage.getItem("token") ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
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
