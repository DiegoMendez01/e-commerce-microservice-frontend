import React, { useEffect, useState } from 'react';
import { fetchProducts, searchProducts } from '../../api/api';
import ProductCard from '../../components/ProductCard/ProductCard';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import SearchBar from '../../components/SearchBar/SearchBar';
import './Home.css';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchProducts();
        setProducts(data);
        setOriginalProducts(data);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    }
    loadData();
  }, []);

  const handleSearch = async (query) => {
    if (!query) {
      setProducts(originalProducts);
      setErrorMessage('');
      return;
    }
    try {
      const results = await searchProducts(query);
      setProducts(results);
      setErrorMessage('');
    } catch (error) {
      console.error('Error en búsqueda:', error);
      setProducts([]);
      setErrorMessage('No se encontraron productos con ese nombre o categoría.');
    }
  };


  return (
    <div className="home">
      <SearchBar onSearch={handleSearch} />
      <Breadcrumb paths={[{ label: 'Inicio', to: '/' }]} />

      <h2>Productos</h2>
      {errorMessage ? (
        <div className="error-message">{errorMessage}</div>
      ) : products.length === 0 ? (
        <div className="error-message">No hay productos disponibles.</div>
      ) : (
        <div className="product-list">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}