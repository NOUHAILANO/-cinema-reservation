import React, { createContext, useState, useContext, useEffect } from 'react';
import { UserContext } from './UserContext';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      const userFavorites = JSON.parse(localStorage.getItem(`favorites_${user.id}`)) || [];
      setFavorites(userFavorites);
    } else {
      setFavorites([]);
    }
  }, [user]);

  const toggleFavorite = (movieId) => {
    if (!user) {
      return { 
        success: false, 
        message: "Veuillez vous connecter pour gérer les favoris" 
      };
    }

    setFavorites(prev => {
      let newFavorites;
      if (prev.includes(movieId)) {
        newFavorites = prev.filter(id => id !== movieId);
      } else {
        newFavorites = [...prev, movieId];
      }
      
      localStorage.setItem(`favorites_${user.id}`, JSON.stringify(newFavorites));
      return newFavorites;
    });

    const isNowFavorite = !favorites.includes(movieId);
    return { 
      success: true, 
      message: isNowFavorite ? "Ajouté aux favoris" : "Retiré des favoris"
    };
  };

  const isFavorite = (movieId) => {
    return favorites.includes(movieId);
  };

  const value = {
    favorites,
    toggleFavorite,
    isFavorite
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export default useFavorites;