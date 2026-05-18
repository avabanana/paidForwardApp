import React, { createContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On mount, check if there's a saved session
    const saved = localStorage.getItem('PAIDFORWARD_CURRENT_USER');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem('PAIDFORWARD_CURRENT_USER');
      }
    }
    setLoading(false);
  }, []);

  const signIn = (userData) => {
    localStorage.setItem('PAIDFORWARD_CURRENT_USER', JSON.stringify(userData));
    setUser(userData);
  };

  const signOut = () => {
    localStorage.removeItem('PAIDFORWARD_CURRENT_USER');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, signIn, signOut, loading }}>
      {!loading && children}
    </UserContext.Provider>
  );
};

export { UserContext };
