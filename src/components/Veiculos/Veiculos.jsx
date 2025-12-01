import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import "./Veiculos.css";

function Veiculos() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [vehicles, setVehicles] = useState([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [newVehicle, setNewVehicle] = useState({
    vehicle_name: "",
    license_plate: "",
    brand: "",
    model: "",
    year: "",
  });

  const [editVehicle, setEditVehicle] = useState({
    vehicle_id: "",
    vehicle_name: "",
    license_plate: "",
    brand: "",
    model: "",
    year: "",
  });

  const companyId = localStorage.getItem("companyId");

  // -------- FETCH VEHICLES --------
  const fetchVehicles = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/vehicle/${companyId}`);
      if (res.status === 204) {
        setVehicles([]);
        return;
      }
      const data = await res.json();
      setVehicles(data.data || []);
    } catch (error) {
      console.error("Erro ao carregar veículos:", error);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // -------- ADD VEHICLE --------
  const handleAddVehicle = async () => {
    const payload = { ...newVehicle, year: Number(newVehicle.year) };

    try {
      const res = await fetch(`http://127.0.0.1:8000/vehicle/${companyId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 201) {
        alert("Veículo adicionado!");
        setShowAddModal(false);
        fetchVehicles();
      } else {
        alert("Erro ao adicionar veículo.");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // -------- UPDATE VEHICLE --------
  const handleUpdateVehicle = async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/vehicle/${editVehicle.vehicle_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editVehicle),
        }
      );

      if (res.status === 204) {
        alert("Veículo atualizado!");
        setShowEditModal(false);
        fetchVehicles();
      } else {
        alert("Erro ao atualizar veículo.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // -------- DELETE VEHICLE --------
  const handleDeleteVehicle = async (vehicle_id) => {
    if (!window.confirm("Deseja remover este veículo?")) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/vehicle/${vehicle_id}`, {
        method: "DELETE",
      });

      if (res.status === 204) {
        fetchVehicles();
      } else {
        alert("Erro ao deletar veículo.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-container">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className={`page-content ${sidebarOpen ? "sidebar-open" : ""}`}>
        {/* ------- BANNER UI CLEAN ------- */}
        <div className="vehicles-banner ui">
          <div className="banner-content">
            <h1 className="banner-title">Gestão de Veículos</h1>
            <p className="banner-subtitle">
              Organize, controle e acompanhe sua frota
            </p>
          </div>

          <img
            src="https://cdn-icons-png.flaticon.com/512/743/743126.png"
            alt="Ilustração de veículo"
            className="banner-illustration"
          />
        </div>

        {/* WRAPPER CENTRALIZADO */}
        <div className="page-inner">
          {/* HEADER */}
          <div className="page-header">
            <button className="btn-primary" onClick={() => setShowAddModal(true)}>
              + Adicionar Veículo
            </button>
          </div>

          {/* TABELA UI ATUALIZADA */}
          <div className="vehicle-table ui-table-wrapper">
            <table className="ui-table">
              <thead>
                <tr>
                  <th>Veículo</th>
                  <th>Placa</th>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Ano</th>
                  <th>Status</th>
                  <th>Último motorista</th>
                  <th>Último Uso</th>
                  <th>Ações</th>
                </tr>
              </thead>

              <tbody>
                {vehicles.map((v) => (
                  <tr className="ui-row" key={v.vehicle_id}>
                    <td>{v.vehicle_name}</td>
                    <td>{v.license_plate}</td>
                    <td>{v.brand}</td>
                    <td>{v.model}</td>
                    <td>{v.year}</td>

                    {/* status */}
                    <td>
                      <span
                        className={`status-badge ${
                          v.active_vehicle ? "status-ok" : "status-off"
                        }`}
                      >
                        {v.active_vehicle ? "Ativo" : "Inativo"}
                      </span>
                    </td>

                    <td>{v.last_user_name}</td>

                    {/* último uso */}
                    <td>
                      {v.last_used
                        ? new Date(v.last_used).toLocaleDateString()
                        : "—"}
                    </td>

                    {/* actions */}
                    <td>
                      <div className="ui-actions">
                        <button
                          className="ui-btn edit"
                          onClick={() => {
                            setEditVehicle(v);
                            setShowEditModal(true);
                          }}
                        >
                          Editar
                        </button>

                        <button
                          className="ui-btn delete"
                          onClick={() => handleDeleteVehicle(v.vehicle_id)}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>

      {/* -------- MODAL ADD -------- */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="tittle">Adicionar Veículo</h3>

            <input type="text" placeholder="Nome"
              onChange={(e) => setNewVehicle({ ...newVehicle, vehicle_name: e.target.value })} />

            <input type="text" placeholder="Placa"
              onChange={(e) => setNewVehicle({ ...newVehicle, license_plate: e.target.value })} />

            <input type="text" placeholder="Marca"
              onChange={(e) => setNewVehicle({ ...newVehicle, brand: e.target.value })} />

            <input type="text" placeholder="Modelo"
              onChange={(e) => setNewVehicle({ ...newVehicle, model: e.target.value })} />

            <input type="number" placeholder="Ano"
              onChange={(e) => setNewVehicle({ ...newVehicle, year: e.target.value })} />

            <div className="modal-actions">
              <button className="btn-primary" onClick={handleAddVehicle}>Salvar</button>
              <button className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* -------- MODAL EDIT -------- */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="tittle">Editar Veículo</h3>

            <input type="text" value={editVehicle.vehicle_name}
              onChange={(e) => setEditVehicle({ ...editVehicle, vehicle_name: e.target.value })} />

            <input type="text" value={editVehicle.license_plate}
              onChange={(e) => setEditVehicle({ ...editVehicle, license_plate: e.target.value })} />

            <input type="text" value={editVehicle.brand}
              onChange={(e) => setEditVehicle({ ...editVehicle, brand: e.target.value })} />

            <input type="text" value={editVehicle.model}
              onChange={(e) => setEditVehicle({ ...editVehicle, model: e.target.value })} />

            <input type="number" value={editVehicle.year}
              onChange={(e) => setEditVehicle({ ...editVehicle, year: e.target.value })} />

            <div className="modal-actions">
              <button className="btn-primary" onClick={handleUpdateVehicle}>Salvar</button>
              <button className="btn-secondary" onClick={() => setShowEditModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Veiculos;
