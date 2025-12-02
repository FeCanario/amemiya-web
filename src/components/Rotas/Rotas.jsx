import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Rotas.css";
import { motion } from "framer-motion";

const userId = localStorage.getItem("userId");


const Rotas = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [usuarios, setUsuarios] = useState([]);
  const [geoPoints, setGeoPoints] = useState([]);

  const [novoPoint, setNovoPoint] = useState({
    label: "",
    latitude: "",
    longitude: "",
    type: "destiny",
    city: "",
    state: "",
    country: "Brazil",
    district: "",

  });

  const COMPANY_ID = 1;
  const basePos = [-23.55052, -46.633308];

  const icon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/252/252025.png",
    iconSize: [30, 30],
  });

  // ================= API USUÁRIOS =================
  const fetchUsuarios = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/user/${COMPANY_ID}`);
      const data = await response.json();
      setUsuarios(Array.isArray(data.data) ? data.data : [data.data]);
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
      setUsuarios([]);
    }
  };

  // ================= API GEOPOINTS =================
  const fetchGeoPoints = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/geopoint/${COMPANY_ID}`);
      const data = await response.json();
      const allPoints = [...(data.origin || []), ...(data.destiny || [])].map(p => ({
        ...p,
        latitude: Number(p.latitude),
        longitude: Number(p.longitude),
        city: p.city || "",
        state: p.state || "",
        country: p.country || "Brazil"
      }));
      setGeoPoints(allPoints);
    } catch (err) {
      console.error("Erro ao buscar geopoints:", err);
    }
  };

  // ================= HANDLERS DO FORM =================
  const handleChange = (e) => {
    setNovoPoint({ ...novoPoint, [e.target.name]: e.target.value });
  };

  const addGeoPoint = async () => {
    try {
      const payload = {
        label: novoPoint.label,
        latitude: Number(novoPoint.latitude),
        longitude: Number(novoPoint.longitude),
        geopoint_type: novoPoint.type,
        city: novoPoint.city,
        state: novoPoint.state,
        country: novoPoint.country,
        district: novoPoint.district || "",
        user_id: userId
      };

      const response = await fetch(`http://127.0.0.1:8000/geopoint/${COMPANY_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Erro ao adicionar geopoint");

      await response.json();
      await fetchGeoPoints();

      alert("Geopoint criado!");
    } catch (err) {
      console.error(err);
      alert("Erro ao criar geopoint");
    }
  };


  useEffect(() => {
    fetchUsuarios();
    fetchGeoPoints();
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <motion.div
        className={`dashboard-container ${sidebarOpen ? "with-sidebar" : "full"}`}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <h2 className="dashboard-title">Rotas</h2>

        {/* ================= MAPA ================= */}
        <motion.div
          className="rotas-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="mapa-tecnicos dashboard-card">
            <h3 className="card-title">Mapa de Rotas</h3>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <MapContainer center={basePos} zoom={8} className="mapa" zoomControl={false}>
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker position={basePos}>
                  <Popup>
                    <strong>Base Central</strong> <br /> São Paulo
                  </Popup>
                </Marker>

                {geoPoints.map((point) => {
                  if (isNaN(point.latitude) || isNaN(point.longitude)) return null;

                  return (
                    <React.Fragment key={point.geopoint_id}>
                      <Marker position={[point.latitude, point.longitude]} icon={icon}>
                        <Popup>
                          <strong>{point.label}</strong>
                          <br />
                          {point.city || "—"}, {point.state || "—"}
                          <br />
                          {point.country || "—"}
                          <br />
                          Tipo: {point.type}
                        </Popup>
                      </Marker>

                      <Polyline
                        positions={[basePos, [point.latitude, point.longitude]]}
                        color={point.type === "origin" ? "green" : "red"}
                      />
                    </React.Fragment>
                  );
                })}
              </MapContainer>
            </motion.div>
          </div>
        </motion.div>

        {/* ================= FORM GEOPOINT ================= */}
        <motion.div
          className="dashboard-card"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
        >
          <h3 className="card-title">Adicionar Geopoint</h3>

          <div className="form-grid">
            <input type="text" name="label" placeholder="Nome / Label" value={novoPoint.label} onChange={handleChange} />
            <input type="number" name="latitude" placeholder="Latitude" value={novoPoint.latitude} onChange={handleChange} />
            <input type="number" name="longitude" placeholder="Longitude" value={novoPoint.longitude} onChange={handleChange} />
            <input type="text" name="district" placeholder="Bairro / Distrito" value={novoPoint.district} onChange={handleChange} />
            <input type="text" name="city" placeholder="Cidade" value={novoPoint.city} onChange={handleChange} />
            <input type="text" name="state" placeholder="Estado" value={novoPoint.state} onChange={handleChange} />
            <input type="text" name="country" placeholder="País" value={novoPoint.country} onChange={handleChange} />
            <select name="type" value={novoPoint.type} onChange={handleChange}>
              <option value="origin">Origem</option>
              <option value="destiny">Destino</option>
            </select>

            <button className="adicionar-btn" onClick={addGeoPoint}>Salvar Geopoint</button>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
};

export default Rotas;
