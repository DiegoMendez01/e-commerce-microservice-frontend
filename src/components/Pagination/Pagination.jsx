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
    const maxVisible = 3;

    const addPageButton = (page) => {
      pages.push(
        <button
          key={page}
          onClick={() => handlePageClick(page)}
          className={`pagination__button ${currentPage === page ? 'active' : ''}`}
          aria-current={currentPage === page ? 'page' : undefined}
        >
          {page}
        </button>
      );
    };

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        addPageButton(i);
      }
    } else {
      if (currentPage <= 2) {
        for (let i = 1; i <= 3; i++) {
          addPageButton(i);
        }
        pages.push(<span key="dots-end" className="pagination__dots" aria-hidden="true">...</span>);
      } else if (currentPage >= totalPages - 1) {
        pages.push(<span key="dots-start" className="pagination__dots" aria-hidden="true">...</span>);
        for (let i = totalPages - 2; i <= totalPages; i++) {
          addPageButton(i);
        }
      } else {
        pages.push(<span key="dots-start" className="pagination__dots" aria-hidden="true">...</span>);
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          addPageButton(i);
        }
        pages.push(<span key="dots-end" className="pagination__dots" aria-hidden="true">...</span>);
      }
    }

    return pages;
  };

  return (
    <div className="pagination">
      {currentPage > 1 && (
        <>
          <button
            onClick={() => handlePageClick(1)}
            className="pagination__button"
            aria-label="Primera página"
          >
            Primero
          </button>
          <span className="pagination__separator" aria-hidden="true">|</span>

          <button
            onClick={() => handlePageClick(currentPage - 1)}
            className="pagination__button"
            aria-label="Página anterior"
          >
            Ant.
          </button>
        </>
      )}

      {renderPageNumbers()}

      {currentPage < totalPages && (
        <>
          <button
            onClick={() => handlePageClick(currentPage + 1)}
            className="pagination__button"
            aria-label="Página siguiente"
          >
            Sig.
          </button>
          <span className="pagination__separator" aria-hidden="true">|</span>
          <button
            onClick={() => handlePageClick(totalPages)}
            className="pagination__button"
            aria-label="Última página"
          >
            Último
          </button>
        </>
      )}
    </div>
  );
}