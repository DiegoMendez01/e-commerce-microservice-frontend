import React, { useState } from "react";
import { useCart } from "../../hooks/useCart";
import { useHttp } from "../../hooks/useHttp";
import { createOrder } from "../../api/Order/apiOrder";
import Button from "../../components/Button/Button";
import "./Cart.css";
import HeadingH2 from "../../components/HeadingH2/HeadingH2";
import Translations from "../../Translations/Translations";
import { useLanguage } from "../../hooks/useLanguage";

export default function Cart() {
    const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
    const { request, loading, error } = useHttp();
    const [customerId, setCustomerId] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("PAYPAL");
    const [success, setSuccess] = useState(false);

    const { language } = useLanguage();
    const t = Translations[language];

    const totalAmount = cart.reduce((acc, item) => acc + item.quantity * 10, 0);

    const handleOrder = async () => {
        const orderData = {
            reference: `ORD-${Date.now()}`,
            totalAmount,
            paymentMethod,
            customerId,
            products: cart.map(({ productId, quantity }) => ({ productId, quantity })),
        };

        try {
            const id = await createOrder(orderData, request);
            clearCart();
            setSuccess(true);
            console.log("Orden enviada. ID:", id);
        } catch (e) {
            console.error("Error al crear orden:", e);
        }
    };

    return (
        <div className="cart-page">
            <div className="cart-items">
                <div>
                    <HeadingH2>{t.cart}</HeadingH2>
                </div>
                {cart.length === 0 ? (
                    <p>Tu carrito está vacío.</p>
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
                                        updateQuantity(item.productId, parseInt(e.target.value))
                                    }
                                />
                                <Button onClick={() => removeFromCart(item.productId)}>Eliminar</Button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="cart-summary">
                <h3>Resumen del Pedido</h3>
                <p>Total: <strong>${totalAmount.toFixed(2)}</strong></p>

                <input
                    placeholder="ID del Cliente"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                />

                <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                    <option value="PAYPAL">PayPal</option>
                    <option value="CREDIT_CARD">Credit Card</option>
                    <option value="VISA">Visa</option>
                    <option value="MASTERCARD">Mastercard</option>
                    <option value="BITCOIN">Bitcoin</option>
                </select>

                <Button
                    onClick={handleOrder}
                    disabled={!customerId || cart.length === 0 || loading}
                >
                    Confirmar Orden
                </Button>

                {loading && <p>Procesando orden...</p>}
                {error && <p className="error">Error al enviar la orden.</p>}
                {success && <p className="success">¡Orden creada exitosamente!</p>}
            </div>
        </div>
    );
}