import './Navbar.css';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import Translations from '../../Translations/Translations';
import NavbarItem from '../NavbarItem/NavbarItem';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { language } = useLanguage();
  const t = Translations[language];
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const navbarRef = useRef(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navbarRef.current && !navbarRef.current.contains(e.target)) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = () => {
    setMenuOpen(false);          // Cierra el menú hamburguesa
    setOpenDropdownId(null);     // Cierra cualquier dropdown abierto
  };

  const items = [
    { label: t.goInicio, title: t.goHome, to: '/' },
    {
      label: t.products,
      title: t.goProducts,
      children: [
        { label: 'Producto 1', title: 'Ver Producto 1', to: '/products/1' },
        { label: 'Producto 2', title: 'Ver Producto 2', to: '/products/2' },
      ],
    },
    {
      label: t.categories,
      title: t.goCategories,
      to: '/categories',
      children: [
        { label: 'Categoría A', title: 'Ver Categoría A', to: '/categories/a' },
        { label: 'Categoría B', title: 'Ver Categoría B', to: '/categories/b' },
      ],
    },
  ];

  return (
    <nav ref={navbarRef} className="navbar" role="navigation" aria-label="Main navigation">
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
        {items.map((item, index) => (
          <NavbarItem
            key={index}
            {...item}
            id={index}
            openDropdownId={openDropdownId}
            setOpenDropdownId={setOpenDropdownId}
            onItemClick={handleItemClick} //
          />
        ))}
      </ul>
    </nav>
  );
}