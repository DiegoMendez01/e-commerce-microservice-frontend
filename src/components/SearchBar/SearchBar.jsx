import { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import Translations from '../../Translations/Translations';
import './SearchBar.css';

export default function SearchBar({ onSearch }) {
  const { language } = useLanguage();
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  const t = Translations[language]

  return (
    <form className="searchbar" onSubmit={handleSubmit}>
      <div className="searchbar__input-wrapper">
        <input
          type="text"
          placeholder={t.searchPlaceholder || "Buscar..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label={t.searchPlaceholder || "Buscar"}
        />
        <button type="submit" aria-label={t.searchButtonLabel || "Buscar"} className="searchbar__button">
          <i className="fas fa-search"></i>
        </button>
      </div>
    </form>
  );
}