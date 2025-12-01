import React, { useEffect, useState } from "react";
import Sidebar from "../sidebar/Sidebar";
import "./Conta.css";

function Conta() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editData, setEditData] = useState({ user_name: "", email: "", telephone: "" });

  const companyId = 1;
  const roleId = 1;

  const fetchUsers = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/user/${companyId}`);
      if (response.status === 204) {
        setUsers([]);
        return;
      }
      const json_data = await response.json();
      const data = json_data.data;
      if (response.ok) {
        console.log("Fetched users:", data);
        setUsers(Array.isArray(data) ? data : [data]);
      } else {
        alert("Erro ao carregar usuários!");
      }
    } catch (err) {
      console.error(err);
      alert("Não foi possível conectar ao servidor.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ===== Registrar novo usuário =====
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      user_name: name,
      inner_register: "0001",
      password,
      email,
      telephone,
      role_id: roleId,
      admin: false,
      company_id: companyId,
      active_user: true,
    };

    try {
      const res = await fetch(`http://127.0.0.1:8000/user/${companyId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(await res.text());

      alert("Usuário registrado com sucesso!");
      setName(""); setEmail(""); setTelephone(""); setPassword("");
      fetchUsers();
    } catch (err) {
      console.error("Erro:", err);
      alert("Erro ao registrar o usuário.");
    } finally {
      setLoading(false);
    }
  };

  // ===== Excluir usuário =====
  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este usuário?")) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/user/${id}`, { method: "DELETE" });
      if (res.ok) {
        setUsers(users.filter((u) => u.user_id !== id));
      } else {
        alert("Erro ao excluir usuário.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ===== Editar usuário =====
  const handleEdit = (user) => {
    setEditingUser(user);
    setEditData({
      user_name: user.user_name,
      email: user.email,
      telephone: user.telephone,
    });
  };

  const handleSaveEdit = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/user/${editingUser.user_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editData),
      });

      if (res.ok) {
        alert("Usuário atualizado com sucesso!");
        setEditingUser(null);
        fetchUsers();
      } else {
        alert("Erro ao salvar alterações.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={`conta-page ${sidebarOpen ? "with-sidebar" : "full"}`}>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="conta-content">
        <header className="conta-header">
          <h1>Gerenciamento de Usuários</h1>
          <p>Visualize, adicione e gerencie os usuários da empresa</p>
        </header>

        <section className="users-section">
          <div className="users-card">
            <h2>Usuários Cadastrados</h2>
            <div className="table-wrapper">
              <table className="users-table">
                <thead>
                  <tr className="table-header">
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Telefone</th>
                    <th>Função</th>
                    <th>Admin</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map((u) => (
                      console.log("Rendering user:", u),
                      <tr key={u.user_id}>
                        <td>{u.user_id}</td>
                        <td>{u.user_name}</td>
                        <td>{u.email}</td>
                        <td>{u.telephone}</td>
                        <td>{u.role_name || "—"}</td>
                        <td>{u.admin ? "Sim" : "Não"}</td>
                        <td className="actions">
                          <button className="edit-btn" onClick={() => handleEdit(u)}>✏️</button>
                          <button className="delete-btn" onClick={() => handleDelete(u.user_id)}>🗑️</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="empty-row">
                        Nenhum usuário encontrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="register-card">
            <h2>Registrar Novo Usuário</h2>
            <form onSubmit={handleRegister} className="register-form">
              <div className="form-row">
                <input type="text" placeholder="Nome completo" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className="form-row">
                <input type="text" placeholder="Telefone" value={telephone} onChange={(e) => setTelephone(e.target.value)} required />
                <input type="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>

              <button type="submit" disabled={loading}>
                {loading ? "Registrando..." : "Registrar Usuário"}
              </button>
            </form>
          </div>
        </section>
      </div>

    {editingUser && (
      <div className="modal-overlay" onClick={() => setEditingUser(null)}>
        <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
          <button className="close-modal" onClick={() => setEditingUser(null)}>×</button>
          <h3>Editar Usuário</h3>
          <input
            type="text"
            value={editData.user_name}
            onChange={(e) => setEditData({ ...editData, user_name: e.target.value })}
            placeholder="Nome completo"
          />
          <input
            type="email"
            value={editData.email}
            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
            placeholder="Email"
          />
          <input
            type="text"
            value={editData.telephone}
            onChange={(e) => setEditData({ ...editData, telephone: e.target.value })}
            placeholder="Telefone"
          />

          <div className="modal-buttons">
            <button className="save-btn" onClick={handleSaveEdit}>Salvar Alterações</button>
            <button className="cancel-btn" onClick={() => setEditingUser(null)}>Cancelar</button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
}

export default Conta;
