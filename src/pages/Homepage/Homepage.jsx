import Logo from "../../Img/logo.png";
import PersonIcon from "@mui/icons-material/Person";
import { Button } from "@radix-ui/themes";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import classNames from "classnames";
import "./Homepage.css";
import React from "react";
import NavMenu from "../../components/NavMenu/NavMenu";
import Carousel from "react-bootstrap/Carousel";
import SlideImg from "../../Img/slide.jpg";
import ProductCard from "../../components/ProductCard/ProductCard";
import Footer from "../../components/Footer/Footer";

const Homepage = () => {
  return (
    <>
      <NavMenu />
      <div className="carrusel-contenedor">
        <Carousel>
          <Carousel.Item>
            <img className="carrusel-imagen" src={SlideImg} />

            <Carousel.Caption>
              <h3>First slide label</h3>
              <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img className="carrusel-imagen" src={SlideImg} />

            <Carousel.Caption>
              <h3>Second slide label</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img className="carrusel-imagen" src={SlideImg} />

            <Carousel.Caption>
              <h3>Third slide label</h3>
              <p>
                Praesent commodo cursus magna, vel scelerisque nisl consectetur.
              </p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>
      <div className="productos-contenedor">
        {[...Array(12)].map((_, i) => (
          <ProductCard key={i} />
        ))}
      </div>
      <div>
        <Footer />
      </div>
    </>
  );
};

export default Homepage;
