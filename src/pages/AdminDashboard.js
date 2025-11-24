import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
  const [movies, setMovies] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('movies');
  const [editingMovie, setEditingMovie] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const navigate = useNavigate();

  // États pour le formulaire
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    duration: '',
    rating: '',
    price: '',
    sessions: [''],
    trailerUrl: '',
    trailerThumbnail: '',
    seats: {}
  });

  // Charger les données
  useEffect(() => {
    fetchMovies();
    fetchReservations();
    fetchUsers();
  }, []);

  const fetchMovies = () => {
    fetch('http://localhost:5001/movies')
      .then(res => res.json())
      .then(data => setMovies(data))
      .catch(err => console.log(err));
  };

  const fetchReservations = () => {
    fetch('http://localhost:5001/reservations')
      .then(res => res.json())
      .then(data => setReservations(data))
      .catch(err => console.log(err));
  };

  const fetchUsers = () => {
    fetch('http://localhost:5001/users')
      .then(res => res.json())
      .then(data => setUsers(data.filter(user => user.role !== 'admin')))
      .catch(err => console.log(err));
  };

  // Gestion des films
  const handleDeleteMovie = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce film ?')) {
      fetch(`http://localhost:5001/movies/${id}`, {
        method: 'DELETE'
      })
      .then(() => {
        setMovies(movies.filter(movie => movie.id !== id));
        alert('Film supprimé avec succès !');
      })
      .catch(err => console.log(err));
    }
  };

  const handleEditMovie = (movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title,
      category: movie.category,
      description: movie.description,
      duration: movie.duration,
      rating: movie.rating,
      price: movie.price,
      sessions: movie.sessions || [''],
      trailerUrl: movie.trailerUrl || '',
      trailerThumbnail: movie.trailerThumbnail || '',
      seats: movie.seats || {}
    });
    setShowAddForm(true);
  };

  const handleAddMovie = () => {
    setEditingMovie(null);
    setFormData({
      title: '',
      category: '',
      description: '',
      duration: '',
      rating: '',
      price: '',
      sessions: [''],
      trailerUrl: '',
      trailerThumbnail: '',
      seats: {}
    });
    setShowAddForm(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSessionChange = (index, value) => {
    const newSessions = [...formData.sessions];
    newSessions[index] = value;
    setFormData(prev => ({
      ...prev,
      sessions: newSessions
    }));
  };

  const addSessionField = () => {
    setFormData(prev => ({
      ...prev,
      sessions: [...prev.sessions, '']
    }));
  };

  const removeSessionField = (index) => {
    if (formData.sessions.length > 1) {
      const newSessions = formData.sessions.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        sessions: newSessions
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const movieData = {
      ...formData,
      duration: parseInt(formData.duration),
      rating: parseFloat(formData.rating),
      price: parseInt(formData.price),
      sessions: formData.sessions.filter(session => session.trim() !== ''),
      seats: formData.seats || generateSeats()
    };

    if (editingMovie) {
      // Modification
      fetch(`http://localhost:5001/movies/${editingMovie.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...editingMovie,
          ...movieData,
          updatedAt: new Date().toISOString()
        })
      })
      .then(res => res.json())
      .then(updatedMovie => {
        setMovies(movies.map(movie => 
          movie.id === editingMovie.id ? updatedMovie : movie
        ));
        setShowAddForm(false);
        setEditingMovie(null);
        alert('Film modifié avec succès !');
      })
      .catch(err => console.log(err));
    } else {
      // Ajout
      fetch('http://localhost:5001/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...movieData,
          id: Date.now(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      })
      .then(res => res.json())
      .then(newMovie => {
        setMovies([...movies, newMovie]);
        setShowAddForm(false);
        alert('Film ajouté avec succès !');
      })
      .catch(err => console.log(err));
    }
  };

  const generateSeats = () => {
    const seats = {};
    for (let row = 1; row <= 8; row++) {
      for (let number = 1; number <= 10; number++) {
        seats[`${row}-${number}`] = null;
      }
    }
    return seats;
  };

  // Gestion des utilisateurs
  const handleDeleteUser = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      fetch(`http://localhost:5001/users/${id}`, {
        method: 'DELETE'
      })
      .then(() => {
        setUsers(users.filter(user => user.id !== id));
        alert('Utilisateur supprimé avec succès !');
      })
      .catch(err => console.log(err));
    }
  };

  // Statistiques
  const totalRevenue = reservations.reduce((sum, res) => sum + parseFloat(res.price || 0), 0);
  const totalUsers = users.length;
  const totalMovies = movies.length;

  return (
    <div className="admin-dashboard">
        <Navbar/>
      <div className="admin-header">
        <h1>🛠️ Administration CinémaMax</h1>
        <p>Gestion complète de votre cinéma</p>
      </div>

      {/* Navigation par onglets */}
      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 Aperçu
        </button>
        <button 
          className={`tab-btn ${activeTab === 'movies' ? 'active' : ''}`}
          onClick={() => setActiveTab('movies')}
        >
          🎬 Films ({movies.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Utilisateurs ({users.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'reservations' ? 'active' : ''}`}
          onClick={() => setActiveTab('reservations')}
        >
          🎫 Réservations ({reservations.length})
        </button>
      </div>

      {/* Contenu des onglets */}
      <div className="admin-content">
        {/* Onglet Aperçu */}
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="stats-cards">
              <div className="stat-card">
                <h3>💰 Chiffre d'affaires</h3>
                <div className="stat-number">{totalRevenue.toFixed(2)} €</div>
              </div>
              <div className="stat-card">
                <h3>🎬 Films</h3>
                <div className="stat-number">{totalMovies}</div>
              </div>
              <div className="stat-card">
                <h3>👥 Utilisateurs</h3>
                <div className="stat-number">{totalUsers}</div>
              </div>
              <div className="stat-card">
                <h3>🎫 Réservations</h3>
                <div className="stat-number">{reservations.length}</div>
              </div>
            </div>

            <div className="recent-activity">
              <h3>Activité récente</h3>
              <div className="activity-list">
                {reservations.slice(-5).reverse().map(res => (
                  <div key={res.id} className="activity-item">
                    <span className="activity-message">
                      <strong>{res.user}</strong> a réservé {res.seats?.length} place(s) pour <strong>{res.movieTitle}</strong>
                    </span>
                    <span className="activity-date">
                      {new Date(res.date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Onglet Films */}
        {activeTab === 'movies' && (
          <div className="movies-tab">
            <div className="tab-header">
              <h2>Gestion des Films</h2>
              <button className="btn-add" onClick={handleAddMovie}>
                ➕ Ajouter un film
              </button>
            </div>

            {showAddForm && (
              <div className="movie-form-overlay">
                <div className="movie-form">
                  <h3>{editingMovie ? 'Modifier le film' : 'Ajouter un film'}</h3>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Titre *</label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleFormChange}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Catégorie *</label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleFormChange}
                          required
                        >
                          <option value="">Sélectionnez une catégorie</option>
                          <option value="Action">Action</option>
                          <option value="Comédie">Comédie</option>
                          <option value="Drame">Drame</option>
                          <option value="Horreur">Horreur</option>
                          <option value="Science-Fiction">Science-Fiction</option>
                          <option value="Romance">Romance</option>
                          <option value="Animation">Animation</option>
                          <option value="Mystère">Mystère</option>
                          <option value="Thriller">Thriller</option>
                          <option value="Fantasy">Fantasy</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Description *</label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleFormChange}
                          required
                          rows="3"
                        />
                      </div>

                      <div className="form-group">
                        <label>Durée (minutes) *</label>
                        <input
                          type="number"
                          name="duration"
                          value={formData.duration}
                          onChange={handleFormChange}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Note (0-5) *</label>
                        <input
                          type="number"
                          name="rating"
                          value={formData.rating}
                          onChange={handleFormChange}
                          min="0"
                          max="5"
                          step="0.1"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Prix (€) *</label>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleFormChange}
                          required
                        />
                      </div>

                      <div className="form-group full-width">
                        <label>URL de la bande-annonce</label>
                        <input
                          type="url"
                          name="trailerUrl"
                          value={formData.trailerUrl}
                          onChange={handleFormChange}
                        />
                      </div>

                      <div className="form-group full-width">
                        <label>URL de la miniature</label>
                        <input
                          type="url"
                          name="trailerThumbnail"
                          value={formData.trailerThumbnail}
                          onChange={handleFormChange}
                        />
                      </div>

                      <div className="form-group full-width">
                        <label>Séances *</label>
                        {formData.sessions.map((session, index) => (
                          <div key={index} className="session-input-group">
                            <input
                              type="text"
                              value={session}
                              onChange={(e) => handleSessionChange(index, e.target.value)}
                              placeholder="HH:MM"
                              required
                            />
                            {formData.sessions.length > 1 && (
                              <button
                                type="button"
                                className="btn-remove"
                                onClick={() => removeSessionField(index)}
                              >
                                ❌
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          className="btn-add-session"
                          onClick={addSessionField}
                        >
                          ➕ Ajouter une séance
                        </button>
                      </div>
                    </div>

                    <div className="form-actions">
                      <button type="submit" className="btn-submit">
                        {editingMovie ? '💾 Modifier le film' : '➕ Ajouter le film'}
                      </button>
                      <button
                        type="button"
                        className="btn-cancel"
                        onClick={() => setShowAddForm(false)}
                      >
                        ❌ Annuler
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="movies-table-container">
              <table className="movies-table">
                <thead>
                  <tr>
                    <th>Titre</th>
                    <th>Catégorie</th>
                    <th>Durée</th>
                    <th>Note</th>
                    <th>Prix</th>
                    <th>Séances</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {movies.map(movie => (
                    <tr key={movie.id}>
                      <td className="movie-title">{movie.title}</td>
                      <td>
                        <span className="category-badge">{movie.category}</span>
                      </td>
                      <td>{movie.duration} min</td>
                      <td>
                        <span className="rating">⭐ {movie.rating}/5</span>
                      </td>
                      <td>{movie.price} €</td>
                      <td>
                        <div className="sessions-list">
                          {movie.sessions?.slice(0, 2).map((session, i) => (
                            <span key={i} className="session-badge">{session}</span>
                          ))}
                          {movie.sessions?.length > 2 && (
                            <span className="more-sessions">+{movie.sessions.length - 2}</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn-edit"
                            onClick={() => handleEditMovie(movie)}
                          >
                            ✏️
                          </button>
                          <button 
                            className="btn-delete"
                            onClick={() => handleDeleteMovie(movie.id)}
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Onglet Utilisateurs */}
        {activeTab === 'users' && (
          <div className="users-tab">
            <h2>Gestion des Utilisateurs</h2>
            <div className="users-table-container">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Date d'inscription</th>
                    <th>Réservations</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => {
                    const userReservations = reservations.filter(res => res.user === user.name);
                    return (
                      <tr key={user.id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{new Date(user.createdAt).toLocaleDateString('fr-FR')}</td>
                        <td>{userReservations.length}</td>
                        <td>
                          <button 
                            className="btn-delete"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Onglet Réservations */}
        {activeTab === 'reservations' && (
          <div className="reservations-tab">
            <h2>Gestion des Réservations</h2>
            <div className="reservations-table-container">
              <table className="reservations-table">
                <thead>
                  <tr>
                    <th>Film</th>
                    <th>Utilisateur</th>
                    <th>Sièges</th>
                    <th>Date</th>
                    <th>Prix</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map(res => (
                    <tr key={res.id}>
                      <td className="movie-title">{res.movieTitle}</td>
                      <td>{res.user}</td>
                      <td>
                        <div className="seats-list">
                          {res.seats?.map((seat, index) => (
                            <span key={index} className="seat-badge">{seat}</span>
                          ))}
                        </div>
                      </td>
                      <td>{new Date(res.date).toLocaleDateString('fr-FR')}</td>
                      <td>{res.price} €</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;