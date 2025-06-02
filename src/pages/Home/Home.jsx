import React, { useEffect, useState } from 'react';
import { fetchProducts } from '../../api/api';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Home.css';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [productsData] = await Promise.all([
          fetchProducts()
        ]);
        setProducts(productsData);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    }
    loadData();
  }, []);

  return (
    <div className="home">
      <Breadcrumb 
        paths={[
          { label: 'Inicio', to: '/' }
        ]} 
      />

      <h2>Productos</h2>
      <div className="product-list">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}