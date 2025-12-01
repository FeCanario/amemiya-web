import React from "react";
import "./Sidebar.css";
import logo from "../../assets/logo.png";
import {
  FiChevronLeft,
  FiChevronRight,
  FiHome,
  FiCompass,
  FiSettings,
  FiUser,
  FiMessageSquare,
  FiFileText,
  FiLogOut,
  FiBarChart,
  FiCalendar,
} from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom"; 

const userName = localStorage.getItem("userName") || "Usuário";
const userRole = localStorage.getItem("userRole") || "Cargo";
const userEmail = localStorage.getItem("userEmail") || "email@exemplo.com";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ pega a rota atual

  return (
    <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
      {/* Cabeçalho */}
      <div className="sidebar-header">
        <img src={logo} alt="Logo Amemiya" className="sidebar-logo" />
      </div>

      {/* Menu */}
      <div className="menu">
        <p className="menu-title">MENU</p>
        <ul>
          <li
            className={location.pathname === "/home" ? "active" : ""}
            onClick={() => navigate("/home")}
          >
            <FiHome className="icon" /> Home
          </li>
          <li
            className={location.pathname === "/dashboard" ? "active" : ""}
            onClick={() => navigate("/dashboard")}
          >
            <FiBarChart className="icon" /> Dashboard
          </li>
          <li
            className={location.pathname === "/rotas" ? "active" : ""}
            onClick={() => navigate("/rotas")}
          >
            <FiCompass className="icon" /> Rotas
          </li>
          <li
            className={location.pathname === "/veiculos" ? "active" : ""}
            onClick={() => navigate("/veiculos")}
          >
            <FiCalendar className="icon" /> Veículos
          </li>
          <li
            className={location.pathname === "/notas" ? "active" : ""}
            onClick={() => navigate("/notas")}
          >
            <FiFileText className="icon" /> Notas Fiscais
          </li>
        </ul>

        <p className="menu-title">OUTROS</p>
        <ul>
          <li
            className={location.pathname === "/settings" ? "active" : ""}
            onClick={() => navigate("/settings")}
          >
            <FiSettings className="icon" /> Configurações
          </li>
          <li
            className={location.pathname === "/conta" ? "active" : ""}
            onClick={() => navigate("/conta")}
          >
            <FiUser className="icon" /> Contas
          </li>
          <li
            onClick={() => window.open("https://wa.me/5511951789859?text=Olá%2C+preciso+de+suporte", "_blank")}
          >
            <FiMessageSquare className="icon" /> Suporte
          </li>
        </ul>
      </div>

      <div className="user-info-box">
        <div className="user-avatar">
          {localStorage.getItem("profile_picture_data") ? (
            <img
              src={`data:image/png;base64,${localStorage.getItem("profile_picture_data")}`}
              alt="Avatar"
              className="avatar-img"
            />
          ) : (
            userName.charAt(0)
          )}
        </div>
        <div className="user-info">
          <p className="user-name">{userName}</p>
          <p className="user-email">{userEmail}</p>
        </div>
      </div>

      <button className="logout-btn" onClick={() => navigate("/")}>
        <FiLogOut className="icon" /> Sair
      </button>

      <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
        {sidebarOpen ? <FiChevronLeft /> : <FiChevronRight />}
      </button>
    </div>
  );
}

export default Sidebar;
