import { useState } from 'react';
import { register } from '../api/auth';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    numeroDocumento: '',
    nombres: '',
    apellidos: '',
    numeroTelefono: '',
    clave: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await register(formData);
      localStorage.setItem('token', response.data.token);
      alert('Registro exitoso');
      navigate('/login');
    } catch (error) {
      console.error(error);
      alert('Error al registrarse');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white rounded-xl shadow-lg p-8 space-y-5"
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Create an Account</h2>
          <p className="text-sm text-gray-500 mt-1">Crea tu cuenta de empleado</p>
        </div>

        <input
          type="text"
          name="numeroDocumento"
          placeholder="Número de Documento"
          value={formData.numeroDocumento}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <input
          type="text"
          name="nombres"
          placeholder="Nombres"
          value={formData.nombres}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <input
          type="text"
          name="apellidos"
          placeholder="Apellidos"
          value={formData.apellidos}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <input
          type="text"
          name="numeroTelefono"
          placeholder="Número de Teléfono"
          value={formData.numeroTelefono}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <input
          type="password"
          name="clave"
          placeholder="Clave"
          value={formData.clave}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-lg transition-colors"
        >
          Register
        </button>

        <p className="text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <Link
            to="/login"
            className="text-emerald-700 hover:text-emerald-800 underline font-medium"
          >
            Inicia sesión
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
