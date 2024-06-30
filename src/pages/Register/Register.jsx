import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import Logo from "../../Img/logo.png";
import { useAuth } from '../../context/AuthContext'; // Importa tu hook de autenticación
import NavMenu from "../../components/NavMenu/NavMenu";

const Register = () => {
  const { register } = useAuth(); // Asume que tienes esta función en tu AuthContext
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Por favor ingrese un email válido.");
      return;
    }
    setError("");

    try {
      await register(email, password);
      alert("Registro exitoso!");
      navigate("/"); // Navegar a la página principal después de un registro exitoso
    } catch (error) {
      setError(error.message || "Error al registrar. Por favor intente más tarde.");
    }
  };

  return (
    <>
    <NavMenu />
      <div className="flex-column">
        <form className="form-login" onSubmit={handleSubmit}>
          <div className="imgcontainer">
            <img src={Logo} alt="Avatar" className="avatar" />
          </div>
          <h1 className='mx-auto text-center'>Registrarse</h1>

          <div className="container login-inputs">
            <label htmlFor="email"><b>Email</b></label>
            <input
              type="email"
              placeholder="Enter Email"
              className="input-login"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="psw"><b>Password</b></label>
            <input
              type="password"
              placeholder="Enter Password"
              name="psw"
              className="input-login"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <p className="form-err">{error}</p>}
            <button className="login-button" type="submit">Registrarse</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Register;
