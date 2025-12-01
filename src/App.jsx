import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useRef } from "react";

import Home from "./components/Home/Home";
import Login from "./components/login/Login";
import Dashboard from "./components/dashboard/Dashboard";
import Rotas from "./components/Rotas/Rotas";
import Conta from "./components/contas/Conta";
import Settings from "./components/settings/Settings";
import Veiculos from "./components/Veiculos/Veiculos";
import Notas from "./components/Notas/Notas";

import "./App.css";

function AnimatedRoutes() {
  const location = useLocation();

  const nodeRef = useRef(null);

  return (
    <TransitionGroup component={null}>
      <CSSTransition
        key={location.pathname}
        timeout={350}
        classNames="page"
        unmountOnExit
        nodeRef={nodeRef}   
      >
        <div ref={nodeRef} className="page-wrapper">
          <Routes location={location}>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/rotas" element={<Rotas />} />
            <Route path="/conta" element={<Conta />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/veiculos" element={<Veiculos />} />
            <Route path="/notas" element={<Notas />} />
          </Routes>
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
