import React, { createContext, useContext, useEffect, useState } from 'react';
import initialDb from '../data/db';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [movies, setMovies] = useState([]);
  const [users, setUsers] = useState([]);
  const [reservations, setReservations] = useState([]);

  // Load initial data (from localStorage overrides or static db)
  useEffect(() => {
    try {
      const storedMovies = JSON.parse(localStorage.getItem('cinemax_movies'));
      const storedUsers = JSON.parse(localStorage.getItem('cinemax_users'));
      const storedReservations = JSON.parse(localStorage.getItem('cinemax_reservations'));

      setMovies(storedMovies ?? initialDb.movies ?? []);
      setUsers(storedUsers ?? initialDb.users ?? []);
      setReservations(storedReservations ?? initialDb.reservations ?? []);
    } catch (err) {
      setMovies(initialDb.movies ?? []);
      setUsers(initialDb.users ?? []);
      setReservations(initialDb.reservations ?? []);
    }
  }, []);

  // Persist helpers
  const persistMovies = (next) => {
    setMovies(next);
    localStorage.setItem('cinemax_movies', JSON.stringify(next));
  };

  const persistUsers = (next) => {
    setUsers(next);
    localStorage.setItem('cinemax_users', JSON.stringify(next));
  };

  const persistReservations = (next) => {
    setReservations(next);
    localStorage.setItem('cinemax_reservations', JSON.stringify(next));
  };

  // Movie operations
  const addMovie = (movie) => {
    const id = Date.now().toString();
    const newMovie = { ...movie, id, createdAt: new Date().toISOString() };
    const next = [newMovie, ...movies];
    persistMovies(next);
    return newMovie;
  };

  const updateMovie = (id, updates) => {
    const next = movies.map(m => m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m);
    persistMovies(next);
    return next.find(m => m.id === id);
  };

  const deleteMovie = (id) => {
    const next = movies.filter(m => m.id !== id);
    persistMovies(next);
    return true;
  };

  // Booking seats: seats is array of seat ids, userId is id of user who books
  const bookSeats = (movieId, seatsArray, userId) => {
    const next = movies.map(m => {
      if (m.id !== movieId) return m;
      const seats = { ...(m.seats || {}) };
      seatsArray.forEach(s => {
        seats[s] = userId;
      });
      return { ...m, seats };
    });
    persistMovies(next);

    // Create a reservation record
    const reservation = {
      id: Date.now().toString(),
      movieId,
      movieTitle: (movies.find(x => x.id === movieId) || {}).title || '',
      seats: seatsArray,
      date: new Date().toISOString(),
      user: users.find(u => u.id === userId)?.email || '',
      price: 0
    };
    const resNext = [reservation, ...reservations];
    persistReservations(resNext);
    return reservation;
  };

  const deleteReservation = (resId) => {
    const reservation = reservations.find(r => r.id === resId);
    if (!reservation) return false;

    // Free seats on the movie
    const nextMovies = movies.map(m => {
      if (m.id !== reservation.movieId) return m;
      const seats = { ...(m.seats || {}) };
      (reservation.seats || []).forEach(s => {
        seats[s] = false;
      });
      return { ...m, seats };
    });
    persistMovies(nextMovies);

    const nextReservations = reservations.filter(r => r.id !== resId);
    persistReservations(nextReservations);
    return true;
  };

  const deleteUser = (userId) => {
    const next = users.filter(u => u.id !== userId);
    persistUsers(next);
    return true;
  };

  // User operations
  const getUserByEmail = (email) => {
    return users.find(u => u.email === email) || null;
  };

  const addUser = (userData) => {
    const id = Date.now().toString();
    const newUser = { id, ...userData };
    const next = [...users, newUser];
    persistUsers(next);
    return newUser;
  };

  const value = {
    movies,
    users,
    reservations,
    addMovie,
    updateMovie,
    deleteMovie,
    bookSeats,
    getUserByEmail,
    addUser,
    deleteReservation,
    deleteUser,
    persistMovies,
    persistUsers,
    persistReservations
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
};

export default DataContext;
