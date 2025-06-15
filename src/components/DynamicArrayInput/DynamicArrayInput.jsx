import React from 'react';
import './DynamicArrayInput.css';

export default function DynamicArrayInput({ fieldName, items = [], itemFields = [], onChange }) {

  const handleChange = (index, name, value) => {
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      [name]: value,
    };
    onChange(fieldName, updated);
  };

  const handleAddItem = () => {
    const newItem = itemFields.reduce((acc, field) => {
      acc[field.name] = field.defaultValue || '';
      return acc;
    }, {});
    onChange(fieldName, [...items, newItem]);
  };

  const handleRemoveItem = (index) => {
    const updated = items.filter((_, i) => i !== index);
    onChange(fieldName, updated);
  };

  return (
    <div className="dynamic-array-input">
      <label className="array-title">{fieldName}</label>
      {items.map((item, index) => (
        <div className="array-item" key={index}>
          {itemFields.map(field => (
            <div className="array-item-field" key={field.name}>
              <label>{field.label || field.name}</label>
              <input
                type={field.type || 'text'}
                name={field.name}
                value={item[field.name] || ''}
                onChange={(e) => handleChange(index, field.name, e.target.value)}
              />
            </div>
          ))}
          <button type="button" onClick={() => handleRemoveItem(index)}>Eliminar</button>
        </div>
      ))}
      <button type="button" onClick={handleAddItem}>Agregar</button>
    </div>
  );
}