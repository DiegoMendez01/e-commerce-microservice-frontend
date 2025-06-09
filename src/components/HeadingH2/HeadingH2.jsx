import React from 'react';
import './HeadingH2.css';

export default function HeadingH2({ children }) {
    return (
        <h2 className="heading-h2">
            {children}
            <span className="heading-h2__underline"></span>
        </h2>
    );
}