import { useState } from 'react';
import { login } from '../api/auth';
import { Link } from 'react-router-dom';  // <== IMPORTANTE
import '../styles/form.css'; 

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      localStorage.setItem('token', response.data.token); 
      alert('Login exitoso');
    } catch (error) {
      console.error(error);
      alert('Error al iniciar sesión');
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form">
        <h2 className="title">Sign in</h2>
        <p className="subtitle">Ingresa tus datos</p>
        <input
          type="text"
          name="username"
          placeholder="Número de Documento"
          value={formData.username}
          onChange={handleChange}
          required
          className="input"
        />
        <input
          type="password"
          name="password"
          placeholder="Clave"
          value={formData.password}
          onChange={handleChange}
          required
          className="input"
        />
        <button type="submit" className="button">Sign in</button>
        {/* Aquí el Link para registrar */}
        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          ¿No tienes cuenta?{' '}
          <Link to="/register" style={{ color: '#047857', textDecoration: 'underline' }}>
            Regístrate
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
