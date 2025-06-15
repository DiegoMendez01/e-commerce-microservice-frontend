import React, { useState, useEffect } from 'react';
import './GenericForm.css';

export default function GenericForm({
    title,
    fields,
    initialData = {},
    onSubmit,
    submitLabel = 'Guardar'
}) {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const defaults = {};
        fields.forEach(field => {
            defaults[field.name] = initialData[field.name] ?? field.defaultValue ?? '';
        });
        setFormData(defaults);
    }, [fields, initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="generic-form-wrapper">
            {title && <h2>{title}</h2>}
            <form className="generic-form" onSubmit={handleSubmit}>
                {fields.map(field => (
                    <div className="form-group" key={field.name}>
                        <label htmlFor={field.name}>{field.label}</label>

                        {field.type === 'textarea' ? (
                            <textarea
                                id={field.name}
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                placeholder={field.placeholder}
                                required={field.required}
                            />
                        ) : field.type === 'select' ? (
                            <select
                                id={field.name}
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                                required={field.required}
                            >
                                <option value="">-- Seleccionar --</option>
                                {field.options.map(opt => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type={field.type}
                                id={field.name}
                                name={field.name}
                                value={formData[field.name] ?? ''}
                                onChange={handleChange}
                                placeholder={field.placeholder}
                                required={field.required}
                            />
                        )}
                    </div>
                ))}

                <button type="submit" className="btn btn--primary">
                    {submitLabel}
                </button>
            </form>
        </div>
    );
}