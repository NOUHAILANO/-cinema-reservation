import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useFavorites } from "../context/useFavorites";
import Toast from "../components/Toast";
import "./profile.css"
import Navbar from "../components/Navbar";

export default function Profile() {
  const { user } = useContext(UserContext);
  const { favorites } = useFavorites();
  const [reservations, setReservations] = useState([]);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'info' });
  const [activeTab, setActiveTab] = useState("overview");

  const [profileStats, setProfileStats] = useState({
    totalReservations: 0,
    loyaltyPoints: 1250,
    favoriteGenre: "Action"
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resReservations, resMovies] = await Promise.all([
          fetch('http://localhost:5001/reservations').then(res => res.json()),
          fetch('http://localhost:5001/movies').then(res => res.json())
        ]);

        setMovies(resMovies);
        const userReservations = resReservations.filter(r => r.user === user?.email);
        setReservations(userReservations);
        
        setProfileStats(prev => ({
          ...prev,
          totalReservations: userReservations.length,
          favoriteGenre: calculateFavoriteGenre(favorites, resMovies)
        }));
        
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setToast({ message: 'Erreur lors du chargement des données', type: 'danger' });
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchData();
  }, [user, favorites]);

  const calculateFavoriteGenre = (userFavorites, allMovies) => {
    if (userFavorites.length === 0) return "Aucun";
    
    const genreCount = {};
    userFavorites.forEach(favId => {
      const movie = allMovies.find(m => m.id === favId);
      if (movie && movie.category) {
        genreCount[movie.category] = (genreCount[movie.category] || 0) + 1;
      }
    });
    
    return Object.keys(genreCount).reduce((a, b) => 
      genreCount[a] > genreCount[b] ? a : b, "Aucun"
    );
  };

  const getFavoriteMovies = () => {
    return favorites.map(favId => movies.find(movie => movie.id === favId)).filter(Boolean);
  };

  const cancelReservation = async (resId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler cette réservation ?')) return;

    try {
      await fetch(`http://localhost:5001/reservations/${resId}`, { method: 'DELETE' });
      setReservations(prev => prev.filter(r => r.id !== resId));
      setToast({ message: 'Réservation annulée avec succès !', type: 'success' });
    } catch (err) {
      console.error("Erreur lors de l'annulation:", err);
      setToast({ message: 'Erreur lors de l\'annulation', type: 'danger' });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  const handleUseOffer = (offerName) => {
    setToast({ message: `Offre "${offerName}" appliquée !`, type: 'success' });
  };

  const renderTabContent = () => {
    const favoriteMovies = getFavoriteMovies();
    
    switch (activeTab) {
      case "overview":
        return (
          <div className="overview-content">
           
            <div className="activity-section">
              <h3>Activité récente</h3>
              {reservations.slice(0, 3).map(reservation => (
                <div key={reservation.id} className="activity-item">
                  <div className="activity-movie">{reservation.movieTitle}</div>
                  <div className="activity-date">{formatDate(reservation.date)}</div>
                  <div className="activity-seats">Sièges: {reservation.seats.join(', ')}</div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case "history":
        return (
          
          <div className="history-content">

            <h3>Historique complet</h3>
            {reservations.map(reservation => (
              <div key={reservation.id} className="reservation-card">
                <div className="reservation-header">
                  <h4>{reservation.movieTitle}</h4>
                  <span className="reservation-date">{formatDate(reservation.date)}</span>
                </div>
                <div className="reservation-details">
                  <p>Sièges: {reservation.seats.join(', ')}</p>
                  <button 
                    className="btn-cancel"
                    onClick={() => cancelReservation(reservation.id)}
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ))}
          </div>
        );
      
      case "favorites":
        return (
          <div className="favorites-content">
            <h3>Mes films favoris</h3>
            <div className="favorites-grid">
              {favoriteMovies.map(movie => (
                <div key={movie.id} className="favorite-card">
                  <h4>{movie.title}</h4>
                  <p>{movie.category} • {movie.duration}min</p>
                  <p>Note: {movie.rating} ★</p>
                </div>
              ))}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="profile-page">
        <Navbar/>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />

      <div className="profile-header">
        <div className="profile-avatar">
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <div className="profile-info">
          <h1 className="profile-name">{user?.name || 'Utilisateur'}</h1>
          <p className="profile-email">{user?.email}</p>
          <p className="profile-joined">Membre depuis janvier 2023</p>
        </div>
      </div>

      <div className="profile-stats">
        <div className="profile-stat">
          <div className="stat-number">{profileStats.totalReservations}</div>
          <div className="stat-label">Réservations</div>
        </div>
        <div className="profile-stat">
          <div className="stat-number">{profileStats.loyaltyPoints}</div>
          <div className="stat-label">Points fidélité</div>
        </div>
        <div className="profile-stat">
          <div className="stat-number">{favorites.length}</div>
          <div className="stat-label">Favoris</div>
        </div>
        <div className="profile-stat">
          <div className="stat-label">Genre préféré</div>
          <div className="stat-value">{profileStats.favoriteGenre}</div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-tabs">
          <button 
            className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Vue d'ensemble
          </button>
          <button 
            className={`tab-btn ${activeTab === "history" ? "active" : ""}`}
            onClick={() => setActiveTab("history")}
          >
            Historique
          </button>
          <button 
            className={`tab-btn ${activeTab === "favorites" ? "active" : ""}`}
            onClick={() => setActiveTab("favorites")}
          >
            Favoris ({favorites.length})
          </button>
        </div>

        <div className="profile-main">
          <div className="content-section">
            {renderTabContent()}
          </div>

          <div className="offers-sidebar">
            <h3>Offres spéciales</h3>
            <div className="offer-card">
              <h4>20% sur votre prochain film</h4>
              <p>Valable jusqu'au 31 octobre</p>
              <button className="offer-btn" onClick={() => handleUseOffer("20% de réduction")}>
                Utiliser
              </button>
            </div>
            <div className="offer-card">
              <h4>Popcorn gratuit</h4>
              <p>Pour toute réservation premium</p>
              <button className="offer-btn" onClick={() => handleUseOffer("Popcorn gratuit")}>
                Utiliser
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}