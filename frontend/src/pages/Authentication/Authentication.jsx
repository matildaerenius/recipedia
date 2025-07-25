import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import "./auth.css";

const Authentication = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <div className="auth-container">
      <div className={`auth-box ${isRegistering ? "register-mode" : ""}`}>
        <div className="form-wrapper">
          <div
            className={`form-panel login-panel ${
              isRegistering ? "hidden" : ""
            }`}
          >
            <h2>Login</h2>
            <Login />
            <p className="switch-text">
              Don’t have an account?{" "}
              <span onClick={() => setIsRegistering(true)}>Register</span>
            </p>
          </div>

          <div
            className={`form-panel register-panel ${
              isRegistering ? "" : "hidden"
            }`}
          >
            <h2>Register</h2>
            <Register />
            <p className="switch-text">
              Already have an account?{" "}
              <span onClick={() => setIsRegistering(false)}>Login</span>
            </p>
          </div>
        </div>

        <div className="info-panel">
          <div className="overlay-text">
            <h3>{isRegistering ? "Welcome Back!" : "New here?"}</h3>
            <p>
              {isRegistering
                ? "Login to access your recipes and meal plans."
                : "Create an account and explore Recipedia."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authentication;
