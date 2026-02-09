import { useState, useEffect } from "react";
import { useData } from "../context/DataContext";
import { useParams, useNavigate } from "react-router-dom";
import './Reservation.css'; 
import Navbar from "../components/Navbar";

export default function Reservation() {
  const { movieId } = useParams();
  const { movies } = useData();
  const [movie, setMovie] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError(null);
    const m = movies.find(mv => mv.id === movieId);
    if (!m) setError('Film non trouvé');
    setMovie(m || null);
    setLoading(false);
  }, [movieId, movies]);

  const toggleSeat = (seat) => {
    if (!movie || !movie.seats || movie.seats[seat]) return;
    if (selectedSeats.includes(seat)) setSelectedSeats(selectedSeats.filter(s => s !== seat));
    else setSelectedSeats([...selectedSeats, seat]);
  };

  const handleReserve = () => {
    if (!movie || selectedSeats.length === 0) return alert('Veuillez sélectionner au moins un siège');
    if (!selectedDate || new Date(selectedDate) < new Date().setHours(0,0,0,0)) 
      return alert('Veuillez sélectionner une date valide');

    const total = movie.price * selectedSeats.length;
    navigate('/payment', { 
      state: { movieId: movie.id, movieTitle: movie.title, seats: selectedSeats, total, date: selectedDate } 
    });
  };

  if (loading) return <div className="loading"><h2>Chargement...</h2></div>;
  if (error) return <div className="error"><p>{error}</p></div>;
  if (!movie) return <div className="not-found"><p>Film non trouvé</p></div>;

  const total = movie.price * selectedSeats.length;
  const isReservationDisabled = selectedSeats.length === 0 || !selectedDate || new Date(selectedDate) < new Date().setHours(0,0,0,0);

  return (
    <div className="reservation-container">
        <Navbar/>
      <h2>{movie.title}</h2>
      
      <div className="date-selection">
        <label>Choisir la date :</label>
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
      </div>

      <div className="seats-grid">
        {Object.keys(movie.seats).map(seat => {
          const isBooked = movie.seats[seat];
          const isSelected = selectedSeats.includes(seat);
          return (
            <button 
              key={seat} 
              className={`seat ${isBooked ? 'booked' : isSelected ? 'selected' : ''}`} 
              onClick={() => toggleSeat(seat)}
              disabled={isBooked}
            >
              {seat}
            </button>
          );
        })}
      </div>

      <div className="reservation-summary">
        <p><strong>Sièges sélectionnés:</strong> {selectedSeats.join(', ') || 'Aucun'}</p>
        <p><strong>Nombre de sièges:</strong> {selectedSeats.length}</p>
        <p><strong>Prix total:</strong> {total} MAD</p>
        <button 
          className={`btn-reserve ${isReservationDisabled ? 'disabled' : ''}`} 
          onClick={handleReserve}
          disabled={isReservationDisabled}
        >
          {isReservationDisabled ? 'Sélectionnez date & sièges valides' : `Confirmer la réservation (${selectedSeats.length})`}
        </button>
      </div>
    </div>
  );
}
