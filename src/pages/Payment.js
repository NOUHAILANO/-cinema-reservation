import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import Toast from '../components/Toast';

export default function Payment(){
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info' });

  if (!state) return <div style={{padding: '2rem'}}>No payment data. Go back and select seats.</div>;

  const { movieId, movieTitle, seats, total } = state;

  const handlePay = async () => {
    setSaving(true);
    try {
      // Fetch current movie to check seats
      const movieRes = await fetch(`http://localhost:5001/movies/${movieId}`);
      const movie = await movieRes.json();

      // Check availability
      const conflict = seats.some(s => movie.seats[s]);
      if (conflict) {
        setToast({ message: 'One or more seats were just taken. Please try again.', type: 'danger' });
        setSaving(false);
        return;
      }

      // Reserve seats on movie
      const updatedSeats = { ...movie.seats };
      seats.forEach(s => updatedSeats[s] = true);

      const patchRes = await fetch(`http://localhost:5001/movies/${movieId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seats: updatedSeats })
      });
      if (!patchRes.ok) throw new Error('Failed to reserve seats');

      // Create reservation record
      const reservation = {
        movieId,
        movieTitle,
        seats,
        date: new Date().toISOString(),
        user: user ? user.email : 'guest'
      };

      const postRes = await fetch('http://localhost:5001/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservation)
      });
      if (!postRes.ok) throw new Error('Failed to create reservation');

      setToast({ message: 'Payment successful! Reservation created.', type: 'success' });
      // short delay then navigate to profile
      setTimeout(() => navigate('/profile'), 900);
    } catch (err) {
      console.error(err);
      setToast({ message: 'Payment failed. Try again later.', type: 'danger' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container" style={{padding: '2rem'}}>
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({message: '', type: 'info'})} />
      <h2>Payment for {movieTitle}</h2>
      <p className="muted">Seats: {seats.join(', ')}</p>
      <p className="muted">Total: {total} MAD</p>

      <div style={{maxWidth: 480, marginTop: '1rem'}}>
        <label style={{display:'block', marginBottom: 8}}>Card number</label>
        <input style={{width:'100%', padding:10, borderRadius:8, border:'1px solid #ddd'}} placeholder="4242 4242 4242 4242" />
        <div style={{display:'flex', gap:8, marginTop:8}}>
          <input style={{flex:1, padding:10, borderRadius:8, border:'1px solid #ddd'}} placeholder="MM/YY" />
          <input style={{width:120, padding:10, borderRadius:8, border:'1px solid #ddd'}} placeholder="CVC" />
        </div>

        <div style={{marginTop:16}}>
          <button className="btn" onClick={handlePay} disabled={saving}>{saving ? 'Processing...' : `Pay ${total} MAD`}</button>
          <button style={{marginLeft:10}} className="btn secondary" onClick={() => navigate(-1)}>Back</button>
        </div>
      </div>
    </div>
  );
}
