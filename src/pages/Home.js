import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFavorites } from "../context/useFavorites";
import { UserContext } from "../context/UserContext";
import Toast from "../components/Toast";
import TrailerModal from "../components/TrailerModal";
import Header from "../components/Header";
import './Home.css';

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [toast, setToast] = useState({ message: '', type: 'info' });
  const [selectedMovie, setSelectedMovie] = useState(null);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { user, isAdmin } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5001/movies")
      .then(res => res.json())
      .then(data => {
        setMovies(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching movies:", error);
        setLoading(false);
      });
  }, []);

  const filteredMovies = filter === "all" 
    ? movies 
    : movies.filter(movie => movie.category?.toLowerCase() === filter);

  const handleFavoriteClick = (movieId) => {
    if (!user) {
      setToast({ message: "Veuillez vous connecter pour gérer les favoris", type: 'warning' });
      return;
    }
    
    const result = toggleFavorite(movieId);
    setToast({ message: result.message, type: 'info' });
  };

  const handleTrailerClick = (movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseTrailer = () => {
    setSelectedMovie(null);
  };

  const handleSessionClick = (movieId, session, movieTitle) => {
    if (!user) {
      setToast({ message: "Veuillez vous connecter pour réserver", type: 'warning' });
      return;
    }
    
    navigate(`/reservation/${movieId}`, { 
      state: { 
        selectedSession: session,
        movieTitle: movieTitle
      }
    });
  };

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) return (
    <div className="App">
      <Header />
      <div className="container center loading-page">
        <div className="loading-spinner"></div>
        <p>Chargement des films...</p>
      </div>
    </div>
  );

  return (
    <div className="App">
      <Header />
      
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'info' })} />
      
      {selectedMovie && (
        <TrailerModal 
          movie={selectedMovie} 
          onClose={handleCloseTrailer} 
        />
      )}

      {/* Hero Section */}
      <section className="cinema-hero">
        <div className="container">
          <div className="hero-content">
            <h1>Cinéma<span className="logo-accent">Max</span></h1>
            <p className="hero-subtitle">Votre destination cinéma premium</p>
            <div className="hero-actions">
              <a href="#movies" className="btn btn-primary">
                <span>🎬</span> Voir les films
              </a>
              {isAdmin() && (
                <Link to="/admin" className="btn btn-secondary">
                  <span>🛠️</span> Administration
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section" id="stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">{movies.length}+</div>
              <div className="stat-label">Films disponibles</div>
              <div className="stat-desc">Toujours à jour</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">12</div>
              <div className="stat-label">Salles de cinéma</div>
              <div className="stat-desc">Confort premium</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Clients satisfaits</div>
              <div className="stat-desc">Note 4.8/5</div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="category-section" id="movies">
        <div className="container">
          <div className="category-header">
            <h2>Nos Films</h2>
            <p>Découvrez notre sélection exceptionnelle</p>
            
            {/* Bouton Admin pour ajouter un film */}
            {isAdmin() && (
              <div className="admin-actions">
                <Link to="/admin?tab=add-movie" className="btn-admin-add">
                  <span>➕</span> Ajouter un film
                </Link>
              </div>
            )}
          </div>
          
          <div className="category-filters">
            <button className={`category-filter ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
              Tous <span className="rating-badge">{movies.length}</span>
            </button>
            <button className={`category-filter ${filter === "action" ? "active" : ""}`} onClick={() => setFilter("action")}>
              Action <span className="rating-badge">{movies.filter(m => m.category?.toLowerCase() === "action").length}</span>
            </button>
            <button className={`category-filter ${filter === "comédie" ? "active" : ""}`} onClick={() => setFilter("comédie")}>
              Comédie <span className="rating-badge">{movies.filter(m => m.category?.toLowerCase() === "comédie").length}</span>
            </button>
            <button className={`category-filter ${filter === "drame" ? "active" : ""}`} onClick={() => setFilter("drame")}>
              Drame <span className="rating-badge">{movies.filter(m => m.category?.toLowerCase() === "drame").length}</span>
            </button>
            <button className={`category-filter ${filter === "horreur" ? "active" : ""}`} onClick={() => setFilter("horreur")}>
              Horreur <span className="rating-badge">{movies.filter(m => m.category?.toLowerCase() === "horreur").length}</span>
            </button>
            <button className={`category-filter ${filter === "science-fiction" ? "active" : ""}`} onClick={() => setFilter("science-fiction")}>
              Science-Fiction <span className="rating-badge">{movies.filter(m => m.category?.toLowerCase() === "science-fiction").length}</span>
            </button>
            <button className={`category-filter ${filter === "romance" ? "active" : ""}`} onClick={() => setFilter("romance")}>
              Romance <span className="rating-badge">{movies.filter(m => m.category?.toLowerCase() === "romance").length}</span>
            </button>
            <button className={`category-filter ${filter === "animation" ? "active" : ""}`} onClick={() => setFilter("animation")}>
              Animation <span className="rating-badge">{movies.filter(m => m.category?.toLowerCase() === "animation").length}</span>
            </button>
            <button className={`category-filter ${filter === "mystère" ? "active" : ""}`} onClick={() => setFilter("mystère")}>
              Mystère <span className="rating-badge">{movies.filter(m => m.category?.toLowerCase() === "mystère").length}</span>
            </button>
            <button className={`category-filter ${filter === "thriller" ? "active" : ""}`} onClick={() => setFilter("thriller")}>
              Thriller<span className="rating-badge">{movies.filter(m => m.category?.toLowerCase() === "thriller").length}</span>
            </button>
            <button className={`category-filter ${filter === "fantasy" ? "active" : ""}`} onClick={() => setFilter("fantasy")}>
              Fantasy<span className="rating-badge">{movies.filter(m => m.category?.toLowerCase() === "fantasy").length}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Movies Grid */}
      <section className="featured-section">
        <div className="container">
          <div className="movies-grid">
            {filteredMovies.map(movie => {
              const availableSeats = movie.seats ? Object.values(movie.seats).filter(seat => !seat).length : 0;
              const displaySessions = movie.sessions?.slice(0, 3) || [];
              const totalSeats = movie.seats ? Object.values(movie.seats).length : 0;
              const occupancyRate = totalSeats > 0 ? ((totalSeats - availableSeats) / totalSeats * 100).toFixed(0) : 0;
              
              return (
                <div key={movie.id} className="movie-card">
                  {/* Badge Admin pour les statistiques */}
                  

                  <button 
                    className={`favorite-btn ${isFavorite(movie.id) ? 'favorited' : ''}`}
                    onClick={() => handleFavoriteClick(movie.id)}
                    aria-label={isFavorite(movie.id) ? "Retirer des favoris" : "Ajouter aux favoris"}
                  >
                    {isFavorite(movie.id) ? '❤️' : '🤍'}
                  </button>

                  <div className="movie-card-content">
                    <h3 className="movie-title">{movie.title}</h3>
                    
                    <div className="movie-meta">
                      <span className="movie-category">{movie.category}</span>
                      <span className="movie-duration">{movie.duration} min</span>
                      <span className="movie-rating">⭐ {movie.rating}/5</span>
                    </div>
                    
                    <p className="movie-description">{movie.description}</p>

                    {/* Informations supplémentaires pour Admin */}
                    {isAdmin() && movie.createdAt && (
                      <div className="admin-movie-info">
                        <small>Ajouté le: {formatDate(movie.createdAt)}</small>
                        {movie.updatedAt && (
                          <small>Modifié le: {formatDate(movie.updatedAt)}</small>
                        )}
                      </div>
                    )}

                    {movie.trailerThumbnail && (
                      <div className="trailer-preview">
                        <img 
                          src={movie.trailerThumbnail} 
                          alt={`Bande-annonce ${movie.title}`}
                          className="trailer-thumbnail"
                        />
                        <div className="trailer-play-overlay">
                          <button 
                            className="trailer-play-btn"
                            onClick={() => handleTrailerClick(movie)}
                          >
                            ▶
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="session-section">
                      <h4>Horaires disponibles :</h4>
                      <div className="showtimes">
                        {displaySessions.map((session, i) => (
                          <button 
                            key={i} 
                            className="showtime-btn"
                            onClick={() => handleSessionClick(movie.id, session, movie.title)}
                          >
                            {session}
                          </button>
                        ))}
                        {movie.sessions && movie.sessions.length > 3 && (
                          <button className="showtime-btn more-btn">
                            +{movie.sessions.length - 3}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="movie-footer">
                      <div className="price-tag">{movie.price} MAD</div>
                      <div className="seats-available">
                        {availableSeats} places
                      </div>
                      <Link 
                        to={`/reservation/${movie.id}`}
                        className={`btn-reserve ${availableSeats === 0 ? 'disabled' : ''}`}
                      >
                        {availableSeats === 0 ? 'Complet' : 'Réserver'}
                      </Link>
                    </div>

                    {/* Actions rapides Admin */}
                    {isAdmin() && (
                      <div className="admin-quick-actions">
                        <Link 
                          to={`/admin?tab=movies&edit=${movie.id}`}
                          className="btn-edit-quick"
                        >
                          ✏️ Modifier
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          
          {filteredMovies.length === 0 && (
            <div className="no-movies">
              <h3>🎭 Aucun film trouvé</h3>
              <p>Essayez de changer de catégorie ou ajoutez de nouveaux films</p>
              {isAdmin() && (
                <Link to="/admin?tab=add-movie" className="btn btn-primary">
                  ➕ Ajouter le premier film
                </Link>
              )}
            </div>
          )}
        </div>
      </section>

      {/* User Stats Section */}
      {user && (
        <section className="user-stats-section">
          <div className="container">
            <div className="user-stats">
              <h3>Votre activité</h3>
              <div className="user-stats-grid">
                <div className="user-stat-card">
                  <div className="user-stat-number">{favorites.length}</div>
                  <div className="user-stat-label">Favoris</div>
                </div>
                <div className="user-stat-card">
                  <div className="user-stat-number">
                    {movies.filter(movie => 
                      movie.seats && Object.values(movie.seats).some(seat => 
                        seat === user.id
                      )
                    ).length}
                  </div>
                  <div className="user-stat-label">Réservations</div>
                </div>
                {isAdmin() && (
                  <div className="user-stat-card admin-stat">
                    <div className="user-stat-number">{movies.length}</div>
                    <div className="user-stat-label">Films gérés</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          
        </div>
      </section>

      {/* Footer */}
      <footer className="cinemax-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-column">
              <h3>CinémaMax</h3>
              <p>Votre destination cinéma premium depuis 2024. Des films, des émotions, des moments inoubliables.</p>
            </div>
            <div className="footer-column">
              <h3>Navigation</h3>
              <ul className="footer-links">
                <li><a href="#movies">Films</a></li>
                <li><a href="#stats">À propos</a></li>
                <li><Link to="/login">Connexion</Link></li>
                {isAdmin() && <li><Link to="/admin">Administration</Link></li>}
              </ul>
            </div>
            <div className="footer-column">
              <h3>Contact</h3>
              <ul className="footer-links">
                <li>📞 +212 5 00 00 00</li>
                <li>📧 contact@cinemamax.ma</li>
                <li>📍 Casablanca, Maroc</li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 CinémaMax. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}