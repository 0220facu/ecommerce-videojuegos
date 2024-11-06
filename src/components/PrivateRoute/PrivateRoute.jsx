import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Asegúrate de que la ruta de importación es correcta

function PrivateRoute({ children, requiredRole }) {
  const { currentUser } = useAuth();
  const location = useLocation();
  const [userRoles, setUserRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const obtenerPermisosUsuario = async () => {
      if (currentUser && currentUser.email) {
        try {
          const response = await fetch(
            `http://localhost:5217/api/Permiso/leer-permiso-usuario/${encodeURIComponent(currentUser.email)}`
          );
          if (!response.ok) {
            throw new Error('Error al obtener los permisos del usuario');
          }
          const permisosData = await response.json();

          // Función recursiva para extraer los nombres de todos los permisos
          const extraerNombresPermisos = (permisos) => {
            let nombres = [];
            for (const permiso of permisos) {
              nombres.push(permiso.nombrePermiso);
              if (permiso.permisosHijos && permiso.permisosHijos.length > 0) {
                nombres = nombres.concat(extraerNombresPermisos(permiso.permisosHijos));
              }
            }
            console.log("nombres:"+nombres)
            return nombres;
          };

          const permisosUsuario = extraerNombresPermisos(permisosData);
          setUserRoles(permisosUsuario);
        } catch (error) {
          console.error('Error al obtener los permisos del usuario:', error);
          // Maneja el error según sea necesario
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    obtenerPermisosUsuario();
  }, [currentUser]);

  if (isLoading) {
    // Puedes mostrar un indicador de carga aquí si lo deseas
    return null;
  }

  if (!currentUser) {
    alert('No puedes entrar aquí si no tienes permiso'); // Alerta al usuario
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && !userRoles.includes(requiredRole)) {
    console.log('Rol requerido:', requiredRole, 'Roles del usuario:', userRoles);
    alert('No tienes el rol necesario para acceder a esta página'); // Alerta al usuario
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default PrivateRoute;
