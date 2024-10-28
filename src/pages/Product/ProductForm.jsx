import React, { useState, useEffect } from 'react';
import './ProductForm.css';  // Asegúrate de copiar los estilos relevantes de Login.css o Register.css a ProductForm.css
import Logo from '../../Img/logo.png';  // Asume que usas el mismo logo para consistencia
import NavMenu from "../../components/NavMenu/NavMenu";

const ProductForm = ({ product = null, onSubmitSuccess }) => {
  const [nombre, setNombre] = useState('');
  const [esConsola, setEsConsola] = useState(false);
  const [precioUnitario, setPrecioUnitario] = useState(0);
  const [stock, setStock] = useState(0);
  const [imagen, setImagen] = useState('');  

  useEffect(() => {
    if (product) {
      setNombre(product.nombre);
      setEsConsola(product.esConsola);
      setPrecioUnitario(product.precioUnitario);
      setStock(product.stock);
      setImagen(product.imagen);  
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = product ? 'http://localhost:5217/api/Producto/actualizar' : 'http://localhost:5217/api/Producto/insertar';
    const method = product ? 'PUT' : 'POST';
    const data = { Producto_Id: product?.producto_Id?product?.producto_Id :0 ,nombre, esConsola,esVideojuego:!esConsola, precioUnitario, stock ,imagen,Descripcion:"" };

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        alert('Producto creado con exito');
      } else {
        alert('Error al guardar el producto. Intente de nuevo.');
      }
    } catch (error) {
      alert('Error de conexión con el servidor');
    }
  };

  return (<>
  <NavMenu />
    <div className='flex-column'>
      <form className='form-login' onSubmit={handleSubmit}>
        <div className="imgcontainer">
          <img src={Logo} alt="Logo" className="avatar" />
        </div>

        <div className="container login-inputs">
          <label htmlFor="nombre"><b>Nombre</b></label>
          <input type="text" placeholder="Nombre del Producto" className='input-login' name="nombre" value={nombre} onChange={e => setNombre(e.target.value)} required />
          <label htmlFor="imagen">
          <b>Imagen URL</b>
        </label>
        <input
          type="text"
          placeholder="URL de la imagen"
          className='input-login'
          name="imagen"
          value={imagen}
          onChange={e => setImagen(e.target.value)}
          required
        />
          <label htmlFor="precioUnitario"><b>Precio Unitario</b></label>
          <input type="number" placeholder="Precio Unitario" className='input-login' name="precioUnitario" value={precioUnitario} onChange={e => setPrecioUnitario(parseFloat(e.target.value))} required />

          <label htmlFor="stock"><b>Stock</b></label>
          <input type="number" placeholder="Cantidad de Stock" className='input-login' name="stock" value={stock} onChange={e => setStock(parseInt(e.target.value, 10))} required />

          <fieldset>
            <legend><b>Tipo de Producto</b></legend>
            <label>
              <input type="radio" name="productType" checked={esConsola === true} onChange={() => setEsConsola(true)} />
              Consola
            </label>
            <label>
              <input type="radio" name="productType" checked={esConsola === false} onChange={() => setEsConsola(false)} />
              Videojuego
            </label>
          </fieldset>

          <button className='login-button' type="submit">{product ? 'Actualizar' : 'Agregar'}</button>
        </div>
      </form>
    </div></>
  );
};

export default ProductForm;
