import React, { useState, useEffect } from 'react';
import './Category.css';
import { fetchCategories, searchCategories } from '../../api/Category/apiCategory';
import { useLanguage } from '../../hooks/useLanguage';
import Translations from '../../Translations/Translations';
import HeadingH2 from '../../components/HeadingH2/HeadingH2';
import SearchBar from '../../components/SearchBar/SearchBar';

export default function Home() {
    const [categories, setCategories] = useState([]);
    const [originalProducts, setOriginalCategories] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const { language } = useLanguage();
    const t = Translations[language];

    useEffect(() => {
        async function loadData() {
            try {
                const data = await fetchCategories();
                setCategories(data);
                setOriginalCategories(data);
            } catch (error) {
                console.error('Error al cargar las categorías:', error);
            }
        }
        loadData();
    }, []);

    const handleSearch = async (query) => {
        if (!query) {
            setCategories(originalProducts);
            setErrorMessage('');
            return;
        }
        try {
            const results = await searchCategories(query);
            setCategories(results);
            setErrorMessage('');
        } catch (error) {
            console.error('Error en búsqueda:', error);
            setCategories([]);
            setErrorMessage(t.noSearchResults);
        }
    };

    // Paginación

    return (
        <div className="page-category">
            <SearchBar onSearch={handleSearch} />
            <div>
                <HeadingH2>{t.categories}</HeadingH2>
            </div>
            {errorMessage ? (
                <div className="error-message">{errorMessage}</div>
            ) : categories.length === 0 ? (
                <div className="error-message">{t.noCategory}</div>
            ) : (
                <>
                    
                </>
            )}
        </div>
    );
}