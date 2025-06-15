import './Navbar.css';
import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import Translations from '../../Translations/Translations';
import NavbarItem from '../NavbarItem/NavbarItem';
import getNavbarItems from '../../data/navbarItems';
import { useCart } from '../../hooks/useCart';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { language } = useLanguage();
  const t = Translations[language];
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const { cart } = useCart();
  const totalItems = cart.length;

  const navbarRef = useRef(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const isClickInsideOpenItem = e.target.closest('.navbar__item.open');

      if (!isClickInsideOpenItem) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = () => {
    setMenuOpen(false);
    setOpenDropdownId(null);
  };

  const items = getNavbarItems(t, totalItems);

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
            onItemClick={handleItemClick}
          />
        ))}
      </ul>
    </nav>
  );
}