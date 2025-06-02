import { useState } from 'react';
import { register } from '../api/auth';
import { useNavigate, Link } from 'react-router-dom';  // <== IMPORTANTE
import '../styles/form.css';

function Register() {
  const [formData, setFormData] = useState({
    numeroDocumento: '',
    nombres: '',
    apellidos: '',
    numeroTelefono: '',
    clave: '',
  });

  const navigate = useNavigate(); // <== Hook de navegación

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await register(formData);
      localStorage.setItem('token', response.data.token);
      alert('Registro exitoso');
      navigate('/login'); // <== Redirigir a login
    } catch (error) {
      console.error(error);
      alert('Error al registrarse');
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form">
        <h2 className="title">Create an Account</h2>
        <p className="subtitle">Crea tu cuenta de empleado</p>
        <input
          type="text"
          name="numeroDocumento"
          placeholder="Número de Documento"
          value={formData.numeroDocumento}
          onChange={handleChange}
          required
          className="input"
        />
        <input
          type="text"
          name="nombres"
          placeholder="Nombres"
          value={formData.nombres}
          onChange={handleChange}
          required
          className="input"
        />
        <input
          type="text"
          name="apellidos"
          placeholder="Apellidos"
          value={formData.apellidos}
          onChange={handleChange}
          required
          className="input"
        />
        <input
          type="text"
          name="numeroTelefono"
          placeholder="Número de Teléfono"
          value={formData.numeroTelefono}
          onChange={handleChange}
          required
          className="input"
        />
        <input
          type="password"
          name="clave"
          placeholder="Clave"
          value={formData.clave}
          onChange={handleChange}
          required
          className="input"
        />
        <button type="submit" className="button">Register</button>
        {}
        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" style={{ color: '#047857', textDecoration: 'underline' }}>
            Inicia sesión
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
