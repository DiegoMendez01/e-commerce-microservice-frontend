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
import Toast from '../../components/Toast/Toast';

export default function CategoryFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { language } = useLanguage();
    const t = Translations[language];

    const [initialData, setInitialData] = useState({});
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (id) {
            fetchCategoryById(id).then(setInitialData);
        }
    }, [id]);

    const entityName = t.category || 'Category';

    const handleSubmit = async (formData) => {
        try {
            if (id) {
                await updateCategory(id, formData);
                setToast({
                    message: t.updatedSuccessfully.replace('%s', entityName),
                    type: 'success'
                });
            } else {
                await createCategory(formData);
                setToast({
                    message: t.createdSuccessfully.replace('%s', entityName),
                    type: 'success'
                });
            }

            setTimeout(() => {
                navigate('/categories', {
                    state: {
                        toast: {
                            message: t.createdSuccessfully.replace('%s', entityName),
                            type: 'success'
                        }
                    }
                });
            }, 1000);

        } catch (error) {
            console.error('Error al guardar la categoría:', error);
            setToast({
                message: t.errorSavingItem.replace('%s', entityName.toLowerCase()),
                type: 'error'
            });
        }
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
        <>
            <GenericForm
                title={id ? t.editCategory : t.createCategory}
                fields={fields}
                initialData={initialData}
                onSubmit={handleSubmit}
                submitLabel={id ? t.saveChanges : t.create}
            />
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </>
    );
}