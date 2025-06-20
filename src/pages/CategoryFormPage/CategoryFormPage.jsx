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
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { useHttp } from '../../hooks/useHttp';
import Spinner from '../../components/Spinner/Spinner';

export default function CategoryFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { language } = useLanguage();
    const t = Translations[language];

    const { request, loading, error } = useHttp();

    const [initialData, setInitialData] = useState({});
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (id) {
            fetchCategoryById(id, request).then(setInitialData);
        }
    }, [id, request]);

    const entityName = t.category || 'Category';
    const gender = t.categoryGender || 'a';

    const getGenderedVerb = (baseVerb) => `${baseVerb}${gender}`;

    const getMessage = (template, verb) =>
        template.replace('%s', entityName).replace('%v', verb);

    const handleSubmit = async (formData) => {
        try {
            let verb, message;
            if (id) {
                await updateCategory(id, formData, request);
                verb = getGenderedVerb('actualizad');
                message = getMessage(t.updatedSuccessfully, verb);
            } else {
                await createCategory(formData, request);
                verb = getGenderedVerb('cread');
                message = getMessage(t.createdSuccessfully, verb);
            }

            setToast({ message, type: 'success' });

            setTimeout(() => {
                navigate('/categories', {
                    state: { toast: { message, type: 'success' } }
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
            <Breadcrumb
                paths={[
                    { label: t.home, to: '/' },
                    { label: t.categories, to: '/categories' },
                    { label: t.formCategory }
                ]}
            />
            {loading && <Spinner />}

            {!loading && error && (
                <div className="error-message">
                    {t.errorLoadingCategories || 'Error loading categories'}
                </div>
            )}

            {!loading && !error && (
                <GenericForm
                    title={id ? t.editCategory : t.createCategory}
                    fields={fields}
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    submitLabel={id ? t.saveChanges : t.create}
                />
            )}
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