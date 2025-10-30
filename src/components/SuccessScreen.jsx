import React from "react";
import logo from "../assets/logo.svg";
import "./SignUp.css";
import "./SuccessScreen.css";

const SuccessScreen = ({ onLogin }) => {
  return (
    <div className="signup-container">
      <div className="signup-sidebar">
        <div className="sidebar-logo">
          <img src={logo} alt="Logo CodCoz" />
        </div>
      </div>

      <div className="signup-card">
        <div className="signup-title-container">
          <h2 className="signup-title">Cadastro</h2>
        </div>

        <div className="progress-indicator">
          <div className="progress-step active">
            <div className="step-circle">1</div>
            <span className="step-label">Empresa</span>
          </div>
          <div className="progress-line" />
          <div className="progress-step active">
            <div className="step-circle">2</div>
            <span className="step-label">Gestor</span>
          </div>
        </div>

        <div className="success-content">
          <div className="success-icon">
            <svg
              width="80"
              height="80"
              viewBox="0 0 80 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="40" cy="40" r="40" fill="#27AE60" />
              <path
                d="M25 40L35 50L55 30"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h3 className="success-message">Cadastro realizado com sucesso!</h3>

          <button className="signup-button" type="button" onClick={onLogin}>
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessScreen;
