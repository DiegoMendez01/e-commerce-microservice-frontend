import { Link } from 'react-router-dom';
import './Navbar.css';
import { useState } from 'react';
import logo from '/src/assets/comercio-electronico.svg';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header>
      <nav className="navbar" role="navigation" aria-label="Main navigation">
        <Link to="/" className="navbar__logo" title="Ir a la página principal">
          <img src={logo} alt="Logo E-commerce" style={{ height: '30px' }} />
        </Link>
        <button
          className="navbar__toggle"
          aria-controls="navbar-menu"
          aria-expanded={menuOpen}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          ☰
        </button>
        <ul
          id="navbar-menu"
          className={`navbar__links ${menuOpen ? 'open' : ''}`}
        >
          <li><Link to="/" title="Ir a la página de inicio">Inicio</Link></li>
        </ul>
      </nav>
    </header>
  );
}