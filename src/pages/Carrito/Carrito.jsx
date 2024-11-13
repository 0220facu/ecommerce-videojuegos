import React, { useState, useEffect } from 'react';
import { DataGrid } from "@mui/x-data-grid";
import { useAuth } from '../../context/AuthContext';
import NavMenu from "../../components/NavMenu/NavMenu";
import { Button } from "@mui/material"; // Importa Button de Material-UI

const Carrito = () => {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const { currentUser,agregarRegistro } = useAuth();

  useEffect(() => {
    if (currentUser) {
      const fetchData = async () => {
        try {
          const response = await fetch(`http://localhost:5217/api/Carrito/leer/${currentUser.email}`);
          const productos = await response.json();

          const processedRows = productos.map((producto, index) => ({
            id: producto.producto_Id,
            nombre: producto.nombre,
            tipo: producto.esConsola ? "Consola" : "Videojuego",
            precioUnitario: producto.precioUnitario,
            stock: producto.stock,
            descripcion: producto.descripcion || "No disponible"
          }));

          setRows(processedRows);
          // Calcula el total
          const totalSum = productos.reduce((acc, producto) => acc + producto.precioUnitario * producto.stock, 0);
          setTotal(totalSum);
        } catch (error) {
          console.error("Error al cargar los productos del carrito:", error);
        }
      };

      fetchData();
    }
  }, [currentUser]);

  const columns = [
    { field: 'nombre', headerName: 'Nombre', width: 200 },
    { field: 'tipo', headerName: 'Tipo', width: 120 },
    { field: 'precioUnitario', headerName: 'Precio Unitario', width: 130 },
    { field: 'stock', headerName: 'Cantidad', width: 100 },
    { field: 'descripcion', headerName: 'Descripción', width: 200, flex: 1 },
  ];

  const handlePurchase = async () => {
    // Realiza las peticiones de eliminación para cada item
    for (const row of rows) {
      try {
        const response = await fetch('http://localhost:5217/api/Carrito/eliminar', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ usuarioEmail: currentUser.email, productoId: row.id })
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error al eliminar el producto del carrito:", error);
        return;
      }
    }
    // Limpia el carrito después de la compra y muestra alerta
    agregarRegistro("Realizó una compra por "+ total)
    setRows([]);
    setTotal(0);
    alert("Compra realizada");
  };

  return (
    <>
      <NavMenu/>
      <div style={{ height: '80%', width: '80%', margin: '10%' }}>
        {rows.length > 0 ? (
          <>
            <DataGrid rows={rows} columns={columns} pageSize={10} />
            <div style={{ margin: '20px 0' }}>
              <h2>Total del Carrito: ${total.toFixed(2)}</h2>
              <Button variant="contained" color="primary" onClick={handlePurchase}>Comprar</Button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h2>No tiene ítems en su carrito, no dude en comprar.</h2>
          </div>
        )}
      </div>
    </>
  );
};

export default Carrito;
