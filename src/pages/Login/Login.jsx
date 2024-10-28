import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Asegúrate de importar correctamente el contexto
import './Login.css';
import Logo from "../../Img/logo.png";
import NavMenu from "../../components/NavMenu/NavMenu";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);  // Estado para mantener la sesión iniciada
  const [error, setError] = useState('');
  const { login } = useAuth(); // Usar la función login del contexto
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpiar errores previos
    try {
      await login(email, password, keepLoggedIn); // Pasar keepLoggedIn a la función login
      navigate('/'); // Navegar a la página de inicio después de un login exitoso
    } catch (error) {
      setError(error.message || 'Falló el inicio de sesión'); // Mostrar mensaje de error si falla el login
    }
  };

  return (
    <>
      <NavMenu></NavMenu>
      <div className='flex-column'>
        <form className='form-login' onSubmit={handleSubmit}>
          <div className="imgcontainer">
            <img src={Logo} alt="Avatar" className="avatar" />
          </div>
          <h1 className='mx-auto text-center'>Iniciar sesión</h1>

          <div className="container login-inputs">
            <label htmlFor="email"><b>Email</b></label>
            <input
              type="email"
              placeholder="Enter Email"
              className='input-login'
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {error && <p className='form-err'>{error}</p>}

            <label htmlFor="psw"><b>Password</b></label>
            <input
              type="password"
              placeholder="Enter Password"
              name="psw"
              className='input-login'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <label>
              <input
                type="checkbox"
                checked={keepLoggedIn}
                onChange={() => setKeepLoggedIn(!keepLoggedIn)}
              /> Mantener sesión iniciada
            </label>

            <button className='login-button' type="submit">Login</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
