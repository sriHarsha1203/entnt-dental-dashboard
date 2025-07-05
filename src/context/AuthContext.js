// AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { mockUsers } from "../data/mockData"; //  path mock data

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("authUser");
    if (saved) {
      setUser(JSON.parse(saved));
    }

    // Overwrite mock users into localStorage every time to avoid stale data
    localStorage.setItem("users", JSON.stringify(mockUsers));
  }, []);

  const login = (email, password) => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const found = users.find((u) => u.email === email && u.password === password);
    if (found) {
      setUser(found);
      localStorage.setItem("authUser", JSON.stringify(found));
      return found;
    }
    return null;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
