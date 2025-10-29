import React, { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import SignUp from "./components/SignUp";

function App() {
  const [showSignUp, setShowSignUp] = useState(false);

  const handleShowSignUp = () => {
    setShowSignUp(true);
  };

  const handleBack = () => {
    setShowSignUp(false);
  };

  const handleGoToHome = () => {
    setShowSignUp(false);
  };

  return (
    <div className="app">
      {!showSignUp && <Header onLogoClick={handleGoToHome} />}
      {showSignUp ? (
        <SignUp onBack={handleBack} onLogoClick={handleGoToHome} />
      ) : (
        <Hero onSignUpClick={handleShowSignUp} />
      )}
    </div>
  );
}

export default App;
