import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useHttp } from '../../hooks/useHttp';
import Spinner from '../../components/Spinner/Spinner';
import './Invoice.css';
import { fetchOrderLineById } from '../../api/Order/OrderLines/apiOrderLine';
import { fetchOrderById } from '../../api/Order/apiOrder';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { useLanguage } from '../../hooks/useLanguage';
import Translations from '../../Translations/Translations';
import { fetchProductById } from '../../api/Product/apiProduct';
import { fetchCustomerById } from '../../api/Customer/apiCustomer';
import html2pdf from 'html2pdf.js';
import Button from '../../components/Button/Button';
import { QRCodeCanvas } from 'qrcode.react';

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

    const handleDownloadPDF = () => {
        const element = document.getElementById('invoice-pdf');
        const options = {
            margin: 0.5,
            filename: `invoice-${id}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        html2pdf().set(options).from(element).save();
    };

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

    const qrMessage = `
        ${t.invoiceView} #${id}
        ${t.customer}: ${customerName || order?.customerId}
        ${t.totalLabel}: $${order?.totalAmount?.toFixed(2)}
        ${t.qrThanks || 'Gracias por tu compra'}
        `;

    return (
        <div className="invoice-page">
            <Breadcrumb
                paths={[
                    { label: t.home, to: '/' },
                    { label: t.orders, to: '/orders' },
                    { label: t.invoiceView }
                ]}
            />

            {loading ? (
                <Spinner />
            ) : error || !order ? (
                <div className="error-message">{t.failedInvoice}</div>
            ) : (
                <>
                    <div className="invoice-container" id="invoice-pdf">
                        <header className="invoice-top">
                            <div className="invoice-logo">
                                <h2>E-commerce</h2>
                                <Link to="/">
                                    www.e-commerce.com
                                </Link>
                            </div>
                            <div className="invoice-meta">
                                <h3>{t.invoiceView} #{id}</h3>
                                <p>{t.date}: {new Date().toLocaleDateString()}</p>
                                <p>{t.status}: {order.status || t.completed}</p>
                            </div>
                        </header>

                        <section className="invoice-info">
                            <div>
                                <h4>{t.customer}</h4>
                                <p>{customerName || order.customerId}</p>
                            </div>
                            <div>
                                <h4>{t.paymentMethod}</h4>
                                <p>{order.paymentMethod}</p>
                            </div>
                            <div>
                                <h4>{t.reference}</h4>
                                <p>{order.reference}</p>
                            </div>
                        </section>

                        <section className="invoice-lines">
                            <h4>{t.orderDetails}</h4>
                            {orderLinesWithPrice.map((line) => (
                                <div className="invoice-line" key={line.id}>
                                    <div className="product-info">
                                        <strong>{productNames[line.productId] || `${t.product} #${line.productId}`}</strong>
                                        <span>{t.quantityLabel}: {line.quantity}</span>
                                    </div>
                                    <div className="product-price">
                                        <span>${line.unitPrice.toFixed(2)} x {line.quantity}</span>
                                        <span className="subtotal">${(line.unitPrice * line.quantity).toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </section>

                        <footer className="invoice-footer">
                            <div className="total-label">{t.totalLabel}:</div>
                            <div className="total-amount">${order.totalAmount.toFixed(2)}</div>
                        </footer>

                        <div className="invoice-qr">
                            <h4>{t.qrLabel || 'Scan for details'}</h4>
                            <QRCodeCanvas
                                value={qrMessage}
                                size={128}
                                level="H"
                            />
                        </div>
                    </div>
                    <div className="pdf-button-container">
                        <Button variant="outline" title={t.downloadPDF} onClick={handleDownloadPDF}>
                            {t.downloadPDF}
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}