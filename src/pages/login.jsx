// src/pages/login.jsx

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/auth";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate(); // ◀︎ Hook para redirigir

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // limpiar posible error previo

    try {
      const response = await login(formData);
      
      // 1) Guardar token
      localStorage.setItem("token", response.data.token);

      // 2) Redirigir a /dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Número de documento o clave incorrectos");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      {/* Card */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8 space-y-5"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Sign in</h2>
          <p className="text-sm text-gray-500 mt-1">Ingresa tus datos</p>
        </div>

        {error && (
          <div className="text-red-600 text-sm text-center">{error}</div>
        )}

        <input
          type="text"
          name="username"
          placeholder="Número de Documento"
          value={formData.username}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <input
          type="password"
          name="password"
          placeholder="Clave"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition-colors"
        >
          Sign in
        </button>

        <p className="text-center text-sm text-gray-600">
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            className="text-emerald-700 hover:text-emerald-800 underline font-medium"
          >
            Regístrate
          </Link>
        </p>
      </form>
    </div>
  );
}
