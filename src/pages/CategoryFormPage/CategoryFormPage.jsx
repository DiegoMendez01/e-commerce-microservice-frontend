import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GenericForm from '../../components/GenericForm/GenericForm';
import {
  fetchCategoryById,
  createCategory,
  updateCategory
} from '../../api/Category/apiCategory';
import { useLanguage } from '../../hooks/useLanguage';
import Translations from '../../Translations/Translations';

export default function CategoryFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = Translations[language];

  const [initialData, setInitialData] = useState({});

  useEffect(() => {
    if (id) {
      fetchCategoryById(id).then(setInitialData);
    }
  }, [id]);

  const handleSubmit = async (formData) => {
    if (id) {
      await updateCategory(id, formData);
    } else {
      await createCategory(formData);
    }
    navigate('/categories');
  };

  const fields = [
    {
      name: 'name',
      label: t.name,
      type: 'text',
      placeholder: t.enterName,
      required: true
    },
    {
      name: 'description',
      label: t.description,
      type: 'textarea',
      placeholder: t.enterDescription
    }
  ];

  return (
    <GenericForm
      title={id ? t.editCategory : t.createCategory}
      fields={fields}
      initialData={initialData}
      onSubmit={handleSubmit}
      submitLabel={id ? t.saveChanges : t.create}
    />
  );
}