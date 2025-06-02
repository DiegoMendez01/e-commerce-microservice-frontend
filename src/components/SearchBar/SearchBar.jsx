import { useState } from 'react';
import './SearchBar.css';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  return (
    <form className="searchbar" onSubmit={handleSubmit}>
      <div className="searchbar__input-wrapper">
        <input
          type="text"
          placeholder="Buscar..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Buscar"
        />
        <button type="submit" aria-label="Buscar" className="searchbar__button">
          <i className="fas fa-search"></i>
        </button>
      </div>
    </form>
  );
}