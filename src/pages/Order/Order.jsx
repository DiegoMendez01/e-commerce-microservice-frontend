import React, { useState, useEffect, useMemo } from 'react';
import './Order.css';
import { fetchOrders } from '../../api/Order/apiOrder';
import { fetchCustomerById } from '../../api/Customer/apiCustomer';
import { useLanguage } from '../../hooks/useLanguage';
import Translations from '../../Translations/Translations';
import HeadingH2 from '../../components/HeadingH2/HeadingH2';
import Table from '../../components/Table/Table';
import Pagination from '../../components/Pagination/Pagination';
import usePagination from '../../hooks/usePagination';
import { useNavigate, useLocation } from 'react-router-dom';
import Toast from '../../components/Toast/Toast';
import FiltersBar from '../../components/FiltersBar/FiltersBar';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { useHttp } from '../../hooks/useHttp';
import Spinner from '../../components/Spinner/Spinner';
import { normalizeText } from '../../utils/text';

export default function Order() {
    const [orders, setOrders] = useState([]);

    const { request, error } = useHttp();

    const [filters, setFilters] = useState({});

    const [dataLoaded, setDataLoaded] = useState(false);

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


    const location = useLocation();
    const [toast, setToast] = useState(location.state?.toast || null);

    const { currentPage, setCurrentPage, resetPage } = usePagination();
    const itemsPerPage = 5;

    const navigate = useNavigate();

    const { language } = useLanguage();
    const t = Translations[language];

    useEffect(() => {
        const loadData = async () => {
            try {
                const rawOrders = await fetchOrders(request);
                const ordersWithCustomer = await Promise.all(
                    rawOrders.map(async (order) => {
                        try {
                            const customer = await fetchCustomerById(order.customerId, request);
                            return {
                                ...order,
                                customerName: `${customer.firstName} ${customer.lastName}`
                            };
                        } catch {
                            return {
                                ...order,
                                customerName: t.customerUnknown
                            };
                        }
                    })
                );

                setOrders(ordersWithCustomer);
            } catch (error) {
                console.error('Error al cargar las órdenes:', error);
            } finally {
                setDataLoaded(true);
            }
        };

        loadData();
    }, [location, request, t.customerUnknown]);

    const handleFilterChange = (accessor, value) => {
        setFilters(prev => ({
            ...prev,
            [accessor]: value
        }));
        resetPage();
    };

    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            return Object.entries(filters).every(([key, filterValue]) => {
                if (!filterValue) return true;
                const orderValue = order[key];
                if (orderValue === null || orderValue === undefined) return false;
                return normalizeText(String(orderValue)).includes(normalizeText(filterValue));
            });
        });
    }, [orders, filters]);

    const columns = [
        { label: t.reference, accessor: 'reference', filter: true, sortable: true },
        { label: t.totalAmount, accessor: 'totalAmount', filter: true, sortable: true },
        { label: t.paymentMethod, accessor: 'paymentMethod', filter: true, sortable: true },
        { label: t.customer, accessor: 'customerName', filter: true, sortable: true },
    ];

    const actions = [
        {
            icon: 'fas fa-eye',
            label: t.view,
            onClick: (row) => navigate(`/orders/${row.id}`)
        },
    ];

    const sortedOrders = useMemo(() => {
        if (!sortConfig.key) return filteredOrders;

        return [...filteredOrders].sort((a, b) => {
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
    }, [filteredOrders, sortConfig]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = Array.isArray(sortedOrders) ? sortedOrders.slice(indexOfFirstItem, indexOfLastItem) : [];

    return (
        <>
            <div className="page-order">
                <Breadcrumb
                    paths={[
                        { label: t.home, to: '/' },
                        { label: t.orders }
                    ]}
                />
                <div>
                    <HeadingH2>{t.orders}</HeadingH2>
                </div>

                {!dataLoaded ? (
                    <Spinner />
                ) : error ? (
                    <div className="error-message">
                        {t.errorLoadingOrders || 'Error loading orders'}
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="error-message">{t.noOrder}</div>
                ) : (
                    <>
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
                            totalItems={filteredOrders.length}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}
            </div>

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