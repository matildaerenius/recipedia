import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Login from "./Login";
import Register from "./Register";
import { CLEAR_AUTH_MESSAGES } from "../../Redux/Auth/auth.actionType";
import "./auth.css";

console.log("AUTH component loaded");

const Authentication = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [animating, setAnimating] = useState(false);

  const dispatch = useDispatch();
  const { message, error } = useSelector((state) => state.auth);

  const toggleMode = () => {
    setAnimating(true);
    setTimeout(() => {
      setIsRegistering((prev) => !prev);
      setAnimating(false);
    }, 300);
  };

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        dispatch({ type: CLEAR_AUTH_MESSAGES });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, error, dispatch]);

  return (
    <div className="auth-container">
      {/* Left side – form */}
      <div className="form-side">
        <div className={`form-box ${animating ? "fade-out" : "fade-in"}`}>
          {isRegistering ? (
            <>
              <h2>Register</h2>
              <Register setIsRegistering={setIsRegistering} />

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
