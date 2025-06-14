import React from 'react';
import './Button.css';

export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  title = null
}) {
  return (
    <button
      type={type}
      className={`btn btn--${variant} btn--${size}`}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {children}
    </button>
  );
}