import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <div className="logo"></div>
          <h1 className="nav-title">CINEMA MAX</h1>
        </div>

        <div className="nav-content">
          <div className="nav-links">
            <Link to="/" className="nav-link">Accueil</Link>
           
            
            {user ? (
              <>
                <Link to="/profile" className="nav-link">Profil</Link>
                <button className="nav-link logout-btn" onClick={handleLogout}>
                  Déconnexion
                </button>
              </>
            ) : (
              <Link to="/login" className="nav-link">Connexion</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}