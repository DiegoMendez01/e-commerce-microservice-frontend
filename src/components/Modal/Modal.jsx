import React, { useEffect } from 'react';
import './Modal.css';
import Button from '../Button/Button';

export default function Modal({ isOpen, icon = 'fa-exclamation-triangle', title, children, onClose, onConfirm, confirmText, cancelText }) {
    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
        return () => document.body.classList.remove('modal-open');
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <div className="modal-header">
                    <h2><i className={`fas ${icon}`}></i> {title}</h2>
                    <button className="modal-close" onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
                <div className="modal-footer">
                    {cancelText && (
                        <Button variant="outline" onClick={onClose}>
                            {cancelText}
                        </Button>
                    )}
                    {confirmText && (
                        <Button variant="primary" onClick={onConfirm}>
                            {confirmText}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}