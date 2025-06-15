import React, { useState, useEffect } from 'react';
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

export default function Product() {
    const [products, setProducts] = useState([]);
    const [originalProducts, setOriginalProducts] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

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

    useEffect(() => {
        const toastFromState = location?.state?.toast;

        if (toastFromState) {
            setToast(toastFromState);
            window.history.replaceState({}, '', window.location.pathname);
        }

        const loadData = async () => {
            try {
                const data = await fetchProducts();
                setProducts(data);
                setOriginalProducts(data);
            } catch (error) {
                console.error('Error al cargar los productos:', error);
            }
        };

        loadData();
    }, [location]);

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

    const openDeleteModal = (category) => {
        setSelectedProduct(category);
        setIsModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedProduct) return;

        const deletedName = selectedProduct.name;

        try {
            await deleteProduct(selectedProduct.id);

            setProducts(prev =>
                prev.filter(cat => cat.id !== selectedProduct.id)
            );
            setOriginalProducts(prev =>
                prev.filter(cat => cat.id !== selectedProduct.id)
            );

            closeDeleteModal();
            showToast(`${deletedName || ''} ${t.deletedSuccessfully}`);
        } catch (error) {
            console.error('Error eliminando el producto:', error);
        }
    };

    const columns = [
        { label: t.name, accessor: 'name', filter: true },
        { label: t.description, accessor: 'description', filter: true },
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

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <>
            <div className="page-product">
                <SearchBar onSearch={handleSearch} />
                <div>
                    <HeadingH2>{t.products}</HeadingH2>
                </div>
                {errorMessage ? (
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
                        <Table columns={columns} data={currentItems} actions={actions} />
                        <Pagination
                            totalItems={products.length}
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
                <p>{t.deleteConfirmation.replace('%s', selectedProduct?.name)}</p>
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