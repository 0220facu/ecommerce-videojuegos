import React, { useState, useEffect } from "react";
import Logo from "../../Img/logo.png";
import PersonIcon from "@mui/icons-material/Person";
import { Button } from "@radix-ui/themes";
import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import classNames from "classnames";
import "./Homepage.css";
import NavMenu from "../../components/NavMenu/NavMenu";
import Carousel from "react-bootstrap/Carousel";
import SlideImg from "../../Img/slide.jpg";
import ProductCard from "../../components/ProductCard/ProductCard";
import Footer from "../../components/Footer/Footer";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  const verificarIntegridad = async () => {
    try {
      const response = await fetch(
        "http://localhost:5217/api/Registro/verificar-registro"
      );
      const data = await response.json();
      if (response.ok) {
      } else {
        navigate("error");
      }
    } catch (error) {
      console.error("Error al verificar la integridad:", error);
      navigate("error");
    }
  };
  const verificarIntegridadProducto = async () => {
    try {
      const response = await fetch(
        "http://localhost:5217/api/Producto/verificar-producto"
      );
      const data = await response.json();
      if (response.ok) {
      } else {
        navigate("error");
      }
    } catch (error) {
      console.error("Error al verificar la integridad:", error);
      navigate("error");
    }
  };
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch(
          "http://localhost:5217/api/Producto/productos"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error("Error fetching products:", error.message);
      }
    };

    fetchProductos();
    verificarIntegridad();
    verificarIntegridadProducto();  
  }, []);

  return (
    <>
      <NavMenu />
      <div className="carrusel-contenedor">
        <Carousel>
          <Carousel.Item>
            <img className="carrusel-imagen" src={SlideImg} alt="First slide" />
            <Carousel.Caption>
              <h3>First slide label</h3>
              <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="carrusel-imagen"
              src={SlideImg}
              alt="Second slide"
            />
            <Carousel.Caption>
              <h3>Second slide label</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img className="carrusel-imagen" src={SlideImg} alt="Third slide" />
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
        {productos.map((producto, index) => (
          <ProductCard key={index} product={producto} />
        ))}
      </div>
      <Footer />
    </>
  );
};

export default Homepage;
