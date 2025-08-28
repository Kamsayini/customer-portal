import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  let storedUser = null;
  try {
    const rawUser = localStorage.getItem("user");
    if (rawUser && rawUser !== "undefined") {
      storedUser = JSON.parse(rawUser);
    }
  } catch {
    storedUser = null;
  }

  const [user, setUser] = useState(storedUser);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const login = (userData, jwtToken) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", jwtToken);
    setUser(userData);
    setToken(jwtToken);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken("");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
