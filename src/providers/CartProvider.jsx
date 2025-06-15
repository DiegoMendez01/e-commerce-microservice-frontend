import { useState } from "react";
import { CartContext } from "../contexts/CartContext";

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);

    const addToCart = (product, quantity = 1) => {
        setCart(prev => {
            const existing = prev.find(p => p.productId === product.id);
            if (existing) {
                return prev.map(p =>
                    p.productId === product.id
                        ? { ...p, quantity: p.quantity + quantity }
                        : p
                );
            }
            return [...prev, { productId: product.id, name: product.name, quantity }];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.productId !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        setCart(prev =>
            prev.map(item =>
                item.productId === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}