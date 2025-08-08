import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    sessionStorage.removeItem("jwt");
    navigate("/auth");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">Recipedia</div>

      <div className="navbar-center">
        <Link to="/">Home</Link>
        <Link to="/inventory">Inventory</Link>
        <Link to="/favorites">Favorites</Link>
        <Link to="/mealplan">Meal Plan</Link>
        <Link to="/shoppinglist">Shopping List</Link>
        <Link to="/profile">Profile</Link>
      </div>

      <div className="navbar-right">
        <button onClick={handleLogout} className="logout-btn">
          Log out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
