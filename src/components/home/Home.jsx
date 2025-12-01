import React, { useState } from "react";
import "./Home.css";
import Rotas from "../Rotas/Rotas";
import Sidebar from "../sidebar/Sidebar";

import bmw from "../../assets/bmw.png";
import honda from "../../assets/honda.png";
import kawasakiLogo from "../../assets/kawasakiLogo.png";
import musashiLogo from "../../assets/musashiLogo.png";
import triumph from "../../assets/triumph.png";
import gktb from "../../assets/gktb.png";
import logo2 from "../../assets/logo2.png";
import { FaBook, FaStar, FaCodeBranch } from "react-icons/fa";
import { Link } from "react-router-dom";

function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true); // ✅ controla abrir/fechar

  return (
    <div className="home-layout">
      {/* Sidebar fixa à esquerda */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Conteúdo principal */}
      <div className={`home-container ${sidebarOpen ? "with-sidebar" : "full"}`}>

        {/* HERO */}
        <section className="hero">
          <div className="hero-content">
            <h1>Bem-vindo</h1>
            <p>Gerencie e organize seus afazeres de forma simples e eficiente.</p>
          </div>
          <img src={logo2} alt="Logo Amemiya" className="sidebar-logo" />
        </section>

        {/* CARDS */}
        <section className="cards-section">
          <h2>Funções</h2>
          <div className="cards-container">
            <Link to="/dashboard" className="card">
              <FaStar className="card-icon" />
              <h3>Dashboard</h3>
              <p>Acompanhe os principais indicadores em tempo real.</p>
            </Link>

            <Link to="/rotas" className="card">
              <FaStar className="card-icon" />
              <h3>Rotas</h3>
              <p>Organize e visualize todas as rotas de forma otimizada.</p>
            </Link>

            <Link to="/Veiculos" className="card">
              <FaCodeBranch className="card-icon" />
              <h3>Gerenciamento de Veículos</h3>
              <p>Controle frota, manutenção e disponibilidade facilmente.</p>
            </Link>
          </div>
        </section>

        {/* CTA (ADIÇÃO 3) */}
        <section className="cta-section">
          <div className="cta-box">
            <h2>Pronto para começar?</h2>
            <p>Acesse o dashboard e veja tudo funcionando em tempo real.</p>
            <Link to="/dashboard" className="cta-button">
              Ir para o Dashboard
            </Link>
          </div>
        </section>

        {/* CLIENTES */}
        <section className="clients-section">
          <h2>Nossos Clientes</h2>
          <div className="clients-slider">
            <div className="clients-track">
              <img src={bmw} alt="BMW" />
              <img src={honda} alt="Honda" />
              <img src={kawasakiLogo} alt="Kawasaki" />
              <img src={musashiLogo} alt="Musashi" />
              <img src={triumph} alt="Triumph" />
              <img src={gktb} alt="GKTBR" />

              <img src={bmw} alt="BMW" />
              <img src={honda} alt="Honda" />
              <img src={kawasakiLogo} alt="Kawasaki" />
              <img src={musashiLogo} alt="Musashi" />
              <img src={triumph} alt="Triumph" />
              <img src={gktb} alt="GKTBR" />

              <img src={bmw} alt="BMW" />
              <img src={honda} alt="Honda" />
              <img src={kawasakiLogo} alt="Kawasaki" />
              <img src={musashiLogo} alt="Musashi" />
              <img src={triumph} alt="Triumph" />
              <img src={gktb} alt="GKTBR" />

              <img src={bmw} alt="BMW" />
              <img src={honda} alt="Honda" />
              <img src={kawasakiLogo} alt="Kawasaki" />
              <img src={musashiLogo} alt="Musashi" />
              <img src={triumph} alt="Triumph" />
              <img src={gktb} alt="GKTBR" />
            </div>
          </div>
        </section>
      </div>

    </div>
  );
}

export default Home;
