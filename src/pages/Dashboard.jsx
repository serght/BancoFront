// src/pages/Dashboard.jsx

import { useEffect, useState } from "react";
import { getCuentas, getTransacciones } from "../api/admin";

export default function Dashboard() {
  const [cuentas, setCuentas] = useState(0);
  const [aprob, setAprob] = useState(0);
  const [rechaz, setRechaz] = useState(0);
  const [monto, setMonto] = useState(0);
  const [ultTx, setUltTx] = useState([]);

  useEffect(() => {
    document.title = "Dashboard";

    getCuentas().then((r) => setCuentas(r.data.length));

    getTransacciones().then((r) => {
      const tx = r.data;
      const ok = tx.filter((t) => t.estado === "APROBADA");
      const no = tx.filter((t) => t.estado === "RECHAZADA");

      setAprob(ok.length);
      setRechaz(no.length);
      setMonto(ok.reduce((s, t) => s + (Number(t.monto) || 0), 0));

      setUltTx(
        [...tx]
          .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
          .slice(0, 10)
      );
    });
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto p-8 space-y-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-blue-800">
          Bienvenido al Panel General
        </h1>
        <select className="px-3 py-2 rounded-md border border-gray-300">
          <option value="dashboard">Dashboard</option>
          <option value="cuentas">Cuentas</option>
          <option value="transacciones">Transacciones</option>
        </select>
      </header>

      {/* Cards */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card label="Cuentas" value={cuentas} />
        <Card label="Tx Aprobadas" value={aprob} />
        <Card label="Tx Rechazadas" value={rechaz} />
        <Card label="Monto Aprobado" value={`$${monto.toFixed(2)}`} />
      </section>

      {/* List */}
      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Últimas transacciones</h2>
        {ultTx.length === 0 ? (
          <p className="text-gray-500">Sin transacciones aún</p>
        ) : (
          <ul className="divide-y text-sm">
            {ultTx.map((t) => (
              <li key={t.id} className="py-2 flex justify-between">
                <span>{t.estado}</span>
                <span>${t.monto}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Card({ label, value }) {
  return (
    <div className="bg-blue-800 text-white rounded-lg p-6 shadow flex flex-col items-center">
      <span className="text-sm opacity-80">{label}</span>
      <span className="text-2xl font-bold mt-1">{value}</span>
    </div>
  );
}
