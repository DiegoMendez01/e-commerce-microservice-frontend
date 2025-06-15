import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GenericForm from '../../components/GenericForm/GenericForm';
import {
    fetchProductById,
    createProduct,
    updateProduct
} from '../../api/Product/apiProduct';
import { useLanguage } from '../../hooks/useLanguage';
import { fetchCategories } from '../../api/Category/apiCategory';
import Translations from '../../Translations/Translations';
import Toast from '../../components/Toast/Toast';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { useHttp } from '../../hooks/useHttp';
import Spinner from '../../components/Spinner/Spinner';

export default function ProductFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { language } = useLanguage();
    const t = Translations[language];

    const { request, loading, error } = useHttp();

    const [initialData, setInitialData] = useState({});
    const [categories, setCategories] = useState([]);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (id) {
            fetchProductById(id, request).then(setInitialData);
        }

        fetchCategories(request)
            .then(setCategories)
            .catch((error) => console.error('Error loading products:', error));
    }, [id, request]);

    const entityName = t.product || 'Product';
    const gender = t.productGender || 'o';

    const getGenderedVerb = (baseVerb) => `${baseVerb}${gender}`;

    const getMessage = (template, verb) =>
        template.replace('%s', entityName).replace('%v', verb);

    const handleSubmit = async (formData) => {
        try {
            let verb, message;
            if (id) {
                await updateProduct(id, formData, request);
                verb = getGenderedVerb('actualizad');
                message = getMessage(t.updatedSuccessfully, verb);
            } else {
                await createProduct(formData, request);
                verb = getGenderedVerb('cread');
                message = getMessage(t.createdSuccessfully, verb);
            }

            setToast({ message, type: 'success' });

            setTimeout(() => {
                navigate('/products', {
                    state: { toast: { message, type: 'success' } }
                });
            }, 1000);

        } catch (error) {
            console.error('Error al guardar el producto:', error);
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
        },
        {
            name: 'price',
            label: t.price,
            type: 'number',
            step: '0.01',
            placeholder: t.enterPrice
        },
        {
            name: 'availableQuantity',
            label: t.availableQuantity,
            type: 'number',
            step: '1',
            placeholder: t.enterAvailableQuantity
        },
        {
            name: 'categoryId',
            label: t.category,
            type: 'select',
            options: categories.map(cat => ({
                value: cat.id,
                label: cat.name
            })),
            required: true
        }
    ];

    return (
        <>
            <Breadcrumb
                paths={[
                    { label: t.home, to: '/' },
                    { label: t.products, to: '/products' },
                    { label: t.formProduct }
                ]}
            />
            {loading && <Spinner />}

            {!loading && error && (
                <div className="error-message">
                    {t.errorLoadingProducts || 'Error loading products'}
                </div>
            )}

            {!loading && !error && (
                <GenericForm
                    title={id ? t.editProduct : t.createProduct}
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