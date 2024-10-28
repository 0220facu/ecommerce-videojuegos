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

} from "@mui/icons-material";
import NavMenu from "../../components/NavMenu/NavMenu";

function ErrorPage() {


  return (
    <>
    <NavMenu></NavMenu>
      <Container className="gestor-db-container" maxWidth="md">
        <Box
          className="error-message-box"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <ErrorOutline className="error-icon" />
          <Typography variant="h4" className="error-message">
            Por el momento el sistema no esta disponible, pruebe mas tarde
          </Typography>

        </Box>
      </Container>
    </>
  );
}

export default ErrorPage;
