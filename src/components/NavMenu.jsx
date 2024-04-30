import Logo from "../Img/logo.png";
import PersonIcon from "@mui/icons-material/Person";
import { Button } from "@radix-ui/themes";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import classNames from "classnames";
import React from 'react';

const NavMenu = () => {
  return (
    <nav>
      <div className="navbar-custom">
        <img className="logo" src={Logo} />
        <div className="login-button-nav">
          <Button>
            <PersonIcon />
            Iniciar sesión
          </Button>
        </div>
      </div>
      <div className="menu">
      <NavigationMenu.Root className="NavigationMenuRoot">
      <NavigationMenu.List className="NavigationMenuList">

        <NavigationMenu.Item>
          <NavigationMenu.Trigger className="NavigationMenuTrigger">
            Articulos 
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="NavigationMenuContent">
            <ul className="List two">
              <ListItem title="Perifericos" href="">
                Auriculares, mouse ,teclados, etc...
              </ListItem>
              <ListItem title="Sillas gamer" href="">
                Las sillas mas comodas
              </ListItem>
              <ListItem title="Consolas" href="">
                Consolas de videojuegos
              </ListItem>
              <ListItem title="Componentes" href="">
                Fuentes, placas madre, memorias, procesadores, etc...
              </ListItem>
              <ListItem title="Impresoras" href="">
                Impresoras y escanners para oficinas
              </ListItem>
              <ListItem title="Monitores" href="">
                Monitores y televisores.
              </ListItem>
            </ul>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger className="NavigationMenuTrigger">
            Juegos 
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="NavigationMenuContent">
            <ul className="List two">
              <ListItem title="Introduction" href="">
                Build high-quality, accessible design systems and web apps.
              </ListItem>
              <ListItem title="Getting started" href="">
                A quick tutorial to get you up and running with Radix Primitives.
              </ListItem>
              <ListItem title="Styling" href="">
                Unstyled and compatible with any styling solution.
              </ListItem>
              <ListItem title="Animation" href="">
                Use CSS keyframes or any animation library of your choice.
              </ListItem>
              <ListItem title="Accessibility" href="">
                Tested in a range of browsers and assistive technologies.
              </ListItem>
              <ListItem title="Releases" href="">
                Radix Primitives releases and their changelogs.
              </ListItem>
            </ul>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link className="NavigationMenuLink" href="">
            Carrito
          </NavigationMenu.Link>
        </NavigationMenu.Item>

        <NavigationMenu.Indicator className="NavigationMenuIndicator">
          <div className="Arrow" />
        </NavigationMenu.Indicator>
      </NavigationMenu.List>

      <div className="ViewportPosition">
        <NavigationMenu.Viewport className="NavigationMenuViewport" />
      </div>
    </NavigationMenu.Root>
      </div>
    </nav>
  );
};
const ListItem = React.forwardRef(({ className, children, title, ...props }, forwardedRef) => (
  <li>
    <NavigationMenu.Link asChild>
      <a className={classNames('ListItemLink', className)} {...props} ref={forwardedRef}>
        <div className="ListItemHeading">{title}</div>
        <p className="ListItemText">{children}</p>
      </a>
    </NavigationMenu.Link>
  </li>
));

export default NavMenu;
