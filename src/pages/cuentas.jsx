import { useEffect, useState } from 'react';
import {
  createCuenta,
  deleteCuenta,
  getCuentas,
  updateCuenta,
  getTransaccionesByCuenta,
} from '../api/cuentas';

export default function Cuentas() {
  // Estados
  const [cuentas, setCuentas] = useState([]);
  const [lastTransactions, setLastTransactions] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [form, setForm] = useState({ cedula: '', saldo: '' });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCuentas();
  }, []);

  // Formateo de moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Formateo de fecha
  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return (
      date.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }) +
      ' ' +
      date.toLocaleTimeString('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
      })
    );
  };

  // Traer cuentas + últimas transacciones
  const fetchCuentas = async () => {
    try {
      setLoading(true);
      const res = await getCuentas();
      const cuentasData = res.data;
      setCuentas(cuentasData);

      const promesas = cuentasData.map(async (cuenta) => {
        const txRes = await getTransaccionesByCuenta(cuenta.id);
        const todasTx = txRes.data;
        if (todasTx.length > 0) {
          const ultima = todasTx.reduce((prev, curr) =>
            new Date(prev.fecha) > new Date(curr.fecha) ? prev : curr
          );
          return { cuentaId: cuenta.id, transaccion: ultima };
        } else {
          return { cuentaId: cuenta.id, transaccion: null };
        }
      });

      const resultados = await Promise.all(promesas);
      const txMap = {};
      resultados.forEach(({ cuentaId, transaccion }) => {
        txMap[cuentaId] = transaccion;
      });
      setLastTransactions(txMap);
    } catch (error) {
      console.error(error);
      alert('Error cargando cuentas o transacciones');
    } finally {
      setLoading(false);
    }
  };

  // Abrir/Cerrar modal
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

  // Manejador de cambios en formulario
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Enviar formulario
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
      await fetchCuentas();
      closePopup();
    } catch (error) {
      console.error(error);
      alert('Error guardando la cuenta');
    }
  };

  // Eliminar cuenta
  const handleDelete = async (id) => {
    if (
      !window.confirm(
        '¿Confirma la eliminación de esta cuenta bancaria? Esta acción no se puede deshacer.'
      )
    )
      return;
    try {
      await deleteCuenta(id);
      await fetchCuentas();
    } catch (error) {
      console.error(error);
      alert('Error eliminando la cuenta');
    }
  };

  // Filtrar cuentas
  const cuentasFiltradas = cuentas.filter((cuenta) =>
    cuenta.cedula.toString().includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-7xl overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Administración de Cuentas</h1>
            <p className="text-gray-600 mt-1">
              Panel de gestión de cuentas de clientes • Sistema Bancario
            </p>
            <div className="mt-2 text-sm text-gray-500">
              {cuentas.length === 0
                ? 'No hay cuentas registradas'
                : `Total de cuentas activas: ${cuentas.length}`}
            </div>
          </div>

          <button
            onClick={() => openPopup()}
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-3 rounded-md shadow-sm transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Nueva Cuenta
          </button>
        </div>

        {/* Barra de búsqueda */}
        <div className="px-8 py-4 bg-gray-50 border-b border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buscar por Número de Cédula
          </label>
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ej. 1234567890"
              className="w-full pl-9 pr-3 py-2 border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-colors rounded-md bg-white text-gray-900"
            />
          </div>
        </div>

        {/* Contenido principal */}
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando información de cuentas...</p>
          </div>
        ) : cuentasFiltradas.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 flex items-center justify-center rounded-full">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? 'No se encontraron cuentas' : 'Sin cuentas registradas'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? 'Verifica el número de cédula e intenta de nuevo'
                : 'Registra la primera cuenta bancaria'}
            </p>
            <button
              onClick={() => openPopup()}
              className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-md shadow-sm transition-colors"
            >
              Registrar Cuenta
            </button>
          </div>
        ) : (
          <div className="p-6">
            {/* Lista de cuentas como cards */}
            <div className="space-y-4">
              {cuentasFiltradas.map((cuenta, index) => {
                const ultimaTx = lastTransactions[cuenta.id];
                return (
                  <div
                    key={cuenta.id}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-200 hover:border-gray-300"
                  >
                    <div className="flex items-start justify-between">
                      {/* Información principal de la cuenta */}
                      <div className="flex items-start gap-4 flex-1">
                        {/* Avatar */}
                        <div className="w-12 h-12 bg-green-100 flex items-center justify-center rounded-full flex-shrink-0">
                          <svg
                            className="w-6 h-6 text-green-700"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        
                        {/* Datos de la cuenta */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-lg font-semibold text-gray-900">
                              Cédula: {cuenta.cedula}
                            </h3>
                            <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                              ACTIVA
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Saldo */}
                            <div>
                              <p className="text-sm font-medium text-gray-500 mb-1">Saldo Actual</p>
                              <p className="text-xl font-bold text-gray-900">
                                {formatCurrency(cuenta.saldo)}
                              </p>
                            </div>
                            
                            {/* Última transacción */}
                            <div>
                              <p className="text-sm font-medium text-gray-500 mb-1">Última Transacción</p>
                              {ultimaTx ? (
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {formatCurrency(ultimaTx.monto)}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {formatDate(ultimaTx.fecha)}
                                  </p>
                                </div>
                              ) : (
                                <p className="text-sm text-gray-400">Sin movimientos</p>
                              )}
                            </div>
                            
                            {/* Estado de transacción */}
                            <div>
                              <p className="text-sm font-medium text-gray-500 mb-1">Estado</p>
                              {ultimaTx ? (
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                  ultimaTx.aprobada
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                  {ultimaTx.aprobada ? 'Aprobada' : 'Rechazada'}
                                </span>
                              ) : (
                                <span className="text-sm text-gray-400">Sin actividad</span>
                              )}
                            </div>
                          </div>
                          
                          {/* ID de cuenta */}
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">ID:</span>
                              <span className="font-mono text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                {cuenta.id.toString().slice(0, 8)}
                              </span>
                              <span className="text-xs text-gray-400">
                                • Cliente #{index + 1}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Acciones */}
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => openPopup(cuenta)}
                          className="p-2 text-green-700 hover:text-green-900 hover:bg-green-50 rounded-lg transition-colors"
                          title="Editar cuenta"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(cuenta.id)}
                          className="p-2 text-red-700 hover:text-red-900 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar cuenta"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Modal para crear/editar cuenta */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg overflow-hidden">
            {/* Encabezado del modal */}
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {editId ? 'Modificar Cuenta' : 'Registrar Cuenta'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {editId
                    ? 'Actualiza la información de la cuenta'
                    : 'Completa los datos requeridos'}
                </p>
              </div>
              <button
                onClick={closePopup}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Formulario */}
            <div className="px-6 py-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Cédula <span className="text-red-600">*</span>
                </label>
                <input
                  name="cedula"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={form.cedula}
                  onChange={handleChange}
                  required
                  placeholder="Ej. 1234567890"
                  className="w-full border border-gray-300 rounded-md focus:border-green-500 focus:ring-2 focus:ring-green-200 px-3 py-2 text-gray-900 transition-colors"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Solo números, sin puntos ni espacios
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Saldo Inicial <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                    COP $
                  </span>
                  <input
                    name="saldo"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={form.saldo}
                    onChange={handleChange}
                    required
                    placeholder="0"
                    className="w-full border border-gray-300 rounded-md focus:border-green-500 focus:ring-2 focus:ring-green-200 pl-14 pr-3 py-2 text-gray-900 transition-colors"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Monto en pesos colombianos, sin separadores
                </p>
              </div>
            </div>

            {/* Footer del modal */}
            <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex gap-3">
              <button
                type="button"
                onClick={closePopup}
                className="flex-1 bg-white hover:bg-gray-100 border border-gray-300 text-gray-700 font-medium py-2 rounded-md transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-md transition-colors"
              >
                {editId ? 'Actualizar' : 'Registrar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}