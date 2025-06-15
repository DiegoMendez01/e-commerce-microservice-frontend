import React, { useState, useEffect, useMemo } from 'react';
import './Customer.css';
import { fetchCustomers, searchCustomers, deleteCustomer } from '../../api/Customer/apiCustomer';
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

export default function Customer() {
    const [customers, setCustomers] = useState([]);
    const [originalCustomers, setOriginalCustomers] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

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
                const data = await fetchCustomers(request);
                setCustomers(data || []);
                setOriginalCustomers(data || []);
                setErrorMessage('');
            } catch (error) {
                console.error('Error al cargar los clientes:', error);
                setCustomers([]);
                setOriginalCustomers([]);
                setErrorMessage(t.errorLoadingCustomers);
            }
        };

        loadData();
    }, [location, request, t.errorLoadingCustomers]);

    const handleSearch = async (query) => {
        resetPage();
        if (!query) {
            setCustomers(originalCustomers);
            setErrorMessage('');
            return;
        }
        try {
            const results = await searchCustomers(query, request);
            setCustomers(results);
            setErrorMessage('');
        } catch (error) {
            console.error('Error en búsqueda:', error);
            setCustomers([]);
            setErrorMessage(t.noSearchResults);
        }
    };

    const openDeleteModal = (customer) => {
        setSelectedCustomer(customer);
        setIsModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsModalOpen(false);
        setSelectedCustomer(null);
    };

    const handleDeleteConfirm = async () => {
        if (!selectedCustomer) return;

        let verb, message;

        try {
            await deleteCustomer(selectedCustomer.id, request);

            const entityName = t.customer || 'Customer';
            const gender = t.customerGender || 'o';

            const getGenderedVerb = (baseVerb) => `${baseVerb}${gender}`;

            const getMessage = (template, verb) =>
                template.replace('%s', entityName).replace('%v', verb);

            verb = getGenderedVerb('eliminad');
            message = getMessage(t.deletedSuccessfully, verb);

            setCustomers(prev =>
                prev.filter(cat => cat.id !== selectedCustomer.id)
            );
            setOriginalCustomers(prev =>
                prev.filter(cat => cat.id !== selectedCustomer.id)
            );

            closeDeleteModal();
            showToast(message);
        } catch (error) {
            console.error('Error eliminando el cliente:', error);
        }
    };

    const handleFilterChange = (accessor, value) => {
        setFilters(prev => ({
            ...prev,
            [accessor]: value
        }));
        resetPage();
    };

    const getDeepValue = (obj, path) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    const filteredCustomers = useMemo(() => {
        return customers.filter(customer => {
            return Object.entries(filters).every(([key, filterValue]) => {
                if (!filterValue) return true;
                const customerValue = getDeepValue(customer, key);
                if (customerValue === null || customerValue === undefined) return false;
                return normalizeText(String(customerValue)).includes(normalizeText(filterValue));
            });
        });
    }, [customers, filters]);

    const columns = [
        { label: t.firstName, accessor: 'firstName', filter: true, sortable: true },
        { label: t.lastName, accessor: 'lastName', filter: true, sortable: true },
        {
            label: t.street,
            accessor: 'address.street',
            filter: true,
            render: (row) => row?.address?.street || ''
        },
        {
            label: t.houseNumber,
            accessor: 'address.houseNumber',
            filter: false,
            render: (row) => row?.address?.houseNumber || ''
        },
        {
            label: t.zipCode,
            accessor: 'address.zipCode',
            filter: true,
            render: (row) => row?.address?.zipCode || ''
        }
    ];

    const actions = [
        {
            icon: 'fas fa-edit',
            label: t.edit,
            onClick: (row) => navigate(`/customers/edit/${row.id}`)
        },
        {
            icon: 'fas fa-trash',
            label: t.delete,
            variant: 'danger',
            onClick: (row) => openDeleteModal(row)
        }
    ];

    const sortedCustomers = useMemo(() => {
        if (!sortConfig.key) return filteredCustomers;

        return [...filteredCustomers].sort((a, b) => {
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
    }, [filteredCustomers, sortConfig]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = Array.isArray(sortedCustomers) ? sortedCustomers.slice(indexOfFirstItem, indexOfLastItem) : [];

    return (
        <>
            <div className="page-customer">
                <SearchBar onSearch={handleSearch} />
                <Breadcrumb
                    paths={[
                        { label: t.home, to: '/' },
                        { label: t.customers }
                    ]}
                />
                <div>
                    <HeadingH2>{t.customers}</HeadingH2>
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
                    ) : customers.length === 0 ? (
                        <div className="error-message">{t.noCustomer}</div>
                    ) : (
                        <>
                            <div className='button-container'>
                                <Button
                                    variant="outline"
                                    size="md"
                                    title={t.create}
                                    onClick={() => navigate('/customers/create')}
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
                                totalItems={filteredCustomers.length}
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
                        .replace('%type%', t.customer.toLowerCase())
                        .replace('%name%', `${selectedCustomer?.firstName} ${selectedCustomer?.lastName}`)}
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