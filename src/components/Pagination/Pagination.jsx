import React from 'react';
import './Pagination.css';

export default function Pagination({ totalItems, itemsPerPage, currentPage, onPageChange }) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          className={`pagination__button ${currentPage === i ? 'active' : ''}`}
          aria-current={currentPage === i ? 'page' : undefined}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="pagination">
      {currentPage > 1 && (
        <button
          onClick={() => handlePageClick(1)}
          className="pagination__button"
          aria-label="Primera página"
        >
          &#171;
        </button>
      )}

      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        className="pagination__button"
        aria-label="Página anterior"
      >
        &lsaquo;
      </button>

      {renderPageNumbers()}

      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="pagination__button"
        aria-label="Página siguiente"
      >
        &rsaquo;
      </button>

      {currentPage < totalPages && (
        <button
          onClick={() => handlePageClick(totalPages)}
          className="pagination__button"
          aria-label="Última página"
        >
          &#187;
        </button>
      )}
    </div>
  );
}