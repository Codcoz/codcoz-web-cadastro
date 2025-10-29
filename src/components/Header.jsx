import React from "react";
import logo from "../assets/logo.svg";

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="CodCoz logo" />
      </div>

      <nav>
        <a href="#">Login</a>
        <span>|</span>
        <a href="#">Nossos contatos</a>
      </nav>
    </header>
  );
};

export default Header;
