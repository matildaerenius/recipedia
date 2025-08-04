import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import "./auth.css";

const Authentication = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [animating, setAnimating] = useState(false);

  const toggleMode = () => {
    setAnimating(true);
    setTimeout(() => {
      setIsRegistering((prev) => !prev);
      setAnimating(false);
    }, 300);
  };

  return (
    <div className="auth-container">
      {/* Left side – form */}
      <div className="form-side">
        <div className={`form-box ${animating ? "fade-out" : "fade-in"}`}>
          {isRegistering ? (
            <>
              <h2>Register</h2>
              <Register />
              <p>
                Already have an account? <span onClick={toggleMode}>Login</span>
              </p>
            </>
          ) : (
            <>
              <h2>Login</h2>
              <Login />
              <p>
                Don’t have an account?{" "}
                <span onClick={toggleMode}>Register</span>
              </p>
            </>
          )}
        </div>
      </div>

      {/* Right side – info */}
      <div className="info-side">
        <div className={`info-box ${animating ? "fade-out" : "fade-in"}`}>
          {isRegistering ? (
            <>
              <h3>Welcome Back!</h3>
              <p>Login to access your favorite recipes and your meal plans!</p>
            </>
          ) : (
            <>
              <h3>New here?</h3>
              <p>Create an account and explore Recipedia</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Authentication;
