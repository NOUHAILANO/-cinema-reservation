// context/UserContext.js
import { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté au chargement
    const savedUser = localStorage.getItem('cinemax_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    // Déterminer le rôle (admin si email contient 'admin' ou logique spécifique)
    const isAdmin = userData.email.includes('admin') || userData.role === 'admin';
    
    const userWithRole = {
      ...userData,
      isAdmin: isAdmin,
      role: isAdmin ? 'admin' : 'user'
    };
    
    setUser(userWithRole);
    localStorage.setItem('cinemax_user', JSON.stringify(userWithRole));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cinemax_user');
  };

  const isAdmin = () => {
    return user?.isAdmin || user?.role === 'admin';
  };

  const isUser = () => {
    return !!user;
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAdmin, 
      isUser,
      loading 
    }}>
      {children}
    </UserContext.Provider>
  );
};