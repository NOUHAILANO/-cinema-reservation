import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { FavoritesProvider } from './context/useFavorites';
import Home from './pages/Home';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Reservation from './pages/Reservation';
import Payment from './pages/Payment';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './styles.css';

function App() {
  return (
    <UserProvider>
      <FavoritesProvider>
        <Router>
          <div className="App">
            
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/reservation/:movieId" element={<Reservation />} />
              <Route path="/payment" element={<Payment />} />
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
        </Router>
      </FavoritesProvider>
    </UserProvider>
  );
}

export default App;