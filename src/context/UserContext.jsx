import React, { createContext, useState, useEffect } from 'react';

// Create the Context
export const UserContext = createContext();

// Create the Provider Component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [age, setAge] = useState(null);
  const [points, setPoints] = useState(0);

  // You can add logic here to save user data to localStorage 
  // so they stay logged in even if they refresh the page!
  useEffect(() => {
    const savedAge = localStorage.getItem('userAge');
    if (savedAge) setAge(JSON.parse(savedAge));
  }, []);

  const updateAge = (newAge) => {
    setAge(newAge);
    localStorage.setItem('userAge', JSON.stringify(newAge));
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser, 
      age, 
      setAge: updateAge, 
      points, 
      setPoints 
    }}>
      {children}
    </UserContext.Provider>
  );
};