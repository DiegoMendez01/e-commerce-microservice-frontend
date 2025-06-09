import React from 'react';
import './Card.css';
import useDarkMode from '../../hooks/useDarkMode';
import lightIcon from '../../assets/comercio-electronico-negro.svg';
import darkIcon from '../../assets/comercio-electronico.svg';

export default function Card({ 
  title, 
  subtitle, 
  image, 
  content, 
  footer 
}) {
  const isDark = useDarkMode();
  const defaultIcon = isDark ? darkIcon : lightIcon;

  return (
    <div className="card">
      <img 
        src={image || defaultIcon} 
        alt={title} 
        className="card-image" 
      />
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        {subtitle && <h4 className="card-subtitle">{subtitle}</h4>}
        <div className="card-body">
          {content}
        </div>
        {footer && <div className="card-footer">{footer}</div>}
      </div>
    </div>
  );
}