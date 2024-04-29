import { useState } from "react";
import viteLogo from "/vite.svg";
import "./styles/styles.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./pages/Homepage";
  
function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} ></Route>
      </Routes>
    </>
  );
}

export default App;
