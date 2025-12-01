import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../sidebar/Sidebar";
import { Info, Trash2, UploadCloud } from "lucide-react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";
import "./Notas.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  Tooltip,
  Legend,
  PointElement
);

function Notas() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // -----------------------------------------------
  // API STATES
  // -----------------------------------------------
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("");
  const [attachmentType, setAttachmentType] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [progress, setProgress] = useState(0);

  const companyId = 10;
  const userId = 1;

  // -----------------------------------------------
  // GET ATTACHMENTS
  // -----------------------------------------------
  const loadAttachments = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/attachment/${companyId}`
      );

      if (res.data?.data) setAttachments(res.data.data);
      else setAttachments([]);
    } catch (err) {
      console.error("Erro ao buscar anexos:", err);
    }
  };

  useEffect(() => {
    loadAttachments();
  }, []);

  // -----------------------------------------------
  // POST UPLOAD
  // -----------------------------------------------
  const sendFile = async () => {
    if (!file) return alert("Selecione um arquivo!");

    const form = new FormData();
    form.append("file", file);
    form.append("file_type", fileType);
    form.append("attachment_type", attachmentType);
    form.append("user_id", userId);

    try {
      await axios.post(
        `http://localhost:8000/attachment/${companyId}`,
        form,
        {
          onUploadProgress: (e) =>
            setProgress(Math.round((e.loaded * 100) / e.total)),
        }
      );

      alert("Upload realizado!");
      setProgress(0);
      setFile(null);
      loadAttachments();
    } catch (err) {
      alert("Erro ao enviar arquivo");
      console.error(err);
    }
  };

  // -----------------------------------------------
  // DELETE ATTACHMENT
  // -----------------------------------------------
  const deleteAttachment = async (id) => {
    if (!confirm("Excluir este arquivo?")) return;

    try {
      await axios.delete(`http://localhost:8000/attachment/${id}`);
      loadAttachments();
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir");
    }
  };

  // -----------------------------------------------
  // GRÁFICO FIXO
  // -----------------------------------------------
  const fixedChart = {
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
    datasets: [
      {
        label: "Custos (R$)",
        data: [1200, 1500, 900, 1800, 1600, 2100],
        borderColor: "#4a90e2",
        backgroundColor: "rgba(74,144,226,0.25)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="dashboard-layout" style={{ background: "#ffffff" }}>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div
        className={`dashboard-container ${
          sidebarOpen ? "with-sidebar" : "full"
        }`}
      >
        <h2 className="dashboard-title">Notas Fiscais</h2>

        <div className="notas-ui-grid">

          {/* ------------------ UPLOAD CARD -------------------- */}
          <div className="dashboard-card">
            <h3 className="card-title">Enviar Arquivo</h3>

            <div className="upload-ui upload-section">

            {/* Caixa de upload */}
            <label className="upload-box enhanced-upload-box">
                <UploadCloud size={34} className="upload-icon" />
                <p className="upload-text">
                {file ? file.name : "Clique para selecionar um arquivo"}
                </p>

                <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                hidden
                />
            </label>

            {/* Selects */}
            <div className="upload-selects">
                <select
                className="select-ui improved-select"
                value={fileType}
                onChange={(e) => setFileType(e.target.value)}
                >
                <option value="">Tipo do arquivo</option>
                <option value="pdf">PDF</option>
                <option value="csv">CSV</option>
                <option value="img">Imagem</option>
                </select>

                <select
                className="select-ui improved-select"
                value={attachmentType}
                onChange={(e) => setAttachmentType(e.target.value)}
                >
                <option value="">Categoria</option>
                <option value="nota">Nota</option>
                <option value="relatorio">Relatório</option>
                <option value="doc">Documento</option>
                </select>
            </div>

            {/* Botão */}
            <button className="btn-primary upload-btn modern-upload-btn" onClick={sendFile}>
                Enviar Arquivo
            </button>

            {/* Barra de progresso */}
            {progress > 0 && (
                <div className="upload-progress">
                <div
                    className="upload-progress-bar"
                    style={{ width: `${progress}%` }}
                ></div>
                </div>
            )}
            </div>
          </div>

          {/* ------------------ GRÁFICO FIXO -------------------- */}
          <div className="dashboard-card main-cost-card">
            <div className="card-header">
              <h3 className="card-title">Custos </h3>
              <button className="btn-outline">
                <Info size={16} />
              </button>
            </div>

            <div className="valor">
              <h3>R$ 8.100,00</h3>
            </div>

            <div className="chart-wrapper">
              <Line
                data={fixedChart}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: true, position: "top" },
                    tooltip: { mode: "index", intersect: false },
                  },
                  scales: {
                    y: { beginAtZero: true },
                    x: { grid: { display: false } },
                  },
                }}
              />
            </div>
          </div>

          {/* ------------------ TABELA API -------------------- */}
          <div className="dashboard-card">
            <h3 className="card-title">Histórico</h3>

            <div className="table-wrapper">
              <table className="dashboard-table large-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tipo</th>
                    <th>Categoria</th>
                    <th>Data</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {attachments.length > 0 ? (
                    attachments.map((a) => (
                      <tr key={a.attachment_id}>
                        <td>{a.attachment_id}</td>
                        <td>{a.file_type}</td>
                        <td>{a.attachment_type}</td>
                        <td>{a.upload_date}</td>
                        <td>
                          <button
                            className="delete-btn"
                            onClick={() =>
                              deleteAttachment(a.attachment_id)
                            }
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5">Nenhum arquivo enviado.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Notas;
