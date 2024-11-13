import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext"; // Importa correctamente tu contexto de autenticación
import "./NavMenu.css";
import Logo from "../../Img/logo.png";
import PersonIcon from "@mui/icons-material/Person";
import { Button } from "@radix-ui/themes";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import AddBoxIcon from "@mui/icons-material/AddBox";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import ExitToAppIcon from "@mui/icons-material/ExitToApp"; // Icono para cerrar sesión
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket"; // Icono para "Comprar"
import LanguageSwitcher from "../Translation/LanguageSwitcher";
import { Spin } from "antd";

// Importa el servicio de traducción
import translationService from '../../services/translationService';

const NavMenu = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth(); // Asume que este hook retorna el estado de autenticación del usuario y la función para cerrar sesión

  const [userRoles, setUserRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [language, setLanguage] = useState(translationService.getLanguage());

  useEffect(() => {
    const obtenerPermisosUsuario = async () => {
      if (currentUser && currentUser.email) {
        try {
          const response = await fetch(
            `http://localhost:5217/api/Permiso/leer-permiso-usuario/${encodeURIComponent(
              currentUser.email
            )}`
          );
          if (!response.ok) {
            throw new Error("Error al obtener los permisos del usuario");
          }
          const permisosData = await response.json();

          // Función recursiva para extraer los nombres de todos los permisos
          const extraerNombresPermisos = (permisos) => {
            let nombres = [];
            for (const permiso of permisos) {
              nombres.push(permiso.nombrePermiso);
              if (permiso.permisosHijos && permiso.permisosHijos.length > 0) {
                nombres = nombres.concat(
                  extraerNombresPermisos(permiso.permisosHijos)
                );
              }
            }
            return nombres;
          };

          const permisosUsuario = extraerNombresPermisos(permisosData);
          setUserRoles(permisosUsuario);
        } catch (error) {
          console.error(
            "Error al obtener los permisos del usuario:",
            error
          );
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

  // Suscribirse al servicio de traducción para actualizar el idioma y re-renderizar el componente
  useEffect(() => {
    const observer = {
      update: (newLanguage) => {
        setLanguage(newLanguage);
      },
    };
    translationService.subscribe(observer);
    return () => {
      translationService.unsubscribe(observer);
    };
  }, []);

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <Spin tip={translationService.translate('cargandoPermisos')} />
      </div>
    );
  }

  const tienePermiso = (permisoRequerido) => {
    return userRoles.includes(permisoRequerido);
  };

  return (
    <nav>
      <div className="navbar-custom">
        <figure className="logo-nombre" onClick={() => navigate("/")}>
          <img className="logo" src={Logo} alt="E-commerce logo" />
          <h1 className="nombre">{translationService.translate('ecommerce')}</h1>
        </figure>
        <div className="login-button-nav">
          <LanguageSwitcher />
          {currentUser ? (
            <>
              {/* Mostrar botones basados en los permisos del usuario */}
              {tienePermiso("Web Master") && (
                <Button className="ms-3" onClick={() => navigate("/gestorDb")}>
                  <AddBoxIcon />
                  {translationService.translate('gestorWebmaster')}
                </Button>
              )}
              {tienePermiso("Alta") && (
                <>
                  <Button onClick={() => navigate("/add-product")}>
                    <AddBoxIcon />
                    {translationService.translate('crearProducto')}
                  </Button></>
                )}
                {tienePermiso("Idioma") && (
                <>
                  <Button className="ms-3"onClick={() => navigate("/idiomas")}>
                    <AddBoxIcon />
                    {translationService.translate('Idiomas')}
                  </Button></>
                )}
                {tienePermiso("Bitacora") && (
                <>
                  <Button
                    style={{ marginLeft: "10px" }}
                    onClick={() => navigate("/bitacora")}
                  >
                    <AutoStoriesIcon />
                    {translationService.translate('bitacora')}
                  </Button>
                  </>
                     )}

                  {tienePermiso("Permisos") && (  <> <Button
                    style={{ marginLeft: "10px" }}
                    onClick={() => navigate("/permisos")}
                  >
                    <AutoStoriesIcon />
                    {translationService.translate('permisos')}
                  </Button>
                </>
              )}
              {tienePermiso("Usuario") && (
                <>
                  <Button
                    style={{ marginLeft: "10px" }}
                    onClick={() => navigate("/carrito")}
                  >
                    <ShoppingCartIcon />
                    {translationService.translate('carrito')}
                  </Button>
                  <Button
                    style={{ marginLeft: "10px" }}
                    onClick={() => navigate("/comprar")}
                  >
                    <ShoppingBasketIcon />
                    {translationService.translate('comprar')}
                  </Button>
                </>
              )}
              {/* Botón para cerrar sesión */}
              <Button
                style={{
                  marginLeft: "10px",
                  backgroundColor: "red",
                  color: "white",
                }}
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                <ExitToAppIcon />
                {translationService.translate('cerrarSesion')}
              </Button>
            </>
          ) : (
            // Si el usuario no está autenticado, mostrar botones de inicio de sesión y registro
            <>
              <Button onClick={() => navigate("/login")}>
                <PersonIcon />
                {translationService.translate('iniciarSesion')}
              </Button>
              <Button
                style={{ marginLeft: "10px" }}
                onClick={() => navigate("/register")}
              >
                <PersonAddIcon />
                {translationService.translate('registrarse')}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="menu">
        <NavigationMenu.Root className="NavigationMenuRoot">
          <NavigationMenu.List className="NavigationMenuList">
            {/* Aquí puedes añadir elementos adicionales al menú si lo deseas */}
          </NavigationMenu.List>
        </NavigationMenu.Root>
      </div>
    </nav>
  );
};

export default NavMenu;
