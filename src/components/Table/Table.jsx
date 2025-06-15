import React, { useState, useMemo, useEffect } from 'react';
import './Table.css';
import { useLanguage } from '../../hooks/useLanguage';
import Translations from '../../Translations/Translations';

export default function Table({ columns = [], data = [], actions = [] }) {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const { language } = useLanguage();
    const t = Translations[language];

    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleSort = (accessor) => {
        const col = columns.find(c => c.accessor === accessor);
        if (!col?.sortable) return;

        setSortConfig((prev) => {
            if (prev.key === accessor) {
                return {
                    key: accessor,
                    direction: prev.direction === 'asc' ? 'desc' : 'asc'
                };
            }
            return { key: accessor, direction: 'asc' };
        });
    };

    const sortedData = useMemo(() => {
        if (!sortConfig.key) return data;

        return [...data].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue === null || aValue === undefined) return 1;
            if (bValue === null || bValue === undefined) return -1;

            const aStr = String(aValue).toLowerCase();
            const bStr = String(bValue).toLowerCase();

            if (aStr < bStr) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aStr > bStr) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [data, sortConfig]);

    return (
        <div className="table-container">
            {!isMobile ? (
                <table className="table">
                    <thead>
                        <tr>
                            {columns.map(col => (
                                <th key={col.accessor} style={{ cursor: col.sortable ? 'pointer' : 'default' }}>
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
                        {sortedData.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {columns.map(col => (
                                    <td key={col.accessor}>
                                        {col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
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
                    {sortedData.map((row, rowIndex) => (
                        <div key={`card-${rowIndex}`} className="card-row">
                            {columns.map(col => (
                                <div className="card-field" key={col.accessor}>
                                    <div className="card-field-label">{col.label}:</div>
                                    <div className="card-field-value">
                                        {col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
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