import React from 'react';
import Card from '../Card/Card';
import { useLanguage } from '../../hooks/useLanguage';
import Translations from '../../Translations/Translations';

export default function ProductCard({ product }) {
  const { name, price, availableQuantity, description, categoryName } = product;
  const { language } = useLanguage();
  const t = Translations[language];

  return (
    <Card
      title={name}
      subtitle={`${t.categoryLabel} ${categoryName}`}
      content={
        <>
          <p className="card-body">{description}</p>
          <p className="card-body"><strong>{t.priceLabel}</strong> ${price.toFixed(2)}</p>
          <p className={`card-body ${availableQuantity > 0 ? 'in-stock' : 'out-stock'}`}>
            {availableQuantity > 0 ? `${t.quantityLabel} ${availableQuantity}` : t.outOfStock}
          </p>
        </>
      }
      footer={
        <button className="button" disabled={availableQuantity === 0}>
          {t.buyButton}
        </button>
      }
    />
  );
}