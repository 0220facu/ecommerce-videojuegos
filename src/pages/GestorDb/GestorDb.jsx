import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Container,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import {
  ErrorOutline,
  Replay,
  Backup,
  Restore,
  CheckCircleOutline,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";
import NavMenu from "../../components/NavMenu/NavMenu";
import "./GestorDb.css";

function GestorDb() {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState("");
  const [error, setError] = useState(false);
  const [integrityMessage, setIntegrityMessage] = useState("");
  const [compromisedRecords, setCompromisedRecords] = useState([]);
  const [compromisedRecordsProducto, setCompromisedRecordsProducto] = useState(
    []
  );

  const handleClickOpen = (actionName) => {
    setAction(actionName);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const verificarIntegridad = async () => {
    try {
      const response = await fetch(
        "http://localhost:5217/api/Registro/verificar-registro"
      );
      const data = await response.json();
      if (response.ok) {
      } else {
        setIntegrityMessage(data.mensaje);
        console.log(data); // Asegúrate de que los datos se están imprimiendo correctamente aquí
        setCompromisedRecords(data.registrosComprometidos);
        setError(true);
      }
    } catch (error) {
      console.error("Error al verificar la integridad:", error);
      setError(true);
      setIntegrityMessage("Error al procesar la verificación de integridad.");
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
        setCompromisedRecordsProducto(data.registrosComprometidos);
        setError(true);
      }
    } catch (error) {
      console.error("Error al verificar la integridad:", error);
      setError(true);
      setIntegrityMessage("Error al procesar la verificación de integridad.");
    }
  };
  const handleConfirm = () => {
    switch (action) {
      case "recalcularProducto":
        recalcularDigitoProducto();
        window.location.reload();

        break;
      case "recalcularBitacora":
        recalcularDigitoBitacora();
        window.location.reload();

        break;
      case "backup":
        generarBackup();
        break;
      case "restore":
        restaurarBackup();
        break;
      default:
        console.log("Acción no reconocida");
    }
    setOpen(false);
  };

  const recalcularDigitoProducto = async () => {
    try {
      const response = await fetch(
        "http://localhost:5217/api/Producto/recalcular-y-guardar-digitos",
        { method: "POST" }
      );
      if (response.ok) {
        alert("Recálculo del dígito producto exitoso");
      } else {
        throw new Error("Error al recalcular dígito producto");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const recalcularDigitoBitacora = async () => {
    try {
      const response = await fetch(
        "http://localhost:5217/api/Registro/recalcular-y-guardar-digitos",
        { method: "POST" }
      );
      if (response.ok) {
        alert("Recálculo del dígito bitácora exitoso");
      } else {
        throw new Error("Error al recalcular dígito bitácora");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const generarBackup = async () => {
    try {
      const response = await fetch(
        "http://localhost:5217/api/BackupRestore/backup",
        { method: "POST" }
      );
      if (response.ok) {
        alert("Backup generado con éxito");
      } else {
        throw new Error("Error al generar backup");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const restaurarBackup = async () => {
    try {
      const response = await fetch(
        "http://localhost:5217/api/BackupRestore/restore?backupFilePath=C%3A%5C%5CBackup%5C%5CLPPA.bak",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ backupFilePath: "C:\\Backup\\LPPA.bak" }),
        }
      );
      if (response.ok) {
        alert("Backup restaurado con éxito");
      } else {
        throw new Error("Error al restaurar backup");
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    verificarIntegridad();
    verificarIntegridadProducto();
  }, []);
  return (
    <>
      <NavMenu />
      <Container className="gestor-db-container" maxWidth="md">
        {error ? (
          <Box
            className="error-message-box"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <ErrorOutline className="error-icon" />
            <Typography variant="h4" className="error-message">
              Ocurrió un error de integridad
            </Typography>

            {compromisedRecords?.map((record) => {
              return (
                <>
                {record.tipoDiscrepancia === "Registros eliminados" && (
                  <Typography variant="p" className="error-message">Se eliminaron {record.cantidadDiscrepancia} registros</Typography>
                )}
                {record.tipoDiscrepancia === "Registros agregados" && (
                  <Typography variant="p" className="error-message">Se agregaron {record.cantidadDiscrepancia} registros</Typography>
                )}
                {record.tipoDiscrepancia === "Dígito horizontal no coincide" && (
                  <Typography variant="p" className="error-message">
                    Se modifico el registro con id: {record.id} en la tabla  {record.tabla}
                  </Typography>
                )}
               </>
              );
            })}
            {compromisedRecordsProducto?.map((record) => {
              return (
                <>
                  {record.tipoDiscrepancia === "Productos eliminados" && (
                    <Typography variant="p" className="error-message">Se eliminaron {record.cantidadDiscrepancia} Productos</Typography>
                  )}
                  {record.tipoDiscrepancia === "Productos agregados" && (
                    <Typography variant="p" className="error-message">Se agregaron {record.cantidadDiscrepancia} Productos</Typography>
                  )}
                  {record.tipoDiscrepancia === "Dígito horizontal no coincide" && (
                    <Typography variant="p" className="error-message">
                      Se modifico el registro con id: {record.id} en la tabla  {record.tabla}
                    </Typography>
                  )}
                 </>
              );
            })}
          </Box>
        ) : (
          <Box
            className="success-message-box"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
          >
            <CheckCircleOutline className="success-icon" />
            <Typography variant="h4" className="success-message">
              La base de datos está en orden
            </Typography>
          </Box>
        )}

        <Box display="flex" justifyContent="center" mt={4}>
          {error && (
            <>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Replay />}
                className="button"
                onClick={() => handleClickOpen("recalcularProducto")}
              >
                Recalcular Dígito Producto
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Replay />}
                className="button"
                onClick={() => handleClickOpen("recalcularBitacora")}
              >
                Recalcular Dígito Bitacora
              </Button>
            </>
          )}

          <Button
            variant="contained"
            color="primary"
            startIcon={<Backup />}
            className="button"
            onClick={() => handleClickOpen("backup")}
          >
            Generar Backup
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Restore />}
            className="button"
            onClick={() => handleClickOpen("restore")}
          >
            Restaurar Backup
          </Button>
        </Box>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Confirmación</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Estás seguro de que quieres realizar la operación: {action}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleConfirm} color="primary" autoFocus>
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}

export default GestorDb;
