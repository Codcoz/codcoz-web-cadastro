import React from "react";
import logo from "../assets/logo.svg";
import "./Header.css";

const Header = ({ onLogoClick }) => {
  return (
    <header className="header">
      <div className="logo" onClick={onLogoClick} style={{ cursor: "pointer" }}>
        <img src={logo} alt="CodCoz logo" />
      </div>

      <nav>
        <button 
          className="login-button" 
          onClick={() => {
            console.log('Botão de login clicado!');
            window.location.href = 'https://codcoz-react.onrender.com/';
          }}
        >
          Login
        </button>
      </nav>
    </header>
  );
};

export default Header;
