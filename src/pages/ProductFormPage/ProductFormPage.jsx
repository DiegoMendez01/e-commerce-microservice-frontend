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

export default function ProductFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { language } = useLanguage();
    const t = Translations[language];

    const [initialData, setInitialData] = useState({});
    const [categories, setCategories] = useState([]);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        if (id) {
            fetchProductById(id).then(setInitialData);
        }

        fetchCategories()
            .then(setCategories)
            .catch((error) => console.error('Error loading categories:', error));
    }, [id]);

    const entityName = t.product || 'Product';

    const handleSubmit = async (formData) => {
        try {
            if (id) {
                await updateProduct(id, formData);
                setToast({
                    message: t.updatedSuccessfully.replace('%s', entityName),
                    type: 'success'
                });
            } else {
                await createProduct(formData);
                setToast({
                    message: t.createdSuccessfully.replace('%s', entityName),
                    type: 'success'
                });
            }

            setTimeout(() => {
                navigate('/products', {
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