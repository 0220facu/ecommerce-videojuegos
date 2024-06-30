import React from 'react';
import { useAuth } from '../../context/AuthContext'; // Importa correctamente tu contexto de autenticación
import './NavMenu.css';
import Logo from "../../Img/logo.png";
import PersonIcon from "@mui/icons-material/Person";
import { Button } from "@radix-ui/themes";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import AddBoxIcon from '@mui/icons-material/AddBox';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // Icono para cerrar sesión
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
const NavMenu = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth(); // Asume que este hook retorna el estado de autenticación del usuario y la función para cerrar sesión

  return (
    <nav>
      <div className="navbar-custom">
        <figure className="logo-nombre" onClick={() => navigate('/')}>
          <img className="logo" src={Logo} alt="E-commerce logo" />
          <h1 className="nombre">Ecommerce</h1>
        </figure>
        <div className="login-button-nav">
          {currentUser ? (
            <>
              <Button onClick={() => navigate("/add-product")}>
                <AddBoxIcon />
                Crear Producto
              </Button>
              <Button style={{marginLeft: "10px"}} onClick={() => navigate("/bitacora")}>
                <AutoStoriesIcon />
                Bitácora
              </Button>
              <Button style={{marginLeft: "10px"}} onClick={() => navigate("/carrito")}>
                <ShoppingCartIcon />
                Carrito
              </Button>
              <Button style={{marginLeft: "10px", backgroundColor: "red", color: "white"}} onClick={() => {
                logout();
                navigate('/login');
              }}>
                <ExitToAppIcon />
                Cerrar sesión
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => navigate("/login")}>
                <PersonIcon />
                Iniciar sesión
              </Button>
              <Button style={{marginLeft: "10px"}} onClick={() => navigate("/register")}>
                <PersonAddIcon />
                Registrarse
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="menu">
        <NavigationMenu.Root className="NavigationMenuRoot">
          <NavigationMenu.List className="NavigationMenuList">
            {/* Aquí irían los elementos adicionales del menú, similar a la estructura que ya tienes */}
          </NavigationMenu.List>
        </NavigationMenu.Root>
      </div>
    </nav>
  );
};

export default NavMenu;
