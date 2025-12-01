import React, { useState, useEffect } from "react";
import Sidebar from "../sidebar/Sidebar";
import "./Settings.css";

function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const userId = localStorage.getItem("userId");
  const companyId = localStorage.getItem("companyId");

  // Estado da imagem de perfil
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Estado de informações pessoais
  const [name, setName] = useState(localStorage.getItem("userName") || "");
  const [email, setEmail] = useState(localStorage.getItem("userEmail") || "");

  // --- BUSCA A FOTO ATUAL DO BACKEND ---
  const fetchUserProfilePicture = async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/user/${companyId}?user_id=${userId}`
      );
      const data = await res.json();

      if (data.profile_picture_data) {
        const base64Image = `data:image/png;base64,${data.profile_picture_data}`;
        setPreview(base64Image);
        localStorage.setItem("profile_picture_data", data.profile_picture_data);
      }
    } catch (err) {
      console.error("Erro ao buscar foto:", err);
    }
  };

  // Carrega a foto ao montar o componente
  useEffect(() => {
    const savedBase64 = localStorage.getItem("profile_picture_data");
    if (savedBase64) {
      setPreview(`data:image/png;base64,${savedBase64}`);
    } else {
      fetchUserProfilePicture();
    }
  }, []);

  // --- SELEÇÃO DE IMAGEM (pré-visualização imediata) ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result; // já vem em data:image/png;base64,...
      setPreview(base64);

      // Salva só a parte base64 no localStorage
      localStorage.setItem("profile_picture_data", base64.split(",")[1]);
    };
    reader.readAsDataURL(file);
  };
  
  // --- ENVIO DA IMAGEM PARA O BACKEND ---
  const uploadProfilePicture = async () => {
    if (!selectedFile) return alert("Selecione uma imagem!");

    const formData = new FormData();
    formData.append("company_id", companyId);
    formData.append("file_type", selectedFile.type);
    formData.append("file", selectedFile);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/user/profile_picture/${userId}`,
        { method: "PUT", body: formData }
      );

      if (response.status === 201) {
        alert("Foto atualizada com sucesso!");
        await fetchUserProfilePicture(); // atualiza a foto do estado
      } else {
        alert("Erro ao atualizar a foto.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro no servidor.");
    }
  };

  // --- SALVAR INFORMAÇÕES PESSOAIS ---
  const saveProfileInfo = async () => {
    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);
    alert("Informações salvas!");
  };

  return (
    <div className="settings-page">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className={`settings-content ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="settings-wrapper">

          <div className="settings-header">
            <h2>Configurações da Conta</h2>
            <p>Gerencie suas informações pessoais e sua foto de perfil.</p>
          </div>

          <div className="settings-grid">

            {/* CARD FOTO */}
            <div className="settings-card profile-card">
              <h3>Foto de Perfil</h3>
              <div className="avatar-box">
                <img
                  src={preview || "/placeholder-profile.png"}
                  alt="Avatar"
                  className="avatar-img"
                />
              </div>
              <label className="upload-btn">
                Selecionar nova foto
                <input type="file" accept="image/*" onChange={handleImageChange} />
              </label>
              <button className="btn-primary" onClick={uploadProfilePicture}>
                Atualizar Foto
              </button>
            </div>

            {/* CARD INFO */}
            <div className="settings-card info-card">
              <h3>Informações Pessoais</h3>
              <div className="input-group">
                <input
                  type="text"
                  className="input-modern"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <label>Nome Completo</label>
              </div>
              <div className="input-group">
                <input
                  type="email"
                  className="input-modern"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label>Email</label>
              </div>
              <button className="btn-primary" onClick={saveProfileInfo}>
                Salvar Alterações
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
