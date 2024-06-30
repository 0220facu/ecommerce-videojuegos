import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función para guardar el usuario en localStorage
  const saveUser = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    setCurrentUser(user);
  };

  const agregarRegistro = async (tipo, user) => {
    const usuarioEmail = user ? user.email : currentUser?.email;
    if (!usuarioEmail) {
      console.error("No hay usuario logueado o el usuario no tiene email");
      return;
    }

    const data = {
      fecha: new Date().toISOString(),
      usuario: usuarioEmail,
      tipo: tipo
    };

    try {
      const response = await fetch('http://localhost:5217/api/Registro/insertar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      console.log("Registro agregado con éxito");
    } catch (error) {
      console.error("Error al agregar registro:", error);
    }
  };

  async function register(email, password) {
    const url = 'http://localhost:5217/api/Usuario/insertar';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email, password, carrito: [] })
    });
    const data = await response.json();
    if (response.ok) {
      saveUser({ email, password, carrito: [] });  // Guardar usuario en estado y localStorage
      agregarRegistro("Registro usuario", data);
    } else {
      throw new Error(data.message);
    }
  }

  async function login(email, password) {
    const url = 'http://localhost:5217/api/Usuario/autenticar';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ email, password, carrito: [] })
    });
    const data = await response.json();
    if (response.ok) {
      saveUser(data);  // Guardar usuario en estado y localStorage
      agregarRegistro("Inicio sesión", data);
    } else {
      throw new Error(data.message);
    }
  }

  function logout() {
    localStorage.removeItem('user');
    setCurrentUser(null);
  }

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  const value = {
    currentUser,
    register,
    login,
    logout,agregarRegistro
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
