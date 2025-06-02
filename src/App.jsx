import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login'
import Register from './pages/Register'
import Dashboard  from "./pages/Dashboard";
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Cuentas from './pages/cuentas';
import Login from './pages/login';
import Register from './pages/Register';


function App() {
 return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard"  element={<Dashboard />} />
        <Route path="/cuentas" element={<Cuentas />} />
      </Routes>
    </Router>
  );
}

export default App