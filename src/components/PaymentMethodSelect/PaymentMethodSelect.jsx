import React from "react";
import { useLanguage } from "../../hooks/useLanguage";
import Translations from "../../Translations/Translations";
import { PaymentMethods } from "../../constants/paymentMethod";

export default function PaymentMethodSelect({ value, onChange }) {
  const { language } = useLanguage();
  const t = Translations[language];

  return (
    <select value={value} onChange={onChange}>
      {Object.entries(PaymentMethods).map(([key, method]) => (
        <option key={key} value={method}>
          {t.paymentOptions[method]}
        </option>
      ))}
    </select>
  );
}