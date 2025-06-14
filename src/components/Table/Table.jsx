import React, { useState, useMemo, useEffect } from 'react';
import './Table.css';
import { useLanguage } from '../../hooks/useLanguage';
import Translations from '../../Translations/Translations';

export default function Table({ columns = [], data = [], actions = [] }) {
    const [filters, setFilters] = useState({});
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const { language } = useLanguage();
    const t = Translations[language];

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleFilterChange = (e, accessor) => {
        setFilters(prev => ({ ...prev, [accessor]: e.target.value }));
    };

    const filteredData = useMemo(() => {
        return data.filter(row =>
            columns.every(col => {
                const filter = filters[col.accessor];
                if (!filter) return true;
                const value = String(row[col.accessor] ?? '').toLowerCase();
                return value.includes(filter.toLowerCase());
            })
        );
    }, [filters, data, columns]);

    return (
        <div className="table-container">
            {isMobile && (
                <div className="mobile-filters">
                    {columns.map(col => (
                        col.filter && (
                            <div key={col.accessor} className="mobile-filter-group">
                                <label className="mobile-filter-label">
                                    {col.label}
                                </label>
                                <input
                                    type="text"
                                    className="filter-input"
                                    placeholder={`${t.filter} ${col.label}`}
                                    value={filters[col.accessor] || ''}
                                    onChange={e => handleFilterChange(e, col.accessor)}
                                />
                            </div>
                        )
                    ))}
                </div>
            )}

            {!isMobile ? (
                <table className="table">
                    <thead>
                        <tr>
                            {columns.map(col => (
                                <th key={col.accessor}>
                                    <div className="th-content">
                                        {col.label}
                                        {col.filter && (
                                            <input
                                                type="text"
                                                className="filter-input"
                                                placeholder={`${t.filter} ${col.label}`}
                                                value={filters[col.accessor] || ''}
                                                onChange={e => handleFilterChange(e, col.accessor)}
                                            />
                                        )}
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
                        {filteredData.map((row, rowIndex) => (
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
                                                {action.icon && <i className={action.icon} aria-hidden="true" />} {action.label}
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
                    {filteredData.map((row, rowIndex) => (
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
                                            {action.icon && <i className={action.icon} aria-hidden="true" />} {action.label}
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