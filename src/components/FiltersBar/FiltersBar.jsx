import React from 'react';
import './FiltersBar.css';
import Button from '../Button/Button';
import Translations from '../../Translations/Translations';
import { useLanguage } from '../../hooks/useLanguage';

export default function FiltersBar({ columns = [], filters = {}, onFilterChange, translations }) {
    const hasFilters = Object.values(filters).some(value => value !== '');

    const { language } = useLanguage();
    const t = Translations[language];

    const handleClearFilters = () => {
        columns.forEach(col => {
            if (col.filter) {
                onFilterChange(col.accessor, '');
            }
        });
    };

    return (
        <div className="filters-container">
            {columns.map(col => col.filter && (
                <input
                    key={col.accessor}
                    type="text"
                    placeholder={`${translations.filter} ${col.label}`}
                    value={filters[col.accessor] || ''}
                    onChange={e => onFilterChange(col.accessor, e.target.value)}
                    className="filter-input"
                />
            ))}

            {hasFilters && (
                <Button
                    variant="outline"
                    size="sm"
                    title={t.clearFilters}
                    onClick={handleClearFilters}
                >
                    {t.clearFilters}
                </Button>
            )}
        </div>
    );
}