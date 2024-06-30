import React from 'react';
import './ProductCard.css';
import { Box, Card, Inset, Text, Button } from "@radix-ui/themes";
import ImgTest from '../../Img/logo.png';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { currentUser, agregarRegistro } = useAuth();
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/edit-product/${product.producto_Id}`, { state: { product } });
  };

  const handleBuy = async () => {

    if (currentUser) {
      console.log(currentUser);
      try {
        const response = await fetch('http://localhost:5217/api/Carrito/insertar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ProductoId: product.producto_Id,
            UsuarioEmail: currentUser.email,
            Cantidad: 1
          })
        });
        if (response.ok) {
          agregarRegistro("Agrego el producto " + product.nombre + " al carrito.")
          alert("Producto añadido al carrito.");
        } else {
          alert("No se pudo añadir al carrito. Intente de nuevo.");
        }
      } catch (error) {
        console.error("Error al añadir al carrito:", error);
        alert("Error al conectar al servidor.");
      }
    } else {
      alert("Debes estar logueado para realizar compras.");
      navigate("/login");
    }
  };

  const handleDelete = async () => {
    if (currentUser) {
      if (window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
        try {
          const response = await fetch(`http://localhost:5217/api/Producto/eliminar/${product.producto_Id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
          });
          if (response.ok) {
            agregarRegistro("Elimino el producto " + product.nombre)
            alert("Producto eliminado correctamente.");
            window.location.reload();  // Recargar la página para reflejar el cambio
          } else {
            throw new Error("No se pudo eliminar el producto.");
          }
        } catch (error) {
          console.error("Error al eliminar el producto:", error);
          alert("Error al conectar al servidor.");
        }
      }
    } else {
      alert("Debes estar logueado para realizar esta acción.");
      navigate("/login");
    }
  };

  return (
    <Box maxWidth="240px">
      <Card size="2">
        <Inset clip="padding-box" side="top" pb="current">
          <img src={product.imagen || ImgTest} alt={product.nombre || "Imagen del producto"} style={{
              display: "block",
              objectFit: 'contain',
              width: "90%",
              marginLeft: '5%',
              height: 140
          }} />
        </Inset>
        <Text as='h4' size="5">
          {product.nombre || "Nombre del Producto"}
        </Text>
        <br />
        <Text as='h4' size="2">
          {product.descripcion || "Descripción del Producto"}
        </Text>
        <br />
        <Text color="green" as='h4' size="3">
          ${product.precioUnitario?.toFixed(2) || "Precio"}
        </Text>
        <br />
        <Button className='button-buy' color="green" variant="soft" onClick={handleBuy}>Comprar</Button>
        {currentUser && (
          <>
            <Button className='button-edit' color="blue" variant="soft" onClick={handleEdit}>Editar</Button>
            <Button className='button-delete' color="red" variant="soft" onClick={handleDelete}>Eliminar</Button>
          </>
        )}
      </Card>
    </Box>
  );
}

export default ProductCard;
