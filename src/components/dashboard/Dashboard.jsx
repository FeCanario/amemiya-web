import React, { useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import { Info } from "lucide-react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";
import "./Dashboard.css";

ChartJS.register(
  ChartJS.defaults.responsive = true,
  ChartJS.defaults.maintainAspectRatio = false,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  Tooltip,
  Legend,
  PointElement
);

function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const tarefasData = {
    labels: ["01", "02", "03", "04", "05", "06", "07"],
    datasets: [
      { label: "Pendentes", data: [10, 8, 11, 7, 12, 13, 8], backgroundColor: "#111" },
      { label: "Realizadas", data: [6, 5, 9, 6, 10, 9, 5], backgroundColor: "#ccc" },
    ],
  };

  const quilometragemData = {
    labels: ["Manhã", "Tarde", "Noite"],
    datasets: [
      { data: [28, 40, 32], backgroundColor: ["#cececead", "#3f3f3fff", "#c9c9c9ff"] },
    ],
  };

  const tabelaData = [
    { id: 1, status: "Online", tempo: "0:12" },
    { id: 2, status: "Online", tempo: "1:33" },
    { id: 3, status: "Online", tempo: "0:39" },
  ];


  return (
    <div className="dashboard-layout">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className={`dashboard-container ${sidebarOpen ? "with-sidebar" : "full"}`}>
        <h2 className="dashboard-title">Dashboard</h2>

        <div className="dashboard-grid">
          {/* === TAREFAS (LARGA) === */}
          <div className="dashboard-card large">
            <div className="card-header">
              <div>
                <h3 className="card-title">Tarefas</h3>
                <p className="card-subinfo green">↑ 2.1% vs última semana</p>
                <p className="card-date">1–12 Dez, 2020</p>
              </div>
              <button className="btn-outline">Excel</button>
            </div>

            <div className="chart-wrapper bar-wrapper">
              <Bar
                data={tarefasData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: { y: { display: false }, x: { grid: { display: false } } },
                }}
              />
            </div>

            <div className="chart-legend">
              <span className="dot black" /> Pendentes
              <span className="dot gray" /> Realizadas
            </div>
          </div>

          {/* === QUILOMETRAGEM (PEQUENA) === */}
          <div className="dashboard-card small">
            <div className="card-header">
              <h3 className="card-title">Quilometragem</h3>
              <button className="btn-outline">
                <Info size={16} />
              </button>
            </div>

            <div className="chart-wrapper pie-wrapper">
              <Pie
                data={quilometragemData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                }}
              />
            </div>

            <div className="chart-legend">
              <span className="dot gray2" /> Tarde 40%
              <span className="dot dark" /> Noite 32%
              <span className="dot gray" /> Manhã 28%
            </div>
          </div> 

          {/* === TABELA DE TÉCNICOS === */}
          <div className="dashboard-card table-card">
            <h3 className="card-title">Equipe de Técnicos</h3>
            <div className="table-wrapper">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Cidade</th>
                    <th>Status</th>
                    <th>Tarefas</th>
                    <th>Tempo</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: 1, nome: "Tecnico 1 ", cidade: "São Paulo", status: "Ativo", tarefas: 12, tempo: "4h 32m" },
                    { id: 2, nome: "Tecnico 2", cidade: "Campinas", status: "Ativo", tarefas: 9, tempo: "3h 50m" },
                    { id: 3, nome: "Tecnico 3", cidade: "Santos", status: "Inativo", tarefas: 0, tempo: "—" },
                    { id: 4, nome: "Tecnico 4", cidade: "Guarulhos", status: "Ativo", tarefas: 14, tempo: "5h 15m" },
                    { id: 5, nome: "Tecnico 5", cidade: "Sorocaba", status: "Ativo", tarefas: 11, tempo: "4h 05m" },
                  ].map((tec) => (
                    <tr key={tec.id}>
                      <td>{tec.nome}</td>
                      <td>{tec.cidade}</td>
                      <td>
                        <span className={`status-badge ${tec.status === "Ativo" ? "green" : "red"}`}>
                          {tec.status}
                        </span>
                      </td>
                      <td>{tec.tarefas}</td>
                      <td>{tec.tempo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="spacer" />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
