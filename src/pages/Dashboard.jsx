import { useEffect, useMemo, useState } from "react";
import { getCuentas, getTransacciones } from "../api/admin";
import { useTransaccionesWebSocket } from "../hooks/useTransaccionesWebSocket";


export default function Dashboard() {

  const [loading, setLoading] = useState(true);
  const [cuentasCount, setCuentasCount] = useState(0);
  const [transacciones, setTransacciones] = useState([]);

  const { transacciones: txTiempoReal, conectado } = useTransaccionesWebSocket();

  useEffect(() => {
    document.title = "Dashboard";

    Promise.all([getCuentas(), getTransacciones()])
      .then(([resCuentas, resTx]) => {
        setCuentasCount(Array.isArray(resCuentas.data) ? resCuentas.data.length : 0);
        setTransacciones(Array.isArray(resTx.data) ? resTx.data : []);
      })
      .catch((err) => console.error("Carga inicial:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (txTiempoReal.length === 0) return;
    setTransacciones((prev) => {
      const ids = new Set(prev.map((t) => t.id));
      const nuevos = txTiempoReal.filter((t) => !ids.has(t.id));
      return [...nuevos, ...prev];
    });
  }, [txTiempoReal]);

  /* ------------- métricas derivadas MEMO ------------- */
  const { aprobCount, rechazCount, montoAprobado } = useMemo(() => {
    const aprobadas  = transacciones.filter((t) => t.aprobada);
    const rechazadas = transacciones.length - aprobadas.length;
    const monto      = aprobadas.reduce((sum, t) => sum + Number(t.monto || 0), 0);
    return { aprobCount: aprobadas.length, rechazCount: rechazadas, montoAprobado: monto };
  }, [transacciones]);

  /* -------------- helpers de formateo ---------------- */
  const formatCOP = (val) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);

  const formatFecha = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    const fecha = d.toLocaleDateString("es-CO", { day: "2-digit", month: "2-digit", year: "numeric" });
    const hora  = d.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
    return `${fecha} ${hora}`;
  };

  /* --------------------- UI -------------------------- */
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

        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Principal</h1>
              <p className="text-gray-600 mt-1">
                Resumen general del sistema bancario
              </p>
            </div>

            {/* indicador de conexión WS */}
            <div className={`w-16 h-16 flex items-center justify-center rounded-full ${conectado ? "bg-green-100" : "bg-red-100"}`}>
              <svg
                className={`w-8 h-8 ${conectado ? "text-green-700" : "text-red-700"}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {conectado ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                )}
              </svg>
            </div>
          </div>
        </div>

        {/* Cards resumen */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <ResumenCard label="Cuentas Activas" value={cuentasCount} icon="users" color="blue" />
          <ResumenCard label="Tx Aprobadas"   value={aprobCount}   icon="check" color="green" />
          <ResumenCard label="Tx Rechazadas"  value={rechazCount}  icon="x"     color="red" />
          <ResumenCard label="Monto Aprobado" value={formatCOP(montoAprobado)} icon="currency" color="purple" />
        </div>

        {/* Historial transacciones */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Historial de Transacciones</h2>
              <p className="text-gray-600 mt-1">
                Registro completo de todas las operaciones
              </p>
            </div>
            <div className="text-sm text-gray-500">Total: {transacciones.length}</div>
          </div>

          {transacciones.length === 0 ? (
            <SinTransacciones />
          ) : (
            <div className="p-6">
              <div className="space-y-4">
                {transacciones.map((t) => (
                  <TransaccionCard key={t.id} tx={t} formatCOP={formatCOP} formatFecha={formatFecha} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ====== Sub-componentes ====== */

function ResumenCard({ label, value, icon, color }) {
  const iconProps = { className: "w-8 h-8 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" };
  const icons = {
    users:    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />,
    check:    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
    x:        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />,
    currency: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
  };
  const colorClass = {
    blue: "bg-blue-600 hover:bg-blue-700",
    green: "bg-green-600 hover:bg-green-700",
    red: "bg-red-600 hover:bg-red-700",
    purple: "bg-purple-600 hover:bg-purple-700",
  }[color] || "bg-gray-600 hover:bg-gray-700";

  return (
    <div className={`${colorClass} text-white rounded-xl p-6 shadow-lg transition transform duration-200 hover:shadow-xl hover:scale-105`}>
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
          <svg {...iconProps}>{icons[icon]}</svg>
        </div>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      <p className="text-white/90 font-medium">{label}</p>
    </div>
  );
}

function TransaccionCard({ tx, formatCOP, formatFecha }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-200 hover:border-gray-300">
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 flex items-center justify-center rounded-full ${tx.aprobada ? "bg-green-100" : "bg-red-100"}`}>
          {tx.aprobada ? (
            <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-lg font-semibold text-gray-900">Cliente: {tx.clienteCedula}</h3>
            <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${tx.aprobada ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
              {tx.aprobada ? "APROBADA" : "RECHAZADA"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Monto</p>
              <p className="text-xl font-bold text-gray-900">{formatCOP(tx.monto)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Fecha y Hora</p>
              <p className="text-sm text-gray-900">{formatFecha(tx.fecha)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">ID Transacción</p>
              <p className="font-mono text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded inline-block">{tx.id.slice(0, 8)}…</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SinTransacciones() {
  return (
    <div className="p-12 text-center">
      <div className="w-16 h-16 mx-auto mb-6 bg-gray-100 flex items-center justify-center rounded-full">
        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin transacciones registradas</h3>
      <p className="text-gray-600">Las transacciones aparecerán aquí cuando se realicen operaciones</p>
    </div>
  );
}
