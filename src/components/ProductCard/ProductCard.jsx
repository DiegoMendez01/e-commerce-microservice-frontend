import React, { useState } from 'react';
import Card from '../Card/Card';
import { useLanguage } from '../../hooks/useLanguage';
import Translations from '../../Translations/Translations';
import Button from '../Button/Button';
import { useCart } from '../../hooks/useCart';
import Modal from '../Modal/Modal';

export default function ProductCard({ product }) {
  const { name, price, availableQuantity, description, categoryName } = product;
  const { language } = useLanguage();
  const t = Translations[language];

  const { addToCart } = useCart();
  const [modalOpen, setModalOpen] = useState(false);

  const handleAddToCart = () => {
    const stockExceeded = addToCart(product, 1);
    if (stockExceeded) {
      setModalOpen(true);
    }
  };

  return (
    <>
      <Card
        title={name}
        subtitle={`${t.categoryLabel}: ${categoryName}`}
        content={
          <>
            <p className="card-body">{description}</p>
            <p className="card-body"><strong>{t.priceLabel}:</strong> ${price.toFixed(2)}</p>
            <p className={`card-body ${availableQuantity > 0 ? 'in-stock' : 'out-stock'}`}>
              {availableQuantity > 0 ? `${t.quantityLabel}: ${availableQuantity}` : t.outOfStock}
            </p>
          </>
        }
        footer={
          <Button
            variant="outline"
            disabled={availableQuantity === 0}
            title={t.buyButton}
            onClick={handleAddToCart}
          >
            {t.buyButton}
          </Button>
        }
      />
      <Modal
        isOpen={modalOpen}
        title={t.stockExceededTitle}
        icon="fa-exclamation-triangle"
        cancelText={t.closeButton || 'Cerrar'}
        onClose={() => setModalOpen(false)}
      >
        {t.stockExceededMessage}
      </Modal>
    </>
  );
}