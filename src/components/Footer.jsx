import React from "react";
import icon from "../assets/icon_azul.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-left">
        <div className="footer-logo">
          <img src={icon} alt="CodCoz icon" className="footer-icon" />
        </div>
        <p className="footer-slogan">Seu estoque digno de um chefe!</p>
      </div>

      <div className="footer-separator"></div>

      <div className="footer-right">
        <h4>CONTATOS</h4>
        <p>contato.codcoz@gmail.com</p>
        <p>@codcoz</p>
        <p>© 2025 Codcoz. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
