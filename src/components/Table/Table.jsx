import React, { useState, useMemo, useEffect } from 'react';
import './Table.css';
import { useLanguage } from '../../hooks/useLanguage';
import Translations from '../../Translations/Translations';

export default function Table({ columns = [], data = [], actions = [] }) {
    const [filters, setFilters] = useState({});
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const { language } = useLanguage();
    const t = Translations[language];

    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleFilterChange = (e, accessor) => {
        setFilters(prev => ({ ...prev, [accessor]: e.target.value }));
    };

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

    const filteredData = useMemo(() => {
        let filtered = data.filter(row =>
            columns.every(col => {
                const filter = filters[col.accessor];
                if (!filter) return true;
                const value = String(row[col.accessor] ?? '').toLowerCase();
                return value.includes(filter.toLowerCase());
            })
        );

        if (sortConfig.key) {
            filtered = [...filtered].sort((a, b) => {
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
        }

        return filtered;
    }, [filters, data, columns, sortConfig]);

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
                                <th key={col.accessor} style={{ cursor: col.sortable ? 'default' : 'default' }}>
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
                                        {col.filter && (
                                            <input
                                                type="text"
                                                className="filter-input"
                                                placeholder={`${t.filter} ${col.label}`}
                                                value={filters[col.accessor] || ''}
                                                onChange={e => handleFilterChange(e, col.accessor)}
                                                onClick={e => e.stopPropagation()}
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