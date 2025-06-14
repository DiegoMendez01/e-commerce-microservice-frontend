import React, { useState, useEffect } from 'react';
import './Category.css';
import { fetchCategories, searchCategories } from '../../api/Category/apiCategory';
import { useLanguage } from '../../hooks/useLanguage';
import Translations from '../../Translations/Translations';
import HeadingH2 from '../../components/HeadingH2/HeadingH2';
import SearchBar from '../../components/SearchBar/SearchBar';
import Table from '../../components/Table/Table';
import Pagination from '../../components/Pagination/Pagination';
import usePagination from '../../hooks/usePagination';

export default function Home() {
    const [categories, setCategories] = useState([]);
    const [originalProducts, setOriginalCategories] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const { currentPage, setCurrentPage, resetPage } = usePagination();
    const itemsPerPage = 5;

    const { language } = useLanguage();
    const t = Translations[language];

    useEffect(() => {
        async function loadData() {
            try {
                const data = await fetchCategories();
                console.log('Categorías cargadas:', data);
                setCategories(data);
                setOriginalCategories(data);
            } catch (error) {
                console.error('Error al cargar las categorías:', error);
            }
        }
        loadData();
    }, []);

    const handleSearch = async (query) => {
        resetPage();
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

    const columns = [
        { label: t.name, accessor: 'name', filter: true },
        { label: t.description, accessor: 'description', filter: true },
    ];

    const actions = [
        {
            icon: 'fas fa-eye',
            variant: 'outline',
            onClick: (row) => alert(`Ver categoría: ${row.name}`)
        },
        {
            icon: 'fas fa-edit',
            onClick: (row) => alert(`Editar categoría: ${row.name}`)
        },
        {
            icon: 'fas fa-trash',
            variant: 'danger',
            onClick: (row) => {
                if (window.confirm(`¿Eliminar la categoría ${row.name}?`)) {
                    // lógica de eliminación
                }
            }
        }
    ];

    // Paginación
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = categories.slice(indexOfFirstItem, indexOfLastItem);

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
                    <Table columns={columns} data={currentItems} actions={actions} />
                    <Pagination
                        totalItems={categories.length}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                    />
                </>
            )}
        </div>
    );
}