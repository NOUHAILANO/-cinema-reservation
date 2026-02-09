// components/Header.jsx
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import './Header.css';

export default function Header() {
  const { user, logout, isAdmin } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="cinemax-header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            Cinéma<span className="logo-accent">Max</span>
          </Link>
          
          <nav className="nav-links">
            <Link to="/">Accueil</Link>
          
            
            <Link to="/profile" className="nav-link">Profil</Link>
            
            {/* Lien Admin seulement pour les administrateurs */}
            {isAdmin() && (
              <Link to="/admin" className="admin-link">
                🛠️ Administration
              </Link>
            )}
          </nav>

          <div className="header-actions">
            {user ? (
              <div className="user-menu">
                <span className="user-greeting">
                 
                  {isAdmin() && <span className="admin-badge">ADMIN</span>}
                </span>
                <button onClick={handleLogout} className="btn-logout">
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn-login">
                  Connexion
                </Link>
                <Link to="/register" className="btn-register">
                  Inscription
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}