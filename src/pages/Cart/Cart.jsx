import React, { useState, useEffect } from "react";
import { useCart } from "../../hooks/useCart";
import { useHttp } from "../../hooks/useHttp";
import { createOrder } from "../../api/Order/apiOrder";
import Button from "../../components/Button/Button";
import "./Cart.css";
import HeadingH2 from "../../components/HeadingH2/HeadingH2";
import Translations from "../../Translations/Translations";
import { useLanguage } from "../../hooks/useLanguage";
import PaymentMethodSelect from "../../components/PaymentMethodSelect/PaymentMethodSelect";
import Modal from "../../components/Modal/Modal";
import { fetchCustomers } from "../../api/Customer/apiCustomer";

export default function Cart() {
    const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
    const { request, loading } = useHttp();
    const [localError, setLocalError] = useState(null);
    const [customerId, setCustomerId] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("PAYPAL");
    const [success, setSuccess] = useState(false);

    const [customers, setCustomers] = useState([]);

    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    const { language } = useLanguage();
    const t = Translations[language];

    const totalAmount = cart.reduce((acc, item) => acc + item.quantity * 10, 0);

    const handleOrder = async () => {
        if (!customerId || cart.length === 0) {
            setModalMessage(t.formIncomplete);
            setModalOpen(true);
            return;
        }

        const stockExceeded = cart.some(item => item.quantity > item.availableQuantity);
        if (stockExceeded) {
            setModalMessage(t.stockExceededMessage);
            setModalOpen(true);
            return;
        }

        const orderData = {
            reference: `ORD-${Date.now()}`,
            totalAmount,
            paymentMethod,
            customerId,
            products: cart.map(({ productId, quantity }) => ({ productId, quantity })),
        };

        try {
            await createOrder(orderData, request);
            clearCart();
            setSuccess(true);
            setLocalError(false);
        } catch (e) {
            console.error("Error al crear orden:", e);
            setSuccess(false);
            setLocalError(true);
        }
    };

    useEffect(() => {
        const loadCustomers = async () => {
            try {
                const data = await fetchCustomers(request);
                setCustomers(data);
            } catch (error) {
                console.error("Error al cargar clientes:", error);
            }
        };

        loadCustomers();
    }, [request]);

    useEffect(() => {
        if (success) {
            const timeout = setTimeout(() => setSuccess(false), 3000);
            return () => clearTimeout(timeout);
        }
    }, [success]);

    return (
        <div className="cart-page">
            <div className="cart-items">
                <div>
                    <HeadingH2>{t.cart}</HeadingH2>
                </div>
                {cart.length === 0 ? (
                    <p>{t.emptyCart}</p>
                ) : (
                    cart.map(item => (
                        <div className="cart-item-card" key={item.productId}>
                            <div className="cart-item-info">
                                <div className="cart-item-name">{item.name}</div>
                            </div>
                            <div className="cart-item-controls">
                                <input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={e =>
                                        updateQuantity(item.productId, Math.max(1, parseInt(e.target.value)))
                                    }
                                />
                                <Button variant="outline" title={t.removeButton} onClick={() => removeFromCart(item.productId)}>{t.removeButton}</Button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="cart-summary">
                <h3>{t.orderSummary}</h3>
                <p>{t.totalLabel}: <strong>${totalAmount.toFixed(2)}</strong></p>

                <select
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                >
                    <option value="">{t.firstItemSelect}</option>
                    {customers.map(customer => (
                        <option key={customer.id} value={customer.id}>
                            {customer.firstName} {customer.lastName}
                        </option>
                    ))}
                </select>

                <PaymentMethodSelect value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} />

                <Button
                    onClick={handleOrder}
                    disabled={!customerId || cart.length === 0 || loading}
                    variant="outline"
                    title={t.confirmOrder}
                >
                    {t.confirmOrder}
                </Button>

                {loading && <p>{t.processingOrder}</p>}
                {!loading && localError && <p className="error">{t.orderError}</p>}
                {!loading && success && !localError && <p className="success">{t.orderSuccess}</p>}
            </div>
            <Modal
                isOpen={modalOpen}
                title={
                    modalMessage === t.formIncomplete
                        ? t.orderError
                        : t.stockExceededTitle || t.orderError
                }
                onClose={() => setModalOpen(false)}
                cancelText={t.closeButton}
            >
                <p>{modalMessage}</p>
            </Modal>
        </div>
    );
}