import React, { useState, useEffect } from 'react';
import "./Bitacora.css";
import { DataGrid } from "@mui/x-data-grid";
import NavMenu from "../../components/NavMenu/NavMenu";
import GenerarUsuariosDesdeXML from '../Register/GenerarUsuariosDesdeXML';
import { Button } from '@mui/material';
import translationService from '../../services/translationService';

const Bitacora = () => {
  const [rows, setRows] = useState([]); // Estado para almacenar las filas de datos
  const [language, setLanguage] = useState(translationService.getLanguage());

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

  const columns = [
    { field: "act", headerName: translationService.translate('accion'), width: 600 },
    { field: "user", headerName: translationService.translate('usuario'), width: 200 },
    { field: "date", headerName: translationService.translate('fecha'), width: 150 },
  ];

  // Función para escapar caracteres especiales en XML
  const escapeXML = (unsafe) => {
    return unsafe.replace(/[<>&'"]/g, function (c) {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  };

  // Función para exportar los datos a un archivo XML
  const handleExportToXML = () => {
    // Construir el string XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<registros>\n';

    rows.forEach((row) => {
      xml += '  <registro>\n';
      xml += `    <act>${escapeXML(row.act)}</act>\n`;
      xml += `    <user>${escapeXML(row.user)}</user>\n`;
      xml += `    <date>${escapeXML(row.date)}</date>\n`;
      xml += '  </registro>\n';
    });

    xml += '</registros>';

    // Crear un Blob con el contenido XML
    const blob = new Blob([xml], { type: 'application/xml' });

    // Crear un enlace y desencadenar la descarga
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'registros.xml';
    document.body.appendChild(link); // Añadir el enlace al DOM
    link.click();
    document.body.removeChild(link); // Remover el enlace del DOM

    // Limpiar el objeto URL
    URL.revokeObjectURL(link.href);
  };

  return (
    <>
      <NavMenu/>
      <div style={{ height: '100%', width: '80%', margin: '10%' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleExportToXML}
          style={{ marginBottom: '10px' }}
        >
          {translationService.translate('exportarXML')}
        </Button>
        <DataGrid rows={rows} columns={columns} pageSize={10} />
        <GenerarUsuariosDesdeXML/>
      </div>
    </>
  );
};

export default Bitacora;
