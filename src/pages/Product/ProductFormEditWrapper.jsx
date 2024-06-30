import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductForm from './ProductForm';

const ProductFormEditWrapper = () => {
  const location = useLocation();
  const [product, setProduct] = useState(location.state.product); // Asume que el estado tiene el producto

  return (
    <div>
      <h1>Editar Producto</h1>
      <ProductForm product={product} />
    </div>
  );
}

export default ProductFormEditWrapper;
