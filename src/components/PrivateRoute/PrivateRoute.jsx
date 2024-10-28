import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Asegúrate de que la ruta de importación es correcta

function PrivateRoute({ children, requiredRole }) {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    alert("No puedes entrar aquí si no tienes permiso"); // Alerta al usuario
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && currentUser.rol !== requiredRole) {
    console.log(requiredRole ,currentUser.rol)

    alert("No tienes el rol necesario para acceder a esta página"); // Alerta al usuario
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default PrivateRoute;
