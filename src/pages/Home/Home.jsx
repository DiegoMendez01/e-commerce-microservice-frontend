import React, { useEffect, useState } from 'react';
import { fetchProducts, searchProducts } from '../../api/api';
import ProductCard from '../../components/ProductCard/ProductCard';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import SearchBar from '../../components/SearchBar/SearchBar';
import './Home.css';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);

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
      return;
    }
    try {
      const results = await searchProducts(query);
      setProducts(results);
    } catch (error) {
      console.error('Error en búsqueda:', error);
    }
  };


  return (
    <div className="home">
      <SearchBar onSearch={handleSearch} />
      <Breadcrumb paths={[{ label: 'Inicio', to: '/' }]} />

      <h2>Productos</h2>
      <div className="product-list">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}