import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [age, setAge] = useState(null);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const savedAge = localStorage.getItem('userAge');
    if (savedAge) {
      setAge(JSON.parse(savedAge));
    }
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
      setPoints,
      loading
    }}>
      {!loading && children}
    </UserContext.Provider>
  );
};

export { UserContext };