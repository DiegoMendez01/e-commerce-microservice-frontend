import React from 'react';
import { Link } from 'react-router-dom';
import './Breadcrumb.css';

export default function Breadcrumb({ paths }) {
  return (
    <nav className="breadcrumb">
      {paths.map((path, index) => (
        <span key={index}>
          {path.to ? (
            <Link to={path.to}>{path.label}</Link>
          ) : (
            <span className="current">{path.label}</span>
          )}
          {index < paths.length - 1 && <span className="separator">/</span>}
        </span>
      ))}
    </nav>
  );
}