import React, { useEffect } from 'react';
import './Toast.css';

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className={`toast toast--${type}`}>
            <span>{message}</span>
            <button className="toast-close" onClick={onClose}>×</button>
        </div>
    );
}