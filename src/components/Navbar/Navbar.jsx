// src/components/Navbar/Navbar.jsx
import { Link } from 'react-router-dom';
import './Navbar.css';
import { useState } from 'react';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <button
        className="navbar__toggle"
        aria-controls="navbar-menu"
        aria-expanded={menuOpen}
        onClick={toggleMenu}
        aria-label="Toggle navigation menu"
      >
        ☰
      </button>
      <ul id="navbar-menu" className={`navbar__links ${menuOpen ? 'open' : ''}`}>
        <li><Link to="/" title="Ir a la página de inicio">Inicio</Link></li>
        <li><Link to="/products" title="Productos">Productos</Link></li>
        <li><Link to="/categories" title="Categorías">Categorías</Link></li>
      </ul>
    </nav>
  );
}