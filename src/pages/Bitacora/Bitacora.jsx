import React, { useState, useEffect } from 'react';
import "./Bitacora.css";
import { DataGrid } from "@mui/x-data-grid";
import NavMenu from "../../components/NavMenu/NavMenu";

const Bitacora = () => {
  const [rows, setRows] = useState([]); // Estado para almacenar las filas de datos

  useEffect(() => {
    // Función para cargar los datos del backend
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5217/api/Registro/leer');
        const registros = await response.json();

        // Procesar los datos recibidos para que coincidan con el formato esperado por DataGrid
        const processedRows = registros.map((registro, index) => ({
          id: index + 1, // Generar un ID único para cada fila
          act: registro.tipo,
          user: registro.usuario,
          date: new Date(registro.fecha).toLocaleDateString() // Formatear la fecha
        }));
        
        setRows(processedRows); // Actualizar el estado con los datos procesados
      } catch (error) {
        console.error("Error al cargar los registros:", error);
      }
    };

    fetchData(); // Llamar a la función al cargar el componente
  }, []); // El array vacío asegura que esto solo se ejecute una vez

  const columns = [
    { field: "act", headerName: "Acción", width: 600 },
    { field: "user", headerName: "Usuario", width: 200 },
    { field: "date", headerName: "Fecha", width: 150 },
  ];

  return (
    <>
    <NavMenu/>
    <div style={{ height: '100%', width: '80%',margin:'10%'  }}>
      <DataGrid rows={rows} columns={columns} pageSize={10} />
    </div>
    </>
  );
};

export default Bitacora;
