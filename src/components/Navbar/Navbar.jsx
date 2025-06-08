import { Link } from 'react-router-dom';
import './Navbar.css';
import { useState } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import Translations from '../../Translations/Translations';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { language } = useLanguage();
  const t = Translations[language];

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <button
        className="navbar__toggle"
        aria-controls="navbar-menu"
        aria-expanded={menuOpen}
        onClick={toggleMenu}
        aria-label={t.toggleMenu}
      >
        ☰
      </button>
      <ul id="navbar-menu" className={`navbar__links ${menuOpen ? 'open' : ''}`}>
        <li><Link to="/" title={t.goHome}>{t.goInicio}</Link></li>
        <li><Link to="/products" title={t.goProducts}>{t.products}</Link></li>
        <li><Link to="/categories" title={t.goCategories}>{t.categories}</Link></li>
      </ul>
    </nav>
  );
}