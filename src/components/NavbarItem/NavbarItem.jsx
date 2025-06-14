import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './NavbarItem.css';

export default function NavbarItem({
  label,
  title,
  to,
  children,
  id,
  openDropdownId,
  setOpenDropdownId,
  onItemClick
}) {
  const hasChildren = Array.isArray(children) && children.length > 0;
  const isLink = Boolean(to);
  const isOpen = openDropdownId === id;

  const toggleDropdown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!hasChildren) return;
    setOpenDropdownId(isOpen ? null : id);
  };

  const handleClick = () => {
    if (onItemClick) onItemClick();
  };

  return (
    <li className={`navbar__item ${hasChildren ? 'has-children' : ''} ${isOpen ? 'open' : ''}`}>
      <div className="navbar__link-wrapper">
        {isLink && (
          <Link to={to} title={title} className="navbar__link" onClick={handleClick}>
            {label}
          </Link>
        )}

        {!isLink && (
          <span className="navbar__link no__link" title={title}>
            {label}
          </span>
        )}

        {hasChildren && (
          <button
            className="navbar__arrow"
            onClick={toggleDropdown}
            aria-label="Toggle submenu"
          >
            ▾
          </button>
        )}
      </div>

      {hasChildren && isOpen && (
        <ul className="navbar__submenu">
          {children.map((child, index) => (
            <NavbarItem
              key={index}
              {...child}
              id={`${id}-${index}`}
              openDropdownId={openDropdownId}
              setOpenDropdownId={setOpenDropdownId}
              onItemClick={onItemClick}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

NavbarItem.propTypes = {
  label: PropTypes.string.isRequired,
  title: PropTypes.string,
  to: PropTypes.string,
  children: PropTypes.array,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  openDropdownId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setOpenDropdownId: PropTypes.func.isRequired,
};