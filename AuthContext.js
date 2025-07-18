import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('authUser');
    if (savedToken) {
      setToken(savedToken);
      setUser(savedUser ? JSON.parse(savedUser) : null);
    }
  }, []);

  const login = async (username, password) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL || ''}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        const data = await res.json();
        setToken(data.token);
        setUser({ username: data.username || username });
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('authUser', JSON.stringify({ username: data.username || username }));
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}