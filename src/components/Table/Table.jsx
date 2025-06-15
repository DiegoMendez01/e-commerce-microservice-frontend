import React, { useState, useEffect } from 'react';
import './Table.css';
import { useLanguage } from '../../hooks/useLanguage';
import Translations from '../../Translations/Translations';

export default function Table({ columns = [], data = [], actions = [], onSort, sortConfig = {} }) {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const { language } = useLanguage();
    const t = Translations[language];

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSort = (accessor) => {
        if (onSort) onSort(accessor);
    };

    return (
        <div className="table-container">
            {!isMobile ? (
                <table className="table">
                    <thead>
                        <tr>
                            {columns.map(col => (
                                <th key={col.accessor}>
                                    <div className="th-content">
                                        <span className="th-label">
                                            {col.label}
                                            {col.sortable && (
                                                <i
                                                    className={`fas ${sortConfig.key === col.accessor
                                                            ? sortConfig.direction === 'asc'
                                                                ? 'fa-sort-up'
                                                                : 'fa-sort-down'
                                                            : 'fa-sort'
                                                        } sort-icon`}
                                                    onClick={() => handleSort(col.accessor)}
                                                    style={{ cursor: 'pointer' }}
                                                    role="button"
                                                    tabIndex={0}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' || e.key === ' ') {
                                                            e.preventDefault();
                                                            handleSort(col.accessor);
                                                        }
                                                    }}
                                                    aria-label={`Sort by ${col.label}`}
                                                />
                                            )}
                                        </span>
                                    </div>
                                </th>
                            ))}
                            {actions.length > 0 && (
                                <th className="th-actions" style={{ backgroundColor: 'var(--btn-primary-bg)', color: 'var(--btn-primary-fg)' }}>
                                    {t.actions}
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {columns.map(col => (
                                    <td key={col.accessor}>
                                        {col.render ? col.render(row) : row[col.accessor]}
                                    </td>
                                ))}
                                {actions.length > 0 && (
                                    <td>
                                        {actions.map((action, i) => (
                                            <button
                                                key={i}
                                                title={action.label}
                                                className={`btn btn--${action.variant || 'primary'}`}
                                                onClick={() => action.onClick(row)}
                                            >
                                                {action.icon && <i className={action.icon} aria-hidden="true" />}
                                            </button>
                                        ))}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="mobile-cards">
                    {data.map((row, rowIndex) => (
                        <div key={`card-${rowIndex}`} className="card-row">
                            {columns.map(col => (
                                <div className="card-field" key={col.accessor}>
                                    <div className="card-field-label">{col.label}:</div>
                                    <div className="card-field-value">
                                        {col.render ? col.render(row) : row[col.accessor]}
                                    </div>
                                </div>
                            ))}
                            {actions.length > 0 && (
                                <div className="card-actions">
                                    {actions.map((action, i) => (
                                        <button
                                            key={i}
                                            title={action.label}
                                            className={`btn btn--${action.variant || 'primary'}`}
                                            onClick={() => action.onClick(row)}
                                        >
                                            {action.icon && <i className={action.icon} aria-hidden="true" />}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}