import { useState } from "react";
import viteLogo from "/vite.svg";
import "./styles/styles.css";
import { Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage/Homepage";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Bitacora from "./pages/Bitacora/Bitacora";
import ProductForm from './pages/Product/ProductForm'; 
import ProductFormEditWrapper from './pages/Product/ProductFormEditWrapper'; 
import PrivateRoute from './components/PrivateRoute/PrivateRoute.jsx';
import Carrito from "./pages/Carrito/Carrito.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/bitacora" element={<PrivateRoute><Bitacora /></PrivateRoute>} />
        <Route path="/add-product" element={<PrivateRoute><ProductForm /></PrivateRoute>} />
        <Route path="/edit-product/:productId" element={<PrivateRoute><ProductFormEditWrapper /></PrivateRoute>} />
        <Route path="/carrito" element={<PrivateRoute><Carrito /></PrivateRoute>} />

      </Routes>
    </>
  );
}

export default App;
