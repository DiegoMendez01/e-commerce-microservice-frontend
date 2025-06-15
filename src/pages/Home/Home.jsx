import React, { useEffect, useState } from 'react';
import { fetchProducts, searchProducts } from '../../api/Product/apiProduct';
import ProductCard from '../../components/ProductCard/ProductCard';
import SearchBar from '../../components/SearchBar/SearchBar';
import './Home.css';
import Pagination from '../../components/Pagination/Pagination';
import usePagination from '../../hooks/usePagination';
import { useLanguage } from '../../hooks/useLanguage';
import Translations from '../../Translations/Translations';
import HeadingH2 from '../../components/HeadingH2/HeadingH2';
import { useHttp } from '../../hooks/useHttp';
import Spinner from '../../components/Spinner/Spinner';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  const { currentPage, setCurrentPage, resetPage } = usePagination();
  const itemsPerPage = 5;

  const { request, loading, error } = useHttp();

  const { language } = useLanguage();
  const t = Translations[language];

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchProducts(request);
        setProducts(data);
        setOriginalProducts(data);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      }
    }
    loadData();
  }, [request]);

  const handleSearch = async (query) => {
    resetPage();
    if (!query) {
      setProducts(originalProducts);
      setErrorMessage('');
      return;
    }
    try {
      const results = await searchProducts(query, request);
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
  const currentItems = Array.isArray(products) ? products.slice(indexOfFirstItem, indexOfLastItem) : [];

  return (
    <div className="home">
      <SearchBar onSearch={handleSearch} />

      <div>
        <HeadingH2>{t.store}</HeadingH2>
      </div>
      {loading && <Spinner />}

      {!loading && error && (
        <div className="error-message">
          {t.errorLoadingCustomers || 'Error loading customers'}
        </div>
      )}

      {!loading && !error && (
        errorMessage ? (
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
        )
      )}
    </div>
  );
}