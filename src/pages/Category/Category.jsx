import React, { useState, useEffect, useMemo } from 'react';
import './Category.css';
import { fetchCategories, searchCategories, deleteCategory } from '../../api/Category/apiCategory';
import { useLanguage } from '../../hooks/useLanguage';
import Translations from '../../Translations/Translations';
import HeadingH2 from '../../components/HeadingH2/HeadingH2';
import SearchBar from '../../components/SearchBar/SearchBar';
import Table from '../../components/Table/Table';
import Pagination from '../../components/Pagination/Pagination';
import usePagination from '../../hooks/usePagination';
import Modal from '../../components/Modal/Modal';
import Button from '../../components/Button/Button';
import { useNavigate, useLocation } from 'react-router-dom';
import Toast from '../../components/Toast/Toast';
import FiltersBar from '../../components/FiltersBar/FiltersBar';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { useHttp } from '../../hooks/useHttp';
import Spinner from '../../components/Spinner/Spinner';
import { normalizeText } from '../../utils/text';

export default function Category() {
    const [categories, setCategories] = useState([]);
    const [originalCategories, setOriginalCategories] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const { request, loading, error } = useHttp();

    const [filters, setFilters] = useState({});

    const location = useLocation();
    const [toast, setToast] = useState(location.state?.toast || null);

    const { currentPage, setCurrentPage, resetPage } = usePagination();
    const itemsPerPage = 5;

    const navigate = useNavigate();

    const { language } = useLanguage();
    const t = Translations[language];

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const handleSort = (accessor) => {
        const col = columns.find(c => c.accessor === accessor);
        if (!col?.sortable) return;

        setSortConfig((prev) => {
            if (prev.key === accessor) {
                return {
                    key: accessor,
                    direction: prev.direction === 'asc' ? 'desc' : 'asc'
                };
            }
            return { key: accessor, direction: 'asc' };
        });
    };

    useEffect(() => {
        const toastFromState = location?.state?.toast;

        if (toastFromState) {
            setToast(toastFromState);
            window.history.replaceState({}, '', window.location.pathname);
        }

        const loadData = async () => {
            try {
                const data = await fetchCategories(request);
                setCategories(data);
                setOriginalCategories(data);
            } catch (error) {
                console.error('Error al cargar las categorías:', error);
            }
        };

        loadData();
    }, [location, request]);

    const handleSearch = async (query) => {
        resetPage();
        if (!query) {
            setCategories(originalCategories);
            setErrorMessage('');
            return;
        }
        try {
            const results = await searchCategories(query, request);
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

    const handleDeleteConfirm = async () => {
        if (!selectedCategory) return;

        let verb, message;

        try {
            await deleteCategory(selectedCategory.id, request);

            const entityName = t.category || 'Category';
            const gender = t.categoryGender || 'a';

            const getGenderedVerb = (baseVerb) => `${baseVerb}${gender}`;

            const getMessage = (template, verb) =>
                template.replace('%s', entityName).replace('%v', verb);

            verb = getGenderedVerb('eliminad');
            message = getMessage(t.deletedSuccessfully, verb);

            setCategories(prev =>
                prev.filter(cat => cat.id !== selectedCategory.id)
            );
            setOriginalCategories(prev =>
                prev.filter(cat => cat.id !== selectedCategory.id)
            );

            closeDeleteModal();
            showToast(message);
        } catch (error) {
            console.error('Error eliminando la categoría:', error);
        }
    };

    const handleFilterChange = (accessor, value) => {
        setFilters(prev => ({
            ...prev,
            [accessor]: value
        }));
        resetPage();
    };

    const filteredCategories = useMemo(() => {
        return categories.filter(category => {
            return Object.entries(filters).every(([key, filterValue]) => {
                if (!filterValue) return true;
                const categoryValue = category[key];
                if (categoryValue === null || categoryValue === undefined) return false;
                return normalizeText(String(categoryValue)).includes(normalizeText(filterValue));
            });
        });
    }, [categories, filters]);

    const columns = [
        { label: t.name, accessor: 'name', filter: true, sortable: true },
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

    const sortedCategories = useMemo(() => {
        if (!sortConfig.key) return filteredCategories;

        return [...filteredCategories].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue === null || aValue === undefined) return 1;
            if (bValue === null || bValue === undefined) return -1;

            const aStr = String(aValue).toLowerCase();
            const bStr = String(bValue).toLowerCase();

            if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredCategories, sortConfig]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedCategories.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <>
            <div className="page-category">
                <SearchBar onSearch={handleSearch} />
                <Breadcrumb
                    paths={[
                        { label: t.home, to: '/' },
                        { label: t.categories }
                    ]}
                />
                <div>
                    <HeadingH2>{t.categories}</HeadingH2>
                </div>

                {loading && <Spinner />}

                {!loading && error && (
                    <div className="error-message">
                        {t.errorLoadingCategories || 'Error loading categories'}
                    </div>
                )}

                {!loading && !error && (
                    errorMessage ? (
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
                            <FiltersBar
                                columns={columns}
                                filters={filters}
                                onFilterChange={handleFilterChange}
                                translations={t}
                            />
                            <Table
                                columns={columns}
                                data={currentItems}
                                actions={actions}
                                onSort={handleSort}
                                sortConfig={sortConfig}
                            />
                            <Pagination
                                totalItems={filteredCategories.length}
                                itemsPerPage={itemsPerPage}
                                currentPage={currentPage}
                                onPageChange={setCurrentPage}
                            />
                        </>
                    )
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
                <p>
                    {t.deleteConfirmation
                        .replace('%type%', t.category.toLowerCase())
                        .replace('%name%', selectedCategory?.name)}
                </p>
            </Modal>
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </>
    );
}