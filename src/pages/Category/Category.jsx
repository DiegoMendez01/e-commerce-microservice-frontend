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
import Modal from '../../components/Modal/Modal';
import Button from '../../components/Button/Button';
import { useNavigate } from 'react-router-dom';

export default function Category() {
    const [categories, setCategories] = useState([]);
    const [originalProducts, setOriginalCategories] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const { currentPage, setCurrentPage, resetPage } = usePagination();
    const itemsPerPage = 5;

    const navigate = useNavigate();

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

    const openDeleteModal = (category) => {
        setSelectedCategory(category);
        setIsModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsModalOpen(false);
        setSelectedCategory(null);
    };

    const handleDeleteConfirm = () => {
        closeDeleteModal();
    };

    const columns = [
        { label: t.name, accessor: 'name', filter: true },
        { label: t.description, accessor: 'description', filter: true },
    ];

    const actions = [
        {
            icon: 'fas fa-edit',
            label: t.edit,
            onClick: (row) => navigate(`/categories/edit/${row.id}`)
        },
        {
            icon: 'fas fa-trash',
            label: t.delete,
            variant: 'danger',
            onClick: (row) => openDeleteModal(row)
        }
    ];

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = categories.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <>
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
                        <div className='button-container'>
                            <Button
                                variant="outline"
                                size="md"
                                title={t.create}
                                onClick={() => navigate('/categories/create')}
                            >
                                {t.create}
                            </Button>
                        </div>
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

            <Modal
                isOpen={isModalOpen}
                title={t.confirmDelete}
                icon="fa-trash"
                onClose={closeDeleteModal}
                onConfirm={handleDeleteConfirm}
                confirmText={t.confirm}
                cancelText={t.cancel}
            >
                <p>{t.deleteConfirmation.replace('%s', selectedCategory?.name)}</p>
            </Modal>
        </>
    );
}