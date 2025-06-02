import { useEffect, useState } from 'react';
import { createCuenta, deleteCuenta, getCuentas, updateCuenta } from '../api/cuentas';

export default function Cuentas() {
  const [cuentas, setCuentas] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [form, setForm] = useState({ cedula: '', saldo: '' });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchCuentas();
  }, []);

  const fetchCuentas = async () => {
    try {
      const res = await getCuentas();
      setCuentas(res.data);
    } catch (error) {
      console.error(error);
      alert('Error cargando cuentas');
    }
  };

  const openPopup = (cuenta = null) => {
    if (cuenta) {
      setForm({ cedula: cuenta.cedula, saldo: cuenta.saldo });
      setEditId(cuenta.id);
    } else {
      setForm({ cedula: '', saldo: '' });
      setEditId(null);
    }
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setForm({ cedula: '', saldo: '' });
    setEditId(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.cedula || !form.saldo) return;
    try {
      if (editId) {
        await updateCuenta(editId, {
          saldo: Number(form.saldo),
          cedula: form.cedula,
        });
      } else {
        await createCuenta({
          saldo: Number(form.saldo),
          cedula: form.cedula,
        });
      }
      fetchCuentas();
      closePopup();
    } catch (error) {
      console.error(error);
      alert('Error guardando la cuenta');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta cuenta?')) return;
    try {
      await deleteCuenta(id);
      fetchCuentas();
    } catch (error) {
      console.error(error);
      alert('Error eliminando la cuenta');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Cuentas</h2>
          <button
            onClick={() => openPopup()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Crear nueva cuenta
          </button>
        </div>

        {cuentas.length === 0 ? (
          <p className="text-gray-600">No hay cuentas registradas.</p>
        ) : (
          <ul className="space-y-4">
            {cuentas.map((cuenta) => (
              <li
                key={cuenta.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-100 rounded-lg p-4"
              >
                <div>
                  <span className="font-medium text-gray-700">Cédula:</span>{' '}
                  <span className="text-gray-800">{cuenta.cedula}</span>
                  <span className="mx-2 text-gray-400">|</span>
                  <span className="font-medium text-gray-700">Saldo:</span>{' '}
                  <span className="text-gray-800">{cuenta.saldo}</span>
                </div>
                <div className="mt-3 sm:mt-0 flex space-x-2">
                  <button
                    onClick={() => openPopup(cuenta)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(cuenta.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {editId ? 'Editar cuenta' : 'Crear nueva cuenta'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-1">Cédula:</label>
                <input
                  name="cedula"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={form.cedula}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Saldo:</label>
                <input
                  name="saldo"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={form.saldo}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={closePopup}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
                >
                  {editId ? 'Guardar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}