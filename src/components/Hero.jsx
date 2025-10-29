import React from "react";
import appPreview from "../assets/app-preview.png";
import "./Hero.css";

const Hero = ({ onSignUpClick }) => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">CodCoz</h1>
        <p className="hero-subtitle">
          <span className="highlight">Menos digitação,</span> mais gestão
        </p>
        <button className="cta" onClick={onSignUpClick}>
          Cadastre sua empresa
        </button>
      </div>

      <div className="hero-image">
        <img src={appPreview} alt="App CodCoz" />
      </div>
    </section>
  );
};

export default Hero;
