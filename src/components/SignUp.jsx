import React, { useState } from "react";
import logo from "../assets/logo.svg";
import "./SignUp.css";
import SuccessScreen from "./SuccessScreen";

const SignUp = ({ onBack, onLogoClick }) => {
  const [currentStep, setCurrentStep] = useState(1);

  // Função para aplicar máscara de CNPJ
  const applyCnpjMask = (value) => {
    // Remove tudo que não é dígito
    const numbers = value.replace(/\D/g, "");
    // Aplica a máscara XX.XXX.XXX/XXXX-XX
    if (numbers.length <= 14) {
      if (numbers.length <= 2) {
        return numbers;
      } else if (numbers.length <= 5) {
        return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
      } else if (numbers.length <= 8) {
        return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(
          5
        )}`;
      } else if (numbers.length <= 12) {
        return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(
          5,
          8
        )}/${numbers.slice(8)}`;
      } else {
        return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(
          5,
          8
        )}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`;
      }
    }
    return value;
  };

  // Função para validar email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Função para validar CNPJ (14 dígitos)
  const validateCnpj = (cnpj) => {
    const numbers = cnpj.replace(/\D/g, "");
    return numbers.length === 14;
  };

  // Dados da empresa
  const [empresaData, setEmpresaData] = useState({
    nome: "",
    cnpj: "",
    capacidade: "",
    sigla: "",
    email: "",
  });

  // Dados do gestor
  const [gestorData, setGestorData] = useState({
    nome: "",
    sobrenome: "",
    email: "",
    genero: "",
  });

  // Erros de validação
  const [empresaErrors, setEmpresaErrors] = useState({});
  const [gestorErrors, setGestorErrors] = useState({});

  // Estados para API
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const [showSuccess, setShowSuccess] = useState(false);

  const handleEmpresaChange = (e) => {
    const { id, value } = e.target;
    let processedValue = value;

    // Aplica máscara de CNPJ
    if (id === "cnpj") {
      processedValue = applyCnpjMask(value);
    }

    setEmpresaData((prev) => ({ ...prev, [id]: processedValue }));
    // Remove o erro quando o usuário começa a digitar
    if (empresaErrors[id]) {
      setEmpresaErrors((prev) => ({ ...prev, [id]: "" }));
    }
  };

  const handleGestorChange = (e) => {
    const { id, value } = e.target;
    // Mapeia IDs do gestor
    const fieldName = id.replace("gestor-", "");
    setGestorData((prev) => ({ ...prev, [fieldName]: value }));
    // Remove o erro quando o usuário começa a digitar
    if (gestorErrors[fieldName]) {
      setGestorErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }
  };

  const handleGeneroChange = (e) => {
    setGestorData((prev) => ({ ...prev, genero: e.target.value }));
    if (gestorErrors.genero) {
      setGestorErrors((prev) => ({ ...prev, genero: "" }));
    }
  };

  const validateEmpresaFields = () => {
    const errors = {};
    let isValid = true;

    if (!empresaData.nome.trim()) {
      errors.nome = "Este campo é obrigatório";
      isValid = false;
    }
    if (!empresaData.cnpj.trim()) {
      errors.cnpj = "Este campo é obrigatório";
      isValid = false;
    } else if (!validateCnpj(empresaData.cnpj)) {
      errors.cnpj = "CNPJ deve conter 14 dígitos";
      isValid = false;
    }
    if (!empresaData.capacidade.trim()) {
      errors.capacidade = "Este campo é obrigatório";
      isValid = false;
    }
    if (!empresaData.sigla.trim()) {
      errors.sigla = "Este campo é obrigatório";
      isValid = false;
    }
    if (!empresaData.email.trim()) {
      errors.email = "Este campo é obrigatório";
      isValid = false;
    } else if (!validateEmail(empresaData.email)) {
      errors.email = "Email inválido";
      isValid = false;
    }

    setEmpresaErrors(errors);
    return isValid;
  };

  const validateGestorFields = () => {
    const errors = {};
    let isValid = true;

    if (!gestorData.nome.trim()) {
      errors.nome = "Este campo é obrigatório";
      isValid = false;
    }
    if (!gestorData.sobrenome.trim()) {
      errors.sobrenome = "Este campo é obrigatório";
      isValid = false;
    }
    if (!gestorData.email.trim()) {
      errors.email = "Este campo é obrigatório";
      isValid = false;
    } else if (!validateEmail(gestorData.email)) {
      errors.email = "Email inválido";
      isValid = false;
    }
    if (!gestorData.genero.trim()) {
      errors.genero = "Este campo é obrigatório";
      isValid = false;
    }

    setGestorErrors(errors);
    return isValid;
  };

  // Função para obter a data atual no formato YYYY-MM-DD
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // criar empresa
  const criarEmpresa = async () => {
    const cnpjNumbers = empresaData.cnpj.replace(/\D/g, "");

    const empresaPayload = {
      cnpj: cnpjNumbers,
      nome: empresaData.nome,
      sigla: empresaData.sigla,
      email: empresaData.email,
      status: "ATIVO",
      capacidadeEstoque: parseInt(empresaData.capacidade, 10),
    };

    const response = await fetch("/api/empresa/inserir", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(empresaPayload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Erro ao criar empresa: ${response.status}`
      );
    }

    return true;
  };

  // Função para buscar empresa pelo CNPJ
  const buscarEmpresaPorCnpj = async (cnpj) => {
    const cnpjNumbers = cnpj.replace(/\D/g, "");

    const response = await fetch(`/api/empresa/buscar/${cnpjNumbers}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Erro ao buscar empresa: ${response.status}`
      );
    }

    const data = await response.json();
    return data.id;
  };

  // criar gestor
  const criarGestor = async (empresaId) => {
    const funcionarioPayload = {
      empresaId: empresaId,
      funcaoId: 2,
      nome: gestorData.nome,
      sobrenome: gestorData.sobrenome,
      status: "ATIVO",
      email: gestorData.email,
      dataContratacao: getCurrentDate(),
    };

    const response = await fetch("/api/funcionario/inserir", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(funcionarioPayload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Erro ao criar gestor: ${response.status}`
      );
    }

    return true;
  };

  const handleAvançar = () => {
    if (validateEmpresaFields()) {
      setCurrentStep(2);
    }
  };

  const handleVoltar = () => {
    setApiError(""); // Limpa erros ao voltar
    if (currentStep === 2) {
      // Se estiver na tela do gestor, volta para a tela da empresa
      setCurrentStep(1);
    } else {
      // Se estiver na tela da empresa, volta para a tela inicial
      onBack();
    }
  };

  const handleSuccessBack = () => {
    // Volta para a tela inicial e limpa os dados
    setEmpresaData({
      nome: "",
      cnpj: "",
      capacidade: "",
      sigla: "",
      email: "",
    });
    setGestorData({
      nome: "",
      sobrenome: "",
      email: "",
      genero: "",
    });
    setCurrentStep(1);
    setShowSuccess(false);
    onBack();
  };

  const handleSuccessLogin = () => {
    // Aqui você pode implementar a navegação para a tela de login
    // Por enquanto, vou apenas limpar os dados e voltar
    handleSuccessBack();
  };

  const handleConcluir = async () => {
    // Valida os campos da empresa e do gestor
    if (!validateEmpresaFields() || !validateGestorFields()) {
      return;
    }

    setIsLoading(true);
    setApiError("");

    try {
      // 1. Cria a empresa
      console.log("Criando empresa...");
      await criarEmpresa();
      console.log("Empresa criada com sucesso!");

      // 2. Busca a empresa pelo CNPJ para obter o ID
      console.log("Buscando empresa pelo CNPJ...");
      const empresaId = await buscarEmpresaPorCnpj(empresaData.cnpj);
      console.log("Empresa encontrada com ID:", empresaId);

      // 3. Cria o gestor usando o empresaId obtido
      console.log("Criando gestor...");
      await criarGestor(empresaId);
      console.log("Gestor criado com sucesso!");

      // Mostra a tela de sucesso
      setShowSuccess(true);
    } catch (error) {
      setApiError(error.message || "Erro no cadastro. Tente novamente.");
      console.error("Erro no cadastro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Se estiver mostrando a tela de sucesso, renderiza ela
  if (showSuccess) {
    return (
      <SuccessScreen onLogin={handleSuccessLogin} onBack={handleSuccessBack} />
    );
  }

  return (
    <div className="signup-container">
      <div className="signup-sidebar">
        <div
          className="sidebar-logo"
          onClick={onLogoClick}
          style={{ cursor: "pointer" }}
        >
          <img src={logo} alt="Logo CodCoz" />
        </div>
      </div>

      <div className="signup-card">
        <div className="signup-title-container">
          <button
            className="back-button-title"
            onClick={handleVoltar}
            type="button"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="#0f1829"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <h2 className="signup-title">Cadastro</h2>
        </div>
        <div className="progress-indicator">
          <div className={`progress-step ${currentStep >= 1 ? "active" : ""}`}>
            <div className="step-circle">1</div>
            <span className="step-label">Empresa</span>
          </div>
          <div className="progress-line" />
          <div className={`progress-step ${currentStep >= 2 ? "active" : ""}`}>
            <div className="step-circle">2</div>
            <span className="step-label">Gestor</span>
          </div>
        </div>

        {currentStep === 1 ? (
          <div className="signup-form">
            <h3 className="form-title">Dados da empresa</h3>
            <div className="form-grid">
              <div className="form-column">
                <div className="form-field">
                  <label htmlFor="nome">Nome</label>
                  <input
                    type="text"
                    id="nome"
                    value={empresaData.nome}
                    onChange={handleEmpresaChange}
                    placeholder="Exemplo: Codcoz"
                    className={empresaErrors.nome ? "error-input" : ""}
                  />
                  {empresaErrors.nome && (
                    <span className="error-message">{empresaErrors.nome}</span>
                  )}
                </div>
                <div className="form-field">
                  <label htmlFor="cnpj">CNPJ</label>
                  <input
                    type="text"
                    id="cnpj"
                    value={empresaData.cnpj}
                    onChange={handleEmpresaChange}
                    placeholder="00.000.000/0000-00"
                    maxLength={18}
                    className={empresaErrors.cnpj ? "error-input" : ""}
                  />
                  {empresaErrors.cnpj && (
                    <span className="error-message">{empresaErrors.cnpj}</span>
                  )}
                </div>
                <div className="form-field">
                  <label htmlFor="capacidade">Capacidade máxima de itens</label>
                  <input
                    type="text"
                    id="capacidade"
                    value={empresaData.capacidade}
                    onChange={handleEmpresaChange}
                    placeholder="Exemplo: 500"
                    className={empresaErrors.capacidade ? "error-input" : ""}
                  />
                  {empresaErrors.capacidade && (
                    <span className="error-message">
                      {empresaErrors.capacidade}
                    </span>
                  )}
                </div>
              </div>
              <div className="form-column">
                <div className="form-field">
                  <label htmlFor="sigla">Sigla</label>
                  <input
                    type="text"
                    id="sigla"
                    value={empresaData.sigla}
                    onChange={handleEmpresaChange}
                    placeholder="Exemplo: CDZ"
                    className={empresaErrors.sigla ? "error-input" : ""}
                  />
                  {empresaErrors.sigla && (
                    <span className="error-message">{empresaErrors.sigla}</span>
                  )}
                </div>
                <div className="form-field">
                  <label htmlFor="email">E-mail</label>
                  <input
                    type="email"
                    id="email"
                    value={empresaData.email}
                    onChange={handleEmpresaChange}
                    placeholder="Exemplo: codcozoficial@gmail.com"
                    className={empresaErrors.email ? "error-input" : ""}
                  />
                  {empresaErrors.email && (
                    <span className="error-message">{empresaErrors.email}</span>
                  )}
                </div>
              </div>
            </div>
            {apiError && (
              <div
                className="error-message-api"
                style={{
                  color: "#e74c3c",
                  marginBottom: "16px",
                  padding: "12px",
                  backgroundColor: "#fee",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
              >
                {apiError}
              </div>
            )}
            <button
              className="signup-button"
              type="button"
              onClick={handleAvançar}
              disabled={isLoading}
            >
              {isLoading ? "Salvando..." : "Avançar"}
            </button>
          </div>
        ) : (
          <div className="signup-form">
            <h3 className="form-title">Dados do gestor</h3>
            <div className="form-grid">
              <div className="form-column">
                <div className="form-field">
                  <label htmlFor="gestor-nome">Nome</label>
                  <input
                    type="text"
                    id="gestor-nome"
                    value={gestorData.nome}
                    onChange={handleGestorChange}
                    placeholder="Exemplo: Maria"
                    className={gestorErrors.nome ? "error-input" : ""}
                  />
                  {gestorErrors.nome && (
                    <span className="error-message">{gestorErrors.nome}</span>
                  )}
                </div>
                <div className="form-field">
                  <label htmlFor="gestor-email">E-mail</label>
                  <input
                    type="email"
                    id="gestor-email"
                    value={gestorData.email}
                    onChange={handleGestorChange}
                    placeholder="Exemplo: mariaaraujo@gmail.com"
                    className={gestorErrors.email ? "error-input" : ""}
                  />
                  {gestorErrors.email && (
                    <span className="error-message">{gestorErrors.email}</span>
                  )}
                </div>
              </div>
              <div className="form-column">
                <div className="form-field">
                  <label htmlFor="gestor-sobrenome">Sobrenome</label>
                  <input
                    type="text"
                    id="gestor-sobrenome"
                    value={gestorData.sobrenome}
                    onChange={handleGestorChange}
                    placeholder="Exemplo: Araújo"
                    className={gestorErrors.sobrenome ? "error-input" : ""}
                  />
                  {gestorErrors.sobrenome && (
                    <span className="error-message">
                      {gestorErrors.sobrenome}
                    </span>
                  )}
                </div>
                <div className="form-field">
                  <label>Gênero</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="genero"
                        value="Masculino"
                        checked={gestorData.genero === "Masculino"}
                        onChange={handleGeneroChange}
                      />
                      <span
                        className={gestorErrors.genero ? "radio-error" : ""}
                      >
                        Masculino
                      </span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="genero"
                        value="Feminino"
                        checked={gestorData.genero === "Feminino"}
                        onChange={handleGeneroChange}
                      />
                      <span
                        className={gestorErrors.genero ? "radio-error" : ""}
                      >
                        Feminino
                      </span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="genero"
                        value="Outros"
                        checked={gestorData.genero === "Outros"}
                        onChange={handleGeneroChange}
                      />
                      <span
                        className={gestorErrors.genero ? "radio-error" : ""}
                      >
                        Outros
                      </span>
                    </label>
                  </div>
                  {gestorErrors.genero && (
                    <span className="error-message">{gestorErrors.genero}</span>
                  )}
                </div>
              </div>
            </div>
            {apiError && (
              <div
                className="error-message-api"
                style={{
                  color: "#e74c3c",
                  marginBottom: "16px",
                  padding: "12px",
                  backgroundColor: "#fee",
                  borderRadius: "4px",
                  fontSize: "14px",
                }}
              >
                {apiError}
              </div>
            )}
            <button
              className="signup-button-concluir"
              type="button"
              onClick={handleConcluir}
              disabled={isLoading}
            >
              {isLoading ? "Salvando..." : "Concluir cadastro"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUp;
