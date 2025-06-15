import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useHttp } from '../../hooks/useHttp';
import Spinner from '../../components/Spinner/Spinner';
import HeadingH2 from '../../components/HeadingH2/HeadingH2';
import './Invoice.css';
import { fetchOrderLineById } from '../../api/Order/OrderLines/apiOrderLine';
import { fetchOrderById } from '../../api/Order/apiOrder';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { useLanguage } from '../../hooks/useLanguage';
import Translations from '../../Translations/Translations';
import { fetchProductById } from '../../api/Product/apiProduct';
import { fetchCustomerById } from '../../api/Customer/apiCustomer';

export default function Invoice() {
    const { id } = useParams();
    const { request, error } = useHttp();
    const [orderLines, setOrderLines] = useState([]);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const [productNames, setProductNames] = useState({});
    const [customerName, setCustomerName] = useState('');

    const { language } = useLanguage();
    const t = Translations[language];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [orderData, lines] = await Promise.all([
                    fetchOrderById(id, request),
                    fetchOrderLineById(id, request)
                ]);
                setOrder(orderData);
                setOrderLines(Array.isArray(lines) ? lines : []);

                if (orderData?.customerId) {
                    const customer = await fetchCustomerById(orderData.customerId, request);
                    if (customer) {
                        setCustomerName(`${customer.firstName} ${customer.lastName}`);
                    }
                }

                const productIds = [...new Set(lines.map((l) => l.productId))];
                const productFetches = productIds.map((pid) =>
                    fetchProductById(pid, request).then(product => [pid, product.name])
                );
                const productEntries = await Promise.all(productFetches);
                setProductNames(Object.fromEntries(productEntries));
            } catch (err) {
                console.error('Error loading invoice details:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, request]);

    const totalQuantity = Array.isArray(orderLines)
        ? orderLines.reduce((sum, item) => sum + item.quantity, 0)
        : 0;

    const orderLinesWithPrice = Array.isArray(orderLines)
        ? orderLines.map((line) => {
            const unitPrice =
                totalQuantity > 0
                    ? (order.totalAmount * (line.quantity / totalQuantity)) / line.quantity
                    : 0;
            return { ...line, unitPrice };
        })
        : [];

    return (
        <div className="invoice-page">
            <Breadcrumb
                paths={[
                    { label: t.home, to: '/' },
                    { label: t.orders, to: '/orders' },
                    { label: t.invoiceView }
                ]}
            />
            <HeadingH2>{t.invoiceView} #{id}</HeadingH2>

            {loading ? (
                <Spinner />
            ) : error || !order ? (
                <div className="error-message">{t.failedInvoice}</div>
            ) : (
                <>
                    <div className="invoice-header">
                        <p><strong>{t.reference}:</strong> {order.reference}</p>
                        <p><strong>{t.paymentMethod}:</strong> {order.paymentMethod}</p>
                        <p><strong>{t.customer}:</strong> {customerName || order.customerId}</p>
                        <p><strong>{t.totalAmount}:</strong> ${order.totalAmount.toFixed(2)}</p>
                    </div>

                    {orderLines.length === 0 ? (
                        <div className="error-message">{t.noInvoice}</div>
                    ) : (
                        <table className="invoice-table">
                            <thead>
                                <tr>
                                    <th>{t.product}</th>
                                    <th>{t.quantityLabel}</th>
                                    <th>{t.priceLabel}</th>
                                    <th>{t.subtotal}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderLinesWithPrice.map((line) => (
                                    <tr key={line.id}>
                                        <td>{productNames[line.productId] || `${t.product} #${line.productId}`}</td>
                                        <td>{line.quantity}</td>
                                        <td>${line.unitPrice.toFixed(2)}</td>
                                        <td>${(line.quantity * line.unitPrice).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="3" className="total-label">{t.totalLabel}</td>
                                    <td className="total-value">${order.totalAmount.toFixed(2)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    )}
                </>
            )}
        </div>
    );
}