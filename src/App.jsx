import { useState } from "react";
import viteLogo from "/vite.svg";
import "./styles/styles.css";
import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage/Homepage";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Bitacora from "./pages/Bitacora/Bitacora";
import ProductForm from "./pages/Product/ProductForm";
import ProductFormEditWrapper from "./pages/Product/ProductFormEditWrapper";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute.jsx";
import Carrito from "./pages/Carrito/Carrito.jsx";
import GestorDb from "./pages/GestorDb/GestorDb.jsx";
import theme from "./theme";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from '@mui/material/styles';
import ErrorPage from "./pages/ErrorPage/ErrorPage.jsx";
import Permisos from "./pages/Roles/Permisos.jsx";
import LanguageManager from "./pages/LanguageManager/LanguageManager.jsx";
function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        <Routes>
        <Route path="/error" element={<ErrorPage />} />
        <Route path="/permisos" element={<Permisos />} />

          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/bitacora"
            element={
              <PrivateRoute >
                <Bitacora />
              </PrivateRoute>
            }
          />
          <Route
            path="/add-product"
            element={
              <PrivateRoute requiredRole="Alta">
                <ProductForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-product/:productId"
            element={
              <PrivateRoute>
                <ProductFormEditWrapper />
              </PrivateRoute>
            }
          />
          <Route
            path="/carrito"
            element={
              <PrivateRoute>
                <Carrito />
              </PrivateRoute>
            }
          />
          <Route
            path="/gestorDb"
            element={
              // <PrivateRoute requiredRole="Web Master">
                <GestorDb />
              // </PrivateRoute>
            }
          />
          <Route
            path="/idiomas"
            element={
              // <PrivateRoute requiredRole="Web Master">
                <LanguageManager />
              // </PrivateRoute>
            }
          />
        </Routes>
        </ThemeProvider>
    </>
  );
}

export default App;
