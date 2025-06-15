import { useState } from "react";
import { CartContext } from "../contexts/CartContext";

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);

    const addToCart = (product, quantity = 1) => {
        let stockExceeded = false;

        setCart(prev => {
            const existing = prev.find(p => p.productId === product.id);
            const currentQty = existing ? existing.quantity : 0;
            const newQty = currentQty + quantity;

            if (newQty > product.availableQuantity) {
                stockExceeded = true;
                return prev;
            }

            if (existing) {
                return prev.map(p =>
                    p.productId === product.id
                        ? { ...p, quantity: newQty }
                        : p
                );
            }

            return [...prev, {
                productId: product.id,
                name: product.name,
                quantity,
                availableQuantity: product.availableQuantity,
            }];
        });

        return stockExceeded;
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