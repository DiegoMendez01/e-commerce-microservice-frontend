import React, { useEffect, useState } from 'react';
import { fetchProducts, searchProducts } from '../../api/Product/apiProduct';
import ProductCard from '../../components/ProductCard/ProductCard';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import SearchBar from '../../components/SearchBar/SearchBar';
import './Home.css';
import Pagination from '../../components/Pagination/Pagination';
import usePagination from '../../hooks/usePagination';
import { useLanguage } from '../../hooks/useLanguage';
import Translations from '../../Translations/Translations';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const { currentPage, setCurrentPage, resetPage } = usePagination();
  const itemsPerPage = 5;

  const { language } = useLanguage();
  const t = Translations[language];

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
    resetPage();
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
      setErrorMessage(t.noSearchResults);
    }
  };

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="home">
      <SearchBar onSearch={handleSearch} />
      <Breadcrumb paths={[{ label: 'Inicio', to: '/' }]} />

      <h2>{t.products}</h2>
      {errorMessage ? (
        <div className="error-message">{errorMessage}</div>
      ) : products.length === 0 ? (
        <div className="error-message">{t.noProducts}</div>
      ) : (
        <>
          <div className="product-list">
            {currentItems.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Pagination
            totalItems={products.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
}