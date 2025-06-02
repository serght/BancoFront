import { useEffect, useState } from "react";
import { getCuentas, getTransacciones } from "../api/admin";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [cuentasCount, setCuentasCount] = useState(0);
  const [aprobCount, setAprobCount] = useState(0);
  const [rechazCount, setRechazCount] = useState(0);
  const [montoAprobado, setMontoAprobado] = useState(0);
  const [transacciones, setTransacciones] = useState([]);

  useEffect(() => {
    document.title = "Dashboard";

    setLoading(true);

    Promise.all([getCuentas(), getTransacciones()])
      .then(([resCuentas, resTx]) => {
        // 👉 Número de cuentas
        const cuentasArray = Array.isArray(resCuentas.data) ? resCuentas.data : [];
        setCuentasCount(cuentasArray.length);

        // 👉 Transacciones completas
        const txArray = Array.isArray(resTx.data) ? resTx.data : [];
        setTransacciones(txArray);

        // 👉 Filtrar aprobadas vs rechazadas
        const aprobadas = txArray.filter((t) => t.aprobada === true);
        const rechazadas = txArray.filter((t) => t.aprobada === false);

        setAprobCount(aprobadas.length);
        setRechazCount(rechazadas.length);

        // 👉 Suma de monto aprobado (solo transacciones aprobadas)
        const suma = aprobadas.reduce((acc, t) => acc + (Number(t.monto) || 0), 0);
        setMontoAprobado(suma);
      })
      .catch((err) => {
        console.error("Error cargando datos en Dashboard:", err);
        setCuentasCount(0);
        setAprobCount(0);
        setRechazCount(0);
        setMontoAprobado(0);
        setTransacciones([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Función para formatear moneda COP sin decimales
  const formatCOP = (value) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Función para formatear fecha y hora
  const formatFecha = (isoString) => {
    if (!isoString) return "";
    const d = new Date(isoString);
    const fecha = d.toLocaleDateString("es-CO", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const hora = d.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${fecha} ${hora}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="p-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header del Dashboard */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Principal</h1>
              <p className="text-gray-600 mt-1">
                Resumen general del sistema bancario
              </p>
            </div>
            <div className="w-16 h-16 bg-green-100 flex items-center justify-center rounded-full">
              <svg
                className="w-8 h-8 text-green-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Cards de Resumen */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ResumenCard 
            label="Cuentas Activas" 
            value={cuentasCount}
            icon="users"
            color="blue"
          />
          <ResumenCard 
            label="Tx Aprobadas" 
            value={aprobCount}
            icon="check"
            color="green"
          />
          <ResumenCard 
            label="Tx Rechazadas" 
            value={rechazCount}
            icon="x"
            color="red"
          />
          <ResumenCard
            label="Monto Aprobado"
            value={formatCOP(montoAprobado)}
            icon="currency"
            color="purple"
          />
        </div>

        {/* Listado de Transacciones */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Historial de Transacciones</h2>
                <p className="text-gray-600 mt-1">
                  Registro completo de todas las operaciones
                </p>
              </div>
              <div className="text-sm text-gray-500">
                Total: {transacciones.length} transacciones
              </div>
            </div>
          </div>

          {transacciones.length === 0 ? (
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
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Sin transacciones registradas
              </h3>
              <p className="text-gray-600">
                Las transacciones aparecerán aquí cuando se realicen operaciones
              </p>
            </div>
          ) : (
            <div className="p-6">
              <div className="space-y-4">
                {transacciones.map((t) => (
                  <div
                    key={t.id}
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-200 hover:border-gray-300"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        {/* Icono de estado */}
                        <div className={`w-12 h-12 flex items-center justify-center rounded-full flex-shrink-0 ${
                          t.aprobada 
                            ? 'bg-green-100' 
                            : 'bg-red-100'
                        }`}>
                          {t.aprobada ? (
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
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-6 h-6 text-red-700"
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
                          )}
                        </div>
                        
                        {/* Información de la transacción */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-lg font-semibold text-gray-900">
                              Cliente: {t.clienteCedula}
                            </h3>
                            <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                              t.aprobada
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {t.aprobada ? 'APROBADA' : 'RECHAZADA'}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Monto */}
                            <div>
                              <p className="text-sm font-medium text-gray-500 mb-1">Monto</p>
                              <p className="text-xl font-bold text-gray-900">
                                {formatCOP(t.monto)}
                              </p>
                            </div>
                            
                            {/* Fecha */}
                            <div>
                              <p className="text-sm font-medium text-gray-500 mb-1">Fecha y Hora</p>
                              <p className="text-sm text-gray-900">
                                {formatFecha(t.fecha)}
                              </p>
                            </div>
                            
                            {/* ID */}
                            <div>
                              <p className="text-sm font-medium text-gray-500 mb-1">ID Transacción</p>
                              <p className="font-mono text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded inline-block">
                                {t.id.slice(0, 8)}...
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ResumenCard({ label, value, icon, color }) {
  const getIconElement = (iconType) => {
    const iconProps = {
      className: "w-8 h-8 text-white",
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24"
    };

    switch (iconType) {
      case 'users':
        return (
          <svg {...iconProps}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
            />
          </svg>
        );
      case 'check':
        return (
          <svg {...iconProps}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case 'x':
        return (
          <svg {...iconProps}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case 'currency':
        return (
          <svg {...iconProps}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  const getColorClasses = (colorType) => {
    switch (colorType) {
      case 'blue':
        return 'bg-blue-600 hover:bg-blue-700';
      case 'green':
        return 'bg-green-600 hover:bg-green-700';
      case 'red':
        return 'bg-red-600 hover:bg-red-700';
      case 'purple':
        return 'bg-purple-600 hover:bg-purple-700';
      default:
        return 'bg-gray-600 hover:bg-gray-700';
    }
  };

  return (
    <div className={`${getColorClasses(color)} text-white rounded-xl p-6 shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105`}>
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
          {getIconElement(icon)}
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold">{value}</p>
        </div>
      </div>
      <p className="text-white/90 font-medium">{label}</p>
    </div>
  );
}