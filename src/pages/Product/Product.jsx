import React, { useState, useEffect, useMemo } from 'react';
import './Product.css';
import { fetchProducts, searchProducts, deleteProduct } from '../../api/Product/apiProduct';
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

export default function Product() {
    const [products, setProducts] = useState([]);
    const [originalProducts, setOriginalProducts] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

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
                const data = await fetchProducts(request);
                setProducts(data);
                setOriginalProducts(data);
            } catch (error) {
                console.error('Error al cargar los productos:', error);
            }
        };

        loadData();
    }, [location, request]);

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

    const openDeleteModal = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedProduct) return;

        let verb, message;

        try {
            await deleteProduct(selectedProduct.id, request);

            const entityName = t.product || 'Product';
            const gender = t.productGender || 'o';

            const getGenderedVerb = (baseVerb) => `${baseVerb}${gender}`;

            const getMessage = (template, verb) =>
                template.replace('%s', entityName).replace('%v', verb);

            verb = getGenderedVerb('eliminad');
            message = getMessage(t.deletedSuccessfully, verb);

            setProducts(prev =>
                prev.filter(cat => cat.id !== selectedProduct.id)
            );
            setOriginalProducts(prev =>
                prev.filter(cat => cat.id !== selectedProduct.id)
            );

            closeDeleteModal();
            showToast(message);
        } catch (error) {
            console.error('Error eliminando el producto:', error);
        }
    };

    const handleFilterChange = (accessor, value) => {
        setFilters(prev => ({
            ...prev,
            [accessor]: value
        }));
        resetPage();
    };

    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            return Object.entries(filters).every(([key, filterValue]) => {
                if (!filterValue) return true;
                const productValue = product[key];
                if (productValue === null || productValue === undefined) return false;
                return normalizeText(String(productValue)).includes(normalizeText(filterValue));
            });
        });
    }, [products, filters]);

    const columns = [
        { label: t.name, accessor: 'name', filter: true, sortable: true },
        { label: t.availableQuantity, accessor: 'availableQuantity', filter: true },
        { label: t.price, accessor: 'price', filter: true, sortable: true },
        { label: t.categoryName, accessor: 'categoryName', filter: true },
    ];

    const actions = [
        {
            icon: 'fas fa-edit',
            label: t.edit,
            onClick: (row) => navigate(`/products/edit/${row.id}`)
        },
        {
            icon: 'fas fa-trash',
            label: t.delete,
            variant: 'danger',
            onClick: (row) => openDeleteModal(row)
        }
    ];

    const sortedProducts = useMemo(() => {
        if (!sortConfig.key) return filteredProducts;

        return [...filteredProducts].sort((a, b) => {
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
    }, [filteredProducts, sortConfig]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedProducts.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <>
            <div className="page-product">
                <SearchBar onSearch={handleSearch} />
                <Breadcrumb
                    paths={[
                        { label: t.home, to: '/' },
                        { label: t.products }
                    ]}
                />
                <div>
                    <HeadingH2>{t.products}</HeadingH2>
                </div>

                {loading && <Spinner />}

                {!loading && error && (
                    <div className="error-message">
                        {t.errorLoadingProducts || 'Error loading products'}
                    </div>
                )}

                {!loading && !error && (
                    errorMessage ? (
                        <div className="error-message">{errorMessage}</div>
                    ) : products.length === 0 ? (
                        <div className="error-message">{t.noProduct}</div>
                    ) : (
                        <>
                            <div className='button-container'>
                                <Button
                                    variant="outline"
                                    size="md"
                                    title={t.create}
                                    onClick={() => navigate('/products/create')}
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
                                totalItems={filteredProducts.length}
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
                        .replace('%type%', t.product.toLowerCase())
                        .replace('%name%', selectedProduct?.name)}
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