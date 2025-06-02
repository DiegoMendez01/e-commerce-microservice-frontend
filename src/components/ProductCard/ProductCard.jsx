import React from 'react';
import './ProductCard.css';
import lightIcon from '../../assets/comercio-electronico-negro.svg';
import darkIcon from '../../assets/comercio-electronico.svg';
import useDarkMode from '../../hooks/useDarkMode';

export default function ProductCard({ product }) {
  const isDark = useDarkMode();
  const { name, price, availableQuantity, description, categoryName } = product;
  const icon   = isDark ? darkIcon : lightIcon;

  return (
    <div className="product-card">
      <img src={icon} alt="Producto" className="product-image" />
      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        <p className="product-description">{description}</p>
        <p className="product-price">Precio: ${price.toFixed(2)}</p>
        <p className="product-category"><strong>Categoría:</strong> {categoryName}</p>
        <p className={`product-stock ${availableQuantity > 0 ? 'in-stock' : 'out-stock'}`}>
          {availableQuantity > 0 ? `Cantidad: ${availableQuantity}` : 'Agotado'}
        </p>
        <button className="buy-button" disabled={availableQuantity === 0}>
          Comprar
        </button>
      </div>
    </div>
  );
}